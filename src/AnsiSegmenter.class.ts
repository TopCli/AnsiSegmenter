// Import Internal Dependencies
import {
  extractAnsiFromTextSegment
} from "./extractAnsiFromTextSegment.js";
import { AnsiSegment } from "./AnsiSegment.class.js";

export class AnsiSegmenter {
  public baseSegmenter: Intl.Segmenter;

  constructor(
    locales?: Intl.LocalesArgument,
    options?: Intl.SegmenterOptions
  ) {
    this.baseSegmenter = new Intl.Segmenter(locales, options);
  }

  resolvedOptions(): Intl.ResolvedSegmenterOptions {
    return this.baseSegmenter.resolvedOptions();
  }

  segment(
    input: string
  ): AnsiSegment[] {
    const { textWithoutAnsi, codes } = extractAnsiFromTextSegment(input);

    const segments: (Intl.SegmentData | AnsiSegment)[] = [
      ...this.baseSegmenter.segment(textWithoutAnsi)
    ];

    for (const code of codes) {
      let currentSegmentOffset = 0;

      for (let id = 0; id < segments.length; id++) {
        const segmentData = segments[id];
        currentSegmentOffset += segmentData.segment.length;

        if (code.offset > currentSegmentOffset) {
          continue;
        }

        if (segmentData instanceof AnsiSegment) {
          segmentData.push(code);
        }
        else {
          const offset = currentSegmentOffset - segmentData.segment.length;
          segments[id] = new AnsiSegment(segmentData, offset).push(code);
        }

        break;
      }
    }

    return segments.map(
      (segment) => (segment instanceof AnsiSegment ? segment : new AnsiSegment(segment))
    );
  }
}
