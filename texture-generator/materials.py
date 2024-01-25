from typing import NamedTuple


class MatData(NamedTuple):
    filter: int
    suffix: str = ""


MATERIALS: dict[str, MatData] = {
    "stone": MatData(5, "b")
}