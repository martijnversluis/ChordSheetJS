import ChordProParser from '../../src/parser/chord_pro_parser';
import TextFormatter from '../../src/formatter/text_formatter';

describe('chordpro to chord sheet', () => {
  it('correctly parses and formats meta expressions', () => {
    const chordSheet = `
{title: A}
{artist: B}
%{title}
%{artist|%{}}
%{artist=X|artist is X|artist is not X}
%{c|c is set|c is unset}
%{artist|artist is %{}|artist is unset}
%{title|title is set and c is %{c|set|unset}|title is unset}`.substring(1);

    const expectedChordSheet = `
A

A
B
artist is not X
c is unset
artist is B
title is set and c is unset`.substring(1);

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new TextFormatter().format(song);

    expect(formatted).toEqual(expectedChordSheet);
  });
});
