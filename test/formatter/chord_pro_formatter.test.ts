import { ChordProFormatter } from '../../src';
import song from '../fixtures/song';
import chordProSheet from '../fixtures/chord_pro_sheet';

describe('ChordProFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new ChordProFormatter();
    expect(formatter.format(song)).toEqual(chordProSheet);
  });
});
