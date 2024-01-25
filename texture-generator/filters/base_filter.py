from abc import ABC, abstractmethod
from typing import TypeAlias
from PIL import Image


class BaseFilter(ABC):

    RGBA: TypeAlias = tuple[int, int, int, int]
    
    def apply(self, base: Image.Image) -> Image.Image:

        data = list(base.getdata())
        new = Image.new("RGBA", (16, 16))

        self.__pre_process(data)
        data = [self.__color_pixel(rgba, i) for i, rgba in enumerate(data)]
        self.__post_process(data)

        new.putdata(data)
        return new

    @abstractmethod
    def __color_pixel(self, rgba: RGBA, index: int) -> RGBA:
        pass

    def __pre_process(self, data: list[RGBA]):
        pass

    def __post_process(self, data: list[RGBA]):
        pass

