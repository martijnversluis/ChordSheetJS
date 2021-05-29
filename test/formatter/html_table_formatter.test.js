import { HtmlTableFormatter } from '../../src';

import '../matchers';
import song from '../fixtures/song';
import { createChordLyricsPair, createSong } from '../utilities';

describe('HtmlTableFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new HtmlTableFormatter();

    const expectedChordSheet = '<h1>Let it be</h1>'
      + '<h2>ChordSheetJS example version</h2>'
      + '<div class="chord-sheet">'
        + '<div class="paragraph">'
          + '<table class="row">'
            + '<tr>'
              + '<td class="lyrics">Written by: </td>'
              + '<td class="lyrics">John Lennon,Paul McCartney</td>'
            + '</tr>'
          + '</table>'
        + '</div>'
        + '<div class="paragraph verse">'
          + '<table class="row">'
            + '<tr>'
              + '<td class="chord"></td>'
              + '<td class="chord">Am</td>'
              + '<td class="chord">C/G</td>'
              + '<td class="chord">F</td>'
              + '<td class="chord">C</td>'
            + '</tr>'
            + '<tr>'
              + '<td class="lyrics">Let it </td>'
              + '<td class="lyrics">be, let it </td>'
              + '<td class="lyrics">be, let it </td>'
              + '<td class="lyrics">be, let it </td>'
              + '<td class="lyrics">be</td>'
            + '</tr>'
          + '</table>'
          + '<table class="row">'
            + '<tr>'
              + '<td class="chord">C</td>'
              + '<td class="chord">F</td>'
              + '<td class="chord">G</td>'
              + '<td class="chord">F</td>'
              + '<td class="chord">C/E</td>'
              + '<td class="chord">Dm</td>'
              + '<td class="chord">C</td>'
            + '</tr>'
            + '<tr>'
              + '<td class="lyrics">Whisper words of </td>'
              + '<td class="lyrics">wis</td>'
              + '<td class="lyrics">dom, let it </td>'
              + '<td class="lyrics">be </td>'
              + '<td class="lyrics"> </td>'
              + '<td class="lyrics"> </td>'
              + '<td class="lyrics"></td>'
            + '</tr>'
          + '</table>'
        + '</div>'
        + '<div class="paragraph chorus">'
          + '<table class="row">'
            + '<tr>'
              + '<td class="comment">Breakdown</td>'
            + '</tr>'
          + '</table>'
          + '<table class="row">'
            + '<tr>'
              + '<td class="chord">Am</td>'
              + '<td class="chord">Bb</td>'
              + '<td class="chord">F</td>'
              + '<td class="chord">C</td>'
            + '</tr>'
            + '<tr>'
              + '<td class="lyrics">Whisper words of </td>'
              + '<td class="lyrics">wisdom, let it </td>'
              + '<td class="lyrics">be </td>'
              + '<td class="lyrics"></td>'
            + '</tr>'
          + '</table>'
        + '</div>'
      + '</div>';

    expect(formatter.format(song)).toEqual(expectedChordSheet);
  });

  describe('with option renderBlankLines:false', () => {
    it('does not include HTML for blank lines', () => {
      const songWithBlankLine = createSong([
        [
          createChordLyricsPair('C', 'Whisper words of wisdom'),
        ],

        [],

        [
          createChordLyricsPair('Am', 'Whisper words of wisdom'),
        ],
      ]);

      const expectedChordSheet = '<div class="chord-sheet">'
        + '<div class="paragraph">'
            + '<table class="row">'
              + '<tr>'
                + '<td class="chord">C</td>'
              + '</tr>'
              + '<tr>'
                + '<td class="lyrics">Whisper words of wisdom</td>'
              + '</tr>'
            + '</table>'
          + '</div>'
        + '<div class="paragraph">'
            + '<table class="row">'
              + '<tr>'
                + '<td class="chord">Am</td>'
              + '</tr>'
              + '<tr>'
                + '<td class="lyrics">Whisper words of wisdom</td>'
              + '</tr>'
            + '</table>'
          + '</div>'
        + '</div>';

      const formatter = new HtmlTableFormatter({ renderBlankLines: false });

      expect(formatter.format(songWithBlankLine)).toEqual(expectedChordSheet);
    });
  });

  it('generates a CSS string', () => {
    const expectedCss = `
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
}`.substring(1);

    expect(HtmlTableFormatter.cssString()).toEqual(expectedCss);
  });

  it('generates a scoped CSS string', () => {
    const expectedCss = `
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
}`.substring(1);

    expect(HtmlTableFormatter.cssString('.someScope')).toEqual(expectedCss);
  });

  it('generates a CSS object', () => {
    expect(typeof HtmlTableFormatter.cssObject()).toEqual('object');
  });
});
