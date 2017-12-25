import HtmlFormatter from './html_formatter';
import Tag from '../chord_sheet/tag';

const SPACE = '&nbsp;';

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

      this.line += this.column(this.chord(chords) + this.lyrics(lyrics));
    }

    this.dirtyLine = true;
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
