import AstComponent from '../ast_component';
import Metadata from '../metadata';

abstract class Evaluatable extends AstComponent {
  abstract evaluate(_metadata: Metadata, _metadataSeparator: string, _variable?: string | null): string;

  abstract clone(): Evaluatable;
}

export default Evaluatable;
