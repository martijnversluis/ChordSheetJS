export interface MetadataConfigurationProperties {
  separator?: string;
}

export const defaultMetadataConfiguration: MetadataConfigurationProperties = {
  separator: ',',
};

class MetadataConfiguration {
  separator?: string;

  constructor(metadataConfiguration: MetadataConfigurationProperties = defaultMetadataConfiguration) {
    this.separator = metadataConfiguration.separator;
  }
}

export default MetadataConfiguration;
