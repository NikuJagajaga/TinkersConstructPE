from PIL import Image
from . import BaseFilter, RGBA
import utils


class TexColorFilter(BaseFilter):

    def __init__(self, tex_path: str):
        tex = Image.open(tex_path)
        self.tex_data = list(tex.getdata())

    def color_pixel(self, rgba: RGBA, index: int) -> RGBA:
        if rgba[3] == 0:
            return rgba
        r = utils.mult_color(self.tex_data[index][0], rgba[0]) & 0xff
        g = utils.mult_color(self.tex_data[index][1], rgba[1]) & 0xff
        b = utils.mult_color(self.tex_data[index][2], rgba[2]) & 0xff
        return (r, g, b, rgba[3])
