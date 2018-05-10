import HtmlFormatter from './html_formatter';
import htmlEntitiesEncode from './html_entities_encode';

export default class HtmlTableFormatter extends HtmlFormatter {
  constructor() {
    super();
    this.chordsLine = '';
    this.lyricsLine = '';
  }

  hasDirtyLine() {
    return this.chordsLine.length > 0 || this.lyricsLine.length > 0;
  }

  outputPair(chords, lyrics) {
    this.chordsLine += this.cell('chord', chords);
    this.lyricsLine += this.cell('lyrics', lyrics);
  }

  outputComment(comment) {
    this.lyricsLine += this.comment(comment.value);
  }

  finishLine() {
    this.output(this.table(this.rowContents()));
    this.chordsLine = '';
    this.lyricsLine = '';
  }

  rowContents() {
    let rowContents = '';

    if (this.chordsLine.length) {
      rowContents += this.row(this.chordsLine);
    }

    if (this.lyricsLine.length) {
      rowContents += this.row(this.lyricsLine);
    }

    return rowContents;
  }

  comment(comment) {
    return this.cell('comment', comment);
  }

  cell(cssClass, value) {
    return `<td class="${cssClass}">${htmlEntitiesEncode(value)}</td>`;
  }

  row(contents) {
    const attr = contents ? '' : ' class="empty-line"';
    return `<tr${attr}>${contents}</tr>`;
  }

  table(contents) {
    return `<table>${contents}</table>`;
  }
}
