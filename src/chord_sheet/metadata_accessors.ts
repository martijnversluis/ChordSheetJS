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
} from './tags';

abstract class MetadataAccessors {
  abstract getMetadataValue(_name: string): string | string[] | null;

  abstract getSingleMetadataValue(_name: string): string | null;

  get key(): string | null { return this.getSingleMetadataValue(KEY); }

  get title(): string | null { return this.getSingleMetadataValue(TITLE); }

  get subtitle(): string | null { return this.getSingleMetadataValue(SUBTITLE); }

  get capo(): string | string[] | null { return this.getMetadataValue(CAPO); }

  get duration(): string | null { return this.getSingleMetadataValue(DURATION); }

  get tempo(): string | null { return this.getSingleMetadataValue(TEMPO); }

  get time(): string | string[] | null { return this.getMetadataValue(TIME); }

  get year(): string | null { return this.getSingleMetadataValue(YEAR); }

  get album(): string | string[] | null { return this.getMetadataValue(ALBUM); }

  get copyright(): string | null { return this.getSingleMetadataValue(COPYRIGHT); }

  get lyricist(): string | string[] | null { return this.getMetadataValue(LYRICIST); }

  get artist(): string | string[] | null { return this.getMetadataValue(ARTIST); }

  get composer(): string | string[] | null { return this.getMetadataValue(COMPOSER); }
}

export default MetadataAccessors;
