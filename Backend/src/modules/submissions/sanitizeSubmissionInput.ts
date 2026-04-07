type SanitizeSubmissionInput = {
  contentText: string;
  notes?: string;
  documentUrl?: string;
};

function normalizeText(value: string) {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

function normalizeOptionalText(value?: string) {
  if (!value) {
    return undefined;
  }

  const normalizedValue = normalizeText(value);
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

function normalizeOptionalUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

export function sanitizeSubmissionInput(input: SanitizeSubmissionInput) {
  return {
    contentText: normalizeText(input.contentText),
    notes: normalizeOptionalText(input.notes),
    documentUrl: normalizeOptionalUrl(input.documentUrl),
  };
}

