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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b, _c, _d, _e, _f, _g, _h;
IMPORT("ToolLib");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("EnhancedRecipes");
IMPORT("ConnectedTexture");
var Color = android.graphics.Color;
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Paint = android.graphics.Paint;
var ColorFilter = android.graphics.PorterDuffColorFilter;
var PorterDuff = android.graphics.PorterDuff;
var Thread = java.lang.Thread;
var ScreenHeight = UI.getScreenHeight();
var setLoadingTip = ModAPI.requireGlobal("MCSystem.setLoadingTip");
//const getAllEntity = ModAPI.requireGlobal("EntityDataRegistry.getAllData");
//const getEntityForType = ModAPI.requireGlobal("EntityDataRegistry.getDataForType");
var SCALE = 5; //GUI Scale
var Cfg = {
    toolLeveling: {
        baseXp: (_a = __config__.getNumber("toolLeveling.baseXp") - 0) !== null && _a !== void 0 ? _a : 500,
        multiplier: (_b = __config__.getNumber("toolLeveling.multiplier") - 0) !== null && _b !== void 0 ? _b : 2
    },
    oreGen: {
        cobaltRate: (_c = __config__.getNumber("oreGen.cobaltRate") - 0) !== null && _c !== void 0 ? _c : 20,
        arditeRate: (_d = __config__.getNumber("oreGen.arditeRate") - 0) !== null && _d !== void 0 ? _d : 20
    },
    oreToIngotRatio: (_e = __config__.getNumber("oreToIngotRatio") - 0) !== null && _e !== void 0 ? _e : 2,
    modifierSlots: (_f = __config__.getNumber("modifierSlots") - 0) !== null && _f !== void 0 ? _f : 3,
    showItemOnTable: (_g = __config__.getBool("showItemOnTable")) !== null && _g !== void 0 ? _g : true,
    checkInsideSmeltery: (_h = __config__.getBool("checkInsideSmeltery")) !== null && _h !== void 0 ? _h : true
};
var MatValue = /** @class */ (function () {
    function MatValue() {
    }
    MatValue.INGOT = 144;
    MatValue.NUGGET = MatValue.INGOT / 9;
    MatValue.FRAGMENT = MatValue.INGOT / 4;
    MatValue.SHARD = MatValue.INGOT / 2;
    MatValue.GEM = 666;
    MatValue.BLOCK = MatValue.INGOT * 9;
    MatValue.SEARED_BLOCK = MatValue.INGOT * 2;
    MatValue.SEARED_MATERIAL = MatValue.INGOT / 2;
    MatValue.GLASS = 1000;
    MatValue.BRICK_BLOCK = MatValue.INGOT * 4;
    MatValue.SLIME_BALL = 250;
    MatValue.ORE = MatValue.INGOT * Cfg.oreToIngotRatio;
    return MatValue;
}());
;
var player;
Callback.addCallback("LevelLoaded", function () {
    player = Player.get();
});
var addLineBreaks = function (length, text) {
    var array = [];
    var words = text.split(" ");
    var i = 0;
    var line;
    var count;
    while (i < words.length) {
        line = [];
        count = 0;
        while (i < words.length && count + words[i].length <= length) {
            line.push(words[i]);
            count += words[i].length;
            i++;
        }
        array.push(line.join(" "));
    }
    return array.join("\n");
};
var isBlockID = function (id) {
    var info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("block");
};
var isItemID = function (id) {
    var info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("item");
};
var createBlock = function (namedID, defineData, material) {
    if (material === void 0) { material = "stone"; }
    var id = IDRegistry.genBlockID(namedID);
    Block.createBlock(namedID, defineData.map(function (data) { return ({
        name: data.name,
        texture: data.texture ? typeof data.texture === "string" ? [[data.texture, 0]] : data.texture.map(function (tex) { return typeof tex === "number" ? [namedID, tex] : tex; }) : [[namedID, 0]],
        inCreative: !data.isTech
    }); }));
    Block.setDestroyTime(id, 3);
    ToolAPI.registerBlockMaterial(id, material);
    return id;
};
var createItem = function (namedID, name, texture, params) {
    if (texture === void 0) { texture = { name: namedID }; }
    var id = IDRegistry.genItemID(namedID);
    Item.createItem(namedID, name, texture, params);
    return id;
};
var createAnimItem = function (x, y, z) {
    var anim = new Animation.Item(x, y, z);
    anim.load();
    anim.setSkylightMode();
    return anim;
};
var registerRotationModel = function (namedID) {
    var texture = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        texture[_i - 1] = arguments[_i];
    }
    var id = BlockID[namedID];
    var texture2 = texture.map(function (tex) { return tex.map(function (t) { return typeof t === "number" ? [namedID, t] : t; }); });
    TileRenderer.setStandartModel(id, texture2[0]);
    for (var i = 0; i < texture2.length; i++) {
        TileRenderer.registerRotationModel(id, i * 4, texture2[i]);
    }
};
var TileBase = /** @class */ (function () {
    function TileBase() {
    }
    return TileBase;
}());
/*
class TileWithoutContainer extends TileBase {
    init(): void {
        delete this.container;
        delete this.liquidStorage;
    }
    destroy(): void {
        this.container = {dropAt: () => {}};
    }
}
*/ 
var BlockModel = /** @class */ (function () {
    function BlockModel() {
    }
    BlockModel.register = function (id, func, meta) {
        if (meta === void 0) { meta = 1; }
        this.data.push({ id: id, func: func, meta: meta });
        this.amount += meta;
    };
    BlockModel.run = function () {
        try {
            var render = void 0;
            var i = 0, j = 0, count = 0;
            for (i = 0; i < this.data.length; i++) {
                for (j = 0; j < this.data[i].meta; j++) {
                    render = new ICRender.Model();
                    render.addEntry(this.data[i].func(BlockRenderer.createModel(), j));
                    BlockRenderer.setStaticICRender(this.data[i].id, j, render);
                    ItemModel.getFor(this.data[i].id, j).setModel(render);
                    setLoadingTip("[TCon]: register render (" + count++ + " / " + this.amount + ")");
                }
            }
        }
        catch (e) {
            alert(e);
        }
    };
    BlockModel.amount = 0;
    BlockModel.data = [];
    return BlockModel;
}());
;
Callback.addCallback("PostLoaded", function () {
    Threading.initThread("tcon_define_render", function () {
        BlockModel.run();
    });
});
var Sound = /** @class */ (function () {
    function Sound(name) {
        this.media = new android.media.MediaPlayer();
        this.media.setDataSource(__dir__ + "res/sounds/tcon/" + name);
        this.media.prepare();
    }
    Sound.prototype.play = function () {
        this.media.start();
    };
    Sound.prototype.pause = function () {
        this.media.pause();
    };
    Sound.prototype.reset = function () {
        this.media.reset();
    };
    Sound.prototype.stop = function () {
        this.media.stop();
        this.media.prepare();
    };
    return Sound;
}());
var soundSaw = new Sound("saw.ogg");
var soundLevelup = new Sound("levelup.ogg");
var MoltenLiquid = /** @class */ (function () {
    function MoltenLiquid() {
    }
    MoltenLiquid.getTexScale = function () {
        return { width: 64, height: this.liquidCount * 32 };
    };
    MoltenLiquid.create = function (key, name, color, type) {
        if (type === void 0) { type = "metal"; }
        var bitmap = new Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
        var canvas = new Canvas(bitmap);
        var paint = new Paint();
        paint.setColorFilter(new ColorFilter(Color.parseColor(color), PorterDuff.Mode.MULTIPLY));
        canvas.drawBitmap(this.baseTex[type], 0, 0, paint);
        UI.TextureSource.put("liquid." + key, bitmap);
        LiquidRegistry.registerLiquid(key, name, ["liquid." + key]);
        var bucket = this.baseTex.bucket.copy(Bitmap.Config.ARGB_8888, true);
        var w;
        var h;
        for (w = 0; w < 16; w++) {
            for (h = 0; h < 16; h++) {
                bucket.getPixel(w, h) === Color.GREEN && bucket.setPixel(w, h, bitmap.getPixel(w, h));
            }
        }
        var path = __dir__ + "res/items-opaque/bucket/tcon_bucket_" + key + ".png";
        var file = new java.io.File(path);
        file.getParentFile().mkdirs();
        FileTools.WriteImage(path, bucket);
    };
    MoltenLiquid.register = function (key, temp) {
        if (temp < 300) {
            return;
        }
        this.data[key] = { y: this.liquidCount * 32, bmp: LiquidRegistry.getLiquidUIBitmap(key, 16, 16), temp: temp - 300 };
        this.liquidCount++;
    };
    MoltenLiquid.createAndRegister = function (key, name, temp, color, type) {
        if (type === void 0) { type = "metal"; }
        this.create(key, name, color, type);
        this.register(key, temp);
    };
    MoltenLiquid.isExist = function (key) {
        return key in this.data;
    };
    MoltenLiquid.getY = function (key) {
        return this.isExist(key) ? this.data[key].y : -1;
    };
    MoltenLiquid.getTemp = function (key) {
        return this.isExist(key) ? this.data[key].temp : -1;
    };
    MoltenLiquid.setup = function () {
        var path = __dir__ + "res/model/tcon_liquids.png";
        var scale = this.getTexScale();
        var bitmap = new Bitmap.createBitmap(scale.width, scale.height, Bitmap.Config.ARGB_8888);
        var canvas = new Canvas(bitmap);
        var i = 0;
        for (var key in this.data) {
            for (i = 0; i < 8; i++) {
                canvas.drawBitmap(this.data[key].bmp, (i & 3) << 4, (i >> 2 << 4) + this.data[key].y, null);
            }
        }
        var file = new java.io.File(path);
        file.getParentFile().mkdirs();
        file.createNewFile();
        FileTools.WriteImage(path, bitmap);
        var liquids = Object.keys(this.data).filter(function (liq) { return liq !== "water" && liq !== "lava" && liq !== "milk"; });
        var id = createItem("tcon_bucket", "Tinkers Bucket", { name: "bucket" }, { isTech: true });
        Item.registerNameOverrideFunction(id, function (item) { return LiquidRegistry.getLiquidName(liquids[item.data]) + " Bucket"; });
        Item.registerIconOverrideFunction(id, function (item) { return ({ name: "tcon_bucket_" + liquids[item.data] }); });
        liquids.forEach(function (liq, i) {
            LiquidRegistry.registerItem(liq, { id: VanillaItemID.bucket, data: 0 }, { id: id, data: i });
        });
    };
    MoltenLiquid.initAnim = function (tile, posX, posY, posZ, scaleX, scaleY, scaleZ, useThread) {
        var _this = this;
        if (useThread) {
            tile.liquidStorage.setAmount = function (liquid, amount) {
                tile.liquidStorage.liquidAmounts[liquid] = amount;
                _this.updateAnimInThread(tile);
            };
        }
        tile.render = new Render();
        tile.anim = new Animation.Base(tile.x + posX, tile.y + posY - 1.5, tile.z + posZ);
        tile.anim.height = 0;
        tile.anim.scaleX = scaleX;
        tile.anim.scaleY = scaleY;
        tile.anim.scaleZ = scaleZ;
        tile.anim.describe({ render: tile.render.getID(), skin: "model/tcon_liquids.png" });
        tile.anim.load();
        tile.anim.setSkylightMode();
        var stored = tile.liquidStorage.getLiquidStored();
        if (stored) {
            tile.anim.height = tile.liquidStorage.getRelativeAmount(stored);
            tile.render.setPart("head", [{
                    type: "box",
                    uv: { x: 0, y: this.getY(stored) },
                    coords: { x: 0, y: -tile.anim.height * 16 * scaleY / 2, z: 0 },
                    size: { x: 16 * scaleX, y: 16 * scaleY * tile.anim.height, z: 16 * scaleZ }
                }], this.getTexScale());
            tile.anim.refresh();
        }
    };
    MoltenLiquid.updateAnim = function (tile) {
        var stored = tile.liquidStorage.getLiquidStored();
        var add = (tile.liquidStorage.getRelativeAmount(stored) - tile.anim.height) * 0.2;
        var box = [];
        var needRefresh = false;
        if (stored) {
            if (Math.abs(add) > 0.01) {
                tile.anim.height += add;
                tile.anim.height = Math.round(tile.anim.height * 100) / 100;
                box.push({
                    type: "box",
                    uv: { x: 0, y: this.getY(stored) },
                    coords: { x: 0, y: -tile.anim.height * 16 * tile.anim.scaleY / 2, z: 0 },
                    size: { x: 16 * tile.anim.scaleX, y: 16 * tile.anim.scaleY * tile.anim.height, z: 16 * tile.anim.scaleZ }
                });
                needRefresh = true;
            }
        }
        else if (tile.anim.height !== 0) {
            tile.anim.height = 0;
            needRefresh = true;
        }
        if (needRefresh) {
            tile.render.setPart("head", box, this.getTexScale());
            tile.anim.refresh();
        }
        return needRefresh;
    };
    MoltenLiquid.updateAnimInThread = function (tile) {
        var _this = this;
        var threadName = "tcon_liqanim_" + tile.x + ":" + tile.y + ":" + tile.z;
        var thread = Threading.getThread(threadName);
        if (thread && thread.isAlive()) {
            return;
        }
        Threading.initThread(threadName, function () {
            var stored;
            var diff;
            var box;
            var needRefresh;
            while (tile.isLoaded) {
                stored = tile.liquidStorage.getLiquidStored();
                diff = tile.liquidStorage.getRelativeAmount(stored) - tile.anim.height;
                box = [];
                needRefresh = false;
                if (stored) {
                    tile.anim.height += diff * 0.1;
                    tile.anim.height = Math.round(tile.anim.height * 1000) / 1000;
                    if (Math.abs(diff) > 0.01) {
                        box = [{
                                type: "box",
                                uv: { x: 0, y: _this.getY(stored) },
                                coords: { x: 0, y: -tile.anim.height * 16 * tile.anim.scaleY / 2, z: 0 },
                                size: { x: 16 * tile.anim.scaleX, y: 16 * tile.anim.scaleY * tile.anim.height, z: 16 * tile.anim.scaleZ }
                            }];
                        needRefresh = true;
                    }
                }
                else if (tile.anim.height !== 0) {
                    tile.anim.height = 0;
                    needRefresh = true;
                }
                if (needRefresh) {
                    tile.render.setPart("head", box, _this.getTexScale());
                    tile.anim.refresh();
                }
                else {
                    break;
                }
                Thread.sleep(20);
            }
        });
    };
    MoltenLiquid.baseTex = {
        metal: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_metal.png"),
        stone: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_stone.png"),
        other: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_other.png"),
        bucket: FileTools.ReadImage(__dir__ + "texture-source/liquid/bucket.png")
    };
    MoltenLiquid.liquidCount = 0;
    MoltenLiquid.data = {};
    return MoltenLiquid;
}());
MoltenLiquid.register("water", 532);
MoltenLiquid.register("lava", 769);
MoltenLiquid.register("milk", 320);
MoltenLiquid.createAndRegister("molten_iron", "Molten Iron", 769, "#a81212");
MoltenLiquid.createAndRegister("molten_gold", "Molten Gold", 532, "#f6d609");
MoltenLiquid.createAndRegister("molten_pigiron", "Molten Pig Iron", 600, "#ef9e9b");
MoltenLiquid.createAndRegister("molten_cobalt", "Molten Cobalt", 950, "#2882d4");
MoltenLiquid.createAndRegister("molten_ardite", "Molten Ardite", 860, "#d14210");
MoltenLiquid.createAndRegister("molten_manyullyn", "Molten Manyullyn", 1000, "#a15cf8");
MoltenLiquid.createAndRegister("molten_knightslime", "Molten Knightslime", 370, "#d236ff");
MoltenLiquid.createAndRegister("molten_alubrass", "Molten Aluminum Brass", 500, "#ece347");
MoltenLiquid.createAndRegister("molten_brass", "Molten Brass", 470, "#ede38b");
MoltenLiquid.createAndRegister("molten_copper", "Molten Copper", 542, "#ed9f07");
MoltenLiquid.createAndRegister("molten_tin", "Molten Tin", 350, "#c1cddc");
MoltenLiquid.createAndRegister("molten_bronze", "Molten Bronze", 475, "#e3bd68");
MoltenLiquid.createAndRegister("molten_zinc", "Molten Zinc", 375, "#d3efe8");
MoltenLiquid.createAndRegister("molten_lead", "Molten Lead", 400, "#4d4968");
MoltenLiquid.createAndRegister("molten_nickel", "Molten Nickel", 727, "#c8d683");
MoltenLiquid.createAndRegister("molten_silver", "Molten Silver", 480, "#d1ecf6");
MoltenLiquid.createAndRegister("molten_electrum", "Molten Electrum", 500, "#e8db49");
MoltenLiquid.createAndRegister("molten_steel", "Molten Steel", 681, "#a7a7a7");
MoltenLiquid.createAndRegister("molten_aluminum", "Molten Aluminum", 330, "#efe0d5");
MoltenLiquid.createAndRegister("molten_stone", "Seared Stone", 800, "#777777", "stone");
MoltenLiquid.createAndRegister("molten_obsidian", "Molten Obsidian", 1000, "#2c0d59", "stone");
MoltenLiquid.createAndRegister("molten_clay", "Molten Clay", 700, "#c67453", "stone");
MoltenLiquid.createAndRegister("molten_dirt", "Liquid Dirt", 500, "#a68564", "stone");
MoltenLiquid.createAndRegister("molten_emerald", "Molten Emerald", 999, "#58e78e");
MoltenLiquid.createAndRegister("molten_glass", "Molten Glass", 625, "#c0f5fe");
MoltenLiquid.createAndRegister("blood", "Blood", 336, "#540000", "other");
MoltenLiquid.createAndRegister("purpleslime", "Liquid Purple Slime", 520, "#a81212", "other");
Callback.addCallback("PostLoaded", function () {
    MoltenLiquid.setup();
});
var SmelteryFuel = /** @class */ (function () {
    function SmelteryFuel() {
    }
    SmelteryFuel.addFuel = function (liquid, amount, duration, temp) {
        if (temp < 300) {
            return;
        }
        this.data[liquid] = { amount: amount, duration: duration, temp: temp - 300 };
    };
    SmelteryFuel.getFuel = function (liquid) {
        return this.data[liquid];
    };
    SmelteryFuel.data = {};
    return SmelteryFuel;
}());
SmelteryFuel.addFuel("lava", 50, 100, 1000);
var MeltingRecipe = /** @class */ (function () {
    function MeltingRecipe() {
    }
    MeltingRecipe.calcTemp = function (liquid, amount) {
        return Math.pow((amount / MatValue.BLOCK), this.LOG9_2) * MoltenLiquid.getTemp(liquid) | 0;
    };
    MeltingRecipe.addRecipe = function (item, liquid, amount, temp) {
        if (temp === void 0) { temp = this.calcTemp(liquid, amount); }
        this.recipeItem[typeof item === "number" ? item : item.id + ":" + item.data] = {
            liquid: liquid,
            amount: amount,
            temp: temp
        };
    };
    MeltingRecipe.addRecipeForAmount = function (item, liquid, amount, timeAmount) {
        this.addRecipe(item, liquid, amount, this.calcTemp(liquid, timeAmount));
    };
    MeltingRecipe.getRecipe = function (id, data) {
        return this.recipeItem[id + ":" + data] || this.recipeItem[id];
    };
    MeltingRecipe.isExist = function (id, data) {
        return (id + ":" + data) in this.recipeItem || id in this.recipeItem || false;
    };
    MeltingRecipe.getAllRecipeForRV = function () {
        var list = [];
        var split;
        for (var key in this.recipeItem) {
            split = key.split(":");
            list.push({
                input: [{ id: parseInt(split[0]), count: 1, data: split[1] ? parseInt(split[1]) : 0 }],
                output: [],
                outputLiq: { liquid: this.recipeItem[key].liquid, amount: this.recipeItem[key].amount },
                temp: this.recipeItem[key].temp
            });
        }
        return list;
    };
    MeltingRecipe.addEntRecipe = function (entityType, liquid, amount) {
        this.recipeEnt[entityType] = { liquid: liquid, amount: amount };
    };
    MeltingRecipe.getEntRecipe = function (ent) {
        var entityType = Entity.getType(ent);
        return this.recipeEnt[entityType];
    };
    MeltingRecipe.LOG9_2 = Math.LN2 / Math.log(9);
    MeltingRecipe.recipeItem = {};
    MeltingRecipe.recipeEnt = {};
    return MeltingRecipe;
}());
MeltingRecipe.addRecipe(VanillaBlockID.ice, "water", 1000, 305 - 300);
MeltingRecipe.addRecipe(VanillaBlockID.packed_ice, "water", 2000, 310 - 300);
MeltingRecipe.addRecipe(VanillaBlockID.snow, "water", 1000, 305 - 300);
MeltingRecipe.addRecipe(VanillaItemID.snowball, "water", 125, 301 - 300);
MeltingRecipe.addRecipe(VanillaItemID.rotten_flesh, "blood", 40);
MeltingRecipe.addRecipeForAmount(VanillaBlockID.stone, "molten_stone", MatValue.SEARED_MATERIAL, MatValue.ORE);
MeltingRecipe.addRecipeForAmount(VanillaBlockID.cobblestone, "molten_stone", MatValue.SEARED_MATERIAL, MatValue.ORE);
MeltingRecipe.addRecipe(VanillaBlockID.obsidian, "molten_obsidian", MatValue.ORE);
MeltingRecipe.addRecipe(VanillaItemID.horsearmoriron, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.horsearmorgold, "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaBlockID.rail, "molten_iron", MatValue.INGOT * 6 / 16);
MeltingRecipe.addRecipe(VanillaBlockID.activator_rail, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.detector_rail, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.golden_rail, "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipeForAmount(VanillaBlockID.dirt, "molten_dirt", MatValue.INGOT, MatValue.BRICK_BLOCK);
MeltingRecipe.addRecipe(VanillaItemID.clay_ball, "molten_clay", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.clay, "molten_clay", MatValue.BRICK_BLOCK);
MeltingRecipe.addRecipe(VanillaBlockID.emerald_ore, "molten_emerald", MatValue.GEM * Cfg.oreToIngotRatio);
MeltingRecipe.addRecipe(VanillaItemID.emerald, "molten_emerald", MatValue.GEM);
MeltingRecipe.addRecipe(VanillaBlockID.emerald_block, "molten_emerald", MatValue.GEM * 9);
MeltingRecipe.addRecipe(VanillaBlockID.sand, "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe(VanillaBlockID.glass, "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe(VanillaBlockID.glass_pane, "molten_glass", MatValue.GLASS * 6 / 16);
MeltingRecipe.addRecipe(VanillaItemID.glass_bottle, "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe(VanillaItemID.iron_nugget, "molten_iron", MatValue.NUGGET);
MeltingRecipe.addRecipe(VanillaItemID.iron_ingot, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.iron_block, "molten_iron", MatValue.BLOCK);
MeltingRecipe.addRecipe(VanillaItemID.gold_nugget, "molten_gold", MatValue.NUGGET);
MeltingRecipe.addRecipe(VanillaItemID.gold_ingot, "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.gold_block, "molten_gold", MatValue.BLOCK);
MeltingRecipe.addRecipe(VanillaBlockID.heavy_weighted_pressure_plate, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaBlockID.light_weighted_pressure_plate, "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.compass, "molten_iron", MatValue.INGOT * 4);
MeltingRecipe.addRecipe(VanillaItemID.clock, "molten_gold", MatValue.INGOT * 4);
MeltingRecipe.addRecipe(VanillaItemID.golden_helmet, "molten_gold", MatValue.INGOT * 5);
MeltingRecipe.addRecipe(VanillaItemID.golden_chestplate, "molten_gold", MatValue.INGOT * 8);
MeltingRecipe.addRecipe(VanillaItemID.golden_leggings, "molten_gold", MatValue.INGOT * 7);
MeltingRecipe.addRecipe(VanillaItemID.golden_boots, "molten_gold", MatValue.INGOT * 4);
MeltingRecipe.addRecipe(VanillaItemID.golden_pickaxe, "molten_gold", MatValue.INGOT * 3);
MeltingRecipe.addRecipe(VanillaItemID.golden_axe, "molten_gold", MatValue.INGOT * 3);
MeltingRecipe.addRecipe(VanillaItemID.golden_sword, "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.golden_shovel, "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaItemID.golden_hoe, "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.iron_helmet, "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe(VanillaItemID.iron_chestplate, "molten_iron", MatValue.INGOT * 8);
MeltingRecipe.addRecipe(VanillaItemID.iron_leggings, "molten_iron", MatValue.INGOT * 7);
MeltingRecipe.addRecipe(VanillaItemID.iron_boots, "molten_iron", MatValue.INGOT * 4);
MeltingRecipe.addRecipe(VanillaItemID.iron_pickaxe, "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe(VanillaItemID.iron_axe, "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe(VanillaItemID.iron_sword, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.iron_shovel, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaItemID.iron_hoe, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.bucket, "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe(VanillaBlockID.hopper, "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe(VanillaBlockID.iron_bars, "molten_iron", MatValue.INGOT * 6 / 16);
MeltingRecipe.addRecipe(VanillaItemID.minecart, "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe(VanillaItemID.shears, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.shield, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.tripwire_hook, "molten_iron", MatValue.INGOT / 2);
MeltingRecipe.addRecipe(VanillaBlockID.iron_door, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaBlockID.cauldron, "molten_iron", MatValue.INGOT * 7);
MeltingRecipe.addRecipe(VanillaBlockID.anvil, "molten_iron", MatValue.BLOCK * 3 + MatValue.INGOT * 4);
MeltingRecipe.addRecipe(VanillaBlockID.iron_ore, "molten_iron", MatValue.ORE);
MeltingRecipe.addRecipe(VanillaBlockID.gold_ore, "molten_gold", MatValue.ORE);
MeltingRecipe.addEntRecipe(1, "blood", 20); //Native.EntityType.PLAYER
MeltingRecipe.addEntRecipe(Native.EntityType.ZOMBIE, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.ZOMBIE_VILLAGER, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.ZOMBIE_VILLAGE_V2, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.PIG_ZOMBIE, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.ZOMBIE_HORSE, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.COW, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.PIG, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.SHEEP, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.CHICKEN, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.WOLF, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.CAT, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.RABBIT, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.HORSE, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.LLAMA, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.IRON_GOLEM, "molten_iron", 18);
MeltingRecipe.addEntRecipe(Native.EntityType.SNOW_GOLEM, "water", 100);
MeltingRecipe.addEntRecipe(Native.EntityType.VILLAGER, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(Native.EntityType.VILLAGER_V2, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(Native.EntityType.VINDICATOR, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(Native.EntityType.EVOCATION_ILLAGER, "molten_emerald", 6);
//MeltingRecipe.addEntRecipe(Native.EntityType.ILLUSIONER, "molten_emerald", 6);
var AlloyRecipe = /** @class */ (function () {
    function AlloyRecipe() {
    }
    AlloyRecipe.addRecipe = function (result) {
        var inputs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            inputs[_i - 1] = arguments[_i];
        }
        this.data.push({ inputs: inputs.map(function (input) { return ({ liquid: input.liquid, amount: input.amount }); }), result: result });
    };
    AlloyRecipe.alloyAlloys = function (liquids, liquidStorage) {
        this.data.forEach(function (recipe) {
            if (recipe.inputs.every(function (input) { return liquids[input.liquid] >= input.amount; })) {
                recipe.inputs.forEach(function (input) {
                    liquidStorage.getLiquid(input.liquid, input.amount);
                });
                liquidStorage.addLiquid(recipe.result.liquid, recipe.result.amount);
            }
        });
    };
    AlloyRecipe.data = [];
    return AlloyRecipe;
}());
AlloyRecipe.addRecipe({ liquid: "molten_obsidian", amount: 36 }, { liquid: "water", amount: 125 }, { liquid: "lava", amount: 125 });
AlloyRecipe.addRecipe({ liquid: "molten_clay", amount: 144 }, { liquid: "water", amount: 250 }, { liquid: "molten_stone", amount: 72 }, { liquid: "molten_dirt", amount: 144 });
AlloyRecipe.addRecipe({ liquid: "molten_pigiron", amount: 144 }, { liquid: "molten_iron", amount: 144 }, { liquid: "blood", amount: 40 }, { liquid: "molten_clay", amount: 72 });
AlloyRecipe.addRecipe({ liquid: "molten_knightslime", amount: 72 }, { liquid: "molten_iron", amount: 72 }, { liquid: "purpleslime", amount: 125 }, { liquid: "molten_stone", amount: 144 });
AlloyRecipe.addRecipe({ liquid: "molten_manyullyn", amount: 2 }, { liquid: "molten_cobalt", amount: 2 }, { liquid: "molten_ardite", amount: 2 });
AlloyRecipe.addRecipe({ liquid: "molten_bronze", amount: 4 }, { liquid: "molten_copper", amount: 3 }, { liquid: "molten_tin", amount: 1 });
AlloyRecipe.addRecipe({ liquid: "molten_alubrass", amount: 4 }, { liquid: "molten_copper", amount: 1 }, { liquid: "molten_aluminum", amount: 3 });
AlloyRecipe.addRecipe({ liquid: "molten_electrum", amount: 2 }, { liquid: "molten_gold", amount: 1 }, { liquid: "molten_silver", amount: 1 });
;
var CastingRecipe = /** @class */ (function () {
    function CastingRecipe() {
    }
    CastingRecipe.addRecipe = function (type, id, liquid, result, consume, amount) {
        var resultID;
        var resultData;
        if (typeof result === "number") {
            resultID = result;
            resultData = 0;
        }
        else {
            resultID = result.id;
            resultData = result.data;
        }
        this[type][id] = this[type][id] || {};
        this[type][id][liquid] = { id: resultID, data: resultData, consume: consume, amount: amount };
    };
    CastingRecipe.getLimits = function (type, id) {
        var limits = {};
        if (this[type][id] && typeof this[type][id] === "object") {
            if (this.capacity[id]) {
                limits.__global = this.capacity[id];
            }
            for (var key in this[type][id]) {
                if (this[type][id][key].amount) {
                    limits[key] = this[type][id][key].amount;
                }
            }
        }
        return limits;
    };
    CastingRecipe.getClayCastID = function (type) {
        return ItemID["tcon_claycast_" + type];
    };
    CastingRecipe.getCastID = function (type) {
        return ItemID["tcon_cast_" + type];
    };
    CastingRecipe.addTableRecipe = function (id, liquid, result, consume, amount) {
        this.addRecipe("table", id, liquid, result, consume, amount);
    };
    CastingRecipe.addTableRecipeForBoth = function (type, liquid, result, amount) {
        this.addTableRecipe(this.getClayCastID(type), liquid, result, true, amount);
        this.addTableRecipe(this.getCastID(type), liquid, result, false, amount);
    };
    CastingRecipe.addMakeCastRecipes = function (id, type) {
        var claycast = this.getClayCastID(type);
        var cast = this.getCastID(type);
        if (claycast) {
            this.addTableRecipe(id, "molten_clay", claycast, true, MatValue.INGOT * 2);
        }
        if (cast) {
            this.addTableRecipe(id, "molten_gold", cast, true, MatValue.INGOT * 2);
            this.addTableRecipe(id, "molten_alubrass", cast, true, MatValue.INGOT);
        }
    };
    CastingRecipe.addBasinRecipe = function (id, liquid, result, amount) {
        if (amount === void 0) { amount = MatValue.BLOCK; }
        this.addRecipe("basin", id, liquid, result, id !== 0, amount);
    };
    CastingRecipe.getTableRecipe = function (id, liquid) {
        return this.table[id] ? this.table[id][liquid] : undefined;
    };
    CastingRecipe.getBasinRecipe = function (id, liquid) {
        return this.basin[id] ? this.basin[id][liquid] : undefined;
    };
    CastingRecipe.getAllRecipeForRV = function (type) {
        var list = [];
        var key;
        var liquid;
        var id;
        var limits;
        var result;
        for (key in this[type]) {
            id = parseInt(key);
            limits = this.getLimits(type, id);
            for (liquid in this[type][id]) {
                result = this[type][id][liquid];
                list.push({
                    input: [{ id: id, count: 1, data: 0 }],
                    output: [{ id: result.id, count: 1, data: result.data }],
                    inputLiq: { liquid: liquid, amount: limits[liquid] || limits.__global },
                    consume: result.consume
                });
            }
        }
        return list;
    };
    CastingRecipe.setDefaultCapacity = function (id, capacity) {
        this.capacity[id] = capacity;
    };
    CastingRecipe.getTableLimits = function (id) {
        return this.getLimits("table", id);
    };
    CastingRecipe.getBasinLimits = function (id) {
        return this.getLimits("basin", id);
    };
    CastingRecipe.isValidLiquidForTable = function (id, liquid) {
        if (id in this.table) {
            return liquid in this.table[id];
        }
        return false;
    };
    CastingRecipe.isValidLiquidForBasin = function (id, liquid) {
        if (id in this.basin) {
            return liquid in this.basin[id];
        }
        return false;
    };
    CastingRecipe.calcCooldownTime = function (liquid, amount) {
        return 24 + MoltenLiquid.getTemp(liquid) * amount / 1600;
    };
    CastingRecipe.table = {};
    CastingRecipe.basin = {};
    CastingRecipe.capacity = {};
    return CastingRecipe;
}());
CastingRecipe.addTableRecipe(0, "molten_glass", VanillaBlockID.glass_pane, false, MatValue.GLASS * 6 / 16);
CastingRecipe.addBasinRecipe(0, "molten_iron", VanillaBlockID.iron_block);
CastingRecipe.addBasinRecipe(0, "molten_gold", VanillaBlockID.gold_block);
CastingRecipe.addBasinRecipe(0, "molten_obsidian", VanillaBlockID.obsidian, 288);
CastingRecipe.addTableRecipeForBoth("ingot", "molten_iron", VanillaItemID.iron_ingot);
CastingRecipe.addTableRecipeForBoth("ingot", "molten_gold", VanillaItemID.gold_ingot);
CastingRecipe.addTableRecipeForBoth("ingot", "molten_clay", VanillaItemID.brick);
CastingRecipe.addTableRecipeForBoth("nugget", "molten_iron", VanillaItemID.iron_nugget);
CastingRecipe.addTableRecipeForBoth("nugget", "molten_gold", VanillaItemID.gold_nugget);
CastingRecipe.addTableRecipeForBoth("gem", "molten_emerald", VanillaItemID.emerald);
CastingRecipe.addBasinRecipe(0, "molten_emerald", VanillaBlockID.emerald_block, MatValue.GEM * 9);
CastingRecipe.addBasinRecipe(0, "molten_clay", VanillaBlockID.hardened_clay, MatValue.INGOT * 4);
CastingRecipe.addBasinRecipe(VanillaBlockID.stained_hardened_clay, "water", VanillaBlockID.hardened_clay, 250);
CastingRecipe.addBasinRecipe(VanillaBlockID.sand, "blood", { id: VanillaBlockID.sand, data: 1 }, 10);
CastingRecipe.setDefaultCapacity(VanillaItemID.bucket, 1000);
Callback.addCallback("PreLoaded", function () {
    var empty;
    var full;
    for (var key in LiquidRegistry.EmptyByFull) {
        empty = LiquidRegistry.EmptyByFull[key];
        if (empty.id === VanillaItemID.bucket && empty.data === 0) {
            full = key.split(":").map(function (v) { return parseInt(v); });
            CastingRecipe.addTableRecipe(VanillaItemID.bucket, empty.liquid, { id: full[0], data: full[1] === -1 ? 0 : full[1] }, true);
        }
    }
});
createBlock("tcon_grout", [{ name: "Grout" }]);
Recipes2.addShapelessWith2x2({ item: "block:tcon_grout", count: 2 }, ["sand", "gravel", "clay_ball"]);
Recipes2.addShapeless({ id: BlockID.tcon_grout, count: 8 }, [{ id: VanillaBlockID.sand, count: 4 }, { id: VanillaBlockID.gravel, count: 4 }, VanillaBlockID.clay]);
createItem("tcon_brick", "Seared Brick");
Recipes.addFurnace(BlockID.tcon_grout, ItemID.tcon_brick);
createBlock("tcon_stone", [
    { name: "Seared Stone", texture: [0] },
    { name: "Seared Cobblestone", texture: [1] },
    { name: "Seared Paver", texture: [2] },
    { name: "Seared Bricks", texture: [3] },
    { name: "Cracked Seared Bricks", texture: [4] },
    { name: "Fancy Seared Bricks", texture: [5] },
    { name: "Square Seared Bricks", texture: [6] },
    { name: "Seared Road", texture: [7] },
    { name: "Seared Creeperface", texture: [2, 2, 8] },
    { name: "Triangle Seared Bricks", texture: [9] },
    { name: "Small Seared Bricks", texture: [10] },
    { name: "Seared Tiles", texture: [11] },
]);
Item.addCreativeGroup("tcon_stone", "Seared Stones", [BlockID.tcon_stone]);
MeltingRecipe.addRecipe(BlockID.tcon_stone, "molten_stone", MatValue.SEARED_BLOCK);
MeltingRecipe.addRecipe(ItemID.tcon_brick, "molten_stone", MatValue.SEARED_MATERIAL);
MeltingRecipe.addRecipeForAmount(BlockID.tcon_grout, "molten_stone", MatValue.SEARED_MATERIAL, MatValue.SEARED_MATERIAL / 3);
CastingRecipe.addTableRecipeForBoth("ingot", "molten_stone", ItemID.tcon_brick, MatValue.SEARED_MATERIAL);
CastingRecipe.addBasinRecipe(0, "molten_stone", { id: BlockID.tcon_stone, data: 0 }, MatValue.SEARED_BLOCK);
CastingRecipe.addBasinRecipe(VanillaBlockID.cobblestone, "molten_stone", { id: BlockID.tcon_stone, data: 1 }, MatValue.SEARED_MATERIAL * 3);
Recipes2.addShapedWith2x2({ item: "block:tcon_stone", data: 3 }, "aa:aa", { a: "item:tcon_brick" });
Recipes.addFurnace(BlockID.tcon_stone, 3, BlockID.tcon_stone, 4);
(function () {
    var addRecipe = function (input, output) {
        Recipes2.addShapelessWith2x2({ item: "block:tcon_stone", data: output }, [{ item: "block:tcon_stone", data: input }], "tcon_stone_" + output);
    };
    addRecipe(0, 2);
    addRecipe(7, 2);
    addRecipe(2, 3);
    addRecipe(3, 5);
    addRecipe(5, 6);
    addRecipe(11, 7);
    addRecipe(9, 8);
    addRecipe(6, 9);
    addRecipe(8, 10);
    addRecipe(10, 11);
})();
createBlock("tcon_tank", [
    { name: "Seared Tank", texture: [["tcon_stone", 6], ["tcon_stone", 6], 0] },
    { name: "Seared Glass", texture: [["tcon_seared_glass", 0], ["tcon_seared_glass", 0], 1] },
    { name: "Seared Window", texture: [["tcon_seared_glass", 0], ["tcon_seared_glass", 0], 2] }
]);
Item.addCreativeGroup("tcon_tank", "Seared Tanks", [BlockID.tcon_tank]);
Recipes2.addShaped({ id: BlockID.tcon_tank, data: 0 }, "aaa:aba:aaa", { a: ItemID.tcon_brick, b: VanillaBlockID.glass });
Recipes2.addShaped({ id: BlockID.tcon_tank, data: 1 }, "aba:aba:aba", { a: ItemID.tcon_brick, b: VanillaBlockID.glass });
Recipes2.addShaped({ id: BlockID.tcon_tank, data: 2 }, "aba:bbb:aba", { a: ItemID.tcon_brick, b: VanillaBlockID.glass });
BlockModel.register(BlockID.tcon_tank, function (model, index) {
    model.addBox(0 / 16, 0 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, BlockID.tcon_tank, index);
    index === 0 && model.addBox(2 / 16, 16 / 16, 2 / 16, 14 / 16, 18 / 16, 14 / 16, BlockID.tcon_tank, 0);
    return model;
}, 3);
Block.registerDropFunction("tcon_tank", function () { return []; });
Item.registerNameOverrideFunction(BlockID.tcon_tank, function (item, name) { return item.extra ? name + "\n§7" + LiquidRegistry.getLiquidName(item.extra.getString("stored")) + ": " + (item.extra.getInt("amount")) + " mB" : name; });
Block.registerPlaceFunction(BlockID.tcon_tank, function (coords, item, block) {
    var c = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
    World.setBlock(c.x, c.y, c.z, item.id, item.data);
    var tile = World.addTileEntity(c.x, c.y, c.z);
    item.extra && tile.liquidStorage.addLiquid(item.extra.getString("stored"), item.extra.getInt("amount"));
});
var SearedTank = /** @class */ (function (_super) {
    __extends(SearedTank, _super);
    function SearedTank() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearedTank.prototype.init = function () {
        this.liquidStorage.setLimit(null, 4000);
        MoltenLiquid.initAnim(this, 0.5, 0, 0.5, 31 / 32, 31 / 32, 31 / 32, true);
    };
    SearedTank.prototype.destroy = function () {
        this.anim && this.anim.destroy();
    };
    SearedTank.prototype.click = function (id, count, data) {
        var stored = this.liquidStorage.getLiquidStored();
        var amount = this.liquidStorage.getAmount(stored);
        var liquid = LiquidRegistry.getItemLiquid(id, data);
        if (MoltenLiquid.isExist(liquid)) {
            if (!stored || stored === liquid && amount + 1000 <= this.liquidStorage.getLimit(stored)) {
                var empty = LiquidRegistry.getEmptyItem(id, data);
                this.liquidStorage.addLiquid(liquid, 1000);
                Player.decreaseCarriedItem();
                Player.addItemToInventory(empty.id, 1, empty.data);
            }
            return true;
        }
        var full = LiquidRegistry.getFullItem(id, data, stored);
        if (full && amount >= 1000) {
            this.liquidStorage.getLiquid(stored, 1000);
            Player.decreaseCarriedItem();
            Player.addItemToInventory(full.id, 1, full.data);
            return true;
        }
        return false;
    };
    SearedTank.prototype.consumeFuel = function () {
        var liquid = this.liquidStorage.getLiquidStored();
        var amount = this.liquidStorage.getAmount(liquid);
        var fuelData = SmelteryFuel.getFuel(liquid);
        if (fuelData && amount >= fuelData.amount) {
            this.liquidStorage.getLiquid(liquid, fuelData.amount);
            return { duration: fuelData.duration, temp: fuelData.temp };
        }
        return null;
    };
    SearedTank.prototype.destroyBlock = function () {
        var liquid = this.liquidStorage.getLiquidStored();
        var extra;
        if (liquid) {
            extra = new ItemExtraData();
            extra.putString("stored", liquid);
            extra.putInt("amount", this.liquidStorage.getAmount(liquid));
        }
        World.drop(this.x + 0.5, this.y, this.z + 0.5, this.blockID, 1, World.getBlock(this.x, this.y, this.z).data, extra);
    };
    return SearedTank;
}(TileBase));
var FluidTileInterface = /** @class */ (function (_super) {
    __extends(FluidTileInterface, _super);
    function FluidTileInterface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FluidTileInterface.prototype.addLiquid = function (liquid, amount, onlyFullAmount) {
        var limit = this.liquidStorage.getLimit(liquid);
        var stored = this.liquidStorage.getAmount(liquid);
        var result = Math.round(stored + amount * 1000);
        var left = result - Math.min(limit, result);
        if (!onlyFullAmount || left <= 0) {
            this.liquidStorage.setAmount(liquid, result - left);
            return Math.max(left / 1000, 0);
        }
        return amount;
    };
    FluidTileInterface.prototype.getLiquid = function (liquid, amount, onlyFullAmount) {
        var amountMilli = Math.round(amount * 1000);
        var stored = this.liquidStorage.getAmount(liquid);
        if (!this.liquidStorage.getLiquid_flag && this.tileEntity && stored < amountMilli) {
            this.liquidStorage.getLiquid_flag = true;
            this.tileEntity.requireMoreLiquid(liquid, amountMilli - stored);
            this.liquidStorage.getLiquid_flag = false;
            stored = this.liquidStorage.getAmount(liquid);
        }
        var got = Math.min(stored, amountMilli);
        if (!onlyFullAmount || got >= amountMilli) {
            this.liquidStorage.setAmount(liquid, stored - got);
            return got / 1000;
        }
        return 0;
    };
    return FluidTileInterface;
}(TileBase));
var TankInterface = /** @class */ (function (_super) {
    __extends(TankInterface, _super);
    function TankInterface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TankInterface.prototype.canReceiveLiquid = function (liquid, side) {
        var stored = this.liquidStorage.getLiquidStored();
        return !stored || stored === liquid;
    };
    return TankInterface;
}(FluidTileInterface));
TileEntity.registerPrototype(BlockID.tcon_tank, new SearedTank());
StorageInterface.createInterface(BlockID.tcon_tank, new TankInterface());
createBlock("tcon_drain", [{ name: "Seared Drain", texture: [0, 0, 1, 0, 0, 0] }]);
registerRotationModel("tcon_drain", [0, 0, 1, 0, 0, 0]);
Recipes2.addShaped(BlockID.tcon_drain, "a_a:a_a:a_a", { a: ItemID.tcon_brick });
var SearedDrain = /** @class */ (function (_super) {
    __extends(SearedDrain, _super);
    function SearedDrain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearedDrain.prototype.setController = function (tile) {
        this.controller = tile;
    };
    SearedDrain.prototype.init = function () {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
    };
    SearedDrain.prototype.destroy = function () {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    };
    SearedDrain.prototype.click = function (id, count, data) {
        if (this.controller && this.controller.isLoaded) {
            var liquid = LiquidRegistry.getItemLiquid(id, data);
            if (MoltenLiquid.isExist(liquid)) {
                var total = this.controller.totalLiquidAmount();
                var capacity = this.controller.getLiquidCapacity();
                if (total + 1000 <= capacity) {
                    var empty = LiquidRegistry.getEmptyItem(id, data);
                    this.interface.addLiquid(liquid, 1, true);
                    Player.decreaseCarriedItem();
                    Player.addItemToInventory(empty.id, 1, empty.data);
                }
                return true;
            }
            liquid = this.interface.getLiquidStored();
            var full = LiquidRegistry.getFullItem(id, data, liquid);
            if (full && this.controller.liquidStorage.getAmount(liquid) >= 1000) {
                this.interface.getLiquid(liquid, 1, true);
                Player.decreaseCarriedItem();
                Player.addItemToInventory(full.id, 1, full.data);
                return true;
            }
        }
        return false;
    };
    return SearedDrain;
}(TileBase));
var DrainInterface = /** @class */ (function (_super) {
    __extends(DrainInterface, _super);
    function DrainInterface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DrainInterface.prototype.getSmelteryInterface = function () {
        var tile = this.tileEntity.controller;
        return tile && tile.isLoaded ? tile.interface : null;
    };
    DrainInterface.prototype.addLiquid = function (liquid, amount, onlyFullAmount) {
        var inteface = this.getSmelteryInterface();
        return inteface ? inteface.addLiquid(liquid, amount, onlyFullAmount) : amount;
    };
    DrainInterface.prototype.getLiquid = function (liquid, amount, onlyFullAmount) {
        var inteface = this.getSmelteryInterface();
        return inteface ? inteface.getLiquid(liquid, amount, onlyFullAmount) : 0;
    };
    DrainInterface.prototype.getLiquidStored = function (storage, side) {
        var inteface = this.getSmelteryInterface();
        return inteface ? inteface.getLiquidStored(storage, side) : null;
    };
    return DrainInterface;
}(TileBase));
TileEntity.registerPrototype(BlockID.tcon_drain, new SearedDrain());
TileRenderer.setRotationPlaceFunction(BlockID.tcon_drain);
StorageInterface.createInterface(BlockID.tcon_drain, new DrainInterface());
createBlock("tcon_faucet", [
    { name: "Seared Faucet" },
    { name: "faucet", isTech: true },
    { name: "faucet", isTech: true },
    { name: "faucet", isTech: true }
]);
Recipes2.addShaped(BlockID.tcon_faucet, "a_a:_a_", { a: ItemID.tcon_brick });
Block.registerPlaceFunction("tcon_faucet", function (coords, item, block) {
    if (coords.side < 2) {
        return;
    }
    var c = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
    World.setBlock(c.x, c.y, c.z, item.id, coords.side - 2 ^ 1);
});
BlockModel.register(BlockID.tcon_faucet, function (model, index) {
    var addBox = function (x1, y1, z1, x2, y2, z2) {
        switch (index) {
            case 0:
                model.addBox(x1 / 16, y1 / 16, z1 / 16, x2 / 16, y2 / 16, z2 / 16, "tcon_faucet", 0);
                break;
            case 1:
                model.addBox(x1 / 16, y1 / 16, (16 - z2) / 16, x2 / 16, y2 / 16, (16 - z1) / 16, "tcon_faucet", 0);
                break;
            case 2:
                model.addBox(z1 / 16, y1 / 16, x1 / 16, z2 / 16, y2 / 16, x2 / 16, "tcon_faucet", 0);
                break;
            case 3:
                model.addBox((16 - z2) / 16, y1 / 16, x1 / 16, (16 - z1) / 16, y2 / 16, x2 / 16, "tcon_faucet", 0);
                break;
        }
        /*
        if(index & 1){
            z1 = 16 - z2;
            z2 = 16 - z1;
        }
        if(index >> 1){
            [x1, z1] = [z1, x1];
            [x2, z2] = [z2, x2];
        }
        model.addBox(x1 / 16, y1 / 16, z1 / 16, x2 / 16, y2 / 16, z2 / 16, "tcon_faucet", 0);
        */
    };
    addBox(4, 4, 0, 12, 6, 6);
    addBox(4, 6, 0, 6, 10, 6);
    addBox(10, 6, 0, 12, 10, 6);
    return model;
}, 4);
Block.setShape(BlockID.tcon_faucet, 4 / 16, 4 / 16, 0 / 16, 12 / 16, 10 / 16, 6 / 16, 0);
Block.setShape(BlockID.tcon_faucet, 4 / 16, 4 / 16, 10 / 16, 12 / 16, 10 / 16, 16 / 16, 1);
Block.setShape(BlockID.tcon_faucet, 0 / 16, 4 / 16, 4 / 16, 6 / 16, 10 / 16, 12 / 16, 2);
Block.setShape(BlockID.tcon_faucet, 10 / 16, 4 / 16, 4 / 16, 16 / 16, 10 / 16, 12 / 16, 3);
var SearedFaucet = /** @class */ (function (_super) {
    __extends(SearedFaucet, _super);
    function SearedFaucet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultValues = {
            meta: 0,
            signal: 0
        };
        return _this;
    }
    SearedFaucet.prototype.init = function () {
        this.data.meta = World.getBlock(this.x, this.y, this.z).data + 2;
        this.render = new Render();
        this.anim = new Animation.Base(this.x + 0.5, this.y - 1, this.z + 0.5);
        this.anim.describe({ render: this.render.getID(), skin: "model/tcon_liquids.png" });
        this.anim.load();
        delete this.liquidStorage;
    };
    SearedFaucet.prototype.destroy = function () {
        this.anim && this.anim.destroy();
    };
    SearedFaucet.prototype.startThread = function () {
        var _this = this;
        var threadName = "tcon_faucet_" + this.x + ":" + this.y + ":" + this.z;
        var thread = Threading.getThread(threadName);
        if (thread && thread.isAlive()) {
            return;
        }
        var tileSend = StorageInterface.getNearestLiquidStorages(this, this.data.meta)[this.data.meta];
        var tileReceive = StorageInterface.getNearestLiquidStorages(this, 0)[0];
        if (!tileSend || !tileReceive) {
            return;
        }
        var iSend = tileSend.interface || tileSend.liquidStorage;
        var iReceive = tileReceive.interface || tileReceive.liquidStorage;
        if (!iSend || !iReceive) {
            return;
        }
        var liqSend = iSend.getLiquidStored();
        if (!liqSend) {
            return;
        }
        var dir = StorageInterface.directionsBySide[this.data.meta];
        var liquidY = MoltenLiquid.getY(liqSend);
        this.render.setPart("head", [
            {
                type: "box",
                uv: { x: 0, y: liquidY },
                coords: { x: dir.x * 5, y: 0, z: -dir.z * 5 },
                size: { x: dir.x ? 6 : 4, y: 4, z: dir.z ? 6 : 4 }
            },
            {
                type: "box",
                uv: { x: 0, y: liquidY },
                coords: { x: dir.x, y: 3, z: -dir.z },
                size: { x: dir.x ? 2 : 4, y: 10, z: dir.z ? 2 : 4 }
            }
        ], MoltenLiquid.getTexScale());
        this.anim.refresh();
        Threading.initThread(threadName, function () {
            try {
                var add = void 0;
                var surplus = void 0;
                while (_this.isLoaded) {
                    if (!tileSend || !tileSend.isLoaded || !tileReceive || !tileReceive.isLoaded) {
                        break;
                    }
                    if (!tileReceive.interface || tileReceive.interface.canReceiveLiquid(liqSend)) {
                        add = iSend.getLiquid(liqSend, MatValue.INGOT / 1000);
                        surplus = iReceive.addLiquid(liqSend, add);
                        if (surplus > 0) {
                            iSend.addLiquid(liqSend, surplus);
                        }
                        if (add === 0 || add === surplus) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                    Thread.sleep(1000);
                }
                _this.render.setPart("head", [], MoltenLiquid.getTexScale());
                _this.anim.refresh();
            }
            catch (e) {
                alert("FaucetEror: " + e);
            }
        });
    };
    SearedFaucet.prototype.click = function () {
        this.startThread();
        return true;
    };
    SearedFaucet.prototype.redstone = function (signal) {
        if (this.data.signal < signal.power) {
            this.startThread();
        }
        this.data.signal = signal.power;
    };
    return SearedFaucet;
}(TileBase));
TileEntity.registerPrototype(BlockID.tcon_faucet, new SearedFaucet());
createBlock("tcon_itemcast", [{ name: "Casting Table", texture: [0, 1, 2] }]);
Recipes2.addShaped(BlockID.tcon_itemcast, "aaa:a_a:a_a", { a: ItemID.tcon_brick });
BlockModel.register(BlockID.tcon_itemcast, function (model) {
    model.addBox(0 / 16, 15 / 16, 0 / 16, 15 / 16, 16 / 16, 1 / 16, BlockID.tcon_itemcast, 0);
    model.addBox(15 / 16, 15 / 16, 0 / 16, 16 / 16, 16 / 16, 15 / 16, BlockID.tcon_itemcast, 0);
    model.addBox(1 / 16, 15 / 16, 15 / 16, 16 / 16, 16 / 16, 16 / 16, BlockID.tcon_itemcast, 0);
    model.addBox(0 / 16, 15 / 16, 1 / 16, 1 / 16, 16 / 16, 16 / 16, BlockID.tcon_itemcast, 0);
    model.addBox(0 / 16, 10 / 16, 0 / 16, 16 / 16, 15 / 16, 16 / 16, BlockID.tcon_itemcast, 0);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 5 / 16, 10 / 16, 5 / 16, BlockID.tcon_itemcast, 0);
    model.addBox(0 / 16, 0 / 16, 11 / 16, 5 / 16, 10 / 16, 16 / 16, BlockID.tcon_itemcast, 0);
    model.addBox(11 / 16, 0 / 16, 0 / 16, 16 / 16, 10 / 16, 5 / 16, BlockID.tcon_itemcast, 0);
    model.addBox(11 / 16, 0 / 16, 11 / 16, 16 / 16, 10 / 16, 16 / 16, BlockID.tcon_itemcast, 0);
    return model;
});
var CastingTable = /** @class */ (function (_super) {
    __extends(CastingTable, _super);
    function CastingTable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultValues = {
            progress: 0
        };
        return _this;
    }
    CastingTable.prototype.init = function () {
        this.animInput = createAnimItem(this.x + 9 / 16, this.y + 31 / 32, this.z + 9 / 16);
        this.animOutput = createAnimItem(this.x + 9 / 16, this.y + 31 / 32, this.z + 9 / 16);
        this.setAnimItem();
        this.setLiquidLimit();
        MoltenLiquid.initAnim(this, 0.5, 15 / 16, 0.5, 14 / 16, 1 / 16, 14 / 16, true);
    };
    CastingTable.prototype.destroy = function () {
        this.anim && this.anim.destroy();
        this.animInput && this.animInput.destroy();
        this.animOutput && this.animOutput.destroy();
    };
    CastingTable.prototype.setAnimItem = function () {
        var input = this.container.getSlot("slotInput");
        var output = this.container.getSlot("slotOutput");
        this.animInput.describeItem(input.id === 0 ? { id: 0, count: 0, data: 0 } : { id: input.id, count: 1, data: input.data, size: 14 / 16, rotation: [Math.PI / 2, 0, 0] });
        this.animOutput.describeItem(output.id === 0 ? { id: 0, count: 0, data: 0 } : { id: output.id, count: 1, data: output.data, size: 14 / 16, rotation: [Math.PI / 2, 0, 0] });
    };
    CastingTable.prototype.setLiquidLimit = function () {
        this.liquidStorage.liquidLimits = CastingRecipe.getTableLimits(this.container.getSlot("slotInput").id);
    };
    CastingTable.prototype.isValidCast = function (id) {
        return isItemID(id);
    };
    CastingTable.prototype.click = function (id, count, data) {
        if (this.liquidStorage.getLiquidStored()) {
            return false;
        }
        label: {
            if (this.container.getSlot("slotOutput").id !== 0) {
                this.container.dropSlot("slotOutput", this.x + 0.5, this.y + 1, this.z + 0.5);
                break label;
            }
            if (this.container.getSlot("slotInput").id !== 0) {
                this.container.dropSlot("slotInput", this.x + 0.5, this.y + 1, this.z + 0.5);
                break label;
            }
            if (this.isValidCast(id) && !Player.getCarriedItem().extra) {
                this.container.setSlot("slotInput", id, 1, data);
                Player.decreaseCarriedItem();
                break label;
            }
            return false;
        }
        //this.setAnimItem();
        this.setLiquidLimit();
        return true;
    };
    CastingTable.prototype.spawnParticle = function (id) {
        for (var i = 0; i < 4; i++) {
            Particles.addParticle(id, this.x + Math.random(), this.y + 1, this.z + Math.random(), 0, 0, 0);
        }
    };
    CastingTable.prototype.getRecipe = function (stored) {
        return CastingRecipe.getTableRecipe(this.container.getSlot("slotInput").id, stored);
    };
    CastingTable.prototype.tick = function () {
        var stored = this.liquidStorage.getLiquidStored();
        if (stored && this.liquidStorage.isFull(stored)) {
            if (++this.data.progress < CastingRecipe.calcCooldownTime(stored, this.liquidStorage.getAmount(stored))) {
                (World.getThreadTime() & 15) === 0 && this.spawnParticle(Native.ParticleType.smoke);
            }
            else {
                var result = this.getRecipe(stored);
                if (result) {
                    this.container.setSlot("slotOutput", result.id, 1, result.data);
                    result.consume && this.container.clearSlot("slotInput");
                    this.spawnParticle(Native.ParticleType.flame);
                }
                this.data.progress = 0;
                this.liquidStorage.setAmount(stored, 0);
                for (var key in this.liquidStorage.liquidAmounts) {
                    delete this.liquidStorage.liquidAmounts[key];
                }
            }
        }
        this.setAnimItem();
        StorageInterface.checkHoppers(this);
    };
    return CastingTable;
}(TileBase));
var CastingTableInterface = /** @class */ (function (_super) {
    __extends(CastingTableInterface, _super);
    function CastingTableInterface() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.slots = {
            slotOutput: { output: true }
        };
        return _this;
    }
    CastingTableInterface.prototype.canReceiveLiquid = function (liquid, side) {
        var stored = this.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForTable(this.container.getSlot("slotInput").id, liquid);
    };
    return CastingTableInterface;
}(FluidTileInterface));
TileEntity.registerPrototype(BlockID.tcon_itemcast, new CastingTable());
StorageInterface.createInterface(BlockID.tcon_itemcast, new CastingTableInterface());
createBlock("tcon_blockcast", [{ name: "Casting Basin", texture: [0, 1, 2] }]);
Recipes2.addShaped(BlockID.tcon_blockcast, "a_a:a_a:aaa", { a: ItemID.tcon_brick });
BlockModel.register(BlockID.tcon_blockcast, function (model) {
    var addBox = function (x1, y1, z1, x2, y2, z2, rotation) {
        model.addBox(x1 / 16, y1 / 16, z1 / 16, x2 / 16, y2 / 16, z2 / 16, BlockID.tcon_blockcast, 0);
        if (rotation) {
            model.addBox((16 - z2) / 16, y1 / 16, x1 / 16, (16 - z1) / 16, y2 / 16, x2 / 16, BlockID.tcon_blockcast, 0);
            model.addBox((16 - x2) / 16, y1 / 16, (16 - z2) / 16, (16 - x1) / 16, y2 / 16, (16 - z1) / 16, BlockID.tcon_blockcast, 0);
            model.addBox(z1 / 16, y1 / 16, (16 - x2) / 16, z2 / 16, y2 / 16, (16 - x1) / 16, BlockID.tcon_blockcast, 0);
        }
    };
    addBox(0, 13, 0, 2, 16, 14, true);
    addBox(0, 5, 0, 7, 13, 2, true);
    addBox(9, 5, 0, 14, 13, 2, true);
    addBox(0, 2, 0, 16, 5, 16);
    addBox(0, 0, 0, 5, 2, 5, true);
    return model;
});
var CastingBasin = /** @class */ (function (_super) {
    __extends(CastingBasin, _super);
    function CastingBasin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CastingBasin.prototype.init = function () {
        this.animInput = createAnimItem(this.x + 0.5, this.y + 10 / 16, this.z + 0.5);
        this.animOutput = createAnimItem(this.x + 0.5, this.y + 10 / 16, this.z + 0.5);
        this.setAnimItem();
        this.setLiquidLimit();
        MoltenLiquid.initAnim(this, 0.5, 5 / 16, 0.5, 12 / 16, 11 / 16, 12 / 16, true);
    };
    CastingBasin.prototype.setAnimItem = function () {
        var input = this.container.getSlot("slotInput");
        var output = this.container.getSlot("slotOutput");
        this.animInput.describeItem(input.id === 0 ? { id: 0, count: 0, data: 0 } : { id: input.id, count: 1, data: input.data, size: 12 / 16 - 0.01 });
        this.animOutput.describeItem(output.id === 0 ? { id: 0, count: 0, data: 0 } : { id: output.id, count: 1, data: output.data, size: 12 / 16 - 0.01 });
    };
    CastingBasin.prototype.setLiquidLimit = function () {
        this.liquidStorage.liquidLimits = CastingRecipe.getBasinLimits(this.container.getSlot("slotInput").id);
    };
    CastingBasin.prototype.isValidCast = function (id) {
        return isBlockID(id);
    };
    CastingBasin.prototype.getRecipe = function (stored) {
        return CastingRecipe.getBasinRecipe(this.container.getSlot("slotInput").id, stored);
    };
    return CastingBasin;
}(CastingTable));
var CastingBasinInterface = /** @class */ (function (_super) {
    __extends(CastingBasinInterface, _super);
    function CastingBasinInterface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CastingBasinInterface.prototype.canReceiveLiquid = function (liquid, side) {
        var stored = this.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForBasin(this.container.getSlot("slotInput").id, liquid);
    };
    return CastingBasinInterface;
}(CastingTableInterface));
TileEntity.registerPrototype(BlockID.tcon_blockcast, new CastingBasin());
StorageInterface.createInterface(BlockID.tcon_blockcast, new CastingBasinInterface());
var _a;
createBlock("tcon_smeltery", [{ name: "Smeltery Controller", texture: [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], ["tcon_smeltery", 0], ["tcon_stone", 3], ["tcon_stone", 3]] }]);
registerRotationModel("tcon_smeltery", [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], 0, ["tcon_stone", 3], ["tcon_stone", 3]], [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], 1, ["tcon_stone", 3], ["tcon_stone", 3]]);
Recipes2.addShaped(BlockID.tcon_smeltery, "aaa:a_a:aaa", { a: ItemID.tcon_brick });
var SmelteryHandler = /** @class */ (function () {
    function SmelteryHandler() {
    }
    SmelteryHandler.getWindow = function () {
        return this.window;
    };
    SmelteryHandler.getHeatFactor = function () {
        return 8;
    };
    SmelteryHandler.isValidBlock = function (id) {
        return this.blocks[id];
    };
    SmelteryHandler.updateScale = function () {
        if (this.window.isOpened()) {
            var container = this.window.getContainer();
            var tile = container.getParent();
            var liquids = tile.liquidStorage.liquidAmounts;
            var capacity = tile.getLiquidCapacity();
            var liqArray = tile.getLiquidArray();
            var key = void 0;
            var y = 11;
            for (var i = 0; i < liqArray.length; i++) {
                key = "liquid-" + liqArray[i];
                this.elements[key] = this.elements[key] || { type: "scale", x: 93 * SCALE, y: 11 * SCALE, width: 52 * SCALE, height: 52 * SCALE, direction: 1, pixelate: true };
                this.elements[key].y = y * SCALE;
                tile.liquidStorage.updateUiScale(key, liqArray[i]);
                y -= liquids[liqArray[i]] / capacity * 52;
            }
            var split = void 0;
            for (key in this.elements) {
                split = key.split("-");
                if (split[0] === "liquid" && !liquids[split[1]]) {
                    container.setScale(key, 0);
                }
            }
            container.setText("textLiquid", liqArray[0] ? LiquidRegistry.getLiquidName(liqArray[0]) + "\n" + liquids[liqArray[0]] + " mB" : "");
        }
    };
    SmelteryHandler.blocks = (_a = {},
        _a[BlockID.tcon_stone] = true,
        _a[BlockID.tcon_seared_glass] = true,
        _a[BlockID.tcon_drain] = true,
        _a[BlockID.tcon_tank] = true,
        _a[BlockID.tcon_smeltery] = true,
        _a);
    SmelteryHandler.elements = {
        line: { type: "image", x: 93 * SCALE, y: 11 * SCALE, z: 1, bitmap: "tcon.smeltery_line", scale: SCALE },
        slot0: { type: "slot", x: 24 * SCALE, y: 10 * SCALE, size: 18 * SCALE /*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/ },
        slot1: { type: "slot", x: 24 * SCALE, y: 28 * SCALE, size: 18 * SCALE /*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/ },
        slot2: { type: "slot", x: 24 * SCALE, y: 46 * SCALE, size: 18 * SCALE /*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/ },
        gauge0: { type: "scale", x: 21 * SCALE, y: 11 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1 },
        gauge1: { type: "scale", x: 21 * SCALE, y: 29 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1 },
        gauge2: { type: "scale", x: 21 * SCALE, y: 47 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1 },
        //scaleLava: {type: "scale", x: 161 * SCALE, y: 11 * SCALE, width: 12 * SCALE, height: 52 * SCALE, bitmap: "_liquid_lava_texture_0", direction: 1},
        buttonSelect: { type: "button", x: 130 * SCALE, y: 70 * SCALE, bitmap: "classic_button_up", bitmap2: "classic_button_down", scale: SCALE, clicker: {
                onClick: function (container, tile) {
                    tile.data.select++;
                    tile.data.select %= Object.keys(tile.liquidStorage.liquidAmounts).length;
                }
            } },
        buttonDump: { type: "button", x: 92 * SCALE, y: 70 * SCALE, bitmap: "_craft_button_up", bitmap2: "_craft_button_down", scale: SCALE / 2, clicker: {
                onClick: function (container, tile) {
                    var liquids = tile.liquidStorage.liquidAmounts;
                    delete liquids[Object.keys(liquids)[tile.data.select]];
                    tile.data.select %= Object.keys(liquids).length;
                }
            } },
        iconSelect: { type: "image", x: 131.6 * SCALE, y: 71.6 * SCALE, z: 1, bitmap: "mod_browser_update_icon", scale: SCALE * 0.8 },
        textDump: { type: "text", x: 104 * SCALE, y: 68 * SCALE, z: 1, text: "Dump", font: { size: 30, color: Color.WHITE, shadow: 0.5, alignment: 1 } },
        textLiquid: { type: "text", x: 150 * SCALE, y: 50 * SCALE, font: { size: 30, color: Color.WHITE, shadow: 0.5 }, multiline: true }
    };
    SmelteryHandler.window = new UI.StandardWindow({
        standart: {
            header: { text: { text: "Smeltery" } },
            inventory: { standart: true },
            background: { standart: true }
        },
        drawing: [
            { type: "frame", x: 20 * SCALE, y: 10 * SCALE, width: 18 * SCALE, height: 18 * SCALE, bitmap: "classic_slot", scale: SCALE },
            { type: "frame", x: 20 * SCALE, y: 28 * SCALE, width: 18 * SCALE, height: 18 * SCALE, bitmap: "classic_slot", scale: SCALE },
            { type: "frame", x: 20 * SCALE, y: 46 * SCALE, width: 18 * SCALE, height: 18 * SCALE, bitmap: "classic_slot", scale: SCALE },
            { type: "frame", x: 92 * SCALE, y: 10 * SCALE, width: 54 * SCALE, height: 54 * SCALE, bitmap: "classic_slot", scale: SCALE },
            //{type: "frame", x: 160 * SCALE, y: 10 * SCALE, width: 14 * SCALE, height: 54 * SCALE, bitmap: "classic_slot", scale: SCALE},
            { type: "bitmap", x: 56 * SCALE, y: 30 * SCALE, bitmap: "tcon.arrow", scale: SCALE }
        ],
        elements: SmelteryHandler.elements
    });
    return SmelteryHandler;
}());
var SmelteryControler = /** @class */ (function (_super) {
    __extends(SmelteryControler, _super);
    function SmelteryControler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tanks = [];
        _this.defaultValues = {
            meta: 0,
            select: 0,
            temp: 0,
            fuel: 0,
            heat0: 0,
            heat1: 0,
            heat2: 0,
            isActive: false
        };
        return _this;
    }
    SmelteryControler.prototype.getGuiScreen = function () {
        return SmelteryHandler.getWindow();
    };
    SmelteryControler.prototype.setModel = function () {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (this.data.isActive ? 4 : 0));
    };
    SmelteryControler.prototype.setActive = function (active) {
        if (this.data.isActive !== active) {
            this.data.isActive = active;
            this.setModel();
        }
    };
    SmelteryControler.prototype.init = function () {
        this.area = {
            from: { x: 0, y: 0, z: 0 },
            to: { x: 0, y: 0, z: 0 }
        };
        this.data.isActive = this.checkStructure();
        this.render = new Render();
        this.anim = new Animation.Base(this.x, this.y, this.z);
        this.anim.describe({ render: this.render.getID(), skin: "model/tcon_liquids.png" });
        this.anim.load();
        this.anim.setSkylightMode();
        this.setModel();
        this.setAnim();
    };
    SmelteryControler.prototype.destroy = function () {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        this.anim && this.anim.destroy();
    };
    SmelteryControler.prototype.searchWall = function (coords, axis, dir) {
        var pos = { x: coords.x, y: coords.y, z: coords.z };
        var i;
        var block;
        for (i = 0; i < 16; i++) {
            pos[axis] += dir;
            block = World.getBlockID(pos.x, pos.y, pos.z);
            if (block === 0) {
                continue;
            }
            return SmelteryHandler.isValidBlock(block) ? (i + 1) * dir : 0;
        }
        return 0;
    };
    SmelteryControler.prototype.checkStructure = function () {
        var pos = { x: this.x, y: this.y, z: this.z };
        pos[this.data.meta >> 1 ? "x" : "z"] += this.data.meta & 1 ? -1 : 1;
        if (World.getBlockID(pos.x, pos.y, pos.z) !== 0) {
            return false;
        }
        var x1 = this.searchWall(pos, "x", -1);
        var x2 = this.searchWall(pos, "x", 1);
        var z1 = this.searchWall(pos, "z", -1);
        var z2 = this.searchWall(pos, "z", 1);
        if (x1 === 0 || x2 === 0 || z1 === 0 || z2 === 0) {
            return false;
        }
        var from = { x: pos.x + x1, z: pos.z + z1 };
        var to = { x: pos.x + x2, z: pos.z + z2 };
        var x;
        var z;
        for (x = from.x + 1; x <= to.x - 1; x++) {
            for (z = from.z + 1; z <= to.z - 1; z++) {
                if (World.getBlockID(x, this.y - 1, z) !== BlockID.tcon_stone) {
                    return false;
                }
            }
        }
        var tanks = [];
        var y;
        var block;
        var tile;
        loop: for (y = this.y; y < 256; y++) {
            for (x = from.x; x <= to.x; x++) {
                for (z = from.z; z <= to.z; z++) {
                    if (x === from.x && z === from.z || x === to.x && z === from.z || x === from.x && z === to.z || x === to.x && z === to.z) {
                        continue;
                    }
                    block = World.getBlockID(x, y, z);
                    if (from.x < x && x < to.x && from.z < z && z < to.z) {
                        if (block !== 0) {
                            break loop;
                        }
                        continue;
                    }
                    if (!SmelteryHandler.isValidBlock(block)) {
                        break loop;
                    }
                    tile = World.getTileEntity(x, y, z);
                    if (tile) {
                        switch (tile.blockID) {
                            case BlockID.tcon_tank:
                                tanks.push(tile);
                                break;
                            case BlockID.tcon_drain:
                                tile.setController(this);
                                break;
                            case BlockID.tcon_smeltery:
                                if (tile.x !== this.x || tile.y !== this.y || tile.z !== this.z) {
                                    return false;
                                }
                                break;
                        }
                    }
                }
            }
        }
        if (y === this.y || tanks.length === 0) {
            return false;
        }
        this.area.from.x = from.x;
        this.area.from.y = this.y - 1;
        this.area.from.z = from.z;
        this.area.to.x = to.x;
        this.area.to.y = y - 1;
        this.area.to.z = to.z;
        this.tanks = tanks;
        return true;
    };
    SmelteryControler.prototype.getItemCapacity = function () {
        return (this.area.to.x - this.area.from.x - 1) * (this.area.to.y - this.area.from.y) * (this.area.to.z - this.area.from.z - 1);
    };
    SmelteryControler.prototype.getLiquidCapacity = function () {
        return this.getItemCapacity() * MatValue.INGOT * 8;
    };
    SmelteryControler.prototype.totalLiquidAmount = function () {
        var liquids = this.liquidStorage.liquidAmounts;
        var amount = 0;
        for (var key in liquids) {
            if (liquids[key] <= 0) {
                delete liquids[key];
                continue;
            }
            amount += liquids[key];
        }
        return amount;
    };
    SmelteryControler.prototype.getLiquidArray = function () {
        var liquids = this.liquidStorage.liquidAmounts;
        var array = Object.keys(liquids).filter(function (liq) { return liquids[liq] > 0; });
        for (var i = 0; i < this.data.select; i++) {
            array.push(array.shift());
        }
        return array;
    };
    SmelteryControler.prototype.tick = function () {
        var tick = World.getThreadTime();
        var liquids = this.liquidStorage.liquidAmounts;
        var total = this.totalLiquidAmount();
        var capacity = this.getItemCapacity();
        var liquidCapacity = this.getLiquidCapacity();
        var isOpened = this.container.isOpened();
        SmelteryHandler.updateScale();
        this.liquidStorage.setLimit(null, Math.max(0, liquidCapacity));
        if ((tick & 63) === 0) {
            this.setActive(this.checkStructure());
            this.setAnim();
            this.data.isActive && this.spawnParticle();
        }
        if (!this.data.isActive) {
            return;
        }
        if (Cfg.checkInsideSmeltery && tick % 20 === 0) {
            this.interactWithEntitiesInside();
        }
        if ((tick & 3) === 0) {
            AlloyRecipe.alloyAlloys(liquids, this.liquidStorage);
        }
        if (this.data.fuel <= 0) {
            var fuelData = void 0;
            for (var i = 0; i < this.tanks.length; i++) {
                if (this.tanks[i] && this.tanks[i].isLoaded && this.tanks[i].consumeFuel) {
                    fuelData = this.tanks[i].consumeFuel();
                    if (fuelData) {
                        this.data.fuel = fuelData.duration;
                        this.data.temp = fuelData.temp;
                        break;
                    }
                }
            }
            if (this.data.fuel <= 0) {
                return;
            }
        }
        var slots = [
            this.container.getSlot("slot0"),
            this.container.getSlot("slot1"),
            this.container.getSlot("slot2")
        ];
        var smeltCount = slots.reduce(function (sum, slot) { return sum + slot.count; }, 0);
        var recipe;
        var time;
        var count;
        var value;
        var mode;
        var consume = false;
        if (smeltCount > capacity) {
            if (isOpened) {
                for (var i = 0; i < 3; i++) {
                    this.container.setBinding("gauge" + i, "texture", "tcon.heat_gauge_2");
                    this.container.setScale("gauge" + i, 1);
                }
            }
            return;
        }
        for (var i = 0; i < 3; i++) {
            recipe = MeltingRecipe.getRecipe(slots[i].id, slots[i].data);
            value = 0;
            mode = 0;
            if (recipe && i < capacity) {
                time = Math.max(5, recipe.temp) * SmelteryHandler.getHeatFactor();
                this.data["heat" + i] += this.data.temp / 100;
                consume = true;
                if (this.data["heat" + i] >= time) {
                    count = slots[i].count;
                    while (total + recipe.amount * count > liquidCapacity) {
                        count--;
                    }
                    if (count > 0) {
                        slots[i].count -= count;
                        this.container.validateSlot("slot" + i);
                        this.liquidStorage.addLiquid(recipe.liquid, recipe.amount * count);
                        this.data["heat" + i] = 0;
                    }
                    else {
                        mode = 2;
                        value = 1;
                    }
                }
                else {
                    value = this.data["heat" + i] / time;
                }
            }
            else {
                this.data["heat" + i] = 0;
                if (slots[i].id !== 0) {
                    mode = 3;
                    value = 1;
                }
            }
            if (isOpened) {
                this.container.setBinding("gauge" + i, "texture", "tcon.heat_gauge_" + mode);
                this.container.setScale("gauge" + i, value);
            }
        }
        if (consume) {
            this.data.fuel--;
        }
    };
    SmelteryControler.prototype.interactWithEntitiesInside = function () {
        var _this = this;
        var allEnt = Entity.getAll();
        var entities = [];
        var pos;
        for (var i = 0; i < allEnt.length; i++) {
            pos = Entity.getPosition(allEnt[i]);
            if (this.area.from.x <= pos.x && this.area.to.x >= pos.x && this.area.from.y <= pos.y && this.area.to.y >= pos.y && this.area.from.z <= pos.z && this.area.to.z >= pos.z) {
                if (MeltingRecipe.getEntRecipe(allEnt[i])) {
                    entities.push(allEnt[i]);
                }
            }
        }
        var liquidCapacity = this.getLiquidCapacity();
        entities.forEach(function (ent) {
            var result = MeltingRecipe.getEntRecipe(ent);
            if (_this.totalLiquidAmount() + result.amount <= liquidCapacity) {
                _this.liquidStorage.addLiquid(result.liquid, result.amount);
            }
            Entity.damageEntity(ent, 2);
        });
    };
    SmelteryControler.prototype.setAnim = function () {
        var boxes = [];
        var sizeX = this.area.to.x - this.area.from.x - 1;
        var sizeY = this.area.to.y - this.area.from.y;
        var sizeZ = this.area.to.z - this.area.from.z - 1;
        var texScale = MoltenLiquid.getTexScale();
        if (this.data.isActive) {
            var liquids = this.liquidStorage.liquidAmounts;
            var liqArray = this.getLiquidArray();
            var capacity = this.getLiquidCapacity();
            var height = void 0;
            var max = void 0;
            var y = 0;
            for (var i = 0; i < liqArray.length; i++) {
                height = liquids[liqArray[i]] / capacity * sizeY;
                max = Math.max(sizeX, sizeZ, height);
                boxes.push({
                    type: "box",
                    uv: { x: 0, y: MoltenLiquid.getY(liqArray[i]) * max },
                    coords: { x: 0, y: y - height * 16 / 2, z: 0 },
                    size: { x: sizeX * 16, y: height * 16, z: sizeZ * 16 }
                });
                y -= height * 16;
            }
            texScale.width *= max;
            texScale.height *= max;
        }
        this.render.setPart("head", boxes, texScale);
        this.anim.setPos((this.area.from.x + this.area.to.x) / 2 + 0.5, (this.area.from.y + this.area.to.y) / 2 - (sizeY + 1) * 0.5, (this.area.from.z + this.area.to.z) / 2 + 0.5);
        this.anim.refresh();
    };
    SmelteryControler.prototype.spawnParticle = function () {
        //270, 90, 180, 0 degree
        var cos = [0, 0, -1, 1][this.data.meta];
        var sin = [-1, 1, 0, 0][this.data.meta];
        var x = 0.52;
        var z = Math.random() * 0.6 - 0.3;
        var coords = {
            x: this.x + 0.5 + x * cos - z * sin,
            y: this.y + 0.5 + (Math.random() * 6) / 16,
            z: this.z + 0.5 + x * sin + z * cos
        };
        Particles.addParticle(Native.ParticleType.smoke, coords.x, coords.y, coords.z, 0, 0, 0);
        Particles.addParticle(Native.ParticleType.flame, coords.x, coords.y, coords.z, 0, 0, 0);
    };
    return SmelteryControler;
}(TileBase));
var SmelteryInterface = /** @class */ (function (_super) {
    __extends(SmelteryInterface, _super);
    function SmelteryInterface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SmelteryInterface.prototype.getLiquidStored = function (storage, side) {
        return this.tileEntity.getLiquidArray()[0];
    };
    SmelteryInterface.prototype.canReceiveLiquid = function (liquid, side) {
        return true;
    };
    return SmelteryInterface;
}(FluidTileInterface));
TileEntity.registerPrototype(BlockID.tcon_smeltery, new SmelteryControler());
TileRenderer.setRotationPlaceFunction(BlockID.tcon_smeltery);
StorageInterface.createInterface(BlockID.tcon_smeltery, new SmelteryInterface());
;
;
;
var TinkersMaterial = /** @class */ (function () {
    function TinkersMaterial(name, texIndex, moltenLiquid, isMetal) {
        this.name = name;
        this.texIndex = texIndex;
        this.moltenLiquid = moltenLiquid;
        this.isMetal = isMetal;
    }
    TinkersMaterial.prototype.getName = function () {
        return this.name;
    };
    TinkersMaterial.prototype.getTexIndex = function () {
        return this.texIndex;
    };
    TinkersMaterial.prototype.getMoltenLiquid = function () {
        return this.moltenLiquid || "";
    };
    TinkersMaterial.prototype.setItem = function (id) {
        this.item = id;
    };
    TinkersMaterial.prototype.getItem = function () {
        return this.item;
    };
    TinkersMaterial.prototype.setHeadStats = function (durability, speed, attack, level) {
        this.headStats = { durability: durability, speed: speed, attack: attack, level: level };
    };
    TinkersMaterial.prototype.setHandleStats = function (modifier, durability) {
        this.handleStats = { modifier: modifier, durability: durability };
    };
    TinkersMaterial.prototype.setExtraStats = function (durability) {
        this.extraStats = { durability: durability };
    };
    TinkersMaterial.prototype.getHeadStats = function () {
        return this.headStats;
    };
    TinkersMaterial.prototype.getHandleStats = function () {
        return this.handleStats;
    };
    TinkersMaterial.prototype.getExtraStats = function () {
        return this.extraStats;
    };
    TinkersMaterial.STONE = 1;
    TinkersMaterial.IRON = 2;
    TinkersMaterial.DIAMOND = 3;
    TinkersMaterial.OBSIDIAN = 4;
    TinkersMaterial.COBALT = 5;
    TinkersMaterial.level = {
        1: "Stone",
        2: "Iron",
        3: "Diamond",
        4: "Obsidian",
        5: "Cobalt"
    };
    return TinkersMaterial;
}());
var Material = {
    wood: new TinkersMaterial("Wooden", 0),
    stone: new TinkersMaterial("Stone", 1),
    flint: new TinkersMaterial("Flint", 2),
    cactus: new TinkersMaterial("Cactus", 3),
    obsidian: new TinkersMaterial("Obsidian", 4, "molten_obsidian"),
    prismarine: new TinkersMaterial("Prismarine", 5),
    netherrack: new TinkersMaterial("Netherrack", 6),
    endstone: new TinkersMaterial("End", 7),
    bone: new TinkersMaterial("Bone", 8),
    paper: new TinkersMaterial("Paper", 9),
    sponge: new TinkersMaterial("Sponge", 10),
    firewood: new TinkersMaterial("Firewood", 11),
    slime: new TinkersMaterial("Slime", 12),
    blueslime: new TinkersMaterial("Blue Slime", 13),
    magmaslime: new TinkersMaterial("Magma Slime", 14),
    knightslime: new TinkersMaterial("Knightslime", 15, "molten_knightslime", true),
    iron: new TinkersMaterial("Iron", 16, "molten_iron", true),
    pigiron: new TinkersMaterial("Pig Iron", 17, "molten_pigiron", true),
    cobalt: new TinkersMaterial("Cobalt", 18, "molten_cobalt", true),
    ardite: new TinkersMaterial("Ardite", 19, "molten_ardite", true),
    manyullyn: new TinkersMaterial("Manyullyn", 20, "molten_manyullyn", true),
    copper: new TinkersMaterial("Copper", 21, "molten_copper", true),
    bronze: new TinkersMaterial("Bronze", 22, "molten_bronze", true),
    lead: new TinkersMaterial("Lead", 23, "molten_lead", true),
    silver: new TinkersMaterial("Silver", 24, "molten_silver", true),
    electrum: new TinkersMaterial("Electrum", 25, "molten_electrum", true),
    steel: new TinkersMaterial("Steel", 26, "molten_steel", true)
};
Material.wood.setItem(VanillaBlockID.planks);
Material.wood.setHeadStats(35, 2, 2, TinkersMaterial.STONE);
Material.wood.setHandleStats(1, 25);
Material.wood.setExtraStats(15);
Material.stone.setItem(VanillaBlockID.cobblestone);
Material.stone.setHeadStats(120, 4, 3, TinkersMaterial.IRON);
Material.stone.setHandleStats(0.5, -50);
Material.stone.setExtraStats(20);
Material.flint.setItem(VanillaItemID.flint);
Material.flint.setHeadStats(150, 5, 2.9, TinkersMaterial.IRON);
Material.flint.setHandleStats(0.6, -60);
Material.flint.setExtraStats(40);
Material.cactus.setItem(VanillaBlockID.cactus);
Material.cactus.setHeadStats(210, 4, 3.4, TinkersMaterial.IRON);
Material.cactus.setHandleStats(0.85, 20);
Material.cactus.setExtraStats(50);
Material.obsidian.setItem(VanillaBlockID.obsidian);
Material.obsidian.setHeadStats(139, 7.07, 4.2, TinkersMaterial.COBALT);
Material.obsidian.setHandleStats(0.9, -100);
Material.obsidian.setExtraStats(90);
Material.prismarine.setItem(VanillaBlockID.prismarine);
Material.prismarine.setHeadStats(430, 5.5, 6.2, TinkersMaterial.IRON);
Material.prismarine.setHandleStats(0.6, -150);
Material.prismarine.setExtraStats(100);
Material.netherrack.setItem(VanillaBlockID.netherrack);
Material.netherrack.setHeadStats(270, 4.5, 3, TinkersMaterial.IRON);
Material.netherrack.setHandleStats(0.85, -150);
Material.netherrack.setExtraStats(75);
Material.endstone.setItem(VanillaBlockID.end_stone);
Material.endstone.setHeadStats(420, 3.23, 3.23, TinkersMaterial.OBSIDIAN);
Material.endstone.setHandleStats(0.85, 0);
Material.endstone.setExtraStats(42);
Material.bone.setItem(VanillaItemID.bone);
Material.bone.setHeadStats(200, 5.09, 2.5, TinkersMaterial.IRON);
Material.bone.setHandleStats(1.1, 50);
Material.bone.setExtraStats(65);
Material.paper.setItem(ItemID.tcon_paperstack);
Material.paper.setHeadStats(12, 0.51, 0.05, TinkersMaterial.STONE);
Material.paper.setHandleStats(0.1, 5);
Material.paper.setExtraStats(15);
Material.sponge.setItem(VanillaBlockID.sponge);
Material.sponge.setHeadStats(1050, 3.02, 0, TinkersMaterial.STONE);
Material.sponge.setHandleStats(1.2, 250);
Material.sponge.setExtraStats(250);
Material.firewood.setItem(BlockID.tcon_firewood);
Material.firewood.setHeadStats(550, 6, 5.5, TinkersMaterial.STONE);
Material.firewood.setHandleStats(1, -200);
Material.firewood.setExtraStats(150);
Material.slime.setItem(ItemID.tcon_slimecrystal_green);
Material.slime.setHeadStats(1000, 4.24, 1.8, TinkersMaterial.STONE);
Material.slime.setHandleStats(0.7, 0);
Material.slime.setExtraStats(350);
Material.blueslime.setItem(ItemID.tcon_slimecrystal_blue);
Material.blueslime.setHeadStats(780, 4.03, 1.8, TinkersMaterial.STONE);
Material.blueslime.setHandleStats(1.3, -50);
Material.blueslime.setExtraStats(200);
Material.magmaslime.setItem(ItemID.tcon_slimecrystal_magma);
Material.magmaslime.setHeadStats(600, 2.1, 7, TinkersMaterial.STONE);
Material.magmaslime.setHandleStats(0.85, -200);
Material.magmaslime.setExtraStats(150);
Material.knightslime.setItem(ItemID.ingotKnightslime);
Material.knightslime.setHeadStats(850, 5.8, 5.1, TinkersMaterial.OBSIDIAN);
Material.knightslime.setHandleStats(0.5, 500);
Material.knightslime.setExtraStats(125);
Material.iron.setItem(VanillaItemID.iron_ingot);
Material.iron.setHeadStats(204, 6, 5.5, TinkersMaterial.DIAMOND);
Material.iron.setHandleStats(0.85, 60);
Material.iron.setExtraStats(50);
Material.pigiron.setItem(ItemID.ingotPigiron);
Material.pigiron.setHeadStats(380, 6.2, 4.5, TinkersMaterial.DIAMOND);
Material.pigiron.setHandleStats(1.2, 0);
Material.pigiron.setExtraStats(170);
Material.cobalt.setItem(ItemID.ingotCobalt);
Material.cobalt.setHeadStats(780, 12, 4.1, TinkersMaterial.COBALT);
Material.cobalt.setHandleStats(0.9, 100);
Material.cobalt.setExtraStats(300);
Material.ardite.setItem(ItemID.ingotArdite);
Material.ardite.setHeadStats(990, 3.5, 3.6, TinkersMaterial.COBALT);
Material.ardite.setHandleStats(1.4, -200);
Material.ardite.setExtraStats(450);
Material.manyullyn.setItem(ItemID.ingotManyullyn);
Material.manyullyn.setHeadStats(820, 7.02, 8.72, TinkersMaterial.COBALT);
Material.manyullyn.setHandleStats(0.5, 250);
Material.manyullyn.setExtraStats(50);
Material.copper.setItem(ItemID.ingotCopper);
Material.copper.setHeadStats(210, 5.3, 3, TinkersMaterial.IRON);
Material.copper.setHandleStats(1.05, 30);
Material.copper.setExtraStats(100);
Material.bronze.setItem(ItemID.ingotBronze);
Material.bronze.setHeadStats(430, 6.8, 3.5, TinkersMaterial.DIAMOND);
Material.bronze.setHandleStats(1.1, 70);
Material.bronze.setExtraStats(80);
Material.lead.setItem(ItemID.ingotLead);
Material.lead.setHeadStats(434, 5.25, 3.5, TinkersMaterial.IRON);
Material.lead.setHandleStats(0.7, -50);
Material.lead.setExtraStats(100);
Material.silver.setItem(ItemID.ingotSilver);
Material.silver.setHeadStats(250, 5, 5, TinkersMaterial.IRON);
Material.silver.setHandleStats(0.95, 50);
Material.silver.setExtraStats(150);
Material.electrum.setItem(ItemID.ingotElectrum);
Material.electrum.setHeadStats(50, 12, 3, TinkersMaterial.IRON);
Material.electrum.setHandleStats(1.1, -25);
Material.electrum.setExtraStats(250);
Material.steel.setItem(ItemID.ingotSteel);
Material.steel.setHeadStats(540, 7, 6, TinkersMaterial.OBSIDIAN);
Material.steel.setHandleStats(0.9, 150);
Material.steel.setExtraStats(25);
var ToolStats = /** @class */ (function () {
    function ToolStats() {
        this.durability = this.level = this.attack = this.speed = 0;
    }
    //call this first
    ToolStats.prototype.head = function () {
        var materials = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            materials[_i] = arguments[_i];
        }
        var length = materials.length;
        this.durability = this.level = this.attack = this.speed = 0;
        var stats;
        for (var i = 0; i < length; i++) {
            stats = Material[materials[i]].getHeadStats();
            this.durability += stats.durability;
            this.attack += stats.attack;
            this.speed += stats.speed;
            if (stats.level > this.level) {
                this.level = stats.level;
            }
        }
        this.durability = Math.max(1, this.durability / length | 0);
        this.attack /= length;
        this.speed /= length;
    };
    //call this second
    ToolStats.prototype.extra = function () {
        var materials = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            materials[_i] = arguments[_i];
        }
        var length = materials.length;
        var stats;
        var dur = 0;
        for (var i = 0; i < length; i++) {
            stats = Material[materials[i]].getExtraStats();
            dur += stats.durability;
        }
        this.durability += Math.round(dur / length);
    };
    //call this last
    ToolStats.prototype.handle = function () {
        var materials = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            materials[_i] = arguments[_i];
        }
        var length = materials.length;
        var stats;
        var dur = 0;
        var mod = 0;
        for (var i = 0; i < length; i++) {
            stats = Material[materials[i]].getHandleStats();
            dur += stats.durability;
            mod += stats.modifier;
        }
        mod /= length;
        this.durability = Math.round(this.durability * mod);
        this.durability += Math.round(dur / length);
        this.durability = Math.max(1, this.durability);
    };
    ToolStats.prototype.getToolMaterial = function () {
        return {
            durability: Math.round(this.durability),
            level: this.level,
            damage: this.attack,
            efficiency: this.speed
        };
    };
    return ToolStats;
}());
var ToolData = /** @class */ (function () {
    function ToolData(item) {
        this.item = item;
        this.init();
    }
    ToolData.prototype.init = function () {
        this.toolData = ToolAPI.getToolData(this.item.id);
        this.materials = new String(this.item.extra.getString("materials")).split("_");
        this.modifiers = TinkersModifierHandler.decodeToObj(this.item.extra.getString("modifiers"));
        this.stats = this.getStats();
    };
    ToolData.prototype.applyHand = function () {
        var item = Player.getCarriedItem();
        if (item.id === this.item.id) {
            Player.setCarriedItem(this.item.id, this.item.count, this.item.data, this.item.extra);
        }
    };
    ToolData.prototype.getBaseStats = function () {
        for (var i = 0; i < this.materials.length; i++) {
            if (!Material[this.materials[i]]) {
                return null;
            }
        }
        return this.toolData.buildStats(this.materials);
    };
    ToolData.prototype.getStats = function () {
        var stats = this.getBaseStats();
        stats.speed *= this.toolData.miningSpeedModifier();
        stats.attack *= this.toolData.damagePotential();
        this.forEachModifiers(function (mod, level) {
            mod.applyStats(stats, level);
        });
        return stats.getToolMaterial();
    };
    ToolData.prototype.isBroken = function () {
        return this.item.extra.getInt("durability") >= this.stats.durability;
    };
    ToolData.prototype.setDurability = function (val) {
        var dur = Math.min(Math.max(0, val), this.stats.durability);
        this.item.extra.putInt("durability", dur);
        this.item.data = Math.ceil(dur / this.stats.durability * 14);
    };
    ToolData.prototype.consumeDurability = function (val) {
        for (var mod in this.modifiers) {
            if (Modifier[mod].onConsume(this.modifiers[mod])) {
                return;
            }
        }
        this.setDurability(this.item.extra.getInt("durability") + val);
    };
    ToolData.prototype.addXp = function (val) {
        var oldLv = this.getLevel();
        this.item.extra.putInt("xp", this.item.extra.getInt("xp") + val);
        var newLv = this.getLevel();
        if (oldLv < newLv) {
            Game.message("§3" + this.getLevelupMessage(newLv));
            soundLevelup.play();
        }
    };
    ToolData.prototype.getLevel = function () {
        var xp = this.item.extra.getInt("xp");
        var total = 0;
        var next = Cfg.toolLeveling.baseXp;
        var lv = 0;
        if (this.toolData.is3x3) {
            next *= 9;
        }
        while (total + next <= xp) {
            total += next;
            next *= Cfg.toolLeveling.multiplier;
            lv++;
        }
        return lv;
    };
    ToolData.prototype.getLevelName = function (level) {
        var lv = level || this.getLevel();
        switch (lv) {
            case 0: return "Clumsy";
            case 1: return "Comfortable";
            case 2: return "Accustomed";
            case 3: return "Adept";
            case 4: return "Expert";
            case 5: return "Master";
            case 6: return "Grandmaster";
            case 7: return "Heroic";
            case 8: return "Legendary";
            case 9: return "Godlike";
        }
        if (lv < 19)
            return "Awesome";
        if (lv < 42)
            return "MoxieGrrl";
        if (lv < 66)
            return "boni";
        if (lv < 99)
            return "Jadedcat";
        return "Hacker";
    };
    ToolData.prototype.getLevelupMessage = function (lv) {
        var name = Item.getName(this.item.id);
        switch (lv) {
            case 1: return "You begin to feel comfortable handling the " + name;
            case 2: return "You are now accustomed to the weight of the " + name;
            case 3: return "You have become adept at handling the " + name;
            case 4: return "You are now an expert at using the " + name + " !";
            case 5: return "You have mastered the " + name + "!";
            case 6: return "You have grandmastered the " + name + "!";
            case 7: return "You feel like you could fulfill mighty deeds with your " + name + "!";
            case 8: return "You and your " + name + " are living legends!";
            case 9: return "No god could stand in the way of you and your " + name + "!";
            case 10: return "Your " + name + " is pure awesome.";
            default: return "Your " + name + " has reached level " + lv;
        }
    };
    ToolData.prototype.getName = function (name) {
        var head = Material[this.materials[1]].getName();
        if (this.isBroken()) {
            return "Broken " + head + " " + name;
        }
        var xp = this.item.extra.getInt("xp");
        var total = 0;
        var next = Cfg.toolLeveling.baseXp;
        if (this.toolData.is3x3) {
            next *= 9;
        }
        while (total + next <= xp) {
            total += next;
            next *= Cfg.toolLeveling.multiplier;
        }
        return head + " " + name + "\n\u00A77" + (this.stats.durability - this.item.extra.getInt("durability")) + " / " + this.stats.durability + "\nLevel: " + this.getLevelName() + "\nXP: " + (xp - total) + " / " + next;
    };
    ToolData.prototype.forEachModifiers = function (func) {
        for (var key in this.modifiers) {
            Modifier[key] && func(Modifier[key], this.modifiers[key]);
        }
    };
    ToolData.prototype.uniqueKey = function () {
        var hash = this.materials.reduce(function (a, v) { return 31 * a + Material[v].getTexIndex(); }, 0);
        var mask = 0;
        for (var key in this.modifiers) {
            mask |= 1 << Modifier[key].getTexIndex();
        }
        return this.item.id + ":" + hash.toString(16) + ":" + mask.toString(16);
    };
    return ToolData;
}());
/*
(() => {

    const time = Debug.sysTime();

    const genHash = (o1: number, o2: number, o3: number, o4: number): number => {
        let result = 0;
        result = 31 * result + o1;
        result = 31 * result + o2;
        result = 31 * result + o3;
        result = 31 * result + o4;
        return result;
    };

    const cache = {};

    let hash: number;
    loop:
    for(let i = 0; i < 27; i++){
    for(let j = 0; j < 27; j++){
    for(let k = 0; k < 27; k++){
    for(let l = 0; l < 27; l++){
        hash = genHash(i, j, k, l);
        if(hash !== [i, j, k, l].reduce((current, v) => 31 * current + v, 0)){
            alert("chigauyo!!");
            break loop;
        }
        if(hash in cache){
            alert("break: " + hash);
            break loop;
        }
        else{
            cache[hash] = true;
        }
    }
    }
    }
    }

    alert("finish: " + (Debug.sysTime() - time) + "ms");

})();
*/ 
var PartRegistry = /** @class */ (function () {
    function PartRegistry() {
    }
    PartRegistry.createParts = function (key, material) {
        var _this = this;
        var name = material.getName();
        this.types.forEach(function (type) {
            var id = createItem("tconpart_" + type.key + "_" + key, name + " " + type.name);
            Item.addCreativeGroup("tconpart_" + type.key, type.name, [id]);
            _this.data[id] = { type: type.key, material: key };
            var liquid = material.getMoltenLiquid();
            if (liquid) {
                MeltingRecipe.addRecipe(id, liquid, MatValue.INGOT * type.cost);
                CastingRecipe.addTableRecipeForBoth(type.key, liquid, id);
            }
            CastingRecipe.addMakeCastRecipes(id, type.key);
        });
    };
    PartRegistry.setup = function () {
        for (var key in Material) {
            PartRegistry.createParts(key, Material[key]);
        }
    };
    PartRegistry.getPartData = function (id) {
        return this.data[id];
    };
    PartRegistry.getIDFromData = function (type, material) {
        for (var id in this.data) {
            if (this.data[id].type === type && this.data[id].material === material) {
                return parseInt(id);
            }
        }
        return 0;
    };
    PartRegistry.data = {};
    PartRegistry.types = [
        { key: "pickaxe", name: "Pickaxe Head", cost: 2 },
        { key: "shovel", name: "Shovel Head", cost: 2 },
        { key: "axe", name: "Axe Head", cost: 2 },
        { key: "broadaxe", name: "Broad Axe Head", cost: 8 },
        { key: "sword", name: "Sword Blade", cost: 2 },
        { key: "hammer", name: "Hammer Head", cost: 8 },
        { key: "excavator", name: "Excavator Head", cost: 8 },
        { key: "rod", name: "Tool Rod", cost: 1 },
        { key: "rod2", name: "Tough Tool Rod", cost: 3 },
        { key: "binding", name: "Binding", cost: 1 },
        { key: "binding2", name: "Tough Binding", cost: 3 },
        { key: "guard", name: "Wide Guard", cost: 1 },
        { key: "largeplate", name: "Large Plate", cost: 8 }
    ];
    return PartRegistry;
}());
PartRegistry.setup();
var ToolTexture = /** @class */ (function () {
    function ToolTexture(path) {
        this.path = path;
        this.bitmap = FileTools.ReadImage(__dir__ + "res/" + path);
    }
    ToolTexture.prototype.getPath = function () {
        return this.path;
    };
    ToolTexture.prototype.getBitmap = function (partNum, index) {
        return Bitmap.createBitmap(this.bitmap, (index & 15) << 4, (index >> 4) + (partNum << 1) << 4, 16, 16); //null, true
    };
    ToolTexture.prototype.getCoords = function (partNum, index) {
        return {
            x: ((index & 15) << 4) / 256,
            y: ((index >> 4) + (partNum << 1) << 4) / 256
        };
    };
    ToolTexture.prototype.getModCoords = function (index) {
        return { x: (index << 4) / 256, y: 240 / 256 };
    };
    return ToolTexture;
}());
IDRegistry.genBlockID("oreCobalt");
Block.createBlock("oreCobalt", [{ name: "Cobalt Ore", texture: [["tcon_ore_cobalt", 0]], inCreative: true }]);
ToolAPI.registerBlockMaterial(BlockID.oreCobalt, "stone", TinkersMaterial.COBALT, true);
Block.setDestroyLevel(BlockID.oreCobalt, TinkersMaterial.COBALT);
IDRegistry.genBlockID("oreArdite");
Block.createBlock("oreArdite", [{ name: "Ardite Ore", texture: [["tcon_ore_ardite", 0]], inCreative: true }]);
ToolAPI.registerBlockMaterial(BlockID.oreArdite, "stone", TinkersMaterial.COBALT, true);
Block.setDestroyLevel(BlockID.oreArdite, TinkersMaterial.COBALT);
Item.addCreativeGroup("ores", Translation.translate("Ores"), [BlockID.oreCobalt, BlockID.oreArdite]);
MeltingRecipe.addRecipe(BlockID.oreCobalt, "molten_cobalt", MatValue.ORE);
MeltingRecipe.addRecipe(BlockID.oreArdite, "molten_ardite", MatValue.ORE);
var generateNetherOre = function (id, rate, chunkX, chunkZ, random) {
    for (var i = 0; i < rate; i += 2) {
        GenerationUtils.generateOre(chunkX * 16 + random.nextInt(16), 32 + random.nextInt(64), chunkZ * 16 + random.nextInt(16), id, 0, 5, false, random.nextInt());
        GenerationUtils.generateOre(chunkX * 16 + random.nextInt(16), random.nextInt(128), chunkZ * 16 + random.nextInt(16), id, 0, 5, false, random.nextInt());
    }
};
Callback.addCallback("GenerateNetherChunk", function (chunkX, chunkZ, random) {
    generateNetherOre(BlockID.oreCobalt, Cfg.oreGen.cobaltRate, chunkX, chunkZ, random);
    generateNetherOre(BlockID.oreArdite, Cfg.oreGen.arditeRate, chunkX, chunkZ, random);
});
createBlock("blockKnightslime", [{ name: "Block of Knightslime", texture: "tcon_block_knightslime" }]);
createBlock("blockCobalt", [{ name: "Block of Cobalt", texture: "tcon_block_cobalt" }]);
createBlock("blockArdite", [{ name: "Block of Ardite", texture: "tcon_block_ardite" }]);
createBlock("blockManyullyn", [{ name: "Block of Manyullyn", texture: "tcon_block_manyullyn" }]);
createBlock("blockPigiron", [{ name: "Block of Pigiron", texture: "tcon_block_pigiron" }]);
createBlock("blockAlubrass", [{ name: "Block of Aluminum Brass", texture: "tcon_block_alubrass" }]);
createItem("ingotKnightslime", "Knightslime Ingot", { name: "tcon_ingot_knightslime" });
createItem("ingotCobalt", "Cobalt Ingot", { name: "tcon_ingot_cobalt" });
createItem("ingotArdite", "Ardite Ingot", { name: "tcon_ingot_ardite" });
createItem("ingotManyullyn", "Manyullyn Ingot", { name: "tcon_ingot_manyullyn" });
createItem("ingotPigiron", "Pigiron Ingot", { name: "tcon_ingot_pigiron" });
createItem("ingotAlubrass", "Aluminum Brass Ingot", { name: "tcon_ingot_alubrass" });
/*
createItem("nuggetKnightslime", "Knightslime Nugget", {name: "tcon_nugget_knightslime"});
createItem("nuggetCobalt", "Cobalt Nugget", {name: "tcon_nugget_cobalt"});
createItem("nuggetArdite", "Ardite Nugget", {name: "tcon_nugget_ardite"});
createItem("nuggetManyullyn", "Manyullyn Nugget", {name: "tcon_nugget_manyullyn"});
createItem("nuggetPigiron", "Pigiron Nugget", {name: "tcon_nugget_pigiron"});
createItem("nuggetAlubrass", "Aluminum Brass Nugget", {name: "tcon_nugget_alubrass"});
*/
Recipes.addFurnace(BlockID.oreCobalt, ItemID.ingotCobalt);
Recipes.addFurnace(BlockID.oreArdite, ItemID.ingotArdite);
(function () {
    var addRecipes = function (liquid, block, ingot /*, nugget: number*/) {
        MeltingRecipe.addRecipe(block, liquid, MatValue.BLOCK);
        MeltingRecipe.addRecipe(ingot, liquid, MatValue.INGOT);
        //MeltingRecipe.addRecipe(nugget, liquid, MatValue.NUGGET);
        CastingRecipe.addBasinRecipe(0, liquid, block, MatValue.BLOCK);
        CastingRecipe.addTableRecipeForBoth("ingot", liquid, ingot);
        //CastingRecipe.addTableRecipeForBoth("nugget", liquid, nugget);
        Recipes2.addShapeless(block, [{ id: ingot, count: 9 }]);
        Recipes2.addShapeless({ id: ingot, count: 9 }, [block]);
        //Recipes2.addShapeless(ingot, [{id: nugget, count: 9}]);
        //Recipes2.addShapeless({id: nugget, count: 9}, [ingot]);
    };
    addRecipes("molten_knightslime", BlockID.blockKnightslime, ItemID.ingotKnightslime /*, ItemID.nuggetKnightslime*/);
    addRecipes("molten_cobalt", BlockID.blockCobalt, ItemID.ingotCobalt /*, ItemID.nuggetCobalt*/);
    addRecipes("molten_ardite", BlockID.blockArdite, ItemID.ingotArdite /*, ItemID.nuggetArdite*/);
    addRecipes("molten_manyullyn", BlockID.blockManyullyn, ItemID.ingotManyullyn /*, ItemID.nuggetManyullyn*/);
    addRecipes("molten_pigiron", BlockID.blockPigiron, ItemID.ingotPigiron /*, ItemID.nuggetPigiron*/);
    addRecipes("molten_alubrass", BlockID.blockAlubrass, ItemID.ingotAlubrass /*, ItemID.nuggetAlubrass*/);
})();
createItem("tcon_paperstack", "Paper Stack");
Recipes2.addShapelessWith2x2("item:tcon_paperstack", [{ item: "paper", count: 4 }]);
createBlock("tcon_lavawood", [{ name: "Lavawood" }]);
createBlock("tcon_firewood", [{ name: "Firewood" }]);
CastingRecipe.addBasinRecipe(VanillaBlockID.planks, "lava", BlockID.tcon_lavawood, 250);
Recipes2.addShapelessWith2x2("block:tcon_firewood", ["block:tcon_lavawood", { item: "blaze_powder", count: 2 }]);
createItem("tcon_slimeball_blue", "Blue Slime");
createItem("tcon_slimeball_purple", "Purple Slime");
Recipes2.addShapelessWith2x2("item:tcon_slimeball_blue", ["slime_ball", { item: "dye", count: 2, data: 4 }]);
Recipes2.addShapelessWith2x2("item:tcon_slimeball_purple", ["item:tcon_slimeball_blue", { item: "redstone", count: 2 }]);
MeltingRecipe.addRecipe(ItemID.tcon_slimeball_purple, "purpleslime", MatValue.SLIME_BALL);
createBlock("tcon_slimymud_green", [{ name: "Slimy Mud" }]);
createBlock("tcon_slimymud_blue", [{ name: "Blue Slimy Mud" }]);
createBlock("tcon_slimymud_magma", [{ name: "Magma Slimy Mud" }]);
Recipes2.addShapeless(BlockID.tcon_slimymud_green, [{ id: VanillaItemID.slime_ball, count: 4 }, VanillaBlockID.sand, VanillaBlockID.dirt]);
Recipes2.addShapeless(BlockID.tcon_slimymud_green, [{ id: ItemID.tcon_slimeball_blue, count: 4 }, VanillaBlockID.sand, VanillaBlockID.dirt]);
Recipes2.addShapeless(BlockID.tcon_slimymud_green, [{ id: VanillaItemID.magma_cream, count: 4 }, VanillaBlockID.soul_sand, VanillaBlockID.netherrack]);
Item.addCreativeGroup("tcon_slimymud", "Slimy Mud", [BlockID.tcon_slimymud_green, BlockID.tcon_slimymud_blue, BlockID.tcon_slimymud_magma]);
createItem("tcon_slimecrystal_green", "Slime Crystal");
createItem("tcon_slimecrystal_blue", "Blue Slime Crystal");
createItem("tcon_slimecrystal_magma", "Magma Slime Crystal");
Recipes.addFurnace(BlockID.tcon_slimymud_green, ItemID.tcon_slimecrystal_green);
Recipes.addFurnace(BlockID.tcon_slimymud_blue, ItemID.tcon_slimecrystal_blue);
Recipes.addFurnace(BlockID.tcon_slimymud_magma, ItemID.tcon_slimecrystal_magma);
Item.addCreativeGroup("tcon_slimycrystal", "Slime Crystal", [ItemID.tcon_slimecrystal_green, ItemID.tcon_slimecrystal_blue, ItemID.tcon_slimecrystal_magma]);
createBlock("tcon_clear_glass", [{ name: "Clear Glass" }]);
CastingRecipe.addBasinRecipe(0, "molten_glass", BlockID.tcon_clear_glass, 1000);
ConnectedTexture.setModelForGlass(BlockID.tcon_clear_glass, -1, "tcon_clear_glass");
createBlock("tcon_seared_glass", [{ name: "Seared Glass" }]);
Recipes2.addShaped(BlockID.tcon_seared_glass, "_a_:aba:_a_", { a: ItemID.tcon_brick, b: VanillaBlockID.glass });
CastingRecipe.addBasinRecipe(VanillaBlockID.glass, "molten_stone", BlockID.tcon_seared_glass, MatValue.SEARED_BLOCK);
ConnectedTexture.setModelForGlass(BlockID.tcon_seared_glass, -1, "tcon_seared_glass");
var PatternRegistry = /** @class */ (function () {
    function PatternRegistry() {
    }
    PatternRegistry.registerData = function (id, type, cost) {
        this.data[id] = { type: type, cost: cost };
    };
    PatternRegistry.getData = function (id) {
        return this.data[id];
    };
    PatternRegistry.isPattern = function (id) {
        return id in this.data;
    };
    PatternRegistry.getAllRecipeForRV = function () {
        var list = [];
        var material;
        var pattern;
        for (var mat in Material) {
            if (Material[mat].isMetal) {
                continue;
            }
            material = Material[mat].getItem();
            for (pattern in this.data) {
                list.push({
                    input: [{ id: parseInt(pattern), count: 1, data: 0 }, { id: material, count: this.data[pattern].cost, data: 0 }],
                    output: [{ id: PartRegistry.getIDFromData(this.data[pattern].type, mat), count: 1, data: 0 }]
                });
            }
        }
        return list;
    };
    PatternRegistry.data = {};
    return PatternRegistry;
}());
createItem("tcon_pattern_blank", "Blank Pattern");
createItem("tcon_pattern_pickaxe", "Pickaxe Head Pattern");
createItem("tcon_pattern_shovel", "Shovel Head Pattern");
createItem("tcon_pattern_axe", "Axe Head Pattern");
createItem("tcon_pattern_broadaxe", "Broad Axe Head Pattern");
createItem("tcon_pattern_sword", "Sword Blade Head Pattern");
createItem("tcon_pattern_hammer", "Hammer Head Pattern");
createItem("tcon_pattern_excavator", "Excavator Head Pattern");
createItem("tcon_pattern_rod", "Tool Rod Pattern");
createItem("tcon_pattern_rod2", "Tough Tool Rod Pattern");
createItem("tcon_pattern_binding", "Binding Pattern");
createItem("tcon_pattern_binding2", "Tough Binding Pattern");
createItem("tcon_pattern_guard", "Wide Guard Pattern");
createItem("tcon_pattern_largeplate", "Large Plate Pattern");
Item.addCreativeGroup("tcon_pattern", "Pattern", [
    ItemID.tcon_pattern_blank,
    ItemID.tcon_pattern_pickaxe,
    ItemID.tcon_pattern_shovel,
    ItemID.tcon_pattern_axe,
    ItemID.tcon_pattern_broadaxe,
    ItemID.tcon_pattern_sword,
    ItemID.tcon_pattern_hammer,
    ItemID.tcon_pattern_excavator,
    ItemID.tcon_pattern_rod,
    ItemID.tcon_pattern_rod2,
    ItemID.tcon_pattern_binding,
    ItemID.tcon_pattern_binding2,
    ItemID.tcon_pattern_guard,
    ItemID.tcon_pattern_largeplate
]);
Recipes2.addShapedWith2x2({ item: "item:tcon_pattern_blank", count: 4 }, "ab:ba", { a: "planks", b: "stick" });
PatternRegistry.registerData(ItemID.tcon_pattern_pickaxe, "pickaxe", 2);
PatternRegistry.registerData(ItemID.tcon_pattern_shovel, "shovel", 2);
PatternRegistry.registerData(ItemID.tcon_pattern_axe, "axe", 2);
PatternRegistry.registerData(ItemID.tcon_pattern_broadaxe, "broadaxe", 8);
PatternRegistry.registerData(ItemID.tcon_pattern_sword, "sword", 2);
PatternRegistry.registerData(ItemID.tcon_pattern_hammer, "hammer", 8);
PatternRegistry.registerData(ItemID.tcon_pattern_excavator, "excavator", 8);
PatternRegistry.registerData(ItemID.tcon_pattern_rod, "rod", 1);
PatternRegistry.registerData(ItemID.tcon_pattern_rod2, "rod2", 3);
PatternRegistry.registerData(ItemID.tcon_pattern_binding, "binding", 1);
PatternRegistry.registerData(ItemID.tcon_pattern_binding2, "binding2", 3);
PatternRegistry.registerData(ItemID.tcon_pattern_guard, "guard", 1);
PatternRegistry.registerData(ItemID.tcon_pattern_largeplate, "largeplate", 8);
createItem("tcon_claycast_pickaxe", "Pickaxe Head Clay Cast");
createItem("tcon_claycast_shovel", "Shovel Head Clay Cast");
createItem("tcon_claycast_axe", "Axe Head Clay Cast");
createItem("tcon_claycast_broadaxe", "Broad Axe Head Clay Cast");
createItem("tcon_claycast_sword", "Sword Blade Head Clay Cast");
createItem("tcon_claycast_hammer", "Hammer Head Clay Cast");
createItem("tcon_claycast_excavator", "Excavator Head Clay Cast");
createItem("tcon_claycast_rod", "Tool Rod Clay Cast");
createItem("tcon_claycast_rod2", "Tough Tool Rod Clay Cast");
createItem("tcon_claycast_binding", "Binding Clay Cast");
createItem("tcon_claycast_binding2", "Tough Binding Clay Cast");
createItem("tcon_claycast_guard", "Wide Guard Clay Cast");
createItem("tcon_claycast_largeplate", "Large Plate Clay Cast");
Item.addCreativeGroup("tcon_claycast", "Clay Cast", [
    ItemID.tcon_claycast_pickaxe,
    ItemID.tcon_claycast_shovel,
    ItemID.tcon_claycast_axe,
    ItemID.tcon_claycast_broadaxe,
    ItemID.tcon_claycast_sword,
    ItemID.tcon_claycast_hammer,
    ItemID.tcon_claycast_excavator,
    ItemID.tcon_claycast_rod,
    ItemID.tcon_claycast_rod2,
    ItemID.tcon_claycast_binding,
    ItemID.tcon_claycast_binding2,
    ItemID.tcon_claycast_guard,
    ItemID.tcon_claycast_largeplate
]);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_pickaxe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_shovel, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_axe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_broadaxe, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_sword, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_hammer, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_excavator, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_rod, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_rod2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_binding, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_binding2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_guard, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_largeplate, MatValue.INGOT * 8);
createItem("tcon_cast_pickaxe", "Pickaxe Head Cast");
createItem("tcon_cast_shovel", "Shovel Head Cast");
createItem("tcon_cast_axe", "Axe Head Cast");
createItem("tcon_cast_broadaxe", "Broad Axe Head Cast");
createItem("tcon_cast_sword", "Sword Blade Head Cast");
createItem("tcon_cast_hammer", "Hammer Head Cast");
createItem("tcon_cast_excavator", "Excavator Head Cast");
createItem("tcon_cast_rod", "Tool Rod Cast");
createItem("tcon_cast_rod2", "Tough Tool Rod Cast");
createItem("tcon_cast_binding", "Binding Cast");
createItem("tcon_cast_binding2", "Tough Binding Cast");
createItem("tcon_cast_guard", "Wide Guard Cast");
createItem("tcon_cast_largeplate", "Large Plate Cast");
createItem("tcon_cast_ingot", "Ingot Cast");
createItem("tcon_cast_nugget", "Nugget Cast");
createItem("tcon_cast_gem", "Gem Cast");
createItem("tcon_cast_plate", "Plate Cast");
createItem("tcon_cast_gear", "Gear Cast");
Item.addCreativeGroup("tcon_cast", "Cast", [
    ItemID.tcon_cast_pickaxe,
    ItemID.tcon_cast_shovel,
    ItemID.tcon_cast_axe,
    ItemID.tcon_cast_broadaxe,
    ItemID.tcon_cast_sword,
    ItemID.tcon_cast_hammer,
    ItemID.tcon_cast_excavator,
    ItemID.tcon_cast_rod,
    ItemID.tcon_cast_rod2,
    ItemID.tcon_cast_binding,
    ItemID.tcon_cast_binding2,
    ItemID.tcon_cast_guard,
    ItemID.tcon_cast_largeplate,
    ItemID.tcon_cast_ingot,
    ItemID.tcon_cast_nugget,
    ItemID.tcon_cast_gem,
    ItemID.tcon_cast_plate,
    ItemID.tcon_cast_gear
]);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_pickaxe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_shovel, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_axe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_broadaxe, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_sword, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_hammer, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_excavator, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_rod, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_rod2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_binding, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_binding2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_guard, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_largeplate, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_ingot, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_nugget, MatValue.NUGGET);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_gem, MatValue.GEM);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_plate, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_gear, MatValue.INGOT * 4);
CastingRecipe.addMakeCastRecipes(VanillaItemID.iron_ingot, "ingot");
CastingRecipe.addMakeCastRecipes(VanillaItemID.gold_ingot, "ingot");
CastingRecipe.addMakeCastRecipes(VanillaItemID.brick, "ingot");
CastingRecipe.addMakeCastRecipes(VanillaItemID.netherbrick, "ingot");
CastingRecipe.addMakeCastRecipes(VanillaItemID.iron_nugget, "nugget");
CastingRecipe.addMakeCastRecipes(VanillaItemID.gold_nugget, "nugget");
CastingRecipe.addMakeCastRecipes(VanillaItemID.emerald, "gem");
var TinkersModifier = /** @class */ (function () {
    function TinkersModifier(key, name, texIndex, recipe, max, multi, hate) {
        var _this = this;
        this.key = key;
        this.name = name;
        this.texIndex = texIndex;
        this.max = max;
        this.recipe = recipe.map(function (item) { return (typeof item === "number" ? { id: item, data: -1 } : item); });
        this.hate = {};
        if (!multi) {
            this.hate[key] = true;
        }
        if (hate) {
            hate.forEach(function (mod) {
                _this.hate[mod] = true;
            });
        }
    }
    TinkersModifier.prototype.getKey = function () {
        return this.key;
    };
    TinkersModifier.prototype.getName = function () {
        return this.name;
    };
    TinkersModifier.prototype.getTexIndex = function () {
        return this.texIndex;
    };
    TinkersModifier.prototype.getRecipe = function () {
        return this.recipe;
    };
    TinkersModifier.prototype.canBeTogether = function (modifiers) {
        for (var i = 0; i < modifiers.length; i++) {
            if (this.hate[modifiers[i].type]) {
                return false;
            }
        }
        return true;
    };
    TinkersModifier.prototype.applyStats = function (stats, level) {
    };
    TinkersModifier.prototype.applyEnchant = function (enchant, level) {
    };
    TinkersModifier.prototype.onDestroy = function (item, coords, block, level) {
    };
    TinkersModifier.prototype.onAttack = function (item, victim, level) {
        return 0;
    };
    TinkersModifier.prototype.onDealDamage = function (victim, damageValue, damageType, level) {
    };
    TinkersModifier.prototype.onKillEntity = function (entity, damageType, level) {
    };
    TinkersModifier.prototype.onConsume = function (level) {
        return false;
    };
    TinkersModifier.prototype.onMending = function (level) {
        return 0;
    };
    return TinkersModifier;
}());
var TinkersModifierHandler = /** @class */ (function () {
    function TinkersModifierHandler() {
    }
    TinkersModifierHandler.encodeToString = function (array) {
        return array.map(function (mod) { return mod.type + ":" + mod.level; }).join("_");
    };
    TinkersModifierHandler.decodeToArray = function (code) {
        return new String(code).split("_").filter(function (s) { return s; }).map(function (s) {
            var split = s.split(":");
            return { type: split[0], level: parseInt(split[1]) };
        });
    };
    TinkersModifierHandler.decodeToObj = function (code) {
        var mods = {};
        new String(code).split("_").filter(function (s) { return s; }).map(function (s) { return s.split(":"); }).forEach(function (data) {
            var num = parseInt(data[1]);
            if (data[0] in Modifier) {
                mods[data[0]] = data[0] in mods ? mods[data[0]] + num : num;
            }
        });
        return mods;
    };
    return TinkersModifierHandler;
}());
var ModHaste = /** @class */ (function (_super) {
    __extends(ModHaste, _super);
    function ModHaste() {
        return _super.call(this, "haste", "Haste", 0, [VanillaItemID.redstone], 50, true) || this;
    }
    ModHaste.prototype.applyStats = function (stats, level) {
        for (var i = level; i--;) {
            stats.speed += stats.speed <= ModHaste.step1 ? 0.15 - 0.05 * stats.speed / ModHaste.step1 : stats.speed <= ModHaste.step2 ? 0.1 - 0.05 * (stats.speed - ModHaste.step1) / (ModHaste.step2 - ModHaste.step1) : 0.05;
        }
        stats.speed += (level / this.max | 0) * 0.5;
    };
    ModHaste.step1 = 15;
    ModHaste.step2 = 25;
    return ModHaste;
}(TinkersModifier));
var ModLuck = /** @class */ (function (_super) {
    __extends(ModLuck, _super);
    function ModLuck() {
        return _super.call(this, "luck", "Luck", 1, [{ id: VanillaItemID.dye, data: 4 }], 360, false, ["silk"]) || this;
    }
    ModLuck.prototype.applyEnchant = function (enchant, level) {
        enchant.fortune = level < 60 ? 0 : level < 180 ? 1 : level < 360 ? 2 : 3;
    };
    return ModLuck;
}(TinkersModifier));
var ModSharp = /** @class */ (function (_super) {
    __extends(ModSharp, _super);
    function ModSharp() {
        return _super.call(this, "sharp", "Sharper", 2, [VanillaItemID.quartz], 72, true) || this;
    }
    ModSharp.prototype.applyStats = function (stats, level) {
        for (var i = level; i--;) {
            stats.attack += stats.attack <= 10 ? 0.05 - 0.025 * stats.attack / 10 : stats.attack <= 20 ? 0.025 - 0.01 * stats.attack / 20 : 0.015;
        }
        stats.attack += (level / this.max | 0) * 0.25;
    };
    return ModSharp;
}(TinkersModifier));
var ModDiamond = /** @class */ (function (_super) {
    __extends(ModDiamond, _super);
    function ModDiamond() {
        return _super.call(this, "diamond", "Diamond", 3, [VanillaItemID.diamond], 1, false) || this;
    }
    ModDiamond.prototype.applyStats = function (stats, level) {
        stats.durability += 500;
        stats.level = Math.min(stats.level + 1, TinkersMaterial.OBSIDIAN);
        stats.speed += 0.5;
        stats.attack++;
    };
    return ModDiamond;
}(TinkersModifier));
var ModEmerald = /** @class */ (function (_super) {
    __extends(ModEmerald, _super);
    function ModEmerald() {
        return _super.call(this, "emerald", "Emerald", 4, [VanillaItemID.emerald], 1, false) || this;
    }
    ModEmerald.prototype.applyStats = function (stats, level) {
        stats.durability += stats.durability >> 1;
        stats.level = Math.min(stats.level + 1, TinkersMaterial.DIAMOND);
    };
    return ModEmerald;
}(TinkersModifier));
createItem("tcon_silky_cloth", "Silky Cloth");
createItem("tcon_silky_jewel", "Silky Jewel");
Recipes2.addShaped(ItemID.tcon_silky_cloth, "aaa:aba:aaa", { a: VanillaItemID.string, b: VanillaItemID.gold_ingot });
Recipes2.addShaped(ItemID.tcon_silky_jewel, "_a_:aba:_a_", { a: ItemID.tcon_silky_cloth, b: VanillaItemID.emerald });
MeltingRecipe.addRecipe(ItemID.tcon_silky_cloth, "molten_gold", MatValue.INGOT);
var ModSilk = /** @class */ (function (_super) {
    __extends(ModSilk, _super);
    function ModSilk() {
        return _super.call(this, "silk", "SilkTouch", 5, [ItemID.tcon_silky_jewel], 1, false, ["luck"]) || this;
    }
    ModSilk.prototype.applyStats = function (stats, level) {
        stats.speed = Math.max(1, stats.speed - 3);
        stats.attack = Math.max(1, stats.attack - 3);
    };
    ModSilk.prototype.applyEnchant = function (enchant, level) {
        enchant.silk = true;
    };
    return ModSilk;
}(TinkersModifier));
createItem("tcon_reinforcement", "Reinforcement");
Recipes2.addShaped(ItemID.tcon_reinforcement, "aaa:aba:aaa", { a: VanillaBlockID.obsidian, b: ItemID.tcon_cast_largeplate });
var ModReinforced = /** @class */ (function (_super) {
    __extends(ModReinforced, _super);
    function ModReinforced() {
        return _super.call(this, "reinforced", "Reinforced", 6, [ItemID.tcon_reinforcement], 1, true) || this;
    }
    ModReinforced.prototype.onConsume = function (level) {
        return level >= 5 ? true : level * 0.2 < Math.random();
    };
    return ModReinforced;
}(TinkersModifier));
var _a;
var ModBeheading = /** @class */ (function (_super) {
    __extends(ModBeheading, _super);
    function ModBeheading() {
        return _super.call(this, "beheading", "Beheading", 7, [VanillaItemID.ender_pearl, VanillaBlockID.obsidian], 1, true) || this;
    }
    ModBeheading.prototype.onKillEntity = function (entity, damageType, level) {
        var headMeta = ModBeheading.headMeta[Entity.getType(entity)];
        if (headMeta && Math.random() * 10 < level) {
            var pos = Entity.getPosition(entity);
            World.drop(pos.x, pos.y, pos.z, VanillaBlockID.skull, 1, headMeta);
        }
    };
    ModBeheading.headMeta = (_a = {},
        _a[Native.EntityType.SKELETON] = 0,
        _a[Native.EntityType.WHITHER_SKELETON] = 1,
        _a[Native.EntityType.ZOMBIE] = 2,
        _a[1] = 3,
        _a[Native.EntityType.CREEPER] = 4,
        _a[Native.EntityType.ENDER_DRAGON] = 5,
        _a);
    return ModBeheading;
}(TinkersModifier));
var _a;
createBlock("tcon_graveyard_soil", [{ name: "Graveyard Soil" }], "dirt");
createBlock("tcon_consecrated_soil", [{ name: "Consecrated Soil" }], "dirt");
Recipes2.addShapelessWith2x2("block:tcon_graveyard_soil", ["dirt", "rotten_flesh", { item: "dye", data: 15 }]);
Recipes.addFurnace(BlockID.tcon_graveyard_soil, BlockID.tcon_consecrated_soil);
var ModSmite = /** @class */ (function (_super) {
    __extends(ModSmite, _super);
    function ModSmite() {
        return _super.call(this, "smite", "Smite", 8, [BlockID.tcon_consecrated_soil], 24, true) || this;
    }
    ModSmite.prototype.onAttack = function (item, victim, level) {
        return ModSmite.targets[Entity.getType(victim)] ? 7 / this.max * level : 0;
    };
    ModSmite.targets = (_a = {},
        _a[Native.EntityType.SKELETON] = true,
        _a[Native.EntityType.STRAY] = true,
        _a[Native.EntityType.WHITHER_SKELETON] = true,
        _a[Native.EntityType.ZOMBIE] = true,
        _a[Native.EntityType.DROWNED] = true,
        _a[Native.EntityType.HUSK] = true,
        _a[Native.EntityType.PIG_ZOMBIE] = true,
        _a[Native.EntityType.ZOMBIE_VILLAGER] = true,
        _a[Native.EntityType.ZOMBIE_VILLAGE_V2] = true,
        _a[Native.EntityType.PHANTOM] = true,
        _a[Native.EntityType.WHITHER] = true,
        _a[Native.EntityType.SKELETON_HORSE] = true,
        _a[Native.EntityType.ZOMBIE_HORSE] = true,
        _a);
    return ModSmite;
}(TinkersModifier));
var _a;
var ModSpider = /** @class */ (function (_super) {
    __extends(ModSpider, _super);
    function ModSpider() {
        return _super.call(this, "spider", "Bane of Arthropods", 9, [VanillaItemID.fermented_spider_eye], 24, true) || this;
    }
    ModSpider.prototype.onAttack = function (item, victim, level) {
        return ModSpider.targets[Entity.getType(victim)] ? 7 / this.max * level : 0;
    };
    ModSpider.targets = (_a = {},
        _a[Native.EntityType.SPIDER] = true,
        _a[Native.EntityType.CAVE_SPIDER] = true,
        _a[Native.EntityType.SILVERFISH] = true,
        _a[Native.EntityType.ENDERMITE] = true,
        _a);
    return ModSpider;
}(TinkersModifier));
var ModFiery = /** @class */ (function (_super) {
    __extends(ModFiery, _super);
    function ModFiery() {
        return _super.call(this, "fiery", "Fiery", 10, [VanillaItemID.blaze_powder], 25, true) || this;
    }
    ModFiery.prototype.onAttack = function (item, victim, level) {
        Entity.setFire(victim, 1 + (level >> 3), true);
        return 0;
    };
    return ModFiery;
}(TinkersModifier));
createItem("tcon_necrotic_bone", "Necrotic Bone");
var ModNecrotic = /** @class */ (function (_super) {
    __extends(ModNecrotic, _super);
    function ModNecrotic() {
        return _super.call(this, "necrotic", "Necrotic", 11, [ItemID.tcon_necrotic_bone], 1, true) || this;
    }
    ModNecrotic.prototype.onDealDamage = function (victim, damageValue, damageType, level) {
        var add = damageValue * 0.1 * level | 0;
        add && Entity.setHealth(player, Math.min(Entity.getHealth(player) + add, Entity.getMaxHealth(player)));
    };
    return ModNecrotic;
}(TinkersModifier));
var ModKnockback = /** @class */ (function (_super) {
    __extends(ModKnockback, _super);
    function ModKnockback() {
        return _super.call(this, "knockback", "Knockback", 12, [VanillaBlockID.piston], 10, true) || this;
    }
    ModKnockback.prototype.onAttack = function (item, victim, level) {
        var vec = Entity.getLookVector(player);
        var speed = 1 + level * 0.1;
        Entity.setVelocity(victim, vec.x * speed, vec.y, vec.z * speed);
        return 0;
    };
    return ModKnockback;
}(TinkersModifier));
createItem("tcon_moss", "Ball of Moss");
createItem("tcon_mending_moss", "Mending Moss");
Recipes2.addShapeless(ItemID.tcon_moss, [{ id: VanillaBlockID.mossy_cobblestone, count: 9 }]);
Item.registerUseFunction(ItemID.tcon_moss, function (coords, item, block) {
    if (block.id === VanillaBlockID.bookshelf) {
        if (Player.getLevel() < 10) {
            Game.tipMessage("Mending Moss requires at least 10 levels");
            return;
        }
        Player.addLevel(-10);
        Player.decreaseCarriedItem();
        Player.addItemToInventory(ItemID.tcon_mending_moss, 1, 0);
        World.playSoundAtEntity(player, "random.orb", 1);
    }
});
var ModMending = /** @class */ (function (_super) {
    __extends(ModMending, _super);
    function ModMending() {
        return _super.call(this, "mending", "Mending", 13, [ItemID.tcon_mending_moss], 1, true) || this;
    }
    ModMending.prototype.onMending = function (level) {
        return level;
    };
    return ModMending;
}(TinkersModifier));
var ModShulking = /** @class */ (function (_super) {
    __extends(ModShulking, _super);
    function ModShulking() {
        return _super.call(this, "shulking", "Shulking", 14, [VanillaItemID.chorus_fruit_popped], 50, false) || this;
    }
    ModShulking.prototype.onAttack = function (item, victim, level) {
        Entity.addEffect(victim, Native.PotionEffect.levitation, 0, (level >> 1) + 10);
        return 0;
    };
    return ModShulking;
}(TinkersModifier));
var ModWeb = /** @class */ (function (_super) {
    __extends(ModWeb, _super);
    function ModWeb() {
        return _super.call(this, "web", "Web", 15, [VanillaBlockID.web], 1, true) || this;
    }
    ModWeb.prototype.onAttack = function (item, victim, level) {
        Entity.addEffect(victim, Native.PotionEffect.movementSlowdown, 1, level * 20);
        return 0;
    };
    return ModWeb;
}(TinkersModifier));
/*
0: top
1: side
2: front
3: d-side
4: d-front
*/
var PatternChest = /** @class */ (function (_super) {
    __extends(PatternChest, _super);
    function PatternChest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultValues = {
            mask: 0
        };
        return _this;
    }
    PatternChest.getIndex = function (id) {
        if (id in PatternChest.mask) {
            var i = 0;
            while (PatternChest.mask[id] >> i & ~1) {
                i++;
            }
            return i;
        }
        return -1;
    };
    PatternChest.prototype.init = function () {
        delete this.liquidStorage;
    };
    PatternChest.prototype.isExist = function (id) {
        return !!(this.data.mask & PatternChest.mask[id]);
    };
    PatternChest.prototype.getList = function () {
        var array = [];
        for (var i = 0; i < PatternChest.patterns.length; i++) {
            this.data.mask >> i & 1 && array.push(i);
        }
        array.sort(function (a, b) { return a - b; });
        return array;
    };
    PatternChest.prototype.upFlag = function (id) {
        if (this.isExist(id)) {
            return false;
        }
        this.data.mask |= PatternChest.mask[id];
        return true;
    };
    PatternChest.prototype.downFlag = function (id) {
        if (this.isExist(id)) {
            this.data.mask &= ~PatternChest.mask[id];
            return true;
        }
        return false;
    };
    PatternChest.prototype.click = function (id, count, data) {
        if (id in PatternChest.mask) {
            if (Entity.getSneaking(player)) {
                var inv = void 0;
                for (var i = 0; i < 36; i++) {
                    inv = Player.getInventorySlot(i);
                    if (inv.id in PatternChest.mask && this.upFlag(inv.id)) {
                        if (--inv.count <= 0) {
                            inv.id = inv.data = 0;
                        }
                        Player.setInventorySlot(i, inv.id, inv.count, inv.data);
                    }
                }
                return true;
            }
            this.upFlag(id) ? Player.decreaseCarriedItem() : Game.tipMessage("already has this pattern inside");
            return true;
        }
        return false;
    };
    PatternChest.prototype.getGuiScreen = function () {
        return PatternChest.window;
    };
    PatternChest.prototype.destroyBlock = function () {
        var extra;
        if (this.data.mask) {
            extra = new ItemExtraData();
            extra.putInt("mask", this.data.mask);
        }
        World.drop(this.x + 0.5, this.y, this.z + 0.5, this.blockID, 1, World.getBlock(this.x, this.y, this.z).data, extra);
    };
    PatternChest.patterns = [
        ItemID.tcon_pattern_pickaxe,
        ItemID.tcon_pattern_shovel,
        ItemID.tcon_pattern_axe,
        ItemID.tcon_pattern_broadaxe,
        ItemID.tcon_pattern_sword,
        ItemID.tcon_pattern_hammer,
        ItemID.tcon_pattern_excavator,
        ItemID.tcon_pattern_rod,
        ItemID.tcon_pattern_rod2,
        ItemID.tcon_pattern_binding,
        ItemID.tcon_pattern_binding2,
        ItemID.tcon_pattern_guard,
        ItemID.tcon_pattern_largeplate
    ];
    PatternChest.mask = (function () {
        var obj = {};
        PatternChest.patterns.forEach(function (pattern, i) {
            obj[pattern] = 1 << i;
        });
        return obj;
    })();
    PatternChest.window = (function () {
        var elementSet = {
            buttonExit: { type: "closeButton", x: 907, y: 18, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 5 }
        };
        var window = new UI.Window({
            location: { x: 200, y: 20, width: 600, height: 300 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "frame", x: 0, y: 0, width: 1000, height: 500, bitmap: "classic_frame_bg_light", scale: 6 },
                { type: "text", x: 50, y: 60, text: "Pattern Chest", font: { size: 40 } },
            ],
            elements: elementSet
        });
        var i = 0;
        var _loop_1 = function (id) {
            elementSet["slot" + id] = {
                type: "slot",
                x: 50 + (i % 9) * 100,
                y: 100 + (i / 9 | 0) * 100,
                size: 100,
                visual: true,
                isDarkenAtZero: false,
                source: { id: 0, count: 0, data: 0 },
                clicker: {
                    onClick: function (container, tile) {
                        if (tile.downFlag(id)) {
                            window.getElements().get("slot" + id).onBindingUpdated("source", { id: 0, count: 0, data: 0 });
                            Player.addItemToInventory(parseInt(id), 1, 0);
                        }
                    }
                }
            };
            i++;
        };
        for (var id in PatternChest.mask) {
            _loop_1(id);
        }
        window.setBlockingBackground(true);
        window.setEventListener({
            onOpen: function (win) {
                var elements = win.getElements();
                var container = win.getContainer();
                var tile = container.getParent();
                for (var id in PatternChest.mask) {
                    elements.get("slot" + id).onBindingUpdated("source", { id: tile.isExist(id) ? parseInt(id) : 0, count: 0, data: 0 });
                }
            }
        });
        return window;
    })();
    return PatternChest;
}(TileBase));
createBlock("tcon_patternchest", [{ name: "Pattern Chest", texture: [["itemframe_background", 0]] }]);
Recipes2.addShapedWith2x2("block:tcon_patternchest", "a:b", { a: "item:tcon_pattern_blank", b: "chest" });
Block.setShape(BlockID.tcon_patternchest, 0, 0, 0, 1, 14 / 16, 1);
Block.registerDropFunction(BlockID.tcon_patternchest, function () { return []; });
Block.registerPlaceFunction(BlockID.tcon_patternchest, function (coords, item, block) {
    var c = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
    World.setBlock(c.x, c.y, c.z, item.id, item.data);
    var tile = World.addTileEntity(c.x, c.y, c.z);
    if (item.extra) {
        tile.data.mask = item.extra.getInt("mask");
    }
});
TileEntity.registerPrototype(BlockID.tcon_patternchest, new PatternChest());
var TableBase = /** @class */ (function (_super) {
    __extends(TableBase, _super);
    function TableBase(animCount, animSize) {
        var _this = _super.call(this) || this;
        _this.animCount = animCount;
        _this.animSize = animSize;
        _this.defaultValues = {
            meta: 0
        };
        return _this;
    }
    TableBase.prototype.created = function () {
        this.data.meta = TileRenderer.getBlockRotation(player);
    };
    TableBase.prototype.init = function () {
        if (Cfg.showItemOnTable) {
            this.anims = new Array(this.animCount);
            for (var i = 0; i < this.animCount; i++) {
                this.anims[i] = createAnimItem(this.x + 0.5, this.y + 33 / 32, this.z + 0.5);
            }
            this.setAnimItem();
        }
        delete this.liquidStorage;
    };
    TableBase.prototype.destroy = function () {
        this.anims && this.anims.forEach(function (anim) {
            anim && anim.destroy();
        });
    };
    TableBase.prototype.displayItem = function (coords) {
        var _this = this;
        if (!Cfg.showItemOnTable) {
            return;
        }
        //180, 0, 90, 270 degree
        var cos = [-1, 1, 0, 0][this.data.meta];
        var sin = [0, 0, 1, -1][this.data.meta];
        var rot = [Math.PI, 0, Math.PI / 2, -Math.PI / 2][this.data.meta];
        this.anims.forEach(function (anim, i) {
            if (Math.abs(coords[i].x) > 1 || Math.abs(coords[i].z) > 1) {
                return;
            }
            var slot = _this.container.getSlot("slot" + i);
            var size = _this.animSize;
            if (isBlockID(slot.id)) {
                size /= 2;
            }
            var x = coords[i].x + size / 16;
            var z = coords[i].z - size / 16;
            var xx = x * cos - z * sin;
            var zz = x * sin + z * cos;
            anim.setPos(_this.x + 0.5 + xx, _this.y + 33 / 32, _this.z + 0.5 + zz);
            anim.describeItem(slot.id === 0 ? { id: 0, count: 0, data: 0 } : {
                id: slot.id, count: 1, data: slot.data,
                size: size,
                rotation: [-Math.PI / 2, rot, 0]
            });
        });
    };
    return TableBase;
}(TileBase));
createBlock("tcon_stenciltable", [
    { name: "Stencil Table", texture: [0, 0, ["planks", 0]] },
    { name: "Stencil Table", texture: [0, 0, ["planks", 1]] },
    { name: "Stencil Table", texture: [0, 0, ["planks", 2]] },
    { name: "Stencil Table", texture: [0, 0, ["planks", 3]] },
    { name: "Stencil Table", texture: [0, 0, ["planks", 4]] },
    { name: "Stencil Table", texture: [0, 0, ["planks", 5]] }
], "wood");
Item.addCreativeGroup("tcon_stenciltable", "Stencil Table", [BlockID.tcon_stenciltable]);
BlockModel.register(BlockID.tcon_stenciltable, function (model, index) {
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [["planks", index], ["tcon_stenciltable", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, "planks", index);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, "planks", index);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, "planks", index);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, "planks", index);
    return model;
}, 6);
Recipes2.addShapedWith2x2({ item: "block:tcon_stenciltable", data: 0 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "planks", data: 0 } }, "tcon_stenciltable_0");
Recipes2.addShapedWith2x2({ item: "block:tcon_stenciltable", data: 1 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "planks", data: 1 } }, "tcon_stenciltable_1");
Recipes2.addShapedWith2x2({ item: "block:tcon_stenciltable", data: 2 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "planks", data: 2 } }, "tcon_stenciltable_2");
Recipes2.addShapedWith2x2({ item: "block:tcon_stenciltable", data: 3 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "planks", data: 3 } }, "tcon_stenciltable_3");
Recipes2.addShapedWith2x2({ item: "block:tcon_stenciltable", data: 4 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "planks", data: 4 } }, "tcon_stenciltable_4");
Recipes2.addShapedWith2x2({ item: "block:tcon_stenciltable", data: 5 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "planks", data: 5 } }, "tcon_stenciltable_5");
var StencilTable = /** @class */ (function (_super) {
    __extends(StencilTable, _super);
    function StencilTable() {
        var _this = _super.call(this, 1, 14 / 16) || this;
        _this.defaultValues = {
            meta: 0,
            page: 0
        };
        return _this;
    }
    StencilTable.prototype.getGuiScreen = function () {
        return StencilTable.window;
    };
    StencilTable.prototype.setAnimItem = function () {
        this.displayItem([{ x: 0, z: 0 }]);
    };
    StencilTable.window = (function () {
        var elements = {
            slot0: { type: "slot", x: 300, y: 90, size: 100, isValid: function (id) { return id === ItemID.tcon_pattern_blank; } },
            slotResult: { type: "slot", x: 600, y: 90, size: 100, isValid: function () { return false; }, clicker: {
                    onClick: function (container, tile) {
                        var source = container.getSlot("slot0");
                        if (source.id === ItemID.tcon_pattern_blank) {
                            source.count--;
                            container.validateSlot("slot0");
                            Player.addItemToInventory(PatternChest.patterns[tile.data.page], 1, 0);
                        }
                    }
                } },
            buttonPrev: { type: "button", x: 544, y: 200, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                    onClick: function (container, tile) {
                        if (--tile.data.page < 0) {
                            tile.data.page = PatternChest.patterns.length - 1;
                        }
                    }
                } },
            buttonNext: { type: "button", x: 660, y: 200, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                    onClick: function (container, tile) {
                        if (++tile.data.page >= PatternChest.patterns.length) {
                            tile.data.page = 0;
                        }
                    }
                } },
            buttonExit: { type: "closeButton", x: 907, y: 18, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 5 }
        };
        for (var i = 0; i < 36; i++) {
            elements["inv" + i] = {
                type: "invSlot",
                x: 50 + (i % 9) * 100,
                y: i < 9 ? 620 : 200 + (i / 9 | 0) * 100,
                size: 100,
                index: i
            };
        }
        var window = new UI.Window({
            location: { x: 200, y: 20, width: 600, height: 450 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "frame", x: 0, y: 0, width: 1000, height: 750, bitmap: "classic_frame_bg_light", scale: 6 },
                { type: "text", x: 50, y: 60, text: "Stencil Table", font: { size: 40 } },
                { type: "text", x: 50, y: 290, text: "Inventory", font: { size: 40 } },
                { type: "bitmap", x: 434, y: 95, bitmap: "tcon.arrow", scale: 6 }
            ],
            elements: elements
        });
        window.setInventoryNeeded(true);
        window.setBlockingBackground(true);
        window.setEventListener({
            onOpen: function (win) {
                Threading.initThread("tcon_crafting", function () {
                    try {
                        var container = win.getContainer();
                        var tile = container.getParent();
                        while (win.isOpened()) {
                            if (container.getSlot("slot0").id === ItemID.tcon_pattern_blank) {
                                container.setSlot("slotResult", PatternChest.patterns[tile.data.page], 1, 0);
                            }
                            else {
                                container.clearSlot("slotResult");
                                tile.data.page = 0;
                            }
                            Thread.sleep(100);
                        }
                        container.clearSlot("slotResult");
                    }
                    catch (e) {
                        alert("StencilTableError: " + e);
                    }
                });
            },
            onClose: function (win) {
                var container = win.getContainer();
                var tile = container.getParent();
                container.clearSlot("slotResult");
                tile.setAnimItem();
            }
        });
        return window;
    })();
    return StencilTable;
}(TableBase));
TileEntity.registerPrototype(BlockID.tcon_stenciltable, new StencilTable());
createBlock("tcon_partbuilder", [
    { name: "Part Builder", texture: [0, 0, ["log_side", 0]] },
    { name: "Part Builder", texture: [0, 0, ["log_side", 1]] },
    { name: "Part Builder", texture: [0, 0, ["log_side", 2]] },
    { name: "Part Builder", texture: [0, 0, ["log_side", 3]] },
    { name: "Part Builder", texture: [0, 0, ["log2", 0]] },
    { name: "Part Builder", texture: [0, 0, ["log2", 2]] }
], "wood");
Item.addCreativeGroup("tcon_partbuilder", "Part Builder", [BlockID.tcon_partbuilder]);
BlockModel.register(BlockID.tcon_partbuilder, function (model, index) {
    var tex = index <= 3 ? "log_side" : "log2";
    var meta = index <= 3 ? index : (index - 4) * 2;
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, tex, meta);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, tex, meta);
    return model;
}, 6);
Recipes2.addShapedWith2x2({ item: "block:tcon_partbuilder", data: 0 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "log", data: 0 } }, "tcon_partbuilder_0");
Recipes2.addShapedWith2x2({ item: "block:tcon_partbuilder", data: 1 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "log", data: 1 } }, "tcon_partbuilder_1");
Recipes2.addShapedWith2x2({ item: "block:tcon_partbuilder", data: 2 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "log", data: 2 } }, "tcon_partbuilder_2");
Recipes2.addShapedWith2x2({ item: "block:tcon_partbuilder", data: 3 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "log", data: 3 } }, "tcon_partbuilder_3");
Recipes2.addShapedWith2x2({ item: "block:tcon_partbuilder", data: 4 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "log2", data: 0 } }, "tcon_partbuilder_4");
Recipes2.addShapedWith2x2({ item: "block:tcon_partbuilder", data: 5 }, "a:b", { a: "item:tcon_pattern_blank", b: { item: "log2", data: 1 } }, "tcon_partbuilder_5");
var PartBuilder = /** @class */ (function (_super) {
    __extends(PartBuilder, _super);
    function PartBuilder() {
        return _super.call(this, 2, 0.46875) || this;
    }
    PartBuilder.prototype.getGuiScreen = function () {
        return PartBuilder.window;
    };
    PartBuilder.prototype.setAnimItem = function () {
        var c = 0.2125;
        this.displayItem([{ x: -c, z: -c }, { x: c, z: -c }]);
    };
    PartBuilder.window = (function () {
        var tutorial = addLineBreaks(18, "Here you can craft tool parts to fulfill your tinkering fantasies") + "\n\n" + addLineBreaks(18, "To craft a part simply put its pattern into the left slot. The two right slot hold the material you want to craft your part out of.");
        var findPatternchest = function (coords) {
            var nears = StorageInterface.getNearestContainers(coords, -1);
            var tile;
            for (var side in nears) {
                tile = nears[side].getParent();
                if (parseInt(side) >= 2 && tile.blockID === BlockID.tcon_patternchest) {
                    return tile;
                }
            }
            return null;
        };
        var turnPage = function (tile, num) {
            var pc = findPatternchest(tile);
            if (pc) {
                var list = pc.getList();
                if (list.length > 0) {
                    var slot = tile.container.getSlot("slot0");
                    if (!PatternRegistry.isPattern(slot.id)) {
                        return;
                    }
                    var index_1 = PatternChest.getIndex(slot.id);
                    if (slot.id !== 0) {
                        if (pc.upFlag(slot.id)) {
                            tile.container.clearSlot("slot0");
                            list = pc.getList();
                        }
                        else {
                            var pos = Entity.getPosition(player);
                            tile.container.dropSlot("slot0", pos.x, pos.y, pos.z);
                        }
                    }
                    var page = list.findIndex(function (i) { return i === index_1; }) + num;
                    if (page < 0) {
                        page = list.length - 1;
                    }
                    if (page >= list.length) {
                        page = 0;
                    }
                    var id = PatternChest.patterns[list[page]];
                    tile.container.setSlot("slot0", id, 1, 0);
                    pc.downFlag(id);
                }
            }
        };
        var elements = {
            slot0: { type: "slot", x: 200, y: 90, size: 100, isValid: function (id) { return PatternRegistry.isPattern(id); }, bitmap: "tcon.slot.pattern" },
            slot1: { type: "slot", x: 300, y: 90, size: 100, isValid: function (id) {
                    for (var key in Material) {
                        if (Material[key].getItem() === id) {
                            return true;
                        }
                    }
                    return false;
                } },
            slotResult: { type: "slot", x: 600, y: 90, size: 100, isValid: function () { return false; }, clicker: {
                    onClick: function (container, tile) {
                        var slot = container.getSlot("slot1");
                        var recipe = PatternRegistry.getData(container.getSlot("slot0").id);
                        var result;
                        for (var key in Material) {
                            result = 0;
                            if (Material[key].getItem() === slot.id) {
                                result = PartRegistry.getIDFromData(recipe.type, key);
                                if (!Material[key].isMetal && result) {
                                    if (slot.count >= recipe.cost) {
                                        slot.count -= recipe.cost;
                                        container.validateSlot("slot1");
                                        Player.addItemToInventory(result, 1, 0);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                } },
            textCost: { type: "text", x: 650, y: 200, font: { color: Color.GRAY, size: 30, alignment: 1 } },
            buttonPrev: { type: "button", x: 144, y: 200, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                    onClick: function (container, tile) {
                        turnPage(tile, -1);
                    }
                } },
            buttonNext: { type: "button", x: 260, y: 200, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                    onClick: function (container, tile) {
                        turnPage(tile, 1);
                    }
                } },
            buttonExit: { type: "closeButton", x: 907, y: 18, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 5 },
            imageArrow: { type: "image", x: 434, y: 95, bitmap: "tcon.arrow", scale: 6, clicker: {
                    onClick: function (container) {
                        RV && RV.openRecipePage("tcon_partbuilder", container);
                    }
                } }
        };
        for (var i = 0; i < 36; i++) {
            elements["inv" + i] = {
                type: "invSlot",
                x: 50 + (i % 9) * 100,
                y: i < 9 ? 620 : 200 + (i / 9 | 0) * 100,
                size: 100,
                index: i
            };
        }
        var window = new UI.Window({
            location: { x: 50, y: 20, width: 600, height: 450 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "frame", x: 0, y: 0, width: 1000, height: 750, bitmap: "classic_frame_bg_light", scale: 6 },
                { type: "text", x: 50, y: 60, text: "Part Builder", font: { size: 40 } },
                { type: "text", x: 50, y: 290, text: "Inventory", font: { size: 40 } }
            ],
            elements: elements
        });
        var window2 = new UI.Window({
            location: { x: 650, y: 20, width: 300, height: 450 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "frame", x: 0, y: 0, width: 1000, height: 1500, bitmap: "tcon.frame", scale: 12 },
            ],
            elements: {
                textTitle: { type: "text", x: 500, y: 40, font: { size: 80, color: Color.YELLOW, bold: true, alignment: 1 } },
                textStats: { type: "text", x: 60, y: 200, font: { size: 70, color: Color.WHITE }, multiline: true }
            }
        });
        var elements2 = window2.getElements();
        window.addAdjacentWindow(window2);
        window.setInventoryNeeded(true);
        window.setBlockingBackground(true);
        window.setEventListener({
            onOpen: function (win) {
                Threading.initThread("tcon_crafting", function () {
                    try {
                        var container = win.getContainer();
                        var slot = void 0;
                        var recipe = void 0;
                        var result = void 0;
                        var statsHead = void 0;
                        var statsHandle = void 0;
                        var statsExtra = void 0;
                        var textCost = void 0;
                        var textTitle = void 0;
                        var textStats = void 0;
                        while (win.isOpened()) {
                            slot = container.getSlot("slot1");
                            recipe = PatternRegistry.getData(container.getSlot("slot0").id);
                            result = 0;
                            textCost = "";
                            textTitle = "";
                            textStats = "";
                            if (recipe) {
                                for (var key in Material) {
                                    result = 0;
                                    if (Material[key].getItem() === slot.id) {
                                        statsHead = Material[key].getHeadStats();
                                        statsHandle = Material[key].getHandleStats();
                                        statsExtra = Material[key].getExtraStats();
                                        textTitle = Material[key].getName();
                                        textStats = "Head" + "\n" +
                                            "Durability: " + statsHead.durability + "\n" +
                                            "Mining Level: " + TinkersMaterial.level[statsHead.level] + "\n" +
                                            "Mining Speed: " + statsHead.speed + "\n" +
                                            "Attack" + statsHead.attack + "\n" +
                                            "\n" +
                                            "Handle" + "\n" +
                                            "Modifier: " + statsHandle.modifier + "\n" +
                                            "Durability: " + statsHandle.durability + "\n" +
                                            "\n" +
                                            "Extra" + "\n" +
                                            "Durability: " + statsExtra.durability;
                                        if (!Material[key].isMetal) {
                                            textCost = "Material Value:  " + slot.count + " / " + recipe.cost;
                                            if (slot.count >= recipe.cost) {
                                                result = PartRegistry.getIDFromData(recipe.type, key);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            container.setText("textCost", textCost);
                            result ? container.setSlot("slotResult", result, 1, 0) : container.clearSlot("slotResult");
                            elements2.get("textTitle").onBindingUpdated("text", textTitle || "Part Builder");
                            elements2.get("textStats").onBindingUpdated("text", textStats || tutorial);
                            Thread.sleep(100);
                        }
                        container.clearSlot("slotResult");
                    }
                    catch (e) {
                        alert("PartBuilderError: " + e);
                    }
                });
            },
            onClose: function (win) {
                var container = win.getContainer();
                var tile = container.getParent();
                container.clearSlot("slotResult");
                tile.setAnimItem();
            }
        });
        return window;
    })();
    return PartBuilder;
}(TableBase));
TileEntity.registerPrototype(BlockID.tcon_partbuilder, new PartBuilder());
var RepairHandler = /** @class */ (function () {
    function RepairHandler() {
    }
    RepairHandler.calcRepairAmount = function (id) {
        for (var key in Material) {
            if (Material[key].getItem() === id) {
                return Material[key].getHeadStats().durability * this.value;
            }
        }
        return 0;
    };
    RepairHandler.calcRepair = function (tool, amount) {
        var toolData = new ToolData(tool);
        var origDur = toolData.getBaseStats().durability;
        var actDur = toolData.stats.durability;
        var modCount = TinkersModifierHandler.decodeToArray(tool.extra.getString("modifiers")).length;
        var increase = Math.max(Math.min(10, actDur / origDur) * amount, actDur / 64);
        increase *= 1 - Math.min(3, modCount) * 0.05;
        increase *= Math.max(0.5, 1 - tool.extra.getInt("repair") * 0.005);
        return Math.ceil(increase);
    };
    RepairHandler.value = MatValue.SHARD * 4 / MatValue.INGOT | 0;
    return RepairHandler;
}());
var ToolForgeHandler = /** @class */ (function () {
    function ToolForgeHandler() {
    }
    ToolForgeHandler.addVariation = function (tex, block) {
        var id;
        var data;
        if (typeof block === "number") {
            id = block;
            data = 0;
        }
        else {
            id = block.id;
            data = block.data;
        }
        if (this.variation.some(function (v) { return v.block.id === id && v.block.data === data; })) {
            return;
        }
        this.variations = this.variation.push({ tex: tex, block: { id: id, data: data } });
    };
    ToolForgeHandler.getTexByMeta = function (meta) {
        return this.variation[meta] ? this.variation[meta].tex : null;
    };
    ToolForgeHandler.createForge = function () {
        var _this = this;
        var array = [];
        for (var i = 0; i < this.variations; i++) {
            array.push({ name: "Tool Forge" });
        }
        var id = createBlock("tcon_toolforge", array);
        BlockModel.register(id, function (model, index) {
            var tex = _this.getTexByMeta(index);
            model.addBox(0 / 16, 15 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, "tcon_toolforge", 0);
            model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 15 / 16, 16 / 16, tex, 0);
            model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, tex, 0);
            model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, tex, 0);
            model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, tex, 0);
            model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, tex, 0);
            return model;
        }, this.variations);
        Item.addCreativeGroup("tcon_toolforge", "Tool Forge", [BlockID.tcon_toolstation, id]);
        this.variation.forEach(function (v, i) {
            Recipes2.addShaped({ id: id, data: i }, "aaa:bcb:b_b", { a: BlockID.tcon_stone, b: v.block, c: BlockID.tcon_toolstation });
        });
        TileEntity.registerPrototype(id, new ToolForge());
    };
    ToolForgeHandler.addContents = function (info) {
        var centerX = 160;
        var centerY = 210;
        var scale = 5;
        info.coords = [];
        for (var i = 0; i < 6; i++) {
            if (!info.slots[i]) {
                info.slots[i] = { x: 200, y: 36, bitmap: "classic_ slot" };
            }
            info.coords[i] = { x: info.slots[i].x / 61, z: info.slots[i].y / 61 };
            info.slots[i].x = info.slots[i].x * scale + centerX;
            info.slots[i].y = info.slots[i].y * scale + centerY;
            info.slots[i].bitmap = "tcon.slot." + info.slots[i].bitmap;
        }
        info.intro = addLineBreaks(16, info.intro);
        this.info.push(info);
    };
    ToolForgeHandler.getInfo = function (page) {
        return this.info[page];
    };
    ToolForgeHandler.addRecipe = function (result, pattern) {
        this.recipe.push({ result: result, pattern: pattern });
    };
    ToolForgeHandler.turnPage = function (page) {
        var container = this.window.getContainer();
        var tile = container.getParent();
        tile.data.page += page;
        tile.data.page = tile.data.page < 0 ? this.info.length - 1 : tile.data.page >= this.info.length ? 0 : tile.data.page;
        var info = this.getInfo(tile.data.page);
        if (page !== 0 && tile.blockID === BlockID.tcon_toolstation && info.forgeOnly) {
            this.turnPage(page);
            return;
        }
        var slot;
        for (var i = 0; i < 6; i++) {
            slot = this.content.elements["slot" + i];
            slot.x = info.slots[i].x;
            slot.y = info.slots[i].y;
            slot.bitmap = info.slots[i].bitmap;
        }
        tile.container.setText("textTitle", info.title);
        tile.container.setText("textStats", info.intro);
        this.content.elements.background.bitmap = info.background;
    };
    ToolForgeHandler.showInfo = function (item) {
        var container = this.window.getContainer();
        var toolData = new ToolData(item);
        var modifiers = TinkersModifierHandler.decodeToArray(item.extra.getString("modifiers"));
        container.setText("textStats", "Durability: " + (toolData.stats.durability - item.extra.getInt("durability")) + "/" + toolData.stats.durability + "\n" +
            "Mining Level: " + TinkersMaterial.level[toolData.stats.level] + "\n" +
            "Mining Speed: " + ((toolData.stats.efficiency * 100 | 0) / 100) + "\n" +
            "Attack: " + ((toolData.stats.damage * 100 | 0) / 100) + "\n" +
            "Modifiers: " + (Cfg.modifierSlots + toolData.getLevel() - modifiers.length));
        container.setText("textModifiers", modifiers.map(function (mod) {
            return Modifier[mod.type].getName() + " (" + mod.level + "/" + Modifier[mod.type].max + ")";
        }).join("\n"));
    };
    ToolForgeHandler.getWindow = function () {
        return this.window;
    };
    ToolForgeHandler.variation = [];
    ToolForgeHandler.info = [];
    ToolForgeHandler.recipe = [];
    ToolForgeHandler.consume = [];
    ToolForgeHandler.window = (function () {
        var window = new UI.StandardWindow({
            standart: {
                header: { text: { text: "Tool Forge" } },
                inventory: { standart: true },
                background: { standart: true }
            },
            drawing: [
                { type: "frame", x: 580, y: 0, width: 400, height: 240, bitmap: "tcon.frame", scale: 4 },
                { type: "frame", x: 580, y: 260, width: 400, height: 240, bitmap: "tcon.frame", scale: 4 }
            ],
            elements: {
                background: { type: "image", x: 50, y: 95, bitmap: "tcon.icon.repair", scale: 18.75 },
                slot0: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot1: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot2: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot3: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot4: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot5: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slotResult: { type: "slot", x: 420, y: 190, size: 120, visual: true, clicker: {
                        onClick: function (container, tile) {
                            if (container.getSlot("slotResult").id !== 0) {
                                try {
                                    var index = -1;
                                    for (var i = 0; i < 36; i++) {
                                        if (Player.getInventorySlot(i).id === 0) {
                                            index = i;
                                            break;
                                        }
                                    }
                                    if (index === -1) {
                                        alert("no space");
                                        return;
                                    }
                                    var slot = void 0;
                                    for (var i = 0; i < 6; i++) {
                                        slot = container.getSlot("slot" + i);
                                        slot.count -= ToolForgeHandler.consume[i] || 0;
                                        container.validateSlot("slot" + i);
                                    }
                                    slot = container.getSlot("slotResult");
                                    Player.setInventorySlot(index, slot.id, 1, slot.data, slot.extra);
                                    tile.blockID === BlockID.tcon_toolstation ? soundSaw.play() : World.playSoundAtEntity(player, "random.anvil_use", 0.9, 0.95 + 0.2 * Math.random());
                                }
                                catch (e) {
                                    alert("craftError: " + e);
                                }
                            }
                        }
                    } },
                buttonPrev: { type: "button", x: 50, y: 452, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                        onClick: function (container, tile) {
                            ToolForgeHandler.turnPage(-1);
                        }
                    } },
                buttonNext: { type: "button", x: 254, y: 452, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                        onClick: function (container, tile) {
                            ToolForgeHandler.turnPage(1);
                        }
                    } },
                //textTitle: {type: "text", x: 780, y: 0, font: {size: 30, color: Color.YELLOW, shadow: 0.5, alignment: 1, bold: true}},
                //textStats: {type: "text", x: 600, y: 60, font: {size: 26, color: Color.WHITE, shadow: 0.5}, multiline: true},
                //textModifiers: {type: "text", x: 600, y: 300, font: {size: 26, color: Color.WHITE, shadow: 0.5}, multiline: true},
                textDebug: { type: "text", x: 100, y: 0 }
            }
        });
        window.addWindow("stats", {
            location: { x: 712 + 10, y: 100 + 10, width: 400 * 0.64 - 20, height: 240 * 0.64 - 20, scrollY: 250 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT }
            ],
            elements: {
                textTitle: { type: "text", x: 500, y: -30, font: { size: 80, color: Color.YELLOW, shadow: 0.5, alignment: 1, bold: true } },
                textStats: { type: "text", x: 20, y: 120, font: { size: 72, color: Color.WHITE, shadow: 0.5 }, multiline: true }
            }
        });
        window.addWindow("modifiers", {
            location: { x: 712 + 10, y: 267 + 10, width: 400 * 0.64 - 20, height: 240 * 0.64 - 20, scrollY: 250 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "text", x: 500, y: 50, font: { size: 80, color: Color.YELLOW, shadow: 0.5, alignment: 1, bold: true }, text: "Modifiers" }
            ],
            elements: {
                textModifiers: { type: "text", x: 20, y: 120, font: { size: 72, color: Color.WHITE, shadow: 0.5 }, multiline: true }
            }
        });
        //width 640
        var windowMain = window.getWindow("content");
        ToolForgeHandler.content = windowMain.getContent();
        windowMain.setEventListener({
            onOpen: function (win) {
                var container = win.getContainer();
                var tile = container.getParent();
                ToolForgeHandler.turnPage(0);
                Threading.initThread("tcon_crafting", function () {
                    try {
                        var _loop_2 = function () {
                            var consume = [];
                            var slotTool = container.getSlot("slot0");
                            if (TinkersToolHandler.isTool(slotTool.id) && slotTool.extra) {
                                var slots = [];
                                var items_1 = [];
                                var slot_1;
                                var find = void 0;
                                for (var i = 1; i < 6; i++) {
                                    slot_1 = container.getSlot("slot" + i);
                                    slots[i] = { id: slot_1.id, count: slot_1.count, data: slot_1.data };
                                    if (slot_1.id === 0) {
                                        continue;
                                    }
                                    find = items_1.find(function (item) { return item.id === slot_1.id && item.data === slot_1.data; });
                                    find ? find.count += slot_1.count : items_1.push({ id: slot_1.id, count: slot_1.count, data: slot_1.data });
                                }
                                var addMod_1 = {};
                                var count = void 0;
                                for (var key in Modifier) {
                                    count = Math.min.apply(Math, Modifier[key].getRecipe().map(function (recipe) {
                                        var find2 = items_1.find(function (item) { return item.id === recipe.id && (recipe.data === -1 || item.data === recipe.data); });
                                        return find2 ? find2.count : 0;
                                    }));
                                    if (count > 0) {
                                        addMod_1[key] = count;
                                    }
                                }
                                var toolData_1 = new ToolData(slotTool);
                                var modifiers = TinkersModifierHandler.decodeToArray(slotTool.extra.getString("modifiers"));
                                var find3 = void 0;
                                var _loop_3 = function (key) {
                                    find3 = modifiers.find(function (mod) { return mod.type === key; });
                                    if (find3 && find3.level < Modifier[key].max) {
                                        addMod_1[key] = Math.min(addMod_1[key], Modifier[key].max - find3.level);
                                        find3.level += addMod_1[key];
                                        return "continue";
                                    }
                                    if (Modifier[key].canBeTogether(modifiers) && modifiers.length < Cfg.modifierSlots + toolData_1.getLevel()) {
                                        addMod_1[key] = Math.min(addMod_1[key], Modifier[key].max);
                                        modifiers.push({ type: key, level: addMod_1[key] });
                                    }
                                    else {
                                        delete addMod_1[key];
                                    }
                                };
                                for (var key in addMod_1) {
                                    _loop_3(key);
                                }
                                var mat_1 = toolData_1.toolData.getRepairParts().map(function (index) { return Material[toolData_1.materials[index]].getItem(); });
                                var space = slotTool.extra.getInt("durability");
                                var newDur = space;
                                var value = 0;
                                find = null;
                                count = 0;
                                var _loop_4 = function (i) {
                                    find = items_1.find(function (item) { return item.id === mat_1[i]; });
                                    if (find) {
                                        value = RepairHandler.calcRepairAmount(find.id);
                                        if (value > 0) {
                                            value *= toolData_1.toolData.getRepairModifierForPart(i);
                                            while (count < find.count && RepairHandler.calcRepair(slotTool, value * count) < space) {
                                                count++;
                                            }
                                            newDur = Math.max(0, space - (RepairHandler.calcRepair(slotTool, value * count) | 0));
                                            return "break";
                                        }
                                    }
                                };
                                for (var i = 0; i < mat_1.length; i++) {
                                    var state_1 = _loop_4(i);
                                    if (state_1 === "break")
                                        break;
                                }
                                items_1.length = 0;
                                var _loop_5 = function (key) {
                                    items_1.push.apply(items_1, Modifier[key].getRecipe().map(function (item) { return ({ id: item.id, count: addMod_1[key], data: item.data }); }));
                                };
                                for (var key in addMod_1) {
                                    _loop_5(key);
                                }
                                count > 0 && items_1.push({ id: find.id, count: count, data: 0 });
                                if (items_1.length > 0) {
                                    consume = slots.map(function (s) {
                                        var i = items_1.findIndex(function (item) { return item.id === s.id && (item.data === -1 || item.data === s.data); });
                                        if (i === -1) {
                                            return 0;
                                        }
                                        var min = Math.min(s.count, items_1[i].count);
                                        items_1[i].count -= min;
                                        items_1[i].count <= 0 && items_1.splice(i, 1);
                                        return min;
                                    });
                                    consume[0] = 1;
                                    var extra = slotTool.extra.copy();
                                    extra.putInt("durability", newDur);
                                    extra.putString("modifiers", TinkersModifierHandler.encodeToString(modifiers));
                                    container.setSlot("slotResult", slotTool.id, 1, Math.ceil(newDur / toolData_1.stats.durability * 14), extra);
                                }
                                else {
                                    container.clearSlot("slotResult");
                                }
                            }
                            else {
                                var result = ToolForgeHandler.recipe.find(function (recipe) {
                                    var slot;
                                    var partData;
                                    for (var i = 0; i < 6; i++) {
                                        slot = container.getSlot("slot" + i);
                                        if (recipe.pattern[i]) {
                                            partData = PartRegistry.getPartData(slot.id);
                                            if (!partData || partData.type !== recipe.pattern[i]) {
                                                return false;
                                            }
                                        }
                                        else if (slot.id !== 0) {
                                            return false;
                                        }
                                    }
                                    return true;
                                });
                                if (result) {
                                    var materials = [];
                                    var slot = void 0;
                                    var partData = void 0;
                                    for (var i = 0; i < result.pattern.length; i++) {
                                        slot = container.getSlot("slot" + i);
                                        partData = PartRegistry.getPartData(slot.id);
                                        partData ? materials.push(partData.material) : alert("part error: " + slot.id);
                                        consume[i] = 1;
                                    }
                                    var extra = new ItemExtraData();
                                    extra.putInt("durability", 0);
                                    extra.putInt("xp", 0);
                                    extra.putInt("repair", 0);
                                    extra.putString("materials", materials.join("_"));
                                    extra.putString("modifiers", "");
                                    container.setSlot("slotResult", result.result, 1, 0, extra);
                                }
                                else {
                                    container.clearSlot("slotResult");
                                }
                            }
                            var slotResult = container.getSlot("slotResult");
                            if (TinkersToolHandler.isTool(slotResult.id) && slotResult.extra) {
                                ToolForgeHandler.showInfo(slotResult);
                            }
                            else if (TinkersToolHandler.isTool(slotTool.id) && slotTool.extra) {
                                ToolForgeHandler.showInfo(slotTool);
                            }
                            else {
                                var info = ToolForgeHandler.getInfo(tile.data.page);
                                container.setText("textStats", info.intro);
                                container.setText("textModifiers", "       .\n     /( _________\n     |  >:=========`\n     )(  \n     \"\"");
                            }
                            ToolForgeHandler.consume = consume;
                            Thread.sleep(100);
                        };
                        while (win.isOpened()) {
                            _loop_2();
                        }
                    }
                    catch (e) {
                        alert("ToolForgeError: " + e);
                    }
                });
            },
            onClose: function (win) {
                var container = win.getContainer();
                var tile = container.getParent();
                container.clearSlot("slotResult");
                tile.setAnimItem();
            }
        });
        return window;
    })();
    return ToolForgeHandler;
}());
ToolForgeHandler.addContents({
    title: "Repair & Modify",
    background: "tcon.icon.repair",
    intro: "",
    slots: [
        { x: 0, y: 0, bitmap: "tool" },
        { x: -18, y: 20, bitmap: "lapis" },
        { x: -22, y: -5, bitmap: "dust" },
        { x: 0, y: -23, bitmap: "ingot" },
        { x: 22, y: -5, bitmap: "diamond" },
        { x: 18, y: 20, bitmap: "quartz" }
    ]
});
Callback.addCallback("PreLoaded", function () {
    ToolForgeHandler.addVariation("iron_block", VanillaBlockID.iron_block);
    ToolForgeHandler.addVariation("gold_block", VanillaBlockID.gold_block);
    ToolForgeHandler.addVariation("tcon_block_cobalt", BlockID.blockCobalt);
    ToolForgeHandler.addVariation("tcon_block_ardite", BlockID.blockArdite);
    ToolForgeHandler.addVariation("tcon_block_manyullyn", BlockID.blockManyullyn);
    ToolForgeHandler.addVariation("tcon_block_pigiron", BlockID.blockPigiron);
    ToolForgeHandler.addVariation("tcon_block_alubrass", BlockID.blockAlubrass);
    ToolForgeHandler.createForge();
});
createBlock("tcon_toolstation", [{ name: "Tool Station" }], "wood");
Recipes2.addShapedWith2x2("block:tcon_toolstation", "a:b", { a: "item:tcon_pattern_blank", b: "crafting_table" });
BlockModel.register(BlockID.tcon_toolstation, function (model, index) {
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [["tcon_toolstation", 0], ["tcon_toolstation", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, "tcon_table_side", 0);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, "tcon_table_side", 0);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, "tcon_table_side", 0);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, "tcon_table_side", 0);
    return model;
}, 1);
var ToolForge = /** @class */ (function (_super) {
    __extends(ToolForge, _super);
    function ToolForge() {
        var _this = _super.call(this, 6, 0.46875) || this;
        _this.defaultValues = {
            meta: 0,
            page: 0
        };
        return _this;
    }
    ToolForge.prototype.getGuiScreen = function () {
        return ToolForgeHandler.getWindow();
    };
    ToolForge.prototype.setAnimItem = function () {
        var info = ToolForgeHandler.getInfo(this.data.page);
        this.displayItem(info.coords);
    };
    return ToolForge;
}(TableBase));
TileEntity.registerPrototype(BlockID.tcon_toolstation, new ToolForge());
var Modifier = {
    haste: new ModHaste(),
    luck: new ModLuck(),
    sharp: new ModSharp(),
    diamond: new ModDiamond(),
    emerald: new ModEmerald(),
    silk: new ModSilk(),
    reinforced: new ModReinforced(),
    beheading: new ModBeheading(),
    smite: new ModSmite(),
    spider: new ModSpider(),
    fiery: new ModFiery(),
    necrotic: new ModNecrotic(),
    knockback: new ModKnockback(),
    mending: new ModMending(),
    shuling: new ModShulking(),
    web: new ModWeb()
};
var TinkersToolHandler = /** @class */ (function () {
    function TinkersToolHandler() {
    }
    TinkersToolHandler.registerTool = function (key, name, toolData) {
        var _this = this;
        var id = createItem("tcontool_" + key, name, { name: "tcontool_" + key }, { stack: 1, isTech: true });
        Item.setMaxDamage(id, 14);
        ToolLib.setTool(id, { durability: 0, level: 0, efficiency: 0, damage: 0 }, toolData);
        Item.registerNameOverrideFunction(id, function (item, name) {
            try {
                if (!item.extra) {
                    return name;
                }
                var toolData_2 = new ToolData(item);
                return toolData_2.getName(name);
            }
            catch (e) {
                alert("nameError: " + e);
            }
        });
        //ItemModel.getFor(id, -1).setModelOverrideCallback(item => item.extra ? this.getModel(item) : null);
        for (var i = 0; i <= 14; i++) {
            ItemModel.getFor(id, i).setModelOverrideCallback(function (item) { return item.extra ? _this.getModel(item) : null; });
        }
        this.tools[id] = true;
    };
    TinkersToolHandler.isTool = function (id) {
        return this.tools[id] || false;
    };
    TinkersToolHandler.getModel = function (item) {
        try {
            var toolData = new ToolData(item);
            var suffix = toolData.isBroken() ? "broken" : "normal";
            var texture = toolData.toolData.getTexture();
            var path = texture.getPath();
            var uniqueKey = toolData.uniqueKey();
            if (this.models[uniqueKey]) {
                return this.models[uniqueKey][suffix];
            }
            var mesh = [new RenderMesh(), new RenderMesh(), new RenderMesh(), new RenderMesh()];
            var coordsNormal_1 = [];
            var coordsBroken_1 = [];
            var index = void 0;
            for (var i = 0; i < toolData.toolData.partsCount; i++) {
                index = Material[toolData.materials[i]].getTexIndex();
                coordsNormal_1.push(texture.getCoords(i, index));
                coordsBroken_1.push(texture.getCoords(i === toolData.toolData.brokenIndex ? toolData.toolData.partsCount : i, index));
            }
            for (var key in toolData.modifiers) {
                index = Modifier[key].getTexIndex();
                coordsNormal_1.push(texture.getModCoords(index));
                coordsBroken_1.push(texture.getModCoords(index));
            }
            mesh.forEach(function (m, i) {
                var coords = i >> 1 ? coordsBroken_1 : coordsNormal_1;
                var z;
                for (var j = 0; j < coords.length; j++) {
                    z = i & 1 ? -0.001 * (coords.length - j) : 0.001 * (coords.length - j);
                    m.setColor(1, 1, 1);
                    m.setNormal(1, 1, 0);
                    m.addVertex(0, 1, z, coords[j].x, coords[j].y);
                    m.addVertex(1, 1, z, coords[j].x + 0.0625, coords[j].y);
                    m.addVertex(0, 0, z, coords[j].x, coords[j].y + 0.0625);
                    m.addVertex(1, 1, z, coords[j].x + 0.0625, coords[j].y);
                    m.addVertex(0, 0, z, coords[j].x, coords[j].y + 0.0625);
                    m.addVertex(1, 0, z, coords[j].x + 0.0625, coords[j].y + 0.0625);
                }
                if ((i & 1) === 0) {
                    m.translate(0.4, -0.1, 0.2);
                    m.rotate(0.5, 0.5, 0.5, 0, -2.1, 0.4);
                    m.scale(2, 2, 2);
                }
            });
            var data = {
                normal: { hand: mesh[0], ui: mesh[1] },
                broken: { hand: mesh[2], ui: mesh[3] }
            };
            var modelNormal = ItemModel.newStandalone();
            var modelBroken = ItemModel.newStandalone();
            modelNormal.setModel(data.normal.hand, path);
            modelNormal.setUiModel(data.normal.ui, path);
            modelNormal.setSpriteUiRender(true);
            modelBroken.setModel(data.broken.hand, path);
            modelBroken.setUiModel(data.broken.ui, path);
            modelBroken.setSpriteUiRender(true);
            this.models[uniqueKey] = { normal: modelNormal, broken: modelBroken };
            //Game.message(uniqueKey);
            return this.models[uniqueKey][suffix];
        }
        catch (e) {
            alert("iconError: " + e);
        }
    };
    TinkersToolHandler.tools = {};
    TinkersToolHandler.models = {};
    return TinkersToolHandler;
}());
var TinkersTool = /** @class */ (function () {
    function TinkersTool(blockTypes, partsCount, brokenIndex, isWeapon) {
        this.blockTypes = blockTypes;
        this.partsCount = partsCount;
        this.brokenIndex = brokenIndex;
        this.isWeapon = isWeapon;
        this.is3x3 = false;
    }
    TinkersTool.prototype.miningSpeedModifier = function () {
        return 1;
    };
    TinkersTool.prototype.damagePotential = function () {
        return 1;
    };
    TinkersTool.prototype.getRepairParts = function () {
        return [1]; //head
    };
    TinkersTool.prototype.getRepairModifierForPart = function (index) {
        return 1;
    };
    TinkersTool.prototype.modifyEnchant = function (enchant, item, coords, block) {
        if (item.extra) {
            var toolData = new ToolData(item);
            toolData.forEachModifiers(function (mod, level) {
                mod.applyEnchant(enchant, level);
            });
        }
    };
    TinkersTool.prototype.calcDestroyTime = function (item, coords, block, time) {
        if (!item.extra) {
            return time.base;
        }
        var toolData = new ToolData(item);
        var blockData = ToolAPI.getBlockData(block.id);
        var devider = 1;
        if (this.blockMaterials[blockData.material.name] && toolData.stats.level >= blockData.level && !toolData.isBroken()) {
            devider = toolData.stats.efficiency;
            if (blockData.isNative) {
                devider *= blockData.material.multiplier;
            }
            this.toolMaterial.level = toolData.stats.level;
        }
        else {
            this.toolMaterial.level = 0;
        }
        return time.base / devider / time.modifier;
    };
    TinkersTool.prototype.onDestroy = function (item, coords, block) {
        if (!item.extra) {
            return true;
        }
        var toolData = new ToolData(item);
        var blockData = ToolAPI.getBlockData(block.id);
        if (this.blockMaterials[blockData.material.name] && toolData.stats.level >= blockData.level && !toolData.isBroken()) {
            toolData.forEachModifiers(function (mod, level) {
                mod.onDestroy(item, coords, block, level);
            });
            toolData.consumeDurability(this.isWeapon ? 2 : 1);
            if (!this.isWeapon) {
                toolData.addXp(1);
            }
        }
        return true;
    };
    TinkersTool.prototype.onAttack = function (item, victim) {
        if (!item.extra) {
            return true;
        }
        var toolData = new ToolData(item);
        var bonus = 0;
        toolData.forEachModifiers(function (mod, level) {
            bonus += mod.onAttack(item, victim, level);
        });
        this.toolMaterial.damage = toolData.stats.damage + bonus;
        toolData.consumeDurability(this.isWeapon ? 1 : 2);
        this.isWeapon && toolData.addXp(1);
        return true;
    };
    TinkersTool.prototype.onDealDamage = function (item, victim, damageValue, damageType) {
        if (!item.extra) {
            return;
        }
        var toolData = new ToolData(item);
        toolData.forEachModifiers(function (mod, level) {
            mod.onDealDamage(victim, damageValue, damageType, level);
        });
    };
    TinkersTool.prototype.onKillEntity = function (item, entity, damageType) {
        if (!item.extra) {
            return;
        }
        var toolData = new ToolData(item);
        toolData.forEachModifiers(function (mod, level) {
            mod.onKillEntity(entity, damageType, level);
        });
    };
    TinkersTool.prototype.onBroke = function (item) {
        return true;
    };
    TinkersTool.prototype.onMending = function (item) {
        if (!item.extra) {
            return;
        }
        var toolData = new ToolData(item);
        var add = 0;
        toolData.forEachModifiers(function (mod, level) {
            add += mod.onMending(level);
        });
        toolData.setDurability(item.extra.getInt("durability") - add);
    };
    return TinkersTool;
}());
var TinkersTool3x3 = /** @class */ (function (_super) {
    __extends(TinkersTool3x3, _super);
    function TinkersTool3x3() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.is3x3 = true;
        return _this;
    }
    TinkersTool3x3.prototype.onDestroy = function (item, coords, block) {
        if (!item.extra) {
            return true;
        }
        var toolData = new ToolData(item);
        var vec = [["x", "z"], ["x", "y"], ["y", "z"]][coords.side >> 1];
        var c = { x: coords.x, y: coords.y, z: coords.z };
        var i;
        var j;
        var block2;
        var damage = 0;
        for (i = -1; i <= 1; i++) {
            for (j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                c[vec[0]] = coords[vec[0]] + i;
                c[vec[1]] = coords[vec[1]] + j;
                block2 = World.getBlock(c.x, c.y, c.z);
                if (this.blockMaterials[ToolAPI.getBlockMaterialName(block2.id)]) {
                    World.destroyBlock(c.x, c.y, c.z, true);
                    toolData.forEachModifiers(function (mod, level) {
                        mod.onDestroy(item, __assign(__assign({}, c), { side: coords.side, relative: World.getRelativeCoords(c.x, c.y, c.z, coords.side) }), block2, level);
                    });
                    damage++;
                }
            }
        }
        toolData.consumeDurability(damage);
        toolData.addXp(damage);
        return true;
    };
    return TinkersTool3x3;
}(TinkersTool));
Callback.addCallback("LevelLoaded", function () {
    Updatable.addUpdatable({
        update: function () {
            if (World.getThreadTime() % 150 === 0) {
                var item = Player.getCarriedItem();
                var toolData = ToolAPI.getToolData(item.id);
                toolData && toolData.onMending && toolData.onMending(item);
            }
        }
    });
});
Callback.addCallback("EntityHurt", function (attacker, victim, damageValue, damageType) {
    if (attacker === player) {
        var item = Player.getCarriedItem();
        var toolData = ToolAPI.getToolData(item.id);
        toolData && toolData.onDealDamage && toolData.onDealDamage(item, victim, damageValue, damageType);
    }
});
Callback.addCallback("EntityDeath", function (entity, attacker, damageType) {
    if (attacker === player) {
        var item = Player.getCarriedItem();
        var toolData = ToolAPI.getToolData(item.id);
        toolData && toolData.onKillEntity && toolData.onKillEntity(item, entity, damageType);
    }
});
/*
let posX = 0;
let posY = 0.1;
let posZ = 0;
let rotX = 0;
let rotY = -1;
let rotZ = 0.4;

const debugMessage = () => {
    Game.message("pos: " + [posX, posY, posZ]);
    Game.message("rot: " + [rotX, rotY, rotZ]);
}

Callback.addCallback("ItemUse", (c, item) => {
    item.id === VanillaItemID.apple && debugMessage();
});

const debugWindow = new UI.Window({
    location: {x: 0, y: 0, width: 100, height: 300},
    elements: {
        minusPosX: {type: "button", x: 0, y: 0, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                posX -= 0.1;
            }
        }},
        plusPosX: {type: "button", x: 500, y: 0, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                posX += 0.1;
            }
        }},
        minusPosY: {type: "button", x: 0, y: 500, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                posY -= 0.1;
            }
        }},
        plusPosY: {type: "button", x: 500, y: 500, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                posY += 0.1;
            }
        }},
        minusPosZ: {type: "button", x: 0, y: 1000, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                posZ -= 0.1;
            }
        }},
        plusPosZ: {type: "button", x: 500, y: 1000, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                posZ += 0.1;
            }
        }},
        minusRotX: {type: "button", x: 0, y: 1500, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                rotX -= 0.1;
            }
        }},
        mplusRotX: {type: "button", x: 500, y: 1500, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                rotX += 0.1;
            }
        }},
        minusRotY: {type: "button", x: 0, y: 2000, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                rotY -= 0.1;
            }
        }},
        plusRotY: {type: "button", x: 500, y: 2000, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                rotY += 0.1;
            }
        }},
        minusRotZ: {type: "button", x: 0, y: 2500, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                rotZ -= 0.1;
            }
        }},
        plusRotZ: {type: "button", x: 500, y: 2500, scale: 31.25, bitmap: "default_button_up", clicker: {
            onClick: () => {
                rotZ += 0.1;
            }
        }}
    }
});

Callback.addCallback("NativeGuiChanged", function(screen){
    if(screen == "hud_screen" || screen == "in_game_play_screen"){
        debugWindow.open();
    }
    else{
        debugWindow.close();
    }
});
*/ 
var texturePickaxe = new ToolTexture("model/tcontool_pickaxe");
var TinkersPickaxe = /** @class */ (function (_super) {
    __extends(TinkersPickaxe, _super);
    function TinkersPickaxe() {
        return _super.call(this, ["stone"], 3, 1) || this;
    }
    TinkersPickaxe.prototype.buildStats = function (materials) {
        var stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        return stats;
    };
    TinkersPickaxe.prototype.getTexture = function () {
        return texturePickaxe;
    };
    return TinkersPickaxe;
}(TinkersTool));
TinkersToolHandler.registerTool("pickaxe", "Pickaxe", new TinkersPickaxe());
ToolForgeHandler.addRecipe(ItemID.tcontool_pickaxe, ["rod", "pickaxe", "binding"]);
ToolForgeHandler.addContents({
    title: "Pickaxe",
    background: "tcon.icon.pickaxe",
    intro: "The Pickaxe is a precise mining tool. It is effective on stone and ores. It breaks blocks, OK?",
    slots: [
        { x: -18, y: 18, bitmap: "rod" },
        { x: 20, y: -20, bitmap: "pickaxe" },
        { x: 0, y: 0, bitmap: "binding" }
    ]
});
var textureShovel = new ToolTexture("model/tcontool_shovel");
var TinkersShovel = /** @class */ (function (_super) {
    __extends(TinkersShovel, _super);
    function TinkersShovel() {
        return _super.call(this, ["dirt"], 3, 1) || this;
    }
    TinkersShovel.prototype.buildStats = function (materials) {
        var stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        return stats;
    };
    TinkersShovel.prototype.damagePotential = function () {
        return 0.9;
    };
    TinkersShovel.prototype.getTexture = function () {
        return textureShovel;
    };
    TinkersShovel.prototype.useItem = function (coords, item, block) {
        if (item.extra && block.id == VanillaBlockID.grass && coords.side == 1) {
            var toolData = new ToolData(item);
            World.setBlock(coords.x, coords.y, coords.z, VanillaBlockID.grass_path);
            World.playSound(coords.x + 0.5, coords.y + 1, coords.z + 0.5, "step.grass", 1, 0.8);
            toolData.consumeDurability(1);
            toolData.addXp(1);
            toolData.applyHand();
        }
    };
    return TinkersShovel;
}(TinkersTool));
TinkersToolHandler.registerTool("shovel", "Shovel", new TinkersShovel());
ToolForgeHandler.addRecipe(ItemID.tcontool_shovel, ["rod", "shovel", "binding"]);
ToolForgeHandler.addContents({
    title: "Shovel",
    background: "tcon.icon.shovel",
    intro: "The Shovel digs up dirt. It is effective on dirt, sand, gravel, and snow. Just don't dig your own grave!",
    slots: [
        { x: 0, y: 0, bitmap: "rod" },
        { x: 18, y: -18, bitmap: "shovel" },
        { x: -20, y: 20, bitmap: "binding" }
    ]
});
var textureHatchet = new ToolTexture("model/tcontool_hatchet");
var TinkersHatchet = /** @class */ (function (_super) {
    __extends(TinkersHatchet, _super);
    function TinkersHatchet() {
        return _super.call(this, ["wood", "plant"], 3, 1) || this;
    }
    TinkersHatchet.prototype.buildStats = function (materials) {
        var stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        stats.attack += 0.5;
        return stats;
    };
    TinkersHatchet.prototype.damagePotential = function () {
        return 1.1;
    };
    TinkersHatchet.prototype.getTexture = function () {
        return textureHatchet;
    };
    TinkersHatchet.prototype.onDestroy = function (item, coords, block) {
        if (!item.extra) {
            return true;
        }
        var toolData = new ToolData(item);
        var blockData = ToolAPI.getBlockData(block.id);
        if (this.blockMaterials[blockData.material.name] && toolData.stats.level >= blockData.level && !toolData.isBroken()) {
            toolData.forEachModifiers(function (mod, level) {
                mod.onDestroy(item, coords, block, level);
            });
            if (blockData.material.name !== "plant") {
                toolData.consumeDurability(this.isWeapon ? 2 : 1);
                if (!this.isWeapon) {
                    toolData.addXp(1);
                }
            }
        }
        return true;
    };
    TinkersHatchet.prototype.useItem = function (coords, item, block) {
        if (!item.extra) {
            return;
        }
        var toolData = new ToolData(item);
        var id;
        if (block.id === VanillaBlockID.log) {
            switch (block.data) {
                case 0:
                    id = VanillaBlockID.stripped_oak_log;
                    break;
                case 1:
                    id = VanillaBlockID.stripped_spruce_log;
                    break;
                case 2:
                    id = VanillaBlockID.stripped_birch_log;
                    break;
                case 3:
                    id = VanillaBlockID.stripped_jungle_log;
                    break;
            }
        }
        else if (block.id === VanillaBlockID.log2) {
            id = block.data === 0 ? VanillaBlockID.stripped_acacia_log : VanillaBlockID.stripped_dark_oak_log;
        }
        if (id !== undefined) {
            World.setBlock(coords.x, coords.y, coords.z, id, 0);
            toolData.consumeDurability(1);
            toolData.addXp(1);
            toolData.applyHand();
        }
    };
    return TinkersHatchet;
}(TinkersTool));
TinkersToolHandler.registerTool("hatchet", "Hatchet", new TinkersHatchet());
ToolForgeHandler.addRecipe(ItemID.tcontool_hatchet, ["rod", "axe", "binding"]);
ToolForgeHandler.addContents({
    title: "Hatchet",
    background: "tcon.icon.hatchet",
    intro: "The Hatchet chops up wood and makes short work of leaves. It also makes for a passable weapon. Chop chop!",
    slots: [
        { x: -11, y: 11, bitmap: "rod" },
        { x: -2, y: -20, bitmap: "axe" },
        { x: 18, y: -8, bitmap: "binding" }
    ]
});
var textureMattock = new ToolTexture("model/tcontool_mattock");
var TinkersMattock = /** @class */ (function (_super) {
    __extends(TinkersMattock, _super);
    function TinkersMattock() {
        return _super.call(this, ["wood", "dirt"], 3, 1) || this;
    }
    TinkersMattock.prototype.buildStats = function (materials) {
        var stats = new ToolStats();
        stats.head(materials[1], materials[2]);
        stats.handle(materials[0]);
        stats.attack += 3;
        return stats;
    };
    TinkersMattock.prototype.miningSpeedModifier = function () {
        return 0.95;
    };
    TinkersMattock.prototype.damagePotential = function () {
        return 0.9;
    };
    TinkersMattock.prototype.getTexture = function () {
        return textureMattock;
    };
    TinkersMattock.prototype.getRepairParts = function () {
        return [1, 2];
    };
    TinkersMattock.prototype.useItem = function (coords, item, block) {
        if (item.extra && (block.id == VanillaBlockID.grass || block.id == VanillaBlockID.dirt) && coords.side == 1) {
            var toolData = new ToolData(item);
            World.setBlock(coords.x, coords.y, coords.z, VanillaBlockID.farmland);
            World.playSound(coords.x + 0.5, coords.y + 1, coords.z + 0.5, "step.gravel", 1, 0.8);
            toolData.consumeDurability(1);
            toolData.addXp(1);
            toolData.applyHand();
        }
    };
    return TinkersMattock;
}(TinkersTool));
TinkersToolHandler.registerTool("mattock", "Mattock", new TinkersMattock());
ToolForgeHandler.addRecipe(ItemID.tcontool_mattock, ["rod", "axe", "shovel"]);
ToolForgeHandler.addContents({
    title: "Mattock",
    background: "tcon.icon.mattock",
    intro: "The Cutter Mattock is a versatile farming tool. It is effective on wood, dirt, and plants. It also packs quite a punch.",
    slots: [
        { x: -11, y: 11, bitmap: "rod" },
        { x: -2, y: -20, bitmap: "axe" },
        { x: 18, y: -8, bitmap: "shovel" }
    ]
});
var textureSword = new ToolTexture("model/tcontool_sword");
var TinkersSword = /** @class */ (function (_super) {
    __extends(TinkersSword, _super);
    function TinkersSword() {
        return _super.call(this, ["fibre"], 3, 1, true) || this;
    }
    TinkersSword.prototype.buildStats = function (materials) {
        var stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        stats.attack += 1;
        stats.durability *= TinkersSword.DURABILITY_MODIFIER;
        return stats;
    };
    TinkersSword.prototype.getTexture = function () {
        return textureSword;
    };
    TinkersSword.prototype.getRepairModifierForPart = function (index) {
        return TinkersSword.DURABILITY_MODIFIER;
    };
    TinkersSword.DURABILITY_MODIFIER = 1.1;
    return TinkersSword;
}(TinkersTool));
TinkersToolHandler.registerTool("sword", "Broad Sword", new TinkersSword());
ToolForgeHandler.addRecipe(ItemID.tcontool_sword, ["rod", "sword", "guard"]);
ToolForgeHandler.addContents({
    title: "Broad Sword",
    background: "tcon.icon.sword",
    intro: "The Broad Sword is a universal weapon. Sweep attacks keep enemy hordes at bay. Also good against cobwebs!",
    slots: [
        { x: -21, y: 20, bitmap: "rod" },
        { x: 15, y: -16, bitmap: "sword" },
        { x: -3, y: 2, bitmap: "guard" }
    ]
});
var textureHammer = new ToolTexture("model/tcontool_hammer");
var TinkersHammer = /** @class */ (function (_super) {
    __extends(TinkersHammer, _super);
    function TinkersHammer() {
        return _super.call(this, ["stone"], 4, 0) || this;
    }
    TinkersHammer.prototype.buildStats = function (materials) {
        var stats = new ToolStats();
        stats.head(materials[1], materials[1], materials[2], materials[3]);
        stats.handle(materials[0]);
        stats.level = Material[materials[1]].getHeadStats().level;
        stats.durability *= TinkersHammer.DURABILITY_MODIFIER;
        return stats;
    };
    TinkersHammer.prototype.miningSpeedModifier = function () {
        return 0.4;
    };
    TinkersHammer.prototype.damagePotential = function () {
        return 1.2;
    };
    TinkersHammer.prototype.getTexture = function () {
        return textureHammer;
    };
    TinkersHammer.prototype.getRepairParts = function () {
        return [1, 2, 3];
    };
    TinkersHammer.prototype.getRepairModifierForPart = function (index) {
        return index === 1 ? TinkersHammer.DURABILITY_MODIFIER : TinkersHammer.DURABILITY_MODIFIER * 0.6;
    };
    TinkersHammer.DURABILITY_MODIFIER = 2.5;
    return TinkersHammer;
}(TinkersTool3x3));
TinkersToolHandler.registerTool("hammer", "Hammer", new TinkersHammer());
ToolForgeHandler.addRecipe(ItemID.tcontool_hammer, ["rod2", "hammer", "largeplate", "largeplate"]);
ToolForgeHandler.addContents({
    title: "Hammer",
    background: "tcon.icon.hammer",
    intro: "The Hammer is a broad mining tool. It harvests blocks in a wide range. Also effective against undead.",
    slots: [
        { x: -12, y: 10, bitmap: "rod2" },
        { x: 11, y: -13, bitmap: "hammer" },
        { x: 24, y: 6, bitmap: "plate" },
        { x: -8, y: -26, bitmap: "plate" }
    ],
    forgeOnly: true
});
var textureExcavator = new ToolTexture("model/tcontool_excavator");
var TinkersExcavator = /** @class */ (function (_super) {
    __extends(TinkersExcavator, _super);
    function TinkersExcavator() {
        return _super.call(this, ["dirt"], 4, 0) || this;
    }
    TinkersExcavator.prototype.buildStats = function (materials) {
        var stats = new ToolStats();
        stats.head(materials[1], materials[2]);
        stats.extra(materials[3]);
        stats.handle(materials[0]);
        stats.durability *= TinkersExcavator.DURABILITY_MODIFIER;
        return stats;
    };
    TinkersExcavator.prototype.miningSpeedModifier = function () {
        return 0.28;
    };
    TinkersExcavator.prototype.damagePotential = function () {
        return 1.25;
    };
    TinkersExcavator.prototype.getTexture = function () {
        return textureExcavator;
    };
    TinkersExcavator.prototype.getRepairParts = function () {
        return [1, 2];
    };
    TinkersExcavator.prototype.getRepairModifierForPart = function (index) {
        return index === 1 ? TinkersExcavator.DURABILITY_MODIFIER : TinkersExcavator.DURABILITY_MODIFIER * 0.75;
    };
    TinkersExcavator.DURABILITY_MODIFIER = 1.75;
    return TinkersExcavator;
}(TinkersTool3x3));
TinkersToolHandler.registerTool("excavator", "Excavator", new TinkersExcavator());
ToolForgeHandler.addRecipe(ItemID.tcontool_excavator, ["rod2", "excavator", "largeplate", "binding2"]);
ToolForgeHandler.addContents({
    title: "Excavator",
    background: "tcon.icon.excavator",
    intro: "The Excavator is a broad digging tool. It digs up large areas of soil and snow in a wide range. Terraforming!",
    slots: [
        { x: -8, y: 4, bitmap: "rod2" },
        { x: 12, y: -16, bitmap: "excavator" },
        { x: -8, y: -16, bitmap: "plate" },
        { x: -26, y: 20, bitmap: "binding2" }
    ],
    forgeOnly: true
});
var _a;
var textureLumberaxe = new ToolTexture("model/tcontool_lumberaxe");
var TinkersLumberaxe = /** @class */ (function (_super) {
    __extends(TinkersLumberaxe, _super);
    /*
        static leaves = {
            [VanillaBlockID.leaves]: true,
            [VanillaBlockID.leaves2]: true
        }
    */
    function TinkersLumberaxe() {
        var _this = _super.call(this, ["wood"], 3, 1) || this;
        _this.is3x3 = true;
        return _this;
    }
    TinkersLumberaxe.prototype.buildStats = function (materials) {
        var stats = new ToolStats();
        stats.head(materials[1], materials[2]);
        stats.extra(materials[3]);
        stats.handle(materials[0]);
        stats.attack += 2;
        stats.durability *= TinkersLumberaxe.DURABILITY_MODIFIER;
        return stats;
    };
    TinkersLumberaxe.prototype.miningSpeedModifier = function () {
        return 0.35;
    };
    TinkersLumberaxe.prototype.damagePotential = function () {
        return 1.2;
    };
    TinkersLumberaxe.prototype.getTexture = function () {
        return textureLumberaxe;
    };
    TinkersLumberaxe.prototype.getRepairParts = function () {
        return [1, 2];
    };
    TinkersLumberaxe.prototype.getRepairModifierForPart = function (index) {
        return index === 1 ? TinkersLumberaxe.DURABILITY_MODIFIER : TinkersLumberaxe.DURABILITY_MODIFIER * 0.625;
    };
    TinkersLumberaxe.prototype.onDestroy = function (item, coords, block) {
        if (!item.extra) {
            return true;
        }
        var toolData = new ToolData(item);
        if (TinkersLumberaxe.logs[block.id]) {
            var thread = Threading.getThread("tcon_choptree");
            if (thread && thread.isAlive()) {
                Game.tipMessage("");
                return;
            }
            Threading.initThread("tcon_choptree", function () {
                var array = [];
                var visited = [];
                var pos;
                var pos2;
                var blo;
                var i;
                var j;
                array.push({ x: coords.x, y: coords.y, z: coords.z });
                while (array.length > 0 && Player.getCarriedItem().id === item.id && !toolData.isBroken()) {
                    pos = array.shift();
                    if (visited.some(function (p) { return p.x === pos.x && p.y === pos.y && p.z === pos.z; })) {
                        continue;
                    }
                    visited.push(pos);
                    blo = World.getBlock(pos.x, pos.y, pos.z);
                    if (!TinkersLumberaxe.logs[blo.id] && (coords.x !== pos.x || coords.y !== pos.y || coords.z !== pos.z)) {
                        continue;
                    }
                    for (i = 2; i < 6; i++) {
                        pos2 = World.getRelativeCoords(pos.x, pos.y, pos.z, i);
                        if (!visited.some(function (p) { return p.x === pos2.x && p.y === pos2.y && p.z === pos2.z; })) {
                            array.push(pos2);
                        }
                    }
                    for (i = -1; i <= 1; i++) {
                        for (j = -1; j <= 1; j++) {
                            pos2 = { x: pos.x + i, y: pos.y + 1, z: pos.z + j };
                            if (!visited.some(function (p) { return p.x === pos2.x && p.y === pos2.y && p.z === pos2.z; })) {
                                array.push(pos2);
                            }
                        }
                    }
                    World.destroyBlock(pos.x, pos.y, pos.z, true);
                    toolData.forEachModifiers(function (mod, level) {
                        mod.onDestroy(item, __assign(__assign({}, pos), { side: 0, relative: pos }), blo, level);
                    });
                    toolData.consumeDurability(1);
                    toolData.addXp(1);
                    toolData.applyHand();
                    Thread.sleep(25);
                }
            });
            return true;
        }
        if (this.blockMaterials[ToolAPI.getBlockMaterialName(block.id)]) {
            var center = World.getRelativeCoords(coords.x, coords.y, coords.z, coords.side ^ 1);
            var x_1;
            var y_1;
            var z_1;
            var block2_1;
            var damage = 0;
            for (x_1 = center.x - 1; x_1 <= center.x + 1; x_1++) {
                for (y_1 = center.y - 1; y_1 <= center.y + 1; y_1++) {
                    for (z_1 = center.z - 1; z_1 <= center.z + 1; z_1++) {
                        if (x_1 === coords.x && y_1 === coords.y && z_1 === coords.z) {
                            continue;
                        }
                        block2_1 = World.getBlock(x_1, y_1, z_1);
                        if (this.blockMaterials[ToolAPI.getBlockMaterialName(block2_1.id)]) {
                            World.destroyBlock(x_1, y_1, z_1, true);
                            toolData.forEachModifiers(function (mod, level) {
                                mod.onDestroy(item, { x: x_1, y: y_1, z: z_1, side: coords.side, relative: World.getRelativeCoords(x_1, y_1, z_1, coords.side) }, block2_1, level);
                            });
                            damage++;
                        }
                    }
                }
            }
            toolData.consumeDurability(damage);
            toolData.addXp(damage);
        }
        return true;
    };
    TinkersLumberaxe.DURABILITY_MODIFIER = 2;
    TinkersLumberaxe.logs = (_a = {},
        _a[VanillaBlockID.log] = true,
        _a[VanillaBlockID.log2] = true,
        _a);
    return TinkersLumberaxe;
}(TinkersTool));
TinkersToolHandler.registerTool("lumberaxe", "Lumber Axe", new TinkersLumberaxe());
ToolForgeHandler.addRecipe(ItemID.tcontool_lumberaxe, ["rod2", "broadaxe", "largeplate", "binding2"]);
ToolForgeHandler.addContents({
    title: "Lumber Axe",
    background: "tcon.icon.lumberaxe",
    intro: "The Lumber Axe is a broad chopping tool. It can fell entire trees in one swoop or gather wood in a wide range. Timber!",
    slots: [
        { x: -1, y: 4, bitmap: "rod2" },
        { x: 0, y: -20, bitmap: "broadaxe" },
        { x: 20, y: -4, bitmap: "plate" },
        { x: -20, y: 20, bitmap: "binding2" }
    ],
    forgeOnly: true
});
ModAPI.addAPICallback("ICore", function (api) {
    CastingRecipe.addMakeCastRecipes(ItemID.ingotCopper, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotTin, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotBronze, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotSteel, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotLead, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotSilver, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.plateCopper, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateTin, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateBronze, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateIron, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateSteel, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateGold, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateLead, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateLapis, "plate");
    MeltingRecipe.addRecipe(BlockID.machineBlockBasic, "molten_iron", MatValue.INGOT * 8);
    MeltingRecipe.addRecipe(ItemID.cutter, "molten_iron", MatValue.INGOT * 5);
    MeltingRecipe.addRecipe(ItemID.craftingHammer, "molten_iron", MatValue.INGOT * 5);
    MeltingRecipe.addRecipe(ItemID.dustIron, "molten_iron", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateIron, "molten_iron", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustGold, "molten_gold", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateGold, "molten_gold", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.oreCopper, "molten_copper", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockCopper, "molten_copper", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotCopper, "molten_copper", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustCopper, "molten_copper", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateCopper, "molten_copper", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.oreTin, "molten_tin", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockTin, "molten_tin", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotTin, "molten_tin", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustTin, "molten_tin", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateTin, "molten_tin", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.blockBronze, "molten_bronze", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotBronze, "molten_bronze", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustBronze, "molten_bronze", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateBronze, "molten_bronze", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.wrenchBronze, "molten_bronze", MatValue.INGOT * 6);
    MeltingRecipe.addRecipe(ItemID.bronzeHelmet, "molten_bronze", MatValue.INGOT * 5);
    MeltingRecipe.addRecipe(ItemID.bronzeChestplate, "molten_bronze", MatValue.INGOT * 8);
    MeltingRecipe.addRecipe(ItemID.bronzeLeggings, "molten_bronze", MatValue.INGOT * 7);
    MeltingRecipe.addRecipe(ItemID.bronzeBoots, "molten_bronze", MatValue.INGOT * 4);
    MeltingRecipe.addRecipe(ItemID.bronzeSword, "molten_bronze", MatValue.INGOT * 2);
    MeltingRecipe.addRecipe(ItemID.bronzeShovel, "molten_bronze", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.bronzePickaxe, "molten_bronze", MatValue.INGOT * 3);
    MeltingRecipe.addRecipe(ItemID.bronzeAxe, "molten_bronze", MatValue.INGOT * 3);
    MeltingRecipe.addRecipe(ItemID.bronzeHoe, "molten_bronze", MatValue.INGOT * 2);
    MeltingRecipe.addRecipe(BlockID.oreLead, "molten_lead", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockLead, "molten_lead", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotLead, "molten_lead", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustLead, "molten_lead", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateLead, "molten_lead", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.blockSilver, "molten_silver", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotSilver, "molten_silver", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustSilver, "molten_silver", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.blockSteel, "molten_steel", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotSteel, "molten_steel", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateSteel, "molten_steel", MatValue.INGOT);
    CastingRecipe.addBasinRecipe(0, "molten_copper", BlockID.blockCopper);
    CastingRecipe.addBasinRecipe(0, "molten_tin", BlockID.blockTin);
    CastingRecipe.addBasinRecipe(0, "molten_bronze", BlockID.blockBronze);
    CastingRecipe.addBasinRecipe(0, "molten_lead", BlockID.blockLead);
    CastingRecipe.addBasinRecipe(0, "molten_silver", BlockID.blockSilver);
    CastingRecipe.addBasinRecipe(0, "molten_steel", BlockID.blockSteel);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_copper", ItemID.ingotCopper, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_tin", ItemID.ingotTin, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_bronze", ItemID.ingotBronze, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_lead", ItemID.ingotLead, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_silver", ItemID.ingotSilver, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_steel", ItemID.ingotSteel, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_iron", ItemID.plateIron, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_gold", ItemID.plateGold, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_copper", ItemID.plateCopper, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_tin", ItemID.plateTin, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_bronze", ItemID.plateBronze, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_lead", ItemID.plateLead, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_steel", ItemID.plateSteel, false);
    ToolForgeHandler.addVariation("block_copper", BlockID.blockCopper);
    ToolForgeHandler.addVariation("block_tin", BlockID.blockTin);
    ToolForgeHandler.addVariation("block_bronze", BlockID.blockBronze);
    ToolForgeHandler.addVariation("block_lead", BlockID.blockLead);
    ToolForgeHandler.addVariation("block_silver", BlockID.blockSilver);
    ToolForgeHandler.addVariation("block_steel", BlockID.blockSteel);
    TinkersLumberaxe.logs[BlockID.rubberTreeLog] = true;
    TinkersLumberaxe.logs[BlockID.rubberTreeLogLatex] = true;
    //TinkersLumberaxe.leaves[BlockID.rubberTreeLeaves] = true;
});
ModAPI.addAPICallback("RedCore", function (api) {
    CastingRecipe.addMakeCastRecipes(ItemID.ingotCopper, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotTin, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotBronze, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotSilver, "ingot");
    MeltingRecipe.addRecipe(BlockID.oreCopper, "molten_copper", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockCopper, "molten_copper", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotCopper, "molten_copper", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.oreTin, "molten_tin", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockTin, "molten_tin", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotTin, "molten_tin", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.blockBronze, "molten_bronze", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotBronze, "molten_bronze", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.oreSilver, "molten_silver", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockSilver, "molten_silver", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotSilver, "molten_silver", MatValue.INGOT);
    CastingRecipe.addBasinRecipe(0, "molten_copper", BlockID.blockCopper);
    CastingRecipe.addBasinRecipe(0, "molten_tin", BlockID.blockTin);
    CastingRecipe.addBasinRecipe(0, "molten_bronze", BlockID.blockBronze);
    CastingRecipe.addBasinRecipe(0, "molten_silver", BlockID.blockSilver);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_copper", ItemID.ingotCopper, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_tin", ItemID.ingotTin, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_bronze", ItemID.ingotBronze, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_silver", ItemID.ingotSilver, false);
    ToolForgeHandler.addVariation("block_copper", BlockID.blockCopper);
    ToolForgeHandler.addVariation("block_tin", BlockID.blockTin);
    ToolForgeHandler.addVariation("block_bronze", BlockID.blockBronze);
    ToolForgeHandler.addVariation("block_silver", BlockID.blockSilver);
});
ModAPI.addAPICallback("ForestryAPI", function (api) {
    CastingRecipe.addMakeCastRecipes(ItemID.ingotCopper, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotTin, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotBronze, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.gearCopper, "gear");
    CastingRecipe.addMakeCastRecipes(ItemID.gearTin, "gear");
    CastingRecipe.addMakeCastRecipes(ItemID.gearBronze, "gear");
    MeltingRecipe.addRecipe(BlockID.oreCopper, "molten_copper", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockCopper, "molten_copper", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotCopper, "molten_copper", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.oreTin, "molten_tin", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockTin, "molten_tin", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotTin, "molten_tin", MatValue.INGOT);
    MeltingRecipe.addRecipe(BlockID.blockBronze, "molten_bronze", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotBronze, "molten_bronze", MatValue.INGOT);
    CastingRecipe.addBasinRecipe(0, "molten_copper", BlockID.blockCopper);
    CastingRecipe.addBasinRecipe(0, "molten_tin", BlockID.blockTin);
    CastingRecipe.addBasinRecipe(0, "molten_bronze", BlockID.blockBronze);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_copper", ItemID.ingotCopper, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_tin", ItemID.ingotTin, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_bronze", ItemID.ingotBronze, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_gear, "molten_copper", ItemID.gearCopper, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_gear, "molten_tin", ItemID.gearTin, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_gear, "molten_bronze", ItemID.gearBronze, false);
    ToolForgeHandler.addVariation("block_copper", BlockID.blockCopper);
    ToolForgeHandler.addVariation("block_tin", BlockID.blockTin);
    ToolForgeHandler.addVariation("block_bronze", BlockID.blockBronze);
});
var RV;
ModAPI.addAPICallback("RecipeViewer", function (api) {
    RV = api.Core;
    UI.TextureSource.put("tcon.rv.table", FileTools.ReadImage(__dir__ + "res/terrain-atlas/smeltery/tcon_itemcast_2.png"));
    UI.TextureSource.put("tcon.rv.basin", FileTools.ReadImage(__dir__ + "res/terrain-atlas/smeltery/tcon_blockcast_2.png"));
    var setLiquidScale = function (scale, text, liquid) {
        scale.setBinding("texture", LiquidRegistry.getLiquidUITexture(liquid.liquid, 108, 234));
        scale.setBinding("value", Math.min(1, liquid.amount / MatValue.BLOCK));
        text.setBinding("text", LiquidRegistry.getLiquidName(liquid.liquid) + "\n" + liquid.amount + " mB");
    };
    Callback.addCallback("PostLoaded", function () {
        RV.registerRecipeType("tcon_partbuilder", {
            title: "Part Build",
            contents: {
                icon: BlockID.tcon_partbuilder,
                drawing: [
                    { type: "bitmap", x: 476, y: 104, bitmap: "tcon.arrow", scale: 8 }
                ],
                elements: {
                    input0: { x: 180, y: 100, size: 128 },
                    input1: { x: 308, y: 100, size: 128 },
                    output0: { x: 692, y: 100, size: 128 },
                },
                moveItems: { x: 840, y: 180, slots: ["slot0", "slot1"] }
            },
            recipeList: PatternRegistry.getAllRecipeForRV()
        });
        RV.registerRecipeType("tcon_melting", {
            title: "Melting",
            contents: {
                icon: BlockID.tcon_smeltery,
                description: "melting",
                drawing: [
                    { type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6 },
                    { type: "bitmap", x: 614, y: 50, bitmap: "tcon.rv.smeltery", scale: 6 },
                    { type: "bitmap", x: 452, y: 176, bitmap: "tcon.rv.fire_tank", scale: 6 }
                ],
                elements: {
                    input0: { x: 182, y: 176, bitmap: "_default_slot_empty", size: 108 },
                    scaleLiquid: { type: "scale", x: 710, y: 50, width: 108, height: 234, direction: 1 },
                    textTemp: { type: "text", x: 500, y: 50, font: { size: 50, alignment: 1 } },
                    textLiquid: { type: "text", x: 614, y: 380, font: { color: Color.WHITE, size: 40, shadow: 0.5 }, multiline: true }
                }
            },
            recipeList: MeltingRecipe.getAllRecipeForRV(),
            onOpen: function (elements, recipe) {
                setLiquidScale(elements.get("scaleLiquid"), elements.get("textLiquid"), recipe.outputLiq);
                elements.get("textTemp").setBinding("text", recipe.temp + "°C");
            }
        });
        RV.registerRecipeType("tcon_itemcast", {
            title: "Item Casting",
            contents: {
                icon: BlockID.tcon_itemcast,
                drawing: [
                    { type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6 },
                    { type: "bitmap", x: 386, y: 122, bitmap: "tcon.rv.faucet", scale: 6 },
                    { type: "bitmap", x: 404, y: 284, bitmap: "tcon.rv.table", scale: 6 },
                    { type: "bitmap", x: 530, y: 182, bitmap: "tcon.arrow", scale: 6 }
                ],
                elements: {
                    input0: { x: 404, y: 188, bitmap: "_default_slot_empty", size: 96 },
                    output0: { x: 704, y: 176, size: 108 },
                    scaleLiquid: { type: "scale", x: 182, y: 50, width: 108, height: 234, direction: 1 },
                    scaleFlow: { type: "scale", x: 434, y: 122, width: 36, height: 66, value: 1 },
                    textLiquid: { type: "text", x: 86, y: 380, font: { color: Color.WHITE, size: 40, shadow: 0.5 }, multiline: true },
                    textTime: { type: "text", x: 596, y: 100, font: { size: 50, alignment: 1 } },
                    textConsume: { type: "text", x: 758, y: 300, font: { color: Color.RED, size: 40, alignment: 1 } }
                }
            },
            recipeList: CastingRecipe.getAllRecipeForRV("table"),
            onOpen: function (elements, recipe) {
                setLiquidScale(elements.get("scaleLiquid"), elements.get("textLiquid"), recipe.inputLiq);
                elements.get("scaleFlow").setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq.liquid, 36, 66));
                elements.get("textTime").setBinding("text", (CastingRecipe.calcCooldownTime(recipe.inputLiq.liquid, recipe.inputLiq.amount) / 20).toFixed(1) + " s");
                elements.get("textConsume").setBinding("text", recipe.consume ? "Consumes cast!" : "");
            }
        });
        RV.registerRecipeType("tcon_blockcast", {
            title: "Block Casting",
            contents: {
                icon: BlockID.tcon_blockcast,
                drawing: [
                    { type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6 },
                    { type: "bitmap", x: 386, y: 122, bitmap: "tcon.rv.faucet", scale: 6 },
                    { type: "bitmap", x: 404, y: 284, bitmap: "tcon.rv.basin", scale: 6 },
                    { type: "bitmap", x: 530, y: 182, bitmap: "tcon.arrow", scale: 6 }
                ],
                elements: {
                    input0: { x: 404, y: 188, bitmap: "_default_slot_empty", size: 96 },
                    output0: { x: 704, y: 176, size: 108 },
                    scaleLiquid: { type: "scale", x: 182, y: 50, width: 108, height: 234, direction: 1 },
                    scaleFlow: { type: "scale", x: 434, y: 122, width: 36, height: 66, value: 1 },
                    textLiquid: { type: "text", x: 86, y: 380, font: { color: Color.WHITE, size: 40, shadow: 0.5 }, multiline: true },
                    textTime: { type: "text", x: 596, y: 100, font: { size: 50, alignment: 1 } },
                    textConsume: { type: "text", x: 758, y: 300, font: { color: Color.RED, size: 40, alignment: 1 } }
                }
            },
            recipeList: CastingRecipe.getAllRecipeForRV("basin"),
            onOpen: function (elements, recipe) {
                setLiquidScale(elements.get("scaleLiquid"), elements.get("textLiquid"), recipe.inputLiq);
                elements.get("scaleFlow").setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq.liquid, 36, 66));
                elements.get("textTime").setBinding("text", (CastingRecipe.calcCooldownTime(recipe.inputLiq.liquid, recipe.inputLiq.amount) / 20).toFixed(1) + " s");
                elements.get("textConsume").setBinding("text", recipe.consume ? "Consumes cast!" : "");
            }
        });
    });
});
ModAPI.registerAPI("TConAPI", {
    MatValue: MatValue,
    MoltenLiquid: MoltenLiquid,
    SmelteryFuel: SmelteryFuel,
    MeltingRecipe: MeltingRecipe,
    AlloyRecipe: AlloyRecipe,
    CastingRecipe: CastingRecipe,
    BlockModel: BlockModel,
    Sound: Sound
});
