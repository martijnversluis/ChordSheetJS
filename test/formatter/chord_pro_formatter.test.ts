import { ChordProFormatter, ChordProParser } from '../../src';
import { chordLyricsPair, createSongFromAst } from '../util/utilities';
import { chordProSheetSolfege, chordProSheetSymbol } from '../fixtures/chord_pro_sheet';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';

describe('ChordProFormatter', () => {
  it('formats a symbol song to a chord pro sheet correctly', () => {
    expect(new ChordProFormatter().format(exampleSongSymbol)).toEqual(chordProSheetSymbol);
  });

  it('formats a solfege song to a chord pro sheet correctly', () => {
    expect(new ChordProFormatter().format(exampleSongSolfege)).toEqual(chordProSheetSolfege);
  });

  it('allows enabling chord normalization', () => {
    const formatter = new ChordProFormatter({ normalizeChords: true });

    const song = createSongFromAst([
      [chordLyricsPair('Dsus4', 'Let it be')],
    ]);

    expect(formatter.format(song)).toEqual('[Dsus]Let it be');
  });

  it('allows disabling chord normalization', () => {
    const formatter = new ChordProFormatter({ normalizeChords: false });

    const song = createSongFromAst([
      [chordLyricsPair('Dsus4', 'Let it be')],
    ]);

    expect(formatter.format(song)).toEqual('[Dsus4]Let it be');
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
});
