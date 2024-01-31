from PIL import ImageColor
from . import BaseFilter, RGBA
import utils


class MultiColorFilter(BaseFilter):


    def __init__(self, hex_low: str, hex_mid: str, hex_high: str):
        self.color_low = ImageColor.getcolor(hex_low, "RGBA")
        self.color_mid = ImageColor.getcolor(hex_mid, "RGBA")
        self.color_high = ImageColor.getcolor(hex_high, "RGBA")
        self.brightness_data: list[int]
        self.brightness_min: int
        self.brightness_max: int


    def pre_process(self, data: list[RGBA]):
        self.brightness_data = [utils.perceptual_brightness(rgba) for rgba in data]
        b_min = min(self.brightness_data)
        b_max = max(self.brightness_data)
        diff = (b_max - b_min) / 2
        self.brightness_min = max(b_min + 1, int(b_min + diff * 0.4))
        self.brightness_max = min(b_max - 1, int(b_max - diff * 0.3))


    def color_pixel(self, rgba: RGBA, index: int) -> RGBA:

        if rgba[3] == 0:
            return rgba
        
        color: RGBA
        if self.brightness_data[index] < self.brightness_min:
            color = self.color_low
        elif self.brightness_data[index] > self.brightness_max:
            color = self.color_high
        else:
            color = self.color_mid

        r = utils.mult_color(color[0], rgba[0]) & 0xff
        g = utils.mult_color(color[1], rgba[1]) & 0xff
        b = utils.mult_color(color[2], rgba[2]) & 0xff

        return (r, g, b, rgba[3])


    def post_process(self, data: list[RGBA]):
        self.brightness_data = None
