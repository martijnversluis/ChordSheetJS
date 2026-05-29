import { ChordProFormatter, ChordProParser } from '../../src';
import { chordLyricsPair, createSongFromAst, tag } from '../util/utilities';
import { chordProSheetSolfege, chordProSheetSymbol } from '../fixtures/chord_pro_sheet';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';

describe('ChordProFormatter', () => {
  it('formats a symbol song to a chord pro sheet correctly', () => {
    expect(new ChordProFormatter().format(exampleSongSymbol)).toEqual(chordProSheetSymbol);
  });

  it('formats a solfege song to a chord pro sheet correctly', () => {
    expect(new ChordProFormatter().format(exampleSongSolfege)).toEqual(chordProSheetSolfege);
  });

  it('preserves the user-chosen suffix variant by default', () => {
    const song = createSongFromAst([
      [
        chordLyricsPair('Gsus2', 'one '),
        chordLyricsPair('Csus4', 'two '),
        chordLyricsPair('Cmaj7', 'three '),
        chordLyricsPair('FM7', 'four'),
      ],
    ]);

    expect(new ChordProFormatter().format(song)).toEqual('[Gsus2]one [Csus4]two [Cmaj7]three [FM7]four');
  });

  it('round-trips a ChordPro sheet without altering chord suffixes', () => {
    const chordSheet = '[Cmaj7]Hello [Gsus2]world';
    const song = new ChordProParser().parse(chordSheet);

    expect(new ChordProFormatter().format(song)).toEqual(chordSheet);
  });

  it('normalizes the chord suffix when normalizeChordSuffix is enabled', () => {
    const formatter = new ChordProFormatter({ normalizeChordSuffix: true });

    const song = createSongFromAst([
      [chordLyricsPair('Dsus4', 'Let it be')],
    ]);

    expect(formatter.format(song)).toEqual('[Dsus]Let it be');
  });

  it('normalizes enharmonic roots and bass notes by default', () => {
    const song = createSongFromAst([
      [chordLyricsPair('B#sus4', 'Let it be')],
    ]);

    expect(new ChordProFormatter().format(song)).toEqual('[Csus4]Let it be');
  });

  it('allows disabling chord normalization entirely', () => {
    const formatter = new ChordProFormatter({ normalizeChords: false });

    const song = createSongFromAst([
      [chordLyricsPair('B#sus4', 'Let it be')],
    ]);

    expect(formatter.format(song)).toEqual('[B#sus4]Let it be');
  });

  it('formats image directive with attributes', () => {
    const chordSheet = '{image: src="myimage.png" width="200"}';
    const song = new ChordProParser().parse(chordSheet);
    const formatted = new ChordProFormatter().format(song);

    expect(formatted).toEqual('{image: src="myimage.png" width="200"}');
  });

  it('formats image directive with value', () => {
    const chordSheet = '{image: myimage.png}';
    const song = new ChordProParser().parse(chordSheet);
    const formatted = new ChordProFormatter().format(song);

    expect(formatted).toEqual('{image: myimage.png}');
  });

  it('preserves pango markup in lyrics during round-trip', () => {
    const chordSheet = '[C]Roses are <span color="red">red</span>, [G]<b>bold</b>';
    const song = new ChordProParser().parse(chordSheet);
    const formatted = new ChordProFormatter().format(song);

    expect(formatted).toEqual(chordSheet);
  });

  it('correctly formats non-standard metadata', () => {
    const song = createSongFromAst([
      [tag('title', 'Let it be')],
      [tag('meta', 'composer John Lennon')],
      [tag('meta', 'non_standard value')],
    ]);

    expect(new ChordProFormatter().format(song)).toEqual(
      '{title: Let it be}\n{composer: John Lennon}\n{meta: non_standard value}',
    );
  });
});
