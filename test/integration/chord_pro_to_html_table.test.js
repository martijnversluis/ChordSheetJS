import {
  ChordProParser,
  HtmlTableFormatter,
} from '../../src';

describe('test HtmlTableFormatter issue for @alexaung', () => {
  const chordPro = `
{title: Let it be}
{subtitle: ChordSheetJS example version}
{Chorus}

Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [F]be [C/E] [Dm] [C]`.substring(1);

  const expectedHTML = '<h1>Let it be</h1>'
    + '<h2>ChordSheetJS example version</h2>'
    + '<div class="chord-sheet">'
      + '<div class="paragraph">'
        + '<table class="row">'
          + '<tr>'
            + '<td class="chord"></td>'
            + '<td class="chord">Am</td>'
            + '<td class="chord">C/G</td>'
            + '<td class="chord">F</td>'
            + '<td class="chord">C</td>'
          + '</tr>'
          + '<tr>'
            + '<td class="lyrics">Let it </td>'
            + '<td class="lyrics">be, let it </td>'
            + '<td class="lyrics">be, let it </td>'
            + '<td class="lyrics">be, let it </td>'
            + '<td class="lyrics">be</td>'
          + '</tr>'
        + '</table>'
        + '<table class="row">'
          + '<tr>'
            + '<td class="chord">C</td>'
            + '<td class="chord">G</td>'
            + '<td class="chord">F</td>'
            + '<td class="chord">C/E</td>'
            + '<td class="chord">Dm</td>'
            + '<td class="chord">C</td>'
          + '</tr>'
          + '<tr>'
            + '<td class="lyrics">Whisper words of </td>'
            + '<td class="lyrics">wisdom, let it </td>'
            + '<td class="lyrics">be </td>'
            + '<td class="lyrics"> </td>'
            + '<td class="lyrics"> </td>'
            + '<td class="lyrics"></td>'
          + '</tr>'
        + '</table>'
      + '</div>'
    + '</div>';

  it('generates the correct HTML output', () => {
    const parser = new ChordProParser();
    const song = parser.parse(chordPro);

    const formatter = new HtmlTableFormatter();
    const formattedChordSheet = formatter.format(song);

    expect(formattedChordSheet).toEqual(expectedHTML);
  });

  it('generates slightly wrong HTML output when using .substring(1) twice', () => {
    const parser = new ChordProParser();
    const song = parser.parse(chordPro.substring(1));

    const formatter = new HtmlTableFormatter();
    const formattedChordSheet = formatter.format(song);

    expect(formattedChordSheet).toEqual(expectedHTML);
  });
});

describe('chordpro to HTML with TABLEs', () => {
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

    const expectedChordSheet = '<h1>A</h1>'
      + '<div class="chord-sheet">'
        + '<div class="paragraph">'
          + '<table class="row">'
            + '<tr>'
              + '<td class="lyrics">A</td>'
            + '</tr>'
          + '</table>'
          + '<table class="row">'
            + '<tr>'
              + '<td class="lyrics">B</td>'
            + '</tr>'
          + '</table>'
          + '<table class="row">'
            + '<tr>'
              + '<td class="lyrics">artist is not X</td>'
            + '</tr>'
          + '</table>'
          + '<table class="row">'
            + '<tr>'
              + '<td class="lyrics">c is unset</td>'
            + '</tr>'
          + '</table>'
          + '<table class="row">'
            + '<tr>'
              + '<td class="lyrics">artist is B</td>'
            + '</tr>'
          + '</table>'
          + '<table class="row">'
            + '<tr>'
              + '<td class="lyrics">title is set and c is unset</td>'
            + '</tr>'
          + '</table>'
        + '</div>'
      + '</div>';

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new HtmlTableFormatter().format(song);

    expect(formatted).toEqual(expectedChordSheet);
  });

  it('does not fail on empty chord sheet', () => {
    const song = new ChordProParser().parse('');
    const formatted = new HtmlTableFormatter().format(song);

    expect(formatted).toEqual('');
  });
});
