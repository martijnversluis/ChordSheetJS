import Item from './item';
import Line from './line';
import Song from './song';
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
        return this.getLastChorusBefore(this.line.lineNumber, !item.hasLabel());
      }

      return [];
    });

    return [this.line, ...expandedLines];
  }

  private getLastChorusBefore(lineNumber: number | null, includeStartOfChorusLabel: boolean): Line[] {
    const lines: Line[] = [];

    if (!lineNumber) {
      return lines;
    }

    for (let i = lineNumber - 1; i >= 0; i -= 1) {
      const line = this.song.lines[i];

      if (line.type !== CHORUS && lines.length > 0) {
        break;
      }

      if (line.type === CHORUS && (line.isEmpty() || this.lineHasChorusContent(line, includeStartOfChorusLabel))) {
        lines.unshift(line);
      }
    }

    return lines;
  }

  private lineHasChorusContent(line: Line, includeStartOfChorusLabel: boolean): boolean {
    return line.items.some((item: Item) => {
      if (item instanceof Tag) {
        if (item.name === END_OF_CHORUS) return false;
        if (item.name === START_OF_CHORUS) return includeStartOfChorusLabel && item.hasLabel();
      }

      return true;
    });
  }
}

export default LineExpander;
