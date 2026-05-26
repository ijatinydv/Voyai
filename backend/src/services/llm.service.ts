import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { LLMError } from '../utils/AppError.js';

const genai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const RETRY_DELAYS_MS = [1000, 2000, 4000] as const;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4096,
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const startedAt = Date.now();

    try {
      const response = await genai.models.generateContent({
        model: env.LLM_MODEL,
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        config: { maxOutputTokens: maxTokens, temperature: 0.7 },
      });
      const text = response.text ?? '';
      const duration = Date.now() - startedAt;

      console.info({ model: env.LLM_MODEL, duration, attempt, success: Boolean(text.trim()) });

      if (!text.trim()) throw new LLMError('LLM returned an empty response');
      return text;
    } catch (err) {
      lastError = err;
      const duration = Date.now() - startedAt;

      console.error({
        model: env.LLM_MODEL,
        duration,
        attempt,
        success: false,
        error: err instanceof Error ? err.message : 'Unknown LLM error',
      });

      if (attempt < RETRY_DELAYS_MS.length) {
        await wait(RETRY_DELAYS_MS[attempt - 1] ?? 4000);
      }
    }
  }

  throw new LLMError(lastError instanceof Error ? lastError.message : 'LLM request failed');
}

/*
=== FUTURE: Switch to Novita AI ===
Install: pnpm add openai
Update .env: NOVITA_API_KEY, NOVITA_BASE_URL=https://api.novita.ai/v3/openai
Replace this file with:

import OpenAI from 'openai'
const client = new OpenAI({ apiKey: env.NOVITA_API_KEY, baseURL: env.NOVITA_BASE_URL })

export async function generateCompletion(system, user, maxTokens) {
  const res = await client.chat.completions.create({
    model: env.LLM_MODEL,  // e.g. meta-llama/llama-3.3-70b-instruct
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    max_tokens: maxTokens,
  })
  return res.choices[0].message.content ?? ''
}
No other files need to change.
*/
