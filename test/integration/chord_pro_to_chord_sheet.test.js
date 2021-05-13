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

  it('skips the chordpro header', () => {
    const chordSheet = `
{title: Let it be}
{subtitle: ChordSheetJS example version}
{Chorus}

Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]`.substring(1);

    const expectedChordSheet = `
LET IT BE
ChordSheetJS example version

       Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be`.substring(1);

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new TextFormatter().format(song);

    expect(formatted).toEqual(expectedChordSheet);
  });

  it('does not fail on empty chord sheet', () => {
    const song = new ChordProParser().parse('');
    const formatted = new TextFormatter().format(song);

    expect(formatted).toEqual('');
  });
});
