from abc import ABC, abstractmethod


class BaseFilter(ABC):
    
    def apply():
        pass

    def __process(self):
        self.__pre_process()

        self.__post_process()

    @abstractmethod
    def __pre_process():
        pass

    @abstractmethod
    def __post_process():
        pass

