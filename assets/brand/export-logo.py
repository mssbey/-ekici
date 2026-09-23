"""Optional logo master export: Python + fontTools; no impact on site builds."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parents[2]
font_path = ROOT / 'assets/brand/Manrope.ttf'


def lettering(text, size, weight, x, baseline, tracking, color):
    font = instantiateVariableFont(TTFont(font_path), {'wght': weight})
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    scale = size / font['head'].unitsPerEm
    result = []
    cursor = x
    for char in text:
        glyph = glyphs[cmap[ord(char)]]
        pen = SVGPathPen(glyphs)
        glyph.draw(pen)
        result.append(f'<path d="{pen.getCommands()}" transform="translate({cursor:.3f} {baseline}) scale({scale:.6f} {-scale:.6f})" fill="{color}"/>')
        cursor += glyph.width * scale + tracking
    font.close()
    return ''.join(result), cursor


mark = (ROOT / 'public/images/logo.svg').read_text(encoding='utf-8')
mark_content = mark.split('>', 1)[1].rsplit('</svg>', 1)[0]
for variant, color in [('light', '#202725'), ('dark', '#F5F6ED')]:
    name, end = lettering('UYSAL', 51, 800, 165, 76, -1.3, color)
    dot, dot_end = lettering('.', 51, 800, end + 1.5, 76, 0, '#D9AB2E')
    subtitle, _ = lettering('OTO KURTARMA', 13.5, 700, 168, 105, 4.6, '#8C7737' if variant == 'light' else '#D8C992')
    width = round(max(dot_end + 10, 496))
    content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="144" viewBox="0 0 {width} 144" fill="none" role="img" aria-labelledby="logo-title"><title id="logo-title">UYSAL OTO KURTARMA</title><g transform="scale(1.5)">{mark_content}</g>{name}{dot}{subtitle}</svg>'
    (ROOT / f'public/images/uysal-logo-{variant}.svg').write_text(content, encoding='utf-8')
    print(f'{variant}: {width} × 144, outlined SVG')
