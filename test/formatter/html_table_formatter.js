import chai, { expect } from 'chai';

import '../matchers';
import HtmlTableFormatter from '../../src/formatter/html_table_formatter';
import song from '../fixtures/song';
import { createChordLyricsPair, createLine, createSong } from '../utilities';

chai.use(require('chai-diff'));

describe('HtmlTableFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new HtmlTableFormatter();

    const expectedChordSheet =
      '<h1>Let it be</h1>' +
      '<h2>ChordSheetJS example version</h2>' +
      '<div class="chord-sheet">' +
        '<div class="paragraph">' +
          '<table class="row">' +
            '<tr>' +
              '<td class="comment">Bridge</td>' +
            '</tr>' +
          '</table>' +
        '</div>' +
        '<div class="paragraph verse">' +
          '<table class="row">' +
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
              '<td class="lyrics">be</td>' +
            '</tr>' +
          '</table>' +
          '<table class="row">' +
            '<tr>' +
              '<td class="chord">C</td>' +
              '<td class="chord">F</td>' +
              '<td class="chord">G</td>' +
              '<td class="chord">F</td>' +
              '<td class="chord">C/E</td>' +
              '<td class="chord">Dm</td>' +
              '<td class="chord">C</td>' +
            '</tr>' +
            '<tr>' +
              '<td class="lyrics">Whisper words of </td>' +
              '<td class="lyrics">wis</td>' +
              '<td class="lyrics">dom, let it </td>' +
              '<td class="lyrics">be </td>' +
              '<td class="lyrics"> </td>' +
              '<td class="lyrics"> </td>' +
              '<td class="lyrics"> </td>' +
            '</tr>' +
          '</table>' +
        '</div>' +
        '<div class="paragraph chorus">' +
          '<table class="row">' +
            '<tr>' +
              '<td class="chord">Am</td>' +
              '<td class="chord">Bb</td>' +
              '<td class="chord">F</td>' +
              '<td class="chord">C</td>' +
            '</tr>' +
            '<tr>' +
              '<td class="lyrics">Whisper words of </td>' +
              '<td class="lyrics">wisdom, let it </td>' +
              '<td class="lyrics">be </td>' +
              '<td class="lyrics"></td>' +
            '</tr>' +
          '</table>' +
        '</div>' +
      '</div>';

    expect(formatter.format(song)).to.equalText(expectedChordSheet);
  });

  context('with option renderBlankLines:false', () => {
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
            '<table class="row">' +
              '<tr>' +
                '<td class="chord">C</td>' +
              '</tr>' +
              '<tr>' +
                '<td class="lyrics">Whisper words of wisdom</td>' +
              '</tr>' +
            '</table>' +
          '</div>' +
        '<div class="paragraph">' +
            '<table class="row">' +
              '<tr>' +
                '<td class="chord">Am</td>' +
              '</tr>' +
              '<tr>' +
                '<td class="lyrics">Whisper words of wisdom</td>' +
              '</tr>' +
            '</table>' +
          '</div>' +
        '</div>';

      const formatter = new HtmlTableFormatter({ renderBlankLines: false });

      expect(formatter.format(songWithBlankLine)).to.equalText(expectedChordSheet);
    });
  });
});
