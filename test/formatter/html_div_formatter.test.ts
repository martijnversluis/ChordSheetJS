import { HtmlDivFormatter } from '../../src';
import '../matchers';
import { defaultCss, scopedCss } from '../../src/formatter/html_div_formatter';
import { stripHTML } from '../../src/template_helpers';
import ChordSheetSerializer from '../../src/chord_sheet_serializer';

import {
  chordLyricsPair,
  createSongFromAst,
  tag,
  ternary,
} from '../utilities';

describe('HtmlDivFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new HtmlDivFormatter();

    const expectedChordSheet = stripHTML(`
      <h1>Let it be</h1>
      <h2>ChordSheetJS example version</h2>
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
              <div class="lyrics">be, let it </div>
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
              <div class="lyrics">Whisper words of </div>
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
      </div>
    `);

    expect(formatter.format(createSongFromAst([
      [tag('title', 'Let it be')],
      [tag('subtitle', 'ChordSheetJS example version')],
      [tag('key', 'C')],
      [tag('x_some_setting', '')],
      [tag('composer', 'John Lennon')],
      [tag('composer', 'Paul McCartney')],
      [],
      [
        chordLyricsPair('', 'Written by: '),
        ternary({
          variable: 'composer',
          trueExpression: [ternary({ variable: null })],
          falseExpression: [
            'No composer defined for ',
            ternary({
              variable: 'title',
              trueExpression: [ternary({ variable: null })],
              falseExpression: ['Untitled song'],
            }),
          ],
        }),
      ],
      [],
      [tag('start_of_verse', 'Verse 1')],
      [
        chordLyricsPair('', 'Let it '),
        chordLyricsPair('Am', 'be, let it '),
        chordLyricsPair('C/G', 'be, let it '),
        chordLyricsPair('F', 'be, let it '),
        chordLyricsPair('C', 'be'),
      ],
      [tag('transpose', '2')],
      [
        chordLyricsPair('C', 'Whisper words of '),
        chordLyricsPair('F', 'wis'),
        chordLyricsPair('G', 'dom, let it '),
        chordLyricsPair('F', 'be '),
        chordLyricsPair('C/E', ' '),
        chordLyricsPair('Dm', ' '),
        chordLyricsPair('C', ''),
      ],
      [tag('end_of_verse')],
      [],
      [tag('start_of_chorus')],
      [tag('comment', 'Breakdown')],
      [tag('transpose', 'G')],
      [
        chordLyricsPair('Am', 'Whisper words of '),
        chordLyricsPair('Bb', 'wisdom, let it '),
        chordLyricsPair('F', 'be '),
        chordLyricsPair('C', ''),
      ],
      [tag('end_of_chorus')],
    ]))).toEqual(expectedChordSheet);
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
    const expectedCss = `
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
}`.substring(1);

    const actualCss = new HtmlDivFormatter().cssString();
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a scoped CSS string with the instance method', () => {
    const expectedCss = `
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
}`.substring(1);

    const actualCss = new HtmlDivFormatter().cssString('.someScope');
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a scoped CSS string with the exposed function', () => {
    const expectedCss = `
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
}`.substring(1);

    const actualCss = scopedCss('.someScope');
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a CSS object', () => {
    const { cssObject } = new HtmlDivFormatter();
    expect(typeof cssObject).toEqual('object');
  });

  it('exposes the CSS object', () => {
    expect(typeof defaultCss).toEqual('object');
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

    expect(new HtmlDivFormatter().format(songWithCapo)).toEqual(expectedChordSheet);
  });
});
