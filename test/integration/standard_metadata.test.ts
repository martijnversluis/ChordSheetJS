import { ChordProParser } from '../../src';
import { configure } from '../../src/formatter/configuration';
import { heredoc } from '../util/utilities';

describe('standard metadata', () => {
  it('provides chordpro and today from a parsed song', () => {
    const song = new ChordProParser().parse(heredoc`
      {title: My Song}
      {artist: John}
      Let it [Am]be`);

    expect(song.metadata.get('chordpro')).toEqual('ChordPro');
    expect(song.metadata.get('chordpro.version')).toMatch(/^\d+\.\d+\.\d+$/);
    expect(song.metadata.get('today')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('evaluates today lazily at access time', () => {
    const song = new ChordProParser().parse('{title: Test}');
    const metadata = song.getMetadata();

    const today1 = metadata.get('today');
    const today2 = metadata.get('today');

    expect(today1).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(today1).toEqual(today2);
  });

  it('provides instrument metadata via configuration', () => {
    const song = new ChordProParser().parse(heredoc`
      {title: My Song}
      Let it [Am]be`);

    const configuration = configure({
      instrument: { type: 'guitar', description: 'Guitar, 6 strings', tuning: 'E2 A2 D3 G3 B3 E4' },
    });

    const metadata = song.getMetadata(configuration);

    expect(metadata.get('instrument')).toEqual('guitar');
    expect(metadata.get('instrument.type')).toEqual('guitar');
    expect(metadata.get('instrument.description')).toEqual('Guitar, 6 strings');
    expect(metadata.get('tuning')).toEqual('E2 A2 D3 G3 B3 E4');
  });

  it('provides user metadata via configuration', () => {
    const song = new ChordProParser().parse('{title: Test}');

    const configuration = configure({
      user: { name: 'johndoe', fullname: 'John Doe' },
    });

    const metadata = song.getMetadata(configuration);

    expect(metadata.get('user')).toEqual('johndoe');
    expect(metadata.get('user.name')).toEqual('johndoe');
    expect(metadata.get('user.fullname')).toEqual('John Doe');
  });

  it('lets explicit directives override standard metadata', () => {
    const song = new ChordProParser().parse(heredoc`
      {title: My Song}
      {artist: John}`);

    const metadata = song.getMetadata();

    expect(metadata.get('title')).toEqual('My Song');
    expect(metadata.get('artist')).toEqual('John');
    expect(metadata.get('chordpro')).toEqual('ChordPro');
  });

  it('provides chords and numchords from a parsed song', () => {
    const song = new ChordProParser().parse(heredoc`
      {title: Let It Be}
      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be`);

    const metadata = song.getMetadata();

    expect(metadata.get('chords')).toEqual('Am, C/G, F, C');
    expect(metadata.get('numchords')).toEqual('4');
  });

  it('provides key_actual and key_from from a parsed song', () => {
    const song = new ChordProParser().parse(heredoc`
      {key: C}
      {capo: 2}
      Let it [Am]be`);

    const metadata = song.getMetadata();

    expect(metadata.get('key_from')).toEqual('C');
    expect(metadata.get('key_actual')).toEqual('D');
  });

  it('includes standard metadata in all()', () => {
    const song = new ChordProParser().parse(heredoc`
      {title: My Song}
      {artist: John}`);

    const metadata = song.getMetadata();
    const all = metadata.all();

    expect(all.chordpro).toEqual('ChordPro');
    expect(all.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(all.title).toEqual('My Song');
  });

  it('does not include standard metadata in iteration', () => {
    const song = new ChordProParser().parse(heredoc`
      {title: My Song}
      {artist: John}`);

    const entries = [...song.getMetadata()];

    expect(entries.find(([key]) => key === 'chordpro')).toBeUndefined();
    expect(entries.map(([key]) => key)).toEqual(['title', 'artist']);
  });
});
