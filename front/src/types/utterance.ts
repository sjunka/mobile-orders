/** One product the backend matched in the utterance, references only — see ADR-0004. */
export type UtteranceLine = {
  productId: string
  modifierIds: string[]
  quantity: number
}

/** What POST /utterances returns: matched lines plus phrases nothing matched. */
export type UtteranceResponse = {
  lines: UtteranceLine[]
  unresolved: string[]
}
