import { HtmlTableFormatter } from '../../src';
import '../matchers';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';
import { scopedCss } from '../../src/formatter/html_table_formatter';
import { stripHTML } from '../../src/template_helpers';
import ChordSheetSerializer from '../../src/chord_sheet_serializer';

import { chordLyricsPair, createSongFromAst, heredoc } from '../utilities';

describe('HtmlTableFormatter', () => {
  it('formats a symbol song to a html chord sheet correctly', () => {
    const expectedChordSheet = stripHTML(`
      <h1>Let it be</h1>
      <h2>ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="lyrics">Written by: </td>
              <td class="lyrics">John Lennon,Paul McCartney</td>
            </tr>
          </table>
        </div>
        <div class="paragraph verse">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">Verse 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Am</td>
              <td class="chord">C/G</td>
              <td class="chord">F</td>
              <td class="chord">C</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">D</td>
              <td class="annotation">strong</td>
              <td class="chord">G</td>
              <td class="chord">A</td>
              <td class="chord">G</td>
              <td class="chord">D/F#</td>
              <td class="chord">Em</td>
              <td class="chord">D</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td>
              <td class="lyrics">words of </td>
              <td class="lyrics">wis</td>
              <td class="lyrics">dom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"> </td>
              <td class="lyrics"> </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>
        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="comment">Breakdown</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Em</td>
              <td class="chord">F</td>
              <td class="chord">C</td>
              <td class="chord">G</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of </td>
              <td class="lyrics">wisdom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph tab">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">Tab 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Tab line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Tab line 2</td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph abc">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">ABC 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">ABC line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">ABC line 2</td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph ly">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">LY 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">LY line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">LY line 2</td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph bridge">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">Bridge 1</h3>
              </td>
            </tr>
          </table>
          
          <table class="row">
            <tr>
              <td class="lyrics">Bridge line</td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph grid">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">Grid 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Grid line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Grid line 2</td>
            </tr>
          </table>
        </div>
      </div>
    `);

    expect(new HtmlTableFormatter().format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('formats a solfege song to a html chord sheet correctly', () => {
    const expectedChordSheet = stripHTML(`
      <h1>Let it be</h1>
      <h2>ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="lyrics">Written by: </td>
              <td class="lyrics">John Lennon,Paul McCartney</td>
            </tr>
          </table>
        </div>
        <div class="paragraph verse">
          <table class="row">
            <tr>
              <td><h3 class="label">Verse 1</h3></td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Lam</td>
              <td class="chord">Do/Sol</td>
              <td class="chord">Fa</td>
              <td class="chord">Do</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Re</td>
              <td class="annotation">strong</td>
              <td class="chord">Sol</td>
              <td class="chord">La</td>
              <td class="chord">Sol</td>
              <td class="chord">Re/Fa#</td>
              <td class="chord">Mim</td>
              <td class="chord">Re</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td>
              <td class="lyrics">words of </td>
              <td class="lyrics">wis</td>
              <td class="lyrics">dom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"> </td>
              <td class="lyrics"> </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>
        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="comment">Breakdown</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Mim</td>
              <td class="chord">Fa</td>
              <td class="chord">Do</td>
              <td class="chord">Sol</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of </td>
              <td class="lyrics">wisdom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph tab">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">Tab 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Tab line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Tab line 2</td>
              </tr>
            </table>
          </div>
              
          <div class="paragraph abc">
            <table class="row">
              <tr>
                <td>
                  <h3 class="label">ABC 1</h3>
                </td>
              </tr>
            </table>
            <table class="row">
              <tr>
                <td class="literal">ABC line 1</td>
              </tr>
            </table>
            <table class="row">
              <tr>
                <td class="literal">ABC line 2</td>
              </tr>
            </table>
          </div>
          
          <div class="paragraph ly">
            <table class="row">
              <tr>
                <td>
                  <h3 class="label">LY 1</h3>
                </td>
              </tr>
            </table>
            <table class="row">
              <tr>
                <td class="literal">LY line 1</td>
              </tr>
            </table>
            <table class="row">
              <tr>
                <td class="literal">LY line 2</td>
              </tr>
            </table>
          </div>
          
          <div class="paragraph bridge">
            <table class="row">
              <tr>
                <td>
                  <h3 class="label">Bridge 1</h3>
                </td>
              </tr>
            </table>
            <table class="row">
              <tr>
                <td class="lyrics">Bridge line</td>
              </tr>
            </table>
          </div>
          
          <div class="paragraph grid">
            <table class="row">
              <tr>
                <td>
                  <h3 class="label">Grid 1</h3>
                </td>
              </tr>
            </table>
            <table class="row">
              <tr>
                <td class="literal">Grid line 1</td>
              </tr>
            </table>
            <table class="row">
              <tr>
                <td class="literal">Grid line 2</td>
              </tr>
            </table>
          </div>
        </div>
    `);

    expect(new HtmlTableFormatter().format(exampleSongSolfege)).toEqual(expectedChordSheet);
  });

  describe('with option renderBlankLines:false', () => {
    it('does not include HTML for blank lines', () => {
      const songWithBlankLine = createSongFromAst([
        [
          chordLyricsPair('C', 'Whisper words of wisdom'),
        ],

        [],

        [
          chordLyricsPair('Am', 'Whisper words of wisdom'),
        ],
      ]);

      const expectedChordSheet = stripHTML(`
        <div class="chord-sheet">
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">C</td>
              </tr>
              <tr>
                <td class="lyrics">Whisper words of wisdom</td>
              </tr>
            </table>
          </div>
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">Am</td>
              </tr>
              <tr>
                <td class="lyrics">Whisper words of wisdom</td>
              </tr>
            </table>
          </div>
        </div>
      `);

      const formatter = new HtmlTableFormatter({ renderBlankLines: false });

      expect(formatter.format(songWithBlankLine)).toEqual(expectedChordSheet);
    });
  });

  it('generates a CSS string', () => {
    const expectedCss = heredoc`
      h1 {
        font-size: 1.5em;
      }
      
      h2 {
        font-size: 1.1em;
      }
      
      table {
        border-spacing: 0;
        color: inherit;
      }
      
      td {
        padding: 3px 0;
      }
      
      .chord:not(:last-child) {
        padding-right: 10px;
      }
      
      .paragraph {
        margin-bottom: 1em;
      }`;

    const actualCss = new HtmlTableFormatter().cssString();
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a scoped CSS string from the instance method', () => {
    const expectedCss = heredoc`
      .someScope h1 {
        font-size: 1.5em;
      }
      
      .someScope h2 {
        font-size: 1.1em;
      }
      
      .someScope table {
        border-spacing: 0;
        color: inherit;
      }
      
      .someScope td {
        padding: 3px 0;
      }
      
      .someScope .chord:not(:last-child) {
        padding-right: 10px;
      }
      
      .someScope .paragraph {
        margin-bottom: 1em;
      }`;

    const actualCss = new HtmlTableFormatter().cssString('.someScope');
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a scoped CSS string from the exposed function', () => {
    const expectedCss = heredoc`
      .someScope h1 {
        font-size: 1.5em;
      }
      
      .someScope h2 {
        font-size: 1.1em;
      }
      
      .someScope table {
        border-spacing: 0;
        color: inherit;
      }
      
      .someScope td {
        padding: 3px 0;
      }
      
      .someScope .chord:not(:last-child) {
        padding-right: 10px;
      }
      
      .someScope .paragraph {
        margin-bottom: 1em;
      }`;

    const actualCss = scopedCss('.someScope');
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a CSS object', () => {
    const { cssObject } = new HtmlTableFormatter();
    expect(typeof cssObject).toEqual('object');
  });

  it('applies the correct normalization when a capo is active', () => {
    const songWithCapo = new ChordSheetSerializer().deserialize({
      type: 'chordSheet',
      lines: [
        {
          type: 'line',
          items: [{ type: 'tag', name: 'key', value: 'F' }],
        },
        {
          type: 'line',
          items: [{ type: 'tag', name: 'capo', value: '1' }],
        },
        {
          type: 'line',
          items: [
            { type: 'chordLyricsPair', chords: '', lyrics: 'My ' },
            { type: 'chordLyricsPair', chords: 'Dm7', lyrics: 'heart has always ' },
            { type: 'chordLyricsPair', chords: 'C/E', lyrics: 'longed for something ' },
            { type: 'chordLyricsPair', chords: 'F', lyrics: 'more' },
          ],
        },
      ],
    });

    const expectedChordSheet = stripHTML(`
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">C#m7</td>
              <td class="chord">B/D#</td>
              <td class="chord">E</td>
            </tr>
            <tr>
              <td class="lyrics">My </td>
              <td class="lyrics">heart has always </td>
              <td class="lyrics">longed for something </td>
              <td class="lyrics">more</td>
            </tr>
          </table>
        </div>
      </div>
    `);

    expect(new HtmlTableFormatter().format(songWithCapo)).toEqual(expectedChordSheet);
  });

  it('can render in a different key', () => {
    const expectedChordSheet = stripHTML(`
      <h1>Let it be</h1>
      <h2>ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="lyrics">Written by: </td>
              <td class="lyrics">John Lennon,Paul McCartney</td>
            </tr>
          </table>
        </div>
        <div class="paragraph verse">
          <table class="row">
            <tr>
              <td><h3 class="label">Verse 1</h3></td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Cm</td>
              <td class="chord">Eb/Bb</td>
              <td class="chord">Ab</td>
              <td class="chord">Eb</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">F</td>
              <td class="annotation">strong</td>
              <td class="chord">Bb</td>
              <td class="chord">C</td>
              <td class="chord">Bb</td>
              <td class="chord">F/A</td>
              <td class="chord">Gm</td>
              <td class="chord">F</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td>
              <td class="lyrics">words of </td>
              <td class="lyrics">wis</td>
              <td class="lyrics">dom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"> </td>
              <td class="lyrics"> </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>
        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="comment">Breakdown</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Gm</td>
              <td class="chord">Ab</td>
              <td class="chord">Eb</td>
              <td class="chord">Bb</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of </td>
              <td class="lyrics">wisdom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph tab">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">Tab 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Tab line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Tab line 2</td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph abc">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">ABC 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">ABC line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">ABC line 2</td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph ly">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">LY 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">LY line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">LY line 2</td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph bridge">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">Bridge 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="lyrics">Bridge line</td>
            </tr>
          </table>
        </div>
        
        <div class="paragraph grid">
          <table class="row">
            <tr>
              <td>
                <h3 class="label">Grid 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Grid line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="literal">Grid line 2</td>
            </tr>
          </table>
        </div>
      </div>
    `);

    expect(new HtmlTableFormatter({ key: 'Eb' }).format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  describe('with option useUnicodeModifiers:true', () => {
    it('replaces # with unicode sharp', () => {
      const songWithSharps = createSongFromAst([
        [
          chordLyricsPair('C#', 'Whisper words of wisdom'),
        ],

        [],

        [
          chordLyricsPair('A#m', 'Whisper words of wisdom'),
        ],
      ]);

      const expectedChordSheet = stripHTML(`
        <div class="chord-sheet">
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">C♯</td>
              </tr>
              <tr>
                <td class="lyrics">Whisper words of wisdom</td>
              </tr>
            </table>
          </div>
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">A♯m</td>
              </tr>
              <tr>
                <td class="lyrics">Whisper words of wisdom</td>
              </tr>
            </table>
          </div>
        </div>
      `);

      const formatter = new HtmlTableFormatter({ renderBlankLines: false, useUnicodeModifiers: true });

      expect(formatter.format(songWithSharps)).toEqual(expectedChordSheet);
    });

    it('can skip chord normalization', () => {
      const songWithSus2 = createSongFromAst([
        [chordLyricsPair('Asus2', 'Let it be')],
      ]);

      const expectedHTML = stripHTML(`
        <div class="chord-sheet">
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">Asus2</td>
              </tr>
              <tr>
                <td class="lyrics">Let it be</td>
              </tr>
            </table>
          </div>
        </div>
      `);

      const formatted = new HtmlTableFormatter({ normalizeChords: false }).format(songWithSus2);

      expect(formatted).toEqual(expectedHTML);
    });
  });
});
