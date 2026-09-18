import { TerminalMeasurer } from '../../../src/layout/measurement/terminal_measurer';

describe('TerminalMeasurer', () => {
  const measurer = new TerminalMeasurer();
  it.each([
    ['abc ', 4], ['', 0], ['界', 2], ['e\u0301', 1], ['👩‍💻', 2], ['♯', 1],
  ])('measures %s in cells', (text, width) => {
    expect(measurer.measureText(text).width).toBe(width);
  });
  it('wraps graphemes, long words and explicit newlines without losing text', () => {
    expect(measurer.splitTextToSize('a abcdef', 3)).toEqual(['a a', 'bcd', 'ef']);
    expect(measurer.splitTextToSize('é👩‍💻界', 2)).toEqual(['é', '👩‍💻', '界']);
    expect(measurer.splitTextToSize('a\r\nb', 3)).toEqual(['a', 'b']);
    expect(measurer.splitTextToSize('', 3)).toEqual([]);
    expect(measurer.splitTextToSize('界', 1)).toEqual(['界']);
  });
  it('rejects invalid widths and terminal controls', () => {
    expect(() => measurer.splitTextToSize('a', 0)).toThrow();
    expect(() => measurer.measureText('\x1b[31m')).toThrow();
  });
  it('accepts a custom cell-width policy', () => {
    expect(new TerminalMeasurer(() => 2).measureText('a').width).toBe(2);
  });
});
