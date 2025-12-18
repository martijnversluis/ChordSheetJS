import Tag from '../../chord_sheet/tag';

class TitleSeparatorTag extends Tag {
  constructor() {
    super('comment', ' > ');
    this.attributes.__titleSeparator = 'true';
  }

  override get value(): string {
    return ' > ';
  }

  override set value(newValue: string) {
    super.value = newValue;
  }

  override clone(): Tag {
    const clone = new TitleSeparatorTag();
    clone.attributes = { ...this.attributes };
    (clone as any).selector = (this as any).selector;
    (clone as any).isNegated = (this as any).isNegated;
    return clone;
  }
}

export default TitleSeparatorTag;
