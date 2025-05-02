export type AnsiCode = {
  offset: number;
  value: string;
};

export type ParsedAnsiSegment = {
  textWithoutAnsi: string;
  codes: AnsiCode[];
};

export function extractAnsiFromTextSegment(
  input: string
): ParsedAnsiSegment {
  const ansiPattern = ansiRegex();
  const codes: AnsiCode[] = [];
  let lastIndex = 0;
  let textWithoutAnsi = "";

  for (
    let result: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign
    result = ansiPattern.exec(input);
    result !== null
  ) {
    if (lastIndex < result.index) {
      textWithoutAnsi += input.slice(lastIndex, result.index);
    }

    const ansiCode = result[0];
    lastIndex = result.index + ansiCode.length;

    codes.push({
      offset: textWithoutAnsi.length,
      value: input.slice(result.index, lastIndex)
    });
  }

  if (lastIndex < input.length) {
    textWithoutAnsi += input.slice(lastIndex, input.length);
  }

  return {
    textWithoutAnsi,
    codes
  };
}

/**
 * @note code copy-pasted from https://github.com/chalk/ansi-regex#readme
 */
function ansiRegex() {
  // Valid string terminator sequences are BEL, ESC\, and 0x9c
  const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";
  const pattern = [
    `[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?${ST})`,
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"
  ].join("|");

  return new RegExp(pattern, "g");
}
