class MetadataConfiguration {
  separator?: string;

  constructor({ separator }: { separator: string}) {
    this.separator = separator;
  }
}

export default MetadataConfiguration;
