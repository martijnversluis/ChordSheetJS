import { BaseFormatterConfiguration } from './configuration/base_configuration';
import { DeepPartial } from '../utilities';
import { getBaseDefaultConfig } from './configuration/default_config_manager';
import { mergeConfigs } from '../utilities';

/**
 * Base formatter class that provides configuration handling for all formatters
 */
class Formatter<T extends BaseFormatterConfiguration = BaseFormatterConfiguration> {
  configuration: T;

  /**
   * Instantiate
   * @param {DeepPartial<T>} [configuration={}] options
   * @param {boolean} [configuration.evaluate=false] Whether or not to evaluate meta expressions.
   * For more info about meta expressions, see: https://bit.ly/2SC9c2u
   * @param {object} [configuration.metadata={}]
   * @param {string} [configuration.metadata.separator=", "] The separator to be used when rendering a
   * metadata value that has multiple values. See: https://bit.ly/2SC9c2u
   * @param {Key|string} [configuration.key=null] The key to use for rendering. The chord sheet will be
   * transposed from the song's original key (as indicated by the `{key}` directive) to the specified key.
   * Note that transposing will only work if the original song key is set.
   * @param {boolean} [configuration.expandChorusDirective=false] Whether or not to expand `{chorus}` directives
   * by rendering the last defined chorus inline after the directive.
   * @param {boolean} [configuration.useUnicodeModifiers=false] Whether or not to use unicode flat and sharp
   * symbols.
   * @param {boolean} [configuration.normalizeChords=true] Whether or not to automatically normalize chords
   */
  constructor(configuration: DeepPartial<T> = {} as DeepPartial<T>) {
    const defaultConfig = this.getDefaultConfiguration();
    this.configuration = mergeConfigs(defaultConfig, configuration) as T;
  }

  /**
   * Configure the formatter with new options
   * @param {DeepPartial<T>} config New configuration options
   * @returns {this} The formatter instance for chaining
   */
  configure(config: DeepPartial<T>): this {
    this.configuration = mergeConfigs(this.configuration, config) as T;
    return this;
  }

  /**
   * Get the default configuration for this formatter type
   * Should be implemented by subclasses to return the appropriate default configuration
   */
  protected getDefaultConfiguration(): T {
    return getBaseDefaultConfig() as T;
  }
}

export default Formatter;
