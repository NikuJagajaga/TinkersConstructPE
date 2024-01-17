const MATERIAL: {name: string, filter?: ColorFilter, suffix?: string}[] = [
    {name: "wood", filter: new MultiColorFilter("#6e572a", "#745f38", "#8e671d")},
    {name: "stone", filter: new SingleColorFilter("#696969")},
    {name: "flint", filter: new SingleColorFilter("#ffffff"), suffix: "contrast"},
    {name: "cactus", suffix: "cactus"},
    {name: "obsidian", filter: new MultiColorFilter("#71589c", "#8f60d4", "#8c53df"), suffix: "contrast"},
    {name: "prismarine", filter: new TexColorFilter(BaseTex.prismarine)},
    {name: "netherrack", filter: new TexColorFilter(BaseTex.netherrack)},
    {name: "endstone", filter: new InverseColorFilter("#5c6296", "#3c4276", "#212a76")},
    {name: "bone", filter: new SingleColorFilter("#ede6bf"), suffix: "bone_base"},
    {name: "paper", suffix: "paper"},
    {name: "sponge", filter: new TexColorFilter(BaseTex.sponge)},
    {name: "firewood", filter: new TexColorFilter(BaseTex.firewood)},
    {name: "slime", filter: new SingleColorFilter("#82c873")},
    {name: "blueslime", filter: new SingleColorFilter("#74c8c7")},
    {name: "magmaslime", filter: new MultiColorFilter("#a8673b", "#ff8c49", "#ff9d3d")},
    {name: "knightslime", filter: new MetalColorFilter("#685bd0", 0, 0.5, 0.3)},
    {name: "iron", filter: new MetalColorFilter("#cacaca", 0, 0.3, 0)},
    {name: "pigiron", filter: new MetalColorFilter("#d37c78", 0.1, 0.1, 0)},
    {name: "cobalt", filter: new MetalColorFilter("#173b75", 0.25, 0.5, -0.1)},
    {name: "ardite", filter: new MetalTexFilter("#f97217", 0.6, 0.4, 0.1, BaseTex.ardite_rust)},
    {name: "manyullyn", filter: new MetalColorFilter("#a93df5", 0.4, 0.2, -0.1)},
    {name: "copper", filter: new MetalColorFilter("#efa055", 0.25, 0.25, -0.05)},
    {name: "bronze", filter: new MetalColorFilter("#e3bd68", 0.25, 0.15, -0.05)},
    {name: "lead", filter: new MetalColorFilter("#4d4968", 0, 0.15, 0.2)},
    {name: "silver", filter: new MetalColorFilter("#d1ecf6", 1, 0.5, 0.1)},
    {name: "electrum", filter: new MetalColorFilter("#eddd51", 0.15, 0.25, -0.05)},
    {name: "steel", filter: new MetalColorFilter("#888888", 0.1, 0.3, 0.1)}
];

const PARTS: {key: string, path?: string, slide?: {x: number, y: number}}[] = [
    {key: "pickaxe", path: "tool/pickaxe/part1", slide: {x: -2, y: 2}},
    {key: "shovel", path: "tool/shovel/part1", slide: {x: -3, y: 3}},
    {key: "axe", path: "tool/hatchet/part1", slide: {x: -2, y: 4}},
    {key: "broadaxe", path: "tool/lumberaxe/part1", slide: {x: -3, y: 4}},
    {key: "sword", path: "tool/sword/part1", slide: {x: -3, y: 3}},
    {key: "hammer", path: "tool/hammer/part1", slide: {x: -3, y: 3}},
    {key: "excavator", path: "tool/excavator/part1", slide: {x: -3, y: 3}},
    {key: "rod"},
    {key: "rod2"},
    {key: "binding"},
    {key: "binding2"},
    {key: "guard"},
    {key: "largeplate"}
];

const TOOLS = [
    {name: "pickaxe", parts: 3},
    {name: "shovel", parts: 3},
    {name: "hatchet", parts: 3},
    {name: "mattock", parts: 3},
    {name: "sword", parts: 3},
    {name: "hammer", parts: 4},
    {name: "excavator", parts: 4},
    {name: "lumberaxe", parts: 4}
];

const MODIFIERS = [
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
    "web"
];


PARTS.forEach(part => {
    const dir = __dir__ + "texture-source/";
    const baseTex = FileUtil.readImage(dir + (part.path || "part/" + part.key) + ".png");
    let outputPath = "";
    let texture: android.graphics.Bitmap;
    let bitmap: android.graphics.Bitmap;
    let canvas: android.graphics.Canvas;
    let path = "";
    for(let i = 0; i < MATERIAL.length; i++){
        outputPath = __dir__ + "res/items-opaque/part/tconpart_" + part.key + "_" + MATERIAL[i].name + ".png";
        if(FileUtil.isExist(outputPath)){
            continue;
        }
        texture = baseTex;
        if(MATERIAL[i].suffix){
            path = dir + (part.path || "part/" + part.key) + "_" + MATERIAL[i].suffix + ".png";
            if(FileUtil.isExist(path)){
                texture = FileUtil.readImage(path);
            }
        }
        if(part.slide){
            bitmap = new Bitmap.createBitmap(texture.getWidth(), texture.getHeight(), Bitmap.Config.ARGB_8888);
            canvas = new Canvas(bitmap);
            canvas.translate(part.slide.x, part.slide.y);
            canvas.drawBitmap(texture, 0, 0, null);
            texture = bitmap;
        }
        FileUtil.writeImage(outputPath, MATERIAL[i].filter ? MATERIAL[i].filter.applyTo(texture) : texture);
    }
});


TOOLS.forEach(tool => {
    const outputPath = __dir__ + "res/model/tcontool_" + tool.name + ".png";
    if(FileUtil.isExist(outputPath)){
        return;
    }
    const dir = __dir__ + "texture-source/tool/" + tool.name + "/";
    const bitmap: android.graphics.Bitmap = new Bitmap.createBitmap(256, 256, Bitmap.Config.ARGB_8888);
    const canvas = new Canvas(bitmap);
    let baseTex: android.graphics.Bitmap;
    let texture: android.graphics.Bitmap;
    let path = "";
    for(let i = 0; i < tool.parts + 1; i++){
        baseTex = FileUtil.readImage(dir + "part" + i + ".png");
        for(let j = 0; j < MATERIAL.length; j++){
            texture = baseTex;
            if(MATERIAL[j].suffix){
                path = dir + "part" + i + "_" + MATERIAL[j].suffix + ".png";
                if(FileUtil.isExist(path)){
                    texture = FileUtil.readImage(path);
                }
            }
            canvas.drawBitmap(MATERIAL[j].filter ? MATERIAL[j].filter.applyTo(texture) : texture, (j & 15) << 4, (j >> 4) + (i << 1) << 4, null);
        }
    }
    for(let i = 0; i < MODIFIERS.length; i++){
        canvas.drawBitmap(FileUtil.readImage(dir + "mod_" + MODIFIERS[i] + ".png"), i << 4, 14 << 4, null);
    }
    FileUtil.writeImage(outputPath, bitmap);
});