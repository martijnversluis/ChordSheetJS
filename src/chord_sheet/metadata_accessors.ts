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

  abstract getSingleMetadata(_name: string): string;

  get key(): string { return this.getSingleMetadata(KEY); }

  get title(): string { return this.getSingleMetadata(TITLE); }

  get subtitle(): string { return this.getSingleMetadata(SUBTITLE); }

  get capo(): string | string[] { return this.getMetadata(CAPO); }

  get duration(): string { return this.getSingleMetadata(DURATION); }

  get tempo(): string { return this.getSingleMetadata(TEMPO); }

  get time(): string | string[] { return this.getMetadata(TIME); }

  get year(): string { return this.getSingleMetadata(YEAR); }

  get album(): string | string[] { return this.getMetadata(ALBUM); }

  get copyright(): string { return this.getSingleMetadata(COPYRIGHT); }

  get lyricist(): string | string[] { return this.getMetadata(LYRICIST); }

  get artist(): string | string[] { return this.getMetadata(ARTIST); }

  get composer(): string | string[] { return this.getMetadata(COMPOSER); }
}

export default MetadataAccessors;
