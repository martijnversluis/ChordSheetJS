import { ChordProParser } from '../../src';
import Line from '../../src/chord_sheet/line';
import { heredoc } from '../util/utilities';
import sectionFingerprint from '../../src/song_map/section_fingerprint';

function linesOf(chordpro: string): Line[] {
  return new ChordProParser().parse(chordpro).lines;
}

describe('sectionFingerprint', () => {
  it('ignores the section delimiters', () => {
    const verse = linesOf(heredoc`
      {start_of_verse: Verse 1}
      [G]Hello
      {end_of_verse}`);

    const chorus = linesOf(heredoc`
      {start_of_chorus: Chorus}
      [G]Hello
      {end_of_chorus}`);

    expect(sectionFingerprint(verse)).toEqual(sectionFingerprint(chorus));
  });

  it('distinguishes blocks with different content', () => {
    const chords = linesOf('[G]Hello');
    const lyrics = linesOf('[C]Hello');

    expect(sectionFingerprint(chords)).not.toEqual(sectionFingerprint(lyrics));
  });

  it('ignores blank lines', () => {
    const spaced = linesOf(heredoc`
      [G]Hello

      [C]There`);

    const packed = linesOf(heredoc`
      [G]Hello
      [C]There`);

    expect(sectionFingerprint(spaced)).toEqual(sectionFingerprint(packed));
  });

  it('ignores whitespace at the start and the end of a line', () => {
    const padded = linesOf(' [C]Chorus ');
    const trimmed = linesOf('[C]Chorus');

    expect(sectionFingerprint(padded)).toEqual(sectionFingerprint(trimmed));
  });

  it('keeps whitespace within a line significant', () => {
    const spaced = linesOf('[C]Chorus  here');
    const single = linesOf('[C]Chorus here');

    expect(sectionFingerprint(spaced)).not.toEqual(sectionFingerprint(single));
  });

  it('does not evaluate metadata expressions', () => {
    const expression = linesOf(heredoc`
      {artist: Smith}
      %{artist}`);

    const literal = linesOf(heredoc`
      {artist: Smith}
      Smith`);

    expect(sectionFingerprint(expression)).not.toEqual(sectionFingerprint(literal));
  });

  it('returns null when an item cannot be serialized', () => {
    const line = new Line();
    line.addItem({ unknown: true } as never);

    expect(sectionFingerprint([line])).toBeNull();
  });
});
