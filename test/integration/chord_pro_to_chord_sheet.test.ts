import { heredoc } from '../utilities';
import { ChordProParser, TextFormatter } from '../../src';

describe('chordpro to chord sheet', () => {
  it('correctly parses and formats meta expressions', () => {
    const chordSheet = heredoc`
      {title: A}
      {artist: B}
      %{title}
      %{artist|%{}}
      %{artist=X|artist is X|artist is not X}
      %{c|c is set|c is unset}
      %{artist|artist is %{}|artist is unset}
      %{title|title is set and c is %{c|set|unset}|title is unset}`;

    const expectedChordSheet = heredoc`
      A

      A
      B
      artist is not X
      c is unset
      artist is B
      title is set and c is unset`;

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new TextFormatter().format(song);

    expect(formatted).toEqual(expectedChordSheet);
  });

  it('skips the chordpro header', () => {
    const chordSheet = heredoc`
      {title: Let it be}
      {subtitle: ChordSheetJS example version}
      {Chorus}

      Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
      [C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]`;

    const expectedChordSheet = heredoc`
      LET IT BE
      ChordSheetJS example version

             Am         C/G        F          C
      Let it be, let it be, let it be, let it be
      C                G              F  C/E Dm C
      Whisper words of wisdom, let it be`;

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new TextFormatter().format(song);

    expect(formatted).toEqual(expectedChordSheet);
  });

  it('does not fail on empty chord sheet', () => {
    const song = new ChordProParser().parse('');
    const formatted = new TextFormatter().format(song);

    expect(formatted).toEqual('');
  });

  it('correctly renders section directives', () => {
    const chordSheet = heredoc`
      {start_of_verse: Verse 1:}
      Let it [Am]be
      {end_of_verse}

      {start_of_chorus: Chorus 2:}
      [C]Whisper words of
      {end_of_chorus}

      {start_of_bridge: Bridge 3:}
      [G]wisdom, let it
      {end_of_bridge}`;

    const expectedText = heredoc`
      Verse 1:
             Am
      Let it be

      Chorus 2:
      C
      Whisper words of

      Bridge 3:
      G
      wisdom, let it`;

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new TextFormatter().format(song);

    expect(formatted).toEqual(expectedText);
  });

  it('can expand chorus directives when expandChorusDirective=true', () => {
    const chordSheet = heredoc`
      {start_of_chorus: Chorus 1:}
      [C]Whisper words of
      {end_of_chorus}

      {start_of_verse: Verse 1:}
      Let it [Am]be
      {end_of_verse}

      {chorus: Repeat chorus 1:}

      {start_of_chorus: Chorus 2:}
      [G]wisdom, let it
      {end_of_chorus}

      {chorus: Repeat chorus 2:}

      {chorus: Repeat chorus 2 again:}`;

    const expectedText = heredoc`
      Chorus 1:
      C
      Whisper words of

      Verse 1:
             Am
      Let it be

      Repeat chorus 1:
      C
      Whisper words of

      Chorus 2:
      G
      wisdom, let it

      Repeat chorus 2:
      G
      wisdom, let it

      Repeat chorus 2 again:
      G
      wisdom, let it`;

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new TextFormatter({ expandChorusDirective: true }).format(song);

    expect(formatted).toEqual(expectedText);
  });

  it('does not expand chorus directives when expandChorusDirective=false', () => {
    const chordSheet = heredoc`
      {start_of_chorus: Chorus 1:}
      [C]Whisper words of
      {end_of_chorus}

      {start_of_verse: Verse 1:}
      Let it [Am]be
      {end_of_verse}

      {chorus: Repeat chorus 1:}

      {start_of_chorus: Chorus 2:}
      [G]wisdom, let it
      {end_of_chorus}

      {chorus: Repeat chorus 2:}

      {chorus: Repeat chorus 2 again:}`;

    const expectedText = heredoc`
      Chorus 1:
      C
      Whisper words of

      Verse 1:
             Am
      Let it be

      Repeat chorus 1:

      Chorus 2:
      G
      wisdom, let it

      Repeat chorus 2:

      Repeat chorus 2 again:`;

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new TextFormatter({ expandChorusDirective: false }).format(song);

    expect(formatted).toEqual(expectedText);
  });
});
