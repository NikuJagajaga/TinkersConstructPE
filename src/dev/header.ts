IMPORT("BlockEngine");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("VanillaSlots");
IMPORT("SoundLib");
IMPORT("EnhancedRecipes");
IMPORT("ConnectedTexture");

const Color = android.graphics.Color;
const Thread = java.lang.Thread;
const ClientSide = BlockEngine.Decorators.ClientSide;
const NetworkEvent = BlockEngine.Decorators.NetworkEvent;
const ContainerEvent = BlockEngine.Decorators.ContainerEvent;

const ScreenHeight = UI.getScreenHeight();

const SCALE = 5; //GUI Scale

__config__.checkAndRestore({
    SlotsLikeVanilla: true,
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

const Cfg = {
    SlotsLikeVanilla: __config__.getBool("SlotsLikeVanilla"),
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

type EPartType = "pickaxe" | "shovel" | "axe" | "broadaxe" | "sword" | "hammer" | "excavator" | "rod" | "rod2" | "binding" | "binding2" | "guard" | "largeplate";
type ECastType = EPartType | "ingot" | "nugget" | "gem" | "plate" | "gear";

class MatValue {
    static readonly INGOT = 144;
    static readonly NUGGET = MatValue.INGOT / 9;
    static readonly FRAGMENT = MatValue.INGOT / 4;
    static readonly SHARD = MatValue.INGOT / 2;
    static readonly GEM = 666;
    static readonly BLOCK = MatValue.INGOT * 9;
    static readonly SEARED_BLOCK = MatValue.INGOT * 2;
    static readonly SEARED_MATERIAL = MatValue.INGOT / 2;
    static readonly GLASS = 1000;
    static readonly BRICK_BLOCK = MatValue.INGOT * 4;
    static readonly SLIME_BALL = 250;
    static readonly ORE = MatValue.INGOT * Cfg.oreToIngotRatio;
}

const addLineBreaks = (length: number, text: string): string => {
    const array: string[] = [];
    const words = text.split(" ");
    let i = 0;
    let line: string[];
    let count = 0;
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


type AnyID = number | Recipes2.VanillaID | Tile | {id: Recipes2.VanillaID, data: number};

const getIDData = (item: AnyID, defaultData: number = -1): Tile => {
    switch(typeof item){
        case "string": return IDConverter.getIDData(item);
        case "number": return {id: item, data: defaultData};
        default: return typeof item.id === "string" ? {id: IDConverter.getID(item.id), data: item.data} : item;
    }
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


Network.addClientPacket("tcon.playSound", (data: {name: string, volume?: number, pitch?: number}) => SoundManager.playSound(data.name, data.volume, data.pitch));
