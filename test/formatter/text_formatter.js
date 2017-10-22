import expect from 'expect';
import '../matchers';
import TextFormatter from '../../src/formatter/text_formatter';
import song from '../fixtures/song';
import songWithIntro from '../fixtures/song_with_intro';

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

  it('omits the lyrics line when it is empty', () => {
    const formatter = new TextFormatter();

    const expectedChordSheet = `
Intro:  C
       Am         C/G        F          C
Let it be, let it be, let it be, let it be
`.substring(1);

    expect(formatter.format(songWithIntro)).toEqual(expectedChordSheet);
  });
});
