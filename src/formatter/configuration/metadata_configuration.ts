export interface MetadataConfigurationProperties {
  separator?: string;
}

export const defaultMetadataConfiguration: MetadataConfigurationProperties = {
  separator: ',',
};

class MetadataConfiguration {
  separator?: string;

  constructor(metadataConfiguration: Partial<MetadataConfigurationProperties> = {}) {
    this.separator = metadataConfiguration.separator || defaultMetadataConfiguration.separator;
  }
}

export default MetadataConfiguration;
