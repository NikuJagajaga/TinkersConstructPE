var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Color = android.graphics.Color;
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Paint = android.graphics.Paint;
var FileUtil = /** @class */ (function () {
    function FileUtil() {
    }
    FileUtil.isExist = function (path) {
        var file = new java.io.File(path);
        return file.exists();
    };
    FileUtil.readImage = function (path) {
        var file = new java.io.File(path);
        file.exists() || file.getParentFile().mkdirs();
        var options = new android.graphics.BitmapFactory.Options();
        options.inScaled = false;
        return android.graphics.BitmapFactory.decodeFile(file.getAbsolutePath(), options);
    };
    FileUtil.writeImage = function (path, bitmap) {
        var file = new java.io.File(path);
        file.exists() || file.getParentFile().mkdirs();
        var output = new java.io.FileOutputStream(file);
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output);
        output.close();
    };
    return FileUtil;
}());
var BaseTex = /** @class */ (function () {
    function BaseTex() {
    }
    BaseTex.sponge = FileUtil.readImage(__packdir__ + "assets/resource_packs/vanilla/textures/blocks/sponge.png");
    BaseTex.prismarine = FileUtil.readImage(__packdir__ + "assets/resource_packs/vanilla/textures/blocks/prismarine_bricks.png");
    BaseTex.netherrack = FileUtil.readImage(__packdir__ + "assets/resource_packs/vanilla/textures/blocks/netherrack.png");
    BaseTex.pattern = FileUtil.readImage(__dir__ + "texture-source/base/pattern.png");
    BaseTex.cast = FileUtil.readImage(__dir__ + "texture-source/base/cast.png");
    BaseTex.cobalt = FileUtil.readImage(__dir__ + "texture-source/base/cobalt.png");
    BaseTex.ardite = FileUtil.readImage(__dir__ + "texture-source/base/ardite.png");
    BaseTex.firewood = FileUtil.readImage(__dir__ + "texture-source/base/firewood.png");
    BaseTex.ardite_rust = FileUtil.readImage(__dir__ + "texture-source/base/ardite_rust.png");
    return BaseTex;
}());
var ColorFilter = /** @class */ (function () {
    function ColorFilter() {
    }
    ColorFilter.getX = function (index) {
        return index & 15;
    };
    ColorFilter.getY = function (index) {
        return index >> 4;
    };
    ColorFilter.getIndex = function (x, y) {
        return x + (y << 4);
    };
    ColorFilter.prototype.applyTo = function (baseTex) {
        this.baseTex = baseTex;
        var data = new Array(256);
        for (var i = 0; i < data.length; i++) {
            data[i] = baseTex.getPixel(ColorFilter.getX(i), ColorFilter.getY(i));
        }
        this.processData(data);
        var bitmap = new Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
        for (var i = 0; i < data.length; i++) {
            bitmap.setPixel(ColorFilter.getX(i), ColorFilter.getY(i), data[i]);
        }
        return bitmap;
    };
    ColorFilter.prototype.processData = function (data) {
        this.preProcess(data);
        for (var i = 0; i < data.length; i++) {
            data[i] = this.colorPixel(data[i], i);
        }
        this.postProcess(data);
    };
    ColorFilter.mult = function (c1, c2) {
        return c1 * (c2 / 255) | 0;
    };
    ColorFilter.getPerceptualBrightness = function (color) {
        var r = this.getR(color) / 255;
        var g = this.getG(color) / 255;
        var b = this.getB(color) / 255;
        return Math.sqrt(0.241 * Math.pow(r, 2) + 0.691 * Math.pow(g, 2) + 0.068 * Math.pow(b, 2)) * 255 | 0;
    };
    ColorFilter.getA = function (color) {
        return color >> 24;
    };
    ColorFilter.getR = function (color) {
        return color >> 16 & 0xff;
    };
    ColorFilter.getG = function (color) {
        return color >> 8 & 0xff;
    };
    ColorFilter.getB = function (color) {
        return color & 0xff;
    };
    ColorFilter.colorToHSB = function (r, g, b) {
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var h = 0, s = 0;
        if (min !== max) {
            switch (max) {
                case r:
                    h = 60 * ((g - b) / (max - min));
                    break;
                case g:
                    h = 60 * ((b - r) / (max - min)) + 120;
                    break;
                case b:
                    h = 60 * ((r - g) / (max - min)) + 240;
                    break;
            }
            s = (max - min) / max;
        }
        return [h, s, max / 255];
    };
    return ColorFilter;
}());
var SingleColorFilter = /** @class */ (function (_super) {
    __extends(SingleColorFilter, _super);
    function SingleColorFilter(color) {
        var _this = _super.call(this) || this;
        _this.color = Color.parseColor(color);
        return _this;
    }
    SingleColorFilter.prototype.preProcess = function (data) {
    };
    SingleColorFilter.prototype.colorPixel = function (pixel, index) {
        var a = ColorFilter.getA(pixel);
        if (a === 0) {
            return pixel;
        }
        var r = ColorFilter.mult(ColorFilter.getR(this.color), ColorFilter.getR(pixel)) & 0xff;
        var g = ColorFilter.mult(ColorFilter.getG(this.color), ColorFilter.getG(pixel)) & 0xff;
        var b = ColorFilter.mult(ColorFilter.getB(this.color), ColorFilter.getB(pixel)) & 0xff;
        return Color.argb(a, r, g, b);
    };
    SingleColorFilter.prototype.postProcess = function (data) {
    };
    return SingleColorFilter;
}(ColorFilter));
var MultiColorFilter = /** @class */ (function (_super) {
    __extends(MultiColorFilter, _super);
    function MultiColorFilter(colorLow, colorMid, colorHigh) {
        var _this = _super.call(this) || this;
        _this.colorLow = Color.parseColor(colorLow);
        _this.colorMid = Color.parseColor(colorMid);
        _this.colorHigh = Color.parseColor(colorHigh);
        return _this;
    }
    MultiColorFilter.prototype.preProcess = function (data) {
        this.brightnessData = data.map(function (color) { return ColorFilter.getPerceptualBrightness(color); });
        var min = Math.min.apply(Math, this.brightnessData);
        var max = Math.max.apply(Math, this.brightnessData);
        var diff = (max - min) / 2;
        this.minBrightness = Math.max(min + 1, min + diff * 0.4) | 0;
        this.maxBrightness = Math.min(max - 1, max - diff * 0.3) | 0;
    };
    MultiColorFilter.prototype.colorPixel = function (pixel, index) {
        var a = ColorFilter.getA(pixel);
        if (a === 0) {
            return pixel;
        }
        var color = this.brightnessData[index] < this.minBrightness ? this.colorLow : this.brightnessData[index] > this.maxBrightness ? this.colorHigh : this.colorMid;
        var r = ColorFilter.mult(ColorFilter.getR(color), ColorFilter.getR(pixel)) & 0xff;
        var g = ColorFilter.mult(ColorFilter.getG(color), ColorFilter.getG(pixel)) & 0xff;
        var b = ColorFilter.mult(ColorFilter.getB(color), ColorFilter.getB(pixel)) & 0xff;
        return Color.argb(a, r, g, b);
    };
    MultiColorFilter.prototype.postProcess = function (data) {
        this.brightnessData = null;
    };
    return MultiColorFilter;
}(ColorFilter));
var InverseColorFilter = /** @class */ (function (_super) {
    __extends(InverseColorFilter, _super);
    function InverseColorFilter(colorLow, colorMid, colorHigh) {
        return _super.call(this, colorLow, colorMid, colorHigh) || this;
    }
    InverseColorFilter.prototype.colorPixel = function (pixel, index) {
        var a = ColorFilter.getA(pixel);
        if (a === 0) {
            return pixel;
        }
        var color = this.brightnessData[index] < this.minBrightness ? this.colorLow : this.brightnessData[index] > this.maxBrightness ? this.colorHigh : this.colorMid;
        var r = ~ColorFilter.mult(ColorFilter.getR(color), this.brightnessData[index]) & 0xff;
        var g = ~ColorFilter.mult(ColorFilter.getG(color), this.brightnessData[index]) & 0xff;
        var b = ~ColorFilter.mult(ColorFilter.getB(color), this.brightnessData[index]) & 0xff;
        return Color.argb(a, r, g, b);
    };
    return InverseColorFilter;
}(MultiColorFilter));
var MetalColorFilter = /** @class */ (function (_super) {
    __extends(MetalColorFilter, _super);
    function MetalColorFilter(color, shinyness, brightness, hueshift) {
        var _this = _super.call(this) || this;
        _this.shinyness = shinyness;
        _this.brightness = brightness;
        _this.hueshift = hueshift;
        _this.color = Color.parseColor(color);
        return _this;
    }
    MetalColorFilter.prototype.preProcess = function (data) {
    };
    MetalColorFilter.prototype.colorPixel = function (pixel, index) {
        var a = ColorFilter.getA(pixel);
        if (a === 0) {
            return pixel;
        }
        var l = ColorFilter.getPerceptualBrightness(pixel) / 255;
        var ll = Math.pow(l, 2);
        var r = ColorFilter.mult(ColorFilter.getR(this.color), ColorFilter.getR(pixel)) & 0xff;
        var g = ColorFilter.mult(ColorFilter.getG(this.color), ColorFilter.getG(pixel)) & 0xff;
        var b = ColorFilter.mult(ColorFilter.getB(this.color), ColorFilter.getB(pixel)) & 0xff;
        var hsb = ColorFilter.colorToHSB(r, g, b);
        hsb[0] -= (0.5 - ll) * this.hueshift;
        while (hsb[0] < 0) {
            hsb[0] += 360;
        }
        while (hsb[0] >= 360) {
            hsb[0] -= 360;
        }
        if (l > 0.9) {
            hsb[1] = Math.min(Math.max(hsb[1] - ll * this.shinyness, 0), 1);
        }
        if (l > 0.8) {
            hsb[2] = Math.min(Math.max(hsb[2] + ll * this.brightness, 0), 1);
        }
        return Color.HSVToColor(a, hsb);
    };
    MetalColorFilter.prototype.postProcess = function (data) {
    };
    return MetalColorFilter;
}(ColorFilter));
var MetalTexFilter = /** @class */ (function (_super) {
    __extends(MetalTexFilter, _super);
    function MetalTexFilter(color, shinyness, brightness, hueshift, bitmap) {
        var _this = _super.call(this, color, shinyness, brightness, hueshift) || this;
        _this.texFilter = new TexColorFilter(bitmap);
        return _this;
    }
    MetalTexFilter.prototype.preProcess = function (data) {
        var bitmap = this.texFilter.applyTo(this.baseTex);
        for (var i = 0; i < data.length; i++) {
            data[i] = bitmap.getPixel(ColorFilter.getX(i), ColorFilter.getY(i));
        }
    };
    return MetalTexFilter;
}(MetalColorFilter));
var TexColorFilter = /** @class */ (function (_super) {
    __extends(TexColorFilter, _super);
    function TexColorFilter(bitmap) {
        var _this = _super.call(this) || this;
        _this.texData = new Array(256);
        for (var i = 0; i < _this.texData.length; i++) {
            _this.texData[i] = bitmap.getPixel(ColorFilter.getX(i), ColorFilter.getY(i));
        }
        return _this;
    }
    TexColorFilter.prototype.preProcess = function (data) {
    };
    TexColorFilter.prototype.colorPixel = function (pixel, index) {
        var a = ColorFilter.getA(pixel);
        if (a === 0) {
            return pixel;
        }
        var color = this.texData[index];
        var r = ColorFilter.mult(ColorFilter.getR(color), ColorFilter.getR(pixel)) & 0xff;
        var g = ColorFilter.mult(ColorFilter.getG(color), ColorFilter.getG(pixel)) & 0xff;
        var b = ColorFilter.mult(ColorFilter.getB(color), ColorFilter.getB(pixel)) & 0xff;
        return Color.argb(a, r, g, b);
    };
    TexColorFilter.prototype.postProcess = function (data) {
    };
    return TexColorFilter;
}(ColorFilter));
var PatternFilter = /** @class */ (function (_super) {
    __extends(PatternFilter, _super);
    function PatternFilter() {
        return _super.call(this, BaseTex.pattern) || this;
    }
    PatternFilter.prototype.colorPixel = function (pixel, index) {
        if (ColorFilter.getA(pixel) === 0) {
            return pixel;
        }
        var x = ColorFilter.getX(index);
        var y = ColorFilter.getY(index);
        var color = this.texData[index];
        var a = ColorFilter.getA(color);
        if (a < 64) {
            return pixel;
        }
        var edge = false;
        a = x > 0 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x - 1, y)]) : 0;
        if (a < 64) {
            edge = true;
        }
        a = y < 15 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x, y + 1)]) : 0;
        if (a < 64) {
            edge = true;
        }
        a = x < 15 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x + 1, y)]) : 0;
        if (a < 64) {
            edge = true;
        }
        a = y > 0 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x, y - 1)]) : 0;
        if (a < 64) {
            edge = true;
        }
        var mult = edge ? 0.6 : 0.5;
        var r = Math.min(ColorFilter.getR(pixel) * mult, 255);
        var g = Math.min(ColorFilter.getG(pixel) * mult, 255);
        var b = Math.min(ColorFilter.getB(pixel) * mult, 255);
        return Color.rgb(r, g, b);
    };
    return PatternFilter;
}(TexColorFilter));
var CastFilter = /** @class */ (function (_super) {
    __extends(CastFilter, _super);
    function CastFilter() {
        return _super.call(this, BaseTex.cast) || this;
    }
    CastFilter.prototype.colorPixel = function (pixel, index) {
        if (ColorFilter.getA(pixel) === 0) {
            return pixel;
        }
        var x = ColorFilter.getX(index);
        var y = ColorFilter.getY(index);
        var color = this.texData[index];
        var a = ColorFilter.getA(color);
        if (a > 64 && !(x === 0 || x === 15 || y === 0 || y === 15)) {
            return 0;
        }
        var count = 0;
        var edge = false;
        a = x > 0 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x - 1, y)]) : 0;
        if (a < 64) {
            count++;
            edge = true;
        }
        a = y < 15 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x, y + 1)]) : 0;
        if (a < 64) {
            count++;
            edge = true;
        }
        a = x < 15 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x + 1, y)]) : 0;
        if (a < 64) {
            count++;
            edge = true;
        }
        a = y > 0 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x, y - 1)]) : 0;
        if (a < 64) {
            count -= 3;
            edge = true;
        }
        if (!edge || count === 0) {
            return pixel;
        }
        var mult = count < 0 ? 0.8 : count > 0 ? 1.1 : 1;
        var r = Math.min(ColorFilter.getR(pixel) * mult, 255);
        var g = Math.min(ColorFilter.getG(pixel) * mult, 255);
        var b = Math.min(ColorFilter.getB(pixel) * mult, 255);
        return Color.rgb(r, g, b);
    };
    return CastFilter;
}(TexColorFilter));
var MATERIAL = [
    { name: "wood", filter: new MultiColorFilter("#6e572a", "#745f38", "#8e671d") },
    { name: "stone", filter: new SingleColorFilter("#696969") },
    { name: "flint", filter: new SingleColorFilter("#ffffff"), suffix: "contrast" },
    { name: "cactus", suffix: "cactus" },
    { name: "obsidian", filter: new MultiColorFilter("#71589c", "#8f60d4", "#8c53df"), suffix: "contrast" },
    { name: "prismarine", filter: new TexColorFilter(BaseTex.prismarine) },
    { name: "netherrack", filter: new TexColorFilter(BaseTex.netherrack) },
    { name: "endstone", filter: new InverseColorFilter("#5c6296", "#3c4276", "#212a76") },
    { name: "bone", filter: new SingleColorFilter("#ede6bf"), suffix: "bone_base" },
    { name: "paper", suffix: "paper" },
    { name: "sponge", filter: new TexColorFilter(BaseTex.sponge) },
    { name: "firewood", filter: new TexColorFilter(BaseTex.firewood) },
    { name: "slime", filter: new SingleColorFilter("#82c873") },
    { name: "blueslime", filter: new SingleColorFilter("#74c8c7") },
    { name: "magmaslime", filter: new MultiColorFilter("#a8673b", "#ff8c49", "#ff9d3d") },
    { name: "knightslime", filter: new MetalColorFilter("#685bd0", 0, 0.5, 0.3) },
    { name: "iron", filter: new MetalColorFilter("#cacaca", 0, 0.3, 0) },
    { name: "pigiron", filter: new MetalColorFilter("#d37c78", 0.1, 0.1, 0) },
    { name: "cobalt", filter: new MetalColorFilter("#173b75", 0.25, 0.5, -0.1) },
    { name: "ardite", filter: new MetalTexFilter("#f97217", 0.6, 0.4, 0.1, BaseTex.ardite_rust) },
    { name: "manyullyn", filter: new MetalColorFilter("#a93df5", 0.4, 0.2, -0.1) },
    { name: "copper", filter: new MetalColorFilter("#efa055", 0.25, 0.25, -0.05) },
    { name: "bronze", filter: new MetalColorFilter("#e3bd68", 0.25, 0.15, -0.05) },
    { name: "lead", filter: new MetalColorFilter("#4d4968", 0, 0.15, 0.2) },
    { name: "silver", filter: new MetalColorFilter("#d1ecf6", 1, 0.5, 0.1) },
    { name: "electrum", filter: new MetalColorFilter("#eddd51", 0.15, 0.25, -0.05) },
    { name: "steel", filter: new MetalColorFilter("#888888", 0.1, 0.3, 0.1) }
];
var PARTS = [
    { key: "pickaxe", path: "tool/pickaxe/part1", slide: { x: -2, y: 2 } },
    { key: "shovel", path: "tool/shovel/part1", slide: { x: -3, y: 3 } },
    { key: "axe", path: "tool/hatchet/part1", slide: { x: -2, y: 4 } },
    { key: "broadaxe", path: "tool/lumberaxe/part1", slide: { x: -3, y: 4 } },
    { key: "sword", path: "tool/sword/part1", slide: { x: -3, y: 3 } },
    { key: "hammer", path: "tool/hammer/part1", slide: { x: -3, y: 3 } },
    { key: "excavator", path: "tool/excavator/part1", slide: { x: -3, y: 3 } },
    { key: "rod" },
    { key: "rod2" },
    { key: "binding" },
    { key: "binding2" },
    { key: "guard" },
    { key: "largeplate" }
];
var TOOLS = [
    { name: "pickaxe", parts: 3 },
    { name: "shovel", parts: 3 },
    { name: "hatchet", parts: 3 },
    { name: "mattock", parts: 3 },
    { name: "sword", parts: 3 },
    { name: "hammer", parts: 4 },
    { name: "excavator", parts: 4 },
    { name: "lumberaxe", parts: 4 }
];
var MODIFIERS = [
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
PARTS.forEach(function (part) {
    var dir = __dir__ + "texture-source/";
    var baseTex = FileUtil.readImage(dir + (part.path || "part/" + part.key) + ".png");
    var outputPath;
    var texture;
    var bitmap;
    var canvas;
    var path;
    for (var i = 0; i < MATERIAL.length; i++) {
        outputPath = __dir__ + "res/items-opaque/part/tconpart_" + part.key + "_" + MATERIAL[i].name + ".png";
        if (FileUtil.isExist(outputPath)) {
            continue;
        }
        texture = baseTex;
        if (MATERIAL[i].suffix) {
            path = dir + (part.path || "part/" + part.key) + "_" + MATERIAL[i].suffix + ".png";
            if (FileUtil.isExist(path)) {
                texture = FileUtil.readImage(path);
            }
        }
        if (part.slide) {
            bitmap = new Bitmap.createBitmap(texture.getWidth(), texture.getHeight(), Bitmap.Config.ARGB_8888);
            canvas = new Canvas(bitmap);
            canvas.translate(part.slide.x, part.slide.y);
            canvas.drawBitmap(texture, 0, 0, null);
            texture = bitmap;
        }
        FileUtil.writeImage(outputPath, MATERIAL[i].filter ? MATERIAL[i].filter.applyTo(texture) : texture);
    }
});
TOOLS.forEach(function (tool) {
    var outputPath = __dir__ + "res/model/tcontool_" + tool.name + ".png";
    if (FileUtil.isExist(outputPath)) {
        return;
    }
    var dir = __dir__ + "texture-source/tool/" + tool.name + "/";
    var bitmap = new Bitmap.createBitmap(256, 256, Bitmap.Config.ARGB_8888);
    var canvas = new Canvas(bitmap);
    var i;
    var j;
    var baseTex;
    var texture;
    var path;
    for (i = 0; i < tool.parts + 1; i++) {
        baseTex = FileUtil.readImage(dir + "part" + i + ".png");
        for (j = 0; j < MATERIAL.length; j++) {
            texture = baseTex;
            if (MATERIAL[j].suffix) {
                path = dir + "part" + i + "_" + MATERIAL[j].suffix + ".png";
                if (FileUtil.isExist(path)) {
                    texture = FileUtil.readImage(path);
                }
            }
            canvas.drawBitmap(MATERIAL[j].filter ? MATERIAL[j].filter.applyTo(texture) : texture, (j & 15) << 4, (j >> 4) + (i << 1) << 4, null);
        }
    }
    for (i = 0; i < MODIFIERS.length; i++) {
        canvas.drawBitmap(FileUtil.readImage(dir + "mod_" + MODIFIERS[i] + ".png"), i << 4, 15 << 4, null);
    }
    FileUtil.writeImage(outputPath, bitmap);
});
var SampleFilter = [
    new SingleColorFilter("#684e1e"),
    new SingleColorFilter("#c1c1c1"),
    new SingleColorFilter("#2376dd"),
    new SingleColorFilter("#7146b0")
];
TOOLS.forEach(function (tool) {
    var outputPath1 = __dir__ + "res/items-opaque/tcontool_" + tool.name + ".png";
    var outputPath2 = __dir__ + "gui/tcon/icon/" + tool.name + ".png";
    if (FileUtil.isExist(outputPath1) && FileUtil.isExist(outputPath2)) {
        return;
    }
    var dir = __dir__ + "texture-source/tool/" + tool.name + "/";
    var bitmap1 = new Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
    var canvas1 = new Canvas(bitmap1);
    var texture;
    for (var i = 0; i < tool.parts; i++) {
        texture = FileUtil.readImage(dir + "part" + i + ".png");
        canvas1.drawBitmap(SampleFilter[i].applyTo(texture), 0, 0, null);
    }
    var bitmap2 = new Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
    var canvas2 = new Canvas(bitmap2);
    var paint2 = new Paint();
    paint2.setAlpha(127);
    canvas2.drawBitmap(bitmap1, 0, 0, paint2);
    FileUtil.writeImage(outputPath1, bitmap1);
    FileUtil.writeImage(outputPath2, bitmap2);
});
var genOreTex = function (overlay, file) {
    var outputPath = __dir__ + "res/terrain-atlas/" + file;
    if (FileUtil.isExist(outputPath)) {
        return;
    }
    var bitmap = BaseTex.netherrack.copy(Bitmap.Config.ARGB_8888, true);
    var canvas = new Canvas(bitmap);
    canvas.drawBitmap(overlay, 0, 0, null);
    FileUtil.writeImage(outputPath, bitmap);
};
genOreTex(BaseTex.cobalt, "tcon_ore_cobalt.png");
genOreTex(BaseTex.ardite, "tcon_ore_ardite.png");
