import { Injectable } from '@nestjs/common';

/**
 * Retains every successful transcript, in the guest's own words. It is what
 * tells whether a wrong order was misheard (bad transcript) or mismatched
 * (good transcript, wrong resolution) — see ADR-0004 / #45.
 */
@Injectable()
export class TranscriptLog {
  // ponytail: in-memory, same mock-first shape as OrdersService. Swap for a
  // repository call when a database lands.
  private readonly transcripts: string[] = [];

  record(transcript: string): void {
    this.transcripts.push(transcript);
  }
}
