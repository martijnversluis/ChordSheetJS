import chai, { expect } from 'chai';

import '../matchers';
import HtmlDivFormatter from '../../src/formatter/html_div_formatter';
import htmlEntitiesEncode from '../../src/formatter/html_entities_encode';
import song from '../fixtures/song';
import { createChordLyricsPair, createLine, createSong } from '../utilities';

chai.use(require('chai-diff'));

describe('HtmlDivFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new HtmlDivFormatter();

    const expectedChordSheet =
      '<h1>Let it be</h1>' +
      '<h2>ChordSheetJS example version</h2>' +
      '<div class="chord-sheet">' +
        '<div class="row">' +
          '<div class="comment">Bridge</div>' +
        '</div>' +
        '<div class="row empty-line"></div>' +
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
        '<div class="row empty-line"></div>' +
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
      '</div>';

    expect(formatter.format(song)).to.equalText(expectedChordSheet);
  });

  it('encodes HTML entities', () => {
    const formatter = new HtmlDivFormatter();

    const songWithHtmlEntities = createSong([
      createLine([
        createChordLyricsPair('Am', '<h1>Let it</h1>'),
      ]),
    ]);

    const expectedChordSheet =
      '<div class="chord-sheet">' +
        '<div class="row">' +
          '<div class="column">' +
            '<div class="chord">Am</div>' +
            `<div class="lyrics">${htmlEntitiesEncode('<h1>Let it</h1>')}</div>` +
          '</div>' +
        '</div>' +
      '</div>';

    expect(formatter.format(songWithHtmlEntities)).to.equalText(expectedChordSheet);
  });
});
