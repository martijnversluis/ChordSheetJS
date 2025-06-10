import Key from '../src/key';
import Metadata from '../src/chord_sheet/metadata';
import Song from '../src/chord_sheet/song';

import { configure } from '../src/formatter/configuration';
import { createLine } from './utilities';
import { renderChord, testSelector } from '../src/helpers';

describe('renderChord', () => {
  it('correctly normalizes when a capo is set and decapo is enabled', () => {
    const line = createLine();
    const song = new Song({ key: 'F', capo: '1' });

    expect(renderChord('Dm7', line, song, { decapo: true })).toEqual('C#m7');
  });

  it('does not normalize for capo when decapo is disabled', () => {
    const line = createLine();
    const song = new Song({ key: 'F', capo: '1' });

    expect(renderChord('Dm7', line, song, { decapo: false })).toEqual('Dm7');
  });

  it('can render in a different key', () => {
    const line = createLine();
    const song = new Song({ key: 'F' });

    expect(renderChord('Dm7', line, song, { renderKey: Key.parse('B') })).toEqual('G#m7');
  });

  it('can render a chord with a unicode modifier', () => {
    const line = createLine();
    const song = new Song({ key: 'F' });

    expect(renderChord('Dm7', line, song, { renderKey: Key.parse('B'), useUnicodeModifier: true })).toEqual('G♯m7');
  });
});

describe('testSelector', () => {
  it('returns true when the selector matches the configured instrument type', () => {
    const configuration = configure({ instrument: { type: 'guitar' } });
    const metadata = new Metadata();

    expect(
      testSelector(
        { selector: 'guitar', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(true);
  });

  it('returns false when the selector does not match the configured instrument type', () => {
    const configuration = configure({ instrument: { type: 'guitar' } });
    const metadata = new Metadata();

    expect(
      testSelector(
        { selector: 'piano', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(false);
  });

  it('return true when the selector matches the configured user name', () => {
    const configuration = configure({ user: { name: 'john' } });
    const metadata = new Metadata();

    expect(
      testSelector(
        { selector: 'john', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(true);
  });

  it('returns false when the selector does not match the configured user name', () => {
    const configuration = configure({ user: { name: 'john' } });
    const metadata = new Metadata();

    expect(
      testSelector(
        { selector: 'jane', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(false);
  });

  it('returns true when the selector matches a truthy metadata value', () => {
    const configuration = configure({});
    const metadata = new Metadata({ 'horns': 'true' });

    expect(
      testSelector(
        { selector: 'horns', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(true);
  });

  it('returns false when the selector matches an empty metadata value', () => {
    const configuration = configure({});
    const metadata = new Metadata({ 'horns': '' });

    expect(
      testSelector(
        { selector: 'horns', isNegated: false },
        { configuration, metadata },
      ),
    ).toEqual(false);
  });

  it('returns false when the selector does not match a metadata value', () => {
    const configuration = configure({});
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
      const configuration = configure({ instrument: { type: 'guitar' } });
      const metadata = new Metadata();

      expect(
        testSelector(
          { selector: 'guitar', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(false);
    });

    it('returns true when the selector does not match the configured instrument type', () => {
      const configuration = configure({ instrument: { type: 'guitar' } });
      const metadata = new Metadata();

      expect(
        testSelector(
          { selector: 'piano', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(true);
    });

    it('returns false when the selector matches the configured user name', () => {
      const configuration = configure({ user: { name: 'john' } });
      const metadata = new Metadata();

      expect(
        testSelector(
          { selector: 'john', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(false);
    });

    it('returns true when the selector does not match the configured user name', () => {
      const configuration = configure({ user: { name: 'john' } });
      const metadata = new Metadata();

      expect(
        testSelector(
          { selector: 'jane', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(true);
    });

    it('returns false when the selector matches a truthy metadata value', () => {
      const configuration = configure({});
      const metadata = new Metadata({ 'horns': 'true' });

      expect(
        testSelector(
          { selector: 'horns', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(false);
    });

    it('returns true when the selector matches an empty metadata value', () => {
      const configuration = configure({});
      const metadata = new Metadata({ 'horns': '' });

      expect(
        testSelector(
          { selector: 'horns', isNegated: true },
          { configuration, metadata },
        ),
      ).toEqual(true);
    });

    it('returns true when the selector does not match a metadata value', () => {
      const configuration = configure({});
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
