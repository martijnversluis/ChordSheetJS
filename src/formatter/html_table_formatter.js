import HtmlFormatter from './html_formatter';
import htmlEntitiesEncode from './html_entities_encode';

export default class HtmlTableFormatter extends HtmlFormatter {
  constructor({ renderBlankLines = true } = {}) {
    super();
    this.renderBlankLines = renderBlankLines;
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

  emptyLine() {
    this.output(this.table(''));
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
    return `<tr>${contents}</tr>`;
  }

  table(contents) {
    const hasContents = !!contents;

    if (hasContents || this.renderBlankLines) {
      const attr = hasContents ? '' : ' class="empty-line"';
      return `<table${attr}>${contents}</table>`;
    }

    return '';
  }
}
