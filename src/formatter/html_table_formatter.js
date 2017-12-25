import HtmlFormatter from './html_formatter';
import Tag from "../chord_sheet/tag";

const SPACE = '&nbsp;';

export default class HtmlTableFormatter extends HtmlFormatter {
  constructor() {
    super();
    this.chordsLine = '';
    this.lyricsLine = '';
  }

  formatItem(item) {
    if (item instanceof Tag) {
      return;
    }

    let chords = item.chords.trim();
    let lyrics = item.lyrics.trim();

    if (chords.length || lyrics.length) {
      if (chords.length > lyrics.length) {
        chords += SPACE;
      } else if (lyrics.length > chords.length) {
        lyrics += SPACE;
      }

      this.chordsLine += this.cell('chord', chords);
      this.lyricsLine += this.cell('lyrics', lyrics);
    }

    this.dirtyLine = true;
  }

  finishLine() {
    const rows = this.row(this.chordsLine) + this.row(this.lyricsLine);
    this.output(this.table(rows));
    this.chordsLine = '';
    this.lyricsLine = '';
  }

  cell(cssClass, value) {
    return `<td class="${cssClass}">${value}</td>`;
  }

  row(contents) {
    const attr = contents ? '' : ' class="empty-line"';
    return `<tr${attr}>${contents}</tr>`;
  }

  table(contents) {
    return `<table>${contents}</table>`;
  }
}
