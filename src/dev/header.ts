IMPORT("ToolLib");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("EnhancedRecipes");
IMPORT("ConnectedTexture");

const Color = android.graphics.Color;
const Bitmap = android.graphics.Bitmap;
const Canvas = android.graphics.Canvas;
const Paint = android.graphics.Paint;
const ColorFilter = android.graphics.PorterDuffColorFilter;
const PorterDuff = android.graphics.PorterDuff;
const Thread = java.lang.Thread;
const ScreenHeight = UI.getScreenHeight();
const setLoadingTip = ModAPI.requireGlobal("MCSystem.setLoadingTip");

const SCALE = 5; //GUI Scale

const Cfg = {
    toolLeveling: {
        baseXp: __config__.getNumber("toolLeveling.baseXp") - 0 ?? 500,
        multiplier: __config__.getNumber("toolLeveling.multiplier") - 0 ?? 2
    },
    oreGen: {
        cobaltRate: __config__.getNumber("oreGen.cobaltRate") - 0 ?? 20,
        arditeRate: __config__.getNumber("oreGen.arditeRate") - 0 ?? 20
    },
    oreToIngotRatio: __config__.getNumber("oreToIngotRatio") - 0 ?? 2,
    modifierSlots: __config__.getNumber("modifierSlots") - 0 ?? 3,
    showItemOnTable: __config__.getBool("showItemOnTable") ?? true
    
};

class MatValue {
    static INGOT = 144;
    static NUGGET = MatValue.INGOT / 9;
    static FRAGMENT = MatValue.INGOT / 4;
    static SHARD = MatValue.INGOT / 2;
    static GEM = 666;
    static BLOCK = MatValue.INGOT * 9;
    static SEARED_BLOCK = MatValue.INGOT * 2;
    static SEARED_MATERIAL = MatValue.INGOT / 2;
    static GLASS = 1000;
    static BRICK_BLOCK = MatValue.INGOT * 4;
    static SLIME_BALL = 250;
    static ORE = MatValue.INGOT * Cfg.oreToIngotRatio;
}

interface LiquidInstance {
    liquid: string;
    amount: number;
};


let player: number;
Callback.addCallback("LevelLoaded", () => {
    player = Player.get();
});


const addLineBreaks = (length: number, text: string): string => {
    const array: string[] = [];
    const words = text.split(" ");
    let i = 0;
    let line: string[];
    let count: number;
    while(i < words.length){
        line = [];
        count = 0;
        while(i < words.length && count + words[i].length <= length){
            line.push(words[i]);
            count += words[i].length;
            i++;
        }
        array.push(line.join(" "));
    }
    return array.join("\n");
}


const isBlockID = (id: number): boolean => {
    const info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("block");
}

const isItemID = (id: number): boolean => {
    const info = IDRegistry.getIdInfo(id);
    return info && info.startsWith("item");
}


const createBlock = (namedID: string, defineData: {name: string, texture?: string | ([string, number] | number)[], isTech?: boolean}[], material: string = "stone"): number => {
    const id = IDRegistry.genBlockID(namedID);
    Block.createBlock(namedID, defineData.map(data => ({
        name: data.name,
        texture: data.texture ? typeof data.texture === "string" ? [[data.texture, 0]] : data.texture.map(tex => typeof tex === "number" ? [namedID, tex] : tex) : [[namedID, 0]],
        inCreative: !data.isTech
    })));
    Block.setDestroyTime(id, 3);
    ToolAPI.registerBlockMaterial(id, material);
    return id;
};

const createItem = (namedID: string, name: string, texture: Item.TextureData = {name: namedID}, params?: {stack?: number, isTech?: boolean}): number => {
    const id = IDRegistry.genItemID(namedID);
    Item.createItem(namedID, name, texture, params);
    return id;
};

const createAnimItem = (x: number, y: number, z: number): any => {
    const anim = new Animation.Item(x, y, z);
    anim.load();
    anim.setSkylightMode();
    return anim;
}

const registerRotationModel = (namedID: string, ...texture: ([string, number] | number)[][]): void => {
    const id = BlockID[namedID];
    const texture2 = texture.map(tex => tex.map(t => typeof t === "number" ? [namedID, t] : t));
    TileRenderer.setStandartModel(id, texture2[0]);
    for(let i = 0; i < texture2.length; i++){
        TileRenderer.registerRotationModel(id, i * 4, texture2[i]);
    }
};


class TileBase {
    isLoaded: boolean;
    remove: boolean;
    x: number;
    y: number;
    z: number;
    blockID: number;
    data: {[key: string]: any};
    container: any;
    liquidStorage: any;
    tileEntity: any;
    interface: any;
}
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