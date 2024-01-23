from pathlib import Path
from PIL import Image


def main():
    WORKDIR = Path(__file__).parent
    IMGDIR = WORKDIR / "images"



    #base = Image.open(IMGDIR / "part/binding.png")
    image = Image.new("RGBA", (16 * 16, 16 * 16))
    data = list(image.getdata())

    image.putdata(list(map(lambda rgb: (255, 0, 0), data)))
    image.save(WORKDIR / "images/output/test.png")
    print("done.")



if __name__ == "__main__":
    main()
