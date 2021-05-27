import {
  ChordProParser,
  HtmlDivFormatter,
} from '../../src';

describe('chordpro to HTML with DIVs', () => {
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
          + '<div class="row">'
            + '<div class="column">'
              + '<div class="chord">'
            + '</div>'
            + '<div class="lyrics">A</div>'
          + '</div>'
        + '</div>'
        + '<div class="row">'
          + '<div class="column">'
            + '<div class="chord">'
          + '</div>'
          + '<div class="lyrics">B</div>'
        + '</div>'
      + '</div>'
      + '<div class="row">'
        + '<div class="column">'
          + '<div class="chord"></div>'
          + '<div class="lyrics">artist is not X</div>'
        + '</div>'
      + '</div>'
      + '<div class="row">'
        + '<div class="column">'
          + '<div class="chord"></div>'
          + '<div class="lyrics">c is unset</div>'
        + '</div>'
      + '</div>'
      + '<div class="row">'
        + '<div class="column">'
          + '<div class="chord"></div>'
          + '<div class="lyrics">artist is B</div>'
        + '</div>'
      + '</div>'
      + '<div class="row">'
        + '<div class="column">'
          + '<div class="chord"></div>'
          + '<div class="lyrics">title is set and c is unset</div>'
        + '</div>'
      + '</div>'
    + '</div>'
  + '</div>';

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new HtmlDivFormatter().format(song);

    expect(formatted).toEqual(expectedChordSheet);
  });

  it('does not fail on empty chord sheet', () => {
    const song = new ChordProParser().parse('');
    const formatted = new HtmlDivFormatter().format(song);

    expect(formatted).toEqual('<div class="chord-sheet"></div>');
  });
});
