import Song from '../src/chord_sheet/song';
import { createLine } from './utilities';
import { renderChord, stringSplitReplace } from '../src/helpers';
import Key from '../src/key';

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
