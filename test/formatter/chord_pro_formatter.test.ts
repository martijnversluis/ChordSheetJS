import { ChordProFormatter, ChordProParser } from '../../src';
import {
  chordLyricsPair, createSongFromAst, heredoc, tag,
} from '../util/utilities';
import { chordProSheetSolfege, chordProSheetSymbol } from '../fixtures/chord_pro_sheet';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';

describe('ChordProFormatter', () => {
  it('formats a symbol song to a chord pro sheet correctly', () => {
    expect(new ChordProFormatter().format(exampleSongSymbol)).toEqual(chordProSheetSymbol);
  });

  it('formats a solfege song to a chord pro sheet correctly', () => {
    expect(new ChordProFormatter().format(exampleSongSolfege)).toEqual(chordProSheetSolfege);
  });

  it('preserves the user-chosen suffix variant by default', () => {
    const song = createSongFromAst([
      [
        chordLyricsPair('Gsus2', 'one '),
        chordLyricsPair('Csus4', 'two '),
        chordLyricsPair('Cmaj7', 'three '),
        chordLyricsPair('FM7', 'four'),
      ],
    ]);

    expect(new ChordProFormatter().format(song)).toEqual('[Gsus2]one [Csus4]two [Cmaj7]three [FM7]four');
  });

  it('round-trips a ChordPro sheet without altering chord suffixes', () => {
    const chordSheet = '[Cmaj7]Hello [Gsus2]world';
    const song = new ChordProParser().parse(chordSheet);

    expect(new ChordProFormatter().format(song)).toEqual(chordSheet);
  });

  it('normalizes the chord suffix when normalizeChordSuffix is enabled', () => {
    const formatter = new ChordProFormatter({ normalizeChordSuffix: true });

    const song = createSongFromAst([
      [chordLyricsPair('Dsus4', 'Let it be')],
    ]);

    expect(formatter.format(song)).toEqual('[Dsus]Let it be');
  });

  it('normalizes enharmonic roots and bass notes by default', () => {
    const song = createSongFromAst([
      [chordLyricsPair('B#sus4', 'Let it be')],
    ]);

    expect(new ChordProFormatter().format(song)).toEqual('[Csus4]Let it be');
  });

  it('allows disabling chord normalization entirely', () => {
    const formatter = new ChordProFormatter({ normalizeChords: false });

    const song = createSongFromAst([
      [chordLyricsPair('B#sus4', 'Let it be')],
    ]);

    expect(formatter.format(song)).toEqual('[B#sus4]Let it be');
  });

  it('formats image directive with attributes', () => {
    const chordSheet = '{image: src="myimage.png" width="200"}';
    const song = new ChordProParser().parse(chordSheet);
    const formatted = new ChordProFormatter().format(song);

    expect(formatted).toEqual('{image: src="myimage.png" width="200"}');
  });

  it('formats image directive with value', () => {
    const chordSheet = '{image: myimage.png}';
    const song = new ChordProParser().parse(chordSheet);
    const formatted = new ChordProFormatter().format(song);

    expect(formatted).toEqual('{image: myimage.png}');
  });

  it('preserves pango markup in lyrics during round-trip', () => {
    const chordSheet = '[C]Roses are <span color="red">red</span>, [G]<b>bold</b>';
    const song = new ChordProParser().parse(chordSheet);
    const formatted = new ChordProFormatter().format(song);

    expect(formatted).toEqual(chordSheet);
  });

  describe('applyChordStyle', () => {
    const chordSheet = heredoc`
      {key: C}
      {chord_style: numeral}

      Let it [Am]be, let it [F]be, let it [C]be
      [C]Whisper words of [G]wisdom, let it [F]be`;

    it('preserves original chord notation by default (backward compatible)', () => {
      const song = new ChordProParser().parse(chordSheet);
      const formatted = new ChordProFormatter().format(song);

      expect(formatted).toContain('[Am]');
      expect(formatted).toContain('[F]');
      expect(formatted).toContain('[G]');
    });

    it('applies chord_style directive when enabled', () => {
      const song = new ChordProParser().parse(chordSheet);
      const formatted = new ChordProFormatter({ applyChordStyle: true }).format(song);

      expect(formatted).toContain('[VIm]');
      expect(formatted).toContain('[IV]');
      expect(formatted).toContain('[I]');
      expect(formatted).toContain('[V]');
      expect(formatted).not.toContain('[Am]');
    });

    it('applies chord_style: number when enabled', () => {
      const numberSheet = chordSheet.replace('numeral', 'number');
      const song = new ChordProParser().parse(numberSheet);
      const formatted = new ChordProFormatter({ applyChordStyle: true }).format(song);

      expect(formatted).toContain('[6m]');
      expect(formatted).toContain('[4]');
      expect(formatted).toContain('[1]');
      expect(formatted).toContain('[5]');
    });

    it('leaves chord notation untouched when chord_style is absent even if enabled', () => {
      const noStyle = heredoc`
        {key: C}

        Let it [Am]be`;
      const song = new ChordProParser().parse(noStyle);
      const formatted = new ChordProFormatter({ applyChordStyle: true }).format(song);

      expect(formatted).toContain('[Am]');
    });
  });

  it('correctly formats non-standard metadata', () => {
    const song = createSongFromAst([
      [tag('title', 'Let it be')],
      [tag('meta', 'composer John Lennon')],
      [tag('meta', 'non_standard value')],
    ]);

    expect(new ChordProFormatter().format(song)).toEqual(
      '{title: Let it be}\n{composer: John Lennon}\n{meta: non_standard value}',
    );
  });
});
