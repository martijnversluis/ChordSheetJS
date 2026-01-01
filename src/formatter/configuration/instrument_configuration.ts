export interface InstrumentConfigurationProperties {
  type?: string;
  description?: string;
}

class InstrumentConfiguration {
  type?: string;

  description?: string;

  constructor(instrumentConfiguration: Partial<InstrumentConfigurationProperties> = {}) {
    this.type = instrumentConfiguration.type;
    this.description = instrumentConfiguration.description;
  }
}

export default InstrumentConfiguration;
