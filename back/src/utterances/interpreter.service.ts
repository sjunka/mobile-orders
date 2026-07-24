import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

import type { Menu } from '../menu/menu.types';
import type { UtteranceResult } from './utterances.types';

/** Stage 2: resolves a transcript against the menu into references. See ADR-0004. */
export abstract class InterpreterService {
  abstract interpret(transcript: string, menu: Menu): Promise<UtteranceResult>;
}

const RESOLVE_UTTERANCE_TOOL = {
  name: 'resolve_utterance',
  description:
    'Resolve a transcribed guest utterance against the menu into order lines and unresolved phrases.',
  input_schema: {
    type: 'object' as const,
    properties: {
      lines: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            productId: { type: 'string' as const },
            modifierIds: {
              type: 'array' as const,
              items: { type: 'string' as const },
            },
            quantity: { type: 'integer' as const, minimum: 1 },
          },
          required: ['productId', 'modifierIds', 'quantity'],
        },
      },
      unresolved: {
        type: 'array' as const,
        items: { type: 'string' as const },
      },
    },
    required: ['lines', 'unresolved'],
  },
};

const SYSTEM_PROMPT = `You resolve a guest's spoken order against the menu you are given, into the resolve_utterance tool.

Only use product and modifier ids that appear on the menu — never invent one.
A modifier the guest did not name stays out of modifierIds; do not default it in.
If the guest corrects themselves within the utterance ("a large fries, no wait, regular"), their last statement wins.
A phrase that matches no product goes in unresolved, verbatim as the guest said it.`;

// The tool's input_schema only shapes the model's output — it is not a runtime
// guarantee. A malformed tool call must not reach the guest as a 200.
function isOrderLine(
  value: unknown,
): value is UtteranceResult['lines'][number] {
  if (typeof value !== 'object' || value === null) return false;
  const line = value as Record<string, unknown>;

  return (
    typeof line.productId === 'string' &&
    Array.isArray(line.modifierIds) &&
    line.modifierIds.every((id) => typeof id === 'string') &&
    Number.isInteger(line.quantity) &&
    (line.quantity as number) >= 1
  );
}

function isUtteranceResult(value: unknown): value is UtteranceResult {
  if (typeof value !== 'object' || value === null) return false;
  const { lines, unresolved } = value as Record<string, unknown>;

  return (
    Array.isArray(lines) &&
    lines.every(isOrderLine) &&
    Array.isArray(unresolved) &&
    unresolved.every((phrase) => typeof phrase === 'string')
  );
}

@Injectable()
export class ClaudeInterpreterService extends InterpreterService {
  // Lazy for the same reason as OpenAiTranscriptionService: constructing this
  // class must not require an API key.
  private client?: Anthropic;

  async interpret(transcript: string, menu: Menu): Promise<UtteranceResult> {
    this.client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await this.client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Menu:\n${JSON.stringify(menu)}\n\nTranscript:\n${transcript}`,
        },
      ],
      tools: [RESOLVE_UTTERANCE_TOOL],
      tool_choice: { type: 'tool', name: RESOLVE_UTTERANCE_TOOL.name },
    });

    const toolUse = message.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    );
    if (!toolUse || !isUtteranceResult(toolUse.input)) {
      throw new Error('The model did not return a structured result.');
    }

    return toolUse.input;
  }
}
