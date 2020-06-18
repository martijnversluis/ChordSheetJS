import '../matchers';
import HtmlDivFormatter from '../../src/formatter/html_div_formatter';
import song from '../fixtures/song';
import { createChordLyricsPair, createLine, createSong } from '../utilities';

describe('HtmlDivFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new HtmlDivFormatter();

    const expectedChordSheet =
      '<h1>Let it be</h1>' +
      '<h2>ChordSheetJS example version</h2>' +
      '<div class="chord-sheet">' +
        '<div class="paragraph">' +
          '<div class="row">' +
            '<div class="comment">Bridge</div>' +
          '</div>' +
        '</div>' +
        '<div class="paragraph verse">' +
          '<div class="row">' +
            '<div class="column">' +
              '<div class="chord"></div>' +
              '<div class="lyrics">Let it </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">Am</div>' +
              '<div class="lyrics">be, let it </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">C/G</div>' +
              '<div class="lyrics">be, let it </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">F</div>' +
              '<div class="lyrics">be, let it </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">C</div>' +
              '<div class="lyrics">be</div>' +
            '</div>' +
          '</div>' +
          '<div class="row">' +
            '<div class="column">' +
              '<div class="chord">C</div>' +
              '<div class="lyrics">Whisper words of </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">F</div>' +
              '<div class="lyrics">wis</div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">G</div>' +
              '<div class="lyrics">dom, let it </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">F</div>' +
              '<div class="lyrics">be </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">C/E</div>' +
              '<div class="lyrics"> </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">Dm</div>' +
              '<div class="lyrics"> </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">C</div>' +
              '<div class="lyrics"> </div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="paragraph chorus">' +
          '<div class="row">' +
            '<div class="column">' +
              '<div class="chord">Am</div>' +
              '<div class="lyrics">Whisper words of </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">Bb</div>' +
              '<div class="lyrics">wisdom, let it </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">F</div>' +
              '<div class="lyrics">be </div>' +
            '</div>' +
            '<div class="column">' +
              '<div class="chord">C</div>' +
              '<div class="lyrics"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  describe('with option renderBlankLines:false', () => {
    it('does not include HTML for blank lines', () => {
      const songWithBlankLine = createSong([
        createLine([
          createChordLyricsPair('C', 'Whisper words of wisdom'),
        ]),

        createLine([]),

        createLine([
          createChordLyricsPair('Am', 'Whisper words of wisdom'),
        ]),
      ]);

      const expectedChordSheet =
        '<div class="chord-sheet">' +
          '<div class="paragraph">' +
            '<div class="row">' +
              '<div class="column">' +
                '<div class="chord">C</div>' +
                '<div class="lyrics">Whisper words of wisdom</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="paragraph">' +
            '<div class="row">' +
              '<div class="column">' +
                '<div class="chord">Am</div>' +
                '<div class="lyrics">Whisper words of wisdom</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      const formatter = new HtmlDivFormatter({ renderBlankLines: false });

      expect(formatter.format(songWithBlankLine)).toEqual(expectedChordSheet);
    });
  });
});
