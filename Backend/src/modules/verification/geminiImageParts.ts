import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type GeminiInlineImageInput =
  | {
      kind: 'base64';
      mimeType: string;
      data: string;
    }
  | {
      kind: 'url';
      mimeType?: string;
      url: string;
    }
  | {
      kind: 'file';
      mimeType?: string;
      filePath: string;
    };

type GeminiInlineImagePart = {
  inlineData: {
    mimeType: string;
    data: string;
  };
};

function inferMimeTypeFromExtension(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.heic':
      return 'image/heic';
    case '.heif':
      return 'image/heif';
    default:
      return null;
  }
}

function ensureSupportedMimeType(mimeType: string) {
  if (
    !['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'].includes(mimeType)
  ) {
    throw new Error(`Unsupported image mime type: ${mimeType}.`);
  }

  return mimeType;
}

function normalizeBase64(base64Data: string) {
  return base64Data.replace(/\s+/g, '');
}

export async function createGeminiInlineImagePart(
  input: GeminiInlineImageInput,
): Promise<GeminiInlineImagePart> {
  if (input.kind === 'base64') {
    return {
      inlineData: {
        mimeType: ensureSupportedMimeType(input.mimeType),
        data: normalizeBase64(input.data),
      },
    };
  }

  if (input.kind === 'url') {
    const response = await fetch(input.url);

    if (!response.ok) {
      throw new Error(`Image fetch failed with status ${response.status}.`);
    }

    const mimeType =
      input.mimeType ??
      response.headers.get('content-type')?.split(';', 1)[0]?.trim() ??
      'image/jpeg';
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    return {
      inlineData: {
        mimeType: ensureSupportedMimeType(mimeType),
        data: imageBuffer.toString('base64'),
      },
    };
  }

  const fileBuffer = await readFile(input.filePath);
  const mimeType = input.mimeType ?? inferMimeTypeFromExtension(input.filePath);

  if (!mimeType) {
    throw new Error(`Could not infer image mime type from ${input.filePath}.`);
  }

  return {
    inlineData: {
      mimeType: ensureSupportedMimeType(mimeType),
      data: fileBuffer.toString('base64'),
    },
  };
}

export function getInlineImagePartSizeBytes(part: GeminiInlineImagePart) {
  return Buffer.byteLength(part.inlineData.data, 'base64');
}

