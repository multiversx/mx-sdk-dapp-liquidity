import { safeImageUrl } from '../safeImageUrl';

describe('safeImageUrl', () => {
  it('passes through a valid https:// URL unchanged', () => {
    const url = 'https://example.com/icon.png';
    expect(safeImageUrl(url)).toBe(url);
  });

  it('rejects an http:// URL and returns the default fallback', () => {
    expect(safeImageUrl('http://example.com/icon.png')).toBe('');
  });

  it('rejects a data: URL', () => {
    expect(safeImageUrl('data:image/png;base64,abc123')).toBe('');
  });

  it('rejects a javascript: URL', () => {
    expect(safeImageUrl('javascript:alert(1)')).toBe('');
  });

  it('rejects a file: URL', () => {
    expect(safeImageUrl('file:///etc/passwd')).toBe('');
  });

  it('rejects a blob: URL', () => {
    expect(safeImageUrl('blob:https://example.com/some-uuid')).toBe('');
  });

  it('rejects an empty string', () => {
    expect(safeImageUrl('')).toBe('');
  });

  it('rejects undefined', () => {
    expect(safeImageUrl(undefined)).toBe('');
  });

  it('rejects a URL longer than 2048 characters', () => {
    const url = 'https://example.com/' + 'a'.repeat(2030);
    expect(url.length).toBeGreaterThan(2048);
    expect(safeImageUrl(url)).toBe('');
  });

  it('allows a URL of exactly 2048 characters', () => {
    const prefix = 'https://example.com/';
    const url = prefix + 'a'.repeat(2048 - prefix.length);
    expect(url.length).toBe(2048);
    expect(safeImageUrl(url)).toBe(url);
  });

  it('returns the custom fallback when URL is invalid', () => {
    const fallback = 'https://cdn.example.com/default.svg';
    expect(safeImageUrl('http://bad.example.com/icon.png', fallback)).toBe(
      fallback
    );
    expect(safeImageUrl(undefined, fallback)).toBe(fallback);
    expect(safeImageUrl('javascript:void(0)', fallback)).toBe(fallback);
  });
});
