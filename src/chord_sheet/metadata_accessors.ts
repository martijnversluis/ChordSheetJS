import {
  ALBUM,
  ARTIST,
  CAPO,
  COMPOSER,
  COPYRIGHT,
  DURATION,
  KEY,
  LYRICIST,
  SUBTITLE,
  TEMPO,
  TIME,
  TITLE,
  YEAR,
} from './tag';

abstract class MetadataAccessors {
  abstract getMetadata(_name: string): string | string[];

  get key() { return this.getMetadata(KEY); }

  get title() { return this.getMetadata(TITLE); }

  get subtitle() { return this.getMetadata(SUBTITLE); }

  get capo() { return this.getMetadata(CAPO); }

  get duration() { return this.getMetadata(DURATION); }

  get tempo() { return this.getMetadata(TEMPO); }

  get time() { return this.getMetadata(TIME); }

  get year() { return this.getMetadata(YEAR); }

  get album() { return this.getMetadata(ALBUM); }

  get copyright() { return this.getMetadata(COPYRIGHT); }

  get lyricist() { return this.getMetadata(LYRICIST); }

  get artist() { return this.getMetadata(ARTIST); }

  get composer() { return this.getMetadata(COMPOSER); }
}

export default MetadataAccessors;
