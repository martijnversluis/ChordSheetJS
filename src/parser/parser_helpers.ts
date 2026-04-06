export function isWideCharacter(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return (
    (code >= 0x1100 && code <= 0x11FF)   // Hangul Jamo
    || (code >= 0x2E80 && code <= 0x9FFF)   // CJK Radicals through CJK Unified Ideographs
    || (code >= 0x3000 && code <= 0x303F)   // CJK Symbols and Punctuation
    || (code >= 0x3040 && code <= 0x309F)   // Hiragana
    || (code >= 0x30A0 && code <= 0x30FF)   // Katakana
    || (code >= 0xAC00 && code <= 0xD7AF)   // Hangul Syllables
    || (code >= 0xF900 && code <= 0xFAFF)   // CJK Compatibility Ideographs
    || (code >= 0xFE30 && code <= 0xFE4F)   // CJK Compatibility Forms
    || (code >= 0xFF01 && code <= 0xFFEF)   // Fullwidth Forms
    || (code >= 0x20000 && code <= 0x2FA1F) // CJK Extension B+
  );
}

export function buildVisualColumnMap(lyricsLine: string): number[] {
  const map: number[] = [];
  let visualColumn = 0;

  for (let characterIndex = 0; characterIndex < lyricsLine.length; characterIndex++) {
    const characterWidth = isWideCharacter(lyricsLine[characterIndex]) ? 2 : 1;
    for (let column = 0; column < characterWidth; column++) map[visualColumn++] = characterIndex;
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
