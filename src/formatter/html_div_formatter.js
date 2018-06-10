import HtmlFormatter from './html_formatter';
import htmlEntitiesEncode from './html_entities_encode';

export default class HtmlDivFormatter extends HtmlFormatter {
  constructor({ renderBlankLines = true } = {}) {
    super();
    this.renderBlankLines = renderBlankLines;
    this.line = '';
  }

  hasDirtyLine() {
    return this.line.length > 0;
  }

  outputSong(song) {
    return this.div('chord-sheet', song);
  }

  startOfSong() {
    super.startOfSong();
    this.output('<div class="chord-sheet">');
  }

  endOfSong() {
    super.endOfSong();
    this.output('</div>');
  }

  outputPair(chords, lyrics) {
    this.line += this.column(this.chord(chords) + this.lyrics(lyrics));
  }

  outputComment(comment) {
    this.line += this.comment(comment.value);
  }

  finishLine() {
    const row = this.row(this.line);
    this.output(row);
    this.line = '';
  }

  emptyLine() {
    this.output(this.row(''));
  }

  chord(chord) {
    return this.div('chord', htmlEntitiesEncode(chord));
  }

  lyrics(lyrics) {
    return this.div('lyrics', htmlEntitiesEncode(lyrics));
  }

  comment(comment) {
    return this.div('comment', comment);
  }

  div(cssClasses, value) {
    const attr = cssClasses ? ` class="${cssClasses}"` : '';
    return `<div${attr}>${value}</div>`;
  }

  column(contents) {
    return this.div('column', contents);
  }

  row(contents) {
    let cssClasses = 'row';
    const hasContents = !!contents;

    if (hasContents || this.renderBlankLines) {
      if (!hasContents) {
        cssClasses += ' empty-line';
      }

      return this.div(cssClasses, contents);
    }

    return '';
  }
}
