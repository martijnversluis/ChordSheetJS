import expect from 'expect';
import ChordProFormatter from '../../src/formatter/chord_pro_formatter';
import song from '../fixtures/song';

describe('ChordProFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new ChordProFormatter();

    const expectedChordSheet = `
{title: Let it be}
{subtitle: ChordSheetJS example version}
{Chorus}

Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]`.substring(1);

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });
});
