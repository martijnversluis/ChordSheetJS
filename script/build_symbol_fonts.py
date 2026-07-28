#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["fonttools==4.60.1"]
# ///

"""Build the small ChordSheetJS PDF fallback fonts from Noto Sans Symbols."""

from base64 import b64encode
from hashlib import sha256
from pathlib import Path

from fontTools import subset
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "script/font-sources/noto-sans-symbols"
OUTPUT_MODULE = ROOT / "src/formatter/pdf_formatter/fonts/ChordSheetSymbolsFonts.base64.ts"
OUTPUT_DIR = ROOT / "tmp/chordsheet-symbol-fonts"
FONTTOOLS_VERSION = "4.60.1"
FONT_FAMILY = "ChordSheet Symbols"
POSTSCRIPT_FAMILY = "ChordSheetSymbols"
COPYRIGHT = (
    "Copyright 2022 The Noto Project Authors; "
    "modifications copyright 2026 ChordSheetJS contributors"
)
FLAT_X_SCALE = 1.20
FLAT_Y_SCALE = 1.15
UNICODES = (
    0x0020,
    0x00B0,
    0x00F8,
    0x0394,
    0x2206,
    0x2300,
    0x25B3,
    0x266D,
    0x266E,
    0x266F,
)
SOURCE_HASHES = {
    "Regular": "aedeec1cd0514930aeeafc4a88a6deff83cda1e6b58086f0b9bb9c7dd0157578",
    "Bold": "5682f6c88d6199623edf026f67a8722697e8c5f409e5249477594e409d657eb0",
}


def transform_flat(font: TTFont) -> None:
    """Make Noto's flat wider and taller while keeping matching metrics."""
    glyph_name = font.getBestCmap()[0x266D]
    glyf = font["glyf"]
    original_glyph = glyf[glyph_name]
    original_glyph.recalcBounds(glyf)
    vertical_advance, top_side_bearing = font["vmtx"][glyph_name]
    vertical_origin = original_glyph.yMax + top_side_bearing
    glyph_set = font.getGlyphSet()
    pen = TTGlyphPen(glyph_set)
    transform_pen = TransformPen(pen, (FLAT_X_SCALE, 0, 0, FLAT_Y_SCALE, 0, 0))
    glyph_set[glyph_name].draw(transform_pen)
    glyf[glyph_name] = pen.glyph()
    glyf[glyph_name].recalcBounds(glyf)
    advance, left_side_bearing = font["hmtx"][glyph_name]
    font["hmtx"][glyph_name] = (
        round(advance * FLAT_X_SCALE),
        round(left_side_bearing * FLAT_X_SCALE),
    )
    font["vmtx"][glyph_name] = (
        vertical_advance,
        round(vertical_origin - glyf[glyph_name].yMax),
    )


def triangle_glyph(bold: bool):
    """Create a cap-height chord-major triangle with a transparent center."""
    pen = TTGlyphPen(None)
    outer_left, outer_right, apex, baseline = 40, 560, 300, 20
    inner_left = 155 if bold else 130
    inner_right = 445 if bold else 470
    inner_apex = 300
    inner_bottom = 125 if bold else 95
    inner_top = 465 if bold else 510

    pen.moveTo((outer_left, baseline))
    pen.lineTo((outer_right, baseline))
    pen.lineTo((apex, 700))
    pen.closePath()
    pen.moveTo((inner_left, inner_bottom))
    pen.lineTo((inner_apex, inner_top))
    pen.lineTo((inner_right, inner_bottom))
    pen.closePath()
    return pen.glyph()


def add_major_triangles(font: TTFont, bold: bool) -> None:
    symbols = {
        0x0394: "chordMajorDelta",
        0x2206: "chordMajorIncrement",
        0x25B3: "chordMajorTriangle",
    }
    glyph_order = [*font.getGlyphOrder(), *symbols.values()]
    font.setGlyphOrder(glyph_order)
    font["maxp"].numGlyphs = len(glyph_order)
    sharp_name = font.getBestCmap()[0x266F]
    sharp = font["glyf"][sharp_name]
    sharp.recalcBounds(font["glyf"])
    vertical_advance, top_side_bearing = font["vmtx"][sharp_name]
    vertical_origin = sharp.yMax + top_side_bearing
    for code_point, glyph_name in symbols.items():
        glyph = triangle_glyph(bold)
        glyph.recalcBounds(font["glyf"])
        font["glyf"].glyphs[glyph_name] = glyph
        font["hmtx"][glyph_name] = (600, 40)
        font["vmtx"][glyph_name] = (vertical_advance, vertical_origin - glyph.yMax)
        for cmap in font["cmap"].tables:
            if cmap.isUnicode():
                cmap.cmap[code_point] = glyph_name


def rename_font(font: TTFont, style: str) -> None:
    font["head"].fontRevision = 1.0
    names = font["name"]
    values = {
        0: COPYRIGHT,
        1: FONT_FAMILY,
        2: style,
        3: f"ChordSheetJS:{POSTSCRIPT_FAMILY}-{style}",
        4: f"{FONT_FAMILY} {style}",
        5: "Version 1.000",
        6: f"{POSTSCRIPT_FAMILY}-{style}",
        16: FONT_FAMILY,
        17: style,
        21: FONT_FAMILY,
        22: style,
    }
    names.names[:] = [record for record in names.names if record.nameID not in values]
    for name_id, value in values.items():
        names.setName(value, name_id, 3, 1, 0x409)
        names.setName(value, name_id, 1, 0, 0)


def subset_font(font: TTFont) -> None:
    options = subset.Options()
    options.hinting = False
    options.layout_features = []
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.name_legacy = True
    options.glyph_names = True
    options.recalc_bounds = True
    options.canonical_order = True
    options.ignore_missing_unicodes = False
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)


def build_face(style: str) -> bytes:
    source = SOURCE_DIR / f"NotoSansSymbols-{style}.ttf"
    actual_hash = sha256(source.read_bytes()).hexdigest()
    if actual_hash != SOURCE_HASHES[style]:
        raise ValueError(f"Unexpected SHA-256 for {source.name}: {actual_hash}")
    font = TTFont(source, recalcBBoxes=True, recalcTimestamp=False)
    transform_flat(font)
    add_major_triangles(font, style == "Bold")
    rename_font(font, style)
    subset_font(font)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / f"{POSTSCRIPT_FAMILY}-{style}.ttf"
    font.save(output, reorderTables=True)
    font.close()
    return output.read_bytes()


def encode_module(regular: bytes, bold: bytes) -> str:
    header = (
        "// Generated by script/build-symbol-fonts.sh. Do not edit directly.\n"
        f"// FontTools {FONTTOOLS_VERSION}; flat scale {FLAT_X_SCALE}x/{FLAT_Y_SCALE}y.\n"
    )
    regular_base64 = b64encode(regular).decode("ascii")
    bold_base64 = b64encode(bold).decode("ascii")
    return (
        f"{header}export const ChordSheetSymbolsRegular = '{regular_base64}';\n\n"
        f"export const ChordSheetSymbolsBold = '{bold_base64}';\n"
    )


def main() -> None:
    regular = build_face("Regular")
    bold = build_face("Bold")
    OUTPUT_MODULE.write_text(encode_module(regular, bold), encoding="utf-8")
    print(f"Wrote {OUTPUT_MODULE.relative_to(ROOT)}")
    print(f"Regular: {len(regular)} bytes; Bold: {len(bold)} bytes")


if __name__ == "__main__":
    main()
