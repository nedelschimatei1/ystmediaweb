// Small input sanitization helpers to harden server endpoints

export function normalizeEmail(email: string) {
  return (email || '').trim().toLowerCase();
}

export function sanitizeTextForEmail(input: string, maxLength = 5000) {
  if (!input) return '';
  // Remove control characters except common whitespace (tab, newline)
  let s = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/g, '');
  // Trim and limit length
  s = s.trim().slice(0, maxLength);
  return s;
}

export function forbidHeaderInjection(value: string) {
  if (!value) return value;
  if (/\r|\n/.test(value)) {
    throw new Error('Invalid header value');
  }
  return value;
}
