import Evaluatable from './evaluatable';
import { LITERAL_BRAND, brandPrototype, hasBrand } from '../object_brand';

class Literal extends Evaluatable {
  static [Symbol.hasInstance](instance: unknown): boolean {
    return hasBrand(instance, LITERAL_BRAND);
  }

  string: string;

  constructor(string: string) {
    super();
    this.string = string;
  }

  evaluate(): string {
    return this.string;
  }

  isRenderable(): boolean {
    return true;
  }

  clone(): Literal {
    return new Literal(this.string);
  }
}

brandPrototype(Literal.prototype, LITERAL_BRAND);

export default Literal;
