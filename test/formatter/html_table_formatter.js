import expect from 'expect';
import '../matchers';
import HtmlTableFormatter from '../../src/formatter/html_table_formatter';
import song from '../fixtures/song';

describe('HtmlTableFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new HtmlTableFormatter();

    const expectedChordSheet =
      '<h1>Let it be</h1>' +
      '<h2>ChordSheetJS example version</h2>' +
      '<table>' +
        '<tr>' +
        '<td class="chord"></td>' +
        '<td class="chord">Am</td>' +
        '<td class="chord">C/G</td>' +
        '<td class="chord">F</td>' +
        '<td class="chord">C</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="lyrics">Let it&nbsp;</td>' +
        '<td class="lyrics">be, let it&nbsp;</td>' +
        '<td class="lyrics">be, let it&nbsp;</td>' +
        '<td class="lyrics">be, let it&nbsp;</td>' +
        '<td class="lyrics">be&nbsp;</td>' +
        '</tr>' +
        '</table>' +
        '<table>' +
        '<tr>' +
        '<td class="chord">C</td>' +
        '<td class="chord">G</td>' +
        '<td class="chord">F</td>' +
        '<td class="chord">C/E&nbsp;</td>' +
        '<td class="chord">Dm&nbsp;</td>' +
        '<td class="chord">C&nbsp;</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="lyrics">Whisper words of&nbsp;</td>' +
        '<td class="lyrics">wisdom, let it&nbsp;</td>' +
        '<td class="lyrics">be&nbsp;</td>' +
        '<td class="lyrics"></td>' +
        '<td class="lyrics"></td>' +
        '<td class="lyrics"></td>' +
        '</tr>' +
        '</table>';

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });
});
