import ChordProFormatter from '../../src/formatter/chord_pro_formatter';
import song from '../fixtures/song';

describe('ChordProFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new ChordProFormatter();

    const expectedChordSheet = `
{title: Let it be}
{subtitle: ChordSheetJS example version}
{x_some_setting}
{comment: Bridge}

{start_of_verse}
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [F]wis[G]dom, let it [F]be [C/E] [Dm] [C] 
{end_of_verse}

{start_of_chorus}
[Am]Whisper words of [Bb]wisdom, let it [F]be [C]
{end_of_chorus}`.substring(1);

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });
});
