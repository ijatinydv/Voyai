import OpenAI from 'openai';
import { env } from '../config/env.js';
import { LLMError } from '../utils/AppError.js';

const RETRY_DELAYS_MS = [1_000, 2_000, 4_000] as const;

const openai = new OpenAI({
  apiKey: env.NOVITA_API_KEY,
  baseURL: env.NOVITA_BASE_URL,
});

interface CompletionOptions {
  maxTokens?: number;
  temperature?: number;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
  options: number | CompletionOptions = 1800,
): Promise<string> {
  const resolvedOptions: CompletionOptions = typeof options === 'number' ? { maxTokens: options } : options;
  const maxTokens = resolvedOptions.maxTokens ?? 1800;
  const temperature = resolvedOptions.temperature ?? 0.35;
  let lastError: unknown;

  for (let attempt = 1; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const startedAt = Date.now();

    try {
      const response = await openai.chat.completions.create({
        model: env.LLM_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature,
      });

      const text = response.choices[0]?.message?.content ?? '';
      const duration = Date.now() - startedAt;

      console.info({ provider: 'novita', model: env.LLM_MODEL, duration, attempt, success: Boolean(text.trim()) });

      if (!text.trim()) throw new LLMError('LLM returned an empty response');
      return text;
    } catch (err) {
      lastError = err;
      const duration = Date.now() - startedAt;

      console.error({
        provider: 'novita',
        model: env.LLM_MODEL,
        duration,
        attempt,
        success: false,
        error: err instanceof Error ? err.message : 'Unknown LLM error',
      });

      if (attempt < RETRY_DELAYS_MS.length) {
        await wait(RETRY_DELAYS_MS[attempt - 1] ?? 4_000);
      }
    }
  }

  throw new LLMError(lastError instanceof Error ? lastError.message : 'LLM request failed');
}
