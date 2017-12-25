import HtmlFormatter from './html_formatter';

export default class HtmlDivFormatter extends HtmlFormatter {
  constructor() {
    super();
    this.line = '';
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

  finishLine() {
    const row = this.row(this.line);
    this.output(row);
    this.line = '';
  }

  chord(chord) {
    return this.div('chord', chord);
  }

  lyrics(lyrics) {
    return this.div('lyrics', lyrics);
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

    if (!contents) {
      cssClasses += ' empty-line';
    }

    return this.div(cssClasses, contents);
  }
}
