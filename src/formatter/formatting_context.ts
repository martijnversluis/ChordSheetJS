import Configuration from './configuration/configuration';
import Metadata from '../chord_sheet/metadata';

interface FormattingContext {
  configuration: Configuration;
  metadata: Metadata;
}

export default FormattingContext;
