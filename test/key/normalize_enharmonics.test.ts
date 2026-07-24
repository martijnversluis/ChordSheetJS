import Chord from '../../src/chord';
import ENHARMONIC_MAPPING from '../../src/normalize_mappings/enharmonic-normalize';
import Key from '../../src/key';

const rootCases = [
  ['Gb', 'B', 'Cb'],
  ['Gb', 'E', 'Fb'],
  ['Ebm', 'B', 'Cb'],
  ['Ebm', 'E', 'Fb'],
  ['C#', 'F', 'E#'],
  ['F#', 'F', 'E#'],
  ['G#', 'F', 'E#'],
  ['D#m', 'F', 'E#'],
];

const bassCases = [
  ['C', 'Gb/B', 'Gb/Cb'],
  ['C', 'Gb/E', 'Gb/Fb'],
  ['D', 'C#/F', 'C#/E#'],
  ['D', 'F#/F', 'F#/E#'],
  ['Gb', 'Eb/B', 'Eb/Cb'],
  ['Gb', 'Eb/E', 'Eb/Fb'],
  ['Cb', 'Cbm/B', 'Cbm/Cb'],
  ['E#', 'E#m/F', 'E#m/E#'],
  ['Fb', 'Fbm/E', 'Fbm/Fb'],
];

describe('contextual enharmonic normalization', () => {
  it.each(rootCases)('normalizes %s pitch %s to %s', (context, input, expected) => {
    const normalized = Key.parseOrFail(input).normalize().normalizeEnharmonics(context);

    expect(normalized.toString()).toEqual(expected);
  });

  it.each(rootCases)('normalizes %s-context chord root %s to %s', (context, input, expected) => {
    const normalized = Chord.parseOrFail(input).normalize(context);

    expect(normalized.toString()).toEqual(expected);
  });

  it.each(bassCases)(
    'normalizes slash bass in %s against the root: %s to %s',
    (songKey, input, expected) => {
      const normalized = Chord.parseOrFail(input).normalize(songKey);

      expect(normalized.toString()).toEqual(expected);
    },
  );

  it('keeps every mapped spelling on its declared pitch', () => {
    Object.values(ENHARMONIC_MAPPING).forEach((spellings) => {
      Object.entries(spellings).forEach(([pitch, spelling]) => {
        if (!spelling) throw new Error(`Missing spelling for pitch ${pitch}`);
        const parsed = Key.parseOrFail(spelling);

        expect(parsed.effectiveGrade).toEqual(Number(pitch));
      });
    });
  });

  it('applies every mapped spelling by context and pitch', () => {
    Object.entries(ENHARMONIC_MAPPING).forEach(([context, spellings]) => {
      Object.entries(spellings).forEach(([pitch, spelling]) => {
        if (!spelling) throw new Error(`Missing spelling for pitch ${pitch}`);
        const input = Key.parseOrFail(spelling).normalize();

        expect(input.normalizeEnharmonics(context).toString()).toEqual(spelling);
      });
    });
  });

  it.each([
    ['Do#', 'Fa', 'Mi#'],
    ['Fa#', 'Fa', 'Mi#'],
    ['Solb', 'Si', 'Dob'],
    ['Solb', 'Mi', 'Fab'],
  ])('renders %s-context pitch %s as %s in solfege', (context, input, expected) => {
    const normalized = Key.parseOrFail(input).normalize().normalizeEnharmonics(context);

    expect(normalized.toString()).toEqual(expected);
  });

  it('allows derived accidental preference to normalize against context', () => {
    const derived = Key.parseOrFail('F').preferAccidental('#');

    expect(derived.explicitAccidental).toBe(false);
    expect(derived.normalize().normalizeEnharmonics('C#').toString()).toEqual('E#');
  });

  it('keeps explicit accidental selection stronger than contextual normalization', () => {
    const explicit = Key.parseOrFail('D#').useAccidental('#');

    expect(explicit.normalizeEnharmonics('Bm').toString()).toEqual('D#');
  });
});
