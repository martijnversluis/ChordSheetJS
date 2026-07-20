import { ChordLyricsPair } from '../../src';

describe('ChordLyricsPair', () => {
  describe('#clone', () => {
    it('returns a clone of the chord lyrics pair', () => {
      const chordLyricsPair = new ChordLyricsPair('C', 'Let it');
      const clonedChordLyricsPair = chordLyricsPair.clone();

      expect(clonedChordLyricsPair.chords).toEqual('C');
      expect(clonedChordLyricsPair.lyrics).toEqual('Let it');
    });
  });

  describe('#isRenderable', () => {
    it('returns true', () => {
      const chordLyricsPair = new ChordLyricsPair();

      expect(chordLyricsPair.isRenderable()).toBe(true);
    });
  });

  describe('#transpose', () => {
    it('transposes and normalizes the chord', () => {
      const chordLyricsPair = new ChordLyricsPair('F', 'Let it');
      const transposedPair = chordLyricsPair.transpose(1, 'Db');

      expect(transposedPair.chords).toEqual('Gb');
    });

    it('can transpose without key', () => {
      const chordLyricsPair = new ChordLyricsPair('F', 'Let it');
      const transposedPair = chordLyricsPair.transpose(1);

      expect(transposedPair.chords).toEqual('F#');
    });

    it.each(['/', '|', ':||', '(6x)', 'N.C.'])('does not transpose non-chord token %s', (token) => {
      const pair = new ChordLyricsPair(token, '');

      expect(pair.transpose(2).chords).toBe(token);
      expect(pair.chord).toBeNull();
    });
  });

  describe('#hasLyrics', () => {
    it('returns true if there are lyrics', () => {
      const chordLyricsPair = new ChordLyricsPair('C', 'Let it');

      expect(chordLyricsPair.hasLyrics()).toBe(true);
    });

    it('returns false when the lyrics are falsy', () => {
      const chordLyricsPair = new ChordLyricsPair('C', '');

      expect(chordLyricsPair.hasLyrics()).toBe(false);
    });

    it('returns false when the lyrics are only whitespace', () => {
      const chordLyricsPair = new ChordLyricsPair('C', '   ');

      expect(chordLyricsPair.hasLyrics()).toBe(false);
    });
  });

  describe('#set', () => {
    it('reclassifies tokens when chord content changes', () => {
      const instruction = new ChordLyricsPair('(6x)', '');

      expect(instruction.set({ chords: 'D' }).tokenKind).toBe('chord');
    });

    it('preserves token classification when only lyrics change', () => {
      const instruction = new ChordLyricsPair('(6x)', '');

      expect(instruction.setLyrics('repeat').tokenKind).toBe('instruction');
    });

    it('clears an inferred variant when overriding only the token kind', () => {
      const pair = new ChordLyricsPair('/', '', '', null, false, 'instruction');

      expect(pair.tokenVariant).toBeNull();
    });

    it('preserves an explicit null variant when updating a pair', () => {
      const rhythmSymbol = new ChordLyricsPair('/', '');

      expect(rhythmSymbol.set({ tokenVariant: null }).tokenVariant).toBeNull();
    });

    it('rejects incompatible explicit token kinds and variants', () => {
      expect(() => new ChordLyricsPair('C', '', '', null, false, 'chord', 'repeat-count'))
        .toThrow('Invalid chord token variant: repeat-count');
    });
  });
});
