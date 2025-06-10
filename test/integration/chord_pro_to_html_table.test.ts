import { heredoc } from '../utilities';
import { stripHTML } from '../../src/template_helpers';
import { ChordProParser, HtmlTableFormatter } from '../../src';

describe('chordpro to HTML with TABLEs', () => {
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

    const expectedChordSheet = stripHTML(`
      <h1 class="title">A</h1>
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="lyrics">A</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="lyrics">B</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="lyrics">artist is not X</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="lyrics">c is unset</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="lyrics">artist is B</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="lyrics">title is set and c is unset</td>
            </tr>
          </table>
        </div>
      </div>`);

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new HtmlTableFormatter().format(song);

    expect(formatted).toEqual(expectedChordSheet);
  });

  it('does not fail on empty chord sheet', () => {
    const song = new ChordProParser().parse('');
    const formatted = new HtmlTableFormatter().format(song);

    expect(formatted).toEqual('');
  });

  it('renders style attributes for chord/text font, size and color', () => {
    const chordProSheet = heredoc`
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
      [Gm]No styles`;

    const expectedChordSheet = stripHTML(`
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="chord" style="color: green; font: 30px sans-serif">Em</td>
              <td class="chord" style="color: green; font: 30px sans-serif"></td>
            </tr>
            <tr>
              <td class="lyrics">30px </td>
              <td class="lyrics">green sans-serif</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord" style="color: blue; font: 24px sans-serif">Am</td>
              <td class="chord" style="color: blue; font: 24px sans-serif"></td>
            </tr>
            <tr>
              <td class="lyrics">24px </td>
              <td class="lyrics">blue sans-serif</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord" style="color: red; font: 12px 'Times New Roman'">Am</td>
              <td class="chord" style="color: red; font: 12px 'Times New Roman'">Dm</td>
              <td class="chord" style="color: red; font: 12px 'Times New Roman'"></td>
            </tr>
            <tr>
              <td class="lyrics" style="color: green"></td>
              <td class="lyrics" style="color: green">12px </td>
              <td class="lyrics" style="color: green">red "Times New Roman"</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Gm</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">No </td>
              <td class="lyrics">styles</td>
            </tr>
          </table>
        </div>
      </div>
    `);

    const song = new ChordProParser().parse(chordProSheet);
    const formatted = new HtmlTableFormatter().format(song);
    expect(formatted).toEqual(expectedChordSheet);
  });

  it('correctly renders section directives', () => {
    const chordSheet = heredoc`
      {start_of_verse: Verse 1}
      Let it [Am]Be
      {end_of_verse}

      {start_of_chorus: Chorus 2}
      [C]Whisper words of
      {end_of_chorus}

      {start_of_bridge: Bridge 3}
      [G]wisdom, let it
      {end_of_bridge}`;

    const expectedHTML = stripHTML(`
      <div class="chord-sheet">
        <div class="paragraph verse">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Verse 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Am</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">Be</td>
            </tr>
          </table>
        </div>
        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Chorus 2</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">C</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td
              ><td class="lyrics">words of</td>
            </tr>
          </table>
        </div>

        <div class="paragraph bridge">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Bridge 3</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">G</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">wisdom, </td>
              <td class="lyrics">let it</td>
            </tr>
          </table>
        </div>
      </div>
    `);

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new HtmlTableFormatter().format(song);

    expect(formatted).toEqual(expectedHTML);
  });

  it('can expand {chorus} directives when expandChorusDirective=true', () => {
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

    const expectedText = stripHTML(`
      <div class="chord-sheet">
        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Chorus 1:</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">C</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td>
              <td class="lyrics">words of</td>
            </tr>
          </table>
        </div>
        <div class="paragraph verse">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Verse 1:</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Am</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be</td>
            </tr>
          </table>
        </div>
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Repeat chorus 1:</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">C</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td>
              <td class="lyrics">words of</td>
            </tr>
          </table>
        </div>
        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Chorus 2:</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">G</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">wisdom, </td>
              <td class="lyrics">let it</td>
            </tr>
          </table>
        </div>
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Repeat chorus 2:</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">G</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">wisdom, </td>
              <td class="lyrics">let it</td>
            </tr>
          </table>
        </div>
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Repeat chorus 2 again:</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">G</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">wisdom, </td>
              <td class="lyrics">let it</td>
            </tr>
          </table>
        </div>
      </div>
    `);

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new HtmlTableFormatter({ expandChorusDirective: true }).format(song);

    expect(formatted).toEqual(expectedText);
  });

  it('does not expand {chorus} directives when expandChorusDirective=false', () => {
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

    const expectedText = stripHTML(`
      <div class="chord-sheet">
        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Chorus 1:</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">C</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td>
              <td class="lyrics">words of</td>
            </tr>
          </table>
        </div>
        <div class="paragraph verse">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Verse 1:</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Am</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be</td>
            </tr>
          </table>
        </div>
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Repeat chorus 1:</h3>
              </td>
            </tr>
          </table>
        </div>
        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Chorus 2:</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">G</td>
              <td class="chord"></td>
            </tr>
            <tr>
              <td class="lyrics">wisdom, </td>
              <td class="lyrics">let it</td>
            </tr>
          </table>
        </div>
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Repeat chorus 2:</h3>
              </td>
            </tr>
          </table>
        </div>
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Repeat chorus 2 again:</h3>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `);

    const song = new ChordProParser().parse(chordSheet);
    const formatted = new HtmlTableFormatter({ expandChorusDirective: false }).format(song);

    expect(formatted).toEqual(expectedText);
  });
});
