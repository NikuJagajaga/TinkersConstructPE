from typing import NamedTuple
from main import IN_DIR
from filters import *


class MatData(NamedTuple):
    key: str
    filter: BaseFilter = None
    suffix: str = ""


MATERIALS: list[MatData] = [
    MatData("wood", MultiColorFilter("#6e572a", "#745f38", "#8e671d")),
    MatData("stone", SingleColorFilter("#696969")),
    MatData("flint", SingleColorFilter("#ffffff"), "contrast"),
    MatData("cactus", suffix="cactus"),
    MatData("obsidian", MultiColorFilter("#71589c", "#8f60d4", "#8c53df"), "contrast"),
    MatData("prismarine", TexColorFilter(IN_DIR / "base_tex/prismarine_bricks.png")),
    MatData("netherrack", TexColorFilter(IN_DIR / "base_tex/netherrack.png")),
    MatData("endstone", InverseColorFilter("#5c6296", "#3c4276", "#212a76")),
    MatData("bone", SingleColorFilter("#ede6bf"), "bone_base"),
    MatData("paper", suffix="paper"),
    MatData("sponge", TexColorFilter(IN_DIR / "base_tex/sponge.png")),
    MatData("firewood", TexColorFilter(IN_DIR / "base_tex/firewood.png")),
    MatData("slime", SingleColorFilter("#82c873")),
    MatData("blueslime", SingleColorFilter("#74c8c7")),
    MatData("magmaslime", MultiColorFilter("#a8673b", "#ff8c49", "#ff9d3d")),
    MatData("knightslime", MetalColorFilter("#685bd0", 0.0, 0.5, 0.3)),
    MatData("iron", MetalColorFilter("#cacaca", 0.0, 0.3, 0.0)),
    MatData("pigiron", MetalColorFilter("#d37c78", 0.1, 0.1, 0.0)),
    MatData("cobalt", MetalColorFilter("#173b75", 0.25, 0.5, -0.1)),
    MatData("ardite", MetalTexFilter("#f97217", 0.6, 0.4, 0.1, IN_DIR / "base_tex/ardite_rust.png")),
    MatData("manyullyn", MetalColorFilter("#a93df5", 0.4, 0.2, -0.1)),
    MatData("copper", MetalColorFilter("#efa055", 0.25, 0.25, -0.05)),
    MatData("bronze", MetalColorFilter("#e3bd68", 0.25, 0.15, -0.05)),
    MatData("lead", MetalColorFilter("#4d4968", 0.0, 0.15, 0.2)),
    MatData("silver", MetalColorFilter("#d1ecf6", 1.0, 0.5, 0.1)),
    MatData("electrum", MetalColorFilter("#eddd51", 0.15, 0.25, -0.05)),
    MatData("steel", MetalColorFilter("#888888", 0.1, 0.3, 0.1))
]


MODIFIERS: list[str] = [
    "haste",
    "luck",
    "sharp",
    "diamond",
    "emerald",
    "silk",
    "reinforced",
    "beheading",
    "smite",
    "spider",
    "fiery",
    "necrotic",
    "knockback",
    "mending",
    "shulking",
    "web",
    "soulbound"
]