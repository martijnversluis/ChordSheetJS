import Tag, {
  ARTIST,
  TITLE,
  SUBTITLE,
  COMMENT,
  CAPO,
  START_OF_CHORUS,
  END_OF_CHORUS,
  START_OF_VERSE,
  END_OF_VERSE,
} from '../chord_sheet/tag';
import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';

const NEW_LINE = '\n';
const flatMap = (arr, fn) => arr.reduce((acc, x) => [...acc, ...fn(x)], []);

/**
 * Formats a song into a .tex file for the Latex songs package.
 * http://songs.sourceforge.net/docs.html
 */
class LatexFormatter {
  isHeaderTag(item) {
    return item instanceof Tag && [TITLE, SUBTITLE, ARTIST].indexOf(item.name) !== -1;
  }

  /**
   * Formats a song into .tex file.
   * @param {Song} song The song to be formatted
   * @returns {string} The .tex file contents as string
   */
  format(song) {
    return [
      this.formatHeaderTags(song),
      this.formatOther(song),
      '\\endsong',
    ].join(NEW_LINE);
  }

  formatHeaderTags(song) {
    const headerTags = flatMap(song.lines, line => line.items)
      .filter(this.isHeaderTag)
      .reduce((tmp, tag) => ({
        ...tmp,
        [tag.name]: tag,
      }), {});
    const title = headerTags.title && headerTags.title.value;
    const subtitle = headerTags.subtitle && headerTags.subtitle.value;
    const artist = headerTags.artist ? headerTags.artist.value : '';
    const titleString = title + (subtitle ? ` \\\\ ${subtitle}` : '');
    return `\\beginsong{${titleString}}[by={${artist}}]`;
  }

  formatOther(song) {
    return song.lines.map(line => this.formatLine(line)).join(NEW_LINE);
  }

  formatLine(line) {
    return line.items.map(item => this.formatItem(item)).join('');
  }

  formatItem(item) {
    if (this.isHeaderTag(item)) {
      return '';
    } else if (item instanceof Tag) {
      return this.formatTag(item);
    } else if (item instanceof ChordLyricsPair) {
      return this.formatChordLyricsPair(item);
    }

    return '';
  }

  formatTag(tag) {
    switch (tag.name) {
      case COMMENT:
        return `\\textcomment{${tag.value}}`;
      case CAPO:
        return `\\capo{${tag.value}}`;
      case START_OF_CHORUS:
        return '\\beginchorus';
      case END_OF_CHORUS:
        return '\\endchorus';
      case START_OF_VERSE:
        return '\\beginverse';
      case END_OF_VERSE:
        return '\\endverse';
      default:
        return tag.hasValue()
          ? `\\textcomment{${tag.originalName}: ${tag.value}}`
          : `\\textcomment{${tag.originalName}}`;
    }
  }

  formatChordLyricsPair(chordLyricsPair) {
    return [
      this.formatChordLyricsPairChords(chordLyricsPair),
      this.formatChordLyricsPairLyrics(chordLyricsPair),
    ].join('');
  }

  formatChordLyricsPairChords(chordLyricsPair) {
    if (chordLyricsPair.chords) {
      return `\\[${chordLyricsPair.chords}]`;
    }

    return '';
  }

  formatChordLyricsPairLyrics(chordLyricsPair) {
    return chordLyricsPair.lyrics || '';
  }
}

export default LatexFormatter;
