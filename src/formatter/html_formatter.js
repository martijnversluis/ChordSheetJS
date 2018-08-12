import FormatterBase from './formatter_base';

export default class HtmlFormatter extends FormatterBase {
  constructor({ renderBlankLines = true } = {}) {
    super();
    this.renderBlankLines = renderBlankLines;
  }
}
