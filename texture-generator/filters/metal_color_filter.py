import colorsys
from PIL import ImageColor
from . import BaseFilter, RGBA
import utils


class MetalColorFilter(BaseFilter):


    def __init__(self, color_hex: str, shinyness: float, brightness: float, hueshift: float):
        self.color = ImageColor.getcolor(color_hex, "RGBA")
        self.shinyness = shinyness
        self.brightness = brightness
        self.hueshift = hueshift


    def color_pixel(self, rgba: RGBA, index: int) -> RGBA:

        if rgba[3] == 0:
            return rgba
        
        l = utils.perceptual_brightness(rgba) / 255
        ll = l ** 2
        r = utils.mult_color(self.color[0], rgba[0]) & 0xff
        g = utils.mult_color(self.color[1], rgba[1]) & 0xff
        b = utils.mult_color(self.color[2], rgba[2]) & 0xff
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)

        h -= (0.5 - ll) * self.hueshift
        while h < 0: h += 1.0
        while h >= 1.0: h -= 1.0

        if l > 0.9: s = min(max(s - ll * self.shinyness, 0.0), 1.0) # 0.0 - 1.0
        if l > 0.8: v = min(max(v + ll * self.brightness, 0.0), 1.0) # 0.0 - 1.0

        r, g, b = colorsys.hsv_to_rgb(h, s, v)

        return (int(r * 255), int(g * 255), int(b * 255), rgba[3])
