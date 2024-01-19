// eslint-disable-next-line import/prefer-default-export
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
