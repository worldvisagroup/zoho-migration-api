import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { R2Config } from '../../config/app.config.js';

@Injectable()
export class R2StorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string | null = null;
  private readonly publicDomain: string | null = null;
  private readonly expiresIn: number = 3600;

  constructor(private readonly configService: ConfigService) {
    const r2Cfg = this.configService.get<R2Config>('r2');
    const accountId = r2Cfg?.accountId;
    const accessKeyId = r2Cfg?.accessKeyId;
    const secretAccessKey = r2Cfg?.secretAccessKey;

    this.bucketName = r2Cfg?.bucketName ?? null;
    const rawDomain = r2Cfg?.publicDomain?.trim().replace(/\/+$/, '') ?? null;

    // Treat domain as public only if it is NOT the authenticated S3 cloudflarestorage API endpoint
    if (rawDomain && !rawDomain.includes('r2.cloudflarestorage.com')) {
      this.publicDomain = rawDomain;
    } else {
      this.publicDomain = null;
    }

    this.expiresIn = r2Cfg?.expiresIn && r2Cfg.expiresIn > 0 ? r2Cfg.expiresIn : 3600;

    if (accountId && accessKeyId && secretAccessKey && this.bucketName) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log(`Initialized S3Client for Cloudflare R2 bucket: ${this.bucketName}`);
    } else {
      this.logger.warn(
        'R2 credentials or bucket name not fully configured; presigned URL generation disabled, falling back to stored URLs.',
      );
    }
  }

  /**
   * Generates a fresh presigned GET URL with Content-Disposition: attachment for an attachment key,
   * or formats with public domain. If R2 is not configured or an error occurs, falls back to `fallbackUrl`.
   *
   * @param r2Key - Stored object key in R2 (e.g. "contacts/123/attachments/456_file.pdf")
   * @param fallbackUrl - Optional stored legacy/direct download URL from MongoDB
   * @param fileName - Original file name for the downloaded attachment
   * @returns {Promise<string>} Downloadable URL or empty string
   */
  async generateDownloadUrl(
    r2Key?: string | null,
    fallbackUrl?: string | null,
    fileName?: string | null,
  ): Promise<string> {
    const cleanKey = r2Key?.trim();
    if (!cleanKey) {
      return fallbackUrl?.trim() ?? '';
    }

    // 1. If an S3 client is configured, always prefer generating an authenticated presigned URL
    // with ResponseContentDisposition set to attachment so browsers download the file properly.
    if (this.s3Client && this.bucketName) {
      try {
        const safeName = fileName ? fileName.replace(/["\r\n]/g, '').trim() : '';
        const disposition = safeName
          ? `attachment; filename="${safeName}"`
          : 'attachment';

        const command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: cleanKey,
          ResponseContentDisposition: disposition,
        });

        return await getSignedUrl(this.s3Client, command, { expiresIn: this.expiresIn });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Failed to generate presigned URL for key "${cleanKey}": ${errorMsg}`);
        return fallbackUrl?.trim() ?? '';
      }
    }

    // 2. If a dedicated public CDN domain (e.g. pub-xxx.r2.dev or custom cdn domain) is configured
    if (this.publicDomain) {
      return `${this.publicDomain}/${cleanKey}`;
    }

    return fallbackUrl?.trim() ?? '';
  }

  /**
   * Concurrently generates presigned download URLs for a batch of attachment items.
   *
   * @param items - Array of items with r2Key, fallbackUrl, and optional fileName
   * @returns {Promise<string[]>} Array of resolved URLs matching items index
   */
  async generateDownloadUrlsBatch(
    items: Array<{ r2Key?: string | null; fallbackUrl?: string | null; fileName?: string | null }>,
  ): Promise<string[]> {
    return Promise.all(
      items.map(item => this.generateDownloadUrl(item.r2Key, item.fallbackUrl, item.fileName)),
    );
  }
}
