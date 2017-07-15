import expect from 'expect';
import '../matchers';
import TextFormatter from '../../src/formatter/text_formatter';
import song from '../fixtures/song';

describe('TextFormatter', () => {
  it('formats a song to a text chord sheet correctly', () => {
    const formatter = new TextFormatter();

    const expectedChordSheet = `
LET IT BE
ChordSheetJS example version

Chorus

       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be
`.substring(1);

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });
});
