from abc import ABC, abstractmethod
from PIL import Image
from typing import TypeAlias, overload


RGBA: TypeAlias = tuple[int, int, int, int]

class BaseFilter(ABC):

    @overload
    def apply(self, base: Image.Image) -> Image.Image: ...

    @overload
    def apply(self, base: list[RGBA]) -> list[RGBA]: ...
    
    def apply(self, base) -> Image.Image:

        if type(base) is list:
            data = base
            self.__process(data)
            return data

        data = list(base.getdata())
        img = Image.new("RGBA", (16, 16))

        self.__process(data)

        img.putdata(data)
        return img
    

    def __process(self, data: list[RGBA]):
        self.pre_process(data)
        for i, rgba in enumerate(data):
            data[i] = self.color_pixel(rgba, i)
        self.post_process(data)
    

    @abstractmethod
    def color_pixel(self, rgba: RGBA, index: int) -> RGBA:
        pass

    def pre_process(self, data: list[RGBA]):
        pass

    def post_process(self, data: list[RGBA]):
        pass

