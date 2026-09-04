import { PositionedElement } from '../renderer';

export interface ParagraphBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

class ParagraphGroup {
  static calculateBounds(elements: PositionedElement[]): ParagraphBounds {
    const bounds = {
      minX: Number.MAX_VALUE,
      minY: Number.MAX_VALUE,
      maxX: Number.MIN_VALUE,
      maxY: Number.MIN_VALUE,
    };

    elements.forEach((element) => {
      bounds.minX = Math.min(bounds.minX, element.x);
      bounds.minY = Math.min(bounds.minY, element.y);
      bounds.maxX = Math.max(bounds.maxX, element.x + element.width);
      bounds.maxY = Math.max(bounds.maxY, element.y + element.height);
    });

    return bounds;
  }

  static createElement(bounds: ParagraphBounds, className: string): HTMLElement {
    const element = document.createElement('div');
    element.className = className;
    Object.assign(element.style, {
      position: 'absolute',
      left: `${bounds.minX}px`,
      top: `${bounds.minY}px`,
      width: `${bounds.maxX - bounds.minX}px`,
      height: `${bounds.maxY - bounds.minY}px`,
    });
    return element;
  }
}

export default ParagraphGroup;
