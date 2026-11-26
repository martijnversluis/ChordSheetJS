import { ChordProParser } from '../../src';
import commentHeading from '../../src/song_map/comment_heading';
import { heredoc } from '../util/utilities';

function headingOf(chordpro: string) {
  return commentHeading(new ChordProParser().parse(chordpro).lines[0]);
}

describe('commentHeading', () => {
  it.each([
    ['{comment: Verse 1}', 'verse', 'Verse 1'],
    ['{c: Chorus}', 'chorus', 'Chorus'],
    ['{comment: Pre-Chorus}', 'pre-chorus', 'Pre-Chorus'],
    ['{comment: Pre Chorus 2}', 'pre-chorus', 'Pre Chorus 2'],
    ['{comment: Bridge 2x}', 'bridge', 'Bridge'],
    ['{comment: Intro (2x)}', 'intro', 'Intro'],
    ['{comment: Interlude 1 (4x) *5}', 'instrumental', 'Interlude 1'],
    ['{comment: Tag 9 *20a}', 'tag', 'Tag 9'],
    ['{comment: Outro}', 'end', 'Outro'],
    ['{comment: ending}', 'end', 'ending'],
    ['{comment: Turn}', 'turn', 'Turn'],
    ['{comment: Turn 2}', 'turn', 'Turn 2'],
    ['{comment: Turn (2x)}', 'turn', 'Turn'],
    ['{comment: Turnaround}', 'turn', 'Turnaround'],
  ])('reads %s as a heading', (chordpro, type, name) => {
    expect(headingOf(chordpro)).toEqual({ type, name, label: chordpro.replace(/^\{\w+: (.*)\}$/, '$1') });
  });

  it.each([
    ['a comment that is not a section name', '{comment: Capo 2}'],
    ['a section name with more text', '{comment: Chorus softly}'],
    ['a turn with more text', '{comment: Turn softly}'],
    ['a repeat instruction before the section name', '{comment: 2x Chorus}'],
    ['a comment with a selector', '{comment-guitar: Chorus}'],
    ['a comment that shares its line', '{comment: Chorus}[C]Lyrics'],
    ['a section directive', '{start_of_chorus: Chorus}'],
  ])('does not read %s as a heading', (_description, chordpro) => {
    expect(headingOf(chordpro)).toBeNull();
  });

  it('does not read a comment inside a section as a heading', () => {
    const song = new ChordProParser().parse(heredoc`
      {start_of_verse}
      {comment: Chorus}
      {end_of_verse}`);

    expect(commentHeading(song.lines[1])).toBeNull();
  });
});
