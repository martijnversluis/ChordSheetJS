import Song from '../src/chord_sheet/song';
import { createLine } from './utilities';
import { renderChord } from '../src/helpers';

describe('renderChord', () => {
  it('correctly normalizes when a capo is set', () => {
    const line = createLine();
    const song = new Song();
    song.setMetadata('key', 'F');
    song.setMetadata('capo', '1');

    expect(renderChord('Dm7', line, song)).toEqual('C#m7');
  });
});
