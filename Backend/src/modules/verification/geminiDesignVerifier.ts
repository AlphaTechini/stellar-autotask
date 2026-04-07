import type { AppEnv } from '../../config/env.js';
import {
  createGeminiInlineImagePart,
  getInlineImagePartSizeBytes,
  type GeminiInlineImageInput,
} from './geminiImageParts.js';
import { buildDesignVerificationPrompt } from './buildDesignVerificationPrompt.js';
import {
  designVerificationOutputSchema,
  type DesignVerificationOutput,
  type VerificationExecutionMeta,
} from './verificationResultSchema.js';

type GeminiDesignVerifierInput = {
  task: {
    title: string;
    brief: string;
    targetAudience: string;
    brandGuidelines?: string;
    requiredDeliverables?: string[];
    optionalNotes?: string;
  };
  images: GeminiInlineImageInput[];
};

const designVerificationJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    scoreAdjustment: { type: 'integer', minimum: -30, maximum: 20 },
    visualHierarchy: { type: 'boolean' },
    contrastReadability: { type: 'boolean' },
    brandAlignment: { type: 'boolean' },
    layoutConsistency: { type: 'boolean' },
    accessibilityFit: { type: 'boolean' },
    missingRequirements: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 10,
    },
    recommendation: {
      type: 'string',
      enum: ['approve', 'manual_review', 'reject'],
    },
  },
  required: [
    'summary',
    'scoreAdjustment',
    'visualHierarchy',
    'contrastReadability',
    'brandAlignment',
    'layoutConsistency',
    'accessibilityFit',
    'missingRequirements',
    'recommendation',
  ],
} as const;

async function buildGeminiContents(
  input: GeminiDesignVerifierInput,
  env: AppEnv,
) {
  const imageParts = await Promise.all(
    input.images.map((imageInput) => createGeminiInlineImagePart(imageInput)),
  );
  const totalInlineBytes = imageParts.reduce(
    (totalBytes, imagePart) => totalBytes + getInlineImagePartSizeBytes(imagePart),
    0,
  );

  if (totalInlineBytes > env.GEMINI_IMAGE_MAX_INLINE_BYTES) {
    throw new Error(
      `Inline image payload exceeded ${env.GEMINI_IMAGE_MAX_INLINE_BYTES} bytes. Use smaller images or add File API support for larger design assets.`,
    );
  }

  return [
    {
      role: 'user',
      parts: [
        ...imageParts,
        {
          text: buildDesignVerificationPrompt({
            task: input.task,
          }),
        },
      ],
    },
  ];
}

export async function verifyDesignWithGemini(
  env: AppEnv,
  input: GeminiDesignVerifierInput,
): Promise<
  | {
      kind: 'verified';
      output: DesignVerificationOutput;
      meta: VerificationExecutionMeta;
    }
  | {
      kind: 'failed';
      meta: VerificationExecutionMeta;
    }
> {
  if (!env.GEMINI_API_KEY) {
    return {
      kind: 'failed',
      meta: {
        provider: 'deterministic_only',
        model: null,
        degraded: true,
        reason: 'Gemini API key is not configured.',
      },
    };
  }

  try {
    const response = await fetch(
      `${env.GEMINI_API_URL}/models/${encodeURIComponent(env.GEMINI_DESIGN_MODEL)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: await buildGeminiContents(input, env),
          generationConfig: {
            responseMimeType: 'application/json',
            responseJsonSchema: designVerificationJsonSchema,
          },
        }),
      },
    );

    if (!response.ok) {
      return {
        kind: 'failed',
        meta: {
          provider: 'gemini',
          model: env.GEMINI_DESIGN_MODEL,
          degraded: true,
          reason: `Gemini request failed with status ${response.status}.`,
        },
      };
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
    };

    const responseText = payload.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;

    if (!responseText) {
      return {
        kind: 'failed',
        meta: {
          provider: 'gemini',
          model: env.GEMINI_DESIGN_MODEL,
          degraded: true,
          reason: 'Gemini returned an empty response.',
        },
      };
    }

    const parsedOutput = designVerificationOutputSchema.parse(JSON.parse(responseText));

    return {
      kind: 'verified',
      output: parsedOutput,
      meta: {
        provider: 'gemini',
        model: env.GEMINI_DESIGN_MODEL,
        degraded: false,
        reason: null,
      },
    };
  } catch (error) {
    return {
      kind: 'failed',
      meta: {
        provider: 'gemini',
        model: env.GEMINI_DESIGN_MODEL,
        degraded: true,
        reason: error instanceof Error ? error.message : 'Gemini verification failed.',
      },
    };
  }
}

