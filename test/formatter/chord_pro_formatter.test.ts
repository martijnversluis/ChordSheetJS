import { ChordProFormatter } from '../../src';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';
import { chordProSheetSolfege, chordProSheetSymbol } from '../fixtures/chord_pro_sheet';

describe('ChordProFormatter', () => {
  it('formats a symbol song to a html chord sheet correctly', () => {
    expect(new ChordProFormatter().format(exampleSongSymbol)).toEqual(chordProSheetSymbol);
  });

  it('formats a solfege song to a html chord sheet correctly', () => {
    expect(new ChordProFormatter().format(exampleSongSolfege)).toEqual(chordProSheetSolfege);
  });
});
