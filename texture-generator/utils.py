import math


def mult_color(c1: int, c2: int) -> int:
    return int(c1 * (c2 / 255))

def perceptual_brightness(rgba: tuple[int, int, int, int]) -> int:
    r = 0.241 * (rgba[0] / 255) ** 2
    g = 0.691 * (rgba[1] / 255) ** 2
    b = 0.068 * (rgba[2] / 255) ** 2
    return int(math.sqrt(r + g + b) * 255)

# def rgb2hsv(r: int, g: int, b: int) -> tuple[float, float, float]:
#     min_rgb = min(r, g, b)
#     max_rgb = max(r, g, b)
#     diff = max_rgb - min_rgb
#     h = 0
#     s = 0
#     if diff > 0:
#         s = diff / max_rgb
#         if max_rgb == r:
#             h = 60 * ((g - b) / diff)
#         elif max_rgb == g:
#             h = 60 * ((b - r) / diff) + 120
#         elif max_rgb == b:
#             h = 60 * ((r - g) / diff) + 240
#     return h, s, max_rgb / 255
