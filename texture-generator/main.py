from pathlib import Path
import time
import generate


WORKDIR = Path(__file__).parent
IN_DIR = WORKDIR / "images/input"
OUT_DIR = WORKDIR / "images/output"


def main():

    start_time = time.perf_counter()

    (OUT_DIR / "part").mkdir(exist_ok=True)

    generate.gen_parts("pickaxe", "tool_pickaxe/part1.png", (-2, 2))
    generate.gen_parts("shovel", "tool_shovel/part1.png", (-3, 3))
    generate.gen_parts("axe", "tool_hatchet/part1.png", (-2, 4))
    generate.gen_parts("broadaxe", "tool_lumberaxe/part1.png", (-3, 4))
    generate.gen_parts("sword", "tool_sword/part1.png", (-3, 3))
    generate.gen_parts("hammer", "tool_hammer/part1.png", (-3, 3))
    generate.gen_parts("excavator", "tool_excavator/part1.png", (-3, 3))
    generate.gen_parts("rod", "part/rod.png")
    generate.gen_parts("rod2", "part/rod2.png")
    generate.gen_parts("binding", "part/binding.png")
    generate.gen_parts("binding2", "part/binding2.png")
    generate.gen_parts("guard", "part/guard.png")
    generate.gen_parts("largeplate", "part/largeplate.png")
    generate.gen_parts("sharpening", "part/sharpening.png")

    generate.gen_tool("pickaxe", 3)
    generate.gen_tool("shovel", 3)
    generate.gen_tool("hatchet", 3)
    generate.gen_tool("mattock", 3)
    generate.gen_tool("sword", 3)
    generate.gen_tool("hammer", 4)
    generate.gen_tool("excavator", 4)
    generate.gen_tool("lumberaxe", 4)

    print("Done. ({:.2f} sec)".format(time.perf_counter() - start_time))


if __name__ == "__main__":
    main()
