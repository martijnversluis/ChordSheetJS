import expect from 'expect';
import '../matchers';
import HtmlDivFormatter from '../../src/formatter/html_div_formatter';
import song from '../fixtures/song';

describe('HtmlDivFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new HtmlDivFormatter();

    const expectedChordSheet =
      '<h1>Let it be</h1>' +
      '<h2>ChordSheetJS example version</h2>' +
      '<div class="chord-sheet">' +
        '<div class="row">' +
          '<div class="column">' +
            '<div class="chord"></div>' +
            '<div class="lyrics">Let it&nbsp;</div>' +
          '</div>' +
          '<div class="column">' +
            '<div class="chord">Am</div>' +
            '<div class="lyrics">be, let it&nbsp;</div>' +
          '</div>' +
          '<div class="column">' +
            '<div class="chord">C/G</div>' +
            '<div class="lyrics">be, let it&nbsp;</div>' +
          '</div>' +
          '<div class="column">' +
            '<div class="chord">F</div>' +
            '<div class="lyrics">be, let it&nbsp;</div>' +
          '</div>' +
          '<div class="column">' +
            '<div class="chord">C</div>' +
            '<div class="lyrics">be&nbsp;</div>' +
          '</div>' +
        '</div>' +

        '<div class="row">' +
          '<div class="column">' +
            '<div class="chord">C</div>' +
            '<div class="lyrics">Whisper words of&nbsp;</div>' +
          '</div>' +
          '<div class="column">' +
            '<div class="chord">G</div>' +
            '<div class="lyrics">wisdom, let it&nbsp;</div>' +
          '</div>' +
          '<div class="column">' +
            '<div class="chord">F</div>' +
            '<div class="lyrics">be&nbsp;</div>' +
          '</div>' +
          '<div class="column">' +
            '<div class="chord">C/E&nbsp;</div>' +
            '<div class="lyrics"></div>' +
          '</div>' +
          '<div class="column">' +
            '<div class="chord">Dm&nbsp;</div>' +
            '<div class="lyrics"></div>' +
          '</div>' +
          '<div class="column">' +
            '<div class="chord">C&nbsp;</div>' +
            '<div class="lyrics"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });
});
