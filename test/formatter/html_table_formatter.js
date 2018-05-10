import expect from 'expect';
import '../matchers';
import HtmlTableFormatter from '../../src/formatter/html_table_formatter';
import htmlEntitiesEncode from '../../src/formatter/html_entities_encode';
import song from '../fixtures/song';
import { createChordLyricsPair, createLine, createSong } from '../utilities';

describe('HtmlTableFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new HtmlTableFormatter();

    const expectedChordSheet =
      '<h1>Let it be</h1>' +
      '<h2>ChordSheetJS example version</h2>' +
      '<table>' +
        '<tr>' +
          '<td class="comment">Bridge</td>' +
        '</tr>' +
      '</table>' +
      '<table>' +
        '<tr>' +
          '<td class="chord"></td>' +
          '<td class="chord">Am</td>' +
          '<td class="chord">C/G</td>' +
          '<td class="chord">F</td>' +
          '<td class="chord">C</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="lyrics">Let it </td>' +
          '<td class="lyrics">be, let it </td>' +
          '<td class="lyrics">be, let it </td>' +
          '<td class="lyrics">be, let it </td>' +
          '<td class="lyrics">be </td>' +
        '</tr>' +
      '</table>' +
      '<table>' +
        '<tr>' +
          '<td class="chord">C</td>' +
          '<td class="chord">G</td>' +
          '<td class="chord">F</td>' +
          '<td class="chord">C/E </td>' +
          '<td class="chord">Dm </td>' +
          '<td class="chord">C </td>' +
        '</tr>' +
        '<tr>' +
          '<td class="lyrics">Whisper words of </td>' +
          '<td class="lyrics">wisdom, let it </td>' +
          '<td class="lyrics">be </td>' +
          '<td class="lyrics"></td>' +
          '<td class="lyrics"></td>' +
          '<td class="lyrics"></td>' +
        '</tr>' +
      '</table>';

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  it('encodes HTML entities', () => {
    const formatter = new HtmlTableFormatter();

    const songWithHtmlEntities = createSong([
      createLine([
        createChordLyricsPair('Am', '<h1>Let it</h1>'),
      ]),
    ]);

    const expectedChordSheet =
      '<table>' +
        '<tr>' +
          '<td class="chord">Am</td>' +
        '</tr>' +
        '<tr>' +
          `<td class="lyrics">${htmlEntitiesEncode('<h1>Let it</h1>')} </td>` +
        '</tr>' +
      '</table>';

    expect(formatter.format(songWithHtmlEntities)).toEqual(expectedChordSheet);
  });
});
