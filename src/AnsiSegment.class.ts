// Import Internal Dependencies
import type {
  AnsiCode
} from "./extractAnsiFromTextSegment.js";

export class AnsiSegment {
  public codes: AnsiCode[] = [];
  #segment: string;
  #offset: number;

  constructor(
    segmentData: Intl.SegmentData,
    offset = 0
  ) {
    this.#segment = segmentData.segment;
    this.#offset = offset;
  }

  get segment() {
    return this.#segment;
  }

  push(
    ...codes: AnsiCode[]
  ) {
    for (const code of codes) {
      code.offset -= this.#offset;
      this.codes.push(code);
    }

    return this;
  }

  toString() {
    let originalSegment = this.#segment;
    let codeOffset = 0;

    for (const code of this.codes) {
      const offset = codeOffset + code.offset;
      originalSegment =
        originalSegment.slice(0, offset) +
        code.value +
        originalSegment.slice(offset);

      codeOffset += code.value.length;
    }

    return originalSegment;
  }
}
