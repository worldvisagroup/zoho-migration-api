import { describe, expect, it } from 'vitest';
import { DEFAULT_FALLBACK_MIME_TYPE, getMimeType } from './mime-type.helper.js';

describe('getMimeType', () => {
  it('should resolve standard document MIME types', () => {
    expect(getMimeType('document.pdf')).toBe('application/pdf');
    expect(getMimeType('resume.docx')).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    expect(getMimeType('legacy.doc')).toBe('application/msword');
    expect(getMimeType('notes.txt')).toBe('text/plain');
    expect(getMimeType('data.csv')).toBe('text/csv');
    expect(getMimeType('sheet.xlsx')).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  });

  it('should resolve image MIME types', () => {
    expect(getMimeType('passport.png')).toBe('image/png');
    expect(getMimeType('photo.jpg')).toBe('image/jpeg');
    expect(getMimeType('scan.jpeg')).toBe('image/jpeg');
    expect(getMimeType('avatar.webp')).toBe('image/webp');
  });

  it('should resolve archive and audio/video MIME types', () => {
    expect(getMimeType('archive.zip')).toBe('application/zip');
    expect(getMimeType('audio.mp3')).toBe('audio/mpeg');
    expect(getMimeType('clip.mp4')).toBe('video/mp4');
    expect(getMimeType('recording.m4a')).toBe('audio/mp4');
  });

  it('should handle case insensitivity and paths', () => {
    expect(getMimeType('CONTACTS/123/PASSPORT.PDF')).toBe('application/pdf');
    expect(getMimeType('path/to/file.PNG')).toBe('image/png');
    expect(getMimeType('file.DOCX?version=123')).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });

  it('should return fallback for missing, unknown, or extensionless files', () => {
    expect(getMimeType(null)).toBe(DEFAULT_FALLBACK_MIME_TYPE);
    expect(getMimeType(undefined)).toBe(DEFAULT_FALLBACK_MIME_TYPE);
    expect(getMimeType('')).toBe(DEFAULT_FALLBACK_MIME_TYPE);
    expect(getMimeType('no_extension_file')).toBe(DEFAULT_FALLBACK_MIME_TYPE);
    expect(getMimeType('unknown.xyzabc')).toBe(DEFAULT_FALLBACK_MIME_TYPE);
  });
});
