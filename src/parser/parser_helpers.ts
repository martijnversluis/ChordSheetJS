const WIDE_RANGES: [number, number][] = [
  [0x1100, 0x11FF], // Hangul Jamo
  [0x2E80, 0x9FFF], // CJK Radicals through CJK Unified Ideographs
  [0x3000, 0x303F], // CJK Symbols and Punctuation
  [0x3040, 0x309F], // Hiragana
  [0x30A0, 0x30FF], // Katakana
  [0xAC00, 0xD7AF], // Hangul Syllables
  [0xF900, 0xFAFF], // CJK Compatibility Ideographs
  [0xFE30, 0xFE4F], // CJK Compatibility Forms
  [0xFF01, 0xFFEF], // Fullwidth Forms
  [0x20000, 0x2FA1F], // CJK Extension B+
];

export function isWideCharacter(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return WIDE_RANGES.some(([lo, hi]) => code >= lo && code <= hi);
}

export function buildVisualColumnMap(lyricsLine: string): number[] {
  const map: number[] = [];
  let visualColumn = 0;

  for (let characterIndex = 0; characterIndex < lyricsLine.length; characterIndex += 1) {
    const characterWidth = isWideCharacter(lyricsLine[characterIndex]) ? 2 : 1;
    for (let column = 0; column < characterWidth; column += 1) {
      map[visualColumn] = characterIndex;
      visualColumn += 1;
    }
  }

  return map;
}

export function chopFirstWord(string: string) {
  const result = /(\s+)(\S+)/.exec(string);
  const secondWordPosition = result ? (result.index + result[1].length) : null;

  if (secondWordPosition && secondWordPosition !== -1) {
    return [
      string.substring(0, secondWordPosition).trim(),
      string.substring(secondWordPosition),
    ];
  }

  return [
    /.+\s+$/.test(string) ? `${string.trim()} ` : string,
    null,
  ];
}
