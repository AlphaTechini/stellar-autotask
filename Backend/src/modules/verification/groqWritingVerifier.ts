import type { AppEnv } from '../../config/env.js';
import {
  writingVerificationOutputSchema,
  type VerificationExecutionMeta,
  type WritingVerificationOutput,
} from './verificationResultSchema.js';
import { buildWritingVerificationPrompt } from './buildWritingVerificationPrompt.js';

const GROQ_SYSTEM_PROMPT =
  'You are a strict backend verification service. Return valid JSON only and never include markdown.';

type GroqWritingVerifierInput = {
  task: {
    title: string;
    description: string;
    brief: string;
    requiredKeywords: string[];
    targetAudience: string;
    tone: string;
    minWordCount: number;
  };
  submission: {
    contentText: string;
    notes?: string;
  };
};

function truncateForModel(value: string, maxLength: number) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength)}\n...[truncated]`;
}

export async function verifyWritingWithGroq(
  env: AppEnv,
  input: GroqWritingVerifierInput,
): Promise<
  | {
      kind: 'verified';
      output: WritingVerificationOutput;
      meta: VerificationExecutionMeta;
    }
  | {
      kind: 'failed';
      meta: VerificationExecutionMeta;
    }
> {
  if (!env.GROQ_API_KEY) {
    return {
      kind: 'failed',
      meta: {
        provider: 'deterministic_only',
        model: null,
        degraded: true,
        reason: 'Groq API key is not configured.',
      },
    };
  }

  const response = await fetch(`${env.GROQ_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.GROQ_WRITING_MODEL,
      temperature: 0.2,
      response_format: {
        type: 'json_object',
      },
      messages: [
        {
          role: 'system',
          content: GROQ_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: buildWritingVerificationPrompt({
            task: input.task,
            submission: {
              contentText: truncateForModel(input.submission.contentText, env.GROQ_WRITING_MAX_INPUT_CHARS),
              notes: input.submission.notes
                ? truncateForModel(input.submission.notes, 2_000)
                : undefined,
            },
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    return {
      kind: 'failed',
      meta: {
        provider: 'groq',
        model: env.GROQ_WRITING_MODEL,
        degraded: true,
        reason: `Groq request failed with status ${response.status}.`,
      },
    };
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string | null;
      };
    }>;
  };

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    return {
      kind: 'failed',
      meta: {
        provider: 'groq',
        model: env.GROQ_WRITING_MODEL,
        degraded: true,
        reason: 'Groq returned an empty response.',
      },
    };
  }

  try {
    const parsed = JSON.parse(content);
    const output = writingVerificationOutputSchema.parse(parsed);

    return {
      kind: 'verified',
      output,
      meta: {
        provider: 'groq',
        model: env.GROQ_WRITING_MODEL,
        degraded: false,
        reason: null,
      },
    };
  } catch {
    return {
      kind: 'failed',
      meta: {
        provider: 'groq',
        model: env.GROQ_WRITING_MODEL,
        degraded: true,
        reason: 'Groq returned invalid JSON verification output.',
      },
    };
  }
}

