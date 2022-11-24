import FontSize from '../../src/chord_sheet/font_size';

describe('FontSize', () => {
  describe('constructor', () => {
    it('assigns the correct instance variables', () => {
      const fontSize = new FontSize(30, 'px');

      expect(fontSize.fontSize).toEqual(30);
      expect(fontSize.unit).toEqual('px');
    });
  });

  describe('#clone', () => {
    it('returns a deep copy', () => {
      const fontSize = new FontSize(30, 'px');
      const clone = fontSize.clone();

      expect(clone.fontSize).toEqual(30);
      expect(clone.unit).toEqual('px');
    });
  });

  describe('multiply', () => {
    it('multiplies percentages', () => {
      const fontSize = new FontSize(120, '%');
      const multiplied = fontSize.multiply(150);

      expect(multiplied.fontSize).toEqual(180);
      expect(multiplied.unit).toEqual('%');
    });

    it('multiplies pixels', () => {
      const fontSize = new FontSize(20, 'px');
      const multiplied = fontSize.multiply(150);

      expect(multiplied.fontSize).toEqual(30);
      expect(multiplied.unit).toEqual('px');
    });
  });

  describe('#toString', () => {
    it('returns size and unit combined', () => {
      const fontSize = new FontSize(30, 'px');

      expect(fontSize.toString()).toEqual('30px');
    });
  });

  describe('::parse', () => {
    describe('when the number cannot be parsed', () => {
      it('returns the parent when present', () => {
        const parent = new FontSize(20, 'px');
        const parsed = FontSize.parse('foobar', parent);

        expect(parsed.fontSize).toEqual(20);
        expect(parsed.unit).toEqual('px');
      });

      it('returns 100% when there is no parent', () => {
        const parsed = FontSize.parse('foobar', null);

        expect(parsed.fontSize).toEqual(100);
        expect(parsed.unit).toEqual('%');
      });
    });

    describe('when the number is a percentage', () => {
      it('multiplies by the parent size if present', () => {
        const parent = new FontSize(20, 'px');
        const parsed = FontSize.parse('120%', parent);

        expect(parsed.fontSize).toEqual(24);
        expect(parsed.unit).toEqual('px');
      });

      it('creates a percentage size when there is no parent', () => {
        const parsed = FontSize.parse('120%', null);

        expect(parsed.fontSize).toEqual(120);
        expect(parsed.unit).toEqual('%');
      });
    });

    it('returns a pixel size by default', () => {
      const parent = new FontSize(20, 'px');
      const parsed = FontSize.parse('24px', parent);

      expect(parsed.fontSize).toEqual(24);
      expect(parsed.unit).toEqual('px');
    });
  });
});
