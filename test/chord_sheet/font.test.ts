import Font from '../../src/chord_sheet/font';
import FontSize from '../../src/chord_sheet/font_size';

describe('Font', () => {
  describe('#toCssString', () => {
    it('serializes colour', () => {
      const font = new Font({ colour: 'red' });

      expect(font.toCssString()).toEqual('color: red');
    });

    it('serializes font', () => {
      const font = new Font({ font: '"Times new Roman", serif' });

      expect(font.toCssString()).toEqual('font-family: \'Times new Roman\', serif');
    });

    it('serializes absolute size', () => {
      const font = new Font({ size: new FontSize(30, 'px') });

      expect(font.toCssString()).toEqual('font-size: 30px');
    });

    it('serializes percentual size', () => {
      const font = new Font({ size: new FontSize(30, '%') });

      expect(font.toCssString()).toEqual('font-size: 30%');
    });

    it('serializes font with color', () => {
      const font = new Font({ colour: 'red', font: 'sans-serif', size: new FontSize(30, '%') });

      expect(font.toCssString()).toEqual('color: red; font: 30% sans-serif');
    });
  });
});
