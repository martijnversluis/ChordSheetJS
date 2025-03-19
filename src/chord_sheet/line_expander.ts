import Line from './line';
import Song from './song';
import Item from './item';
import Tag from './tag';
import { CHORUS } from '../constants';
import { END_OF_CHORUS, START_OF_CHORUS } from './tags';

class LineExpander {
  line: Line;

  song: Song;

  static expand(line: Line, song: Song): Line[] {
    return new LineExpander(line, song).expand();
  }

  constructor(line: Line, song: Song) {
    this.line = line;
    this.song = song;
  }

  expand(): Line[] {
    const expandedLines = this.line.items.flatMap((item: Item) => {
      if (item instanceof Tag && item.name === CHORUS) {
        return this.getLastChorusBefore(this.line.lineNumber);
      }

      return [];
    });

    return [this.line, ...expandedLines];
  }

  private getLastChorusBefore(lineNumber: number | null): Line[] {
    const lines: Line[] = [];

    if (!lineNumber) {
      return lines;
    }

    for (let i = lineNumber - 1; i >= 0; i -= 1) {
      const line = this.song.lines[i];

      if (line.type !== CHORUS && lines.length > 0) {
        break;
      }

      if (line.type === CHORUS && (line.isEmpty() || this.lineHasMoreThanChorusDirectives(line))) {
        lines.unshift(line);
      }
    }

    return lines;
  }

  private lineHasMoreThanChorusDirectives(line: Line): boolean {
    return line.items.some((item: Item) => {
      if (item instanceof Tag) {
        if (item.name === START_OF_CHORUS || item.name === END_OF_CHORUS) {
          return false;
        }
      }

      return true;
    });
  }
}

export default LineExpander;
