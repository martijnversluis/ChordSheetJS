import { expect } from 'chai';

import LatexFormatter from '../../src/formatter/latex_formatter';
import song from '../fixtures/song';

describe('LatexFormatter', () => {
  it('formats a song to a .tex file correctly', () => {
    const formatter = new LatexFormatter();

    const expectedChordSheet = `
\\beginsong{Let it be \\\\ ChordSheetJS example version}[by={}]


\\textcomment{x_some_setting}
\\textcomment{Bridge}

\\beginverse
Let it \\[Am]be, let it \\[C/G]be, let it \\[F]be, let it \\[C]be
\\[C]Whisper words of \\[F]wis\\[G]dom, let it \\[F]be \\[C/E] \\[Dm] \\[C] 
\\endverse

\\beginchorus
\\[Am]Whisper words of \\[Bb]wisdom, let it \\[F]be \\[C]
\\endchorus
\\endsong`.substring(1);

    expect(formatter.format(song)).to.equal(expectedChordSheet);
  });
});
