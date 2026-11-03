/**
 * Map of standard file extensions to their official RFC MIME types.
 */
const EXTENSION_MIME_MAP: Record<string, string> = {
  // Documents
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  odt: 'application/vnd.oasis.opendocument.text',
  rtf: 'application/rtf',
  txt: 'text/plain',
  pages: 'application/x-iwork-pages-sffpages',

  // Spreadsheets
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',

  // Presentations
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odp: 'application/vnd.oasis.opendocument.presentation',

  // Images
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  ico: 'image/x-icon',

  // Audio
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  aac: 'audio/aac',
  flac: 'audio/flac',

  // Video
  mp4: 'video/mp4',
  mpeg: 'video/mpeg',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  webm: 'video/webm',

  // Archives & Compressed
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',

  // Web & Data
  html: 'text/html',
  htm: 'text/html',
  xml: 'application/xml',
  json: 'application/json',
  eml: 'message/rfc822',
};

export const DEFAULT_FALLBACK_MIME_TYPE = 'application/octet-stream';

/**
 * Derives the standard RFC MIME type from a given file name, path, or extension.
 *
 * - Extracts extension after the final dot (`.`), removing any trailing whitespace or query parameters.
 * - Handles case insensitivity (e.g., `.PDF` -> `application/pdf`).
 * - Falls back to `application/octet-stream` if unrecognized or missing.
 *
 * @param fileName - File name or path (e.g. "Transcript.pdf" or "contacts/123/passport.png")
 * @returns {string} Standard MIME type string
 */
export function getMimeType(fileName?: string | null): string {
  if (!fileName || typeof fileName !== 'string') {
    return DEFAULT_FALLBACK_MIME_TYPE;
  }

  // Remove query parameters or fragments if present
  const cleanName = fileName.split('?')[0].split('#')[0].trim();
  const lastDotIndex = cleanName.lastIndexOf('.');

  if (lastDotIndex === -1 || lastDotIndex === cleanName.length - 1) {
    return DEFAULT_FALLBACK_MIME_TYPE;
  }

  const ext = cleanName.slice(lastDotIndex + 1).toLowerCase();
  return EXTENSION_MIME_MAP[ext] ?? DEFAULT_FALLBACK_MIME_TYPE;
}
