import ChordProFormatter from '../../src/formatter/chord_pro_formatter';
import ChordProParser from '../../src/parser/chord_pro_parser';

describe('ChordProParser', () => {
  describe('notation: \'german\'', () => {
    const text = '{title:Test}\n[H]Heut[B]ig [G]lied [D/H]wee';

    it('interprets B as B flat throughout the song', () => {
      const song = new ChordProParser().parse(text, { notation: 'german' });

      expect(new ChordProFormatter().format(song)).toContain('[H]Heut[B]ig [G]lied [D/H]wee');
    });

    it('transposing up keeps German notation', () => {
      const song = new ChordProParser().parse(text, { notation: 'german' });

      expect(new ChordProFormatter().format(song.transposeUp())).toContain('[C]Heut[H]ig [G#]lied [D#/C]wee');
    });

    it('default mode still interprets B as B natural', () => {
      const song = new ChordProParser().parse(text);

      expect(new ChordProFormatter().format(song.transposeUp())).toContain('[C]Heut[C]ig');
    });
  });
});
