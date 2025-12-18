import '../util/matchers';
import ChordSheetSerializer from '../../src/chord_sheet_serializer';

import { ContentType } from '../../src/serialized_types';
import { GRID } from '../../src/constants';
import { stripHTML } from '../../src/template_helpers';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';

import {
  ABC,
  HtmlTableFormatter,
  LILYPOND,
  TAB,
} from '../../src';

import {
  chordLyricsPair,
  createSongFromAst,
  heredoc,
  html,
  section,
} from '../util/utilities';

describe('HtmlTableFormatter', () => {
  it('formats a symbol song to a html chord sheet correctly', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
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
              <td class="label-wrapper">
                <h3 class="label">Verse 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Am</td>
              <td class="chord"></td>
              <td class="chord">C/G</td>
              <td class="chord">F</td>
              <td class="chord">C</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be, </td>
              <td class="lyrics">let it </td>
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
              <td class="chord">G</td>
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

        <div class="paragraph solo">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Solo 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">G</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">C</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 2</td>
            </tr>
          </table>
        </div>

        <div class="paragraph tab">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Tab 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                Tab line 1<br>
                Tab line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph abc">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">ABC 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                ABC line 1<br>
                ABC line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph ly">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">LY 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                LY line 1<br>
                LY line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph bridge">
          <table class="row">
            <tr>
              <td class="label-wrapper">
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
            <td class="label-wrapper">
              <h3 class="label">Grid 1</h3>
            </td>
          </tr>
        </table>

        <table class="literal">
          <tr>
            <td class="contents">
              Grid line 1<br>
              Grid line 2
            </td>
          </tr>
        </table>
      </div>
    </div>`);

    expect(new HtmlTableFormatter().format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('formats a solfege song to a html chord sheet correctly', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
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
              <td class="label-wrapper">
                <h3 class="label">Verse 1</h3>
              </td>
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

        <div class="paragraph solo">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Solo 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Sol</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Do</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 2</td>
            </tr>
          </table>
        </div>

        <div class="paragraph tab">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Tab 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                Tab line 1<br>
                Tab line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph abc">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">ABC 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                ABC line 1<br>
                ABC line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph ly">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">LY 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                LY line 1<br>
                LY line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph bridge">
          <table class="row">
            <tr>
              <td class="label-wrapper">
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
              <td class="label-wrapper">
                <h3 class="label">Grid 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                Grid line 1<br>
                Grid line 2
              </td>
            </tr>
          </table>
        </div>
      </div>
    `);

    expect(new HtmlTableFormatter().format(exampleSongSolfege)).toEqual(expectedChordSheet);
  });

  it('applies custom css classes', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="TITLE">Let it be</h1>
      <h2 class="SUBTITLE">ChordSheetJS example version</h2>
      <div class="CHORD-SHEET">
        <div class="PARAGRAPH">
          <table class="ROW">
            <tr>
              <td class="LYRICS">Written by: </td>
              <td class="LYRICS">John Lennon,Paul McCartney</td>
            </tr>
          </table>
        </div>
        <div class="PARAGRAPH verse">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Verse 1</h3>
              </td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD"></td>
              <td class="CHORD">Am</td>
              <td class="CHORD"></td>
              <td class="CHORD">C/G</td>
              <td class="CHORD">F</td>
              <td class="CHORD">C</td>
            </tr>
            <tr>
              <td class="LYRICS">Let it </td>
              <td class="LYRICS">be, </td>
              <td class="LYRICS">let it </td>
              <td class="LYRICS">be, let it </td>
              <td class="LYRICS">be, let it </td>
              <td class="LYRICS">be</td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">D</td>
              <td class="ANNOTATION">strong</td>
              <td class="CHORD">G</td>
              <td class="CHORD">A</td>
              <td class="CHORD">G</td>
              <td class="CHORD">D/F#</td>
              <td class="CHORD">Em</td>
              <td class="CHORD">D</td>
            </tr>
            <tr>
              <td class="LYRICS">Whisper </td>
              <td class="LYRICS">words of </td>
              <td class="LYRICS">wis</td>
              <td class="LYRICS">dom, let it </td>
              <td class="LYRICS">be </td>
              <td class="LYRICS"> </td>
              <td class="LYRICS"> </td>
              <td class="LYRICS"></td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH chorus">
          <table class="ROW">
            <tr>
              <td class="COMMENT">Breakdown</td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">Em</td>
              <td class="CHORD">F</td>
              <td class="CHORD">C</td>
              <td class="CHORD">G</td>
            </tr>
            <tr>
              <td class="LYRICS">Whisper words of </td>
              <td class="LYRICS">wisdom, let it </td>
              <td class="LYRICS">be </td>
              <td class="LYRICS"></td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH chorus">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Chorus 2</h3>
              </td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">G</td>
              <td class="CHORD">F</td>
              <td class="CHORD">C</td>
              <td class="CHORD">G</td>
            </tr>
            <tr>
              <td class="LYRICS">Whisper words of </td>
              <td class="LYRICS">wisdom, let it </td>
              <td class="LYRICS">be </td>
              <td class="LYRICS"></td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH solo">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Solo 1</h3>
              </td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">G</td>
            </tr>
            <tr>
              <td class="LYRICS">Solo line 1</td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">C</td>
            </tr>
            <tr>
              <td class="LYRICS">Solo line 2</td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH tab">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Tab 1</h3>
              </td>
            </tr>
          </table>

          <table class="LITERAL">
            <tr>
              <td class="CONTENTS">
                Tab line 1<br>
                Tab line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH abc">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">ABC 1</h3>
              </td>
            </tr>
          </table>

          <table class="LITERAL">
            <tr>
              <td class="CONTENTS">
                ABC line 1<br>
                ABC line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH ly">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">LY 1</h3>
              </td>
            </tr>
          </table>

          <table class="LITERAL">
            <tr>
              <td class="CONTENTS">
                LY line 1<br>
                LY line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH bridge">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Bridge 1</h3>
              </td>
            </tr>
          </table>
          <table class="ROW">
          <tr>
            <td class="LYRICS">Bridge line</td>
          </tr>
        </table>
      </div>

      <div class="PARAGRAPH grid">
        <table class="ROW">
          <tr>
            <td class="LABEL-WRAPPER">
              <h3 class="LABEL">Grid 1</h3>
            </td>
          </tr>
        </table>

        <table class="LITERAL">
          <tr>
            <td class="CONTENTS">
              Grid line 1<br>
              Grid line 2
            </td>
          </tr>
        </table>
      </div>
    </div>`);

    const formatter = new HtmlTableFormatter({
      cssClasses: {
        annotation: 'ANNOTATION',
        chord: 'CHORD',
        chordSheet: 'CHORD-SHEET',
        column: 'COLUMN',
        comment: 'COMMENT',
        emptyLine: 'EMPTY-LINE',
        label: 'LABEL',
        labelWrapper: 'LABEL-WRAPPER',
        line: 'LINE',
        literal: 'LITERAL',
        literalContents: 'CONTENTS',
        lyrics: 'LYRICS',
        paragraph: 'PARAGRAPH',
        row: 'ROW',
        subtitle: 'SUBTITLE',
        title: 'TITLE',
      },
    });
    expect(formatter.format(exampleSongSymbol)).toEqual(expectedChordSheet);
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
      .title {
        font-size: 1.5em;
      }

      .subtitle {
        font-size: 1.1em;
      }

      .row,
      .line,
      .literal {
        border-spacing: 0;
        color: inherit;
      }

      .annotation,
      .chord,
      .comment,
      .contents,
      .label-wrapper,
      .literal,
      .lyrics {
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
      .someScope .title {
        font-size: 1.5em;
      }

      .someScope .subtitle {
        font-size: 1.1em;
      }

      .someScope .row,
      .someScope .line,
      .someScope .literal {
        border-spacing: 0;
        color: inherit;
      }

      .someScope .annotation,
      .someScope .chord,
      .someScope .comment,
      .someScope .contents,
      .someScope .label-wrapper,
      .someScope .literal,
      .someScope .lyrics {
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

  it('generates a CSS object', () => {
    const { cssObject } = new HtmlTableFormatter();
    expect(typeof cssObject).toEqual('object');
  });

  it('applies the correct normalization when a capo is active and decapo is on', () => {
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

    expect(new HtmlTableFormatter({ decapo: true }).format(songWithCapo)).toEqual(expectedChordSheet);
  });

  it('does not apply normalization for capo when decapo is off', () => {
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
              <td class="chord">Dm7</td>
              <td class="chord">C/E</td>
              <td class="chord">F</td>
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
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
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
              <td class="label-wrapper">
                <h3 class="label">Verse 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Cm</td>
              <td class="chord"></td>
              <td class="chord">Eb/Bb</td>
              <td class="chord">Ab</td>
              <td class="chord">Eb</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be, </td>
              <td class="lyrics">let it </td>
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
              <td class="chord">Bb</td>
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

        <div class="paragraph solo">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Solo 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Bb</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Eb</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 2</td>
            </tr>
          </table>
        </div>

        <div class="paragraph tab">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Tab 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                Tab line 1<br>
                Tab line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph abc">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">ABC 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                ABC line 1<br>
                ABC line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph ly">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">LY 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                LY line 1<br>
                LY line 2</td>
              </tr>
            </table>
          </div>

          <div class="paragraph bridge">
            <table class="row">
              <tr>
                <td class="label-wrapper">
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
                <td class="label-wrapper">
                  <h3 class="label">Grid 1</h3>
                </td>
              </tr>
            </table>

            <table class="literal">
              <tr>
                <td class="contents">
                  Grid line 1<br>
                  Grid line 2
                </td>
              </tr>
            </table>
          </div>
      </div>
    `);

    expect(new HtmlTableFormatter({ key: 'Eb' }).format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('correctly renders blank lines', () => {
    const song = createSongFromAst([
      [chordLyricsPair('C', 'Whisper words of wisdom')],
      [],
      [],
    ]);

    expect(song.bodyParagraphs).toHaveLength(3);

    const expectedOutput = html`
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
        <div class="paragraph"></div>
        <div class="paragraph"></div>
      </div>
    `;

    const output = new HtmlTableFormatter().format(song);
    expect(output).toEqual(expectedOutput);
  });

  it('does not render empty section labels', () => {
    const song = createSongFromAst([
      ...section('tab', '', {}, 'Line 1\nLine 2'),
    ]);

    const expectedOutput = html`
      <div class="chord-sheet">
        <div class="paragraph tab">
          <table class="literal">
            <tr>
              <td class="contents">
                Line 1<br>
                Line 2
              </td>
            </tr>
          </table>
        </div>
      </div>
    `;

    expect(new HtmlTableFormatter().format(song)).toEqual(expectedOutput);
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

  describe('delegates', () => {
    [ABC, GRID, LILYPOND, TAB].forEach((type) => {
      describe(`for ${type}`, () => {
        it('uses a configured delegate', () => {
          const song = createSongFromAst([
            ...section(type as ContentType, `${type} section`, {}, `${type} line 1\n${type} line 2`),
          ]);

          const configuration = {
            delegates: {
              [type]: (content: string) => content.toUpperCase(),
            },
          };

          const expectedOutput = html`
            <div class="chord-sheet">
              <div class="paragraph ${type}">
                <table class="row">
                  <tr>
                    <td class="label-wrapper">
                      <h3 class="label">${type} section</h3>
                    </td>
                  </tr>
                </table>

                <table class="literal">
                  <tr>
                    <td class="contents">
                      ${type.toUpperCase()} LINE 1<br>
                      ${type.toUpperCase()} LINE 2
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          `;

          expect(new HtmlTableFormatter(configuration).format(song)).toEqual(expectedOutput);
        });

        it('defaults to the default delegate', () => {
          const song = createSongFromAst([
            ...section(type as ContentType, `${type} section`, {}, `${type} line 1\n${type} line 2`),
          ]);

          const configuration = {};

          const expectedOutput = html`
            <div class="chord-sheet">
              <div class="paragraph ${type}">
                <table class="row">
                  <tr>
                    <td class="label-wrapper">
                      <h3 class="label">${type} section</h3>
                    </td>
                  </tr>
                </table>

                <table class="literal">
                  <tr>
                    <td class="contents">
                      ${type} line 1<br>
                      ${type} line 2
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          `;

          expect(new HtmlTableFormatter(configuration).format(song)).toEqual(expectedOutput);
        });
      });
    });
  });
});
