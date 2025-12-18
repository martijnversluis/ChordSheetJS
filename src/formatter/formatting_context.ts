import { BaseFormatterConfiguration } from './configuration';
import Metadata from '../chord_sheet/metadata';

interface FormattingContext {
  configuration: BaseFormatterConfiguration;
  metadata: Metadata;
}

export default FormattingContext;
