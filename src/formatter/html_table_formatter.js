import HtmlFormatter from './html_formatter';

export default class HtmlTableFormatter extends HtmlFormatter {
  constructor() {
    super();
    this.chordsLine = '';
    this.lyricsLine = '';
  }

  outputPair(chords, lyrics) {
    this.chordsLine += this.cell('chord', chords);
    this.lyricsLine += this.cell('lyrics', lyrics);
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
