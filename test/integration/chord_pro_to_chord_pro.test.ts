import { heredoc } from '../utilities';
import { ChordProFormatter, ChordProParser } from '../../src';

describe('chordpro e2e', () => {
  it('correctly parses and evaluates meta expressions', () => {
    const chordSheet = heredoc`
      {title: A}
      {artist: B}
      %{title}
      %{artist|%{}}
      %{artist=X|artist is X|artist is not X}
      %{c|c is set|c is unset}
      %{artist|artist is %{}|artist is unset}
      %{title|title is set and c is %{c|set|unset}|title is unset}`;

    const expectedEvaluation = heredoc`
      {title: A}
      {artist: B}
      A
      B
      artist is not X
      c is unset
      artist is B
      title is set and c is unset`;

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new ChordProFormatter({ evaluate: true }).format(song);

    expect(formatted).toEqual(expectedEvaluation);
  });

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

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new ChordProFormatter({ evaluate: false }).format(song);

    expect(formatted).toEqual(chordSheet);
  });

  it('does not fail on empty chord sheet', () => {
    const song = new ChordProParser().parse('');
    const formatted = new ChordProFormatter().format(song);

    expect(formatted).toEqual('');
  });

  it('correctly parses and formats meta expressions with errors', () => {
    const chordSheet = heredoc`
      {key: Numbers}

      [Ab] Hello`;

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new ChordProFormatter({ evaluate: false }).format(song);

    expect(formatted).toEqual(chordSheet);
  });
});
