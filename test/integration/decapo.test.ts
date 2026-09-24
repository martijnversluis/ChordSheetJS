import { heredoc } from '../util/utilities';
import {
  ChordProFormatter, ChordProParser, HtmlDivFormatter, TextFormatter,
} from '../../src';

const chordpro = heredoc`
  {title: Capo example}
  {key: C}
  {capo: 2}

  [C]This is an [Am]example
  [F]With two [G]lines`;

describe('decapo', () => {
  describe('when disabled (default)', () => {
    it('renders the chords as written', () => {
      const song = new ChordProParser().parse(chordpro);

      const expectedChordSheet = heredoc`
        CAPO EXAMPLE

        C          Am
        This is an example
        F        G
        With two lines`;

      expect(new TextFormatter().format(song)).toEqual(expectedChordSheet);
    });

    it('keeps the key and capo metadata', () => {
      const song = new ChordProParser().parse(`${chordpro}\nkey=%{key} actual=%{key_actual} capo=%{capo}`);

      const formatted = new TextFormatter({ evaluate: true }).format(song);

      expect(formatted).toContain('key=C actual=D capo=2');
    });
  });

  describe('when enabled', () => {
    it('transposes the chords up by the capo to eliminate it', () => {
      const song = new ChordProParser().parse(chordpro);

      const expectedChordSheet = heredoc`
        CAPO EXAMPLE

        D          Bm
        This is an example
        G        A
        With two lines`;

      expect(new TextFormatter({ decapo: true }).format(song)).toEqual(expectedChordSheet);
    });

    it('reports the sounding key as the song key and drops the capo in metadata', () => {
      const song = new ChordProParser().parse(`${chordpro}\nkey=%{key} actual=%{key_actual} capo=%{capo}`);

      const formatted = new TextFormatter({ decapo: true, evaluate: true }).format(song);

      expect(formatted).toContain('key=D actual=D capo=');
    });

    it('rewrites the key directive and removes the capo directive', () => {
      const expectedChordPro = heredoc`
        {title: Capo example}
        {key: D}

        [D]This is an [Bm]example
        [G]With two [A]lines`;

      const song = new ChordProParser().parse(chordpro);

      expect(new ChordProFormatter({ decapo: true }).format(song)).toEqual(expectedChordPro);
    });

    it('applies to the HTML formatters', () => {
      const song = new ChordProParser().parse(chordpro);

      const formatted = new HtmlDivFormatter({ decapo: true }).format(song);

      expect(formatted).toContain('<div class="chord">D</div>');
      expect(formatted).toContain('<div class="chord">Bm</div>');
    });

    it('renders in the requested key, measured from the sounding key', () => {
      const song = new ChordProParser().parse(chordpro);

      const expectedChordSheet = heredoc`
        CAPO EXAMPLE

        F          Dm
        This is an example
        Bb       C
        With two lines`;

      expect(new TextFormatter({ decapo: true, key: 'F' }).format(song)).toEqual(expectedChordSheet);
    });

    it('composes with a {transpose} directive', () => {
      const song = new ChordProParser().parse(heredoc`
        {key: C}
        {capo: 2}

        {transpose: 2}
        [C]This is an [G]example`);

      const expectedChordSheet = heredoc`
        E          B
        This is an example`;

      expect(new TextFormatter({ decapo: true }).format(song)).toEqual(expectedChordSheet);
    });

    it('is a no-op when the song has no capo', () => {
      const withoutCapo = new ChordProParser().parse(heredoc`
        {key: C}

        [C]This is an [Am]example`);

      expect(new TextFormatter({ decapo: true }).format(withoutCapo))
        .toEqual(new TextFormatter().format(withoutCapo));
    });

    it('leaves a song with an unparsable key alone instead of failing', () => {
      const brokenKey = new ChordProParser().parse(heredoc`
        {key: Q7x}
        {capo: 2}

        [C]This is an [Am]example`);

      expect(new TextFormatter({ decapo: true }).format(brokenKey))
        .toEqual(new TextFormatter().format(brokenKey));
    });

    it('leaves a song with a later unparsable key alone instead of failing', () => {
      const brokenKey = new ChordProParser().parse(heredoc`
        {key: C}
        {capo: 2}

        [C]This is an [Am]example
        {key: Q7x}
        [F]And another [G]one`);

      expect(new TextFormatter({ decapo: true }).format(brokenKey))
        .toEqual(new TextFormatter().format(brokenKey));
    });

    it('eliminates a one-fret capo', () => {
      const song = new ChordProParser().parse(heredoc`
        {key: A}
        {capo: 1}

        [A]This is an [F#m]example`);

      const expectedChordSheet = heredoc`
        A#         Gm
        This is an example`;

      expect(new TextFormatter({ decapo: true }).format(song)).toEqual(expectedChordSheet);
    });
  });
});
