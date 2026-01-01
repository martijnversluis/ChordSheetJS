import { ChordProFormatter } from '../../src';
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
});
