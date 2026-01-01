import {
  DimensionOpts, FillOpts, PositionOpts, RadiusOpts, Renderer, SizeOpts, ThicknessOpts,
} from './renderer';

type ViewBox = [number, number, number, number];

/**
 * Renderer implementation for drawing chord diagrams as SVG markup.
 */
class SVGRenderer implements Renderer {
  content = '';

  viewBox: ViewBox;

  constructor({ viewBox }: { viewBox: ViewBox }) {
    this.viewBox = viewBox;
  }

  output() {
    return this.svgWrapper(this.content);
  }

  svgWrapper(innerHTML: string) {
    return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:svgjs="http://svgjs.com/svgjs"
      preserveAspectRatio="xMidYMid meet"
      viewBox="${this.viewBox.join(' ')}"
    >
      ${innerHTML}
    </svg>
  `;
  }

  circle({
    x, y, size, fill, thickness,
  }: FillOpts & PositionOpts & SizeOpts & ThicknessOpts) {
    this.content += `
      <circle
        r="${size / 2}"
        cx="${x}"
        cy="${y}"
        fill="${fill ? '#000000' : 'none'}"
        stroke-width="${thickness}"
        stroke="#000000"
      ></circle>
    `;
  }

  line({
    x1, y1, x2, y2, thickness,
  }: {
    x1: number, y1: number, x2: number, y2: number,
  } & ThicknessOpts): void {
    this.content += `
      <line
        x1="${x1}"
        y1="${y1}"
        x2="${x2}"
        y2="${y2}"
        stroke-width="${thickness}"
        stroke="#000000"
      ></line>
    `;
  }

  rect({
    x, y, width, height, fill, thickness, radius,
  }: DimensionOpts & FillOpts & PositionOpts & RadiusOpts & ThicknessOpts): void {
    this.content += `
      <rect
        width="${width}"
        height="${height}"
        x="${x}"
        y="${y}"
        fill="${fill ? '#000000' : 'none'}"
        stroke-width="${thickness}"
        stroke="#000000"
        rx="${radius}"
        ry="${radius}"
      ></rect>
    `;
  }

  text(text: string, { fontSize, x, y } : { fontSize: number, x: number, y: number }): void {
    this.content += `
      <text
        x="${x}"
        y="${y}"
        font-family="Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif"
        font-size="${fontSize}"
        text-anchor="middle"
        fill="#000000"
      >${text}</text>
    `;
  }
}

export default SVGRenderer;
