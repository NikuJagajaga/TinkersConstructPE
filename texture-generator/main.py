from pathlib import Path
from gen_parts import gen_parts



class TestClass():

    def func(self, rgba, index):
        return rgba + str(index)

    def test(self):
        data = ["a", "b", "c"]
        #data = list(map(lambda a: self.func(a[1], a[0]), enumerate(data)))
        data = [self.func(rgba, i) for i, rgba in enumerate(data)]
        print(data)


def main():

    WORKDIR = Path(__file__).parent
    IMGDIR = WORKDIR / "images"

    c = TestClass()

    c.test()

    #gen_parts()
    print("done.")


if __name__ == "__main__":
    main()
