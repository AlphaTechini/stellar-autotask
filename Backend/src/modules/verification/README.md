# Verification Module

I use this folder for provider-backed verification that sits on top of deterministic checks. The backend keeps measurable checks authoritative, then asks Groq for qualitative writing review or Gemini for image-based design review, and falls back safely when a provider is unavailable or returns invalid output.

## Architectural Decisions And Tradeoffs

- I keep deterministic checks outside the provider call so word count and keyword rules stay backend-owned.
- I use Groq through the OpenAI-compatible API with plain `fetch` so I do not add a new SDK dependency just to ship the writing verifier.
- I use Gemini through the REST API with inline image parts for design verification so image review can be added without introducing SDK lock-in before the design task flow exists.
- I validate model output with Zod and degrade gracefully to deterministic-only reporting when Groq output is malformed or unavailable.
- I keep Gemini image handling under the documented inline-size limit and fail clearly when a future design route should switch to the File API instead.

## File Navigation

To find the Groq request implementation visit [groqWritingVerifier.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/verification/groqWritingVerifier.ts).
To find the Gemini design verifier visit [geminiDesignVerifier.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/verification/geminiDesignVerifier.ts).
To find Gemini image part helpers visit [geminiImageParts.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/verification/geminiImageParts.ts).
To find the design prompt builder visit [buildDesignVerificationPrompt.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/verification/buildDesignVerificationPrompt.ts).
To find writing verification orchestration visit [verifyWritingSubmission.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/verification/verifyWritingSubmission.ts).
To find the prompt builder visit [buildWritingVerificationPrompt.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/verification/buildWritingVerificationPrompt.ts).
To find the output validation schema visit [verificationResultSchema.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/verification/verificationResultSchema.ts).

The writing verification entrypoint can be found in [verifyWritingSubmission.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/verification/verifyWritingSubmission.ts).
The Gemini design verification entrypoint can be found in [geminiDesignVerifier.ts](file:///C:/Hackathons/Stellar%201/stellar-autotask/Backend/src/modules/verification/geminiDesignVerifier.ts).
