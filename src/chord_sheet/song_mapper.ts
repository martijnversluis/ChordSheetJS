import Item from './item';
import Line from './line';
import Song from './song';
import SongBuilder from '../song_builder';

export type MapItemsCallback = (_item: Item) => Item | Item[] | null;

class SongMapper {
  private song: Song;

  private clonedSong: Song;

  private builder: SongBuilder;

  private addedLine = false;

  constructor(song: Song) {
    this.song = song;
    this.clonedSong = new Song();
    this.builder = new SongBuilder(this.clonedSong);
  }

  mapItems(func: MapItemsCallback): Song {
    this.song.lines.forEach((line) => {
      this.mapLineItems(line, func);
    });

    return this.clonedSong;
  }

  private mapLineItems(line: Line, func: MapItemsCallback) {
    line.items.forEach((item) => {
      this.mapItem(func, item);
    });

    if (line.isEmpty()) {
      this.ensureLine();
    }

    this.addedLine = false;
  }

  private mapItem(func: MapItemsCallback, item: Item) {
    const changedItem = func(item);

    if (changedItem === null) {
      return;
    }

    const isArray = Array.isArray(changedItem);

    if (!isArray || changedItem.length > 0) {
      this.ensureLine();
    }

    if (isArray) {
      changedItem.forEach((i) => this.builder.addItem(i));
    } else {
      this.builder.addItem(changedItem);
    }
  }

  ensureLine() {
    if (!this.addedLine) {
      this.builder.addLine();
      this.addedLine = true;
    }
  }
}

export default SongMapper;
