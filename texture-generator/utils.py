import math
import colorsys


def mult_color(c1: int, c2: int) -> int:
    return int(c1 * (c2 / 255))

def perceptual_brightness(rgb: tuple[int, int, int]) -> int:
    r = 0.241 * (rgb[0] / 255) ** 2
    g = 0.691 * (rgb[1] / 255) ** 2
    b = 0.068 * (rgb[2] / 255) ** 2
    return int(math.sqrt(r + g + b) * 255)

# def rgb2hsb(rgb: tuple[int, int, int]) -> tuple[float, float, float]:
#     min_rgb = min(rgb)
#     max_rgb = max(rgb)
#     h = 0
#     s = 0
#     if min_rgb != max_rgb:
#         diff = max_rgb - min_rgb
#         s = diff / max_rgb
#         if max_rgb == rgb[0]:
#             h = 60 * ((rgb[1] - rgb[2]) / diff)
#         elif max_rgb == rgb[1]:
#             h = 60 * ((rgb[2] - rgb[0]) / diff) + 120
#         elif max_rgb == rgb[2]:
#             h = 60 * ((rgb[0] - rgb[1]) / diff) + 240
#         while h < 0:
#             h += 360
#         while h >= 360:
#             h -= 360
#     return (h, s, max_rgb / 255)
