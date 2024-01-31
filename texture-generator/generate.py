from PIL import Image, ImageChops
from main import IN_DIR, OUT_DIR
from materials import MATERIALS, MODIFIERS


def gen_parts(part_type: str, base_path: str, offset: tuple[int, int] = (0, 0)):

    image_base_def = Image.open(IN_DIR / base_path)

    for mat in MATERIALS:
        if mat.filter:

            image_base = image_base_def

            if mat.suffix != "":
                filename, ext = str(base_path).rsplit(".", 1)
                filepath = IN_DIR / f"{filename}_{mat.suffix}.{ext}"
                if filepath.exists():
                    image_base = Image.open(filepath)
            
            if offset != (0, 0):
                image_base = ImageChops.offset(image_base, *offset)
            
            image = mat.filter.apply(image_base)
            image.save(OUT_DIR / f"part/tconpart_{part_type}_{mat.key}.png")


def gen_tool(tool_type: str, parts_count: int):

    image = Image.new("RGBA", (256, 256))
    base_dir = IN_DIR / ("tool_" + tool_type)

    for part in range(parts_count + 1):

        image_base_def = Image.open(base_dir / f"part{part}.png")

        for i, mat in enumerate(MATERIALS):

            img = image_base_def

            if mat.suffix != "":
                filename, ext = str(base_dir / f"part{part}.png").rsplit(".", 1)
                filepath = IN_DIR / f"{filename}_{mat.suffix}.{ext}"
                if filepath.exists():
                    img = Image.open(filepath)

            if mat.filter:
                img = mat.filter.apply(img)

            image.paste(img, ((i % 16) * 16, (i // 16 + part * 2) * 16))

    for i, mod in enumerate(MODIFIERS):
        img = Image.open(base_dir / f"mod_{mod}.png")
        image.paste(img, ((i % 16) * 16, (i // 16 + 14) * 16))

    image.save(OUT_DIR / f"tcontool_{tool_type}.png")

    pass