import Song from '../src/chord_sheet/song';
import { createLine } from './utilities';
import { renderChord, testSelector, stringSplitReplace } from '../src/helpers';
import Key from '../src/key';
import Metadata from '../src/chord_sheet/metadata';
import Configuration from '../src/formatter/configuration/configuration';

describe('renderChord', () => {
  it('correctly normalizes when a capo is set', () => {
    const line = createLine();
    const song = new Song();
    song.setMetadata('key', 'F');
    song.setMetadata('capo', '1');

    expect(renderChord('Dm7', line, song)).toEqual('C#m7');
  });

  it('can render in a different key', () => {
    const line = createLine();
    const song = new Song();
    song.setMetadata('key', 'F');

    expect(renderChord('Dm7', line, song, { renderKey: Key.parse('B') })).toEqual('G#m7');
  });

  it('can render a chord with a unicode modifier', () => {
    const line = createLine();
    const song = new Song();
    song.setMetadata('key', 'F');

    expect(renderChord('Dm7', line, song, { renderKey: Key.parse('B'), useUnicodeModifier: true })).toEqual('G♯m7');
  });
});

describe('stringSplitReplace', () => {
  it('should replace all instances of a match', () => {
    const testString = 'I am a barber';

    const result =
      stringSplitReplace(
        testString,
        'a',
        (_match) => 'BREAK',
      );

    expect(result).toEqual(['I ', 'BREAK', 'm ', 'BREAK', ' b', 'BREAK', 'rber']);
  });

  it('should replace all instances of a match and the rest of the string', () => {
    const testString = 'ai am a barber';

    const result =
      stringSplitReplace(
        testString,
        'a',
        (_match) => 'BREAK',
        (match) => match.toUpperCase(),
      );

    expect(result).toEqual(['BREAK', 'I ', 'BREAK', 'M ', 'BREAK', ' B', 'BREAK', 'RBER']);
  });
});

describe('testSelector', () => {
  it('returns true when the selector matches the configured instrument type', () => {
    const configuration = new Configuration({ instrument: { type: 'guitar' } });
    const metadata = new Metadata();

    expect(
      testSelector(
        { selector: 'guitar', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(true);
  });

  it('returns false when the selector does not match the configured instrument type', () => {
    const configuration = new Configuration({ instrument: { type: 'guitar' } });
    const metadata = new Metadata();

    expect(
      testSelector(
        { selector: 'piano', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(false);
  });

  it('return true when the selector matches the configured user name', () => {
    const configuration = new Configuration({ user: { name: 'john' } });
    const metadata = new Metadata();

    expect(
      testSelector(
        { selector: 'john', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(true);
  });

  it('returns false when the selector does not match the configured user name', () => {
    const configuration = new Configuration({ user: { name: 'john' } });
    const metadata = new Metadata();

    expect(
      testSelector(
        { selector: 'jane', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(false);
  });

  it('returns true when the selector matches a truthy metadata value', () => {
    const configuration = new Configuration();
    const metadata = new Metadata({ 'horns': 'true' });

    expect(
      testSelector(
        { selector: 'horns', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(true);
  });

  it('returns false when the selector matches an empty metadata value', () => {
    const configuration = new Configuration();
    const metadata = new Metadata({ 'horns': '' });

    expect(
      testSelector(
        { selector: 'horns', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(false);
  });

  it('returns false when the selector does not match a metadata value', () => {
    const configuration = new Configuration();
    const metadata = new Metadata();

    expect(
      testSelector(
        { selector: 'horns', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(false);
  });

  describe('when negated', () => {
    it('returns false when the selector matches the configured instrument type', () => {
      const configuration = new Configuration({ instrument: { type: 'guitar' } });
      const metadata = new Metadata();

      expect(
        testSelector(
          { selector: 'guitar', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(false);
    });

    it('returns true when the selector does not match the configured instrument type', () => {
      const configuration = new Configuration({ instrument: { type: 'guitar' } });
      const metadata = new Metadata();

      expect(
        testSelector(
          { selector: 'piano', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(true);
    });

    it('returns false when the selector matches the configured user name', () => {
      const configuration = new Configuration({ user: { name: 'john' } });
      const metadata = new Metadata();

      expect(
        testSelector(
          { selector: 'john', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(false);
    });

    it('returns true when the selector does not match the configured user name', () => {
      const configuration = new Configuration({ user: { name: 'john' } });
      const metadata = new Metadata();

      expect(
        testSelector(
          { selector: 'jane', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(true);
    });

    it('returns false when the selector matches a truthy metadata value', () => {
      const configuration = new Configuration();
      const metadata = new Metadata({ 'horns': 'true' });

      expect(
        testSelector(
          { selector: 'horns', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(false);
    });

    it('returns true when the selector matches an empty metadata value', () => {
      const configuration = new Configuration();
      const metadata = new Metadata({ 'horns': '' });

      expect(
        testSelector(
          { selector: 'horns', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(true);
    });

    it('returns true when the selector does not match a metadata value', () => {
      const configuration = new Configuration();
      const metadata = new Metadata();

      expect(
        testSelector(
          { selector: 'horns', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(true);
    });
  });
});
