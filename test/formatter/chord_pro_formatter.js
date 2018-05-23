import { expect } from 'chai';

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

Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [F]wis[G]dom, let it [F]be [C/E] [Dm] [C] `.substring(1);

    expect(formatter.format(song)).to.equal(expectedChordSheet);
  });
});
