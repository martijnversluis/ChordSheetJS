import Font from './font';
import FontSize from './font_size';

import Tag, {
  CHORDCOLOUR, CHORDFONT, CHORDSIZE, TEXTCOLOUR, TEXTFONT, TEXTSIZE,
} from './tag';

class FontStack {
  fontAndColourStacks: Record<string, string[]> = {
    [CHORDCOLOUR]: [],
    [CHORDFONT]: [],
    [TEXTCOLOUR]: [],
    [TEXTFONT]: [],
  };

  sizeStacks: Record<string, FontSize[]> = {
    [CHORDSIZE]: [],
    [TEXTSIZE]: [],
  };

  textFont: Font = new Font();

  chordFont: Font = new Font();

  applyTag(tag: Tag) {
    switch (tag.name) {
      case TEXTFONT:
        this.textFont.font = this.pushOrPopTag(tag);
        break;

      case TEXTSIZE:
        this.textFont.size = this.pushOrPopSizeTag(tag);
        break;

      case TEXTCOLOUR:
        this.textFont.colour = this.pushOrPopTag(tag);
        break;

      case CHORDFONT:
        this.chordFont.font = this.pushOrPopTag(tag);
        break;

      case CHORDSIZE:
        this.chordFont.size = this.pushOrPopSizeTag(tag);
        break;

      case CHORDCOLOUR:
        this.chordFont.colour = this.pushOrPopTag(tag);
        break;

      default:
        break;
    }
  }

  private pushOrPopTag(tag: Tag): string | null {
    let { value }: { value: string | null } = tag;

    if (tag.hasValue()) {
      this.fontAndColourStacks[tag.name].push(value);
    } else {
      this.fontAndColourStacks[tag.name].pop();
      value = this.fontAndColourStacks[tag.name].slice(-1)[0] || null;
    }

    return value;
  }

  private pushOrPopSizeTag(tag: Tag): FontSize | null {
    const { value }: { value: string | null } = tag;

    if (tag.hasValue()) {
      const parent: FontSize | null = this.sizeStacks[tag.name].slice(-1)[0] || null;
      const parsedFontSize: FontSize = FontSize.parse(value, parent);
      this.sizeStacks[tag.name].push(parsedFontSize);
      return parsedFontSize;
    }

    this.sizeStacks[tag.name].pop();
    return this.sizeStacks[tag.name].slice(-1)[0] || null;
  }
}

export default FontStack;
