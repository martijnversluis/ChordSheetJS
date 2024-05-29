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
  abstract getMetadata(_name: string): string | string[] | null;

  abstract getSingleMetadata(_name: string): string | null;

  get key(): string | null { return this.getSingleMetadata(KEY); }

  get title(): string | null { return this.getSingleMetadata(TITLE); }

  get subtitle(): string | null { return this.getSingleMetadata(SUBTITLE); }

  get capo(): string | string[] | null { return this.getMetadata(CAPO); }

  get duration(): string | null { return this.getSingleMetadata(DURATION); }

  get tempo(): string | null { return this.getSingleMetadata(TEMPO); }

  get time(): string | string[] | null { return this.getMetadata(TIME); }

  get year(): string | null { return this.getSingleMetadata(YEAR); }

  get album(): string | string[] | null { return this.getMetadata(ALBUM); }

  get copyright(): string | null { return this.getSingleMetadata(COPYRIGHT); }

  get lyricist(): string | string[] | null { return this.getMetadata(LYRICIST); }

  get artist(): string | string[] | null { return this.getMetadata(ARTIST); }

  get composer(): string | string[] | null { return this.getMetadata(COMPOSER); }
}

export default MetadataAccessors;
