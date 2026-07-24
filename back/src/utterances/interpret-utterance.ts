import type { Menu } from '../menu/menu.types';
import type { UtteranceResult } from './utterances.types';

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

function parseQuantity(phrase: string): number {
  const digits = /\d+/.exec(phrase);
  if (digits) return parseInt(digits[0], 10);

  for (const [word, value] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\b`).test(phrase)) return value;
  }
  return 1;
}

function splitPhrases(transcript: string): string[] {
  return transcript
    .split(/,| and /i)
    .map((phrase) => phrase.trim())
    .filter((phrase) => phrase.length > 0);
}

/**
 * STUB for #45: speech-to-text and the model call are not run. The upload's raw
 * bytes are read as the transcript directly, split into comma/"and" separated
 * phrases, and matched against the menu by substring. Real menu lookup, real
 * response shape — only the interpretation itself is fake. #45 swaps the body
 * of this function for the real two-stage pipeline; the route and response
 * shape do not change.
 */
export function interpretUtterance(
  audio: Buffer,
  menu: Menu,
): Promise<UtteranceResult> {
  const phrases = splitPhrases(audio.toString('utf8'));
  const result: UtteranceResult = { lines: [], unresolved: [] };

  for (const phrase of phrases) {
    const lower = phrase.toLowerCase();
    const product = menu.find((candidate) => lower.includes(candidate.id));
    if (!product) {
      result.unresolved.push(phrase);
      continue;
    }

    const modifierIds = product.modifiers
      .filter((modifier) => lower.includes(modifier.label.toLowerCase()))
      .map((modifier) => modifier.id);

    result.lines.push({
      productId: product.id,
      modifierIds,
      quantity: parseQuantity(lower),
    });
  }

  return Promise.resolve(result);
}
