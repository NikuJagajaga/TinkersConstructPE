from PIL import Image


def gen_parts(key: str, path: str = "", slide: tuple[int, int] = (0, 0)):
    image_base = Image.open(path)