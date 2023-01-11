import Song from '../src/chord_sheet/song';
import { createLine } from './utilities';
import { renderChord } from '../src/helpers';
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
