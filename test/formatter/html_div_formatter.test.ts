import '../matchers';

import ChordSheetSerializer from '../../src/chord_sheet_serializer';

import { ContentType } from '../../src/serialized_types';
import { GRID } from '../../src/constants';
import { stripHTML } from '../../src/template_helpers';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';

import {
  ABC, HtmlDivFormatter, LILYPOND, TAB,
} from '../../src';

import {
  chordLyricsPair, createSongFromAst, heredoc, html, section,
} from '../utilities';

describe('HtmlDivFormatter', () => {
  it('formats a symbol song to a html chord sheet correctly', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Written by: </div>
            </div>
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">John Lennon,Paul McCartney</div>
            </div>
          </div>
        </div>
        <div class="paragraph verse">
          <div class="row">
            <h3 class="label">Verse 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Let it </div>
            </div>
            <div class="column">
              <div class="chord">Am</div>
              <div class="lyrics">be, </div>
            </div>
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">let it </div>
            </div>
            <div class="column">
              <div class="chord">C/G</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">F</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">C</div>
              <div class="lyrics">be</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">D</div>
              <div class="lyrics">Whisper </div>
            </div>
            <div class="column">
              <div class="annotation">strong</div>
              <div class="lyrics">words of </div>
            </div>
            <div class="column">
              <div class="chord">G</div>
              <div class="lyrics">wis</div>
            </div>
            <div class="column">
              <div class="chord">A</div>
              <div class="lyrics">dom, let it </div>
            </div>
            <div class="column">
              <div class="chord">G</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">D/F#</div>
              <div class="lyrics"> </div>
            </div>
            <div class="column">
              <div class="chord">Em</div>
              <div class="lyrics"> </div>
            </div>
            <div class="column">
              <div class="chord">D</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph chorus">
          <div class="row">
            <div class="comment">Breakdown</div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Em</div>
              <div class="lyrics">Whisper words of </div>
            </div>
            <div class="column">
              <div class="chord">F</div>
              <div class="lyrics">wisdom, let it </div>
            </div>
            <div class="column">
              <div class="chord">C</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">G</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph chorus">
          <div class="row">
            <h3 class="label">Chorus 2</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">G</div>
              <div class="lyrics">Whisper words of </div>
            </div>
            <div class="column">
              <div class="chord">F</div>
              <div class="lyrics">wisdom, let it </div>
            </div>
            <div class="column">
              <div class="chord">C</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">G</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph solo">
          <div class="row">
            <h3 class="label">Solo 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">G</div>
              <div class="lyrics">Solo line 1</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">C</div>
              <div class="lyrics">Solo line 2</div>
            </div>
          </div>
        </div>

        <div class="paragraph tab">
          <div class="row">
            <h3 class="label">Tab 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              Tab line 1<br>
              Tab line 2
            </div>
          </div>
        </div>

        <div class="paragraph abc">
          <div class="row">
            <h3 class="label">ABC 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              ABC line 1<br>
              ABC line 2
            </div>
          </div>
        </div>

        <div class="paragraph ly">
          <div class="row">
            <h3 class="label">LY 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              LY line 1<br>
              LY line 2
            </div>
          </div>
        </div>

        <div class="paragraph bridge">
          <div class="row">
            <h3 class="label">Bridge 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Bridge line</div>
            </div>
          </div>
        </div>

        <div class="paragraph grid">
          <div class="row">
            <h3 class="label">Grid 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              Grid line 1<br>
              Grid line 2
            </div>
          </div>
        </div>
      </div>
    `);

    expect(new HtmlDivFormatter().format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('formats a solfege song to a html chord sheet correctly', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Written by: </div>
            </div>
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">John Lennon,Paul McCartney</div>
            </div>
          </div>
        </div>
        <div class="paragraph verse">
          <div class="row">
            <h3 class="label">Verse 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Let it </div>
            </div>
            <div class="column">
              <div class="chord">Lam</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">Do/Sol</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">Fa</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">Do</div>
              <div class="lyrics">be</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Re</div>
              <div class="lyrics">Whisper </div>
            </div>
            <div class="column">
              <div class="annotation">strong</div>
              <div class="lyrics">words of </div>
            </div>
            <div class="column">
              <div class="chord">Sol</div>
              <div class="lyrics">wis</div>
            </div>
            <div class="column">
              <div class="chord">La</div>
              <div class="lyrics">dom, let it </div>
            </div>
            <div class="column">
              <div class="chord">Sol</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">Re/Fa#</div>
              <div class="lyrics"> </div>
            </div>
            <div class="column">
              <div class="chord">Mim</div>
              <div class="lyrics"> </div>
            </div>
            <div class="column">
              <div class="chord">Re</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph chorus">
          <div class="row">
            <div class="comment">Breakdown</div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Mim</div>
              <div class="lyrics">Whisper words of </div>
            </div>
            <div class="column">
              <div class="chord">Fa</div>
              <div class="lyrics">wisdom, let it </div>
            </div>
            <div class="column">
              <div class="chord">Do</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">Sol</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph chorus">
          <div class="row">
            <h3 class="label">Chorus 2</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Mim</div>
              <div class="lyrics">Whisper words of </div>
            </div>
            <div class="column">
              <div class="chord">Fa</div>
              <div class="lyrics">wisdom, let it </div>
            </div>
            <div class="column">
              <div class="chord">Do</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">Sol</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph solo">
          <div class="row">
            <h3 class="label">Solo 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Sol</div>
              <div class="lyrics">Solo line 1</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Do</div>
              <div class="lyrics">Solo line 2</div>
            </div>
          </div>
        </div>

        <div class="paragraph tab">
          <div class="row">
            <h3 class="label">Tab 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              Tab line 1<br>
              Tab line 2
            </div>
          </div>
        </div>

        <div class="paragraph abc">
          <div class="row">
            <h3 class="label">ABC 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              ABC line 1<br>
              ABC line 2
            </div>
          </div>
        </div>

        <div class="paragraph ly">
          <div class="row">
            <h3 class="label">LY 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              LY line 1<br>
              LY line 2
            </div>
          </div>
        </div>

        <div class="paragraph bridge">
          <div class="row">
            <h3 class="label">Bridge 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Bridge line</div>
            </div>
          </div>
        </div>

        <div class="paragraph grid">
          <div class="row">
            <h3 class="label">Grid 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              Grid line 1<br>
              Grid line 2
            </div>
          </div>
        </div>
      </div>
    `);

    expect(new HtmlDivFormatter().format(exampleSongSolfege)).toEqual(expectedChordSheet);
  });

  it('applies custom css classes', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="TITLE">Let it be</h1>
      <h2 class="SUBTITLE">ChordSheetJS example version</h2>
      <div class="CHORD-SHEET">
        <div class="PARAGRAPH">
          <div class="ROW">
            <div class="COLUMN">
              <div class="CHORD"></div>
              <div class="LYRICS">Written by: </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD"></div>
              <div class="LYRICS">John Lennon,Paul McCartney</div>
            </div>
          </div>
        </div>
        <div class="PARAGRAPH verse">
          <div class="ROW">
            <h3 class="LABEL">Verse 1</h3>
          </div>
          <div class="ROW">
            <div class="COLUMN">
              <div class="CHORD"></div>
              <div class="LYRICS">Let it </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">Am</div>
              <div class="LYRICS">be, </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD"></div>
              <div class="LYRICS">let it </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">C/G</div>
              <div class="LYRICS">be, let it </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">F</div>
              <div class="LYRICS">be, let it </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">C</div>
              <div class="LYRICS">be</div>
            </div>
          </div>
          <div class="ROW">
            <div class="COLUMN">
              <div class="CHORD">D</div>
              <div class="LYRICS">Whisper </div>
            </div>
            <div class="COLUMN">
              <div class="ANNOTATION">strong</div>
              <div class="LYRICS">words of </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">G</div>
              <div class="LYRICS">wis</div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">A</div>
              <div class="LYRICS">dom, let it </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">G</div>
              <div class="LYRICS">be </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">D/F#</div>
              <div class="LYRICS"> </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">Em</div>
              <div class="LYRICS"> </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">D</div>
              <div class="LYRICS"></div>
            </div>
          </div>
        </div>

        <div class="PARAGRAPH chorus">
          <div class="ROW">
            <div class="COMMENT">Breakdown</div>
          </div>
          <div class="ROW">
            <div class="COLUMN">
              <div class="CHORD">Em</div>
              <div class="LYRICS">Whisper words of </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">F</div>
              <div class="LYRICS">wisdom, let it </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">C</div>
              <div class="LYRICS">be </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">G</div>
              <div class="LYRICS"></div>
            </div>
          </div>
        </div>

        <div class="PARAGRAPH chorus">
          <div class="ROW">
            <h3 class="LABEL">Chorus 2</h3>
          </div>
          <div class="ROW">
            <div class="COLUMN">
              <div class="CHORD">G</div>
              <div class="LYRICS">Whisper words of </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">F</div>
              <div class="LYRICS">wisdom, let it </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">C</div>
              <div class="LYRICS">be </div>
            </div>
            <div class="COLUMN">
              <div class="CHORD">G</div>
              <div class="LYRICS"></div>
            </div>
          </div>
        </div>

        <div class="PARAGRAPH solo">
          <div class="ROW">
            <h3 class="LABEL">Solo 1</h3>
          </div>
          <div class="ROW">
            <div class="COLUMN">
              <div class="CHORD">G</div>
              <div class="LYRICS">Solo line 1</div>
            </div>
          </div>
          <div class="ROW">
            <div class="COLUMN">
              <div class="CHORD">C</div>
              <div class="LYRICS">Solo line 2</div>
            </div>
          </div>
        </div>

        <div class="PARAGRAPH tab">
          <div class="ROW">
            <h3 class="LABEL">Tab 1</h3>
          </div>
          <div class="ROW">
            <div class="LITERAL">
              Tab line 1<br>
              Tab line 2
            </div>
          </div>
        </div>

        <div class="PARAGRAPH abc">
          <div class="ROW">
            <h3 class="LABEL">ABC 1</h3>
          </div>
          <div class="ROW">
            <div class="LITERAL">
              ABC line 1<br>
              ABC line 2
            </div>
          </div>
        </div>

        <div class="PARAGRAPH ly">
          <div class="ROW">
            <h3 class="LABEL">LY 1</h3>
          </div>
          <div class="ROW">
            <div class="LITERAL">
              LY line 1<br>
              LY line 2
            </div>
          </div>
        </div>

        <div class="PARAGRAPH bridge">
          <div class="ROW">
            <h3 class="LABEL">Bridge 1</h3>
          </div>
          <div class="ROW">
            <div class="COLUMN">
              <div class="CHORD"></div>
              <div class="LYRICS">Bridge line</div>
            </div>
          </div>
        </div>

        <div class="PARAGRAPH grid">
          <div class="ROW">
            <h3 class="LABEL">Grid 1</h3>
          </div>
          <div class="ROW">
            <div class="LITERAL">
              Grid line 1<br>
              Grid line 2
            </div>
          </div>
        </div>
      </div>
    `);

    const formatter = new HtmlDivFormatter({
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
            <div class="row">
              <div class="column">
                <div class="chord">C</div>
                <div class="lyrics">Whisper words of wisdom</div>
              </div>
            </div>
          </div>
          <div class="paragraph">
            <div class="row">
              <div class="column">
                <div class="chord">Am</div>
                <div class="lyrics">Whisper words of wisdom</div>
              </div>
            </div>
          </div>
        </div>
      `);

      const formatter = new HtmlDivFormatter({ renderBlankLines: false });

      expect(formatter.format(songWithBlankLine)).toEqual(expectedChordSheet);
    });
  });

  it('generates a CSS string', () => {
    const expectedCss = heredoc`
      .chord:not(:last-child) {
        padding-right: 10px;
      }

      .paragraph {
        margin-bottom: 1em;
      }

      .row {
        display: flex;
      }

      .chord:after {
        content: '\\200b';
      }

      .lyrics:after {
        content: '\\200b';
      }`;

    const actualCss = new HtmlDivFormatter().cssString();
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a scoped CSS string with the instance method', () => {
    const expectedCss = heredoc`
      .someScope .chord:not(:last-child) {
        padding-right: 10px;
      }

      .someScope .paragraph {
        margin-bottom: 1em;
      }

      .someScope .row {
        display: flex;
      }

      .someScope .chord:after {
        content: '\\200b';
      }

      .someScope .lyrics:after {
        content: '\\200b';
      }`;

    const actualCss = new HtmlDivFormatter().cssString('.someScope');
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a CSS object', () => {
    const { cssObject } = new HtmlDivFormatter();
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
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">My </div>
            </div>
            <div class="column">
              <div class="chord">C#m7</div>
              <div class="lyrics">heart has always </div>
            </div>
            <div class="column">
              <div class="chord">B/D#</div>
              <div class="lyrics">longed for something </div>
            </div>
            <div class="column">
              <div class="chord">E</div>
              <div class="lyrics">more</div>
            </div>
          </div>
        </div>
      </div>
    `);

    expect(new HtmlDivFormatter({ decapo: true }).format(songWithCapo)).toEqual(expectedChordSheet);
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
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">My </div>
            </div>
            <div class="column">
              <div class="chord">Dm7</div>
              <div class="lyrics">heart has always </div>
            </div>
            <div class="column">
              <div class="chord">C/E</div>
              <div class="lyrics">longed for something </div>
            </div>
            <div class="column">
              <div class="chord">F</div>
              <div class="lyrics">more</div>
            </div>
          </div>
        </div>
      </div>
    `);

    expect(new HtmlDivFormatter().format(songWithCapo)).toEqual(expectedChordSheet);
  });

  it('can render in a different key (symbol chords)', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Written by: </div>
            </div>
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">John Lennon,Paul McCartney</div>
            </div>
          </div>
        </div>
        <div class="paragraph verse">
          <div class="row">
            <h3 class="label">Verse 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Let it </div>
            </div>
            <div class="column">
              <div class="chord">Cm</div>
              <div class="lyrics">be, </div>
            </div>
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">let it </div>
            </div>
            <div class="column">
              <div class="chord">Eb/Bb</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">Ab</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">Eb</div>
              <div class="lyrics">be</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">F</div>
              <div class="lyrics">Whisper </div>
            </div>
            <div class="column">
              <div class="annotation">strong</div>
              <div class="lyrics">words of </div>
            </div>
            <div class="column">
              <div class="chord">Bb</div>
              <div class="lyrics">wis</div>
            </div>
            <div class="column">
              <div class="chord">C</div>
              <div class="lyrics">dom, let it </div>
            </div>
            <div class="column">
              <div class="chord">Bb</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">F/A</div>
              <div class="lyrics"> </div>
            </div>
            <div class="column">
              <div class="chord">Gm</div>
              <div class="lyrics"> </div>
            </div>
            <div class="column">
              <div class="chord">F</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph chorus">
          <div class="row">
            <div class="comment">Breakdown</div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Gm</div>
              <div class="lyrics">Whisper words of </div>
            </div>
            <div class="column">
              <div class="chord">Ab</div>
              <div class="lyrics">wisdom, let it </div>
            </div>
            <div class="column">
              <div class="chord">Eb</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">Bb</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph chorus">
          <div class="row">
            <h3 class="label">Chorus 2</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Bb</div>
              <div class="lyrics">Whisper words of </div>
            </div>
            <div class="column">
              <div class="chord">Ab</div>
              <div class="lyrics">wisdom, let it </div>
            </div>
            <div class="column">
              <div class="chord">Eb</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">Bb</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph solo">
          <div class="row">
            <h3 class="label">Solo 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Bb</div>
              <div class="lyrics">Solo line 1</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Eb</div>
              <div class="lyrics">Solo line 2</div>
            </div>
          </div>
        </div>

        <div class="paragraph tab">
          <div class="row">
            <h3 class="label">Tab 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              Tab line 1<br>
              Tab line 2
            </div>
          </div>
        </div>

        <div class="paragraph abc">
          <div class="row">
            <h3 class="label">ABC 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              ABC line 1<br>
              ABC line 2
            </div>
          </div>
        </div>

        <div class="paragraph ly">
          <div class="row">
            <h3 class="label">LY 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              LY line 1<br>
              LY line 2
            </div>
          </div>
        </div>

        <div class="paragraph bridge">
          <div class="row">
            <h3 class="label">Bridge 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Bridge line</div>
            </div>
          </div>
        </div>

        <div class="paragraph grid">
          <div class="row">
            <h3 class="label">Grid 1</h3>
          </div>

          <div class="row">
            <div class="literal">
              Grid line 1<br>
              Grid line 2
            </div>
          </div>
        </div>
      </div>
    `);

    expect(new HtmlDivFormatter({ key: 'Eb' }).format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('can render in a different key (solfege chords)', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Written by: </div>
            </div>
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">John Lennon,Paul McCartney</div>
            </div>
          </div>
        </div>
        <div class="paragraph verse">
          <div class="row">
            <h3 class="label">Verse 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Let it </div>
            </div>
            <div class="column">
              <div class="chord">Dom</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">Mib/Sib</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">Lab</div>
              <div class="lyrics">be, let it </div>
            </div>
            <div class="column">
              <div class="chord">Mib</div>
              <div class="lyrics">be</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Fa</div>
              <div class="lyrics">Whisper </div>
            </div>

            <div class="column">
              <div class="annotation">strong</div>
              <div class="lyrics">words of </div>
            </div>
            <div class="column">
              <div class="chord">Sib</div>
              <div class="lyrics">wis</div>
            </div>
            <div class="column">
              <div class="chord">Do</div>
              <div class="lyrics">dom, let it </div>
            </div>
            <div class="column">
              <div class="chord">Sib</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">Fa/La</div>
              <div class="lyrics"> </div>
            </div>
            <div class="column">
              <div class="chord">Solm</div>
              <div class="lyrics"> </div>
            </div>
            <div class="column">
              <div class="chord">Fa</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph chorus">
          <div class="row">
            <div class="comment">Breakdown</div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Solm</div>
              <div class="lyrics">Whisper words of </div>
            </div>
            <div class="column">
              <div class="chord">Lab</div>
              <div class="lyrics">wisdom, let it </div>
            </div>
            <div class="column">
              <div class="chord">Mib</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">Sib</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph chorus">
          <div class="row">
            <h3 class="label">Chorus 2</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Solm</div>
              <div class="lyrics">Whisper words of </div>
            </div>
            <div class="column">
              <div class="chord">Lab</div>
              <div class="lyrics">wisdom, let it </div>
            </div>
            <div class="column">
              <div class="chord">Mib</div>
              <div class="lyrics">be </div>
            </div>
            <div class="column">
              <div class="chord">Sib</div>
              <div class="lyrics"></div>
            </div>
          </div>
        </div>

        <div class="paragraph solo">
          <div class="row">
            <h3 class="label">Solo 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Sib</div>
              <div class="lyrics">Solo line 1</div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord">Mib</div>
              <div class="lyrics">Solo line 2</div>
            </div>
          </div>
        </div>

        <div class="paragraph tab">
          <div class="row">
            <h3 class="label">Tab 1</h3>
          </div>

          <div class="row">
            <div class="literal">
              Tab line 1<br>
              Tab line 2
            </div>
          </div>
        </div>

        <div class="paragraph abc">
          <div class="row">
            <h3 class="label">ABC 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              ABC line 1<br>
              ABC line 2
            </div>
          </div>
        </div>

        <div class="paragraph ly">
          <div class="row">
            <h3 class="label">LY 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              LY line 1<br>
              LY line 2
            </div>
          </div>
        </div>

        <div class="paragraph bridge">
          <div class="row">
            <h3 class="label">Bridge 1</h3>
          </div>
          <div class="row">
            <div class="column">
              <div class="chord"></div>
              <div class="lyrics">Bridge line</div>
            </div>
          </div>
        </div>

        <div class="paragraph grid">
          <div class="row">
            <h3 class="label">Grid 1</h3>
          </div>
          <div class="row">
            <div class="literal">
              Grid line 1<br>
              Grid line 2
            </div>
          </div>
        </div>
      </div>
    `);

    expect(new HtmlDivFormatter({ key: 'Mib' }).format(exampleSongSolfege)).toEqual(expectedChordSheet);
  });

  describe('with option useUnicodeModifiers:true', () => {
    it('replaces b with unicode flat', () => {
      const songWithFlats = createSongFromAst([
        [
          chordLyricsPair('Gb', 'Whisper words of wisdom'),
        ],

        [],

        [
          chordLyricsPair('Ebm', 'Whisper words of wisdom'),
        ],
      ]);

      const expectedChordSheet = stripHTML(`
        <div class="chord-sheet">
          <div class="paragraph">
            <div class="row">
              <div class="column">
                <div class="chord">G♭</div>
                <div class="lyrics">Whisper words of wisdom</div>
              </div>
            </div>
          </div>
          <div class="paragraph">
            <div class="row">
              <div class="column">
                <div class="chord">E♭m</div>
                <div class="lyrics">Whisper words of wisdom</div>
              </div>
            </div>
          </div>
        </div>
      `);

      const configuration = { renderBlankLines: false, useUnicodeModifiers: true };
      const formatter = new HtmlDivFormatter(configuration);

      expect(formatter.format(songWithFlats)).toEqual(expectedChordSheet);
    });
  });

  it('can skip chord normalization', () => {
    const songWithSus2 = createSongFromAst([
      [chordLyricsPair('Asus2', 'Let it be')],
    ]);

    const expectedHTML = stripHTML(`
      <div class="chord-sheet">
        <div class="paragraph">
          <div class="row">
            <div class="column">
              <div class="chord">Asus2</div>
              <div class="lyrics">Let it be</div>
            </div>
          </div>
        </div>
      </div>
    `);

    const formatted = new HtmlDivFormatter({ normalizeChords: false }).format(songWithSus2);

    expect(formatted).toEqual(expectedHTML);
  });

  it('does not render empty section labels', () => {
    const song = createSongFromAst([
      ...section('tab', '', {}, 'Line 1\nLine 2'),
    ]);

    const expectedOutput = html`
      <div class="chord-sheet">
        <div class="paragraph tab">
          <div class="row">
            <div class="literal">
              Line 1<br>
              Line 2
            </div>
          </div>
        </div>
      </div>
    `;

    expect(new HtmlDivFormatter().format(song)).toEqual(expectedOutput);
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
                <div class="row">
                  <h3 class="label">${type} section</h3>
                </div>

                <div class="row">
                  <div class="literal">
                    ${type.toUpperCase()} LINE 1<br>
                    ${type.toUpperCase()} LINE 2
                  </div>
                </div>
              </div>
            </div>
          `;

          expect(new HtmlDivFormatter(configuration).format(song)).toEqual(expectedOutput);
        });

        it('defaults to the default delegate', () => {
          const song = createSongFromAst([
            ...section(type as ContentType, `${type} section`, {}, `${type} line 1\n${type} line 2`),
          ]);

          const configuration = {};

          const expectedOutput = html`
            <div class="chord-sheet">
              <div class="paragraph ${type}">
                <div class="row">
                  <h3 class="label">${type} section</h3>
                </div>

                <div class="row">
                  <div class="literal">
                    ${type} line 1<br>
                    ${type} line 2
                  </div>
                </div>
              </div>
            </div>
          `;

          expect(new HtmlDivFormatter(configuration).format(song)).toEqual(expectedOutput);
        });
      });
    });
  });
});
