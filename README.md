# AnsiSegmenter
An extension of [Intl.Segmenter](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) that supports ANSI escape codes – with zero dependencies.

![version](https://img.shields.io/badge/dynamic/json.svg?style=for-the-badge&url=https://raw.githubusercontent.com/TopCli/AnsiSegmenter/main/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/TopCli/AnsiSegmenter/commit-activity)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://github.com/TopCli/AnsiSegmenter/blob/main/LICENSE)
[![scorecard](https://api.securityscorecards.dev/projects/github.com/TopCli/AnsiSegmenter/badge?style=for-the-badge)](https://ossf.github.io/scorecard-visualizer/#/projects/github.com/TopCli/AnsiSegmenter)
![build](https://img.shields.io/github/actions/workflow/status/TopCli/AnsiSegmenter/node.js.yml?style=for-the-badge)

## Requirements
- [Node.js](https://nodejs.org/en/) v22 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @topcli/ansi-segmenter
# or
$ yarn add @topcli/ansi-segmenter
```

## Usage example

```ts
import assert from "node:assert";
import { styleText } from "node:util";

import { AnsiSegmenter } from "@topcli/ansi-segmenter";

const segmenter = new AnsiSegmenter("en-US", {
  granularity: "word"
});

const segments = segmenter.segment(styleText("blue", "oh no!"))
  .map((segment) => segment.toString());

assert.deepEqual(
  segments,
  ["\x1B[34moh", " ", "no", "!\x1B[39m"]
);
```

## API

### AnsiSegmenter

This class behaves the same as [Intl.Segmenter](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter), except the `segment()` method returns an array of `AnsiSegment` objects instead of native segments.

```ts
class AnsiSegmenter {
  public baseSegmenter: Intl.Segmenter;

  constructor(
    locales?: Intl.LocalesArgument,
    options?: Intl.SegmenterOptions
  );

  resolvedOptions(): Intl.ResolvedSegmenterOptions;
  segment(input: string): AnsiSegment[];
}
```

### AnsiSegment

A helper class that can store multiple `AnsiCode` objects and rebuild the original segment with ANSI codes inserted at the correct positions.

```ts
class AnsiSegment {
  public codes: AnsiCode[];

  constructor(segmentData: Intl.SegmentData, offset?: number);

  get segment(): string;

  push(...codes: AnsiCode[]): this;
  toString(): string;
}
```

#### Example

```ts
import { AnsiSegment } from "@topcli/ansi-segmenter";

const ansiSegment = new AnsiSegment({
  segment: "Error",
  index: 0,
  isWordLike: true,
  breakType: "none"
});

ansiSegment.push(
  { offset: 0, value: "\x1b[31m" },
  { offset: 5, value: "\x1b[0m" }
);

console.log(ansiSegment.toString());
// Output: "\x1b[31mError\x1b[0m"
```

### extractAnsiFromTextSegment(input: string): ParsedAnsiSegment

Parses a string containing ANSI escape sequences (e.g., for terminal colors) and returns:

- the plain text with all ANSI codes/sequences removed,
- a list of ANSI codes along with their offsets relative to the cleaned string.

#### Type Definitions

```ts
export type AnsiCode = {
  offset: number;
  value: string;
};

export type ParsedAnsiSegment = {
  textWithoutAnsi: string;
  codes: AnsiCode[];
};
```

#### Example

```ts
import { extractAnsiFromTextSegment } from "@topcli/ansi-segmenter";

const input = "\x1b[31mError\x1b[0m: Something went wrong";

const result = extractAnsiFromTextSegment(input);

console.log(result.textWithoutAnsi);
// Output: "Error: Something went wrong"

console.log(result.codes);
// Output: [
//   { offset: 0, value: "\x1b[31m" },
//   { offset: 5, value: "\x1b[0m" }
// ]
```

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/thomas-gentilhomme/"><img src="https://avatars.githubusercontent.com/u/4438263?v=4?s=100" width="100px;" alt="Gentilhomme"/><br /><sub><b>Gentilhomme</b></sub></a><br /><a href="https://github.com/NodeSecure/scanner/commits?author=fraxken" title="Code">💻</a> <a href="https://github.com/NodeSecure/scanner/commits?author=fraxken" title="Documentation">📖</a> <a href="https://github.com/NodeSecure/scanner/pulls?q=is%3Apr+reviewed-by%3Afraxken" title="Reviewed Pull Requests">👀</a> <a href="#security-fraxken" title="Security">🛡️</a> <a href="https://github.com/NodeSecure/scanner/issues?q=author%3Afraxken" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
