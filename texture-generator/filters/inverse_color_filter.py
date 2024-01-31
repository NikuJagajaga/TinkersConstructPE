from . import MultiColorFilter, RGBA
import utils


class InverseColorFilter(MultiColorFilter):

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

        r = ~utils.mult_color(color[0], self.brightness_data[index]) & 0xff
        g = ~utils.mult_color(color[1], self.brightness_data[index]) & 0xff
        b = ~utils.mult_color(color[2], self.brightness_data[index]) & 0xff

        return (r, g, b, rgba[3])
