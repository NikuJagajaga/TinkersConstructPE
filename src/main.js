var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
IMPORT("BlockEngine");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("SoundLib");
IMPORT("EnhancedRecipes");
IMPORT("ConnectedTexture");
IMPORT("WindowMaker");
var Color = android.graphics.Color;
var Thread = java.lang.Thread;
var ClientSide = BlockEngine.Decorators.ClientSide;
var NetworkEvent = BlockEngine.Decorators.NetworkEvent;
var ContainerEvent = BlockEngine.Decorators.ContainerEvent;
var ScreenHeight = UI.getScreenHeight();
var SCALE = 5; //GUI Scale
__config__.checkAndRestore({
    toolLeveling: {
        baseXp: 500,
        multiplier: 2
    },
    oreGen: {
        cobaltRate: 20,
        arditeRate: 20
    },
    oreToIngotRatio: 2,
    modifierSlots: 3,
    showItemOnTable: true,
    checkInsideSmeltery: true
});
var Cfg = {
    toolLeveling: {
        baseXp: __config__.getNumber("toolLeveling.baseXp").intValue(),
        multiplier: __config__.getNumber("toolLeveling.multiplier").intValue()
    },
    oreGen: {
        cobaltRate: __config__.getNumber("oreGen.cobaltRate").intValue(),
        arditeRate: __config__.getNumber("oreGen.arditeRate").intValue()
    },
    oreToIngotRatio: __config__.getNumber("oreToIngotRatio").intValue(),
    modifierSlots: __config__.getNumber("modifierSlots").intValue(),
    showItemOnTable: __config__.getBool("showItemOnTable"),
    checkInsideSmeltery: __config__.getBool("checkInsideSmeltery")
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
var addLineBreaks = function (length, text) {
    var array = [];
    var words = text.split(" ");
    var i = 0;
    var line;
    var count = 0;
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
var getIDData = function (item, defaultData) {
    if (defaultData === void 0) { defaultData = -1; }
    switch (typeof item) {
        case "string": return IDConverter.getIDData(item);
        case "number": return { id: item, data: defaultData };
        default: return typeof item.id === "string" ? { id: IDConverter.getID(item.id), data: item.data } : item;
    }
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
//戒
// Array.prototype.includes = function(elem){
//     return this.indexOf(elem) !== -1;
// };
var TconTileEntity = /** @class */ (function (_super) {
    __extends(TconTileEntity, _super);
    function TconTileEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TconTileEntity.prototype.onInit = function () {
        this.networkData.putInt("blockId", this.blockID);
        this.networkData.putInt("blockData", this.blockSource.getBlockData(this.x, this.y, this.z));
        this.putDefaultNetworkData();
        this.networkData.sendChanges();
        this.setupContainer();
    };
    TconTileEntity.prototype.putDefaultNetworkData = function () { };
    TconTileEntity.prototype.setupContainer = function () { };
    TconTileEntity.prototype.getScreenByName = function (screenName, container) {
        return null;
    };
    return TconTileEntity;
}(TileEntityBase));
var TileWithLiquidModel = /** @class */ (function (_super) {
    __extends(TileWithLiquidModel, _super);
    function TileWithLiquidModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TileWithLiquidModel.prototype.putDefaultNetworkData = function () {
        this.networkData.putString("liquidStored", "");
        this.networkData.putFloat("liquidRelativeAmount", 0);
    };
    TileWithLiquidModel.prototype.clientLoad = function () {
        this.render = new Render();
        this.anim = new Animation.Base(this.x + this.animPos.x, this.y + this.animPos.y - 1.5, this.z + this.animPos.z);
        this.anim.describe({ render: this.render.getId(), skin: "model/tcon_liquids.png" });
        this.anim.load();
        this.anim.setSkylightMode();
        var amount = this.networkData.getFloat("liquidRelativeAmount");
        this.animHeight = 0;
        if (amount > 0) {
            this.animHeight = amount;
            this.render.setPart("head", [{
                    uv: { x: 0, y: MoltenLiquid.getY(this.networkData.getString("liquidStored")) },
                    coords: { x: 0, y: -this.animHeight * 16 * this.animScale.y / 2, z: 0 },
                    size: { x: 16 * this.animScale.x, y: 16 * this.animScale.y * this.animHeight, z: 16 * this.animScale.z }
                }], MoltenLiquid.getTexScale());
            this.anim.refresh();
        }
    };
    TileWithLiquidModel.prototype.clientUnload = function () {
        var _a;
        (_a = this.anim) === null || _a === void 0 ? void 0 : _a.destroy();
    };
    TileWithLiquidModel.prototype.clientTick = function () {
        var amount = this.networkData.getFloat("liquidRelativeAmount");
        var diff = amount - this.animHeight;
        var parts = [];
        var needRefresh = false;
        if (amount > 0) {
            this.animHeight += diff * 0.2;
            this.animHeight = Math.round(this.animHeight * 100) / 100;
            if (Math.abs(diff) > 0.01) {
                parts.push({
                    uv: { x: 0, y: MoltenLiquid.getY(this.networkData.getString("liquidStored")) },
                    coords: { x: 0, y: -this.animHeight * 16 * this.animScale.y / 2, z: 0 },
                    size: { x: 16 * this.animScale.x, y: 16 * this.animScale.y * this.animHeight, z: 16 * this.animScale.z }
                });
                needRefresh = true;
            }
        }
        else if (this.animHeight !== 0) {
            this.animHeight = 0;
            needRefresh = true;
        }
        if (needRefresh) {
            this.render.setPart("head", parts, MoltenLiquid.getTexScale());
            this.anim.refresh();
        }
    };
    TileWithLiquidModel.prototype.clientTickNew = function () {
        var amount = this.networkData.getFloat("liquidRelativeAmount");
        var diff = amount - this.animHeight;
        if (amount > 0) {
            if (diff !== 0) {
                if (Math.abs(diff) > 0.01) {
                    this.animHeight += diff * 0.2;
                }
                else {
                    this.animHeight = amount;
                }
                this.render.setPart("head", [{
                        uv: { x: 0, y: MoltenLiquid.getY(this.networkData.getString("liquidStored")) },
                        coords: { x: 0, y: -this.animHeight * 16 * this.animScale.y / 2, z: 0 },
                        size: { x: 16 * this.animScale.x, y: 16 * this.animScale.y * this.animHeight, z: 16 * this.animScale.z }
                    }], MoltenLiquid.getTexScale());
                this.render.setPart("head", [], MoltenLiquid.getTexScale());
                this.anim.refresh();
            }
        }
        else if (this.animHeight !== 0) {
            this.animHeight = 0;
            this.render.setPart("head", [], MoltenLiquid.getTexScale());
            this.anim.refresh();
        }
    };
    TileWithLiquidModel.prototype.onTick = function () {
        var _a;
        var stored = (_a = this.liquidStorage.getLiquidStored()) !== null && _a !== void 0 ? _a : "";
        var amount = this.liquidStorage.getRelativeAmount(stored);
        if (stored != this.networkData.getString("liquidStored") || amount !== this.networkData.getFloat("liquidRelativeAmount")) {
            this.networkData.putString("liquidStored", stored);
            this.networkData.putFloat("liquidRelativeAmount", amount);
            this.networkData.sendChanges();
        }
    };
    return TileWithLiquidModel;
}(TconTileEntity));
var CraftingWindow = /** @class */ (function () {
    function CraftingWindow(window, fps) {
        if (fps === void 0) { fps = 20; }
        var _this = this;
        this.window = window;
        this.container = new UI.Container();
        this.window.getWindow("content").setEventListener({
            onOpen: function (window) {
                _this.onOpen(window);
            },
            onClose: function (window) {
                _this.onClose(window);
            }
        });
        this.sleepTime = 1000 / fps | 0;
    }
    CraftingWindow.prototype.addTargetBlock = function (block) {
        CraftingWindow.blocks.push({ block: getIDData(block, -1), window: this });
    };
    CraftingWindow.prototype.open = function () {
        this.container.openAs(this.window);
    };
    CraftingWindow.prototype.onOpen = function (window) {
        var _this = this;
        Threading.initThread("CraftingWindow", function () {
            var elements = window.getElements();
            while (window.isOpened()) {
                try {
                    _this.onUpdate(elements);
                }
                catch (e) {
                    alert("onUpdate: " + e);
                }
                Thread.sleep(_this.sleepTime);
            }
        });
    };
    CraftingWindow.prototype.onClose = function (window) {
        var pos = Player.getPosition();
        this.container.dropAt(pos.x, pos.y, pos.z);
    };
    CraftingWindow.blocks = [];
    return CraftingWindow;
}());
Callback.addCallback("ItemUseLocal", function (coords, item, block, player) {
    if (Entity.getSneaking(player))
        return;
    var block2;
    for (var i = 0; i < CraftingWindow.blocks.length; i++) {
        block2 = CraftingWindow.blocks[i].block;
        if (block.id === block2.id && (block2.data === -1 || block.data === block2.data)) {
            CraftingWindow.blocks[i].window.open();
            Game.prevent();
            return;
        }
    }
});
var BlockModel = /** @class */ (function () {
    function BlockModel() {
    }
    BlockModel.register = function (id, func, meta) {
        if (meta === void 0) { meta = 1; }
        var render;
        for (var i = 0; i < meta; i++) {
            render = new ICRender.Model();
            render.addEntry(func(BlockRenderer.createModel(), i));
            BlockRenderer.setStaticICRender(id, i, render);
            ItemModel.getFor(id, i).setModel(render);
        }
    };
    return BlockModel;
}());
;
var _a;
var EntityHelper = /** @class */ (function () {
    function EntityHelper() {
    }
    EntityHelper.isPlayer = function (entity) {
        var type = Entity.getType(entity);
        return type === EEntityType.PLAYER || type === 63;
    };
    EntityHelper.isUndead = function (entity) {
        var type = Entity.getType(entity);
        return this.undeads.indexOf(type) !== -1;
    };
    EntityHelper.isArthropods = function (entity) {
        var type = Entity.getType(entity);
        return this.arthropods.indexOf(type) !== -1;
    };
    EntityHelper.getHeadMeta = function (entity) {
        var type = Entity.getType(entity);
        return this.headMeta[type] || -1;
    };
    EntityHelper.undeads = [
        EEntityType.SKELETON,
        EEntityType.STRAY,
        EEntityType.WHITHER_SKELETON,
        EEntityType.ZOMBIE,
        EEntityType.DROWNED,
        EEntityType.HUSK,
        EEntityType.PIG_ZOMBIE,
        EEntityType.ZOMBIE_VILLAGER,
        EEntityType.ZOMBIE_VILLAGE_V2,
        EEntityType.PHANTOM,
        EEntityType.WHITHER,
        EEntityType.SKELETON_HORSE,
        EEntityType.ZOMBIE_HORSE
    ];
    EntityHelper.arthropods = [
        EEntityType.SPIDER,
        EEntityType.CAVE_SPIDER,
        EEntityType.SILVERFISH,
        EEntityType.ENDERMITE
    ];
    EntityHelper.headMeta = (_a = {},
        _a[EEntityType.SKELETON] = 0,
        _a[EEntityType.WHITHER_SKELETON] = 1,
        _a[EEntityType.ZOMBIE] = 2,
        _a[1] = 3,
        _a[63] = 3,
        _a[EEntityType.CREEPER] = 4,
        _a[EEntityType.ENDER_DRAGON] = 5,
        _a);
    return EntityHelper;
}());
var ToolLeveling = /** @class */ (function () {
    function ToolLeveling() {
    }
    ToolLeveling.getLevelInfo = function (xp, is3x3) {
        var level = 0;
        var total = 0;
        var next = Cfg.toolLeveling.baseXp;
        if (is3x3) {
            next *= 9;
        }
        while (total + next <= xp) {
            level++;
            total += next;
            next *= Cfg.toolLeveling.multiplier;
        }
        return { level: level, currentXp: xp - total, next: next };
    };
    ToolLeveling.getLevel = function (xp, is3x3) {
        return this.getLevelInfo(xp, is3x3).level;
    };
    ToolLeveling.getLevelName = function (level) {
        switch (level) {
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
        if (level < 19)
            return "Awesome";
        if (level < 42)
            return "MoxieGrrl";
        if (level < 66)
            return "boni";
        if (level < 99)
            return "Jadedcat";
        return "Hacker";
    };
    ToolLeveling.getLevelupMessage = function (level, name) {
        var msg = "";
        switch (level) {
            case 1:
                msg = "You begin to feel comfortable handling the ".concat(name);
                break;
            case 2:
                msg = "You are now accustomed to the weight of the ".concat(name);
                break;
            case 3:
                msg = "You have become adept at handling the ".concat(name);
                break;
            case 4:
                msg = "You are now an expert at using the ".concat(name, " !");
                break;
            case 5:
                msg = "You have mastered the ".concat(name, "!");
                break;
            case 6:
                msg = "You have grandmastered the ".concat(name, "!");
                break;
            case 7:
                msg = "You feel like you could fulfill mighty deeds with your ".concat(name, "!");
                break;
            case 8:
                msg = "You and your ".concat(name, " are living legends!");
                break;
            case 9:
                msg = "No god could stand in the way of you and your ".concat(name, "!");
                break;
            case 10:
                msg = "Your ".concat(name, " is pure awesome.");
                break;
            default:
                msg = "Your ".concat(name, " has reached level ").concat(level);
                break;
        }
        return msg;
    };
    return ToolLeveling;
}());
SoundManager.init(16);
SoundManager.setResourcePath(__dir__ + "res/sounds/");
SoundManager.registerSound("tcon.little_saw.ogg", "tcon/little_saw.ogg");
SoundManager.registerSound("tcon.levelup.ogg", "tcon/levelup.ogg");
SoundManager.registerSound("random.anvil_use.ogg", "random.anvil_use.ogg");
SoundManager.registerSound("random.orb.ogg", "random.orb.ogg");
var MoltenLiquid = /** @class */ (function () {
    function MoltenLiquid() {
    }
    MoltenLiquid.getTexScale = function () {
        return {
            width: 64,
            height: this.liquidCount * 32
        };
    };
    /*
        private static create(key: string, name: string, color: string, type: "metal" | "stone" | "other" = "metal"): void {
    
            const bitmap = new Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
            const canvas = new Canvas(bitmap);
            const paint = new Paint();
            paint.setColorFilter(new ColorFilter(Color.parseColor(color), PorterDuff.Mode.MULTIPLY));
            canvas.drawBitmap(this.baseTex[type], 0, 0, paint);
            UI.TextureSource.put("liquid." + key, bitmap);
            LiquidRegistry.registerLiquid(key, name, ["liquid." + key]);
    
            const bucket = this.baseTex.bucket.copy(Bitmap.Config.ARGB_8888, true);
            let w: number;
            let h: number;
            for(w = 0; w < 16; w++){
            for(h = 0; h < 16; h++){
                bucket.getPixel(w, h) === Color.GREEN && bucket.setPixel(w, h, bitmap.getPixel(w, h));
            }
            }
            const path = __dir__ + "res/items-opaque/bucket/tcon_bucket_" + key + ".png";
            const file = new java.io.File(path);
            file.getParentFile().mkdirs();
            FileTools.WriteImage(path, bucket);
    
        }
    */
    MoltenLiquid.register = function (key, temp) {
        if (temp < 300) {
            return;
        }
        this.data[key] = { y: this.liquidCount * 32, bmp: LiquidRegistry.getLiquidUIBitmap(key, 16, 16), temp: temp - 300 };
        this.liquidCount++;
    };
    MoltenLiquid.createAndRegister = function (key, name, temp, color, type) {
        if (type === void 0) { type = "metal"; }
        //this.create(key, name, color, type);
        LiquidRegistry.registerLiquid(key, name, ["liquid." + key]);
        var id = createItem("tcon_bucket_" + key, name + " Bucket");
        Item.addCreativeGroup("tcon_bucket", "TCon Buckets", [id]);
        LiquidRegistry.registerItem(key, { id: VanillaItemID.bucket, data: 0 }, { id: id, data: 0 });
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
    /*
    private static readonly baseTex = {
        metal: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_metal.png"),
        stone: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_stone.png"),
        other: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_other.png"),
        bucket: FileTools.ReadImage(__dir__ + "texture-source/liquid/bucket.png")
    };
    */
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
    MeltingRecipe.addRecipe = function (source, liquid, amount, temp) {
        if (temp === void 0) { temp = this.calcTemp(liquid, amount); }
        if (!source) {
            return;
        }
        var item = getIDData(source);
        this.recipeItem[item.id + ":" + item.data] = {
            liquid: liquid,
            amount: amount,
            temp: temp
        };
    };
    MeltingRecipe.addRecipeForAmount = function (item, liquid, amount, timeAmount) {
        this.addRecipe(item, liquid, amount, this.calcTemp(liquid, timeAmount));
    };
    MeltingRecipe.getRecipe = function (id, data) {
        return this.recipeItem[id + ":" + data] || this.recipeItem[id + ":-1"];
    };
    MeltingRecipe.isExist = function (id, data) {
        return (id + ":" + data) in this.recipeItem || (id + ":-1") in this.recipeItem || false;
    };
    MeltingRecipe.getAllRecipeForRV = function () {
        var list = [];
        var split;
        for (var key in this.recipeItem) {
            split = key.split(":");
            list.push({
                input: [{ id: parseInt(split[0]), count: 1, data: parseInt(split[1]) }],
                output: [],
                outputLiq: [{ liquid: this.recipeItem[key].liquid, amount: this.recipeItem[key].amount }],
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
MeltingRecipe.addRecipe("ice", "water", 1000, 305 - 300);
MeltingRecipe.addRecipe("packed_ice", "water", 2000, 310 - 300);
MeltingRecipe.addRecipe("snow", "water", 1000, 305 - 300);
MeltingRecipe.addRecipe("snowball", "water", 125, 301 - 300);
MeltingRecipe.addRecipe("rotten_flesh", "blood", 40);
MeltingRecipe.addRecipeForAmount("stone", "molten_stone", MatValue.SEARED_MATERIAL, MatValue.ORE);
MeltingRecipe.addRecipeForAmount("cobblestone", "molten_stone", MatValue.SEARED_MATERIAL, MatValue.ORE);
MeltingRecipe.addRecipe("obsidian", "molten_obsidian", MatValue.ORE);
MeltingRecipe.addRecipe("horsearmoriron", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("horsearmorgold", "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("rail", "molten_iron", MatValue.INGOT * 6 / 16);
MeltingRecipe.addRecipe("activator_rail", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("detector_rail", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("golden_rail", "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipeForAmount("dirt", "molten_dirt", MatValue.INGOT, MatValue.BRICK_BLOCK);
MeltingRecipe.addRecipe("clay_ball", "molten_clay", MatValue.INGOT);
MeltingRecipe.addRecipe("clay", "molten_clay", MatValue.BRICK_BLOCK);
MeltingRecipe.addRecipe("emerald_ore", "molten_emerald", MatValue.GEM * Cfg.oreToIngotRatio);
MeltingRecipe.addRecipe("emerald", "molten_emerald", MatValue.GEM);
MeltingRecipe.addRecipe("emerald_block", "molten_emerald", MatValue.GEM * 9);
MeltingRecipe.addRecipe("sand", "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe("glass", "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe("glass_pane", "molten_glass", MatValue.GLASS * 6 / 16);
MeltingRecipe.addRecipe("glass_bottle", "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe("iron_nugget", "molten_iron", MatValue.NUGGET);
MeltingRecipe.addRecipe("iron_ingot", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("iron_block", "molten_iron", MatValue.BLOCK);
MeltingRecipe.addRecipe("gold_nugget", "molten_gold", MatValue.NUGGET);
MeltingRecipe.addRecipe("gold_ingot", "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipe("gold_block", "molten_gold", MatValue.BLOCK);
MeltingRecipe.addRecipe("heavy_weighted_pressure_plate", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("light_weighted_pressure_plate", "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("compass", "molten_iron", MatValue.INGOT * 4);
MeltingRecipe.addRecipe("clock", "molten_gold", MatValue.INGOT * 4);
MeltingRecipe.addRecipe("golden_helmet", "molten_gold", MatValue.INGOT * 5);
MeltingRecipe.addRecipe("golden_chestplate", "molten_gold", MatValue.INGOT * 8);
MeltingRecipe.addRecipe("golden_leggings", "molten_gold", MatValue.INGOT * 7);
MeltingRecipe.addRecipe("golden_boots", "molten_gold", MatValue.INGOT * 4);
MeltingRecipe.addRecipe("golden_pickaxe", "molten_gold", MatValue.INGOT * 3);
MeltingRecipe.addRecipe("golden_axe", "molten_gold", MatValue.INGOT * 3);
MeltingRecipe.addRecipe("golden_sword", "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("golden_shovel", "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipe("golden_hoe", "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("iron_helmet", "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe("iron_chestplate", "molten_iron", MatValue.INGOT * 8);
MeltingRecipe.addRecipe("iron_leggings", "molten_iron", MatValue.INGOT * 7);
MeltingRecipe.addRecipe("iron_boots", "molten_iron", MatValue.INGOT * 4);
MeltingRecipe.addRecipe("iron_pickaxe", "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe("iron_axe", "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe("iron_sword", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("iron_shovel", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("iron_hoe", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("bucket", "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe("hopper", "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe("iron_bars", "molten_iron", MatValue.INGOT * 6 / 16);
MeltingRecipe.addRecipe("minecart", "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe("shears", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("shield", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("tripwire_hook", "molten_iron", MatValue.INGOT / 2);
MeltingRecipe.addRecipe("iron_door", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("cauldron", "molten_iron", MatValue.INGOT * 7);
MeltingRecipe.addRecipe("anvil", "molten_iron", MatValue.BLOCK * 3 + MatValue.INGOT * 4);
MeltingRecipe.addRecipe("iron_ore", "molten_iron", MatValue.ORE);
MeltingRecipe.addRecipe("gold_ore", "molten_gold", MatValue.ORE);
MeltingRecipe.addEntRecipe(1, "blood", 20); //PLAYER
MeltingRecipe.addEntRecipe(63, "blood", 20); //PLAYER
MeltingRecipe.addEntRecipe(EEntityType.ZOMBIE, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.ZOMBIE_VILLAGER, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.ZOMBIE_VILLAGE_V2, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.PIG_ZOMBIE, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.ZOMBIE_HORSE, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.COW, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.PIG, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.SHEEP, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.CHICKEN, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.WOLF, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.CAT, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.RABBIT, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.HORSE, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.LLAMA, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.IRON_GOLEM, "molten_iron", 18);
MeltingRecipe.addEntRecipe(EEntityType.SNOW_GOLEM, "water", 100);
MeltingRecipe.addEntRecipe(EEntityType.VILLAGER, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(EEntityType.VILLAGER_V2, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(EEntityType.VINDICATOR, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(EEntityType.EVOCATION_ILLAGER, "molten_emerald", 6);
//MeltingRecipe.addEntRecipe(EEntityType.ILLUSIONER, "molten_emerald", 6);
;
var AlloyRecipe = /** @class */ (function () {
    function AlloyRecipe() {
    }
    AlloyRecipe.addRecipe = function (result) {
        var inputs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            inputs[_i - 1] = arguments[_i];
        }
        var inputAmount = 0;
        for (var i = 0; i < inputs.length; i++) {
            inputAmount += inputs[i].amount;
        }
        if (result.amount > inputAmount) {
            alert("[TCon]: Invalid alloy recipe -> " + result.liquid);
            return;
        }
        this.data.push({ inputs: inputs.map(function (input) { return ({ liquid: input.liquid, amount: input.amount }); }), result: result });
    };
    AlloyRecipe.getRecipes = function (liquidAmounts) {
        return this.data.filter(function (recipe) { return recipe.inputs.every(function (input) { return (liquidAmounts[input.liquid] || 0) >= input.amount; }); });
    };
    AlloyRecipe.getAllRecipeForRV = function () {
        return this.data.map(function (recipe) { return ({
            inputLiq: recipe.inputs,
            outputLiq: [recipe.result]
        }); });
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
        var _a;
        var _b;
        var item = getIDData(result, 0);
        (_a = (_b = this[type])[id]) !== null && _a !== void 0 ? _a : (_b[id] = {});
        this[type][id][liquid] = { id: item.id, data: item.data, consume: consume, amount: amount };
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
    CastingRecipe.getSandCastID = function (type) {
        return ItemID["tcon_sandcast_" + type];
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
    CastingRecipe.addTableRecipeForAll = function (type, liquid, result, amount) {
        this.addTableRecipe(this.getSandCastID(type), liquid, result, true, amount);
        this.addTableRecipe(this.getClayCastID(type), liquid, result, true, amount);
        this.addTableRecipe(this.getCastID(type), liquid, result, false, amount);
    };
    CastingRecipe.addSandMoldingRecipe = function (id, result) {
        this.sandmolding[id] = result;
    };
    CastingRecipe.addMakeCastRecipes = function (id, type) {
        var cast = this.getCastID(type);
        this.addTableRecipe(id, "molten_gold", cast, true, MatValue.INGOT * 2);
        this.addTableRecipe(id, "molten_alubrass", cast, true, MatValue.INGOT);
        this.addTableRecipe(id, "molten_clay", this.getClayCastID(type), true, MatValue.INGOT * 2);
        this.addSandMoldingRecipe(id, this.getSandCastID(type));
    };
    CastingRecipe.addBasinRecipe = function (id, liquid, result, amount) {
        if (amount === void 0) { amount = MatValue.BLOCK; }
        this.addRecipe("basin", id, liquid, result, id !== 0, amount);
    };
    CastingRecipe.getSandMoldingRecipe = function (id) {
        return this.sandmolding[id] || 0;
    };
    CastingRecipe.getTableRecipe = function (id, liquid) {
        var _a;
        return (_a = this.table[id]) === null || _a === void 0 ? void 0 : _a[liquid];
        //return this.table[id] ? this.table[id][liquid] : undefined;
    };
    CastingRecipe.getBasinRecipe = function (id, liquid) {
        var _a;
        return (_a = this.basin[id]) === null || _a === void 0 ? void 0 : _a[liquid];
    };
    CastingRecipe.getAllRecipeForRV = function (type) {
        var list = [];
        var key;
        var liquid;
        var id = 0;
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
                    inputLiq: [{ liquid: liquid, amount: limits[liquid] || limits.__global }],
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
    CastingRecipe.sandmolding = {};
    CastingRecipe.table = {};
    CastingRecipe.basin = {};
    CastingRecipe.capacity = {};
    return CastingRecipe;
}());
CastingRecipe.addTableRecipe(0, "molten_glass", "glass_pane", false, MatValue.GLASS * 6 / 16);
CastingRecipe.addBasinRecipe(0, "molten_iron", "iron_block");
CastingRecipe.addBasinRecipe(0, "molten_gold", "gold_block");
CastingRecipe.addBasinRecipe(0, "molten_obsidian", "obsidian", 288);
CastingRecipe.addTableRecipeForAll("ingot", "molten_iron", "iron_ingot");
CastingRecipe.addTableRecipeForAll("ingot", "molten_gold", "gold_ingot");
CastingRecipe.addTableRecipeForAll("ingot", "molten_clay", "brick");
CastingRecipe.addTableRecipeForAll("nugget", "molten_iron", "iron_nugget");
CastingRecipe.addTableRecipeForAll("nugget", "molten_gold", "gold_nugget");
CastingRecipe.addTableRecipeForAll("gem", "molten_emerald", "emerald");
CastingRecipe.addBasinRecipe(0, "molten_emerald", "emerald_block", MatValue.GEM * 9);
CastingRecipe.addBasinRecipe(0, "molten_clay", "hardened_clay", MatValue.INGOT * 4);
CastingRecipe.addBasinRecipe(VanillaBlockID.stained_hardened_clay, "water", "hardened_clay", 250);
CastingRecipe.addBasinRecipe(VanillaBlockID.sand, "blood", { id: "sand", data: 1 }, 10);
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
Recipes2.addShapeless({ id: BlockID.tcon_grout, count: 2 }, ["sand", "gravel", "clay_ball"]);
Recipes2.addShapeless({ id: BlockID.tcon_grout, count: 8 }, [{ id: "sand", count: 4 }, { id: "gravel", count: 4 }, "clay"]);
createItem("tcon_brick", "Seared Brick");
Recipes.addFurnace(BlockID.tcon_grout, ItemID.tcon_brick);
createBlock("tcon_stone", [
    { name: "Seared Stone", texture: [0], isTech: true },
    { name: "Seared Cobblestone", texture: [1], isTech: true },
    { name: "Seared Paver", texture: [2], isTech: true },
    { name: "Seared Bricks", texture: [3] },
    { name: "Cracked Seared Bricks", texture: [4], isTech: true },
    { name: "Fancy Seared Bricks", texture: [5], isTech: true },
    { name: "Square Seared Bricks", texture: [6], isTech: true },
    { name: "Seared Road", texture: [7], isTech: true },
    { name: "Seared Creeperface", texture: [2, 2, 8], isTech: true },
    { name: "Triangle Seared Bricks", texture: [9], isTech: true },
    { name: "Small Seared Bricks", texture: [10], isTech: true },
    { name: "Seared Tiles", texture: [11], isTech: true }
]);
MeltingRecipe.addRecipe(BlockID.tcon_stone, "molten_stone", MatValue.SEARED_BLOCK);
MeltingRecipe.addRecipe(ItemID.tcon_brick, "molten_stone", MatValue.SEARED_MATERIAL);
MeltingRecipe.addRecipeForAmount(BlockID.tcon_grout, "molten_stone", MatValue.SEARED_MATERIAL, MatValue.SEARED_MATERIAL / 3);
CastingRecipe.addTableRecipeForAll("ingot", "molten_stone", ItemID.tcon_brick, MatValue.SEARED_MATERIAL);
CastingRecipe.addBasinRecipe(0, "molten_stone", { id: BlockID.tcon_stone, data: 0 }, MatValue.SEARED_BLOCK);
CastingRecipe.addBasinRecipe(VanillaBlockID.cobblestone, "molten_stone", { id: BlockID.tcon_stone, data: 1 }, MatValue.SEARED_MATERIAL * 3);
Recipes2.addShaped({ id: BlockID.tcon_stone, data: 3 }, "aa:aa", { a: ItemID.tcon_brick });
Recipes.addFurnace(BlockID.tcon_stone, 3, BlockID.tcon_stone, 4);
(function () {
    var addRecipe = function (input, output) {
        Recipes2.addShapeless({ id: BlockID.tcon_stone, data: output }, [{ id: BlockID.tcon_stone, data: input }]);
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
var TankModelManager = /** @class */ (function () {
    function TankModelManager() {
    }
    TankModelManager.getItemModel = function (id, liquid, relativeAmount) {
        var key = id + "-" + liquid;
        var level = Math.ceil(relativeAmount * 4) - 1;
        if (level < 0) {
            return null;
        }
        if (!this.itemModels[key]) {
            var itemModels = [
                ItemModel.newStandalone(),
                ItemModel.newStandalone(),
                ItemModel.newStandalone(),
                ItemModel.newStandalone()
            ];
            var models = [
                BlockRenderer.createModel(),
                BlockRenderer.createModel(),
                BlockRenderer.createModel(),
                BlockRenderer.createModel()
            ];
            try {
                for (var i = 0; i < 4; i++) {
                    models[i].addBox(0, 0, 0, 1, 1, 1, id, 0);
                    models[i].addBox(1 / 32, 1 / 32, 1 / 32, 31 / 32, (i + 1) / 4 * 31 / 32, 31 / 32, this.textures[liquid] || "tcon_liquid_" + liquid, 0);
                    itemModels[i].setModel(models[i])
                        .setModUiSpriteName(IDRegistry.getNameByID(id), 0);
                }
            }
            catch (e) {
                return null;
            }
            this.itemModels[key] = itemModels;
        }
        return this.itemModels[key][level];
    };
    TankModelManager.textures = {
        water: "still_water",
        lava: "still_lava"
    };
    TankModelManager.itemModels = {};
    return TankModelManager;
}());
Item.addCreativeGroup("tcon_tank", "Seared Tanks", [
    createBlock("tcon_tank_fuel", [{ name: "Seared Fuel Tank", texture: [["tcon_tank_top", 0], ["tcon_tank_top", 0], 0] }]),
    createBlock("tcon_gauge_fuel", [{ name: "Seared Fuel Gauge", texture: [["tcon_gauge_top", 0], ["tcon_gauge_top", 0], 0] }]),
    createBlock("tcon_tank_ingot", [{ name: "Seared Ingot Tank", texture: [["tcon_tank_top", 0], ["tcon_tank_top", 0], 0] }]),
    createBlock("tcon_gauge_ingot", [{ name: "Seared Ingot Gauge", texture: [["tcon_gauge_top", 0], ["tcon_gauge_top", 0], 0] }])
]);
Recipes2.addShaped(BlockID.tcon_tank_fuel, "aaa:aba:aaa", { a: ItemID.tcon_brick, b: "glass" });
Recipes2.addShaped(BlockID.tcon_gauge_fuel, "aba:bbb:aba", { a: ItemID.tcon_brick, b: "glass" });
Recipes2.addShaped(BlockID.tcon_tank_ingot, "aba:aba:aba", { a: ItemID.tcon_brick, b: "glass" });
Recipes2.addShaped(BlockID.tcon_gauge_ingot, "bab:aba:bab", { a: ItemID.tcon_brick, b: "glass" });
BlockModel.register(BlockID.tcon_tank_fuel, function (model, index) {
    model.addBox(0 / 16, 0 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, BlockID.tcon_tank_fuel, 0);
    model.addBox(2 / 16, 16 / 16, 2 / 16, 14 / 16, 18 / 16, 14 / 16, BlockID.tcon_tank_fuel, 0);
    return model;
});
BlockModel.register(BlockID.tcon_tank_ingot, function (model, index) {
    model.addBox(0 / 16, 0 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, BlockID.tcon_tank_ingot, 0);
    model.addBox(2 / 16, 16 / 16, 2 / 16, 14 / 16, 18 / 16, 14 / 16, BlockID.tcon_tank_ingot, 0);
    return model;
});
var SearedTank = /** @class */ (function (_super) {
    __extends(SearedTank, _super);
    function SearedTank(tankCapacity) {
        var _this = _super.call(this) || this;
        _this.tankCapacity = tankCapacity;
        return _this;
    }
    SearedTank.prototype.clientLoad = function () {
        this.animPos = { x: 0.5, y: 0, z: 0.5 };
        this.animScale = { x: 31 / 32, y: 31 / 32, z: 31 / 32 };
        _super.prototype.clientLoad.call(this);
    };
    SearedTank.prototype.setupContainer = function () {
        this.liquidStorage.setLimit(null, this.tankCapacity);
    };
    SearedTank.prototype.onItemUse = function (coords, item, playerUid) {
        if (Entity.getSneaking(playerUid))
            return true;
        var player = new PlayerEntity(playerUid);
        var stored = this.liquidStorage.getLiquidStored();
        var empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);
        if (empty) {
            if (stored === empty.liquid || !stored) {
                if (this.liquidStorage.getLimit(stored) - this.liquidStorage.getAmount(stored) >= empty.amount) {
                    this.liquidStorage.addLiquid(empty.liquid, empty.amount);
                    item.count--;
                    player.setCarriedItem(item);
                    player.addItemToInventory(empty.id, 1, empty.data);
                    this.preventClick();
                    return true;
                }
                if (item.count === 1 && empty.storage) {
                    item.data += this.liquidStorage.addLiquid(empty.liquid, empty.amount);
                    player.setCarriedItem(item);
                    this.preventClick();
                    return true;
                }
            }
        }
        if (stored) {
            var full = LiquidItemRegistry.getFullItem(item.id, item.data, stored);
            if (full) {
                var amount = this.liquidStorage.getAmount(stored);
                if (full.amount <= amount) {
                    this.liquidStorage.getLiquid(stored, full.amount);
                    if (item.count === 1) {
                        player.setCarriedItem(full.id, 1, full.data);
                    }
                    else {
                        item.count--;
                        player.setCarriedItem(item);
                        player.addItemToInventory(full.id, 1, full.data);
                    }
                    this.preventClick();
                    return true;
                }
                if (item.count === 1 && full.storage) {
                    player.setCarriedItem(full.id, 1, full.amount - this.liquidStorage.getLiquid(stored, full.amount));
                    this.preventClick();
                    return true;
                }
            }
        }
        return false;
    };
    SearedTank.prototype.destroyBlock = function (coords, player) {
        var region = WorldRegion.getForActor(player);
        var stored = this.liquidStorage.getLiquidStored();
        var extra;
        if (stored) {
            extra = new ItemExtraData()
                .putString("stored", stored)
                .putInt("amount", this.liquidStorage.getAmount(stored));
        }
        region.dropItem(this.x + 0.5, this.y, this.z + 0.5, this.blockID, 1, this.networkData.getInt("blockData"), extra);
    };
    return SearedTank;
}(TileWithLiquidModel));
(function () {
    var fuelAmount = 4000;
    var ingotAmount = MatValue.INGOT * 32;
    var tankFuel = new SearedTank(fuelAmount);
    var tankIngot = new SearedTank(ingotAmount);
    var tankInterface = {
        liquidUnitRatio: 0.001,
        canReceiveLiquid: function (liquid, side) {
            var stored = this.tileEntity.liquidStorage.getLiquidStored();
            return !stored || stored === liquid;
        },
        getInputTank: function () {
            return this.tileEntity.liquidStorage;
        },
        getOutputTank: function () {
            return this.tileEntity.liquidStorage;
        }
    };
    var modelOverrideFuel = function (item) {
        if (item.extra) {
            return TankModelManager.getItemModel(item.id, item.extra.getString("stored"), item.extra.getInt("amount") / fuelAmount);
        }
        return null;
    };
    var modelOverrideIngot = function (item) {
        if (item.extra) {
            return TankModelManager.getItemModel(item.id, item.extra.getString("stored"), item.extra.getInt("amount") / ingotAmount);
        }
        return null;
    };
    var dropFunc = function () { return []; };
    var nameFunc = function (item, name) {
        if (item.extra) {
            var liquid = LiquidRegistry.getLiquidName(item.extra.getString("stored"));
            var amount = item.extra.getInt("amount");
            return name + "\n§7" + liquid + ": " + amount + " mB";
        }
        return name;
    };
    var placeFunc = function (coords, item, block, player, blockSource) {
        var region = new WorldRegion(blockSource);
        var place = BlockRegistry.getPlacePosition(coords, block, blockSource);
        region.setBlock(place, item.id, item.data);
        var tile = region.addTileEntity(place);
        if (item.extra) {
            tile.liquidStorage.setAmount(item.extra.getString("stored"), item.extra.getInt("amount"));
        }
    };
    TileEntity.registerPrototype(BlockID.tcon_tank_fuel, tankFuel);
    TileEntity.registerPrototype(BlockID.tcon_gauge_fuel, tankFuel);
    TileEntity.registerPrototype(BlockID.tcon_tank_ingot, tankIngot);
    TileEntity.registerPrototype(BlockID.tcon_gauge_ingot, tankIngot);
    StorageInterface.createInterface(BlockID.tcon_tank_fuel, tankInterface);
    StorageInterface.createInterface(BlockID.tcon_gauge_fuel, tankInterface);
    StorageInterface.createInterface(BlockID.tcon_tank_ingot, tankInterface);
    StorageInterface.createInterface(BlockID.tcon_gauge_ingot, tankInterface);
    ItemModel.getFor(BlockID.tcon_tank_fuel, -1).setModelOverrideCallback(modelOverrideFuel);
    ItemModel.getFor(BlockID.tcon_gauge_fuel, -1).setModelOverrideCallback(modelOverrideFuel);
    ItemModel.getFor(BlockID.tcon_tank_ingot, -1).setModelOverrideCallback(modelOverrideIngot);
    ItemModel.getFor(BlockID.tcon_gauge_ingot, -1).setModelOverrideCallback(modelOverrideIngot);
    Block.registerDropFunction(BlockID.tcon_tank_fuel, dropFunc);
    Block.registerDropFunction(BlockID.tcon_gauge_fuel, dropFunc);
    Block.registerDropFunction(BlockID.tcon_tank_ingot, dropFunc);
    Block.registerDropFunction(BlockID.tcon_gauge_ingot, dropFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_tank_fuel, nameFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_gauge_fuel, nameFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_tank_ingot, nameFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_gauge_ingot, nameFunc);
    Block.registerPlaceFunction(BlockID.tcon_tank_fuel, placeFunc);
    Block.registerPlaceFunction(BlockID.tcon_gauge_fuel, placeFunc);
    Block.registerPlaceFunction(BlockID.tcon_tank_ingot, placeFunc);
    Block.registerPlaceFunction(BlockID.tcon_gauge_ingot, placeFunc);
})();
createBlock("tcon_drain", [{ name: "Seared Drain", texture: [0, 0, 1, 0, 0, 0] }]);
TileRenderer.setStandardModelWithRotation(BlockID.tcon_drain, 2, [0, 0, 1, 0, 0, 0].map(function (meta) { return ["tcon_drain", meta]; }));
TileRenderer.setRotationFunction(BlockID.tcon_drain);
Recipes2.addShaped(BlockID.tcon_drain, "a_a:a_a:a_a", { a: ItemID.tcon_brick });
var SearedDrain = /** @class */ (function (_super) {
    __extends(SearedDrain, _super);
    function SearedDrain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearedDrain.prototype.onItemUse = function (coords, item, player) {
        return false;
    };
    return SearedDrain;
}(TconTileEntity));
TileEntity.registerPrototype(BlockID.tcon_drain, new SearedDrain());
StorageInterface.createInterface(BlockID.tcon_drain, {
    liquidUnitRatio: 0.001,
    getInputTank: function (side) {
        return this.tileEntity.controller || null;
    },
    getOutputTank: function (side) {
        return this.tileEntity.controller || null;
    }
});
createBlock("tcon_faucet", [
    { name: "Seared Faucet" },
    { name: "faucet", isTech: true },
    { name: "faucet", isTech: true },
    { name: "faucet", isTech: true }
]);
Recipes2.addShaped(BlockID.tcon_faucet, "a_a:_a_", { a: ItemID.tcon_brick });
Block.registerPlaceFunction("tcon_faucet", function (coords, item, block, player, blockSource) {
    if (coords.side < 2) {
        return;
    }
    var region = new WorldRegion(blockSource);
    var place = BlockRegistry.getPlacePosition(coords, block, blockSource);
    region.setBlock(place, item.id, (coords.side - 2) ^ 1);
    region.addTileEntity(place);
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
            isActive: true,
            timer: 0,
            signal: 0
        };
        return _this;
    }
    SearedFaucet.prototype.putDefaultNetworkData = function () {
        this.networkData.putString("liquid", "");
    };
    SearedFaucet.prototype.clientLoad = function () {
        var _this = this;
        this.render = new Render();
        this.anim = new Animation.Base(this.x + 0.5, this.y - 1, this.z + 0.5);
        this.anim.describe({ render: this.render.getId(), skin: "model/tcon_liquids.png" });
        this.anim.load();
        this.anim.setSkylightMode();
        this.renderLiquidModel();
        this.networkData.addOnDataChangedListener(function (data, isExternal) {
            _this.renderLiquidModel();
        });
    };
    SearedFaucet.prototype.clientUnload = function () {
        var _a;
        (_a = this.anim) === null || _a === void 0 ? void 0 : _a.destroy();
    };
    SearedFaucet.prototype.onItemUse = function (coords, item, player) {
        if (Entity.getSneaking(player))
            return true;
        this.data.isActive = this.turnOn();
        return false;
    };
    SearedFaucet.prototype.onRedstoneUpdate = function (signal) {
        if (this.data.signal < signal) {
            this.data.isActive = this.turnOn();
        }
        this.data.signal = signal;
    };
    SearedFaucet.prototype.renderLiquidModel = function () {
        var parts = [];
        var liquid = this.networkData.getString("liquid") + "";
        if (liquid !== "") {
            var dir = StorageInterface.directionsBySide[this.networkData.getInt("blockData") + 2];
            var liquidY = MoltenLiquid.getY(liquid);
            parts.push({
                uv: { x: 0, y: liquidY },
                coords: { x: dir.x * 5, y: 0, z: -dir.z * 5 },
                size: { x: dir.x ? 6 : 4, y: 4, z: dir.z ? 6 : 4 }
            }, {
                uv: { x: 0, y: liquidY },
                coords: { x: dir.x, y: 3, z: -dir.z },
                size: { x: dir.x ? 2 : 4, y: 10, z: dir.z ? 2 : 4 }
            });
        }
        this.render.setPart("head", parts, MoltenLiquid.getTexScale());
        this.anim.refresh();
    };
    SearedFaucet.prototype.turnOn = function () {
        var blockData = this.networkData.getInt("blockData");
        var iSend = StorageInterface.getNeighbourLiquidStorage(this.blockSource, this, blockData + 2);
        var iReceive = StorageInterface.getNeighbourLiquidStorage(this.blockSource, this, 0);
        var sideSend = (blockData + 2) ^ 1;
        var sideReceive = 1;
        var tankSend = iSend === null || iSend === void 0 ? void 0 : iSend.getOutputTank(sideSend);
        var tankReceive = iReceive === null || iReceive === void 0 ? void 0 : iReceive.getInputTank(sideReceive);
        if (!tankSend || !tankReceive) {
            this.networkData.putString("liquid", "");
            this.networkData.sendChanges();
            return false;
        }
        var liquid = tankSend.getLiquidStored();
        var amount = 0;
        if (liquid && iSend.canTransportLiquid(liquid, sideSend) && iReceive.canReceiveLiquid(liquid, sideReceive) && !tankReceive.isFull(liquid)) {
            amount = Math.min(tankSend.getAmount(liquid) * iSend.liquidUnitRatio, MatValue.INGOT / 1000);
            amount = iReceive.receiveLiquid(tankReceive, liquid, amount);
            iSend.extractLiquid(tankSend, liquid, amount);
        }
        if (amount > 0) {
            this.networkData.putString("liquid", liquid);
            this.networkData.sendChanges();
            return true;
        }
        this.networkData.putString("liquid", "");
        this.networkData.sendChanges();
        return false;
    };
    SearedFaucet.prototype.onTick = function () {
        if (this.data.isActive) {
            if (++this.data.timer >= 20) {
                this.data.isActive = this.turnOn();
                this.data.timer = 0;
            }
        }
        else {
            this.data.timer = 0;
        }
    };
    __decorate([
        ClientSide
    ], SearedFaucet.prototype, "renderLiquidModel", null);
    return SearedFaucet;
}(TconTileEntity));
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
    CastingTable.prototype.putDefaultNetworkData = function () {
        this.networkData.putInt("inputId", 0);
        this.networkData.putInt("inputData", 0);
        this.networkData.putInt("outputId", 0);
        this.networkData.putInt("outputData", 0);
    };
    CastingTable.prototype.clientLoad = function () {
        this.setupAnimPosScale();
        _super.prototype.clientLoad.call(this);
        this.setupAnimItem();
    };
    CastingTable.prototype.setupAnimPosScale = function () {
        this.animPos = { x: 0.5, y: 29 / 32, z: 0.5 };
        this.animScale = { x: 14 / 16, y: 1 / 16, z: 14 / 16 };
    };
    CastingTable.prototype.setupAnimItem = function () {
        var _this = this;
        this.animInput = new Animation.Item(this.x + 9 / 16, this.y + 31 / 32, this.z + 9 / 16);
        this.animInput.load();
        this.animInput.setSkylightMode();
        this.animOutput = new Animation.Item(this.x + 9 / 16, this.y + 31 / 32, this.z + 9 / 16);
        this.animOutput.load();
        this.animOutput.setSkylightMode();
        this.updateAnimItem();
        this.networkData.addOnDataChangedListener(function (data, isExternal) {
            _this.updateAnimItem();
        });
    };
    CastingTable.prototype.clientUnload = function () {
        var _a, _b;
        _super.prototype.clientUnload.call(this);
        (_a = this.animInput) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this.animOutput) === null || _b === void 0 ? void 0 : _b.destroy();
    };
    CastingTable.prototype.setupContainer = function () {
        this.updateLiquidLimits();
    };
    CastingTable.prototype.updateAnimItem = function () {
        var _a, _b;
        var inputId = this.networkData.getInt("inputId");
        var inputData = this.networkData.getInt("inputData");
        var outputId = this.networkData.getInt("outputId");
        var outputData = this.networkData.getInt("outputData");
        //const input = this.container.getSlot("slotInput");
        //const output = this.container.getSlot("slotOutput");
        var empty = { id: 0, count: 0, data: 0 };
        (_a = this.animInput) === null || _a === void 0 ? void 0 : _a.describeItem(inputId === 0 ? empty : { id: Network.serverToLocalId(inputId), count: 1, data: inputData, size: 14 / 16, rotation: [Math.PI / 2, 0, 0] });
        (_b = this.animOutput) === null || _b === void 0 ? void 0 : _b.describeItem(outputId === 0 ? empty : { id: Network.serverToLocalId(outputId), count: 1, data: outputData, size: 14 / 16, rotation: [Math.PI / 2, 0, 0] });
    };
    CastingTable.prototype.updateLiquidLimits = function () {
        this.liquidStorage.liquidLimits = CastingRecipe.getTableLimits(this.container.getSlot("slotInput").id);
    };
    CastingTable.prototype.isValidCast = function (id) {
        return ItemRegistry.isItem(id);
    };
    CastingTable.prototype.getRecipe = function (stored) {
        return CastingRecipe.getTableRecipe(this.container.getSlot("slotInput").id, stored);
    };
    CastingTable.prototype.onItemUse = function (coords, item, playerUid) {
        if (this.liquidStorage.getLiquidStored()) {
            return false;
        }
        var player = new PlayerEntity(playerUid);
        var input = this.container.getSlot("slotInput");
        var output = this.container.getSlot("slotOutput");
        if (output.id !== 0) {
            output.dropAt(this.blockSource, this.x + 0.5, this.y + 1, this.z + 0.5);
        }
        else if (input.id !== 0) {
            var result = CastingRecipe.getSandMoldingRecipe(item.id);
            if (input.id === ItemID.tcon_sandcast_blank && result) {
                input.setSlot(result, 1, 0);
                output.setSlot(item.id, 1, item.data);
                player.decreaseCarriedItem();
            }
            else {
                input.dropAt(this.blockSource, this.x + 0.5, this.y + 1, this.z + 0.5);
            }
        }
        else if (this.isValidCast(item.id) && !item.extra) {
            input.setSlot(item.id, 1, item.data);
            player.decreaseCarriedItem();
        }
        else {
            return false;
        }
        this.updateLiquidLimits();
        this.container.sendChanges();
        return true;
    };
    CastingTable.prototype.onTick = function () {
        _super.prototype.onTick.call(this);
        var stored = this.liquidStorage.getLiquidStored();
        if (stored && this.liquidStorage.isFull(stored)) {
            if (++this.data.progress < CastingRecipe.calcCooldownTime(stored, this.liquidStorage.getAmount(stored))) {
                if ((World.getThreadTime() & 15) === 0) {
                    this.sendPacket("spawnParticle", {});
                }
            }
            else {
                var result = this.getRecipe(stored);
                if (result) {
                    this.container.setSlot("slotOutput", result.id, 1, result.data);
                    result.consume && this.container.clearSlot("slotInput");
                    this.sendPacket("spawnParticle", {});
                }
                this.data.progress = 0;
                this.liquidStorage.setAmount(stored, 0);
                for (var key in this.liquidStorage.liquidAmounts) {
                    delete this.liquidStorage.liquidAmounts[key];
                }
            }
        }
        StorageInterface.checkHoppers(this);
        this.container.sendChanges();
        var slotInput = this.container.getSlot("slotInput");
        var slotOutput = this.container.getSlot("slotOutput");
        this.networkData.putInt("inputId", slotInput.id);
        this.networkData.putInt("inputData", slotInput.data);
        this.networkData.putInt("outputId", slotOutput.id);
        this.networkData.putInt("outputData", slotOutput.data);
        this.networkData.sendChanges();
    };
    CastingTable.prototype.spawnParticle = function (data) {
        for (var i = 0; i < 4; i++) {
            Particles.addParticle(EParticleType.SMOKE, this.x + Math.random(), this.y + 1, this.z + Math.random(), 0, 0, 0);
        }
    };
    __decorate([
        ClientSide
    ], CastingTable.prototype, "setupAnimPosScale", null);
    __decorate([
        ClientSide
    ], CastingTable.prototype, "setupAnimItem", null);
    __decorate([
        ClientSide
    ], CastingTable.prototype, "updateAnimItem", null);
    __decorate([
        NetworkEvent(Side.Client)
    ], CastingTable.prototype, "spawnParticle", null);
    return CastingTable;
}(TileWithLiquidModel));
TileEntity.registerPrototype(BlockID.tcon_itemcast, new CastingTable());
StorageInterface.createInterface(BlockID.tcon_itemcast, {
    liquidUnitRatio: 0.001,
    slots: {
        slotOutput: { output: true }
    },
    canReceiveLiquid: function (liquid, side) {
        var stored = this.tileEntity.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForTable(this.tileEntity.container.getSlot("slotInput").id, liquid);
    }
});
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
    CastingBasin.prototype.setupAnimPosScale = function () {
        this.animPos = { x: 0.5, y: 5 / 16, z: 0.5 };
        this.animScale = { x: 12 / 16, y: 11 / 16, z: 12 / 16 };
    };
    CastingBasin.prototype.setupAnimItem = function () {
        var _this = this;
        this.animInput = new Animation.Item(this.x + 0.5, this.y + 10 / 16, this.z + 0.5);
        this.animInput.load();
        this.animInput.setSkylightMode();
        this.animOutput = new Animation.Item(this.x + 0.5, this.y + 10 / 16, this.z + 0.5);
        this.animOutput.load();
        this.animOutput.setSkylightMode();
        this.updateAnimItem();
        this.networkData.addOnDataChangedListener(function (data, isExternal) {
            _this.updateAnimItem();
        });
    };
    CastingBasin.prototype.updateAnimItem = function () {
        var _a, _b;
        var inputId = this.networkData.getInt("inputId");
        var inputData = this.networkData.getInt("inputData");
        var outputId = this.networkData.getInt("outputId");
        var outputData = this.networkData.getInt("outputData");
        var empty = { id: 0, count: 0, data: 0 };
        (_a = this.animInput) === null || _a === void 0 ? void 0 : _a.describeItem(inputId === 0 ? empty : { id: Network.serverToLocalId(inputId), count: 1, data: inputData, size: 12 / 16 - 0.01 });
        (_b = this.animOutput) === null || _b === void 0 ? void 0 : _b.describeItem(outputId === 0 ? empty : { id: Network.serverToLocalId(outputId), count: 1, data: outputData, size: 12 / 16 - 0.01 });
    };
    CastingBasin.prototype.updateLiquidLimits = function () {
        this.liquidStorage.liquidLimits = CastingRecipe.getBasinLimits(this.container.getSlot("slotInput").id);
    };
    CastingBasin.prototype.isValidCast = function (id) {
        return ItemRegistry.isBlock(id);
    };
    CastingBasin.prototype.getRecipe = function (stored) {
        return CastingRecipe.getBasinRecipe(this.container.getSlot("slotInput").id, stored);
    };
    __decorate([
        ClientSide
    ], CastingBasin.prototype, "setupAnimPosScale", null);
    __decorate([
        ClientSide
    ], CastingBasin.prototype, "setupAnimItem", null);
    __decorate([
        ClientSide
    ], CastingBasin.prototype, "updateAnimItem", null);
    return CastingBasin;
}(CastingTable));
TileEntity.registerPrototype(BlockID.tcon_blockcast, new CastingBasin());
StorageInterface.createInterface(BlockID.tcon_blockcast, {
    liquidUnitRatio: 0.001,
    slots: {
        slotOutput: { output: true }
    },
    canReceiveLiquid: function (liquid, side) {
        var stored = this.tileEntity.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForBasin(this.tileEntity.container.getSlot("slotInput").id, liquid);
    }
});
var _a;
createBlock("tcon_smeltery", [{ name: "Smeltery Controller", texture: [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], ["tcon_smeltery", 0], ["tcon_stone", 3], ["tcon_stone", 3]] }]);
TileRenderer.setStandardModelWithRotation(BlockID.tcon_smeltery, 2, [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], ["tcon_smeltery", 0], ["tcon_stone", 3], ["tcon_stone", 3]]);
TileRenderer.registerModelWithRotation(BlockID.tcon_smeltery, 2, [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], ["tcon_smeltery", 1], ["tcon_stone", 3], ["tcon_stone", 3]]);
TileRenderer.setRotationFunction(BlockID.tcon_smeltery);
Recipes2.addShaped(BlockID.tcon_smeltery, "aaa:a_a:aaa", { a: ItemID.tcon_brick });
var SmelteryHandler = /** @class */ (function () {
    function SmelteryHandler() {
    }
    SmelteryHandler.setup = function () {
        var i = 0;
        var z = 1000;
        for (var key in LiquidRegistry.liquids) {
            this.elements["liquid" + i] = {
                type: "scale",
                x: 93 * SCALE,
                y: 11 * SCALE,
                z: z--,
                width: 52 * SCALE,
                height: 52 * SCALE,
                //bitmap: LiquidRegistry.getLiquidUITexture(key, 18 * SCALE, 18 * SCALE),
                direction: 1,
                pixelate: false
            };
            i++;
        }
        this.liquidCount = i;
        this.window = new UI.StandardWindow({
            standard: {
                header: { text: { text: "Smeltery" }, height: 60 },
                inventory: { standard: true },
                background: { standard: true }
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
    };
    SmelteryHandler.getWindow = function () {
        return this.window;
    };
    SmelteryHandler.getHeatFactor = function () {
        return 8;
    };
    SmelteryHandler.isValidBlock = function (id) {
        return this.blocks[id] || false;
    };
    SmelteryHandler.blocks = (_a = {},
        _a[BlockID.tcon_stone] = true,
        _a[BlockID.tcon_seared_glass] = true,
        _a[BlockID.tcon_drain] = true,
        _a[BlockID.tcon_tank_fuel] = true,
        _a[BlockID.tcon_gauge_fuel] = true,
        _a[BlockID.tcon_tank_ingot] = true,
        _a[BlockID.tcon_gauge_ingot] = true,
        _a[BlockID.tcon_smeltery] = true,
        _a);
    SmelteryHandler.elements = {
        imageOvl: { type: "image", x: 93 * SCALE, y: 11 * SCALE, z: 1001, bitmap: "tcon.smeltery_ovl", scale: SCALE },
        slot0: { type: "slot", x: 24 * SCALE, y: 10 * SCALE, size: 18 * SCALE /*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/ },
        slot1: { type: "slot", x: 24 * SCALE, y: 28 * SCALE, size: 18 * SCALE /*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/ },
        slot2: { type: "slot", x: 24 * SCALE, y: 46 * SCALE, size: 18 * SCALE /*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/ },
        gauge0: { type: "scale", x: 21 * SCALE, y: 11 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1 },
        gauge1: { type: "scale", x: 21 * SCALE, y: 29 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1 },
        gauge2: { type: "scale", x: 21 * SCALE, y: 47 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1 },
        //scaleLava: {type: "scale", x: 161 * SCALE, y: 11 * SCALE, width: 12 * SCALE, height: 52 * SCALE, bitmap: "_liquid_lava_texture_0", direction: 1},
        textFuel: { type: "text", x: 67 * SCALE, y: 50 * SCALE, font: { size: 30, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER } },
        textLiquid: { type: "text", x: 92 * SCALE, y: 65 * SCALE, z: 1002, font: { size: 30, color: Color.WHITE, shadow: 0.5 }, multiline: true },
        buttonDump: { type: "button", x: 92 * SCALE, y: 80 * SCALE, z: 1002, bitmap: "_craft_button_up", bitmap2: "_craft_button_down", scale: SCALE / 2, clicker: {
                onClick: function (_, container) {
                    container.sendEvent("dumpLiquid", {});
                }
            } },
        buttonSelect: { type: "button", x: 130 * SCALE, y: 80 * SCALE, z: 1002, bitmap: "classic_button_up", bitmap2: "classic_button_down", scale: SCALE, clicker: {
                onClick: function (_, container) {
                    container.sendEvent("selectLiquid", {});
                }
            } },
        textDump: { type: "text", x: 104 * SCALE, y: 78 * SCALE, z: 1003, text: "Dump", font: { size: 30, color: Color.WHITE, shadow: 0.5, alignment: 1 } },
        iconSelect: { type: "image", x: 131.6 * SCALE, y: 81.6 * SCALE, z: 1003, bitmap: "mod_browser_update_icon", scale: SCALE * 0.8 }
    };
    SmelteryHandler.liquidCount = 0;
    return SmelteryHandler;
}());
Callback.addCallback("PostLoaded", function () {
    SmelteryHandler.setup();
});
var SmelteryControler = /** @class */ (function (_super) {
    __extends(SmelteryControler, _super);
    function SmelteryControler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tanksPos = [];
        _this.defaultValues = {
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
    SmelteryControler.prototype.getLiquidStored = function () {
        var _a;
        return ((_a = this.getLiquidArray()[0]) === null || _a === void 0 ? void 0 : _a.liquid) || null;
    };
    SmelteryControler.prototype.getLimit = function (liquid) {
        var capacity = this.getLiquidCapacity();
        var otherTotal = this.totalLiquidAmount() - this.getAmount(liquid);
        return capacity - otherTotal;
    };
    SmelteryControler.prototype.getAmount = function (liquid) {
        return this.liquidStorage.getAmount(liquid) || 0;
    };
    SmelteryControler.prototype.getRelativeAmount = function (liquid) {
        var capacity = this.getLiquidCapacity();
        return capacity > 0 ? this.getAmount(liquid) / capacity : 0;
    };
    SmelteryControler.prototype.getLiquid = function (liquid, amount) {
        var got = Math.min(this.getAmount(liquid), amount);
        this.liquidStorage.liquidAmounts[liquid] -= got;
        if (this.liquidStorage.liquidAmounts[liquid] <= 0) {
            delete this.liquidStorage.liquidAmounts[liquid];
        }
        return got;
    };
    SmelteryControler.prototype.addLiquid = function (liquid, amount) {
        var _a;
        var _b;
        var freespace = this.getLiquidCapacity() - this.totalLiquidAmount();
        var add = Math.min(freespace, amount);
        (_a = (_b = this.liquidStorage.liquidAmounts)[liquid]) !== null && _a !== void 0 ? _a : (_b[liquid] = 0);
        this.liquidStorage.liquidAmounts[liquid] += add;
        return add;
    };
    SmelteryControler.prototype.isFull = function (liquid) {
        return this.totalLiquidAmount() > this.getLiquidCapacity();
    };
    SmelteryControler.prototype.isEmpty = function (liquid) {
        return this.totalLiquidAmount() <= 0;
    };
    SmelteryControler.prototype.getScreenByName = function (screenName, container) {
        return SmelteryHandler.getWindow();
    };
    SmelteryControler.prototype.putDefaultNetworkData = function () {
        this.networkData.putBoolean("active", false);
    };
    SmelteryControler.prototype.setActive = function () {
        if (this.networkData.getBoolean("active") !== this.data.isActive) {
            this.networkData.putBoolean("active", this.data.isActive);
            this.networkData.sendChanges();
        }
    };
    SmelteryControler.prototype.renderModel = function () {
        if (this.networkData.getBoolean("active")) {
            TileRenderer.mapAtCoords(this.x, this.y, this.z, Network.serverToLocalId(this.networkData.getInt("blockId")), this.networkData.getInt("blockData"));
        }
        else {
            BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        }
    };
    SmelteryControler.prototype.clientLoad = function () {
        var _this = this;
        this.render = new Render();
        this.anim = new Animation.Base(this.x, this.y, this.z);
        this.anim.describe({ render: this.render.getId(), skin: "model/tcon_liquids.png" });
        this.anim.load();
        this.anim.setSkylightMode();
        this.renderModel();
        this.networkData.addOnDataChangedListener(function (data, isExternal) {
            _this.renderModel();
        });
    };
    SmelteryControler.prototype.clientUnload = function () {
        var _a;
        (_a = this.anim) === null || _a === void 0 ? void 0 : _a.destroy();
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    };
    SmelteryControler.prototype.onInit = function () {
        _super.prototype.onInit.call(this);
        this.area = {
            from: { x: 0, y: 0, z: 0 },
            to: { x: 0, y: 0, z: 0 }
        };
        this.data.isActive = this.checkStructure();
    };
    SmelteryControler.prototype.searchWall = function (coords, axis, dir) {
        var pos = __assign({}, coords);
        var i = 0;
        var block = 0;
        for (i = 0; i < 16; i++) {
            pos[axis] += dir;
            block = this.region.getBlockId(pos);
            if (block === 0)
                continue;
            return SmelteryHandler.isValidBlock(block) ? (i + 1) * dir : 0;
        }
        return 0;
    };
    SmelteryControler.prototype.checkStructure = function () {
        var facing = this.networkData.getInt("blockData") - 2;
        var backPos = { x: this.x, y: this.y, z: this.z };
        backPos[facing >> 1 ? "x" : "z"] += facing & 1 ? -1 : 1;
        if (this.region.getBlockId(backPos) !== 0) {
            return false;
        }
        var x1 = this.searchWall(backPos, "x", -1);
        var x2 = this.searchWall(backPos, "x", 1);
        var z1 = this.searchWall(backPos, "z", -1);
        var z2 = this.searchWall(backPos, "z", 1);
        if (x1 === 0 || x2 === 0 || z1 === 0 || z2 === 0) {
            return false;
        }
        var from = { x: backPos.x + x1, z: backPos.z + z1 };
        var to = { x: backPos.x + x2, z: backPos.z + z2 };
        //Floor Check
        var x = 0;
        var z = 0;
        for (x = from.x + 1; x <= to.x - 1; x++) {
            for (z = from.z + 1; z <= to.z - 1; z++) {
                if (this.region.getBlockId(x, this.y - 1, z) !== BlockID.tcon_stone) {
                    return false;
                }
            }
        }
        //Wall Check
        var tanks = [];
        var y = 0;
        var block = 0;
        var tile;
        loop: for (y = this.y; y < 256; y++) {
            for (x = from.x; x <= to.x; x++) {
                for (z = from.z; z <= to.z; z++) {
                    if (x === from.x && z === from.z || x === to.x && z === from.z || x === from.x && z === to.z || x === to.x && z === to.z) {
                        continue;
                    }
                    block = this.region.getBlockId(x, y, z);
                    if (from.x < x && x < to.x && from.z < z && z < to.z) {
                        if (block !== 0) {
                            break loop;
                        }
                        continue;
                    }
                    if (!SmelteryHandler.isValidBlock(block)) {
                        break loop;
                    }
                    tile = this.region.getTileEntity(x, y, z);
                    if (tile) {
                        switch (tile.blockID) {
                            case BlockID.tcon_tank_fuel:
                            case BlockID.tcon_gauge_fuel:
                            case BlockID.tcon_tank_ingot:
                            case BlockID.tcon_gauge_ingot:
                                tanks.push({ x: x, y: y, z: z });
                                break;
                            case BlockID.tcon_drain:
                                tile.controller = this;
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
        this.area = {
            from: { x: from.x, y: this.y - 1, z: from.z },
            to: { x: to.x, y: y - 1, z: to.z }
        };
        this.tanksPos = tanks;
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
        var array = [];
        for (var key in liquids) {
            if (liquids[key] > 0) {
                array.push({ liquid: key, amount: liquids[key] });
            }
        }
        for (var i = 0; i < this.data.select; i++) {
            array.push(array.shift());
        }
        return array;
    };
    SmelteryControler.prototype.consumeFuel = function () {
        var iTank;
        var tank;
        var stored = "";
        var amount = 0;
        var fuelData;
        for (var i = 0; i < this.tanksPos.length; i++) {
            iTank = StorageInterface.getLiquidStorage(this.blockSource, this.tanksPos[i].x, this.tanksPos[i].y, this.tanksPos[i].z);
            tank = iTank === null || iTank === void 0 ? void 0 : iTank.getOutputTank(-1);
            if (tank) {
                stored = tank.getLiquidStored();
                amount = tank.getAmount(stored);
                fuelData = SmelteryFuel.getFuel(stored);
                if (fuelData && amount >= fuelData.amount) {
                    tank.getLiquid(stored, fuelData.amount);
                    return { duration: fuelData.duration, temp: fuelData.temp };
                }
            }
        }
        return null;
    };
    SmelteryControler.prototype.onItemUse = function (coords, item, player) {
        this.data.isActive = this.checkStructure();
        if (this.data.isActive) {
            return false;
        }
        BlockEngine.sendMessage(Network.getClientForPlayer(player), "Invalid Structure");
        return true;
    };
    SmelteryControler.prototype.setAnim = function (data) {
        if (!this.render || !this.anim) {
            return;
        }
        var parts = [];
        var sizeX = data.area.to.x - data.area.from.x - 1;
        var sizeY = data.area.to.y - data.area.from.y;
        var sizeZ = data.area.to.z - data.area.from.z - 1;
        var texScale = MoltenLiquid.getTexScale();
        if (data.isActive) {
            var height = 0;
            var max = 0;
            var y = 0;
            for (var i = 0; i < data.liqArray.length; i++) {
                height = data.liqArray[i].amount / data.capacity * sizeY;
                max = Math.max(sizeX, sizeZ, height);
                parts.push({
                    type: "box",
                    uv: { x: 0, y: MoltenLiquid.getY(data.liqArray[i].liquid) * max },
                    coords: { x: 0, y: y - height * 16 / 2, z: 0 },
                    size: { x: sizeX * 16, y: height * 16, z: sizeZ * 16 }
                });
                y -= height * 16;
            }
            texScale.width *= max;
            texScale.height *= max;
        }
        if (isFinite(texScale.width) && isFinite(texScale.height)) {
            this.render.setPart("head", parts, texScale);
        }
        this.anim.setPos((data.area.from.x + data.area.to.x) / 2 + 0.5, (data.area.from.y + data.area.to.y) / 2 - (sizeY + 1) * 0.5, (data.area.from.z + data.area.to.z) / 2 + 0.5);
        this.anim.refresh();
    };
    SmelteryControler.prototype.interactWithEntitiesInside = function () {
        var allEnt = this.region.listEntitiesInAABB(this.area.from, this.area.to);
        var entities = [];
        for (var i = 0; i < allEnt.length; i++) {
            if (MeltingRecipe.getEntRecipe(allEnt[i])) {
                entities.push(allEnt[i]);
            }
        }
        var liquidCapacity = this.getLiquidCapacity();
        var result;
        for (var i = 0; i < entities.length; i++) {
            result = MeltingRecipe.getEntRecipe(entities[i]);
            if (this.totalLiquidAmount() + result.amount <= liquidCapacity) {
                this.liquidStorage.addLiquid(result.liquid, result.amount);
            }
            Entity.damageEntity(entities[i], 2);
        }
    };
    SmelteryControler.prototype.onTick = function () {
        var _this = this;
        var tick = World.getThreadTime();
        var liqArray = this.getLiquidArray();
        var totalAmount = this.totalLiquidAmount();
        var capacity = this.getItemCapacity();
        var liquidCapacity = this.getLiquidCapacity();
        var canSmelt = true;
        if ((tick & 63) === 0) {
            this.data.isActive = this.checkStructure();
            this.setActive();
            this.sendPacket("setAnim", { capacity: liquidCapacity, liqArray: liqArray, area: this.area, isActive: this.data.isActive });
            if (this.data.isActive) {
                this.sendPacket("spawnParticle", {});
            }
        }
        if (this.data.isActive) {
            if (Cfg.checkInsideSmeltery && tick % 20 === 0) {
                this.interactWithEntitiesInside();
            }
            if ((tick & 3) === 0) {
                AlloyRecipe.getRecipes(this.liquidStorage.liquidAmounts).forEach(function (recipe) {
                    for (var i = 0; i < recipe.inputs.length; i++) {
                        _this.getLiquid(recipe.inputs[i].liquid, recipe.inputs[i].amount);
                    }
                    _this.addLiquid(recipe.result.liquid, recipe.result.amount);
                });
            }
            if (this.data.fuel <= 0) {
                var fuelData = this.consumeFuel();
                if (fuelData) {
                    this.data.fuel = fuelData.duration;
                    this.data.temp = fuelData.temp;
                }
                if (this.data.fuel <= 0) {
                    canSmelt = false;
                }
            }
        }
        else {
            canSmelt = false;
        }
        var modes = [0, 0, 0];
        var values = [0, 0, 0];
        if (canSmelt) {
            var slots = [
                this.container.getSlot("slot0"),
                this.container.getSlot("slot1"),
                this.container.getSlot("slot2")
            ];
            var smeltCount = slots.reduce(function (sum, slot) { return sum + slot.count; }, 0);
            var recipe = void 0;
            var time = 0;
            var count = 0;
            var consume = false;
            if (smeltCount > capacity) {
                for (var i = 0; i < 3; i++) {
                    modes[i] = 2;
                    values[i] = 1;
                }
            }
            else {
                for (var i = 0; i < 3; i++) {
                    recipe = MeltingRecipe.getRecipe(slots[i].id, slots[i].data);
                    if (recipe && i < capacity) {
                        time = Math.max(5, recipe.temp) * SmelteryHandler.getHeatFactor();
                        this.data["heat" + i] += this.data.temp / 100;
                        consume = true;
                        if (this.data["heat" + i] >= time) {
                            count = slots[i].count;
                            while (totalAmount + recipe.amount * count > liquidCapacity) {
                                count--;
                            }
                            if (count > 0) {
                                slots[i].count -= count;
                                this.container.validateSlot("slot" + i);
                                this.liquidStorage.addLiquid(recipe.liquid, recipe.amount * count);
                                this.data["heat" + i] = 0;
                            }
                            else {
                                modes[i] = 2;
                                values[i] = 1;
                            }
                        }
                        else {
                            values[i] = this.data["heat" + i] / time;
                        }
                    }
                    else {
                        this.data["heat" + i] = 0;
                        if (slots[i].id !== 0) {
                            modes[i] = 3;
                            values[i] = 1;
                        }
                    }
                }
            }
            if (consume) {
                this.data.fuel--;
            }
        }
        for (var i = 0; i < 3; i++) {
            this.container.setScale("gauge" + i, values[i]);
        }
        for (var i = 0; i < SmelteryHandler.liquidCount; i++) {
            if (i < liqArray.length) {
                this.container.setScale("liquid" + i, 1);
            }
        }
        this.container.sendEvent("changeScales", { mode0: modes[0], mode1: modes[1], mode2: modes[2] });
        this.container.sendEvent("updateLiquidScales", { capacity: liquidCapacity, liqArray: liqArray });
        this.container.setText("textFuel", "fuel: " + this.data.fuel);
        this.container.setText("textLiquid", liqArray[0] ? LiquidRegistry.getLiquidName(liqArray[0].liquid) + "\n" + liqArray[0].amount + " mB" : "");
        this.container.sendChanges();
    };
    SmelteryControler.prototype.spawnParticle = function (data) {
        //270, 90, 180, 0 degree
        var blockData = this.networkData.getInt("blockData");
        var cos = [0, 0, -1, 1][blockData];
        var sin = [-1, 1, 0, 0][blockData];
        var x = 0.52;
        var z = Math.random() * 0.6 - 0.3;
        var coords = {
            x: this.x + 0.5 + x * cos - z * sin,
            y: this.y + 0.5 + (Math.random() * 6) / 16,
            z: this.z + 0.5 + x * sin + z * cos
        };
        Particles.addParticle(EParticleType.SMOKE, coords.x, coords.y, coords.z, 0, 0, 0);
        Particles.addParticle(EParticleType.FLAME, coords.x, coords.y, coords.z, 0, 0, 0);
    };
    SmelteryControler.prototype.changeScales = function (container, window, content, data) {
        if (window === null || window === void 0 ? void 0 : window.isOpened()) {
            var elements = window.getElements();
            elements.get("gauge0").setBinding("texture", "tcon.heat_gauge_" + data.mode0);
            elements.get("gauge1").setBinding("texture", "tcon.heat_gauge_" + data.mode1);
            elements.get("gauge2").setBinding("texture", "tcon.heat_gauge_" + data.mode2);
        }
    };
    SmelteryControler.prototype.updateLiquidScales = function (container, window, content, data) {
        if (!(window === null || window === void 0 ? void 0 : window.isOpened())) {
            return;
        }
        var elements = window.getElements();
        var elem;
        var y = (11 + 52) * SCALE;
        for (var i = 0; i < SmelteryHandler.liquidCount; i++) {
            elem = elements.get("liquid" + i);
            if (i < data.liqArray.length) {
                y -= data.liqArray[i].amount / data.capacity * 52 * SCALE;
                elem.setPosition(elem.x, y);
                elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(data.liqArray[i].liquid, 18 * SCALE, 18 * SCALE));
            }
            else {
                elem.setPosition(elem.x, 2000);
            }
        }
    };
    SmelteryControler.prototype.selectLiquid = function () {
        this.data.select = (this.data.select + 1) % this.getLiquidArray().length;
    };
    SmelteryControler.prototype.dumpLiquid = function () {
        var stored = this.getLiquidStored();
        this.getLiquid(stored, this.getAmount(stored));
        this.data.select %= this.getLiquidArray().length;
    };
    __decorate([
        ClientSide
    ], SmelteryControler.prototype, "renderModel", null);
    __decorate([
        NetworkEvent(Side.Client)
    ], SmelteryControler.prototype, "setAnim", null);
    __decorate([
        NetworkEvent(Side.Client)
    ], SmelteryControler.prototype, "spawnParticle", null);
    __decorate([
        ContainerEvent(Side.Client)
    ], SmelteryControler.prototype, "changeScales", null);
    __decorate([
        ContainerEvent(Side.Client)
    ], SmelteryControler.prototype, "updateLiquidScales", null);
    __decorate([
        ContainerEvent(Side.Server)
    ], SmelteryControler.prototype, "selectLiquid", null);
    __decorate([
        ContainerEvent(Side.Server)
    ], SmelteryControler.prototype, "dumpLiquid", null);
    return SmelteryControler;
}(TconTileEntity));
TileEntity.registerPrototype(BlockID.tcon_smeltery, new SmelteryControler());
StorageInterface.createInterface(BlockID.tcon_smeltery, {
    liquidUnitRatio: 0.001,
    canReceiveLiquid: function (liquid, side) {
        return true;
    },
    getInputTank: function () {
        return this.tileEntity;
    },
    getOutputTank: function () {
        return this.tileEntity;
    }
});
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
    TinkersMaterial.prototype.setItem = function (item) {
        if (item) {
            this.item = getIDData(item, -1);
        }
        return this;
    };
    TinkersMaterial.prototype.getItem = function () {
        return this.item;
    };
    TinkersMaterial.prototype.setHeadStats = function (durability, speed, attack, level) {
        this.headStats = { durability: durability, speed: speed, attack: attack, level: level };
        return this;
    };
    TinkersMaterial.prototype.setHandleStats = function (modifier, durability) {
        this.handleStats = { modifier: modifier, durability: durability };
        return this;
    };
    TinkersMaterial.prototype.setExtraStats = function (durability) {
        this.extraStats = { durability: durability };
        return this;
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
    wood: new TinkersMaterial("Wooden", 0)
        .setItem("planks")
        .setHeadStats(35, 2, 2, TinkersMaterial.STONE)
        .setHandleStats(1, 25)
        .setExtraStats(15),
    stone: new TinkersMaterial("Stone", 1)
        .setItem("cobblestone")
        .setHeadStats(120, 4, 3, TinkersMaterial.IRON)
        .setHandleStats(0.5, -50)
        .setExtraStats(20),
    flint: new TinkersMaterial("Flint", 2)
        .setItem("flint")
        .setHeadStats(150, 5, 2.9, TinkersMaterial.IRON)
        .setHandleStats(0.6, -60)
        .setExtraStats(40),
    cactus: new TinkersMaterial("Cactus", 3)
        .setItem("cactus")
        .setHeadStats(210, 4, 3.4, TinkersMaterial.IRON)
        .setHandleStats(0.85, 20)
        .setExtraStats(50),
    obsidian: new TinkersMaterial("Obsidian", 4, "molten_obsidian")
        .setItem("obsidian")
        .setHeadStats(139, 7.07, 4.2, TinkersMaterial.COBALT)
        .setHandleStats(0.9, -100)
        .setExtraStats(90),
    prismarine: new TinkersMaterial("Prismarine", 5)
        .setItem("prismarine")
        .setHeadStats(430, 5.5, 6.2, TinkersMaterial.IRON)
        .setHandleStats(0.6, -150)
        .setExtraStats(100),
    netherrack: new TinkersMaterial("Netherrack", 6)
        .setItem("netherrack")
        .setHeadStats(270, 4.5, 3, TinkersMaterial.IRON)
        .setHandleStats(0.85, -150)
        .setExtraStats(75),
    endstone: new TinkersMaterial("End", 7)
        .setItem("end_stone")
        .setHeadStats(420, 3.23, 3.23, TinkersMaterial.OBSIDIAN)
        .setHandleStats(0.85, 0)
        .setExtraStats(42),
    bone: new TinkersMaterial("Bone", 8)
        .setItem("bone")
        .setHeadStats(200, 5.09, 2.5, TinkersMaterial.IRON)
        .setHandleStats(1.1, 50)
        .setExtraStats(65),
    paper: new TinkersMaterial("Paper", 9)
        .setItem(ItemID.tcon_paperstack)
        .setHeadStats(12, 0.51, 0.05, TinkersMaterial.STONE)
        .setHandleStats(0.1, 5)
        .setExtraStats(15),
    sponge: new TinkersMaterial("Sponge", 10)
        .setItem("sponge")
        .setHeadStats(1050, 3.02, 0, TinkersMaterial.STONE)
        .setHandleStats(1.2, 250)
        .setExtraStats(250),
    firewood: new TinkersMaterial("Firewood", 11)
        .setItem(BlockID.tcon_firewood)
        .setHeadStats(550, 6, 5.5, TinkersMaterial.STONE)
        .setHandleStats(1, -200)
        .setExtraStats(150),
    slime: new TinkersMaterial("Slime", 12)
        .setItem(ItemID.tcon_slimecrystal_green)
        .setHeadStats(1000, 4.24, 1.8, TinkersMaterial.STONE)
        .setHandleStats(0.7, 0)
        .setExtraStats(350),
    blueslime: new TinkersMaterial("Blue Slime", 13)
        .setItem(ItemID.tcon_slimecrystal_blue)
        .setHeadStats(780, 4.03, 1.8, TinkersMaterial.STONE)
        .setHandleStats(1.3, -50)
        .setExtraStats(200),
    magmaslime: new TinkersMaterial("Magma Slime", 14)
        .setItem(ItemID.tcon_slimecrystal_magma)
        .setHeadStats(600, 2.1, 7, TinkersMaterial.STONE)
        .setHandleStats(0.85, -200)
        .setExtraStats(150),
    knightslime: new TinkersMaterial("Knightslime", 15, "molten_knightslime", true)
        .setItem(ItemID.ingotKnightslime)
        .setHeadStats(850, 5.8, 5.1, TinkersMaterial.OBSIDIAN)
        .setHandleStats(0.5, 500)
        .setExtraStats(125),
    iron: new TinkersMaterial("Iron", 16, "molten_iron", true)
        .setItem("iron_ingot")
        .setHeadStats(204, 6, 5.5, TinkersMaterial.DIAMOND)
        .setHandleStats(0.85, 60)
        .setExtraStats(50),
    pigiron: new TinkersMaterial("Pig Iron", 17, "molten_pigiron", true)
        .setItem(ItemID.ingotPigiron)
        .setHeadStats(380, 6.2, 4.5, TinkersMaterial.DIAMOND)
        .setHandleStats(1.2, 0)
        .setExtraStats(170),
    cobalt: new TinkersMaterial("Cobalt", 18, "molten_cobalt", true)
        .setItem(ItemID.ingotCobalt)
        .setHeadStats(780, 12, 4.1, TinkersMaterial.COBALT)
        .setHandleStats(0.9, 100)
        .setExtraStats(300),
    ardite: new TinkersMaterial("Ardite", 19, "molten_ardite", true)
        .setItem(ItemID.ingotArdite)
        .setHeadStats(990, 3.5, 3.6, TinkersMaterial.COBALT)
        .setHandleStats(1.4, -200)
        .setExtraStats(450),
    manyullyn: new TinkersMaterial("Manyullyn", 20, "molten_manyullyn", true)
        .setItem(ItemID.ingotManyullyn)
        .setHeadStats(820, 7.02, 8.72, TinkersMaterial.COBALT)
        .setHandleStats(0.5, 250)
        .setExtraStats(50),
    copper: new TinkersMaterial("Copper", 21, "molten_copper", true)
        .setItem(ItemID.ingotCopper)
        .setHeadStats(210, 5.3, 3, TinkersMaterial.IRON)
        .setHandleStats(1.05, 30)
        .setExtraStats(100),
    bronze: new TinkersMaterial("Bronze", 22, "molten_bronze", true)
        .setItem(ItemID.ingotBronze)
        .setHeadStats(430, 6.8, 3.5, TinkersMaterial.DIAMOND)
        .setHandleStats(1.1, 70)
        .setExtraStats(80),
    lead: new TinkersMaterial("Lead", 23, "molten_lead", true)
        .setItem(ItemID.ingotLead)
        .setHeadStats(434, 5.25, 3.5, TinkersMaterial.IRON)
        .setHandleStats(0.7, -50)
        .setExtraStats(100),
    silver: new TinkersMaterial("Silver", 24, "molten_silver", true)
        .setItem(ItemID.ingotSilver)
        .setHeadStats(250, 5, 5, TinkersMaterial.IRON)
        .setHandleStats(0.95, 50)
        .setExtraStats(150),
    electrum: new TinkersMaterial("Electrum", 25, "molten_electrum", true)
        .setItem(ItemID.ingotElectrum)
        .setHeadStats(50, 12, 3, TinkersMaterial.IRON)
        .setHandleStats(1.1, -25)
        .setExtraStats(250),
    steel: new TinkersMaterial("Steel", 26, "molten_steel", true)
        .setItem(ItemID.ingotSteel)
        .setHeadStats(540, 7, 6, TinkersMaterial.OBSIDIAN)
        .setHandleStats(0.9, 150)
        .setExtraStats(25)
};
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
        return this;
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
        return this;
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
        return this;
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
var TconToolStack = /** @class */ (function () {
    function TconToolStack(item) {
        this.id = item.id;
        this.count = item.count;
        this.data = item.data;
        this.extra = item.extra || null;
        this.instance = ItemRegistry.getInstanceOf(this.id);
        this.materials = new String(this.extra.getString("materials")).split("_");
        this.modifiers = TinkersModifierHandler.decodeToObj(this.extra.getString("modifiers"));
        this.stats = this.getStats();
    }
    Object.defineProperty(TconToolStack.prototype, "durability", {
        get: function () {
            return this.extra.getInt("durability", 0);
        },
        set: function (value) {
            var dur = Math.min(Math.max(0, value), this.stats.durability);
            this.extra.putInt("durability", dur);
            this.data = Math.ceil(dur / this.stats.durability * this.instance.maxDamage);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TconToolStack.prototype, "xp", {
        get: function () {
            return this.extra.getInt("xp", 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TconToolStack.prototype, "repairCount", {
        get: function () {
            return this.extra.getInt("repair", 0);
        },
        enumerable: false,
        configurable: true
    });
    TconToolStack.prototype.applyToHand = function (player) {
        Entity.setCarriedItem(player, this.id, this.count, this.data, this.extra);
    };
    TconToolStack.prototype.getBaseStats = function () {
        var stats = new ToolStats();
        for (var i = 0; i < this.materials.length; i++) {
            if (!Material[this.materials[i]]) {
                return null;
            }
        }
        this.instance.buildStats(stats, this.materials);
        return stats;
    };
    TconToolStack.prototype.getStats = function () {
        var stats = this.getBaseStats();
        stats.speed *= this.instance.miningSpeedModifier;
        stats.attack *= this.instance.damagePotential;
        this.forEachModifiers(function (mod, level) {
            mod.applyStats(stats, level);
        });
        return stats.getToolMaterial();
    };
    TconToolStack.prototype.forEachModifiers = function (func) {
        for (var key in this.modifiers) {
            Modifier[key] && func(Modifier[key], this.modifiers[key]);
        }
    };
    TconToolStack.prototype.isBroken = function () {
        return this.durability >= this.stats.durability;
    };
    TconToolStack.prototype.consumeDurability = function (value) {
        var cancel = false;
        var consume = 0;
        for (var i = 0; i < value; i++) {
            cancel = false;
            this.forEachModifiers(function (mod, level) {
                if (mod.onConsume(level))
                    cancel = true;
            });
            if (!cancel)
                consume++;
        }
        this.durability += consume;
    };
    TconToolStack.prototype.addXp = function (val) {
        var xp = this.xp;
        var oldLv = ToolLeveling.getLevel(xp, this.instance.is3x3);
        var newLv = ToolLeveling.getLevel(xp + val, this.instance.is3x3);
        this.extra.putInt("xp", xp + val);
        if (oldLv < newLv) {
            Game.message("§3" + ToolLeveling.getLevelupMessage(newLv, Item.getName(this.id, this.data)));
            SoundManager.playSound("tcon.levelup.ogg");
        }
    };
    TconToolStack.prototype.uniqueKey = function () {
        var hash = this.materials.reduce(function (a, v) { return 31 * a + Material[v].getTexIndex(); }, 0);
        var mask = 0;
        for (var key in this.modifiers) {
            mask |= 1 << Modifier[key].getTexIndex();
        }
        return this.id + ":" + hash.toString(16) + ":" + mask.toString(16);
    };
    TconToolStack.prototype.clone = function () {
        return new TconToolStack({ id: this.id, count: this.count, data: this.data, extra: this.extra.copy() });
    };
    return TconToolStack;
}());
var PartRegistry = /** @class */ (function () {
    function PartRegistry() {
    }
    PartRegistry.createParts = function (key, material) {
        var _this = this;
        var name = material.getName();
        this.types.forEach(function (type) {
            var id = createItem("tconpart_".concat(type.key, "_").concat(key), "".concat(name, " ").concat(type.name));
            Item.addCreativeGroup("tconpart_" + type.key, type.name, [id]);
            _this.data[id] = { type: type.key, material: key };
        });
    };
    PartRegistry.registerRecipes = function (key, material) {
        this.types.forEach(function (type) {
            var id = ItemID["tconpart_".concat(type.key, "_").concat(key)];
            var liquid = material.getMoltenLiquid();
            if (liquid) {
                MeltingRecipe.addRecipe(id, liquid, MatValue.INGOT * type.cost);
                CastingRecipe.addTableRecipeForAll(type.key, liquid, id);
            }
            CastingRecipe.addMakeCastRecipes(id, type.key);
        });
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
    PartRegistry.getAllPartBuildRecipeForRV = function () {
        var list = [];
        for (var key in Material) {
            if (!Material[key].isMetal) {
                for (var i = 0; i < this.types.length; i++) {
                    list.push({
                        input: [{ id: ItemID.tcon_pattern_blank, count: 1, data: 0 }, __assign(__assign({}, Material[key].getItem()), { count: this.types[i].cost })],
                        output: [{ id: this.getIDFromData(this.types[i].key, key), count: 1, data: 0 }],
                        pattern: this.types[i].key
                    });
                }
            }
        }
        return list;
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
(function () {
    for (var key in Material) {
        PartRegistry.createParts(key, Material[key]);
    }
})();
Callback.addCallback("PreLoaded", function () {
    for (var key in Material) {
        PartRegistry.registerRecipes(key, Material[key]);
    }
});
var ToolTexture = /** @class */ (function () {
    //private bitmap: android.graphics.Bitmap;
    function ToolTexture(path, partsCount, brokenIndex) {
        this.path = path;
        this.partsCount = partsCount;
        this.brokenIndex = brokenIndex;
        //this.bitmap = FileTools.ReadImage(__dir__ + "res/" + path);
    }
    ToolTexture.prototype.getPath = function () {
        return this.path;
    };
    /*
        getBitmap(partNum: number, index: number): android.graphics.Bitmap {
            return Bitmap.createBitmap(this.bitmap, (index & 15) << 4, (index >> 4) + (partNum << 1) << 4, 16, 16);//null, true
        }
    */
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
Callback.addCallback("PreLoaded", function () {
    var addRecipes = function (liquid, block, ingot /*, nugget: number*/) {
        MeltingRecipe.addRecipe(block, liquid, MatValue.BLOCK);
        MeltingRecipe.addRecipe(ingot, liquid, MatValue.INGOT);
        //MeltingRecipe.addRecipe(nugget, liquid, MatValue.NUGGET);
        CastingRecipe.addBasinRecipe(0, liquid, block, MatValue.BLOCK);
        CastingRecipe.addTableRecipeForAll("ingot", liquid, ingot);
        //CastingRecipe.addTableRecipeForAll("nugget", liquid, nugget);
        CastingRecipe.addMakeCastRecipes(ingot, "ingot");
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
});
createItem("tcon_paperstack", "Paper Stack");
Recipes2.addShapeless(ItemID.tcon_paperstack, [{ id: "paper", count: 4 }]);
createBlock("tcon_lavawood", [{ name: "Lavawood" }]);
createBlock("tcon_firewood", [{ name: "Firewood" }]);
CastingRecipe.addBasinRecipe(VanillaBlockID.planks, "lava", BlockID.tcon_lavawood, 250);
Recipes2.addShapeless(BlockID.tcon_firewood, [BlockID.tcon_lavawood, { id: "blaze_powder", count: 2 }]);
createItem("tcon_slimeball_blue", "Blue Slime");
createItem("tcon_slimeball_purple", "Purple Slime");
Recipes2.addShapeless(ItemID.tcon_slimeball_blue, ["slime_ball", { id: "blue_dye", count: 2 }]);
Recipes2.addShapeless(ItemID.tcon_slimeball_purple, [ItemID.tcon_slimeball_blue, { id: "redstone", count: 2 }]);
MeltingRecipe.addRecipe(ItemID.tcon_slimeball_purple, "purpleslime", MatValue.SLIME_BALL);
createBlock("tcon_slimymud_green", [{ name: "Slimy Mud" }]);
createBlock("tcon_slimymud_blue", [{ name: "Blue Slimy Mud" }]);
createBlock("tcon_slimymud_magma", [{ name: "Magma Slimy Mud" }]);
Recipes2.addShapeless(BlockID.tcon_slimymud_green, [{ id: "slime_ball", count: 4 }, "sand", "dirt"]);
Recipes2.addShapeless(BlockID.tcon_slimymud_green, [{ id: ItemID.tcon_slimeball_blue, count: 4 }, "sand", "dirt"]);
Recipes2.addShapeless(BlockID.tcon_slimymud_green, [{ id: "magma_cream", count: 4 }, "soul_sand", "netherrack"]);
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
Recipes2.addShaped(BlockID.tcon_seared_glass, "_a_:aba:_a_", { a: ItemID.tcon_brick, b: "glass" });
CastingRecipe.addBasinRecipe(VanillaBlockID.glass, "molten_stone", BlockID.tcon_seared_glass, MatValue.SEARED_BLOCK);
ConnectedTexture.setModelForGlass(BlockID.tcon_seared_glass, -1, "tcon_seared_glass");
createItem("tcon_pattern_blank", "Pattern");
Recipes2.addShaped({ id: ItemID.tcon_pattern_blank, count: 4 }, "ab:ba", { a: "planks", b: "stick" });
Item.addCreativeGroup("tcon_sandcast", "Sand Cast", [
    createItem("tcon_sandcast_blank", "Blank Sand Cast"),
    createItem("tcon_sandcast_pickaxe", "Pickaxe Head Sand Cast"),
    createItem("tcon_sandcast_shovel", "Shovel Head Sand Cast"),
    createItem("tcon_sandcast_axe", "Axe Head Sand Cast"),
    createItem("tcon_sandcast_broadaxe", "Broad Axe Head Sand Cast"),
    createItem("tcon_sandcast_sword", "Sword Blade Head Sand Cast"),
    createItem("tcon_sandcast_hammer", "Hammer Head Sand Cast"),
    createItem("tcon_sandcast_excavator", "Excavator Head Sand Cast"),
    createItem("tcon_sandcast_rod", "Tool Rod Sand Cast"),
    createItem("tcon_sandcast_rod2", "Tough Tool Rod Sand Cast"),
    createItem("tcon_sandcast_binding", "Binding Sand Cast"),
    createItem("tcon_sandcast_binding2", "Tough Binding Sand Cast"),
    createItem("tcon_sandcast_guard", "Wide Guard Sand Cast"),
    createItem("tcon_sandcast_largeplate", "Large Plate Sand Cast"),
    createItem("tcon_sandcast_ingot", "Ingot Sand Cast"),
    createItem("tcon_sandcast_nugget", "Nugget Sand Cast"),
    createItem("tcon_sandcast_gem", "Gem Sand Cast"),
    createItem("tcon_sandcast_plate", "Plate Sand Cast"),
    createItem("tcon_sandcast_gear", "Gear Sand Cast")
]);
Recipes2.addShapeless({ id: ItemID.tcon_sandcast_blank, count: 4 }, ["sand"]);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_pickaxe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_shovel, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_axe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_broadaxe, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_sword, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_hammer, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_excavator, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_rod, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_rod2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_binding, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_binding2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_guard, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_largeplate, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_ingot, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_nugget, MatValue.NUGGET);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_gem, MatValue.GEM);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_plate, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_gear, MatValue.INGOT * 4);
Item.addCreativeGroup("tcon_Sandcast", "Clay Cast", [
    createItem("tcon_claycast_pickaxe", "Pickaxe Head Clay Cast"),
    createItem("tcon_claycast_shovel", "Shovel Head Clay Cast"),
    createItem("tcon_claycast_axe", "Axe Head Clay Cast"),
    createItem("tcon_claycast_broadaxe", "Broad Axe Head Clay Cast"),
    createItem("tcon_claycast_sword", "Sword Blade Head Clay Cast"),
    createItem("tcon_claycast_hammer", "Hammer Head Clay Cast"),
    createItem("tcon_claycast_excavator", "Excavator Head Clay Cast"),
    createItem("tcon_claycast_rod", "Tool Rod Clay Cast"),
    createItem("tcon_claycast_rod2", "Tough Tool Rod Clay Cast"),
    createItem("tcon_claycast_binding", "Binding Clay Cast"),
    createItem("tcon_claycast_binding2", "Tough Binding Clay Cast"),
    createItem("tcon_claycast_guard", "Wide Guard Clay Cast"),
    createItem("tcon_claycast_largeplate", "Large Plate Clay Cast"),
    createItem("tcon_claycast_ingot", "Ingot Clay Cast"),
    createItem("tcon_claycast_nugget", "Nugget Clay Cast"),
    createItem("tcon_claycast_gem", "Gem Clay Cast"),
    createItem("tcon_claycast_plate", "Plate Clay Cast"),
    createItem("tcon_claycast_gear", "Gear Clay Cast")
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
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_ingot, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_nugget, MatValue.NUGGET);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_gem, MatValue.GEM);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_plate, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_gear, MatValue.INGOT * 4);
Item.addCreativeGroup("tcon_cast", "Cast", [
    createItem("tcon_cast_pickaxe", "Pickaxe Head Cast"),
    createItem("tcon_cast_shovel", "Shovel Head Cast"),
    createItem("tcon_cast_axe", "Axe Head Cast"),
    createItem("tcon_cast_broadaxe", "Broad Axe Head Cast"),
    createItem("tcon_cast_sword", "Sword Blade Head Cast"),
    createItem("tcon_cast_hammer", "Hammer Head Cast"),
    createItem("tcon_cast_excavator", "Excavator Head Cast"),
    createItem("tcon_cast_rod", "Tool Rod Cast"),
    createItem("tcon_cast_rod2", "Tough Tool Rod Cast"),
    createItem("tcon_cast_binding", "Binding Cast"),
    createItem("tcon_cast_binding2", "Tough Binding Cast"),
    createItem("tcon_cast_guard", "Wide Guard Cast"),
    createItem("tcon_cast_largeplate", "Large Plate Cast"),
    createItem("tcon_cast_ingot", "Ingot Cast"),
    createItem("tcon_cast_nugget", "Nugget Cast"),
    createItem("tcon_cast_gem", "Gem Cast"),
    createItem("tcon_cast_plate", "Plate Cast"),
    createItem("tcon_cast_gear", "Gear Cast")
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
        this.recipe = recipe.map(function (item) { return getIDData(item); });
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
    TinkersModifier.prototype.onDestroy = function (item, coords, block, player, level) {
    };
    TinkersModifier.prototype.onAttack = function (item, victim, player, level) {
        return 0;
    };
    TinkersModifier.prototype.onDealDamage = function (victim, player, damageValue, damageType, level) {
    };
    TinkersModifier.prototype.onKillEntity = function (victim, player, damageType, level) {
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
        return _super.call(this, "haste", "Haste", 0, ["redstone"], 50, true) || this;
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
        return _super.call(this, "luck", "Luck", 1, ["lapis_lazuli"], 360, false, ["silk"]) || this;
    }
    ModLuck.prototype.applyEnchant = function (enchant, level) {
        enchant.fortune = level < 60 ? 0 : level < 180 ? 1 : level < 360 ? 2 : 3;
    };
    return ModLuck;
}(TinkersModifier));
var ModSharp = /** @class */ (function (_super) {
    __extends(ModSharp, _super);
    function ModSharp() {
        return _super.call(this, "sharp", "Sharper", 2, ["quartz"], 72, true) || this;
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
        return _super.call(this, "diamond", "Diamond", 3, ["diamond"], 1, false) || this;
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
        return _super.call(this, "emerald", "Emerald", 4, ["emerald"], 1, false) || this;
    }
    ModEmerald.prototype.applyStats = function (stats, level) {
        stats.durability += stats.durability >> 1;
        stats.level = Math.min(stats.level + 1, TinkersMaterial.DIAMOND);
    };
    return ModEmerald;
}(TinkersModifier));
createItem("tcon_silky_cloth", "Silky Cloth");
createItem("tcon_silky_jewel", "Silky Jewel");
Recipes2.addShaped(ItemID.tcon_silky_cloth, "aaa:aba:aaa", { a: "string", b: "gold_ingot" });
Recipes2.addShaped(ItemID.tcon_silky_jewel, "_a_:aba:_a_", { a: ItemID.tcon_silky_cloth, b: "emerald" });
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
Recipes2.addShaped(ItemID.tcon_reinforcement, "aaa:aba:aaa", { a: "obsidian", b: ItemID.tcon_cast_largeplate });
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
var ModBeheading = /** @class */ (function (_super) {
    __extends(ModBeheading, _super);
    function ModBeheading() {
        return _super.call(this, "beheading", "Beheading", 7, ["ender_pearl", "obsidian"], 1, true) || this;
    }
    ModBeheading.prototype.onKillEntity = function (victim, player, damageType, level) {
        var headMeta = EntityHelper.getHeadMeta(victim);
        if (headMeta !== -1 && Math.random() * 10 < level) {
            var region = WorldRegion.getForActor(player);
            var pos = Entity.getPosition(victim);
            region.dropItem(pos, VanillaBlockID.skull, 1, headMeta);
        }
    };
    return ModBeheading;
}(TinkersModifier));
createBlock("tcon_graveyard_soil", [{ name: "Graveyard Soil" }], "dirt");
createBlock("tcon_consecrated_soil", [{ name: "Consecrated Soil" }], "dirt");
Recipes2.addShapeless(BlockID.tcon_graveyard_soil, ["dirt", "rotten_flesh", "bone_meal"]);
Recipes.addFurnace(BlockID.tcon_graveyard_soil, BlockID.tcon_consecrated_soil);
var ModSmite = /** @class */ (function (_super) {
    __extends(ModSmite, _super);
    function ModSmite() {
        return _super.call(this, "smite", "Smite", 8, [BlockID.tcon_consecrated_soil], 24, true) || this;
    }
    ModSmite.prototype.onAttack = function (item, victim, player, level) {
        return EntityHelper.isUndead(victim) ? 7 / this.max * level : 0;
    };
    return ModSmite;
}(TinkersModifier));
var ModSpider = /** @class */ (function (_super) {
    __extends(ModSpider, _super);
    function ModSpider() {
        return _super.call(this, "spider", "Bane of Arthropods", 9, ["fermented_spider_eye"], 24, true) || this;
    }
    ModSpider.prototype.onAttack = function (item, victim, player, level) {
        return EntityHelper.isArthropods(victim) ? 7 / this.max * level : 0;
    };
    return ModSpider;
}(TinkersModifier));
var ModFiery = /** @class */ (function (_super) {
    __extends(ModFiery, _super);
    function ModFiery() {
        return _super.call(this, "fiery", "Fiery", 10, ["blaze_powder"], 25, true) || this;
    }
    ModFiery.prototype.onAttack = function (item, victim, player, level) {
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
    ModNecrotic.prototype.onDealDamage = function (victim, player, damageValue, damageType, level) {
        var add = damageValue * 0.1 * level | 0;
        if (add > 0) {
            Entity.setHealth(player, Math.min(Entity.getHealth(player) + add, Entity.getMaxHealth(player)));
        }
    };
    return ModNecrotic;
}(TinkersModifier));
var ModKnockback = /** @class */ (function (_super) {
    __extends(ModKnockback, _super);
    function ModKnockback() {
        return _super.call(this, "knockback", "Knockback", 12, ["piston"], 10, true) || this;
    }
    ModKnockback.prototype.onAttack = function (item, victim, player, level) {
        var vec = Entity.getLookVector(player);
        var speed = 1 + level * 0.1;
        Entity.setVelocity(victim, vec.x * speed, vec.y, vec.z * speed);
        return 0;
    };
    return ModKnockback;
}(TinkersModifier));
createItem("tcon_moss", "Ball of Moss");
createItem("tcon_mending_moss", "Mending Moss");
Recipes2.addShapeless(ItemID.tcon_moss, [{ id: "mossy_cobblestone", count: 9 }]);
Item.registerUseFunction(ItemID.tcon_moss, function (coords, item, block) {
    if (block.id === VanillaBlockID.bookshelf) {
        if (Player.getLevel() < 10) {
            Game.tipMessage("Mending Moss requires at least 10 levels");
            return;
        }
        Player.addLevel(-10);
        Player.decreaseCarriedItem();
        Player.addItemToInventory(ItemID.tcon_mending_moss, 1, 0);
        //World.playSoundAtEntity(player, "random.orb", 1);
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
        return _super.call(this, "shulking", "Shulking", 14, ["chorus_fruit_popped"], 50, false) || this;
    }
    ModShulking.prototype.onAttack = function (item, victim, player, level) {
        Entity.addEffect(victim, EPotionEffect.LEVITATION, 0, (level >> 1) + 10);
        return 0;
    };
    return ModShulking;
}(TinkersModifier));
var ModWeb = /** @class */ (function (_super) {
    __extends(ModWeb, _super);
    function ModWeb() {
        return _super.call(this, "web", "Web", 15, ["web"], 1, true) || this;
    }
    ModWeb.prototype.onAttack = function (item, victim, player, level) {
        Entity.addEffect(victim, EPotionEffect.MOVEMENT_SLOWDOWN, 1, level * 20);
        return 0;
    };
    return ModWeb;
}(TinkersModifier));
// namespace TableWindow {
//     export const container = new UI.Container();
//     export const window = new UI.TabbedWindow({
//         isButtonHidden: true,
//         location: {x: 0, y: 0, width: ScreenHeight * 1.5, height: ScreenHeight},
//         elements: {}
//     });
//     const elemsPartBuilder: UI.ElementSet = {
//     };
//     for(let i = 0; i < 36; i++){
//         elemsPartBuilder["inv" + i] = {
//             type: "invSlot",
//             x: 50 + (i % 9) * 100,
//             y: i < 9 ? 620 : 200 + (i / 9 | 0) * 100,
//             size: 100,
//             index: i
//         }
//     }
//     window.setTab(0, {}, {
//         elements: elemsPartBuilder
//     });
//     window.setBlockingBackground(true);
//     window.setCloseOnBackPressed(true);
//     window.getWindowForTab(0).setInventoryNeeded(true);
// }
// Callback.addCallback("ItemUseLocal", (coords, item, block, player) => {
//     if(block.id === BlockID.tcon_partbuilder){
//         TableWindow.container.openAs(TableWindow.window);
//     }
// });
Item.addCreativeGroup("tcon_partbuilder", "Part Builder", [
    createBlock("tcon_partbuilder0", [{ name: "Part Builder", texture: [0, 0, ["log_side", 0]] }], "wood"),
    createBlock("tcon_partbuilder1", [{ name: "Part Builder", texture: [0, 0, ["log_side", 1]] }], "wood"),
    createBlock("tcon_partbuilder2", [{ name: "Part Builder", texture: [0, 0, ["log_side", 2]] }], "wood"),
    createBlock("tcon_partbuilder3", [{ name: "Part Builder", texture: [0, 0, ["log_side", 3]] }], "wood"),
    createBlock("tcon_partbuilder4", [{ name: "Part Builder", texture: [0, 0, ["log2", 0]] }], "wood"),
    createBlock("tcon_partbuilder5", [{ name: "Part Builder", texture: [0, 0, ["log2", 2]] }], "wood")
]);
BlockModel.register(BlockID.tcon_partbuilder0, function (model, index) {
    var tex = "log_side";
    var meta = 0;
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, tex, meta);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder1, function (model, index) {
    var tex = "log_side";
    var meta = 1;
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, tex, meta);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder2, function (model, index) {
    var tex = "log_side";
    var meta = 2;
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, tex, meta);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder3, function (model, index) {
    var tex = "log_side";
    var meta = 3;
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, tex, meta);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder4, function (model, index) {
    var tex = "log2";
    var meta = 0;
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, tex, meta);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder5, function (model, index) {
    var tex = "log2";
    var meta = 2;
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, tex, meta);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, tex, meta);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, tex, meta);
    return model;
});
Recipes2.addShaped(BlockID.tcon_partbuilder0, "a:b", { a: ItemID.tcon_pattern_blank, b: { id: "log", data: 1 } });
Recipes2.addShaped(BlockID.tcon_partbuilder1, "a:b", { a: ItemID.tcon_pattern_blank, b: { id: "log", data: 1 } });
Recipes2.addShaped(BlockID.tcon_partbuilder2, "a:b", { a: ItemID.tcon_pattern_blank, b: { id: "log", data: 2 } });
Recipes2.addShaped(BlockID.tcon_partbuilder3, "a:b", { a: ItemID.tcon_pattern_blank, b: { id: "log", data: 3 } });
Recipes2.addShaped(BlockID.tcon_partbuilder4, "a:b", { a: ItemID.tcon_pattern_blank, b: { id: "log2", data: 0 } });
Recipes2.addShaped(BlockID.tcon_partbuilder5, "a:b", { a: ItemID.tcon_pattern_blank, b: { id: "log2", data: 1 } });
var PartBuilderWindow = new /** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = this;
        var elements = {
            slotPattern: { type: "slot", x: 8, y: 136 - 36, bitmap: "tcon.slot.pattern", size: 72, isValid: function (id) { return id === ItemID.tcon_pattern_blank; } },
            slotMaterial: { type: "slot", x: 80, y: 136 - 36, size: 72 },
            slotResult: { type: "slot", x: 440, y: 136 - 52, size: 104, visual: true, clicker: { onClick: function () { return _this.onCraft(); } } },
            cursor: { type: "image", x: 0, y: 2000, z: 1, width: 64, height: 64, bitmap: "_selection" },
            textCost: { type: "text", x: 288, y: 300, font: { size: 24, color: Color.GRAY, alignment: UI.Font.ALIGN_CENTER } },
            textTitle: { type: "text", x: 780, y: 4, font: { size: 32, color: Color.YELLOW, bold: true, alignment: UI.Font.ALIGN_CENTER }, text: "Title" },
            textStats: { type: "text", x: 608, y: 64, font: { size: 24, color: Color.WHITE }, multiline: true, text: "Description" },
            btnR: { type: "button", x: 440 + 104 - 36, y: 136 + 52 + 24, bitmap: "classic_button_up", bitmap2: "classic_button_down", scale: 2, clicker: { onClick: function () { return RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("tcon_partbuilder"); } } },
            textR: { type: "text", x: 440 + 104 - 22, y: 136 + 52 + 18, z: 1, text: "R", font: { color: Color.WHITE, size: 20, shadow: 0.5, align: UI.Font.ALIGN_CENTER } }
        };
        var _loop_1 = function (i) {
            elements["btn" + i] = {
                type: "button",
                x: (i % 4) * 64 + 160,
                y: (i / 4 | 0) * 64 + 8,
                bitmap: "tcon.pattern." + PartRegistry.types[i].key,
                scale: 4,
                clicker: { onClick: function () {
                        _this.selectedPattern = i;
                    } }
            };
        };
        for (var i = 0; i < PartRegistry.types.length; i++) {
            _loop_1(i);
        }
        var window = new UI.StandardWindow({
            standard: {
                header: { text: { text: "Part Builder" }, height: 60 },
                inventory: { standard: true },
                background: { standard: true }
            },
            drawing: [
                { type: "frame", x: 580, y: 0, width: 400, height: 480, bitmap: "tcon.frame", scale: 4 }
            ],
            elements: elements
        });
        window.setCloseOnBackPressed(true);
        _this = _super.call(this, window) || this;
        _this.selectedPattern = -1;
        _this.tutorialMessage = addLineBreaks(18, "Here you can craft tool parts to fulfill your tinkering fantasies") + "\n\n" + addLineBreaks(18, "To craft a part simply put its pattern into the left slot. The two right slot hold the material you want to craft your part out of.");
        return _this;
    }
    class_1.prototype.onUpdate = function (elements) {
        var patternData = PartRegistry.types[this.selectedPattern];
        var slotPattern = this.container.getSlot("slotPattern");
        var slotMaterial = this.container.getSlot("slotMaterial");
        var item;
        var statsHead;
        var statsHandle;
        var statsExtra;
        var resultId = 0;
        var textCost = "";
        var textTitle = "";
        var textStats = "";
        if (slotPattern.id === ItemID.tcon_pattern_blank && patternData) {
            for (var key in Material) {
                item = Material[key].getItem();
                if (item && item.id === slotMaterial.id && (item.data === -1 || item.data === slotMaterial.data)) {
                    statsHead = Material[key].getHeadStats();
                    statsHandle = Material[key].getHandleStats();
                    statsExtra = Material[key].getExtraStats();
                    textTitle = Material[key].getName();
                    textStats = "Head\n" +
                        "Durability: " + statsHead.durability + "\n" +
                        "Mining Level: " + TinkersMaterial.level[statsHead.level] + "\n" +
                        "Mining Speed: " + statsHead.speed + "\n" +
                        "Attack" + statsHead.attack + "\n" +
                        "\n" +
                        "Handle\n" +
                        "Modifier: " + statsHandle.modifier + "\n" +
                        "Durability: " + statsHandle.durability + "\n" +
                        "\n" +
                        "Extra\n" +
                        "Durability: " + statsExtra.durability;
                    if (!Material[key].isMetal) {
                        textCost = "Material Value:  ".concat(slotMaterial.count, " / ").concat(patternData.cost);
                        if (slotMaterial.count >= patternData.cost) {
                            resultId = PartRegistry.getIDFromData(patternData.key, key);
                        }
                    }
                    break;
                }
            }
        }
        if (this.selectedPattern === -1) {
            elements.get("cursor").setPosition(0, 2000);
        }
        else {
            var selectedElem = elements.get("btn" + this.selectedPattern);
            elements.get("cursor").setPosition(selectedElem.x, selectedElem.y);
        }
        elements.get("slotResult").setBinding("source", resultId === 0 ? { id: 0, count: 0, data: 0 } : { id: resultId, count: 1, data: 0 });
        this.container.setText("textCost", textCost);
        this.container.setText("textTitle", textTitle || "Part Builder");
        this.container.setText("textStats", textStats || this.tutorialMessage);
    };
    class_1.prototype.onCraft = function () {
        var patternData = PartRegistry.types[this.selectedPattern];
        var slotPattern = this.container.getSlot("slotPattern");
        var slotMaterial = this.container.getSlot("slotMaterial");
        var item;
        var cost = 0;
        var resultId = 0;
        if (slotPattern.id === ItemID.tcon_pattern_blank && patternData) {
            cost = patternData.cost;
            for (var key in Material) {
                item = Material[key].getItem();
                if (item && item.id === slotMaterial.id && (item.data === -1 || item.data === slotMaterial.data)) {
                    if (!Material[key].isMetal) {
                        if (slotMaterial.count >= cost) {
                            resultId = PartRegistry.getIDFromData(patternData.key, key);
                        }
                    }
                    break;
                }
            }
        }
        if (resultId !== 0) {
            Player.addItemToInventory(resultId, 1, 0);
            slotPattern.count--;
            slotMaterial.count -= cost;
            this.container.validateAll();
        }
    };
    return class_1;
}(CraftingWindow));
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder0);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder1);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder2);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder3);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder4);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder5);
var ToolForgeHandler = /** @class */ (function () {
    function ToolForgeHandler() {
    }
    ToolForgeHandler.addLayout = function (layout) {
        this.layouts.push(layout);
    };
    ToolForgeHandler.getLayoutList = function (isForge) {
        return this.layouts.filter(function (layout) { return isForge || !layout.forgeOnly; });
    };
    ToolForgeHandler.addRecipe = function (result, pattern) {
        this.recipes.push({ result: result, pattern: pattern });
    };
    ToolForgeHandler.getRecipes = function (isForge) {
        return this.recipes.filter(function (recipe) { return isForge || recipe.pattern.length <= 3; });
    };
    ToolForgeHandler.isTool = function (id) {
        return this.recipes.some(function (recipe) { return recipe.result === id; });
    };
    ToolForgeHandler.createForgeBlock = function (namedID, block) {
        var id = createBlock(namedID, [{ name: "Tool Forge", texture: [["tcon_toolforge", 0]] }]);
        Item.addCreativeGroup("tcon_toolforge", "Tool Forge", [id]);
        Recipes2.addShaped(id, "aaa:bcb:b_b", { a: BlockID.tcon_stone, b: block, c: BlockID.tcon_toolstation });
        BlockModel.register(id, function (model, index) {
            var block2 = getIDData(block);
            model.addBox(0 / 16, 15 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, "tcon_toolforge", 0);
            model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 15 / 16, 16 / 16, block2.id, block2.data);
            model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, block2.id, block2.data);
            model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, block2.id, block2.data);
            model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, block2.id, block2.data);
            model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, block2.id, block2.data);
            return model;
        });
        return id;
    };
    ToolForgeHandler.layouts = [];
    ToolForgeHandler.recipes = [];
    return ToolForgeHandler;
}());
var RepairHandler = /** @class */ (function () {
    function RepairHandler() {
    }
    RepairHandler.calcRepairAmount = function (material) {
        var item;
        for (var key in Material) {
            item = Material[key].getItem();
            if (item.id === material.id && (item.data === -1 || item.data === material.data)) {
                return Material[key].getHeadStats().durability * this.value;
            }
        }
        return 0;
    };
    RepairHandler.calcRepair = function (toolStack, amount) {
        var origDur = toolStack.getBaseStats().durability;
        var actDur = toolStack.stats.durability;
        var modCount = TinkersModifierHandler.decodeToArray(toolStack.extra.getString("modifiers")).length;
        var increase = Math.max(Math.min(10, actDur / origDur) * amount, actDur / 64);
        increase *= 1 - Math.min(3, modCount) * 0.05;
        increase *= Math.max(0.5, 1 - toolStack.repairCount * 0.005);
        return Math.ceil(increase);
    };
    RepairHandler.value = MatValue.SHARD * 4 / MatValue.INGOT | 0;
    return RepairHandler;
}());
ToolForgeHandler.addLayout({
    title: "Repair & Modify",
    background: "tcon.icon.repair",
    intro: "",
    slots: [
        { x: 0, y: 0, bitmap: "tcon.slot.tool" },
        { x: -18, y: 20, bitmap: "tcon.slot.lapis" },
        { x: -22, y: -5, bitmap: "tcon.slot.dust" },
        { x: 0, y: -23, bitmap: "tcon.slot.ingot" },
        { x: 22, y: -5, bitmap: "tcon.slot.diamond" },
        { x: 18, y: 20, bitmap: "tcon.slot.quartz" }
    ]
});
var ToolCrafterWindow = /** @class */ (function (_super) {
    __extends(ToolCrafterWindow, _super);
    function ToolCrafterWindow(name, isForge) {
        var _this = this;
        var window = new UI.StandardWindow({
            standard: {
                header: { text: { text: name }, height: 60 },
                inventory: { standard: true },
                background: { standard: true }
            },
            drawing: [
                { type: "frame", x: 580, y: 0, width: 400, height: 240, bitmap: "tcon.frame", scale: 4 },
                { type: "frame", x: 580, y: 260, width: 400, height: 240, bitmap: "tcon.frame", scale: 4 }
            ],
            elements: {
                bgImage: { type: "image", x: 50, y: 95, bitmap: "tcon.icon.repair", scale: 18.75 },
                slot0: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot1: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot2: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot3: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot4: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slot5: { type: "slot", x: 0, y: 0, z: 1, size: 80 },
                slotResult: { type: "slot", x: 420, y: 190, size: 120, visual: true, clicker: {
                        onClick: function () { return _this.onCraft(); }
                    } },
                buttonPrev: { type: "button", x: 50, y: 452, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                        onClick: function () { return _this.turnPage(-1); }
                    } },
                buttonNext: { type: "button", x: 254, y: 452, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                        onClick: function () { return _this.turnPage(1); }
                    } }
            }
        });
        window.addWindow("stats", {
            location: { x: 722, y: 90, width: 400 * 0.64 - 20, height: 240 * 0.64 - 20, scrollY: 250 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT }
            ],
            elements: {
                textTitle: { type: "text", x: 500, y: -30, font: { size: 80, color: Color.YELLOW, shadow: 0.5, alignment: UI.Font.ALIGN_CENTER, bold: true } },
                textStats: { type: "text", x: 20, y: 120, font: { size: 72, color: Color.WHITE, shadow: 0.5 }, multiline: true }
            }
        });
        window.addWindow("modifiers", {
            location: { x: 722, y: 257, width: 400 * 0.64 - 20, height: 240 * 0.64 - 20, scrollY: 250 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "text", x: 500, y: 50, font: { size: 80, color: Color.YELLOW, shadow: 0.5, alignment: UI.Font.ALIGN_CENTER, bold: true }, text: "Modifiers" }
            ],
            elements: {
                textModifiers: { type: "text", x: 20, y: 120, font: { size: 72, color: Color.WHITE, shadow: 0.5 }, multiline: true }
            }
        });
        _this = _super.call(this, window) || this;
        _this.page = 0;
        _this.isForge = !!isForge;
        //width 640
        var windowMain = window.getWindow("content");
        _this.winContent = windowMain.getContent();
        return _this;
    }
    ToolCrafterWindow.prototype.onOpen = function (window) {
        _super.prototype.onOpen.call(this, window);
        this.turnPage(0);
    };
    ToolCrafterWindow.prototype.onClose = function (window) {
        this.container.clearSlot("slotResult");
        _super.prototype.onClose.call(this, window);
    };
    ToolCrafterWindow.prototype.onUpdate = function (elements) {
        var _this = this;
        var consume = [];
        var slotTool = this.container.getSlot("slot0");
        if (ToolForgeHandler.isTool(slotTool.id) && slotTool.extra) {
            var slots = [];
            var items_1 = [];
            var slot_1;
            var find = void 0;
            for (var i = 1; i < 6; i++) {
                slot_1 = this.container.getSlot("slot" + i);
                slots[i] = { id: slot_1.id, count: slot_1.count, data: slot_1.data };
                if (slot_1.id === 0) {
                    continue;
                }
                find = items_1.find(function (item) { return item.id === slot_1.id && item.data === slot_1.data; });
                find ? find.count += slot_1.count : items_1.push({ id: slot_1.id, count: slot_1.count, data: slot_1.data });
            }
            var addMod_1 = {};
            var count = 0;
            for (var key in Modifier) {
                count = Math.min.apply(Math, Modifier[key].getRecipe().map(function (recipe) {
                    var find2 = items_1.find(function (item) { return item.id === recipe.id && (recipe.data === -1 || item.data === recipe.data); });
                    return find2 ? find2.count : 0;
                }));
                if (count > 0) {
                    addMod_1[key] = count;
                }
            }
            var stack_1 = new TconToolStack(slotTool);
            var modifiers = TinkersModifierHandler.decodeToArray(stack_1.extra.getString("modifiers"));
            var find3 = void 0;
            var _loop_2 = function (key) {
                find3 = modifiers.find(function (mod) { return mod.type === key; });
                if (find3 && find3.level < Modifier[key].max) {
                    addMod_1[key] = Math.min(addMod_1[key], Modifier[key].max - find3.level);
                    find3.level += addMod_1[key];
                    return "continue";
                }
                if (Modifier[key].canBeTogether(modifiers) && modifiers.length < Cfg.modifierSlots + ToolLeveling.getLevel(stack_1.xp, stack_1.instance.is3x3)) {
                    addMod_1[key] = Math.min(addMod_1[key], Modifier[key].max);
                    modifiers.push({ type: key, level: addMod_1[key] });
                }
                else {
                    delete addMod_1[key];
                }
            };
            for (var key in addMod_1) {
                _loop_2(key);
            }
            var mat_1 = stack_1.instance.repairParts.map(function (index) { return Material[stack_1.materials[index]].getItem(); });
            var space = stack_1.durability;
            var newDur = space;
            var value = 0;
            find = null;
            count = 0;
            var _loop_3 = function (i) {
                find = items_1.find(function (item) { return item.id === mat_1[i].id && (mat_1[i].data === -1 || item.data === mat_1[i].data); });
                if (find) {
                    value = RepairHandler.calcRepairAmount(find);
                    if (value > 0) {
                        value *= stack_1.instance.getRepairModifierForPart(i);
                        while (count < find.count && RepairHandler.calcRepair(stack_1, value * count) < space) {
                            count++;
                        }
                        newDur = Math.max(0, space - (RepairHandler.calcRepair(stack_1, value * count) | 0));
                        return "break";
                    }
                }
            };
            for (var i = 0; i < mat_1.length; i++) {
                var state_1 = _loop_3(i);
                if (state_1 === "break")
                    break;
            }
            items_1.length = 0;
            var _loop_4 = function (key) {
                items_1.push.apply(items_1, Modifier[key].getRecipe().map(function (item) { return ({ id: item.id, count: addMod_1[key], data: item.data }); }));
            };
            for (var key in addMod_1) {
                _loop_4(key);
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
                var result = stack_1.clone();
                result.durability = newDur;
                result.extra.putInt("repair", stack_1.repairCount + 1);
                result.extra.putString("modifiers", TinkersModifierHandler.encodeToString(modifiers));
                this.container.setSlot("slotResult", result.id, result.count, result.data, result.extra);
                // const extra = stack.extra.copy();
                // extra.putInt("durability", newDur);
                // extra.putInt("repair", stack.repairCount + 1);
                // extra.putString("modifiers", TinkersModifierHandler.encodeToString(modifiers));
                // this.container.setSlot("slotResult", stack.id, 1, Math.ceil(newDur / stack.stats.durability * stack.instance.maxDamage), extra);
            }
            else {
                this.container.clearSlot("slotResult");
            }
        }
        else {
            var result = ToolForgeHandler.getRecipes(this.isForge).find(function (recipe) {
                var slot;
                var partData;
                for (var i = 0; i < 6; i++) {
                    slot = _this.container.getSlot("slot" + i);
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
                    slot = this.container.getSlot("slot" + i);
                    partData = PartRegistry.getPartData(slot.id);
                    partData ? materials.push(partData.material) : alert("part error: " + slot.id);
                    consume[i] = 1;
                }
                var extra = new ItemExtraData()
                    .putInt("durability", 0)
                    .putInt("xp", 0)
                    .putInt("repair", 0)
                    .putString("materials", materials.join("_"))
                    .putString("modifiers", "");
                this.container.setSlot("slotResult", result.result, 1, 0, extra);
            }
            else {
                this.container.clearSlot("slotResult");
            }
        }
        var slotResult = this.container.getSlot("slotResult");
        if (ToolForgeHandler.isTool(slotResult.id) && slotResult.extra) {
            this.showInfo(slotResult);
        }
        else if (ToolForgeHandler.isTool(slotTool.id) && slotTool.extra) {
            this.showInfo(slotTool);
        }
        else {
            var layout = ToolForgeHandler.getLayoutList(this.isForge)[this.page];
            this.container.setText("textStats", addLineBreaks(16, layout.intro));
            this.container.setText("textModifiers", "       .\n     /( _________\n     |  >:=========`\n     )(  \n     \"\"");
        }
        this.consume = consume;
    };
    ToolCrafterWindow.prototype.onCraft = function () {
        if (this.container.getSlot("slotResult").id !== 0) {
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
                    slot = this.container.getSlot("slot" + i);
                    slot.count -= this.consume[i] || 0;
                    this.container.validateSlot("slot" + i);
                }
                slot = this.container.getSlot("slotResult");
                Player.setInventorySlot(index, slot.id, 1, slot.data, slot.extra);
                this.isForge ?
                    SoundManager.playSound("random.anvil_use", 1, 0.95 + 0.2 * Math.random()) :
                    SoundManager.playSound("tcon.little_saw.ogg");
            }
            catch (e) {
                alert("craftError: " + e);
            }
        }
    };
    ToolCrafterWindow.prototype.turnPage = function (page) {
        var layouts = ToolForgeHandler.getLayoutList(this.isForge);
        this.page += page;
        this.page = this.page < 0 ? layouts.length - 1 : this.page >= layouts.length ? 0 : this.page;
        var centerX = 160;
        var centerY = 210;
        var scale = 5;
        var layout = layouts[this.page];
        var slot;
        for (var i = 0; i < 6; i++) {
            slot = this.winContent.elements["slot" + i];
            if (layout.slots[i]) {
                slot.x = layout.slots[i].x * scale + centerX;
                slot.y = layout.slots[i].y * scale + centerY;
                slot.bitmap = layout.slots[i].bitmap;
            }
            else {
                slot.y = 2000;
            }
        }
        this.container.setText("textTitle", layout.title);
        this.container.setText("textStats", addLineBreaks(16, layout.intro));
        this.winContent.elements.bgImage.bitmap = layout.background;
    };
    ToolCrafterWindow.prototype.showInfo = function (item) {
        var stack = new TconToolStack(item);
        var modifiers = TinkersModifierHandler.decodeToArray(item.extra.getString("modifiers"));
        this.container.setText("textStats", "Durability: " + (stack.stats.durability - item.extra.getInt("durability")) + "/" + stack.stats.durability + "\n" +
            "Mining Level: " + TinkersMaterial.level[stack.stats.level] + "\n" +
            "Mining Speed: " + ((stack.stats.efficiency * 100 | 0) / 100) + "\n" +
            "Attack: " + ((stack.stats.damage * 100 | 0) / 100) + "\n" +
            "Modifiers: " + (Cfg.modifierSlots + ToolLeveling.getLevel(stack.xp, stack.instance.is3x3) - modifiers.length));
        this.container.setText("textModifiers", modifiers.map(function (mod) {
            return "".concat(Modifier[mod.type].getName(), " (").concat(mod.level, "/").concat(Modifier[mod.type].max, ")");
        }).join("\n"));
    };
    return ToolCrafterWindow;
}(CraftingWindow));
createBlock("tcon_toolstation", [{ name: "Tool Station" }], "wood");
Recipes2.addShaped(BlockID.tcon_toolstation, "a:b", { a: ItemID.tcon_pattern_blank, b: "crafting_table" });
BlockModel.register(BlockID.tcon_toolstation, function (model, index) {
    model.addBox(0 / 16, 12 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, [["tcon_toolstation", 0], ["tcon_toolstation", 0], ["tcon_table_side", 0]]);
    model.addBox(0 / 16, 0 / 16, 0 / 16, 4 / 16, 12 / 16, 4 / 16, "tcon_table_side", 0);
    model.addBox(12 / 16, 0 / 16, 0 / 16, 16 / 16, 12 / 16, 4 / 16, "tcon_table_side", 0);
    model.addBox(12 / 16, 0 / 16, 12 / 16, 16 / 16, 12 / 16, 16 / 16, "tcon_table_side", 0);
    model.addBox(0 / 16, 0 / 16, 12 / 16, 4 / 16, 12 / 16, 16 / 16, "tcon_table_side", 0);
    return model;
});
ToolForgeHandler.createForgeBlock("tcon_toolforge_iron", "iron_block");
ToolForgeHandler.createForgeBlock("tcon_toolforge_gold", "gold_block");
ToolForgeHandler.createForgeBlock("tcon_toolforge_cobalt", BlockID.blockCobalt);
ToolForgeHandler.createForgeBlock("tcon_toolforge_ardite", BlockID.blockArdite);
ToolForgeHandler.createForgeBlock("tcon_toolforge_manyullyn", BlockID.blockManyullyn);
ToolForgeHandler.createForgeBlock("tcon_toolforge_pigiron", BlockID.blockPigiron);
ToolForgeHandler.createForgeBlock("tcon_toolforge_alubrass", BlockID.blockAlubrass);
(function () {
    var winStation = new ToolCrafterWindow("Tool Station", false);
    var winForge = new ToolCrafterWindow("Tool Forge", true);
    winStation.addTargetBlock(BlockID.tcon_toolstation);
    winForge.addTargetBlock(BlockID.tcon_toolforge_iron);
    winForge.addTargetBlock(BlockID.tcon_toolforge_gold);
    winForge.addTargetBlock(BlockID.tcon_toolforge_cobalt);
    winForge.addTargetBlock(BlockID.tcon_toolforge_ardite);
    winForge.addTargetBlock(BlockID.tcon_toolforge_manyullyn);
    winForge.addTargetBlock(BlockID.tcon_toolforge_pigiron);
    winForge.addTargetBlock(BlockID.tcon_toolforge_alubrass);
})();
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
var TconTool = /** @class */ (function (_super) {
    __extends(TconTool, _super);
    function TconTool(stringID, name, icon) {
        if (icon === void 0) { icon = stringID; }
        var _this = _super.call(this, stringID, name, icon, true) || this;
        _this.isWeapon = false;
        _this.is3x3 = false;
        _this.miningSpeedModifier = 1.0;
        _this.damagePotential = 1.0;
        _this.repairParts = [1]; //head
        _this.setHandEquipped(true);
        _this.setMaxStack(1);
        _this.setMaxDamage(13);
        for (var i = 0; i <= _this.maxDamage; i++) {
            ItemModel.getFor(_this.id, i).setModelOverrideCallback(function (item) { return ToolModelManager.getModel(item); });
        }
        return _this;
    }
    TconTool.prototype.setToolParams = function () {
        ToolAPI.registerTool(this.id, { durability: this.maxDamage }, this.blockTypes || [], this);
    };
    TconTool.prototype.buildStats = function (stats, materials) {
    };
    TconTool.prototype.getRepairModifierForPart = function (index) {
        return 1.0;
    };
    TconTool.prototype.onNameOverride = function (item, translation, name) {
        if (item.extra) {
            var stack = new TconToolStack(item);
            var head = Material[stack.materials[1]].getName();
            if (stack.isBroken()) {
                return "Broken ".concat(head, " ").concat(name);
            }
            var lvInfo = ToolLeveling.getLevelInfo(stack.xp, this.is3x3);
            return "".concat(head, " ").concat(name, "\n") +
                "\u00A77".concat(stack.stats.durability - stack.durability, " / ").concat(stack.stats.durability, "\n") +
                "Level: ".concat(ToolLeveling.getLevelName(lvInfo.level), "\n") +
                "XP: ".concat(lvInfo.currentXp, " / ").concat(lvInfo.next);
        }
        return name;
    };
    TconTool.prototype.onBroke = function (item) {
        return true;
    };
    TconTool.prototype.modifyEnchant = function (enchant, item, coords, block) {
        if (item.extra) {
            var stack = new TconToolStack(item);
            stack.forEachModifiers(function (mod, level) {
                mod.applyEnchant(enchant, level);
            });
        }
    };
    TconTool.prototype.calcDestroyTime = function (item, coords, block, time, defaultTime) {
        if (!item.extra) {
            return time.base;
        }
        var stack = new TconToolStack(item);
        var blockData = ToolAPI.getBlockData(block.id);
        var devider = 1;
        if (this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()) {
            devider = stack.stats.efficiency;
            if (blockData.isNative) {
                devider *= blockData.material.multiplier;
            }
            this.toolMaterial.level = stack.stats.level;
        }
        else {
            this.toolMaterial.level = 0;
        }
        return time.base / devider / time.modifier;
    };
    TconTool.prototype.onDestroy = function (item, coords, block, player) {
        if (!item.extra) {
            return true;
        }
        var stack = new TconToolStack(item);
        var blockData = ToolAPI.getBlockData(block.id);
        if (blockData && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()) {
            stack.forEachModifiers(function (mod, level) {
                mod.onDestroy(item, coords, block, player, level);
            });
            if (this.isWeapon) {
                stack.consumeDurability(2);
            }
            else {
                stack.consumeDurability(1);
                stack.addXp(1);
            }
            item.data = stack.data; //setCarriedItem in ToolAPI.destroyBlockHook
        }
        return true;
    };
    TconTool.prototype.onAttack = function (item, victim, player) {
        if (!item.extra) {
            return true;
        }
        var stack = new TconToolStack(item);
        var bonus = 0;
        stack.forEachModifiers(function (mod, level) {
            bonus += mod.onAttack(item, victim, player, level);
        });
        this.toolMaterial.damage = stack.stats.damage + bonus;
        if (this.isWeapon) {
            stack.consumeDurability(1);
            stack.addXp(1);
        }
        else {
            stack.consumeDurability(2);
        }
        item.data = stack.data; //setCarriedItem in ToolAPI.playerAttackHook
        return true;
    };
    TconTool.prototype.onDealDamage = function (item, victim, player, damageValue, damageType) {
        if (!item.extra) {
            return;
        }
        var stack = new TconToolStack(item);
        stack.forEachModifiers(function (mod, level) {
            mod.onDealDamage(victim, player, damageValue, damageType, level);
        });
    };
    TconTool.prototype.onKillEntity = function (item, victim, player, damageType) {
        if (!item.extra) {
            return;
        }
        var stack = new TconToolStack(item);
        stack.forEachModifiers(function (mod, level) {
            mod.onKillEntity(victim, player, damageType, level);
        });
    };
    TconTool.prototype.onItemUse = function (coords, item, block, player) {
    };
    TconTool.prototype.onMending = function (item, player) {
        if (!item.extra) {
            return;
        }
        var stack = new TconToolStack(item);
        var add = 0;
        stack.forEachModifiers(function (mod, level) {
            add += mod.onMending(level);
        });
        if (add > 0) {
            stack.durability -= add;
            stack.applyToHand(player);
        }
    };
    return TconTool;
}(ItemCommon));
var TconTool3x3 = /** @class */ (function (_super) {
    __extends(TconTool3x3, _super);
    function TconTool3x3(stringID, name, icon) {
        var _this = _super.call(this, stringID, name, icon) || this;
        _this.is3x3 = true;
        return _this;
    }
    TconTool3x3.prototype.onDestroy = function (item, coords, block, player) {
        if (!item.extra) {
            return true;
        }
        var stack = new TconToolStack(item);
        if (stack.isBroken()) {
            return true;
        }
        var region = WorldRegion.getForActor(player);
        var pos = new Vector3(0, 0, 0);
        var radius = { x: 1, y: 1, z: 1 };
        switch (coords.side >> 1) {
            case 0:
                radius.y = 0;
                break;
            case 1:
                radius.z = 0;
                break;
            case 2:
                radius.x = 0;
                break;
        }
        var blockData;
        var block2;
        var consume = 0;
        for (var x = -radius.x; x <= radius.x; x++) {
            for (var y = -radius.y; y <= radius.y; y++) {
                for (var z = -radius.z; z <= radius.z; z++) {
                    if (x === 0 && y === 0 && z === 0)
                        continue;
                    pos.set(coords);
                    pos.add(x, y, z);
                    block2 = region.getBlock(pos);
                    blockData = ToolAPI.getBlockData(block2.id);
                    if (blockData && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level) {
                        region.destroyBlock(pos, true, player);
                        consume++;
                        stack.forEachModifiers(function (mod, level) {
                            mod.onDestroy(item, { x: pos.x, y: pos.y, z: pos.z, side: coords.side, relative: World.getRelativeCoords(pos.x, pos.y, pos.z, coords.side) }, block2, player, level);
                        });
                    }
                }
            }
        }
        blockData = ToolAPI.getBlockData(block.id);
        if (blockData && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level) {
            consume++;
            stack.forEachModifiers(function (mod, level) {
                mod.onDestroy(item, coords, block, player, level);
            });
        }
        stack.consumeDurability(consume);
        stack.addXp(consume);
        item.data = stack.data;
        return true;
    };
    return TconTool3x3;
}(TconTool));
Callback.addCallback("EntityHurt", function (attacker, victim, damageValue, damageType) {
    if (EntityHelper.isPlayer(attacker)) {
        var item = Entity.getCarriedItem(attacker);
        var tool = ToolAPI.getToolData(item.id);
        tool === null || tool === void 0 ? void 0 : tool.onDealDamage(item, victim, attacker, damageValue, damageType);
    }
});
Callback.addCallback("EntityDeath", function (entity, attacker, damageType) {
    if (EntityHelper.isPlayer(attacker)) {
        var item = Entity.getCarriedItem(attacker);
        var tool = ToolAPI.getToolData(item.id);
        tool === null || tool === void 0 ? void 0 : tool.onKillEntity(item, entity, attacker, damageType);
    }
});
Callback.addCallback("LocalTick", function () {
    if (World.getThreadTime() % 150 === 0) {
        var item = Player.getCarriedItem();
        var tool = ToolAPI.getToolData(item.id);
        tool === null || tool === void 0 ? void 0 : tool.onMending(item, Player.get());
    }
});
var ToolModelManager = /** @class */ (function () {
    function ToolModelManager() {
    }
    ToolModelManager.getModel = function (item) {
        if (!item.extra) {
            return null;
        }
        try {
            var stack = new TconToolStack(item);
            var suffix = stack.isBroken() ? "broken" : "normal";
            var texture = stack.instance.texture;
            var uniqueKey = stack.uniqueKey();
            if (this.models[uniqueKey]) {
                return this.models[uniqueKey][suffix];
            }
            var mesh = [ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool()];
            var coordsNormal_1 = [];
            var coordsBroken_1 = [];
            var index = 0;
            for (var i = 0; i < texture.partsCount; i++) {
                index = Material[stack.materials[i]].getTexIndex();
                coordsNormal_1.push(texture.getCoords(i, index));
                coordsBroken_1.push(texture.getCoords(i === texture.brokenIndex ? texture.partsCount : i, index));
            }
            for (var key in stack.modifiers) {
                index = Modifier[key].getTexIndex();
                coordsNormal_1.push(texture.getModCoords(index));
                coordsBroken_1.push(texture.getModCoords(index));
            }
            mesh.forEach(function (m, i) {
                var coords = i >> 1 ? coordsBroken_1 : coordsNormal_1;
                var size = 1 / 16;
                var x = 0;
                var y = 0;
                var z = 0;
                for (var j = 0; j < coords.length; j++) {
                    x = coords[j].x;
                    y = coords[j].y;
                    z = (i & 1 ? j : (coords.length - j)) * 0.001;
                    m.setColor(1, 1, 1);
                    m.setNormal(1, 1, 0);
                    m.addVertex(0, 1, z, x, y);
                    m.addVertex(1, 1, z, x + size, y);
                    m.addVertex(0, 0, z, x, y + size);
                    m.addVertex(1, 1, z, x + size, y);
                    m.addVertex(0, 0, z, x, y + size);
                    m.addVertex(1, 0, z, x + size, y + size);
                }
                if ((i & 1) === 0) { //hand
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
            var path = texture.getPath();
            modelNormal.setModel(data.normal.hand, path)
                .setUiModel(data.normal.ui, path)
                .setSpriteUiRender(true)
                .setModUiSpriteName(stack.instance.icon.name, stack.instance.icon.meta);
            modelBroken.setModel(data.broken.hand, path)
                .setUiModel(data.broken.ui, path)
                .setSpriteUiRender(true)
                .setModUiSpriteName(stack.instance.icon.name, stack.instance.icon.meta);
            this.models[uniqueKey] = { normal: modelNormal, broken: modelBroken };
            return this.models[uniqueKey][suffix];
        }
        catch (e) {
            alert("toolModel: " + e);
            return null;
        }
    };
    ToolModelManager.models = {};
    return ToolModelManager;
}());
var TconPickaxe = /** @class */ (function (_super) {
    __extends(TconPickaxe, _super);
    function TconPickaxe() {
        var _this = _super.call(this, "tcontool_pickaxe", "Pickaxe") || this;
        _this.blockTypes = ["stone"];
        _this.texture = new ToolTexture("model/tcontool_pickaxe", 3, 1);
        _this.setToolParams();
        return _this;
    }
    TconPickaxe.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1])
            .extra(materials[2])
            .handle(materials[0]);
    };
    return TconPickaxe;
}(TconTool));
ItemRegistry.registerItem(new TconPickaxe());
ToolForgeHandler.addRecipe(ItemID.tcontool_pickaxe, ["rod", "pickaxe", "binding"]);
ToolForgeHandler.addLayout({
    title: "Pickaxe",
    background: "tcon.icon.pickaxe",
    intro: "The Pickaxe is a precise mining tool. It is effective on stone and ores. It breaks blocks, OK?",
    slots: [
        { x: -18, y: 18, bitmap: "tcon.slot.rod" },
        { x: 20, y: -20, bitmap: "tcon.slot.pickaxe" },
        { x: 0, y: 0, bitmap: "tcon.slot.binding" }
    ]
});
var TconShovel = /** @class */ (function (_super) {
    __extends(TconShovel, _super);
    function TconShovel() {
        var _this = _super.call(this, "tcontool_shovel", "Shovel") || this;
        _this.blockTypes = ["dirt"];
        _this.texture = new ToolTexture("model/tcontool_shovel", 3, 1);
        _this.damagePotential = 0.9;
        _this.setToolParams();
        return _this;
    }
    TconShovel.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1])
            .extra(materials[2])
            .handle(materials[0]);
    };
    TconShovel.prototype.onItemUse = function (coords, item, block, player) {
        if (item.extra && block.id === VanillaTileID.grass && coords.side === EBlockSide.UP) {
            var stack = new TconToolStack(item);
            if (!stack.isBroken()) {
                var region = WorldRegion.getForActor(player);
                region.setBlock(coords, VanillaTileID.grass_path, 0);
                region.playSound(coords.x, coords.y, coords.z, "step.grass");
                stack.consumeDurability(1);
                stack.addXp(1);
                stack.applyToHand(player);
            }
        }
    };
    return TconShovel;
}(TconTool));
ItemRegistry.registerItem(new TconShovel());
ToolForgeHandler.addRecipe(ItemID.tcontool_shovel, ["rod", "shovel", "binding"]);
ToolForgeHandler.addLayout({
    title: "Shovel",
    background: "tcon.icon.shovel",
    intro: "The Shovel digs up dirt. It is effective on dirt, sand, gravel, and snow. Just don't dig your own grave!",
    slots: [
        { x: 0, y: 0, bitmap: "tcon.slot.rod" },
        { x: 18, y: -18, bitmap: "tcon.slot.shovel" },
        { x: -20, y: 20, bitmap: "tcon.slot.binding" }
    ]
});
var TconHatchet = /** @class */ (function (_super) {
    __extends(TconHatchet, _super);
    function TconHatchet() {
        var _this = _super.call(this, "tcontool_hatchet", "Hatchet") || this;
        _this.blockTypes = ["wood", "plant"];
        _this.texture = new ToolTexture("model/tcontool_hatchet", 3, 1);
        _this.damagePotential = 1.1;
        _this.setToolParams();
        return _this;
    }
    TconHatchet.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1])
            .extra(materials[2])
            .handle(materials[0]);
        stats.attack += 0.5;
    };
    //Destroying plants does not reduce durability.
    TconHatchet.prototype.onDestroy = function (item, coords, block, player) {
        if (!item.extra) {
            return true;
        }
        var stack = new TconToolStack(item);
        var blockData = ToolAPI.getBlockData(block.id);
        if (blockData && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()) {
            stack.forEachModifiers(function (mod, level) {
                mod.onDestroy(item, coords, block, player, level);
            });
            if (blockData.material.name !== "plant") {
                if (this.isWeapon) {
                    stack.consumeDurability(2);
                }
                else {
                    stack.consumeDurability(1);
                    stack.addXp(1);
                }
                item.data = stack.data;
            }
        }
        return true;
    };
    TconHatchet.prototype.onItemUse = function (coords, item, block, player) {
        if (item.extra) {
            var log = TconHatchet.STRIPPED_LOGS.find(function (stripped) { return stripped.id === block.id && (stripped.data === -1 || stripped.data === block.data); });
            var stack = new TconToolStack(item);
            if (log && !stack.isBroken()) {
                var region = WorldRegion.getForActor(player);
                if (BlockEngine.getMainGameVersion() >= 16) {
                    var blockState = region.getBlock(coords);
                    var states = { pillar_axis: blockState.getState(EBlockStates.PILLAR_AXIS) };
                    if (log.isStem) {
                        states["deprecated"] = 0;
                    }
                    region.setBlock(coords, new BlockState(log.stripped, states));
                }
                else {
                    region.setBlock(coords, log.stripped, 0);
                }
                region.playSound(coords.x, coords.y, coords.z, log.isStem ? "step.stem" : "step.wood");
                stack.consumeDurability(1);
                stack.addXp(1);
                stack.applyToHand(player);
            }
        }
    };
    TconHatchet.STRIPPED_LOGS = [
        { id: VanillaTileID.log, data: 0, stripped: VanillaTileID.stripped_oak_log, isStem: false },
        { id: VanillaTileID.log, data: 1, stripped: VanillaTileID.stripped_spruce_log, isStem: false },
        { id: VanillaTileID.log, data: 2, stripped: VanillaTileID.stripped_birch_log, isStem: false },
        { id: VanillaTileID.log, data: 3, stripped: VanillaTileID.stripped_jungle_log, isStem: false },
        { id: VanillaTileID.log2, data: 0, stripped: VanillaTileID.stripped_acacia_log, isStem: false },
        { id: VanillaTileID.log2, data: 1, stripped: VanillaTileID.stripped_dark_oak_log, isStem: false },
        { id: VanillaTileID.warped_stem, data: -1, stripped: VanillaTileID.stripped_warped_stem, isStem: true },
        { id: VanillaTileID.crimson_stem, data: -1, stripped: VanillaTileID.stripped_crimson_stem, isStem: true }
    ];
    return TconHatchet;
}(TconTool));
ItemRegistry.registerItem(new TconHatchet());
ToolForgeHandler.addRecipe(ItemID.tcontool_hatchet, ["rod", "axe", "binding"]);
ToolForgeHandler.addLayout({
    title: "Hatchet",
    background: "tcon.icon.hatchet",
    intro: "The Hatchet chops up wood and makes short work of leaves. It also makes for a passable weapon. Chop chop!",
    slots: [
        { x: -11, y: 11, bitmap: "tcon.slot.rod" },
        { x: -2, y: -20, bitmap: "tcon.slot.axe" },
        { x: 18, y: -8, bitmap: "tcon.slot.binding" }
    ]
});
var TconMattock = /** @class */ (function (_super) {
    __extends(TconMattock, _super);
    function TconMattock() {
        var _this = _super.call(this, "tcontool_mattock", "Mattock") || this;
        _this.blockTypes = ["wood", "dirt"];
        _this.texture = new ToolTexture("model/tcontool_mattock", 3, 1);
        _this.miningSpeedModifier = 0.95;
        _this.damagePotential = 0.9;
        _this.repairParts = [1, 2];
        _this.setToolParams();
        return _this;
    }
    TconMattock.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1], materials[2])
            .handle(materials[0]);
        stats.attack += 3;
    };
    TconMattock.prototype.onItemUse = function (coords, item, block, player) {
        if (item.extra && (block.id === VanillaTileID.grass || block.id === VanillaTileID.dirt) && coords.side === EBlockSide.UP) {
            var stack = new TconToolStack(item);
            if (!stack.isBroken()) {
                var region = WorldRegion.getForActor(player);
                region.setBlock(coords, VanillaTileID.farmland, 0);
                region.playSound(coords.x, coords.y, coords.z, "step.gravel");
                stack.consumeDurability(1);
                stack.addXp(1);
                stack.applyToHand(player);
            }
        }
    };
    return TconMattock;
}(TconTool));
ItemRegistry.registerItem(new TconMattock());
ToolForgeHandler.addRecipe(ItemID.tcontool_mattock, ["rod", "axe", "shovel"]);
ToolForgeHandler.addLayout({
    title: "Mattock",
    background: "tcon.icon.mattock",
    intro: "The Cutter Mattock is a versatile farming tool. It is effective on wood, dirt, and plants. It also packs quite a punch.",
    slots: [
        { x: -11, y: 11, bitmap: "tcon.slot.rod" },
        { x: -2, y: -20, bitmap: "tcon.slot.axe" },
        { x: 18, y: -8, bitmap: "tcon.slot.shovel" }
    ]
});
var TconSword = /** @class */ (function (_super) {
    __extends(TconSword, _super);
    function TconSword() {
        var _this = _super.call(this, "tcontool_sword", "Broad Sword") || this;
        _this.blockTypes = ["fibre"];
        _this.texture = new ToolTexture("model/tcontool_sword", 3, 1);
        _this.isWeapon = true;
        _this.setToolParams();
        return _this;
    }
    TconSword.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1])
            .extra(materials[2])
            .handle(materials[0]);
        stats.attack += 1;
        stats.durability *= TconSword.DURABILITY_MODIFIER;
    };
    TconSword.prototype.getRepairModifierForPart = function (index) {
        return TconSword.DURABILITY_MODIFIER;
    };
    TconSword.DURABILITY_MODIFIER = 1.1;
    return TconSword;
}(TconTool));
ItemRegistry.registerItem(new TconSword());
ToolForgeHandler.addRecipe(ItemID.tcontool_sword, ["rod", "sword", "guard"]);
ToolForgeHandler.addLayout({
    title: "Broad Sword",
    background: "tcon.icon.sword",
    intro: "The Broad Sword is a universal weapon. Sweep attacks keep enemy hordes at bay. Also good against cobwebs!",
    slots: [
        { x: -21, y: 20, bitmap: "tcon.slot.rod" },
        { x: 15, y: -16, bitmap: "tcon.slot.sword" },
        { x: -3, y: 2, bitmap: "tcon.slot.guard" }
    ]
});
var TconHammer = /** @class */ (function (_super) {
    __extends(TconHammer, _super);
    function TconHammer() {
        var _this = _super.call(this, "tcontool_hammer", "Hammer") || this;
        _this.blockTypes = ["stone"];
        _this.texture = new ToolTexture("model/tcontool_hammer", 4, 0);
        _this.miningSpeedModifier = 0.4;
        _this.damagePotential = 1.2;
        _this.repairParts = [1, 2, 3];
        _this.setToolParams();
        return _this;
    }
    TconHammer.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1], materials[1], materials[2], materials[3])
            .handle(materials[0]);
        stats.level = Material[materials[1]].getHeadStats().level;
        stats.durability *= TconHammer.DURABILITY_MODIFIER;
    };
    TconHammer.prototype.getRepairModifierForPart = function (index) {
        return index === 1 ? TconHammer.DURABILITY_MODIFIER : TconHammer.DURABILITY_MODIFIER * 0.6;
    };
    TconHammer.DURABILITY_MODIFIER = 2.5;
    return TconHammer;
}(TconTool3x3));
ItemRegistry.registerItem(new TconHammer());
ToolForgeHandler.addRecipe(ItemID.tcontool_hammer, ["rod2", "hammer", "largeplate", "largeplate"]);
ToolForgeHandler.addLayout({
    title: "Hammer",
    background: "tcon.icon.hammer",
    intro: "The Hammer is a broad mining tool. It harvests blocks in a wide range. Also effective against undead.",
    slots: [
        { x: -12, y: 10, bitmap: "tcon.slot.rod2" },
        { x: 11, y: -13, bitmap: "tcon.slot.hammer" },
        { x: 24, y: 6, bitmap: "tcon.slot.plate" },
        { x: -8, y: -26, bitmap: "tcon.slot.plate" }
    ],
    forgeOnly: true
});
var TconExcavator = /** @class */ (function (_super) {
    __extends(TconExcavator, _super);
    function TconExcavator() {
        var _this = _super.call(this, "tcontool_excavator", "Excavator") || this;
        _this.blockTypes = ["stone"];
        _this.texture = new ToolTexture("model/tcontool_excavator", 4, 0);
        _this.miningSpeedModifier = 0.28;
        _this.damagePotential = 1.25;
        _this.repairParts = [1, 2];
        _this.setToolParams();
        return _this;
    }
    TconExcavator.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1], materials[2])
            .extra(materials[3])
            .handle(materials[0]);
        stats.durability *= TconExcavator.DURABILITY_MODIFIER;
    };
    TconExcavator.prototype.getRepairModifierForPart = function (index) {
        return index === 1 ? TconExcavator.DURABILITY_MODIFIER : TconExcavator.DURABILITY_MODIFIER * 0.75;
    };
    TconExcavator.DURABILITY_MODIFIER = 1.75;
    return TconExcavator;
}(TconTool3x3));
ItemRegistry.registerItem(new TconExcavator());
ToolForgeHandler.addRecipe(ItemID.tcontool_excavator, ["rod2", "excavator", "largeplate", "binding2"]);
ToolForgeHandler.addLayout({
    title: "Excavator",
    background: "tcon.icon.excavator",
    intro: "The Excavator is a broad digging tool. It digs up large areas of soil and snow in a wide range. Terraforming!",
    slots: [
        { x: -8, y: 4, bitmap: "tcon.slot.rod2" },
        { x: 12, y: -16, bitmap: "tcon.slot.excavator" },
        { x: -8, y: -16, bitmap: "tcon.slot.plate" },
        { x: -26, y: 20, bitmap: "tcon.slot.binding2" }
    ],
    forgeOnly: true
});
var TconLumberaxe = /** @class */ (function (_super) {
    __extends(TconLumberaxe, _super);
    function TconLumberaxe() {
        var _this = _super.call(this, "tcontool_lumberaxe", "Lumber Axe") || this;
        _this.is3x3 = true;
        _this.blockTypes = ["wood"];
        _this.texture = new ToolTexture("model/tcontool_lumberaxe", 3, 1);
        _this.miningSpeedModifier = 0.35;
        _this.damagePotential = 1.2;
        _this.repairParts = [1, 2];
        _this.setToolParams();
        return _this;
    }
    TconLumberaxe.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1], materials[2])
            .extra(materials[3])
            .handle(materials[0]);
        stats.attack += 2;
        stats.durability *= TconLumberaxe.DURABILITY_MODIFIER;
    };
    TconLumberaxe.prototype.getRepairModifierForPart = function (index) {
        return index === 1 ? TconLumberaxe.DURABILITY_MODIFIER : TconLumberaxe.DURABILITY_MODIFIER * 0.625;
    };
    TconLumberaxe.prototype.onDestroy = function (item, coords, block, player) {
        if (!item.extra) {
            return true;
        }
        var stack = new TconToolStack(item);
        if (stack.isBroken()) {
            return true;
        }
        if (TconLumberaxe.LOGS.indexOf(block.id) !== -1) {
            this.chopTree(stack, coords, player);
            return true;
        }
        var blockData = ToolAPI.getBlockData(block.id);
        if (blockData && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level) {
            var region = WorldRegion.getForActor(player);
            var center = World.getRelativeCoords(coords.x, coords.y, coords.z, coords.side ^ 1);
            var block2_1;
            var consume = 0;
            var _loop_5 = function (x) {
                var _loop_6 = function (y) {
                    var _loop_7 = function (z) {
                        if (x === coords.x && y === coords.y && z === coords.z)
                            return "continue";
                        block2_1 = region.getBlock(x, y, z);
                        blockData = ToolAPI.getBlockData(block2_1.id);
                        if (blockData && this_1.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level) {
                            region.destroyBlock(x, y, z, true, player);
                            stack.forEachModifiers(function (mod, level) {
                                mod.onDestroy(item, { x: x, y: y, z: z, side: coords.side, relative: World.getRelativeCoords(x, y, z, coords.side) }, block2_1, player, level);
                            });
                            consume++;
                        }
                    };
                    for (var z = center.z - 1; z <= center.z + 1; z++) {
                        _loop_7(z);
                    }
                };
                for (var y = center.y - 1; y <= center.y + 1; y++) {
                    _loop_6(y);
                }
            };
            var this_1 = this;
            for (var x = center.x - 1; x <= center.x + 1; x++) {
                _loop_5(x);
            }
            stack.consumeDurability(consume);
            stack.addXp(consume);
            item.data = stack.data;
        }
        return true;
    };
    TconLumberaxe.prototype.chopTree = function (toolStack, coords, player) {
        /*
                if(Threading.getThread("tcon_choptree")?.isAlive()){
                    Game.message("processing...");
                    return;
                }
        
                Threading.initThread("tcon_choptree", () => {
        
                    const array: Vector[] = [];
                    const visited: Vector[] = [];
                    
                    let item: ItemInstance;
                    let stack: TconToolStack;
                    let pos: Vector;
                    let pos2: Vector;
                    let block: Tile;
                    let region: WorldRegion;
        
                    array.push(coords);
        
                    while(array.length > 0){
        
                        item = Entity.getCarriedItem(player);
                        if(toolStack.id !== item.id || !item.extra) return;
        
                        stack = new TconToolStack(item);
                        if(stack.isBroken() || toolStack.uniqueKey() !== stack.uniqueKey()) return;
        
                        pos = array.shift();
                        if(visited.some(p => p.x === pos.x && p.y === pos.y && p.z === pos.z)) continue;
                        visited.push(pos);
        
                        region = WorldRegion.getForActor(player);
        
                        block = region.getBlock(pos);
                        if(!TconLumberaxe.LOGS.indexOf(block.id) !== -1 && (coords.x !== pos.x || coords.y !== pos.y || coords.z !== pos.z)){
                            continue;
                        }
        
                        for(let i = 2; i <= 5; i++){
                            pos2 = World.getRelativeCoords(pos.x, pos.y, pos.z, i);
                            if(!visited.some(p => p.x === pos2.x && p.y === pos2.y && p.z === pos2.z)){
                                array.push(pos2);
                            }
                        }
        
                        for(let i = -1; i <= 1; i++){
                        for(let j = -1; j <= 1; j++){
                            pos2 = {x: pos.x + i, y: pos.y + 1, z: pos.z + j};
                            if(!visited.some(p => p.x === pos2.x && p.y === pos2.y && p.z === pos2.z)){
                                array.push(pos2);
                            }
                        }
                        }
        
                        region.destroyBlock(pos, true, player);
                        stack.forEachModifiers((mod, level) => {
                            mod.onDestroy(item, {x: pos.x, y: pos.y, z: pos.z, side: EBlockSide.DOWN, relative: pos}, block, player, level);
                        });
                        stack.consumeDurability(1);
                        stack.addXp(1);
                        stack.applyToHand(player);
        
                        Thread.sleep(25);
        
                    }
        
                });
        */
    };
    TconLumberaxe.LOGS = [
        VanillaTileID.log,
        VanillaTileID.log2,
        VanillaTileID.warped_stem,
        VanillaTileID.crimson_stem
    ];
    TconLumberaxe.DURABILITY_MODIFIER = 2;
    return TconLumberaxe;
}(TconTool));
/*
Callback.addCallback("LocalTick", () => {

    if(World.getThreadTime() % 20 === 0){

        const player = Player.get();
        const pointed = Player.getPointed();
        const region = WorldRegion.getForActor(player);

        region.destroyBlock(pointed.pos, true, player);

    }

});
*/
Callback.addCallback("ItemUseLocal", function (coords, item, block, player) {
    // const itemModel = ItemModel.getFor(item.id, item.data);
    // Game.message("name: " + itemModel.getUiTextureName());
    // Debug.bitmap(itemModel.getIconBitmap(), "icon");
    var models = ItemModel.getAllModels();
    Game.message("count: " + models.size());
});
ItemRegistry.registerItem(new TconLumberaxe());
ToolForgeHandler.addRecipe(ItemID.tcontool_lumberaxe, ["rod2", "broadaxe", "largeplate", "binding2"]);
ToolForgeHandler.addLayout({
    title: "Lumber Axe",
    background: "tcon.icon.lumberaxe",
    intro: "The Lumber Axe is a broad chopping tool. It can fell entire trees in one swoop or gather wood in a wide range. Timber!",
    slots: [
        { x: -1, y: 4, bitmap: "tcon.slot.rod2" },
        { x: 0, y: -20, bitmap: "tcon.slot.broadaxe" },
        { x: 20, y: -4, bitmap: "tcon.slot.plate" },
        { x: -20, y: 20, bitmap: "tcon.slot.binding2" }
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
    //ToolForgeHandler.addVariation("block_copper", BlockID.blockCopper);
    //ToolForgeHandler.addVariation("block_tin", BlockID.blockTin);
    //ToolForgeHandler.addVariation("block_bronze", BlockID.blockBronze);
    //ToolForgeHandler.addVariation("block_lead", BlockID.blockLead);
    //ToolForgeHandler.addVariation("block_silver", BlockID.blockSilver);
    //ToolForgeHandler.addVariation("block_steel", BlockID.blockSteel);
    //TinkersLumberaxe.logs[BlockID.rubberTreeLog] = true;
    //TinkersLumberaxe.logs[BlockID.rubberTreeLogLatex] = true;
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
    //ToolForgeHandler.addVariation("block_copper", BlockID.blockCopper);
    //ToolForgeHandler.addVariation("block_tin", BlockID.blockTin);
    //ToolForgeHandler.addVariation("block_bronze", BlockID.blockBronze);
    //ToolForgeHandler.addVariation("block_silver", BlockID.blockSilver);
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
    //ToolForgeHandler.addVariation("block_copper", BlockID.blockCopper);
    //ToolForgeHandler.addVariation("block_tin", BlockID.blockTin);
    //ToolForgeHandler.addVariation("block_bronze", BlockID.blockBronze);
});
var RV;
ModAPI.addAPICallback("RecipeViewer", function (api) {
    RV = api;
    api.RecipeTypeRegistry.register("tcon_partbuilder", new /** @class */ (function (_super) {
        __extends(class_2, _super);
        function class_2() {
            var _this = this;
            var centerY = 80;
            _this = _super.call(this, "Part Build", BlockID.tcon_partbuilder0, {
                drawing: [
                    { type: "bitmap", x: 500 - 132 / 2, y: centerY - 90 / 2, bitmap: "tcon.arrow", scale: 6 }
                ],
                elements: {
                    input0: { x: 500 - 66 - 48 - 108 * 2, y: centerY - 108 / 2, size: 108 },
                    input1: { x: 500 - 66 - 48 - 108, y: centerY - 108 / 2, size: 108 },
                    output0: { x: 500 + 66 + 48, y: centerY - 108 / 2, size: 108 },
                    imagePattern: { type: "scale", x: 500 - 24, y: centerY + 50, width: 48, height: 48, value: 1 }
                }
            }) || this;
            _this.setGridView(3, 1, true);
            return _this;
        }
        class_2.prototype.getAllList = function () {
            return PartRegistry.getAllPartBuildRecipeForRV();
        };
        class_2.prototype.onOpen = function (elements, recipe) {
            elements.get("imagePattern").setBinding("texture", "tcon.pattern." + recipe.pattern);
        };
        return class_2;
    }(api.RecipeType)));
    api.RecipeTypeRegistry.register("tcon_melting", new /** @class */ (function (_super) {
        __extends(class_3, _super);
        function class_3() {
            var _this = _super.call(this, "Melting", BlockID.tcon_smeltery, {
                drawing: [
                    { type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6 },
                    { type: "bitmap", x: 452, y: 176, bitmap: "tcon.rv.fire_tank", scale: 6 },
                    { type: "bitmap", x: 614, y: 50, bitmap: "tcon.rv.smeltery", scale: 6 }
                ],
                elements: {
                    input0: { x: 182, y: 176, bitmap: "_default_slot_empty", size: 108 },
                    outputLiq0: { x: 710, y: 50, width: 108, height: 234 },
                    textTemp: { type: "text", x: 500, y: 50, font: { size: 50, alignment: UI.Font.ALIGN_CENTER } }
                }
            }) || this;
            _this.setDescription("Melt");
            _this.setTankLimit(MatValue.BLOCK);
            return _this;
        }
        class_3.prototype.getAllList = function () {
            return MeltingRecipe.getAllRecipeForRV();
        };
        class_3.prototype.onOpen = function (elements, recipe) {
            elements.get("textTemp").setBinding("text", recipe.temp + "°C");
        };
        return class_3;
    }(api.RecipeType)));
    api.RecipeTypeRegistry.register("tcon_alloying", new /** @class */ (function (_super) {
        __extends(class_4, _super);
        function class_4() {
            var _this = _super.call(this, "Alloying", BlockID.tcon_smeltery, {
                drawing: [
                    { type: "bitmap", x: 50, y: 50, bitmap: "tcon.rv.smeltery_wide", scale: 6 },
                    { type: "bitmap", x: 488, y: 150, bitmap: "tcon.arrow", scale: 6 },
                    { type: "bitmap", x: 650, y: 50, bitmap: "tcon.rv.smeltery", scale: 6 }
                ],
                elements: {
                    inputLiq0: { x: 0, y: 1000, width: 108, height: 234 },
                    inputLiq1: { x: 0, y: 1000, width: 108, height: 234 },
                    inputLiq2: { x: 0, y: 1000, width: 108, height: 234 },
                    inputLiq3: { x: 0, y: 1000, width: 108, height: 234 },
                    inputLiq4: { x: 0, y: 1000, width: 108, height: 234 },
                    inputLiq5: { x: 0, y: 1000, width: 108, height: 234 },
                    inputLiq6: { x: 0, y: 1000, width: 108, height: 234 },
                    inputLiq7: { x: 0, y: 1000, width: 108, height: 234 },
                    outputLiq0: { x: 746, y: 50, width: 108, height: 234 }
                }
            }) || this;
            _this.setDescription("Alloy");
            return _this;
        }
        class_4.prototype.getAllList = function () {
            return AlloyRecipe.getAllRecipeForRV();
        };
        class_4.prototype.onOpen = function (elements, recipe) {
            if (recipe.inputLiq && recipe.outputLiq) {
                var len = recipe.inputLiq.length;
                var width = 216 / len;
                var elem = void 0;
                for (var i = 0; i < 8; i++) {
                    elem = elements.get("inputLiq" + i);
                    if (i < len) {
                        elem.setPosition(146 + i * width, 50);
                        elem.setSize(width, 234);
                    }
                    else {
                        elem.setPosition(0, 1000);
                    }
                }
                this.setTankLimit(Math.max.apply(Math, __spreadArray(__spreadArray([], recipe.inputLiq.map(function (rec) { return rec.amount; }), false), [recipe.outputLiq[0].amount], false)));
            }
        };
        return class_4;
    }(api.RecipeType)));
    var CastingRV = /** @class */ (function (_super) {
        __extends(CastingRV, _super);
        function CastingRV(name, icon, tileBitmap, castType) {
            var _this = this;
            var content = {
                drawing: [
                    { type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6 },
                    { type: "bitmap", x: 386, y: 122, bitmap: "tcon.rv.faucet", scale: 6 },
                    { type: "bitmap", x: 530, y: 182, bitmap: "tcon.arrow", scale: 6 }
                ],
                elements: {
                    input0: { x: 404, y: 188, bitmap: "_default_slot_empty", size: 96 },
                    output0: { x: 704, y: 176, size: 108 },
                    inputLiq0: { x: 182, y: 50, width: 108, height: 234 },
                    scaleFlow: { type: "scale", x: 434, y: 122, width: 36, height: 66, value: 1 },
                    textTime: { type: "text", x: 596, y: 100, font: { size: 50, alignment: UI.Font.ALIGN_CENTER } },
                    textConsume: { type: "text", x: 758, y: 300, font: { color: Color.RED, size: 40, alignment: UI.Font.ALIGN_CENTER } }
                }
            };
            content.drawing.push({ type: "bitmap", x: 404, y: 284, bitmap: tileBitmap, scale: 6 });
            _this = _super.call(this, name, icon, content) || this;
            _this.castType = castType;
            _this.setTankLimit(MatValue.BLOCK);
            return _this;
        }
        CastingRV.prototype.getAllList = function () {
            return CastingRecipe.getAllRecipeForRV(this.castType);
        };
        CastingRV.prototype.onOpen = function (elements, recipe) {
            elements.get("scaleFlow").setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq[0].liquid, 36, 66));
            elements.get("textTime").setBinding("text", (CastingRecipe.calcCooldownTime(recipe.inputLiq[0].liquid, recipe.inputLiq[0].amount) / 20).toFixed(1) + " s");
            elements.get("textConsume").setBinding("text", recipe.consume ? "Consumes cast!" : "");
        };
        return CastingRV;
    }(api.RecipeType));
    api.RecipeTypeRegistry.register("tcon_itemcast", new CastingRV("Item Casting", BlockID.tcon_itemcast, "tcon.rv.table", "table"));
    api.RecipeTypeRegistry.register("tcon_blockcast", new CastingRV("Block Casting", BlockID.tcon_blockcast, "tcon.rv.basin", "basin"));
});
ModAPI.registerAPI("TConAPI", {
    MatValue: MatValue,
    MoltenLiquid: MoltenLiquid,
    SmelteryFuel: SmelteryFuel,
    MeltingRecipe: MeltingRecipe,
    AlloyRecipe: AlloyRecipe,
    CastingRecipe: CastingRecipe,
    BlockModel: BlockModel
});
