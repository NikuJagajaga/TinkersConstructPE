from PIL import ImageColor
from . import BaseFilter, RGBA
import utils


class SingleColorFilter(BaseFilter):

    def __init__(self, color_hex: str):
        self.color = ImageColor.getcolor(color_hex, "RGBA")

    def color_pixel(self, rgba: RGBA, index: int) -> RGBA:
        if rgba[3] == 0:
            return rgba
        r = utils.mult_color(self.color[0], rgba[0]) & 0xff
        g = utils.mult_color(self.color[1], rgba[1]) & 0xff
        b = utils.mult_color(self.color[2], rgba[2]) & 0xff
        return (r, g, b, rgba[3])
