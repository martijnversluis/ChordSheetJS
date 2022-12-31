import { ChordProParser, HtmlDivFormatter } from '../../src';
import { stripHTML } from '../../src/template_helpers';

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

  it('renders style attributes for chord/text font, size and color', () => {
    const chordProSheet = `
{chordfont: "Times New Roman"}
{chordfont: sans-serif}
{chordsize: 12}
{chordsize: 200%}
{chordsize: 125%}
{chordcolour: red}
{chordcolour: blue}
{chordcolour: green}
[Em]30px green sans-serif
{chordcolour}
{chordsize}
[Am]24px blue sans-serif
{chordsize}
{chordcolour}
{chordfont}
{textcolour: green}
[Am][Dm]12px red "Times New Roman"
{textcolour}
{chordsize}
{chordcolour}
{chordfont}
[Gm]No styles`.substring(1);

    const expectedChordSheet = stripHTML(`
      <div class="chord-sheet">
        <div class="paragraph">
          <div class="row">
            <div class="column">
              <div class="chord" style="color: green; font: 30px sans-serif">Em</div>
              <div class="lyrics">30px </div>
            </div>
            <div class="column">
              <div class="chord" style="color: green; font: 30px sans-serif"></div>
              <div class="lyrics">green sans-serif</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord" style="color: blue; font: 24px sans-serif">Am</div>
              <div class="lyrics">24px </div>
            </div>
            <div class="column">
              <div class="chord" style="color: blue; font: 24px sans-serif"></div>
              <div class="lyrics">blue sans-serif</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord" style="color: red; font: 12px 'Times New Roman'">Am</div>
              <div class="lyrics" style="color: green"></div>
            </div>
            <div class="column">
              <div class="chord" style="color: red; font: 12px 'Times New Roman'">Dm</div>
              <div class="lyrics" style="color: green">12px </div>
            </div>
            <div class="column">
              <div class="chord" style="color: red; font: 12px 'Times New Roman'"></div>
              <div class="lyrics" style="color: green">red "Times New Roman"</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Gm</div>
              <div class="lyrics">No </div>
            </div>
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">styles</div>
            </div>
          </div>
        </div>
      </div>
    `);

    const song = new ChordProParser().parse(chordProSheet);
    const formatted = new HtmlDivFormatter().format(song);
    expect(formatted).toEqual(expectedChordSheet);
  });
});
