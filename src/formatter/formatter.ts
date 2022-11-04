import Configuration, { ConfigurationProperties } from './configuration/configuration';

/**
 * Base class for all formatters, taking care of receiving a configuration wrapping that inside a Configuration object
 */
class Formatter {
  configuration: Configuration;

  /**
     * Instantiate
     * @param {Object} [configuration={}] options
     * @param {boolean} [configuration.evaluate=false] Whether or not to evaluate meta expressions. For more info about
     * meta expressions, see: https://bit.ly/2SC9c2u
     * @param {object} [configuration.metadata={}]
     * @param {string} [configuration.metadata.separator=", "] The separator to be used when rendering a metadata value
     * that has multiple values. See: https://bit.ly/2SC9c2u
     */
  constructor(configuration: ConfigurationProperties | null = null) {
    this.configuration = new Configuration(configuration || {});
  }
}

export default Formatter;
