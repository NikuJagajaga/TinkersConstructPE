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
IMPORT("VanillaSlots");
IMPORT("SoundLib");
IMPORT("EnhancedRecipes");
IMPORT("ConnectedTexture");
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Color = android.graphics.Color;
var Thread = java.lang.Thread;
var ClientSide = BlockEngine.Decorators.ClientSide;
var NetworkEvent = BlockEngine.Decorators.NetworkEvent;
var ContainerEvent = BlockEngine.Decorators.ContainerEvent;
var ScreenHeight = UI.getScreenHeight();
var SCALE = 5; //GUI Scale
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
var Cfg = {
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
    checkInsideSmeltery: __config__.getBool("checkInsideSmeltery")
};
var addLineBreaks = function (length, text) {
    var characters = 0;
    var bufferedLine = "";
    var bufferedWord = "";
    var index = 0;
    var lines = [];
    var chars = new java.lang.String(text).toCharArray();
    while (index < chars.length) {
        var next = chars[index++];
        // Reached word length limit of line and forcing newline
        if (next == 10 || ++characters > length) {
            if (characters <= length || bufferedLine.length == 0) {
                bufferedLine += bufferedWord;
            }
            else {
                index -= bufferedWord.length;
            }
            lines.push(bufferedLine);
            if (next != 10) {
                index--;
            }
            characters = 0;
            bufferedLine = bufferedWord = "";
        }
        else {
            // Leading whitespace will be ignored, indentation too
            if (java.lang.Character.isWhitespace(next)) {
                if (bufferedWord.length == 0) {
                    characters--;
                    continue;
                }
                bufferedLine += bufferedWord;
                bufferedWord = "";
            }
            bufferedWord += java.lang.Character.toString(next);
        }
    }
    if (bufferedWord.length != 0) {
        bufferedLine += bufferedWord;
    }
    if (bufferedLine.length != 0) {
        lines.push(bufferedLine);
    }
    return lines.join("\n");
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
ItemModel.setCurrentCacheGroup("tcon", "2.2.0");
Network.addClientPacket("tcon.playSound", function (data) { return SoundManager.playSound(data.name, data.volume, data.pitch); });
var translate = function (text) {
    var parameters = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        parameters[_i - 1] = arguments[_i];
    }
    text = Translation.translate(text);
    if (parameters.length > 0) {
        return java.lang.String.format(text, parameters.map(function (obj) { return "" + obj; }));
    }
    return text;
};
///
// SMELTERY -> LIQUIDS
///
Translation.addTranslation("TConstruct: Buckets", {
    de: "TConstruct: Eimer",
    id: "TConstruct: Ember",
    it: "TConstruct: Secchi",
    ja: "TConstruct: バケツ",
    ko: "TConstruct: 양동이",
    pl: "TConstruct: Wiadra",
    pt: "TConstruct: Baldes",
    ru: "TConstruct: Жидкости",
    sv: "TConstruct: Hinkar",
    uk: "TConstruct: Відра",
    zh: "TConstruct: 桶"
});
Translation.addTranslation("Molten Iron", {
    de: "Geschmolzenes Eisen",
    id: "Besi Leleh",
    it: "Ferro fuso",
    ja: "溶融した鉄", ko: "녹은 철",
    pl: "Stopione żelazo",
    pt: "Ferro Derretido",
    ru: "Расплавленное железо",
    sv: "Nedsmält järn",
    uk: "Розплавлене залізо",
    zh: "熔融铁"
});
Translation.addTranslation("Molten Iron Bucket", {
    de: "Eimer aus geschmolzenem Eisen",
    id: "Ember Besi Leleh",
    it: "Secchio di ferro fuso",
    ja: "溶融した鉄入りバケツ",
    ko: "녹은 철 양동이",
    pl: "Wiadro stopionego żelaza",
    pt: "Balde de Ferro Derretido",
    ru: "Ведро расплавленного железа",
    sv: "Hink med nedsmält järn",
    uk: "Відро розплавленого заліза",
    zh: "熔融铁桶"
});
Translation.addTranslation("Molten Gold", {
    de: "Geschmolzenes Gold",
    id: "Molten Gold",
    it: "Oro fuso",
    ja: "溶融した金", ko: "녹은 금",
    pl: "Stopione złoto",
    pt: "Ouro Derretido",
    ru: "Расплавленное золото",
    sv: "Nedsmält guld",
    uk: "Розплавлене золото",
    zh: "熔融金"
});
Translation.addTranslation("Molten Gold Bucket", {
    de: "Eimer aus geschmolzenem Gold",
    id: "Molten Gold Bucket",
    it: "Secchio d'oro fuso",
    ja: "溶融した金入りバケツ",
    ko: "녹은 금 양동이",
    pl: "Wiadro stopionego złota",
    pt: "Balde de Ouro Derretido",
    ru: "Ведро расплавленного золото",
    sv: "Hink med nedsmält guld",
    uk: "Відро розплавленого золота",
    zh: "熔融金桶"
});
Translation.addTranslation("Molten Pigiron", {
    de: "Geschmolzenes Roheisen",
    id: "Molten Pigiron",
    it: "Ferro di maiale fuso",
    ja: "溶融した銑鉄",
    ko: "녹은 돼지 선철",
    pl: "Stopione świńskie żelazo",
    pt: "Ferro-Porco Derretido",
    ru: "Расплавленный чугун",
    sv: "Nedsmält grisjärn",
    uk: "Розплавлене свиняче залізо",
    zh: "熔融生铁"
});
Translation.addTranslation("Molten Pigiron Bucket", {
    de: "Eimer aus geschmolzenem Roheisen",
    id: "Molten Pigiron Bucket",
    it: "Secchio di ferro di maiale fuso",
    ja: "溶融した銑鉄入りバケツ",
    ko: "녹은 돼지 선철 양동이",
    pl: "Wiadro stopionego świńskiego żelaza",
    pt: "Balde de Ferro-Porco Derretido",
    ru: "Ведро расплавленного чугуна",
    sv: "Hink med nedsmält grisjärn",
    uk: "Відро розплавленого свинячого заліза",
    zh: "熔融生铁桶"
});
Translation.addTranslation("Molten Cobalt", {
    de: "Geschmolzenes Kobalt",
    id: "Molten Cobalt",
    it: "Cobalto fuso",
    ja: "溶融したコバルト",
    ko: "녹은 코발트",
    pl: "Stopiony kobalt",
    pt: "Cobalto Derretido",
    ru: "Расплавленный кобальт",
    sv: "Nedsmält kobolt",
    uk: "Розплавлений кобальт",
    zh: "熔融钴"
});
Translation.addTranslation("Molten Cobalt Bucket", {
    de: "Eimer mit geschmolzenem Kobalt",
    id: "Molten Cobalt Bucket",
    it: "Secchio di cobalto fuso",
    ja: "溶融したコバルト入りバケツ",
    ko: "녹은 코발트 양동이",
    pl: "Wiadro stopionego kobaltu",
    pt: "Balde de Cobalto Derretido",
    ru: "Ведро расплавленного кобальта",
    sv: "Hink med nedsmält kobolt",
    uk: "Відро розплавленого кобальту",
    zh: "熔融钴桶"
});
Translation.addTranslation("Molten Ardite", {
    de: "Geschmolzenes Ardite",
    id: "Ardite Leleh",
    it: "Ardite Fuso",
    ja: "溶融したアルダイト",
    ko: "녹은 아르다이트",
    pl: "Stopione ardite",
    pt: "Ardite Derretido",
    ru: "Расплавленный ардит",
    sv: "Nedsmält Ardite",
    uk: "Розплавлене ардиту",
    zh: "熔融阿迪特"
});
Translation.addTranslation("Molten Ardite Bucket", {
    de: "Eimer mit geschmolzenem Ardite",
    id: "Ember Ardite Leleh",
    it: "Secchio di Ardite Fuso",
    ja: "溶融したアルダイトのバケツ",
    ko: "녹은 아르다이트 양동이",
    pl: "Wiadro stopionego ardite",
    pt: "Balde de Ardite Derretido",
    ru: "Ведро расплавленного ардита",
    sv: "Hink med nedsmält Ardite",
    uk: "Відро розплавленого ардиту",
    zh: "熔融阿迪特桶"
});
Translation.addTranslation("Molten Manyullyn", {
    de: "Geschmolzener Manyullyn",
    id: "Molten Manyullyn",
    it: "Manyullyn fuso",
    ja: "溶融したマンユリン",
    ko: "녹은 마뉼린",
    pl: "Stopiony Manyullyn",
    pt: "Manyullyn Derretida",
    ru: "Расплавленный манюллин",
    sv: "Nedsmält manyullyn",
    uk: "Розплавлений маньюлін",
    zh: "熔融玛玉灵"
});
Translation.addTranslation("Molten Manyullyn Bucket", {
    de: "Geschmolzener Manyullyn-Eimer",
    id: "Molten Manyullyn Bucket",
    it: "Secchio di Manyullyn fuso",
    ja: "溶融したマンユリン入りバケツ",
    ko: "녹은 마뉼린 양동이",
    pl: "Wiadro stopionego Manyullynu",
    pt: "Balde de Manyullyn Derretida",
    ru: "Ведро расплавленного манюллина",
    sv: "Hink med nedsmält manyullyn",
    uk: "Відро розплавленого маньюліну",
    zh: "熔融玛玉灵桶"
});
Translation.addTranslation("Molten Knightslime", {
    de: "Geschmolzener Ritterschleim",
    id: "Molten Knightslime",
    it: "Slime del cavaliere fuso",
    ja: "溶融したナイトスライム",
    ko: "녹은 기사슬라임",
    pl: "Stopiony rycerski szlam",
    pt: "Cavaleiro-Slime Derretido",
    ru: "Расплавленная слизь из короля слизней",
    sv: "Nedsmält riddarslem",
    uk: "Розплавлений лицарський слиз",
    zh: "熔融骑士史莱姆"
});
Translation.addTranslation("Molten Knightslime Bucket", {
    de: "Geschmolzener Knightslime-Eimer",
    id: "Molten Knightslime Bucket",
    it: "Secchio di slime del cavaliere fuso",
    ja: "溶融したナイトスライム入りバケツ",
    ko: "녹은 기사슬라임 양동이",
    pl: "Wiadro stopionego rycerskiego szlamu",
    pt: "Balde de Cavaleiro-Slime Derretido",
    ru: "Ведро расплавленной слизи из короля слизней",
    sv: "Hink med nedsmält riddarslem",
    uk: "Відро розплавленого лицарського слизу",
    zh: "熔融骑士史莱姆桶"
});
Translation.addTranslation("Molten Aluminum Brass", {
    de: "Geschmolzenes Aluminium-Bronze",
    id: "Besi Perunggu Aluminium Leleh",
    it: "Bronzo Alluminio Fuso",
    ja: "溶融したアルミニウムブロンズ",
    ko: "녹은 알루미늄 브론즈",
    pl: "Stopiony brąz aluminiowy",
    pt: "Bronze de Alumínio Derretido",
    ru: "Расплавленная алюминиевая бронза",
    sv: "Nedsmält aluminiumbrons",
    uk: "Розплавлений алюмінієвий бронза",
    zh: "熔融铝青铜"
});
Translation.addTranslation("Molten Aluminum Bucket", {
    de: "Eimer mit geschmolzenem Aluminium",
    id: "Ember Aluminium Leleh",
    it: "Secchio di Alluminio Fuso",
    ja: "溶融したアルミニウムのバケツ",
    ko: "녹은 알루미늄 양동이",
    pl: "Wiadro stopionego aluminium",
    pt: "Balde de Alumínio Derretido",
    ru: "Ведро расплавленной алюминиевой бронзы",
    sv: "Hink med nedsmält aluminium",
    uk: "Відро розплавленого алюмінієвого бронзи",
    zh: "熔融铝桶"
});
Translation.addTranslation("Molten Brass", {
    de: "Geschmolzenes Messing",
    id: "Molten Brass",
    it: "Ottone fuso",
    ja: "溶融した黄銅", ko: "녹은 황동",
    pl: "Stopiony mosiądz",
    pt: "Latão Derretido",
    ru: "Расплавленная латунь",
    sv: "Nedsmält mässing",
    uk: "Розплавлена латунь",
    zh: "熔融黄铜"
});
Translation.addTranslation("Molten Brass Bucket", {
    de: "Eimer aus geschmolzenem Messing",
    id: "Molten Brass Bucket",
    it: "Secchio di ottone fuso",
    ja: "溶融した黄銅入りバケツ",
    ko: "녹은 황동 양동이",
    pl: "Wiadro stopionego mosiądzu",
    pt: "Balde de Latão Derretido",
    ru: "Ведро расплавленной латуни",
    sv: "Hink med nedsmält mässing",
    uk: "Відро розплавленої латуні",
    zh: "熔融黄铜桶"
});
Translation.addTranslation("Molten Copper", {
    de: "Geschmolzenes Kupfer",
    id: "Molten Copper",
    it: "Rame fuso",
    ja: "溶融した銅", ko: "녹은 구리",
    pl: "Stopiona miedź",
    pt: "Cobre Derretido",
    ru: "Расплавленная медь",
    sv: "Nedsmält koppar",
    uk: "Розплавлена мідь",
    zh: "熔融铜"
});
Translation.addTranslation("Molten Copper Bucket", {
    de: "Eimer aus geschmolzenem Kupfer",
    id: "Molten Copper Bucket",
    it: "Secchio di rame fuso",
    ja: "溶融した銅入りバケツ",
    ko: "녹은 구리 양동이",
    pl: "Wiadro stopionej miedzi",
    pt: "Balde de Cobre Derretido",
    ru: "Ведро расплавленной меди",
    sv: "Hink med nedsmält koppar",
    uk: "Відро розплавленої міді",
    zh: "熔融铜桶"
});
Translation.addTranslation("Molten Tin", {
    de: "Geschmolzenes Zinn",
    id: "Molten Tin",
    it: "Stagno fuso",
    ja: "溶融した錫", ko: "녹은 주석",
    pl: "Stopiona cyna",
    pt: "Estanho Derretido",
    ru: "Расплавленное олово",
    sv: "Nedsmält tenn",
    uk: "Розплавлене олово",
    zh: "熔融锡"
});
Translation.addTranslation("Molten Tin Bucket", {
    de: "Eimer aus geschmolzenem Zinn",
    id: "Molten Tin Bucket",
    it: "Secchio di stagno fuso",
    ja: "溶融した錫入りバケツ",
    ko: "녹은 주석 양동이",
    pl: "Wiadro stopionej cyny",
    pt: "Balde de Estanho Derretido",
    ru: "Ведро расплавленного олова",
    sv: "Hink med nedsmält tenn",
    uk: "Відро розплавленого олова",
    zh: "熔融锡桶"
});
Translation.addTranslation("Molten Bronze", {
    de: "Geschmolzene Bronze",
    id: "Molten Bronze",
    it: "Bronzo fuso",
    ja: "溶融した青銅", ko: "녹은 청동",
    pl: "Stopiony brąz",
    pt: "Bronze Derretido",
    ru: "Расплавленная бронза",
    sv: "Nedsmält brons",
    uk: "Розплавлена бронза",
    zh: "熔融青铜"
});
Translation.addTranslation("Molten Bronze Bucket", {
    de: "Eimer aus geschmolzener Bronze",
    id: "Molten Bronze Bucket",
    it: "Secchio di bronzo fuso",
    ja: "溶融した青銅入りバケツ",
    ko: "녹은 청동 양동이",
    pl: "Wiadro stopionego brązu",
    pt: "Balde de Bronze Derretido",
    ru: "Ведро расплавленной бронзы",
    sv: "Hink med nedsmält brons",
    uk: "Відро розплавленої бронзи",
    zh: "熔融青铜桶"
});
Translation.addTranslation("Molten Zinc", {
    de: "Geschmolzenes Zink",
    id: "Molten Zinc",
    it: "Zinco fuso",
    ja: "溶融した亜鉛", ko: "녹은 아연",
    pl: "Stopiony cynk",
    pt: "Zinco Derretido",
    ru: "Расплавленный цинк",
    sv: "Nedsmält zink",
    uk: "Розплавлений цинк",
    zh: "熔融锌"
});
Translation.addTranslation("Molten Zinc Bucket", {
    de: "Eimer für geschmolzenes Zink",
    id: "Molten Zinc Bucket",
    it: "Secchio di zinco fuso",
    ja: "溶融した亜鉛入りバケツ",
    ko: "녹은 아연 양동이",
    pl: "Wiadro stopionego cynku",
    pt: "Balde de Zinco Derretido",
    ru: "Ведро расплавленного цинка",
    sv: "Hink med nedsmält zink",
    uk: "Відро розплавленого цинку",
    zh: "熔融锌桶"
});
Translation.addTranslation("Molten Lead", {
    de: "Geschmolzenes Blei",
    id: "Molten Lead",
    it: "Piombo fuso",
    ja: "溶融した鉛", ko: "녹은 납",
    pl: "Stopiony ołów",
    pt: "Chumbo Derretido",
    ru: "Расплавленный свинец",
    sv: "Nedsmält bly",
    uk: "Розплавлений свинець",
    zh: "熔融铅"
});
Translation.addTranslation("Molten Lead Bucket", {
    de: "Geschmolzener Bleieimer",
    id: "Molten Lead Bucket",
    it: "Secchio di piombo fuso",
    ja: "溶融した鉛入りバケツ",
    ko: "녹은 납 양동이",
    pl: "Wiadro stopionego ołowiu",
    pt: "Balde de Chumbo Derretido",
    ru: "Ведро расплавленного свинца",
    sv: "Hink med nedsmält bly",
    uk: "Відро розплавленого свинцю",
    zh: "熔融铅桶"
});
Translation.addTranslation("Molten Nickel", {
    de: "Geschmolzenes Nickel",
    id: "Molten Nickel",
    it: "Nichel fuso",
    ja: "溶融したニッケル",
    ko: "녹은 니켈",
    pl: "Stopiony nikiel",
    pt: "Níquel Derretido",
    ru: "Расплавленный никель",
    sv: "Nedsmält nickel",
    uk: "Розплавлений нікель",
    zh: "熔融镍"
});
Translation.addTranslation("Molten Nickel Bucket", {
    de: "Eimer für geschmolzenes Nickel",
    id: "Molten Nickel Bucket",
    it: "Secchio di nichel fuso",
    ja: "溶融したニッケル入りバケツ",
    ko: "녹은 니켈 양동이",
    pl: "Wiadro stopionego niklu",
    pt: "Balde de Níquel Derretido",
    ru: "Ведро расплавленного никеля",
    sv: "Hink med nedsmält nickel",
    uk: "Відро розплавленого нікелю",
    zh: "熔融镍桶"
});
Translation.addTranslation("Molten Silver", {
    de: "Geschmolzenes Silber",
    id: "Molten Silver",
    it: "Argento fuso",
    ja: "溶融した銀", ko: "녹은 은",
    pl: "Stopione srebro",
    pt: "Prata Derretida",
    ru: "Расплавленное серебро",
    sv: "Nedsmält silver",
    uk: "Розплавлене срібло",
    zh: "熔融银"
});
Translation.addTranslation("Molten Silver Bucket", {
    de: "Geschmolzener Silbereimer",
    id: "Molten Silver Bucket",
    it: "Secchio d'argento fuso",
    ja: "溶融した銀入りバケツ",
    ko: "녹은 은 양동이",
    pl: "Wiadro stopionego srebra",
    pt: "Balde de Prata Derretida",
    ru: "Ведро расплавленного серебра",
    sv: "Hink med nedsmält silver",
    uk: "Відро розплавленого срібла",
    zh: "熔融银桶"
});
Translation.addTranslation("Molten Electrum", {
    de: "Geschmolzenes Elektrum",
    id: "Molten Electrum",
    it: "Elettro fuso",
    ja: "溶融したエレクトラム",
    ko: "녹은 호박금",
    pl: "Stopione elektrum",
    pt: "Electrio Derretido",
    ru: "Расплавленный электрум",
    sv: "Nedsmält elektrum",
    uk: "Розплавлений електрум",
    zh: "熔融琥珀金"
});
Translation.addTranslation("Molten Electrum Bucket", {
    de: "Eimer mit geschmolzenem Elektrum",
    id: "Molten Electrum Bucket",
    it: "Secchio di Elettro fusa",
    ja: "溶融したエレクトラム入りバケツ",
    ko: "녹은 호박금 양동이",
    pl: "Wiadro stopionego elektrum",
    pt: "Balde de Electrio Derretido",
    ru: "Ведро расплавленного электрума",
    sv: "Hink med nedsmält elektrum",
    uk: "Відро розплавленого електруму",
    zh: "熔融琥珀金桶"
});
Translation.addTranslation("Molten Steel", {
    de: "Geschmolzener Stahl",
    id: "Molten Steel",
    it: "Acciaio fuso",
    ja: "溶融した鋼鉄", ko: "녹은 강철",
    pl: "Stopiona stal",
    pt: "Aço Derretido",
    ru: "Расплавленная сталь",
    sv: "Nedsmält stål",
    uk: "Розплавлена сталь",
    zh: "熔融钢"
});
Translation.addTranslation("Molten Steel Bucket", {
    de: "Eimer aus geschmolzenem Stahl",
    id: "Molten Steel Bucket",
    it: "Secchio di acciaio fuso",
    ja: "溶融した鋼鉄入りバケツ",
    ko: "녹은 강철 양동이",
    pl: "Wiadro stopionej stali",
    pt: "Balde de Aço Derretido",
    ru: "Ведро расплавленной стали",
    sv: "Hink med nedsmält stål",
    uk: "Відро розплавленої сталі",
    zh: "熔融钢桶"
});
Translation.addTranslation("Molten Aluminum", {
    de: "Geschmolzenes Aluminium",
    id: "Molten Aluminum",
    it: "Alluminio fuso",
    ja: "溶融したアルミニウム",
    ko: "녹은 알루미늄",
    pl: "Stopione aluminium",
    pt: "Aluminio Derretido",
    ru: "Расплавленный алюминий",
    sv: "Nedsmält aluminium",
    uk: "Розплавлений алюміній",
    zh: "熔融铝"
});
Translation.addTranslation("Molten Aluminum Bucket", {
    de: "Eimer für geschmolzenes Aluminium",
    id: "Molten Aluminum Bucket",
    it: "Secchio di alluminio fuso",
    ja: "溶融したアルミニウム入りバケツ",
    ko: "녹은 알루미늄 양동이",
    pl: "Wiadro stopionego aluminium",
    pt: "Balde de Aluminio Derretido",
    ru: "Ведро расплавленного алюминия",
    sv: "Hink med nedsmält aluminium",
    uk: "Відро розплавленого алюмінію",
    zh: "熔融铝桶"
});
Translation.addTranslation("Seared Stone", {
    de: "Versengter Stein",
    id: "Seared Stone",
    it: "Pietra scottata",
    ja: "焼成石", ko: "그을린 돌",
    pl: "Suszony kamień",
    pt: "Pedra Carbonizada",
    ru: "Обожженный камень",
    sv: "Bränd sten",
    uk: "Обпалений камінь",
    zh: "焦黑石"
});
Translation.addTranslation("Seared Stone Bucket", {
    de: "Seared Stone Bucket",
    id: "Ember Batu hangus Leleh",
    it: "Secchio di pietra scottata",
    ja: "溶融した焼成石入りバケツ",
    ko: "녹은 그을린 돌 양동이",
    pl: "Wiadro suszonego kamienia",
    pt: "Balde de Pedra Carbonizada",
    ru: "Ведро обожженного камня",
    sv: "Hink med bränd sten",
    uk: "Відро обпаленого каменю",
    zh: "焦黑熔石桶"
});
Translation.addTranslation("Molten Obsidian", {
    de: "Geschmolzener Obsidian",
    id: "Obsidian Leleh",
    it: "Ossidiana fusa",
    ja: "溶融した黒曜石",
    ko: "녹은 흑요석",
    pl: "Stopiony obsydian",
    pt: "Obsidian Derretida",
    ru: "Расплавленный обсидиан",
    sv: "Nedsmält obsidian",
    uk: "Розплавлений обсидіан",
    zh: "熔融黑曜石"
});
Translation.addTranslation("Molten Obsidian Bucket", {
    de: "Eimer aus geschmolzenem Obsidian",
    id: "Ember Obsidian Leleh",
    it: "Secchio di ossidiana fusa",
    ja: "溶融した黒曜石入りバケツ",
    ko: "녹은 흑요석 양동이",
    pl: "Wiadro stopionego obsydianu",
    pt: "Balde de Obsidian Derretida",
    ru: "Ведро расплавленного обсидиана",
    sv: "Hink med nedsmält obsidian",
    uk: "Відро розплавленого обсидіану",
    zh: "熔融黑曜石桶"
});
Translation.addTranslation("Molten Clay", {
    de: "Geschmolzener Ton",
    id: "Terakota Leleh",
    it: "Argilla fusa",
    ja: "溶融した粘土", ko: "녹은 점토",
    pl: "Stopiona glina",
    pt: "Argila Derretida",
    ru: "Расплавленная глина",
    sv: "Nedsmält gyttja",
    uk: "Розплавлена глина",
    zh: "熔融黏土"
});
Translation.addTranslation("Molten Clay Bucket", {
    de: "Geschmolzener Lehmeimer",
    id: "Ember Terakota Leleh",
    it: "Secchio di argilla fusa",
    ja: "溶融した粘土入りバケツ",
    ko: "녹은 점토 양동이",
    pl: "Wiadro stopionej gliny",
    pt: "Balde de Argila Derretida",
    ru: "Ведро расплавленной глины",
    sv: "Hink med nedsmält lera",
    uk: "Відро розплавленої глини",
    zh: "熔融黏土桶"
});
Translation.addTranslation("Liquid Dirt", {
    de: "Flüssiger Schmutz",
    id: "Lumpur Cair",
    it: "Fango Liquido",
    ja: "液体の泥",
    ko: "액체 진흙",
    pl: "Ciekły Brud",
    pt: "Lama Líquida",
    ru: "Жидкая земля",
    sv: "Flytande smuts",
    uk: "Рідка земля",
    zh: "液态泥土"
});
Translation.addTranslation("Liquid Dirt Bucket", {
    de: "Eimer mit flüssigem Schmutz",
    id: "Ember Lumpur Cair",
    it: "Secchio di Fango Liquido",
    ja: "液体の泥のバケツ",
    ko: "액체 진흙 양동이",
    pl: "Wiadro Ciekłego Brudu",
    pt: "Balde de Lama Líquida",
    ru: "Ведро жидкой земли",
    sv: "Hink med flytande smuts",
    uk: "Відро рідкої землі",
    zh: "液态泥桶"
});
Translation.addTranslation("Molten Emerald", {
    de: "Geschmolzener Smaragd",
    id: "Zamrud Leleh",
    it: "Smeraldo fuso",
    ja: "溶融したエメラルド",
    ko: "녹은 에메랄드",
    pl: "Stopiony szmaragd",
    pt: "Esmeralda Derretida",
    ru: "Расплавленный изумруд",
    sv: "Nedsmält smaragd",
    uk: "Розплавлений смарагд",
    zh: "熔融绿宝石"
});
Translation.addTranslation("Molten Emerald Bucket", {
    de: "Geschmolzener Smaragdeimer",
    id: "Ember Zamrud Leleh",
    it: "Secchio di smeraldo fuso",
    ja: "溶融したエメラルド入りバケツ",
    ko: "녹은 에메랄드 양동이",
    pl: "Wiadro stopionego szmaragdu",
    pt: "Balde de Esmeralda Derretida",
    ru: "Ведро расплавленного изумруда",
    sv: "Hink med nedsmält smaragd",
    uk: "Відро розплавленого смарагду",
    zh: "熔融绿宝石桶"
});
Translation.addTranslation("Molten Glass", {
    de: "Geschmolzenes Glas",
    id: "Kaca Leleh",
    it: "Vetro fuso",
    ja: "溶融したガラス",
    ko: "녹은 유리",
    pl: "Stopione szkło",
    pt: "Vidro Derretido",
    ru: "Расплавленное стекло",
    sv: "Nedsmält glas",
    uk: "Розплавлене скло",
    zh: "熔融玻璃"
});
Translation.addTranslation("Molten Glass Bucket", {
    de: "Eimer aus geschmolzenem Glas",
    id: "Ember Kaca Leleh",
    it: "Secchio di vetro fuso",
    ja: "溶融したガラス入りバケツ",
    ko: "녹은 유리 양동이",
    pl: "Wiadro stopionego szkła",
    pt: "Balde de Vidro Derretido",
    ru: "Ведро расплавленного стекла",
    sv: "Hink med nedsmält glas",
    uk: "Відро розплавленого скла",
    zh: "熔融玻璃桶"
});
Translation.addTranslation("Blood", { de: "Blut", id: "Blood", it: "Sangue", ja: "血", ko: "피", pl: "Krew", pt: "Sangue", ru: "Кровь", sv: "Blod", uk: "Кров", zh: "血" });
Translation.addTranslation("Bucket o' Blood", {
    de: "Bucket of Blood",
    id: "Ember Darah",
    it: "Secchio di sangue",
    ja: "血液入りバケツ",
    ko: "피 양동이",
    pl: "Wiadro krwi",
    pt: "Balde de Sangue",
    ru: "Ведро крови",
    sv: "Blodhink",
    uk: "Відро крови",
    zh: "血桶"
});
Translation.addTranslation("Liquid Purple Slime", {
    de: "Flüssiger lila Schleim",
    id: "Lumpur Ungu Cair",
    it: "Melma Viola Liquida",
    ja: "液体の紫スライム",
    ko: "액체 보라색 슬라임",
    pl: "Ciekły fioletowy śluz",
    pt: "Lama Roxa Líquida",
    ru: "Жидкая фиолетовая слизь",
    sv: "Flytande lila slem",
    uk: "Рідка фіолетова слизь",
    zh: "液态紫色史莱姆"
});
Translation.addTranslation("Liquid Purple Slime Bucket", {
    de: "Eimer mit flüssigem lila Schleim",
    id: "Ember Lumpur Ungu Cair",
    it: "Secchio di Melma Viola Liquida",
    ja: "液体の紫スライムのバケツ",
    ko: "액체 보라색 슬라임 양동이",
    pl: "Wiadro ciekłego fioletowego śluzu",
    pt: "Balde de Lama Roxa Líquida",
    ru: "Ведро жидкой фиолетовой слизи",
    sv: "Hink med flytande lila slem",
    uk: "Відро рідкої фіолетової слизі",
    zh: "液态紫色史莱姆桶"
});
///
// SMELTERY -> BLOCKS
///
Translation.addTranslation("[TConstuct]: Invalid alloy recipe -> %s", {
    de: "[TConstruct]: Ungültiges Legierungsrezept -> %s",
    id: "[TConstruct]: Resep paduan tidak valid -> %s",
    it: "[TConstruct]: Ricetta di lega non valida -> %s",
    ja: "[TConstruct]: 無効な合金レシピ -> %s",
    ko: "[TConstruct]: 잘못된 합금 레시피 -> %s",
    pl: "[TConstruct]: Nieprawidłowy przepis na stop -> %s",
    pt: "[TConstruct]: Receita de liga inválida -> %s",
    ru: "[TConstruct]: Некорректный рецепт сплава -> %s",
    sv: "[TConstruct]: Ogiltigt legeringsrecept -> %s",
    uk: "[TConstruct]: Некоректний рецепт сплаву -> %s",
    zh: "[TConstruct]: 无效的合金配方 -> %s"
});
Translation.addTranslation("Grout", {
    de: "Mörtel", id: "Grout", it: "Grout", ja: "グラウト", ko: "그라우트",
    pl: "Zaprawa",
    pt: "Grout",
    ru: "Цементный раствор",
    sv: "Grout", uk: "Цемент", zh: "砖泥"
});
Translation.addTranslation("Seared Brick", {
    de: "Angebrannter Ziegel",
    id: "Seared Brick",
    it: "Mattone scottato",
    ja: "焼成レンガ", ko: "그을린 벽돌",
    pl: "Suszona kamienna cegła",
    pt: "Tijolo Carbonizado",
    ru: "Обожженный кирпич",
    sv: "Bränd tegelsten",
    uk: "Обпалена цеглина",
    zh: "焦黑砖"
});
Translation.addTranslation("Seared Stone", {
    de: "Versengter Stein",
    id: "Seared Stone",
    it: "Pietra scottata",
    ja: "焼成石", ko: "그을린 돌",
    pl: "Suszony kamień",
    pt: "Pedra Carbonizada",
    ru: "Обожженный камень",
    sv: "Bränd sten",
    uk: "Обпалений камінь",
    zh: "焦黑石"
});
Translation.addTranslation("Seared Cobblestone", {
    de: "Versengter Kopfsteinpflaster",
    id: "Seared Cobblestone",
    it: "Ciottoli scottati",
    ja: "焼成丸石",
    ko: "그을린 조약돌",
    pl: "Suszony bruk",
    pt: "Pedregulho Carbonizado",
    ru: "Обожженный булыжник",
    sv: "Bränd kullersten",
    uk: "Обпалений кругляк",
    zh: "焦黑圆石"
});
Translation.addTranslation("Seared Paver", {
    de: "Verbrannte Pflastersteine",
    id: "Seared Paver",
    it: "Pavimentazione scottata",
    ja: "舗装された焼成石",
    ko: "매끄러운 그을린 돌",
    pl: "Suszona kafelka chodnikowa",
    pt: "Asfalto Carbonizado",
    ru: "Обожженная брусчатка",
    sv: "Bränd gatsten",
    uk: "Обпалена бруківка",
    zh: "焦黑地砖"
});
Translation.addTranslation("Seared Bricks", {
    de: "Angebrannte Ziegel",
    id: "Seared Bricks",
    it: "Mattoni scottati",
    ja: "焼成レンガ", ko: "그을린 벽돌",
    pl: "Suszone kamienne cegły",
    pt: "Tijolos Carbonizados",
    ru: "Обожженные кирпичи",
    sv: "Bränd mursten",
    uk: "Обпалена цегла",
    zh: "焦黑砖块"
});
Translation.addTranslation("Cracked Seared Bricks", {
    de: "Gebrochene verbrannte Ziegel",
    id: "Cracked Seared Bricks",
    it: "Mattoni scottati incrinati",
    ja: "ひび割れた焼成レンガ",
    ko: "금 간 그을린 벽돌",
    pl: "Popękane suszone kamienne cegły",
    pt: "Tijolos Rachados Carbonizados",
    ru: "Потрескавшиеся обожженные кирпичи",
    sv: "Sprucket bränt tegel",
    uk: "Тріснута обпалена цегла",
    zh: "裂纹焦黑砖块"
});
Translation.addTranslation("Fancy Seared Bricks", {
    de: "Ausgefallene verbrannte Ziegel",
    id: "Fancy Seared Bricks",
    it: "Mattoni scottati di lusso",
    ja: "おしゃれな焼成レンガ",
    ko: "장식된 그을린 벽돌",
    pl: "Ozdobne suszone kamienne cegły",
    pt: "Tijolo Extravagante Carbonizado",
    ru: "Причудливые обожженные кирпичи",
    sv: "Snyggt bränt tegel",
    uk: "Вишукана обпалена цегла",
    zh: "精致焦黑砖块"
});
Translation.addTranslation("Square Seared Bricks", {
    de: "Quadratische gebrannte Ziegel",
    id: "Bata Bakar Kotak",
    it: "Mattoni Bruciati Quadrati",
    ja: "焼き締められた四角いレンガ",
    ko: "사각형 모양의 구운 벽돌",
    pl: "Kwadratowe wypalone cegły",
    pt: "Tijolos Queimados Quadrados",
    ru: "Квадратные обожженные кирпичи",
    sv: "Kvadratiska brända tegelstenar",
    uk: "Квадратні випалені цегли",
    zh: "方形烧制砖块"
});
Translation.addTranslation("Seared Road", {
    de: "Gebrannte Straße",
    id: "Jalan Bakar",
    it: "Strada Bruciata",
    ja: "焼き締められた道",
    ko: "구운 도로",
    pl: "Wypalona droga",
    pt: "Estrada Queimada",
    ru: "Обожженная тропа",
    sv: "Bränd väg",
    uk: "Випалена дорога",
    zh: "烧制道路"
});
Translation.addTranslation("Seared Creeperface", {
    de: "Gebranntes Creeper-Gesicht",
    id: "Wajah Creeper Bakar",
    it: "Faccia di Creeper Bruciata",
    ja: "焼き締められたクリーパーの顔",
    ko: "구운 크리퍼 얼굴",
    pl: "Wypalona twarz Creepera",
    pt: "Rosto Queimado do Creeper",
    ru: "Обожженная резная брусчатка",
    sv: "Bränd Creeperansikte",
    uk: "Випалене обличчя Кріпера",
    zh: "烧制苦力怕脸"
});
Translation.addTranslation("Triangle Seared Bricks", {
    de: "Dreieck angebratene Ziegel",
    id: "Triangle Seared Bricks",
    it: "Triangolo di mattoni scottati",
    ja: "三角柄の焼成レンガ",
    ko: "조각된 그을린 벽돌",
    pl: "Trójkątne suszone kamienne cegły",
    pt: "Tijolo Triangular Carbonizado",
    ru: "Треугольные обожженные кирпичи",
    sv: "Bränt tegel med triangelmönster",
    uk: "Трикутна обпалена цегла",
    zh: "三角纹焦黑砖块"
});
Translation.addTranslation("Small Seared Bricks", {
    de: "Kleine gebrannte Ziegel",
    id: "Bata Bakar Kecil",
    it: "Mattoncini Bruciati",
    ja: "焼き締められた小さなレンガ",
    ko: "작은 구운 벽돌",
    pl: "Małe wypalone cegły",
    pt: "Tijolos Queimados Pequenos",
    ru: "Обожженные кирпичики",
    sv: "Små brända tegelstenar",
    uk: "Випалені цеглики",
    zh: "小烧制砖块"
});
Translation.addTranslation("Seared Tiles", {
    de: "Gebrannte Fliesen",
    id: "Lantai Bakar",
    it: "Piastrelle Bruciate",
    ja: "焼き締められたタイル",
    ko: "구운 타일",
    pl: "Wypalone płytki",
    pt: "Azulejos Queimados",
    ru: "Обожженная плитка",
    sv: "Brända plattor",
    uk: "Випалена плитка",
    zh: "烧制瓷砖"
});
Translation.addTranslation("Seared Tanks", {
    de: "Gebrannte Tanks",
    id: "Tangki Bakar",
    it: "Serbatoi Bruciati",
    ja: "焼き締められたタンク",
    ko: "구운 탱크",
    pl: "Wypalone zbiorniki",
    pt: "Tanques Queimados",
    ru: "Обоженные резервуары",
    sv: "Brända tankar",
    uk: "Випалені резервуари",
    zh: "烧制储罐"
});
Translation.addTranslation("Seared Fuel Tank", {
    de: "Versengter Kraftstofftank",
    id: "Seared Fuel Tank",
    it: "Serbatoio di carburante scottato",
    ja: "焼成石の燃料タンク",
    ko: "그을린 연료 탱크",
    pl: "Suszony kamienny zbiornik paliwowy",
    pt: "Tanque de Combustivel Carbonizado",
    ru: "Обожженный жидкостный резервуар",
    sv: "Bränd bränsletank",
    uk: "Обпалений паливний резервуар",
    zh: "焦黑燃料储罐"
});
Translation.addTranslation("Seared Fuel Gauge", {
    de: "Versengte Tankanzeige",
    id: "Seared Fuel Gauge",
    it: "Indicatore del carburante scottato",
    ja: "焼成石の燃料ゲージ",
    ko: "그을린 연료 계기 탱크",
    pl: "Suszony kamienny mierniczy zbiornik paliwowy",
    pt: "Indicador de Combustivel Carbonizado",
    ru: "Обожженный топливомерный резервуар",
    sv: "Bränd bränslemätare",
    uk: "Обпалений паливний вимірювач",
    zh: "焦黑燃料量器"
});
Translation.addTranslation("Seared Ingot Tank", {
    de: "Versengter Barrentank",
    id: "Seared Ingot Tank",
    it: "Serbatoio del lingotto scottato",
    ja: "焼成石のインゴットタンク",
    ko: "그을린 금속 탱크",
    pl: "Suszony kamienny zbiornik na metale",
    pt: "Tanque de Lingote Carbonizado",
    ru: "Обожженный резервуар для слитков",
    sv: "Bränd tackatank",
    uk: "Обпалений злитковий резервуар",
    zh: "焦黑材料储罐"
});
Translation.addTranslation("Seared Ingot Gauge", {
    de: "Seared Barrenlehre",
    id: "Seared Ingot Gauge",
    it: "Indicatore del lingotto scottato",
    ja: "焼成石のインゴットゲージ",
    ko: "그을린 금속 계기 탱크",
    pl: "Suszony kamienny zbiornik mierniczy na metale",
    pt: "Medidor de Lingote Carbonizado",
    ru: "Обожженный слиткомерный резервуар",
    sv: "Bränd tackamätare",
    uk: "Обпалений злитковий вимірювач",
    zh: "焦黑材料量器"
});
Translation.addTranslation("Seared Drain", {
    de: "Versengter Abfluss",
    id: "Seared Drain",
    it: "Scolo scottato",
    ja: "焼成石のドレン",
    ko: "그을린 배출구",
    pl: "Suszony kamienny odpływ",
    pt: "Escorrimento Carbonizado",
    ru: "Обожженный слив",
    sv: "Bränd brunn",
    uk: "Випалений злив",
    zh: "焦黑排液孔"
});
Translation.addTranslation("Seared Faucet", {
    de: "Versengter Wasserhahn",
    id: "Seared Faucet",
    it: "Rubinetto scottato",
    ja: "焼成石の蛇口",
    ko: "그을린 주조용 꼭지",
    pl: "Suszona kamienna rynna",
    pt: "Torneira Carbonizada",
    ru: "Обожженный кран",
    sv: "Bränd kran",
    uk: "Обпалений кран",
    zh: "焦黑浇注口"
});
Translation.addTranslation("Casting Table", {
    de: "Gießtisch",
    id: "Casting Table",
    it: "Tavolo di fusione",
    ja: "鋳造台", ko: "주조대",
    pl: "Stół odlewniczy",
    pt: "Mesa de Fundição",
    ru: "Литейный стол",
    sv: "Avgjutningsbänk",
    uk: "Ливарний стіл",
    zh: "铸件台"
});
Translation.addTranslation("Casting Basin", {
    de: "Gießbecken",
    id: "Casting Basin",
    it: "Bacinella di fusione",
    ja: "鋳造鉢", ko: "쇳물받이",
    pl: "Kocioł odlewniczy",
    pt: "Bacia de Fundição",
    ru: "Литейный резервуар",
    sv: "Avgjutningskar",
    uk: "Ливарний резервуар",
    zh: "铸造盆"
});
Translation.addTranslation("Smeltery Controller", {
    de: "Schmelzsteuerung",
    id: "Smeltery Controller",
    it: "Controllore della fonderia",
    ja: "乾式製錬炉コントローラー",
    ko: "제련소 관리기",
    pl: "Kontroler pieca metalurgicznego",
    pt: "Controlador de fundição",
    ru: "Контроллер плавильни",
    sv: "Smältverkskontroll",
    uk: "Контролер плавильні",
    zh: "冶炼炉控制器"
});
Translation.addTranslation("Smeltery", {
    de: "Schmelzerei",
    id: "Smeltery",
    it: "Fonderia",
    ja: "乾式製錬炉", ko: "제련소",
    pl: "Piec metalurgiczny",
    pt: "Fundição",
    ru: "Плавильня",
    sv: "Smältverk",
    uk: "Плавильня",
    zh: "冶炼炉"
});
Translation.addTranslation("Dump", {
    de: "Entsorgen",
    id: "Buang",
    it: "Svuota",
    ja: "ダンプ",
    ko: "버리기",
    pl: "Wyrzuć",
    pt: "Descartar",
    ru: "Слив",
    sv: "Dumpa",
    uk: "Скинути",
    zh: "倾倒"
});
Translation.addTranslation("Invalid block inside the structure", {
    de: "Ungültiger Block innerhalb der Struktur",
    id: "Invalid block inside the structure",
    it: "Blocco non valido all'interno della struttura",
    ja: "構造内に無効なブロックがあります",
    ko: "구조물 내부의 블록이 잘못되었습니다",
    pl: "Nieprawidłowy blok we wnętrzu struktury",
    pt: "Bloco inválido dentro da estrutura",
    ru: "Недопустимый блок внутри структуры",
    sv: "Ogiltigt block inuti strukturen",
    uk: "Invalid block inside the structure",
    zh: "结构内部存在无效方块"
});
///
// RESOURCES
///
Translation.addTranslation("Ores", {
    de: "Erze",
    id: "Batu",
    it: "Minerali",
    ja: "鉱石",
    ko: "광석",
    pl: "Rudy",
    pt: "Minérios",
    ru: "Руды",
    sv: "Malm",
    uk: "Руди",
    zh: "矿石"
});
Translation.addTranslation("Cobalt Ore", {
    de: "Kobalterz",
    id: "Batu Kobalt",
    it: "Minerale di Cobalto",
    ja: "コバルト鉱石",
    ko: "코발트 광석",
    pl: "Ruda Kobaltu",
    pt: "Minério de Cobalto",
    ru: "Кобальтовая руда",
    sv: "Koboltmalm",
    uk: "Кобальтова руда",
    zh: "钴矿石"
});
Translation.addTranslation("Ardite Ore", {
    de: "Arditerz",
    id: "Batu Ardite",
    it: "Minerale di Ardite",
    ja: "アルダイト鉱石",
    ko: "아르다이트 광석",
    pl: "Ruda Ardytu",
    pt: "Minério de Ardite",
    ru: "Ардитовая руда",
    sv: "Arditmalm",
    uk: "Ардитова руда",
    zh: "阿迪特矿石"
});
Translation.addTranslation("Block of Knightslime", {
    de: "Knightslime-Block",
    id: "Blok Knightslime",
    it: "Blocco di slime del cavaliere",
    ja: "ナイトスライムブロック",
    ko: "기사슬라임 블록",
    pl: "Blok rycerskiego szlamu",
    pt: "Bloco de Cavaleiro-Slime",
    ru: "Блок слизи из короля слизней",
    sv: "Riddarslemsblock",
    uk: "Блок лицарського слизу",
    zh: "骑士史莱姆块"
});
Translation.addTranslation("Block of Cobalt", {
    de: "Kobaltblock",
    id: "Block Kobalt",
    it: "Blocco di cobalto",
    ja: "コバルトブロック",
    ko: "코발트 블록",
    pl: "Blok kobaltu",
    pt: "Bloco de Cobalto",
    ru: "Кобальтовый блок",
    sv: "Koboltblock",
    uk: "Кобальтовий блок",
    zh: "钴块"
});
Translation.addTranslation("Block of Ardite", {
    de: "Arditblock",
    id: "Blok Ardite",
    it: "Blocco di Ardite",
    ja: "アルダイトブロック",
    ko: "아르다이트 블록",
    pl: "Blok Ardytu",
    pt: "Bloco de Ardite",
    ru: "Ардитовый блок",
    sv: "Arditblock",
    uk: "Ардитовий блок",
    zh: "阿迪特方块"
});
Translation.addTranslation("Block of Manyullyn", {
    de: "Block von Manyullyn",
    id: "Blok Manyullyn",
    it: "Blocco di Manyullyn",
    ja: "マンユリンブロック",
    ko: "마뉼린",
    pl: "Block Manyullynu",
    pt: "Bloco de Manyullyn",
    ru: "Блок манюллина",
    sv: "Manyullynblock",
    uk: "Маньюліновий блок",
    zh: "玛玉灵块"
});
Translation.addTranslation("Block of Pigiron", {
    de: "Roheisenblock",
    id: "Blok Besi Gubal",
    it: "Blocco di ferro di maiale",
    ja: "銑鉄ブロック",
    ko: "돼지 선철 블록",
    pl: "Blok świńskiego żelaza",
    pt: "Bloco de Ferro-Porco",
    ru: "Чугунный блок",
    sv: "Grisjärnsblock",
    uk: "Блок свинячого заліза",
    zh: "生铁块"
});
Translation.addTranslation("Block of Aluminum Brass", {
    de: "Block aus Aluminiumbronze",
    id: "Blok Perunggu Aluminium",
    it: "Blocco di Bronzo Alluminio",
    ja: "アルミニウムブロンズブロック",
    ko: "알루미늄 브론즈 블록",
    pl: "Blok Brązu Aluminium",
    pt: "Bloco de Bronze de Alumínio",
    ru: "Блок алюминиевой бронзы",
    sv: "Block av Aluminiumbrons",
    uk: "Блок алюмінієвого бронзи",
    zh: "铝青铜方块"
});
Translation.addTranslation("Knightslime Ingot", {
    de: "Knightslime-Barren",
    id: "Batangan Knightslime",
    it: "Lingotto di slime del cavaliere",
    ja: "ナイトスライムインゴット",
    ko: "기사슬라임 주괴",
    pl: "Sztabka rycerskiego szlamu",
    pt: "Lingote de Cavaleiro-Slime",
    ru: "Слизневый слиток из короля слизней",
    sv: "Riddarslemstacka",
    uk: "Злиток лицарського слизу",
    zh: "骑士史莱姆锭"
});
Translation.addTranslation("Cobalt Ingot", {
    de: "Kobaltbarren",
    id: "Batangan Kobalt",
    it: "Lingotto di cobalto",
    ja: "コバルトインゴット",
    ko: "코발트 주괴",
    pl: "Sztabka kobaltu",
    pt: "Lingote de Cobalto",
    ru: "Кобальтовый слиток",
    sv: "Kobolttacka",
    uk: "Кобальтовий злиток",
    zh: "钴锭"
});
Translation.addTranslation("Ardite Ingot", {
    de: "Arditbarren",
    id: "Bilah Ardite",
    it: "Lingotto di Ardite",
    ja: "アルダイトインゴット",
    ko: "아르다이트 주괴",
    pl: "Sztabka Ardytu",
    pt: "Lingote de Ardite",
    ru: "Ардитовый слиток",
    sv: "Arditbar",
    uk: "Ардитовий слиток",
    zh: "阿迪特锭"
});
Translation.addTranslation("Manyullyn Ingot", {
    de: "Manyullyn-Barren",
    id: "Batangan Manyullyn",
    it: "Lingotto di Manyullyn",
    ja: "マンユリンインゴット",
    ko: "마뉼린 주괴",
    pl: "Sztabka Manyullynu",
    pt: "Lingote de Manyullyn",
    ru: "Слиток манюллина",
    sv: "Manyullyntacka",
    uk: "Маньюліновий злиток",
    zh: "玛玉灵锭"
});
Translation.addTranslation("Pigiron Ingot", {
    de: "Roheisenbarren",
    id: "Batangan Besi Gubal",
    it: "Lingotto Di ferro di maiale",
    ja: "銑鉄インゴット",
    ko: "돼지 선철 주괴",
    pl: "Sztabka świńskiego żelaza",
    pt: "Lingote de Ferro-Porco",
    ru: "Чугунный слиток",
    sv: "Grisjärnstacka",
    uk: "Злиток свинячого заліза",
    zh: "生铁锭"
});
Translation.addTranslation("Aluminum Brass Ingot", {
    de: "Aluminiumbronze-Barren",
    id: "Bilah Perunggu Aluminium",
    it: "Lingotto di Bronzo Alluminio",
    ja: "アルミニウムブロンズインゴット",
    ko: "알루미늄 브론즈 주괴",
    pl: "Sztabka Brązu Aluminium",
    pt: "Lingote de Bronze de Alumínio",
    ru: "Слиток алюминиевой бронзы",
    sv: "Aluminiumbronsbar",
    uk: "Слиток алюмінієвого бронзи",
    zh: "铝青铜锭"
});
Translation.addTranslation("Knightslime Nugget", {
    de: "Knightslime-Nugget",
    id: "Nugget Knightslime",
    it: "Pepita di slime del cavaliere",
    ja: "ナイトスライム塊",
    ko: "기사슬라임 조각",
    pl: "Bryłka rycerskiego szlamu",
    pt: "Pepita de Cavaleiro-Slime",
    ru: "Слизневый самородок из короля слизней",
    sv: "Riddarslemsklimp",
    uk: "Шматочок лицарського слизу",
    zh: "骑士史莱姆粒"
});
Translation.addTranslation("Cobalt Nugget", {
    de: "Kobalt-Nugget",
    id: "Nugget Kobalt",
    it: "Pepita di cobalto",
    ja: "コバルト塊", ko: "코발트 조각",
    pl: "Bryłka kobaltu",
    pt: "Pepita de Cobalto",
    ru: "Кобальтовый самородок",
    sv: "Koboltklimp",
    uk: "Кобальтовий самородок",
    zh: "钴粒"
});
Translation.addTranslation("Ardite Nugget", {
    de: "Ardit-Nugget",
    id: "Nugget Ardite",
    it: "Pepita di Ardite",
    ja: "アルダイトナゲット",
    ko: "아르다이트 너겟",
    pl: "Nugget Ardytu",
    pt: "Nugget de Ardite",
    ru: "Ардитовый самородок",
    sv: "Arditnugget",
    uk: "Ардитовий самородок",
    zh: "阿迪特金块"
});
Translation.addTranslation("Manyullyn Nugget", {
    de: "Manyullyn-Nugget",
    id: "Nugget Manyullyn",
    it: "Pepita di Manyullyn",
    ja: "マンユリン塊", ko: "마뉼린 조각",
    pl: "Bryłka Manyullynu",
    pt: "Pepita de Manyullyn",
    ru: "Манюллиновый самородок",
    sv: "Manyullynklimp",
    uk: "Шматочок маньюліну",
    zh: "玛玉灵粒"
});
Translation.addTranslation("Pigiron Nugget", {
    de: "Roheisennugget",
    id: "Nugget Besi Gubal",
    it: "Pepita di ferro di maiale",
    ja: "銑鉄塊",
    ko: "돼지 선철 조각",
    pl: "Bryłka świńskiego żelaza",
    pt: "Pepita de Ferro-Porco",
    ru: "Чугунный самородок",
    sv: "Grisjärnsklimp",
    uk: "Шматочок свинячого заліза",
    zh: "生铁粒"
});
Translation.addTranslation("Aluminum Brass Nugget", {
    de: "Aluminiumbronze-Nugget",
    id: "Nugget Perunggu Aluminium",
    it: "Pepita di Bronzo Alluminio",
    ja: "アルミニウムブロンズナゲット",
    ko: "알루미늄 브론즈 너겟",
    pl: "Nugget Brązu Aluminium",
    pt: "Nugget de Bronze de Alumínio",
    ru: "Самородок алюминиевой бронзы",
    sv: "Aluminiumbronsnugget",
    uk: "Самородок алюмінієвого бронзи",
    zh: "铝青铜金块"
});
Translation.addTranslation("Paper Stack", {
    de: "Papierstapel",
    id: "Tumpukan Kertas",
    it: "Pila di Carta",
    ja: "紙の束",
    ko: "종이 묶음",
    pl: "Stos Papieru",
    pt: "Pilha de Papel",
    ru: "Стопка бумаги",
    sv: "Pappersbunt",
    uk: "Стопка паперу",
    zh: "纸堆"
});
Translation.addTranslation("Lavawood", {
    de: "Lavaholz",
    id: "Kayu Lava",
    it: "Legno di lava",
    ja: "ラヴァウッド", ko: "용암나무",
    pl: "Lawowe drewno",
    pt: "Lavawood",
    ru: "Лавадерево",
    sv: "Lavaträ",
    uk: "Лаводерево",
    zh: "熔岩木"
});
Translation.addTranslation("Blue Slime", {
    de: "Blaue Schleimkugel",
    id: "Slime Biru",
    it: "Slime Blu",
    ja: "青いスライム",
    ko: "파란 슬라임",
    pl: "Niebieski szlam",
    pt: "Slime Azul",
    ru: "Синяя слизь",
    sv: "Blå slem",
    uk: "Синя слиз"
});
Translation.addTranslation("Purple Slime", {
    de: "Lila Schleimkugel",
    id: "Slime Ungu",
    it: "Slime Viola",
    ja: "紫のスライム",
    ko: "보라색 슬라임",
    pl: "Fioletowy szlam",
    pt: "Slime Roxo",
    ru: "Фиолетовая слизь",
    sv: "Lila slem",
    uk: "Фіолетова слизь"
});
Translation.addTranslation("Slimy Mud", {
    de: "Schleimiger Schlamm",
    id: "Lumpur Lendir",
    it: "Fango Viscido",
    ja: "ぬめぬめ泥",
    ko: "끈적끈적한 진흙",
    pl: "Śliski błoto",
    pt: "Lama Pegajosa",
    ru: "Склизкая грязь",
    sv: "Klibbigt gyttja",
    uk: "Склизька грязь"
});
Translation.addTranslation("Blue Slimy Mud", {
    de: "Blauer schleimiger Schlamm",
    id: "Lumpur Lendir Biru",
    it: "Fango Viscido Blu",
    ja: "青いぬめぬめ泥",
    ko: "파란 끈적끈적한 진흙",
    pl: "Niebieskie śliskie błoto",
    pt: "Lama Pegajosa Azul",
    ru: "Синяя склизкая грязь",
    sv: "Blå klibbigt gyttja",
    uk: "Синя склизька грязь"
});
Translation.addTranslation("Magma Slimy Mud", {
    de: "Magmahaftender Schlamm",
    id: "Lumpur Lava Lendir",
    it: "Fango Viscido di Magma",
    ja: "マグマのぬめぬめ泥",
    ko: "마그마 끈적끈적한 진흙",
    pl: "Śliskie błoto magmy",
    pt: "Lama Pegajosa de Magma",
    ru: "Склизкая грязь из магмы",
    sv: "Magma klibbigt gyttja",
    uk: "Склизька грязь з магми"
});
Translation.addTranslation("Slime Crystal", {
    de: "Schleimkristall",
    id: "Kristal Slime",
    it: "Cristallo di Slime",
    ja: "スライムクリスタル",
    ko: "슬라임 크리스탈",
    pl: "Kryształ szlamu",
    pt: "Cristal de Slime",
    ru: "Слизневый кристалл",
    sv: "Slemkristall",
    uk: "Слизовий кристал"
});
Translation.addTranslation("Blue Slime Crystal", {
    de: "Blauer Schleimkristall",
    id: "Kristal Slime Biru",
    it: "Cristallo di Slime Blu",
    ja: "青いスライムクリスタル",
    ko: "파란 슬라임 크리스탈",
    pl: "Niebieski kryształ szlamu",
    pt: "Cristal de Slime Azul",
    ru: "Синий слизневый кристалл",
    sv: "Blå slemkristall",
    uk: "Синій слизовий кристал"
});
Translation.addTranslation("Magma Slime Crystal", {
    de: "Magmaschleimkristall",
    id: "Kristal Slime Magma",
    it: "Cristallo di Slime di Magma",
    ja: "マグマスライムクリスタル",
    ko: "마그마 슬라임 크리스탈",
    pl: "Kryształ szlamu magmy",
    pt: "Cristal de Slime de Magma",
    ru: "Слизневый кристалл из магмы",
    sv: "Magma Slemkristall",
    uk: "Слизовий кристал з магми",
    zh: "岩浆史莱姆结晶"
});
Translation.addTranslation("Clear Glass", {
    de: "Klares Glas",
    id: "Kaca Bersih",
    it: "Vetro limpido",
    ja: "クリアガラス", ko: "투명한 유리",
    pl: "Czyste szkło",
    pt: "Vidro Claro",
    ru: "Прозрачное стекло",
    sv: "Genomskinligt glas",
    uk: "Чисте скло",
    zh: "通透玻璃"
});
Translation.addTranslation("Seared Glass", {
    de: "Seared Glass",
    id: "Seared Glass",
    it: "Vetro scottato",
    ja: "焼成ガラス", ko: "그을린 유리",
    pl: "Szkło hartowane",
    pt: "Vidro Carbonizado",
    ru: "Обожженное стекло",
    sv: "Bränt glas",
    uk: "Обпалене скло",
    zh: "焦黑玻璃"
});
///
// PATTERNS
///
Translation.addTranslation("Pattern", {
    de: "Muster",
    id: "Pattern",
    it: "Modello",
    ja: "パターン", ko: "나무 틀",
    pl: "Szablon",
    pt: "Moldes", ru: "Шаблон",
    sv: "Mönster",
    uk: "Шаблон", zh: "模具"
});
Translation.addTranslation("TConstruct: Sand Cast", {
    id: "TConstruct: Cetak Pasir",
    it: "TConstruct: Colata di Sabbia",
    ja: "TConstruct: 砂型",
    ko: "TConstruct: 모래 폼",
    pl: "TConstruct: Piasek Odlewany",
    pt: "TConstruct: Molde de Areia",
    ru: "TConstruct: Песочные формы",
    sv: "TConstruct: Sand Formar",
    uk: "TConstruct: Піщаний ливар",
    zh: "TConstruct: 沙形"
});
Translation.addTranslation("Blank Sand Cast", {
    de: "Leerer Sandguss",
    id: "Tuangan Pasir Kosong",
    it: "Stampo di sabbia vuoto",
    ja: "空の砂型",
    ko: "비어있는 모래 금형",
    pl: "Pusta piaskowa forma",
    pt: "Molde de Areia Vazio",
    ru: "Песочный шаблон",
    sv: "Blank sandavgjutning",
    uk: "Пуста піщана форма",
    zh: "空白沙子铸模"
});
Translation.addTranslation("Pickaxe Head Sand Cast", {
    id: "Bagian Alat Penggaruk Heading Sand Cast",
    it: "Testa Pala Sand Cast",
    ja: "採鉱具首 Sand Cast",
    ko: "곡괭이 머리 Form Sand Cast",
    pl: "Głowa Młota Piaskowej Formy",
    pt: "Cabeça da Pá Sand Cast",
    ru: "Песочная форма для наконечника кирки",
    sv: "Sandform för Skärbräda Huvud",
    uk: "Санд-форми для основи кирки",
    zh: "挖掘头 Sand Cast 模具"
});
Translation.addTranslation("Shovel Head Sand Cast", {
    id: "Bagian Alat Lampu Sand Cast",
    it: "Testa Pala Sand Cast",
    ja: "シャVEL首 Sand Cast",
    ko: "삽 머리 Form Sand Cast",
    pl: "Głowa Łopaty Piaskowej Formy",
    pt: "Cabeça do Pá Sand Cast",
    ru: "Песочная форма для наконечника лопаты",
    sv: "Sandform för Spade Huvud",
    uk: "Санд-форми для основи лопати",
    zh: "铲子头 Sand Cast 模具"
});
Translation.addTranslation("Axe Head Sand Cast", {
    id: "Bagian Alat Capitan Sand Cast",
    it: "Testa Ascia Sand Cast",
    ja: "アクス首 Sand Cast",
    ko: "도끼 머리 Form Sand Cast",
    pl: "Topór Głowy Piaskowej Formy",
    pt: "Cabeça do Machado Sand Cast",
    ru: "Песочная форма для наконечника топора",
    sv: "Sandform för Yxa Huvud",
    uk: "Санд-форми для основи сокири",
    zh: "斧头 Sand Cast 模具"
});
Translation.addTranslation("Broad Axe Head Sand Cast", {
    de: "Breiter Axtkopf im Sandguss",
    id: "Tuangan Kepala Kapak Lebar Pasir",
    it: "Stampo di sabbia per teste di ascia grande",
    ja: "大斧頭の砂型",
    ko: "넓은면 도끼 머리 모래 금형",
    pl: "Piaskowa forma szerokiej głowicy siekiery",
    pt: "Molde de Areia para Cabeça de Machado Grande",
    ru: "Песочная форма для наконечника секиры",
    sv: "Sandavgjutning för bredyxhuvud",
    uk: "Піщана форма для наконечника сокири-колуна",
    zh: "板斧刃沙子铸模"
});
Translation.addTranslation("Sword Blade Head Sand Cast", {
    id: "Kepala Pisau Sand Cast",
    it: "Lama della Spada Sand Cast",
    ja: "剣刀首 Sand Cast",
    ko: "검 날개 Form Sand Cast",
    pl: "Miecz Klingi Piaskowej Formy",
    pt: "Lâmina da Espada Sand Cast",
    ru: "Песочная форма для лезвия меча",
    sv: "Sandform för Svärdsspets",
    uk: "Санд-форми для клинка меча",
    zh: "剑刃 Sand Cast 模具"
});
Translation.addTranslation("Hammer Head Sand Cast", {
    de: "Hammerkopf im Sandguss",
    id: "Tuangan Kepala Palu Pasir",
    it: "Stampo di sabbia per testa di martello",
    ja: "ハンマー頭の砂型",
    ko: "망치 머리 모래 금형",
    pl: "Piaskowa forma głowicy młota",
    pt: "Molde de Areia para Cabeça de Martelo",
    ru: "Песочная форма для наконечника молота",
    sv: "Sandavgjutning för hammarhuvud",
    uk: "Піщана форма для наконечника молота",
    zh: "锤头沙子铸模"
});
Translation.addTranslation("Excavator Head Sand Cast", {
    id: "Eksavator Bagian Ranjang Sand Cast",
    it: "Testa Escavatore Sand Cast",
    ja: "エキサベータ頭 Sand Cast",
    ko: "고 grader 부 Form Sand Cast",
    pl: "Ładowarki Świadła Piaskowej Formy",
    pt: "Cabeça do Escavador Sand Cast",
    ru: "Песочная форма для наконечника экскаватора",
    sv: "Sandform för Grävmaskinsdelen",
    uk: "Санд-форми для екскаваторного обладнання",
    zh: "掘进机头 Sand Cast 模具"
});
Translation.addTranslation("Tool Rod Sand Cast", {
    id: "Rod Alat Sand Cast",
    it: "Manico Attrezzo Sand Cast",
    ja: "ツールロッド Sand Cast",
    ko: "도구 융 Form Sand Cast",
    pl: "Narzędzie Rączki Piaskowej Formy",
    pt: "Haste de Ferramenta Sand Cast",
    ru: "Песочная форма для рукоятки инструмента",
    sv: "Sandform för Verktygsstång",
    uk: "Санд-форми для інструментальної ручки",
    zh: "工具杆 Sand Cast 模具"
});
Translation.addTranslation("Tough Tool Rod Sand Cast", {
    id: "Rod Alat Tebal Sand Cast",
    it: "Manico Strumento Robusto Sand Cast",
    ja: "強いツールロッド Sand Cast",
    ko: "튼튼한 도구 융 Form Sand Cast",
    pl: "Silna Narzędziowa Rączka Piaskowej Formy",
    pt: "Haste de Ferramenta Forte Sand Cast",
    ru: "Песочная форма для крепкой рукоятки инструмента",
    sv: "Sandform för robusta verktygshylsan",
    uk: "Сильна санд-форми для інструментальної ручки",
    zh: "强大的工具杆 Sand Cast 模具"
});
Translation.addTranslation("Binding Sand Cast", {
    id: "Bindings Sand Cast",
    it: "Fissaggio Sand Cast",
    ja: "バインディング Sand Cast",
    ko: "묶음 Form Sand Cast",
    pl: "Sklejanie Piaskowej Formy",
    pt: "Fixação Sand Cast",
    ru: "Песочная форма для крепления",
    sv: "Sandform för Bundering",
    uk: "Санд-форми для з'єднань",
    zh: "固定 Sand Cast 模具"
});
Translation.addTranslation("Tough Binding Sand Cast", {
    id: "Bindings Kuat Sand Cast",
    it: "Fissaggio Robusto Sand Cast",
    ja: "強力なバインディング Sand Cast",
    ko: "강력한 묶음 Form Sand Cast",
    pl: "Mocne Sklejanie Piaskowej Formy",
    pt: "Fixação Forte Sand Cast",
    ru: "Песочная форма для крепкого крепления",
    sv: "Sandform för stark bundering",
    uk: "Сильна санд-форми для з'єднань",
    zh: "强固的固定 Sand Cast 模具"
});
Translation.addTranslation("Wide Guard Sand Cast", {
    id: "Penghalang Lebar Sand Cast",
    it: "Guardia Larga Sand Cast",
    ja: "ワイドガード Sand Cast",
    ko: "워이드가드 Form Sand Cast",
    pl: "Szeroka Ochrona Piaskowej Formy",
    pt: "Guarda Larga Sand Cast",
    ru: "Песочная форма для широкой карды",
    sv: "Sandform für bredd skydd",
    uk: "Широкий захист Санд-форми",
    zh: "宽 Protection Sand Cast 模具"
});
Translation.addTranslation("Large Plate Sand Cast", {
    de: "Sandguss für große Platten",
    id: "Tuangan Piringan Besar Pasir",
    it: "Stampo di sabbia per piastre grande",
    ja: "大板の砂型",
    ko: "큰 플레이트 모래 금형",
    pl: "Piaskowa forma dużej płyty",
    pt: "Molde de Areia para Placa Larga ",
    ru: "Песочная форма для большой пластины",
    sv: "Sandavgjutning för stor plåt",
    uk: "Піщана форма для великої пластини",
    zh: "大板沙子铸模"
});
Translation.addTranslation("Ingot Sand Cast", {
    de: "Barren-Sandguss",
    id: "Tuangan Batangan Pasir",
    it: "Stampo di sabbia per lingotti",
    ja: "インゴットの砂型",
    ko: "주괴 모래 금형",
    pl: "Piaskowa forma sztabki",
    pt: "Molde de Areia para Lingotes",
    ru: "Песочная форма для слитка",
    sv: "Sandavgjutning för tacka",
    uk: "Піщана форма для злитка",
    zh: "锭沙子铸模"
});
Translation.addTranslation("Nugget Sand Cast", {
    de: "Nugget-Sandguss",
    id: "Tuangan Nugget Pasir",
    it: "Stampo di sabbia per pepite",
    ja: "塊の砂型",
    ko: "조각 모래 금형",
    pl: "Piaskowa forma bryłki",
    pt: "Molde de Areia para Pepitas",
    ru: "Песочная форма для самородка",
    sv: "Sandavgjutning för klimp",
    uk: "Піщана форма для шматочка",
    zh: "粒沙子铸模"
});
Translation.addTranslation("Gem Sand Cast", {
    de: "Edelstein-Sandguss",
    id: "Tuangan Permata Pasir",
    it: "Stampo di sabbia per gemme",
    ja: "宝石の砂型",
    ko: "보석 모래 금형",
    pl: "Piaskowa forma klejnotu",
    pt: "Molde de Areia para Gemas",
    ru: "Песочная форма для самоцвета",
    sv: "Sandavgjutning för ädelsten",
    uk: "Піщана форма для самоцвіту",
    zh: "宝石沙子铸模"
});
Translation.addTranslation("Plate Sand Cast", {
    id: "Piring Pasir Sand Cast",
    it: "Piastrella Sabbia Fusione",
    ja: "プレート Sand Cast",
    ko: "판 Form Sand Cast",
    pl: "Blacha Piaskowej Formy",
    pt: "Prancha Sand Cast",
    ru: "Песочная форма для пластины",
    sv: "Sandform för Plåt",
    uk: "Латунна Плита Санд-форми",
    zh: "板 Sand Cast 模具"
});
Translation.addTranslation("Gear Sand Cast", {
    de: "Zahnrad-Sandguss",
    id: "Tuangan Gir Pasir",
    it: "Stampo di sabbia per ingranaggi",
    ja: "歯車の砂型",
    ko: "톱니 모래 금형",
    pl: "Piaskowa forma koła zębatego",
    pt: "Molde de Areia para Engrenagem",
    ru: "Песочная форма для шестерни",
    sv: "Sandavgjutning för kugghjul",
    uk: "Піщана форма для шестірні",
    zh: "齿轮沙子铸模"
});
Translation.addTranslation("TConstruct: Clay Cast", {
    id: "TConstruct: Bentuk Tanah Liat",
    it: "TConstruct: Modelli di Argilla",
    ja: "TConstruct：クレYフォーム",
    ko: "TConstruct: 수lad형",
    pl: "TConstruct: Glina Odlewów",
    pt: "TConstruct: Modelos de Barro",
    ru: "TConstruct: Глиняные формы",
    sv: "TConstruct: Lerskulpturer",
    uk: "TConstruct: Літійні форми",
    zh: "TConstruct: 陶器模具"
});
Translation.addTranslation("Pickaxe Head Clay Cast", {
    id: "Bentuk Tanah Liat Untuk Kepekaan Palu",
    it: "Modello d'Argilla per la Testa Piccone",
    ja: "クレYピッカヘッド",
    ko: "곡괭이 헤드 수lad형",
    pl: "Glina Głowicy Kilofa",
    pt: "Modelo de Enxó de Barro",
    ru: "Глиняная форма для наконечника кирки",
    sv: "Lergjutning av skaft till yxa",
    uk: "Літійна форма сокири",
    zh: "铲头陶器模具"
});
Translation.addTranslation("Shovel Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk kepalanya Palet",
    it: "Modello d'Argilla per la Testa Zappa",
    ja: "ショVELHEADクレY",
    ko: "삽 헤드 수lad형",
    pl: "Glina Łopaty",
    pt: "Modelo de Pá Mineração de Barro",
    ru: "Глиняная форма для наконечника лопаты",
    sv: "Lergjutning av spade",
    uk: "Літійна форма лопати",
    zh: "铲子陶器模具"
});
Translation.addTranslation("Axe Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Kekepaan Tongseng",
    it: "Modello d'Argilla per la Testa Ascia",
    ja: "アクスヘッドクレY",
    ko: "도끼 헤드 수lad형",
    pl: "Topór Gliny",
    pt: "Modelo de Machado de Barro",
    ru: "Глиняная форма для наконечника топора",
    sv: "Lergjutning av yxa",
    uk: "Літійна форма сокири",
    zh: "斧头陶器模具"
});
Translation.addTranslation("Broad Axe Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Kekepaan Parangs",
    it: "Modello d'Argilla per la Testa Broadaxe",
    ja: "ブロードアクスヘッドクレY",
    ko: "넓은 도끼 헤드 수lad형",
    pl: "Sekira Gliny",
    pt: "Modelo de Hacha Ampla de Barro",
    ru: "Глиняная форма для наконечника секиры",
    sv: "Lergjutning av stora yxa",
    uk: "Літійна форма серпи",
    zh: "大斧头陶器模具"
});
Translation.addTranslation("Sword Blade Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Pedang",
    it: "Modello d'Argilla per la Lama Spada",
    ja: "ソードブレードヘッドクレY",
    ko: "Espada 블레이드 헤드 수lad형",
    pl: "Miecz Gliniany",
    pt: "Modelo de Lâmina de Espada de Barro",
    ru: "Глиняная форма для лезвия меча",
    sv: "Lergjutning av svärdslamell",
    uk: "Літійна форма меча",
    zh: "剑刃陶器模具"
});
Translation.addTranslation("Hammer Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Kepala Lesung",
    it: "Modello d'Argilla per la Testa Martello",
    ja: "ハマーヘッドクレY",
    ko: "모트 Hammer head 수lad형",
    pl: "Młot garncarzowski",
    pt: "Modelo da Cabeça do Martelo de Barro",
    ru: "Глиняная форма для наконечника молота",
    sv: "Lergjutning av slägga",
    uk: "Літійна форма кувалди",
    zh: "锤头陶器模具"
});
Translation.addTranslation("Excavator Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Kepala Eksaktor",
    it: "Modello d'Argilla per la Testa Escavatore",
    ja: "エキサベイターヘッドクレY",
    ko: "Eksakseeta head 수lad형",
    pl: "Łopata garncarzowska",
    pt: "Modelo da Cabeca do Retroescavadeira de Barro",
    ru: "Глиняная форма для наконечника экскаватора",
    sv: "Lergjutning av grävarmark",
    uk: "Літійна форма екскаватора",
    zh: "挖掘机头陶器模具"
});
Translation.addTranslation("Tool Rod Clay Cast", {
    id: "Bentuk Tanah Liat untuk Batang Alat",
    it: "Modello d'Argilla per il Manico Strumento",
    ja: "ツールロッドクレY",
    ko: "도구 로드 수lad형",
    pl: "Rączka narzędzia gliniane",
    pt: "Modelo da Varão de Ferramenta de Barro",
    ru: "Глиняная форма для рукоятки инструмента",
    sv: "Lergjutning av verktygsstång",
    uk: "Літійна форма держака інструменту",
    zh: "工具杆陶器模具"
});
Translation.addTranslation("Tough Tool Rod Clay Cast", {
    id: "Bentuk Tanah Liat untuk Batang Alat Tebal",
    it: "Modello d'Argilla per il Manico Strumento Robusto",
    ja: "ツーグhttロッドクレY",
    ko: "단단한 도구 로드 수lad형",
    pl: "Silna rączka narzędziowa glinianym odlaniem",
    pt: "Modelo para Vareta de Ferramenta Forte de Barro",
    ru: "Глиняная форма для крепкой рукоятки инструмента",
    sv: "Lergjutning av stark verktygshantel",
    uk: "Літійна форма міцної ручки інструменту",
    zh: "强力工具杆陶器模具"
});
Translation.addTranslation("Binding Clay Cast", {
    id: "Bentuk Tanah Liat untuk Penjepit",
    it: "Modello d'Argilla per l'Attacco",
    ja: "バインディングクレY",
    ko: "바인딩 수lad형",
    pl: "Glinka na wiązanie",
    pt: "Modelo de Ligação de Barro",
    ru: "Глиняная форма для крепления",
    sv: "Lerlindning av bindningsdetalj",
    uk: "Літійна форма кріплення",
    zh: "结合陶器模具"
});
Translation.addTranslation("Tough Binding Clay Cast", {
    id: "Bentuk Tanah Liat untuk Pengikatan yang Kuat",
    it: "Modello d'Argilla per Attacco Resistente",
    ja: "トゥフフバインディングクレY",
    ko: "강력한 묶음 수lad형",
    pl: "Ciężkie wiązanie glinianego odlewu",
    pt: "Modelo de Ligação Firme de Barro",
    ru: "Глиняная форма для крепкого крепления",
    sv: "Lergjutform för kraftigt bindemedel",
    uk: "Літійна форма міцного зв'язування",
    zh: "结实结合陶器模具"
});
Translation.addTranslation("Wide Guard Clay Cast", {
    id: "Bentuk Tanah Liat untuk Pelindung yang Lembaran",
    it: "Modello d'Argilla per Paraurti Largo",
    ja: "ワイドガードクレY",
    ko: "폭죽 가드 수lad형",
    pl: "Szeroka tarcza glinianego odlewu",
    pt: "Modelo de Proteção Larga de Barro",
    ru: "Глиняная форма для широкой карды",
    sv: "Lergjutform för bred sköld",
    uk: "Літійна форма широкої охоронної плити",
    zh: "宽面防护板陶器模具"
});
Translation.addTranslation("Large Plate Clay Cast", {
    id: "Bentuk Tanah Liat untuk Piring Besar",
    it: "Modello d'Argilla per Piastrella Grande",
    ja: "ラージプレートクレY",
    ko: "큰 플레이트 수lad형",
    pl: "Duży płyta glinianego odlewu",
    pt: "Modelo de Prancha Grande de Barro",
    ru: "Глиняная форма для большой пластины",
    sv: "Lergjutform för stor platta",
    uk: "Літійна форма великої пластини",
    zh: "大平板陶器模具"
});
Translation.addTranslation("Ingot Clay Cast", {
    id: "Bentuk Tanah Liat untuk Ingota",
    it: "Modello d'Argilla per Getto",
    ja: "インゴットクレY",
    ko: "añ그고t 수lad형",
    pl: "Blok glinianego odlewu",
    pt: "Modelo de Gusa de Barro",
    ru: "Глиняная форма для слитка",
    sv: "Lergjutform för ingot",
    uk: "Літійна форма зливка",
    zh: "铸件陶器模具"
});
Translation.addTranslation("Nugget Clay Cast", {
    id: "Bentuk Tanah Liat untuk Nugget",
    it: "Modello d'Argilla per Pepita",
    ja: "ナッゲットクレY",
    ko: "누겟t 수lad형",
    pl: "Ziarenko glinianego odlewu",
    pt: "Modelo de Garimpo de Barro",
    ru: "Глиняная форма для самородка",
    sv: "Lergjutform för nuggat",
    uk: "Літійна форма самородка",
    zh: "金矿陶器模具"
});
Translation.addTranslation("Gem Clay Cast", {
    id: "Bentuk Tanah Liat untuk Batu Permata",
    it: "Modello d'Argilla per Gemma Preziosa",
    ja: "GEMクレY",
    ko: "보석 수lad형",
    pl: "Forma glinianej klejnotów",
    pt: "Modelo de Joia de Barro",
    ru: "Глиняная форма для самоцвета",
    sv: "Lergjutform för ädelsten",
    uk: "Літійна форма дорогоцінного каменю",
    zh: "宝石陶器模具"
});
Translation.addTranslation("Plate Clay Cast", {
    id: "Bentuk Tanah Liat untuk Piring",
    it: "Modello d'Argilla per Lastra",
    ja: "PLATEクレY",
    ko: "판 수lad형",
    pl: "Płytka glinianego odlewu",
    pt: "Modelo de Placa de Barro",
    ru: "Глиняная форма для пластины",
    sv: "Lergjutform för plåt",
    uk: "Літійна форма пластини",
    zh: "坯片陶器模具"
});
Translation.addTranslation("Gear Clay Cast", {
    id: "Bentuk Tanah Liat untuk Roda Gigi",
    it: "Modello d'Argilla per Ingranaggio",
    ja: "ギアクレY",
    ko: "기어 수lad형",
    pl: "Łopatka glinianego odlewu",
    pt: "Engrenagem do Modelo de Barro",
    ru: "Глиняная форма для шестерни",
    sv: "Lergjutform för växellår",
    uk: "Літійна форма колеса",
    zh: "齿轮陶器模具"
});
Translation.addTranslation("TConstruct: Casts", {
    id: "TConstruct: Cetakan",
    it: "TConstruct: Modelli di Colata",
    ja: "TConstruct: キャスト",
    ko: "TConstruct: 주 Lad형",
    pl: "TConstruct: Formy Odlewnicze",
    pt: "TConstruct: Moldes",
    ru: "TConstruct: Литейные формы",
    sv: "TConstruct: gjuteriformer",
    uk: "TConstruct: ливарні форми",
    zh: "TConstruct: 铸造形状"
});
Translation.addTranslation("Pickaxe Head Cast", {
    id: "Bentuk Cangkul Kepala Wijen",
    it: "Modello della Testa Piccone",
    ja: "ピカックヘッドキャスト",
    ko: "채굴도구 탑재부 수lad형",
    pl: "Odlew głowicy kilofa",
    pt: "Modelo da Cabeca do Pavão",
    ru: "Форма для наконечника кирки",
    sv: "Gjutform för yxahead",
    uk: "Літійна форма накінечника кирки",
    zh: "挖掘工具头部铸造型"
});
Translation.addTranslation("Shovel Head Cast", {
    id: "Cetakan Bagian Atas Sabit",
    it: "Modello della testa pala",
    ja: "ショベルヘッドキャスト",
    ko: "삽 머리 주 Lad형",
    pl: "Odlew głowni łopaty",
    pt: "Modelo da lâmina da pá",
    ru: "Форма для наконечника лопаты",
    sv: "Gjutform för spadhuvud",
    uk: "Літійна форма накінечника лопати",
    zh: "铲子头部铸造型"
});
Translation.addTranslation("Axe Head Cast", {
    id: "Cetakan Bagian Atas Tajam",
    it: "Modello della testa ascia",
    ja: "アクセヘッドキャスト",
    ko: "도끼 머리 주 Lad형",
    pl: "Odlew topora",
    pt: "Modelo da lâmina do machado",
    ru: "Форма для наконечника топора",
    sv: "Gjutform för yxhuvud",
    uk: "Літійна форма сокири",
    zh: "斧头部铸造型"
});
Translation.addTranslation("Broad Axe Head Cast", {
    id: "Cetakan Bagian Atas Paling Layak",
    it: "Modello della testa scure",
    ja: "ブロードアクセヘッドキャスト",
    ko: "넓은 도끼 머리 주 Lad형",
    pl: "Odlew szerokotorowej sekiry",
    pt: "Modelo da lâmina larga do machado",
    ru: "Форма для наконечника секиры",
    sv: "Gjutform för bredyxa",
    uk: "Літійна форма широкої сокири",
    zh: "宽刀头铸造型"
});
Translation.addTranslation("Sword Blade Head Cast", {
    id: "Cetakan Bagian Depan Pedang",
    it: "Modello della lama della spada",
    ja: "ソードブレードヘッドキャスト",
    ko: "검 가위 주 Lad형",
    pl: "Odlew ostrza miecza",
    pt: "Modelo da lâmina da espada",
    ru: "Форма для лезвия меча",
    sv: "Gjutform för svärdsblad",
    uk: "Літійна форма клинка меча",
    zh: "剑刃铸造型"
});
Translation.addTranslation("Hammer Head Cast", {
    id: "Cetakan Bagian Atas Peluh",
    it: "Modello della testa martello",
    ja: "ハンマーヘッドキャスト",
    ko: "모chel 머리 주 Lad형",
    pl: "Odlew głowni młota",
    pt: "Modelo da cabeça do martelo",
    ru: "Форма для наконечника молота",
    sv: "Gjutform för hammarens huvud",
    uk: "Літійна форма накінечника молотка",
    zh: "锤头部铸造型"
});
Translation.addTranslation("Excavator Head Cast", {
    id: "Cetakan Bagian Atas Ekskavator",
    it: "Modello per la testa pale escavatore",
    ja: "エクスカバターヘッドキャスト",
    ko: "발굴기 헤드 주 Lad형",
    pl: "Odlew głowy ładowarki",
    pt: "Modelo de cabeça do escavador",
    ru: "Форма для наконечника экскаватора",
    sv: "Gjutform för grävschaufels huvud",
    uk: "Літійна форма накінечника екскаватора",
    zh: "挖掘机头部铸造型"
});
Translation.addTranslation("Tool Rod Cast", {
    id: "Cetakan Batang Alat",
    it: "Modello del manico dell'attrezzo",
    ja: "ツールロッドキャスト",
    ko: "도구 바느질 주 Lad형",
    pl: "Odlew rękojeści narzędzia",
    pt: "Modelo do eixo do instrumento",
    ru: "Форма для рукоятки инструмента",
    sv: "Gjutform för verktygets skaft",
    uk: "Літійна форма держака інструменту",
    zh: "工具杆铸造型"
});
Translation.addTranslation("Tough Tool Rod Cast", {
    id: "Cetakan Batang Alat Kekuatan Tinggi",
    it: "Modello del manico robusto dell'attrezzo",
    ja: "強化ツールロッドキャスト",
    ko: "강력한 도구 바느질 주 Lad형",
    pl: "Odlew wytrzymałej rękojeści narzędzia",
    pt: "Modelo do eixo resistente do instrumento",
    ru: "Форма для крепкой рукоятки инструмента",
    sv: "Gjutform för ett starkt verktygsskaft",
    uk: "Літійна форма міцної держаки інструменту",
    zh: "强度高的工具杆铸造型"
});
Translation.addTranslation("Binding Cast", {
    id: "Cetak Perekat",
    it: "Modello di fissaggio",
    ja: "バインディングキャスト",
    ko: "부속 장착 주 Lad형",
    pl: "Odlew elementu montażowego",
    pt: "Modelo de fixação",
    ru: "Форма для крепления",
    sv: "Gjutform för bindningselement",
    uk: "Літійна форма Elementu зв'язування",
    zh: "固定件铸造型"
});
Translation.addTranslation("Tough Binding Cast", {
    id: "Cetak Perekat Kuat",
    it: "Modello di fissaggio robusto",
    ja: "強化バインディングキャスト",
    ko: "강력한 부속 장착 주 Lad형",
    pl: "Odlew wytrzymałego elementu montażowego",
    pt: "Modelo de fixação reforçada",
    ru: "Форма для крепкого крепления",
    sv: "Gjutform för ett starkt bindnings-element",
    uk: "Літійна форма міцного Elementu зв'язування",
    zh: "强度高的固定件铸造型"
});
Translation.addTranslation("Wide Guard Cast", {
    id: "Cetak Pelindung Lebar",
    it: "Modello della guardia larga",
    ja: "ワイドガードキャスト",
    ko: "넓은 가드 주 Lad형",
    pl: "Odlew szerokiej osłony",
    pt: "Modelo da guarda ampla",
    ru: "Форма для широкой карды",
    sv: "Gjutform för bred skyddsdel",
    uk: "Літійна форма широкої захисної планки",
    zh: "宽面护板铸造型"
});
Translation.addTranslation("Large Plate Cast", {
    id: "Cetak Plat Besar",
    it: "Modello della lastra grande",
    ja: "ラージプレートキャスト",
    ko: "큰 판자 주 Lad형",
    pl: "Odlew dużej płyty",
    pt: "Modelo da lâmina grande",
    ru: "Форма для большой пластины",
    sv: "Gjutform för stor plåt",
    uk: "Літійна форма великої пластини",
    zh: "大平板铸造型"
});
Translation.addTranslation("Ingot Cast", {
    id: "Cetak Ingota",
    it: "Modello del lingotto",
    ja: "インゴットキャスト",
    ko: "인그от 주 Lad형",
    pl: "Odlew ingotu",
    pt: "Modelo de lingote",
    ru: "Форма для слитка",
    sv: "Gjutform för ingot",
    uk: "Літійна форма злитку",
    zh: "铸铁块铸造型"
});
Translation.addTranslation("Nugget Cast", {
    id: "Cetak Nugget",
    it: "Modello del nugget",
    ja: "ナゲットキャスト",
    ko: "누гре트 주 Lad형",
    pl: "Odlew samorodka",
    pt: "Modelo de nugget",
    ru: "Форма для самородка",
    sv: "Gjutform för nugget",
    uk: "Літійна форма самородка",
    zh: "金矿石铸造型"
});
Translation.addTranslation("Gem Cast", {
    id: "Cetak Permata",
    it: "Modello della gemma",
    ja: "ジェムキャスト",
    ko: "보석 주 Lad형",
    pl: "Odlew kamienia szlachetnego",
    pt: "Modelo de gema",
    ru: "Форма для самоцвета",
    sv: "Gjutform för ädelsten",
    uk: "Літійна форма дорогоцінного каміння",
    zh: "宝石铸造型"
});
Translation.addTranslation("Plate Cast", {
    id: "Cetak Las",
    it: "Modello della lastra",
    ja: "プレートキャスト",
    ko: "판자 주 Lad형",
    pl: "Odlew płyty",
    pt: "Modelo de lâmina",
    ru: "Форма для пластины",
    sv: "Gjutform för plåt",
    uk: "Літійна форма пластини",
    zh: "板形铸造型"
});
Translation.addTranslation("Gear Cast", {
    id: "Cetak Roda Gigi",
    it: "Modello dell'ingranaggio",
    ja: "ギアキャスト",
    ko: "톱니 주 Lad형",
    pl: "Odlew zębatego koła",
    pt: "Modelo de engrenagem",
    ru: "Форма для шестерни",
    sv: "Gjutform för kuggverk",
    uk: "Літійна форма колеса зубчастого",
    zh: "齿轮铸造型"
});
///
// TABLES
///
Translation.addTranslation("Part Builder", {
    de: "Teilebauer",
    id: "Part Builder",
    it: "Costruttore di parti",
    ja: "部品作成台", ko: "부품 제작대",
    pl: "Konstruktor części",
    pt: "Montador de Peças",
    ru: "Сборщик деталей",
    sv: "Delbyggare",
    uk: "Збирач деталей",
    zh: "部件制造台"
});
Translation.addTranslation("Here you can craft tool parts to fulfill your tinkering fantasies.", {
    de: "Hier können Sie Werkzeugteile herstellen, um Ihre Bastelfantasien zu erfüllen.",
    id: "Here you can craft tool parts to fulfill your tinkering fantasies.",
    it: "Qui puoi creare parti di utensili per soddisfare le tue fantasie di armeggiatore.",
    ja: "あなたのティンカーとしての夢を叶える道具の部品を作れます。",
    ko: "상상했었던 모든 도구 부품을 제작할 수 있습니다.",
    pl: "Tutaj możesz wytwarzać części narzędzi dla zaspokojenia swoich majsterkowiczowskich fantazji.",
    pt: "Aqui você pode criar peças de ferramentas para realizar suas fantasias tinkers.",
    ru: "Здесь вы можете создавать части инструментов для воплощения своих литейных фантазий.",
    sv: "Här kan du tillverka verktygsdelar för att ge utlopp för din kreativitet.",
    uk: "Тут ти можеш створювати інструментні деталі для справдження своїх інженерних фантазій.",
    zh: "在这里你能制作工具部件，从而实现你的工匠之梦。"
});
Translation.addTranslation("To craft a part simply put a blank pattern into the left slot and select the part you want. The remaining slot holds the material you want to craft your part out of.", {
    de: "Um ein Teil herzustellen, legen Sie einfach ein leeres Muster in den linken Schlitz und wählen Sie das gewünschte Teil aus. Der verbleibende Schlitz hält das Material, aus dem Sie Ihr Teil herstellen möchten.",
    id: "To craft a part simply put a blank pattern into the left slot and select the part you want. The remaining slot holds the material you want to craft your part out of.",
    it: "Per creare una parte basta mettere un modello vuoto nello slot di sinistra e selezionare la parte che vuoi. Il restante slot contiene il materiale con cui vuoi creare la tua parte.",
    ja: "部品を作るには、左のスロットに空のパターンを入れて作成したい部品を選択します。残りのスロットには部品を作るための素材を置きます。",
    ko: "왼쪽 슬롯에 빈 틀을 넣고, 원하는 부품을 선택하면 부품이 제작됩니다. 나머지 슬롯에 도구의 재료를 넣어야 합니다.",
    pl: "Aby wytworzyć część po prostu umieść pusty szablon do slotu po lewej i wybierz część, jakiej potrzebujesz. Drugi slot przechowuje materiał, z którego ma być wykonana część.",
    pt: "Para criar uma peça basta colocar um molde vazio no slot esquerdo e selecionar a peça desejada. O slot restante detém o material do qual você quer confeccionar sua peça.",
    ru: "Чтобы изготовить деталь, положите шаблон в левый слот и выберите нужную часть. В оставшийся слот помещается материал, из которого вы хотите изготовить деталь.",
    sv: "För att tillverka en del lägger du ett blankt mönster i platsen till vänster och väljer den del du vill ha. Den återstående platsen är materialet du vill tillverka din del utav.",
    uk: "Щоб створити деталь, просто розмістіть пустий шаблон у лівому слоті й обери бажану деталь. В инший слот покладіть матеріал, з якого ви хочете створити деталь.",
    zh: "要制作一个工具部件，你需要将模具放入左侧的空槽，并选择目标部件类型。接着在右侧的槽中放入材料，即可制成对应材料的对应部件。"
});
Translation.addTranslation("Title", {
    de: "Titel",
    id: "Judul",
    it: "Titolo",
    ja: "タイトル",
    ko: "제목",
    pl: "Tytuł",
    pt: "Título",
    ru: "Название",
    sv: "Rubrik",
    uk: "Заголовок",
    zh: "标题"
});
Translation.addTranslation("Description", {
    de: "Beschreibung",
    id: "Deskripsi",
    it: "Descrizione",
    ja: "説明",
    ko: "설명",
    pl: "Opis",
    pt: "Descrição",
    ru: "Описание",
    sv: "Beskrivning",
    uk: "Описание",
    zh: "描述"
});
Translation.addTranslation("Head", {
    de: "Kopf", id: "Head", it: "Testa", ja: "ヘッド部", ko: "머리",
    pl: "Głowica",
    pt: "Cabeça",
    ru: "Наконечник",
    sv: "Huvud",
    uk: "Наконечник",
    zh: "顶端"
});
Translation.addTranslation("Durability: ", {
    de: "Haltbarkeit: ",
    id: "Durability: ",
    it: "Durabilità: ",
    ja: "耐久度: ", ko: "내구도: ",
    pl: "Wytrzymałość:",
    pt: "Durabilidade: ",
    ru: "Прочность: ",
    sv: "Hållbarhet: ",
    uk: "Міцність: ",
    zh: "耐久度："
});
Translation.addTranslation("Mining Tier: ", {
    de: "Erntestufe: ",
    id: "Harvest Tier: ",
    it: "Livello di raccolta: ",
    ja: "採掘ランク: ",
    ko: "채굴 등급: ",
    pt: "Nivel de Coleta: ",
    ru: "Добывает: ",
    sv: "Grävnivå: ",
    uk: "Рівень добування: ",
    zh: "采掘等级："
});
Translation.addTranslation("Mining Speed: ", {
    de: "Mining-Geschw.: ",
    id: "Mining Speed: ",
    it: "Velocità di scavo: ",
    ja: "採掘速度: ",
    ko: "채굴 속도: ",
    pl: "Szybkość kopania:",
    pt: "Velocidade de Mineração: ",
    ru: "Эффективность: ",
    sv: "Grävhastighet: ",
    uk: "Швидкість добування: ",
    zh: "采掘速度："
});
Translation.addTranslation("Melee Damage: ", {
    de: "Angr.-Schaden: ",
    id: "Attack Damage: ",
    it: "Danno d'attacco: ",
    ja: "攻撃力: ",
    ko: "공격 피해: ",
    pl: "Obrażenia:",
    pt: "Dano de Ataque: ",
    ru: "Урон: ",
    sv: "Attackskada: ",
    uk: "Шкода від атаки: ",
    zh: "攻击伤害："
});
Translation.addTranslation("Handle", {
    de: "Handle", id: "Handle",
    it: "Gestione",
    ja: "持ち手", ko: "손잡이", pl: "Trzon",
    pt: "Manuseio",
    ru: "Рукоять",
    sv: "Skaft",
    uk: "Стержень",
    zh: "手柄"
});
Translation.addTranslation("Multiplier: ", {
    de: "Multiplikator: ",
    id: "Multiplikator: ",
    it: "Moltiplicatore: ",
    ja: "係数: ", ko: "곱셈 계수: ",
    pl: "Współczynnik wielokrotności: ",
    pt: "Multiplicador: ",
    ru: "Множитель: ",
    sv: "Multiplikatör: ",
    uk: "Множник: ",
    zh: "乘數器："
});
Translation.addTranslation("Durability: ", {
    de: "Haltbarkeit: ",
    id: "Durability: ",
    it: "Durabilità: ",
    ja: "耐久度: ", ko: "내구도: ",
    pl: "Wytrzymałość:",
    pt: "Durabilidade: ",
    ru: "Прочность: ",
    sv: "Hållbarhet: ",
    uk: "Міцність: ",
    zh: "耐久度："
});
Translation.addTranslation("Extra", {
    de: "Extra", id: "Extra", it: "Extra", ja: "締め具",
    ko: "추가적인 부품",
    pl: "Dodatek",
    pt: "Extra",
    ru: "Дополнительно",
    sv: "Extra",
    uk: "Додатково",
    zh: "附件"
});
Translation.addTranslation("Material value: %s", {
    de: "Materialwert: %s",
    id: "Material value: %s",
    it: "Valore materiale: %s",
    ja: "素材値: %s",
    ko: "재료의 양: %s",
    pl: "Ilość materiału: %s",
    pt: "Valor do Material: %s",
    ru: "Кол-во материала: %s",
    sv: "Materialvärde: %s",
    uk: "Вартість матеріалу: %s",
    zh: "材料值：%s"
});
Translation.addTranslation("Tool Forge", {
    de: "Werkzeugschmiede",
    id: "Tool Forge",
    it: "Fucina degli strumenti",
    ja: "道具鋳造工", ko: "도구 대장간",
    pl: "Mistrz majsterkowania",
    pt: "Forja de ferramentas",
    ru: "Кузня для инструментов",
    sv: "Verktygssmedja",
    uk: "Інструментна кузня",
    zh: "工具锻造"
});
Translation.addTranslation("Repair & Modify", {
    de: "Reparieren & Modifizieren",
    id: "Repair & Modify",
    it: "Ripara e modifica",
    ja: "修理と変更",
    ko: "수리 & 수식어",
    pl: "Napraw i modyfikuj",
    pt: "Repare & Modifique",
    ru: "Компоновщик",
    sv: "Reparera och modifiera",
    uk: "Ремонт і модифікація",
    zh: "修复与强化"
});
Translation.addTranslation("Modifiers", {
    de: "Modifikatoren",
    id: "Modifiers",
    it: "Modificatori",
    ja: "改造", ko: "수식어",
    pl: "Modyfikacje",
    pt: "Modificador",
    ru: "Модификаторы",
    sv: "Modifierare",
    uk: "Модифікатори",
    zh: "强化物"
});
Translation.addTranslation("Modifiers: ", {
    de: "Modifikatoren: ",
    id: "Modifiers: ",
    it: "Modificatori: ",
    ja: "改造: ", ko: "수식어: ",
    pl: "Modyfikacje: ",
    pt: "Modificador: ",
    ru: "Модификаторы: ",
    sv: "Modifierare: ",
    uk: "Модифікатори: ",
    zh: "强化物："
});
Translation.addTranslation("Unknown slot type %s", {
    de: "Unbekannter Slot-Typ %s",
    id: "Unknown slot type %s",
    it: "Tipo di slot %s sconosciuto",
    ja: "未知のスロットタイプです: %s",
    ko: "'%s'은(는) 알 수 없는 종류의 슬롯입니다",
    pt: "Tipo de slot desconhecido %s",
    ru: "Unknown slot type %s",
    sv: "%s är en okänd platstyp",
    uk: "Невідомий тип слоту %s",
    zh: "未知槽位类型%s"
});
Translation.addTranslation("Unknown modifier %s", {
    de: "Unbekannter Modifikator %s",
    id: "Modifier yang tidak dikenal %s",
    it: "Modificatore sconosciuto %s",
    ja: "%s desconocidoの修正子",
    ko: "%s 미지의 모디파이어",
    pl: "Nieznany modyfikator %s",
    pt: "Modificador desconhecido %s",
    ru: "Неизвестный модификатор %s",
    sv: "Okänd modifierare %s",
    uk: "Невідомий модифікатор %s",
    zh: "%s 未知调整值"
});
Translation.addTranslation("Unknown mining tier %s", {
    de: "Unbekanntes Bergbau-Stadium %s",
    id: "Tingkat penambangan yang tidak dikenali %s",
    it: "Livello di estrazione sconosciuto %s",
    ja: "%s desconocidoの採掘レベル",
    ko: "%s 미상known 채굴 티어",
    pl: "Nieznany poziom kopania %s",
    pt: "nível de mineração desconhecida %s",
    ru: "Неизвестный уровень добычи %s",
    sv: "Okänt gruvnivå %s",
    uk: "Невідомий рівень видобутку %s",
    zh: "%s 未知矿业等级"
});
Translation.addTranslation("Unknown material %s", {
    de: "Unbekanntes Material %s",
    id: "Bahan yang tidak dikenal %s",
    it: "Materiale sconosciuto %s",
    ja: "%s desconocidoの材料",
    ko: "%s 미지의 소재",
    pl: "Nieznane materiał %s",
    pt: "Matéria desconhecida %s",
    ru: "Неизвестный материал %s",
    sv: "Okänt material %s",
    uk: "Невідома речовина %s",
    zh: "%s 未知材料"
});
Translation.addTranslation("Tinker Station", {
    de: "Bastelstation",
    id: "Tinker Station",
    it: "Stazione dell'armeggiatore",
    ja: "ティンカー台",
    ko: "대장장이 작업대",
    pl: "Stacja majsterkowania",
    pt: "Estação Tinker",
    ru: "Литейная станция",
    sv: "Tinkerstation",
    uk: "Інженерна станція",
    zh: "工匠站"
});
Translation.addTranslation("Level: ", {
    de: "Ebene: ",
    id: "Tingkat: ",
    it: "Livello: ",
    ja: "レベル：",
    ko: "레벨 :",
    pl: "Poziom: ",
    pt: "Nível: ",
    ru: "Уровень: ",
    sv: "Nivå: ",
    uk: "Рівень: ",
    zh: "級別："
});
Translation.addTranslation("XP: ", {
    de: "EP: ",
    id: "EXP: ",
    it: "Punti esperienza: ",
    ja: "ＸＰ：",
    ko: "경험치 :",
    pl: "PK: ",
    pt: "xp: ",
    ru: "Опыт: ",
    sv: "UP: ",
    uk: "Досвід:",
    zh: "經驗值："
});
///
// TOOLS
///
Translation.addTranslation("Pickaxe Head", {
    de: "Spitzhackenkopf",
    id: "Kepala Beliung",
    it: "Testa del Piccone",
    ja: "つるはしの頭",
    ko: "곡괭이 머리",
    pl: "Głowica Kilofa",
    pt: "Cabeça de Picareta",
    ru: "Наконечник кирки",
    sv: "Pikhackehuvud",
    uk: "Насадка кирки",
    zh: "镐头"
});
Translation.addTranslation("Shovel Head", {
    de: "Schaufelkopf",
    id: "Kepala Sekop",
    it: "Testa della Pala",
    ja: "シャベルの頭", ko: "삽 머리",
    pl: "Głowica Łopaty",
    pt: "Cabeça de Pá",
    ru: "Наконечник лопаты",
    sv: "Spadehuvud",
    uk: "Насадка лопати",
    zh: "铲头"
});
Translation.addTranslation("Axe Head", {
    de: "Axtkopf",
    id: "Kepala Kapak",
    it: "Testa dell'Ascia",
    ja: "斧の頭", ko: "도끼 머리",
    pl: "Głowica Topora",
    pt: "Cabeça de Machado",
    ru: "Наконечник топора",
    sv: "Yxhuvud",
    uk: "Насадка топора",
    zh: "斧头"
});
Translation.addTranslation("Broad Axe Head", {
    de: "Breiter Axtkopf",
    id: "Kepala Kapak Lebar",
    it: "Testa dell'Ascia Larga",
    ja: "広斧ヘッド", ko: "넓은 도끼 머리",
    pl: "Szeroka Głowica Topora",
    pt: "Cabeça de Machado Largo",
    ru: "Наконечник тесака",
    sv: "Bred Yxhuvud",
    uk: "Насадка широкої сокири",
    zh: "宽斧头"
});
Translation.addTranslation("Sword Blade", {
    de: "Schwertklinge",
    id: "Pisau Pedang",
    it: "Lama della Spada",
    ja: "剣の刃", ko: "검 검",
    pl: "Ostrze Miecza",
    pt: "Lâmina de Espada",
    ru: "Лезвие секиры",
    sv: "Svärdblad",
    uk: "Лезо меча",
    zh: "剑刃"
});
Translation.addTranslation("Hammer Head", {
    de: "Hammerkopf",
    id: "Kepala Palu",
    it: "Testa del Martello",
    ja: "ハンマーヘッド", ko: "망치 머리",
    pl: "Głowica Młota",
    pt: "Cabeça de Martelo",
    ru: "Наконечник молота",
    sv: "Hammarehuvud",
    uk: "Насадка молота",
    zh: "锤头"
});
Translation.addTranslation("Excavator Head", {
    de: "Baggerschaufelkopf",
    id: "Kepala Excavator",
    it: "Testa dell'Escavatore",
    ja: "掘削ヘッド", ko: "굴착기 헤드",
    pl: "Głowica Koparki",
    pt: "Cabeça Escavadora",
    ru: "Наконечник экскаватора",
    sv: "Grävmaskinshuvud",
    uk: "Насадка екскаватора",
    zh: "挖掘头"
});
Translation.addTranslation("Tool Rod", {
    de: "Werkzeugstange",
    id: "Tang Alat",
    it: "Astina Strumento",
    ja: "ツールロッド", ko: "도구 막대",
    pl: "Pręt Narzędziowy",
    pt: "Haste de Ferramenta",
    ru: "Рукоятка инструмента",
    sv: "Verktygsstång",
    uk: "Важіль інструменту",
    zh: "工具杆"
});
Translation.addTranslation("Tough Tool Rod", {
    de: "Robuste Werkzeugstange",
    id: "Tang Alat yang Kokoh",
    it: "Astina Strumento Resistente",
    ja: "頑丈なツールロッド", ko: "튼튼한 도구 막대",
    pl: "Wytrzymały Pręt Narzędziowy",
    pt: "Haste de Ferramenta Resistente",
    ru: "Крепкая рукоятка инструмента",
    sv: "Stark Verktygsstång",
    uk: "Міцний Важіль інструменту",
    zh: "坚固的工具杆"
});
Translation.addTranslation("Binding", {
    de: "Binder",
    id: "Pengikat",
    it: "Vincolo",
    ja: "バインディング", ko: "바인딩",
    pl: "Więzadło",
    pt: "Vínculo",
    ru: "Крепление",
    sv: "Bindning",
    uk: "З'єднання",
    zh: "绑定"
});
Translation.addTranslation("Tough Binding", {
    de: "Robuster Binder",
    id: "Pengikat Kuat",
    it: "Legatura Resistente",
    ja: "頑丈なバインディング", ko: "튼튼한 바인딩",
    pl: "Wytrzymałe Wiązanie",
    pt: "Vínculo Resistente",
    ru: "Крепкое крепление",
    sv: "Starkt Fäste",
    uk: "Міцне З'єднання",
    zh: "坚固的绑定"
});
Translation.addTranslation("Wide Guard", {
    de: "Breite Schutzkappe",
    id: "Penjaga Lebar",
    it: "Guardia Larga",
    ja: "広いガード",
    ko: "넓은 가드",
    pl: "Szeroka Ochrona",
    pt: "Guarda Larga",
    ru: "Широкая карда",
    sv: "Bred Vakt",
    uk: "Широкий Захист",
    zh: "宽护手"
});
Translation.addTranslation("Large Plate", {
    de: "Große Platte",
    id: "Pelat Besar",
    it: "Piastra Grande",
    ja: "大きな板", ko: "큰 판",
    pl: "Duża Płyta",
    pt: "Placa Grande",
    ru: "Большая пластина",
    sv: "Stor Platta",
    uk: "Велика Пластина",
    zh: "大板"
});
Translation.addTranslation("Broken %s", {
    de: "Kaputtes %s",
    id: "%s Rusak",
    it: "%s Rotto",
    ja: "壊れた%s", ko: "고장난 %s",
    pl: "Uszkodzony %s",
    pt: "%s Quebrado",
    ru: "%s (разрушено)",
    sv: "Brott %s",
    uk: "Розбите %s",
    zh: "损坏的%s"
});
Translation.addTranslation("Pickaxe", {
    de: "Spitzhacke",
    id: "Pickaxe",
    it: "Piccone",
    ja: "ツルハシ", ko: "곡괭이", pl: "Kilof",
    pt: "Picareta",
    ru: "Кирка", sv: "Hacka", uk: "Кайло", zh: "镐"
});
Translation.addTranslation("The Pickaxe is a precise mining tool. It is effective on stone and ores. It breaks blocks, OK?", {
    de: "Die Spitzhacke ist ein präzises Bergbauwerkzeug. Sie ist effektiv bei Steinen und Erzen. Sie bricht Blöcke, OK?",
    id: "The Pickaxe is a precise mining tool. It is effective on stone and ores. It breaks blocks, OK?",
    it: "Il piccone è un preciso strumento da miniera. È efficace sulla pietra e sui minerali. Rompe i blocchi, ok?",
    ja: "ツルハシは精密な採掘道具です。石や鉱石に効果的です。そのブロックを壊しても大丈夫？",
    ko: "곡괭이는 정밀한 채굴 도구입니다. 돌과 광석을 효과적으로 채굴할 수 있습니다. 간단히 말하면, 블록을 부수는 도구입니다.",
    pl: "Kilof jest precyzyjnym narzędziem do kopania. Działa dobrze na skały i rudy. Kilof kopie, OK?",
    pt: "A picareta é uma ferramenta de mineração. Ela é muito efetiva para minerar pedras e minérios. Isso quebra blocos, Certo?",
    ru: "Кирка самый точный шахтерский инструмент. Очень эффективна для добычи камня и руд. Она ломает блоки, ясно?",
    sv: "Hackan är ett ensidigt grävverktyg. Den är effektiv på sten och malm. Den bryter block, hajar du?",
    uk: "Кайло є точним шахтарським знаряддям. Воно ефективне для добування блоків і руд. Воно ламає блоки, ясно?",
    zh: "镐是一种精准型采矿工具，能够高效挖掘石头、矿石等石类方块。挖方块用的，懂？"
});
Translation.addTranslation("Shovel", {
    de: "Schaufel",
    id: "Sekop",
    it: "Pala",
    ja: "シャベル", ko: "삽",
    pl: "Łopata",
    pt: "Pá",
    ru: "Лопата",
    sv: "Skyffel",
    uk: "Лопата",
    zh: "铲子"
});
Translation.addTranslation("The Shovel digs up dirt. It is effective on dirt, sand, gravel, and snow. Just don't dig your own grave!", {
    de: "Die Schaufel gräbt Erde aus. Sie ist effektiv auf Erde, Sand, Kies und Schnee. Graben Sie einfach nicht Ihr eigenes Grab!",
    id: "Sekop menggali tanah. Ini efektif pada tanah, pasir, kerikil, dan salju. Hanya jangan menggali kuburanmu sendiri!",
    it: "La Pala scava la terra. È efficace su terra, sabbia, ghiaia e neve. Basta non scavare la propria fossa!",
    ja: "シャベルは土を掘り起こします。土、砂、砂利、雪に効果的です。ただし、自分の墓を掘らないでください！",
    ko: "삽은 흙을 파내는 데 사용됩니다. 흙, 모래, 자갈 및 눈에서 효과적입니다. 그냥 자신의 무덤을 파지 마세요!",
    pl: "Łopata kopie ziemię. Jest skuteczna na ziemi, piasku, żwirze i śniegu. Po prostu nie kop swojego własnego grobu!",
    pt: "A Pá escava terra. É eficaz em terra, areia, cascalho e neve. Apenas não cave sua própria cova!",
    ru: "Лопата нужна для копания земли. Очень эффективна на земле, песке, гравии и снегу. Просто не выкапывай собственную могилу!",
    sv: "Skyffeln gräver upp jord. Den är effektiv på jord, sand, grus och snö. Gräva bara inte din egen grav!",
    uk: "Лопата потрібна для копання землі. Дуже ефективна на землі, піску, гравій і снігу. Просто не копайте свій власний могильник!",
    zh: "铲子挖起土壤。 它对土壤、沙子、碎石和雪很有效。 只是不要挖自己的坟墓！"
});
Translation.addTranslation("Hatchet", {
    de: "Beil",
    id: "Kapak",
    it: "Scuretta",
    ja: "斧", ko: "손도끼",
    pl: "Toporek",
    pt: "Machadinha",
    ru: "Тесак",
    sv: "Huggare",
    uk: "Сокира",
    zh: "斧头"
});
Translation.addTranslation("The Hatchet chops up wood and makes short work of leaves. It also makes for a passable weapon. Chop chop!", {
    de: "Das Beil zerhackt Holz und erledigt Blätter im Handumdrehen. Es macht auch eine akzeptable Waffe. Hack hack!",
    id: "Kapak menebang kayu dan dengan cepat menyelesaikan daun. Ini juga membuat senjata yang layak. Potong potong!",
    it: "La Scuretta trita legno e fa un lavoro rapido sulle foglie. Può anche essere un'arma passabile. Taglia taglia!",
    ja: "斧は木材を切り刻み、葉を短時間で処理します。それはまあまあの武器にもなります。チョップ チョップ!",
    ko: "손도끼는 나무를 베어내고 잎사귀를 빠르게 처리합니다. 또한 어느 정도는 무기로 사용할 만합니다. 찍어 찍어!",
    pl: "Toporek sieka drewno i szybko radzi sobie z liśćmi. Może również stanowić znośną broń. Siekaj, siekaj!",
    pt: "A Machadinha corta madeira e faz um trabalho rápido com folhas. Também pode ser uma arma aceitável. Corta corta!",
    ru: "Тесак срубает древесину и быстро справляется с листвой. Это также делает его неплохим оружием. Боньк, боньк!",
    sv: "Huggaren hackar upp trä och gör kort arbete med löv. Det gör också en acceptabelt vapen. Hacka hacka!",
    uk: "Сокира рубає деревину і швидко справляється з листям. Це також робить його прийнятною зброєю. Боньк, боньк!",
    zh: "斧头砍伐木材，轻松解决树叶。 它也可以成为一种可以接受的武器。 砍砍！"
});
Translation.addTranslation("Mattock", {
    de: "Mattock",
    id: "Mattock",
    it: "Mattock",
    ja: "マトック", ko: "매톡",
    pl: "Motyka",
    pt: "Chibanca",
    ru: "Заточенная мотыга",
    sv: "Jordhacka",
    uk: "Кайломотика",
    zh: "鹤嘴锄"
});
Translation.addTranslation("The Cutter Mattock is a versatile farming tool. It is effective on wood, dirt, and plants. It also packs quite a punch.", {
    de: "Die Hacke ist ein vielseitiges landwirtschaftliches Werkzeug. Es ist effektiv auf Holz, Erde und Pflanzen. Es hat auch eine ziemliche Wirkung.",
    id: "Cutter Mattock adalah alat pertanian serbaguna. Ini efektif pada kayu, tanah, dan tanaman. Ini juga memberikan pukulan yang cukup besar.",
    it: "La Zappa Tagliente è uno strumento agricolo versatile. È efficace su legno, terra e piante. Ha anche un bel pugno.",
    ja: "カッターマトックは多目的な農業ツールです。木材、土壌、植物に効果的です。また、かなりのパンチも持っています。",
    ko: "커터 매토크는 다용도 농업 도구입니다. 나무, 흙, 식물에 효과적입니다. 또한 상당한 타격을 가지고 있습니다.",
    pl: "Kosiarka Motyka to wszechstronne narzędzie rolnicze. Jest skuteczny na drewnie, ziemi i roślinach. Ma też spory cios.",
    pt: "A Enxada Cortadora é uma ferramenta agrícola versátil. É eficaz em madeira, terra e plantas. Também tem um bom impacto.",
    ru: "Заточенная мотыга прекрасный инструмент для сельского хозяйства. Очень эффективна на древесине, земле и растениях. Она также наносит неплохой урон.",
    sv: "Hackan är ett mångsidigt jordbruksverktyg. Den är effektiv på trä, jord och växter. Den har också en ganska kraftig slagkraft.",
    uk: "Заточена мотика чудовий інструмент для сільського господарства. Дуже ефективна на деревині, землі та рослинах. Вона також завдає непоганого удару.",
    zh: "削铲镐是一种多功能的农业工具。它对木材、土壤和植物都很有效。它也有相当的冲击力。"
});
Translation.addTranslation("Broad Sword", {
    de: "Breitschwert",
    id: "Pedang Lebar",
    it: "Spada Larga",
    ja: "広剣", ko: "넓은 검",
    pl: "Szeroki Miecz",
    pt: "Espada Larga",
    ru: "Секира",
    sv: "Bredsverd",
    uk: "Широкий меч",
    zh: "宽剑"
});
Translation.addTranslation("The Broad Sword is a universal weapon. Sweep attacks keep enemy hordes at bay. Also good against cobwebs!", {
    de: "Das Breitschwert ist eine universelle Waffe. Schwungangriffe halten feindliche Horden in Schach. Auch gut gegen Spinnweben!",
    id: "Pedang Lebar adalah senjata serba guna. Serangan sapuan menahan gerombolan musuh. Juga bagus melawan jaring laba-laba!",
    it: "La Spada Larga è un'arma universale. Gli attacchi ampi tengono a bada le orde nemiche. Ottima anche contro le ragnatele!",
    ja: "ブロードソードは汎用武器です。スウィープ攻撃で敵の群れを寄せ付けません。また、クモの巣にも効果的です！",
    ko: "브로드 소드는 범용 무기입니다. 스윕 공격으로 적의 무리를 멀리 유지합니다. 거미줄에도 효과적입니다!",
    pl: "Szeroki Miecz to uniwersalna broń. Ataki zamiatania powstrzymują hordy wrogów. Dobry też przeciwko pajęczynom!",
    pt: "A Espada Larga é uma arma universal. Ataques em varredura mantêm hordas inimigas afastadas. Também é eficaz contra teias de aranha!",
    ru: "Секира универсальное оружие. Сметающие все на своем пути атаки сдерживают врагов на расстоянии. Также неплоха против паутины!",
    sv: "Det breda svärdet är ett universellt vapen. Svepande attacker håller fiendehorder på avstånd. Bra även mot spindelnät!",
    uk: "Широка меч універсальна зброя. Замахи атак зупиняють ворожі зграї на відстані. Також добре проти павутини!",
    zh: "宽剑是一种通用武器。 横扫攻击可以阻挡敌人的大军。 也对蜘蛛网很有效！"
});
Translation.addTranslation("Hammer", {
    de: "Hammer",
    id: "Palu",
    it: "Martello",
    ja: "ハンマー", ko: "망치",
    pl: "Młotek",
    pt: "Martelo",
    ru: "Молот",
    sv: "Hammar",
    uk: "Молот",
    zh: "锤子"
});
Translation.addTranslation("The Hammer is a broad mining tool. It harvests blocks in a wide range. Also effective against undead.", {
    de: "Der Hammer ist ein breites Bergbaugerät. Es erntet Blöcke in einem weiten Bereich. Auch effektiv gegen Untote.",
    id: "Palu adalah alat penambangan yang luas. Ini mengumpulkan blok dalam jangkauan yang luas. Juga efektif melawan mayat hidup.",
    it: "Il Martello è un ampio attrezzo da miniera. Raccoglie blocchi in un'ampia area. Anche efficace contro gli non morti.",
    ja: "ハンマーは広範な採掘ツールです。広範囲でブロックを収穫します。また、アンデッドにも効果的です。",
    ko: "망치는 넓은 채굴 도구입니다. 넓은 범위에서 블록을 수확합니다. 또한 좀비에게 효과적입니다.",
    pl: "Młotek to szerokie narzędzie górnicze. Zbiera bloki na szerokim obszarze. Skuteczny także przeciwko nieumarłym.",
    pt: "O Martelo é uma ferramenta de mineração ampla. Ele colhe blocos em uma ampla área. Também eficaz contra mortos-vivos.",
    ru: "Молот используется для раскапывания шахт. Добывает блоки в большом радиусе. Также эффективен против нежити.",
    sv: "Hammar är ett brett gruvarbetsverktyg. Det skördar block på ett brett område. Även effektivt mot odöda.",
    uk: "Молот широкий гірничий інструмент. Він збирає блоки на широкій території. Також ефективний проти неживих.",
    zh: "锤子是一种广泛的采矿工具。它在广"
});
Translation.addTranslation("Excavator", {
    de: "Bagger",
    id: "Excavator",
    it: "Scavatore",
    ja: "エクスカベーター", ko: "야전삽",
    pl: "Duża łopata",
    pt: "Escavadora",
    ru: "Экскаватор",
    sv: "Utgrävare",
    uk: "Землечерпалка",
    zh: "开掘铲"
});
Translation.addTranslation("The Excavator is a broad digging tool. It digs up large areas of soil and snow in a wide range. Terraforming!", {
    de: "Der Bagger ist ein breites Grabwerkzeug. Er gräbt große Erd- und Schneeflächen in einem weiten Bereich aus. Terraforming!",
    id: "The Excavator is a broad digging tool. It digs up large areas of soil and snow in a wide range. Terraforming!",
    it: "L'escavatore è un grande strumento di scavo. Scava grandi aree di terreno e neve in un ampio raggio. Terraformazione!",
    ja: "エクスカベーターは大型の掘り道具です。広範囲の土や雪を一度に掘り起こせます。テラフォーミング！",
    ko: "야전삽은 광범위한 굴착 도구입니다. 넓은 범위의 흙과 눈을 파낼 수 있습니다. 지형을 평탄화하세요!",
    pl: "Duża łopata jest dużym narzędziem do kopania w ziemi. Niszczy dużą ilość gleby i śniegu na raz. Terraformacja!",
    pt: "A Escavadora é uma ferramenta grande muito útil para a escavação. Ele escava grandes áreas de solo e neve em larga escala. Terraformando!",
    ru: "Экскаватор используется для раскапывания кратеров. Выкапывает участки земли и снега в большом радиусе. Терраформирование!",
    sv: "Utgrävaren är ett mångsidigt grävverktyg. Den gräver upp större områden av jord och snö i ett brett område. Terraformering!",
    uk: "Землечерпалка є широким копальним знаряддям. Вона викопує велику площу ґрунту й снігу в широкому радіусі. Тераформування!",
    zh: "开掘铲是一种范围型挖掘工具，能单次挖掘一整片区域内的泥土和雪。改天换地！"
});
Translation.addTranslation("Tree chopping in progress...", {
    de: "Baumfällung läuft...",
    id: "Penebangan pohon sedang berlangsung...",
    it: "Abbattimento degli alberi in corso...",
    ja: "木を切る作業中...",
    ko: "나무 베기 진행 중...",
    pl: "Trwa wycinka drzew...",
    pt: "Derrubada de árvores em andamento...",
    ru: "Продолжается измельчение дерева...",
    sv: "Trädhuggning pågår...",
    uk: "Йде подрібнення дерева...",
    zh: "正在砍树..."
});
Translation.addTranslation("Lumber Axe", {
    de: "Holzfälleraxt",
    id: "Kapak Kayu",
    it: "Ascia da Boscaiolo",
    ja: "伐採斧",
    ko: "벌목 도끼",
    pl: "Topór Leśnika",
    pt: "Machado de Lenhador",
    ru: "Топор лесника",
    sv: "Timber Yxa",
    uk: "Топір Лісоруба",
    zh: "伐木斧"
});
Translation.addTranslation("The Lumber Axe is a broad chopping tool. It can fell entire trees in one swoop or gather wood in a wide range. Timber!", {
    de: "Die Holzfälleraxt ist ein breites Werkzeug zum Fällen von Bäumen. Sie kann ganze Bäume auf einmal fällen oder Holz in einem weiten Bereich sammeln. Holz vor der Hütte!",
    id: "Kapak kayu adalah alat pemotongan yang lebar. Ini dapat menebang seluruh pohon dalam satu kali tebas atau mengumpulkan kayu dalam jangkauan yang luas. Kayu!",
    it: "L'ascia da boscaiolo è uno strumento di abbattimento ampio. Può abbattere interi alberi in un colpo solo o raccogliere legna in un'ampia area. Legna!",
    ja: "伐採斧は幅広い切り込みツールです。一度に木を全て切り倒すか、広範囲で木材を収集することができます。材木！",
    ko: "벌목 도끼는 넓은 벌목 도구입니다. 한 번에 전체 나무를 베거나 넓은 범위에서 나무를 수확할 수 있습니다. 재목!",
    pl: "Topór Leśnika to szerokie narzędzie do wycinki drzew. Może obalić całe drzewa za jednym zamachem lub zbierać drewno na szerokim obszarze. Drewno!",
    pt: "O Machado de Lenhador é uma ferramenta ampla para cortar. Pode derrubar árvores inteiras em um único golpe ou coletar madeira em uma ampla área. Madeira!",
    ru: "Топор лесника используется для измельчения леса. Он может добыть сразу все дерево или собрать древесину в большом радиусе. Лесоповал!",
    sv: "Timber Yxan är ett brett huggverktyg. Den kan fälla hela träd på en gång eller samla trä på ett brett område. Timmer!",
    uk: "Топір Лісоруба це широкий інструмент для вирубування дерев. Він може валити цілі дерева одним махом або збирати деревину на широкій території. Дерево!",
    zh: "伐木斧是一种宽阔的砍伐工具。 它可以一次性砍倒整棵树，或者在广泛的范围内收集木材。 木材！"
});
///
// TOOLS -> MATERIALS
///
Translation.addTranslation("Wooden %s", {
    de: "Holz %s",
    id: "%s kayu",
    it: "%s in legno",
    ja: "木製の%s", ko: "나무 %s",
    pl: "%s z drewna",
    pt: "%s de madeira",
    ru: "%s из древесины",
    sv: "Trä %s",
    uk: "%s з дерева",
    zh: "木制%s"
});
Translation.addTranslation("Wooden", {
    de: "Holz",
    id: "Kayu",
    it: "Di legno",
    ja: "木製", ko: "나무",
    pl: "Drewniany",
    pt: "De madeira",
    ru: "Древесина",
    sv: "Trä",
    uk: "Дерев'яний",
    zh: "木制"
});
Translation.addTranslation("Stone %s", {
    de: "Stein %s",
    id: "%s batu",
    it: "%s in pietra",
    ja: "石の%s", ko: "돌 %s",
    pl: "%s z kamienia",
    pt: "%s de pedra",
    ru: "%s из камня",
    sv: "Sten %s",
    uk: "%s з каменю",
    zh: "石制%s"
});
Translation.addTranslation("Stone", {
    de: "Stein",
    id: "Batu",
    it: "Di pietra",
    ja: "石", ko: "돌",
    pl: "Kamienny",
    pt: "De pedra",
    ru: "Камень",
    sv: "Sten",
    uk: "Кам'яний",
    zh: "石制"
});
Translation.addTranslation("Flint %s", {
    de: "Feuerstein %s",
    id: "%s batu krikil",
    it: "%s in selce",
    ja: "燧石の%s", ko: "부싯돌 %s",
    pl: "%s z krzemienia",
    pt: "%s de sílex",
    ru: "%s из кремния",
    sv: "Flinta %s",
    uk: "%s з кременю",
    zh: "燧石%s"
});
Translation.addTranslation("Flint", {
    de: "Feuerstein",
    id: "Krikil",
    it: "Selce",
    ja: "燧石", ko: "부싯돌",
    pl: "Krzemień",
    pt: "Sílex",
    ru: "Кремень",
    sv: "Flinta",
    uk: "Кремінь",
    zh: "燧石"
});
Translation.addTranslation("Cactus %s", {
    de: "Kaktus %s",
    id: "%s kaktus",
    it: "%s di cactus",
    ja: "サボテンの%s", ko: "선인장 %s",
    pl: "%s z kaktusa",
    pt: "%s de cacto",
    ru: "%s из кактусов",
    sv: "Kaktus %s",
    uk: "%s з кактусу",
    zh: "仙人掌%s"
});
Translation.addTranslation("Cactus", {
    de: "Kaktus",
    id: "Kaktus",
    it: "Cactus",
    ja: "サボテン",
    ko: "선인장",
    pl: "Kaktus",
    pt: "Cacto",
    ru: "Кактус",
    sv: "Kaktus",
    uk: "Кактус",
    zh: "仙人掌"
});
Translation.addTranslation("Obsidian %s", {
    de: "Obsidian %s",
    id: "%s obsidian",
    it: "%s di ossidiana",
    ja: "黒曜石の%s",
    ko: "흑요석 %s",
    pl: "%s z obsydianu",
    pt: "%s de obsidiana",
    ru: "%s из обсидиана",
    sv: "Obsidian %s",
    uk: "%s з обсидіану",
    zh: "黑曜石%s"
});
Translation.addTranslation("Obsidian", {
    de: "Obsidian",
    id: "Obsidian",
    it: "Ossidiana",
    ja: "黒曜石",
    ko: "흑요석",
    pl: "Obsydian",
    pt: "Obsidiana",
    ru: "Обсидиан",
    sv: "Obsidian",
    uk: "Обсидіан",
    zh: "黑曜石"
});
Translation.addTranslation("Prismarine %s", {
    de: "Prismarin %s",
    id: "%s prismarine",
    it: "%s di prismarino",
    ja: "プリズマリンの%s",
    ko: "프리즈마린 %s",
    pl: "%s z prismarynu",
    pt: "%s de prismarinho",
    ru: "%s из призмарина",
    sv: "Prismarin %s",
    uk: "%s з призмарину",
    zh: "水晶石%s"
});
Translation.addTranslation("Prismarine", {
    de: "Prismarin",
    id: "Prismarine",
    it: "Prismarino",
    ja: "プリズマリン",
    ko: "프리즈마린",
    pl: "Prismaryn",
    pt: "Prismarinho",
    ru: "Призмарин",
    sv: "Prismarin",
    uk: "Призмарин",
    zh: "水晶石"
});
Translation.addTranslation("Netherrack %s", {
    de: "Netherstein %s",
    id: "%s netherrack",
    it: "%s di netherrack",
    ja: "ネザーラックの%s",
    ko: "네더랙 %s",
    pl: "%s z netherrack",
    pt: "%s de netherrack",
    ru: "%s из незерака",
    sv: "Netherrack %s",
    uk: "%s з незераку",
    zh: "地狱岩%s"
});
Translation.addTranslation("Netherrack", {
    de: "Netherstein",
    id: "Netherrack",
    it: "Netherrack",
    ja: "ネザーラック",
    ko: "네더랙",
    pl: "Netherrack",
    pt: "Netherrack",
    ru: "Незерак",
    sv: "Netherrack",
    uk: "Незерак",
    zh: "地狱岩"
});
Translation.addTranslation("End Stone %s", {
    de: "Endstein %s",
    id: "%s batu akhir",
    it: "%s di pietra dell'End",
    ja: "エンドストーンの%s",
    ko: "엔드 스톤 %s",
    pl: "%s z kamienia końcowego",
    pt: "%s de pedra do fim",
    ru: "%s из эндерняка",
    sv: "Endsten %s",
    uk: "%s з ендерняку",
    zh: "末地石%s"
});
Translation.addTranslation("End Stone", {
    de: "Endstein",
    id: "Batu Akhir",
    it: "Pietra dell'End",
    ja: "エンドストーン",
    ko: "엔드 스톤",
    pl: "Kamień Końcowy",
    pt: "Pedra do Fim",
    ru: "Эндерняк",
    sv: "Endsten",
    uk: "Ендерняк",
    zh: "末地石"
});
Translation.addTranslation("Bone %s", {
    de: "Knochen %s",
    id: "%s tulang",
    it: "%s di osso",
    ja: "骨の%s",
    ko: "뼈 %s",
    pl: "%s z kości",
    pt: "%s de osso",
    ru: "%s из костей",
    sv: "Ben %s",
    uk: "%s з кісток",
    zh: "骨头%s"
});
Translation.addTranslation("Bone", {
    de: "Knochen",
    id: "Tulang",
    it: "Osso",
    ja: "骨",
    ko: "뼈",
    pl: "Kość",
    pt: "Osso",
    ru: "Кость",
    sv: "Ben",
    uk: "Кістка",
    zh: "骨头"
});
Translation.addTranslation("Paper %s", {
    de: "Papier %s",
    id: "%s kertas",
    it: "%s di carta",
    ja: "紙の%s",
    ko: "종이 %s",
    pl: "%s z papieru",
    pt: "%s de papel",
    ru: "%s из бумаги",
    sv: "Papper %s",
    uk: "%s з паперу",
    zh: "纸%s"
});
Translation.addTranslation("Paper", {
    de: "Papier",
    id: "Kertas",
    it: "Carta",
    ja: "紙",
    ko: "종이",
    pl: "Papier",
    pt: "Papel",
    ru: "Бумага",
    sv: "Papper",
    uk: "Папір",
    zh: "纸"
});
Translation.addTranslation("Sponge %s", {
    de: "Schwamm %s",
    id: "%s spons",
    it: "%s di spugna",
    ja: "スポンジの%s",
    ko: "스펀지 %s",
    pl: "%s z gąbki",
    pt: "%s de esponja",
    ru: "%s из губок",
    sv: "Svamp %s",
    uk: "%s з губок",
    zh: "海绵%s"
});
Translation.addTranslation("Sponge", {
    de: "Schwamm",
    id: "Spons",
    it: "Spugna",
    ja: "スポンジ",
    ko: "스펀지",
    pl: "Gąbka",
    pt: "Esponja",
    ru: "Губка",
    sv: "Svamp",
    uk: "Губка",
    zh: "海绵"
});
Translation.addTranslation("Firewood %s", {
    de: "%s aus Feuerholz",
    id: "%s kayu api",
    it: "%s legna da ardere",
    ja: "%s 火 ligne",
    ko: "%s 열매나무",
    pl: "%s opału",
    pt: "%s lenha",
    ru: "%s из огнедерева",
    sv: "%s bränsleved",
    uk: "%s дров",
    zh: "%s 木材"
});
Translation.addTranslation("Firewood", {
    de: "Feuerholz",
    id: "Kayu api",
    it: "Legna da ardere",
    ja: "火 ligne",
    ko: "열매나무",
    pl: "Opał",
    pt: "Lenha",
    ru: "Огнедерево",
    sv: "Bränsleved",
    uk: "Дрова",
    zh: "木材"
});
Translation.addTranslation("Slime %s", {
    de: "Schleim %s",
    id: "%s lendir",
    it: "%s di slime",
    ja: "スライムの%s",
    ko: "슬라임 %s",
    pl: "%s ze śluzu",
    pt: "%s de slime",
    ru: "%s из слизи",
    sv: "Slem %s",
    uk: "%s з слизу",
    zh: "史莱姆%s"
});
Translation.addTranslation("Slime", {
    de: "Schleim",
    id: "Slime",
    it: "Slime",
    ja: "スライム",
    ko: "슬라임",
    pl: "Śluz",
    pt: "Slime",
    ru: "Слизь",
    sv: "Slem",
    uk: "Слизь",
    zh: "史莱姆"
});
Translation.addTranslation("Blue Slime %s", {
    de: "Blauer Schleim %s",
    id: "%s lendir biru",
    it: "%s di slime blu",
    ja: "青いスライムの%s",
    ko: "파란 슬라임 %s",
    pl: "%s ze śluzu niebieskiego",
    pt: "%s de slime azul",
    ru: "%s из синей слизи",
    sv: "Blå slem %s",
    uk: "%s з синьої слизу",
    zh: "蓝色史莱姆%s"
});
Translation.addTranslation("Blue Slime", {
    de: "Blauer Schleim",
    id: "Slime Biru",
    it: "Slime Blu",
    ja: "青いスライム",
    ko: "파란 슬라임",
    pl: "Niebieski Śluz",
    pt: "Slime Azul",
    ru: "Синяя слизь",
    sv: "Blå slem",
    uk: "Синя слизь",
    zh: "蓝色史莱姆"
});
Translation.addTranslation("Magma Slime %s", {
    de: "Magmaschleim %s",
    id: "%s lendir magma",
    it: "%s di slime di magma",
    ja: "マグマスライムの%s",
    ko: "마그마 슬라임 %s",
    pl: "%s ze śluzu magmy",
    pt: "%s de slime de magma",
    ru: "%s из магмовой слизи",
    sv: "Magmaslem %s",
    uk: "%s з магмової слизу",
    zh: "岩浆史莱姆%s"
});
Translation.addTranslation("Magma Slime", {
    de: "Magmaschleim",
    id: "Slime Magma",
    it: "Slime di magma",
    ja: "マグマスライム",
    ko: "마그마 슬라임",
    pl: "Śluz Magmy",
    pt: "Slime de magma",
    ru: "Магмовая слизь",
    sv: "Magmaslem",
    uk: "Магмова слизь",
    zh: "岩浆史莱姆"
});
Translation.addTranslation("Knightslime %s", {
    de: "Ritterschleim %s",
    id: "%s lendir ksatria",
    it: "%s di slime cavaliere",
    ja: "ナイトスライムの%s",
    ko: "나이트 슬라임 %s",
    pl: "%s ze śluzu rycerskiego",
    pt: "%s de slime de cavaleiro",
    ru: "%s из короля слизней",
    sv: "Riddarslem %s",
    uk: "%s з короля слизнів",
    zh: "骑士史莱姆%s"
});
Translation.addTranslation("Knightslime", {
    de: "Ritterschleim",
    id: "Slime Ksatria",
    it: "Slime Cavaliere",
    ja: "ナイトスライム",
    ko: "나이트 슬라임",
    pl: "Śluz Rycerski",
    pt: "Slime de Cavaleiro",
    ru: "Слизь из короля слизней",
    sv: "Riddarslem",
    uk: "Слизь короля слизнів",
    zh: "骑士史莱姆"
});
Translation.addTranslation("Iron %s", {
    de: "Eisen %s",
    id: "%s besi",
    it: "%s di ferro",
    ja: "鉄の%s",
    ko: "철 %s",
    pl: "%s z żelaza",
    pt: "%s de ferro",
    ru: "%s из железа",
    sv: "Järn %s",
    uk: "%s з заліза",
    zh: "铁%s"
});
Translation.addTranslation("Iron", {
    de: "Eisen",
    id: "Besi",
    it: "Ferro",
    ja: "鉄",
    ko: "철",
    pl: "Żelazo",
    pt: "Ferro",
    ru: "Железо",
    sv: "Järn",
    uk: "Залізо",
    zh: "铁"
});
Translation.addTranslation("Pigiron %s", {
    de: "Schweineisen %s",
    id: "%s besi babi",
    it: "%s di ghisa",
    ja: "ピッグアイアンの%s",
    ko: "돼지철 %s",
    pl: "%s z żelaza hutniczego",
    pt: "%s de ferro de porco",
    ru: "%s из чугуна",
    sv: "Grisjärn %s",
    uk: "%s з чавуну",
    zh: "猪铁%s"
});
Translation.addTranslation("Pigiron", {
    de: "Schweineisen",
    id: "Besi Babi",
    it: "Ghisa",
    ja: "ピッグアイアン",
    ko: "돼지철",
    pl: "Żelazo Hutnicze",
    pt: "Ferro de Porco",
    ru: "Чугун",
    sv: "Grisjärn",
    uk: "Чавун",
    zh: "猪铁"
});
Translation.addTranslation("Cobalt %s", {
    de: "Kobalt %s",
    id: "%s kobalt",
    it: "%s di cobalto",
    ja: "コバルトの%s",
    ko: "코발트 %s",
    pl: "%s z kobaltu",
    pt: "%s de cobalto",
    ru: "%s из кобальта",
    sv: "Kobolt %s",
    uk: "%s з кобальту",
    zh: "钴%s"
});
Translation.addTranslation("Cobalt", {
    de: "Kobalt",
    id: "Kobalt",
    it: "Cobalto",
    ja: "コバルト",
    ko: "코발트",
    pl: "Kobalt",
    pt: "Cobalto",
    ru: "Кобальт",
    sv: "Kobolt",
    uk: "Кобальт",
    zh: "钴"
});
Translation.addTranslation("Ardite %s", {
    de: "Ardit %s",
    id: "%s ardit",
    it: "%s di ardite",
    ja: "アーダイトの%s",
    ko: "아르다이트 %s",
    pl: "%s z ardycie",
    pt: "%s de ardite",
    ru: "%s из ардита",
    sv: "Ardit %s",
    uk: "%s з ардиту",
    zh: "硬化%s"
});
Translation.addTranslation("Ardite", {
    de: "Ardit",
    id: "Ardit",
    it: "Ardite",
    ja: "アーダイト",
    ko: "아르다이트",
    pl: "Ardycie",
    pt: "Ardite",
    ru: "Ардит",
    sv: "Ardit",
    uk: "Ардит",
    zh: "硬化"
});
Translation.addTranslation("Manyullyn %s", {
    de: "Manyullyn %s",
    id: "%s manyullyn",
    it: "%s di manyullyn",
    ja: "マニュリンの%s",
    ko: "마뉴린 %s",
    pl: "%s z manyullyn",
    pt: "%s de manyullyn",
    ru: "%s из манюллина",
    sv: "Manyullyn %s",
    uk: "%s з манюліну",
    zh: "曼尼林%s"
});
Translation.addTranslation("Manyullyn", {
    de: "Manyullyn",
    id: "Manyullyn",
    it: "Manyullyn",
    ja: "マニュリン",
    ko: "마뉴린",
    pl: "Manyullyn",
    pt: "Manyullyn",
    ru: "Манюллин",
    sv: "Manyullyn",
    uk: "Манюлін",
    zh: "曼尼林"
});
Translation.addTranslation("Copper %s", {
    de: "Kupfer %s",
    id: "%s tembaga",
    it: "%s di rame",
    ja: "銅の%s",
    ko: "구리 %s",
    pl: "%s z miedzi",
    pt: "%s de cobre",
    ru: "%s из меди",
    sv: "Koppar %s",
    uk: "%s з міді",
    zh: "铜%s"
});
Translation.addTranslation("Copper", {
    de: "Kupfer",
    id: "Tembaga",
    it: "Rame",
    ja: "銅",
    ko: "구리",
    pl: "Miedź",
    pt: "Cobre",
    ru: "Медь",
    sv: "Koppar",
    uk: "Мідь",
    zh: "铜"
});
Translation.addTranslation("Bronze %s", {
    de: "Bronze %s",
    id: "%s perunggu",
    it: "%s di bronzo",
    ja: "ブロンズの%s",
    ko: "청동 %s",
    pl: "%s z brązu",
    pt: "%s de bronze",
    ru: "%s из бронзы",
    sv: "Brons %s",
    uk: "%s з бронзи",
    zh: "青铜%s"
});
Translation.addTranslation("Bronze", {
    de: "Bronze",
    id: "Perunggu",
    it: "Bronzo",
    ja: "ブロンズ",
    ko: "청동",
    pl: "Brąz",
    pt: "Bronze",
    ru: "Бронза",
    sv: "Brons",
    uk: "Бронза",
    zh: "青铜"
});
Translation.addTranslation("Lead %s", {
    de: "Blei %s",
    id: "%s timah",
    it: "%s di piombo",
    ja: "鉛の%s",
    ko: "납 %s",
    pl: "%s z ołowiu",
    pt: "%s de chumbo",
    ru: "%s из свинца",
    sv: "Bly %s",
    uk: "%s з свинцю",
    zh: "铅%s"
});
Translation.addTranslation("Lead", {
    de: "Blei",
    id: "Timah",
    it: "Piombo",
    ja: "鉛",
    ko: "납",
    pl: "Ołów",
    pt: "Chumbo",
    ru: "Свинец",
    sv: "Bly",
    uk: "Свинець",
    zh: "铅"
});
Translation.addTranslation("Silver %s", {
    de: "Silber %s",
    id: "%s perak",
    it: "%s di argento",
    ja: "銀の%s",
    ko: "은 %s",
    pl: "%s z srebra",
    pt: "%s de prata",
    ru: "%s из серебра",
    sv: "Silver %s",
    uk: "%s зі срібла",
    zh: "银%s"
});
Translation.addTranslation("Silver", {
    de: "Silber",
    id: "Perak",
    it: "Argento",
    ja: "銀",
    ko: "은",
    pl: "Srebro",
    pt: "Prata",
    ru: "Серебро",
    sv: "Silver",
    uk: "Срібло",
    zh: "银"
});
Translation.addTranslation("Electrum %s", {
    de: "Elektrum %s",
    id: "%s elektro",
    it: "%s di elettro",
    ja: "エレクトラムの%s",
    ko: "전기 %s",
    pl: "%s z elektrum",
    pt: "%s de eletrum",
    ru: "%s из электрума",
    sv: "Elektrum %s",
    uk: "%s з електруму",
    zh: "电金%s"
});
Translation.addTranslation("Electrum", {
    de: "Elektrum",
    id: "Elektro",
    it: "Elettro",
    ja: "エレクトラム",
    ko: "전기",
    pl: "Elektrum",
    pt: "Eletrum",
    ru: "Электрум",
    sv: "Elektrum",
    uk: "Електрум",
    zh: "电金"
});
Translation.addTranslation("Steel %s", {
    de: "Stahl %s",
    id: "%s baja",
    it: "%s di acciaio",
    ja: "鋼の%s",
    ko: "강철 %s",
    pl: "%s ze stali",
    pt: "%s de aço",
    ru: "%s из стали",
    sv: "Stål %s",
    uk: "%s зі сталі",
    zh: "钢%s"
});
Translation.addTranslation("Steel", {
    de: "Stahl",
    id: "Baja",
    it: "Acciaio",
    ja: "鋼",
    ko: "강철",
    pl: "Stal",
    pt: "Aço",
    ru: "Сталь",
    sv: "Stål",
    uk: "Сталь",
    zh: "钢"
});
///
// TOOLS -> MODIFIERS
///
Translation.addTranslation("Haste", {
    de: "Eile", id: "Haste",
    it: "Sollecitudine",
    ja: "加速",
    ko: "성급함",
    pl: "Pośpieszny",
    pt: "Pressa",
    ru: "Спешка",
    sv: "Skyndsamhet",
    uk: "Квапливість",
    zh: "急迫"
});
Translation.addTranslation("Luck", {
    de: "Glück", id: "Luck",
    it: "Fortuna",
    ja: "ラッキー", ko: "운",
    pl: "Szczęśliwy",
    pt: "Sorte", ru: "Удача", sv: "Tur",
    uk: "Удачливо",
    zh: "幸运"
});
Translation.addTranslation("Sharper", {
    de: "Schärfer",
    id: "Sharper",
    it: "Affilatezza",
    ja: "超鋭利",
    ko: "뾰족함",
    pl: "Ostrzejszy",
    pt: "Mais Afiado",
    ru: "Острота",
    sv: "Mer skärpa",
    uk: "Гострішість",
    zh: "锋利"
});
Translation.addTranslation("Diamond", {
    de: "Diamant",
    id: "Diamond",
    it: "Diamante",
    ja: "ダイヤモンド", ko: "다이아몬드",
    pl: "Diament",
    pt: "Diamante",
    ru: "Алмаз",
    sv: "Diamant",
    uk: "Діамант",
    zh: "钻石"
});
Translation.addTranslation("Emerald", {
    de: "Smaragd",
    id: "Emerald",
    it: "Smeraldo",
    ja: "エメラルド", ko: "에메랄드",
    pl: "Szmaragd",
    pt: "Esmeralda",
    ru: "Изумруд",
    sv: "Smaragd",
    uk: "Смарагд",
    zh: "绿宝石"
});
Translation.addTranslation("Silky Cloth", {
    de: "Seidiger Stoff",
    id: "Kain Sutra",
    it: "Panno di seta",
    ja: "シルキークロス",
    ko: "비단결 천",
    pl: "Jedwabista tkanina",
    pt: "Pano de Seda",
    ru: "Шелковая ткань",
    sv: "Silkestyg",
    uk: "Шовкова тканина",
    zh: "丝绢"
});
Translation.addTranslation("Silky Jewel", {
    de: "Seidiges Juwel",
    id: "Permata Halus",
    it: "Gioiello di seta",
    ja: "シルキージュエル",
    ko: "비단결 보석",
    pl: "Jedwabisty klejnot",
    pt: "Jóia de Seda",
    ru: "Шелковый самоцвет",
    sv: "Silkesjuvel",
    uk: "Шовковий самоцвіт",
    zh: "裹绸宝石"
});
Translation.addTranslation("Silky", {
    de: "Seidig", id: "Silky", it: "Setoso", ja: "シルキー", ko: "비단결",
    pl: "Jedwabisty",
    pt: "Sedoso",
    ru: "Шелковистость",
    sv: "Silkeslent",
    uk: "Шовковість",
    zh: "丝触"
});
Translation.addTranslation("Reinforcement", {
    de: "Verstärkung",
    id: "Penguatan",
    it: "Rafforzamento",
    ja: "強化",
    ko: "강화",
    pl: "Wzmocnienie",
    pt: "Reforço",
    ru: "Укрепитель",
    sv: "förstärkning",
    uk: "Посилення",
    zh: "加强"
});
Translation.addTranslation("Reinforced", {
    id: "Reinforced",
    it: "Rinforzato",
    ja: "補強", ko: "보강",
    pl: "Wzmocniony",
    pt: "Reforçado",
    ru: "Прочность",
    sv: "Förstärkt",
    uk: "Укріплення",
    zh: "加固"
});
Translation.addTranslation("Beheading", {
    de: "Enthauptung",
    id: "Pemotongan Kepala",
    it: "Decapitazione",
    ja: "首切り",
    ko: "머리 자르기",
    pl: "Dekapitacja",
    pt: "Decapitação",
    ru: "Отсечение",
    sv: "Avrättning",
    uk: "Деcapitation",
    zh: "斩首"
});
Translation.addTranslation("Graveyard Soil", {
    de: "Friedhofserde",
    id: "Tanah Perkuburan",
    it: "Terra di un Cimitero",
    ja: "墓地土",
    ko: "무덤 토양",
    pl: "Ziemia cmentarna",
    pt: "Terra do Cemitério",
    ru: "Кладбищенская почва",
    sv: "Kyrkogårdsjord",
    uk: "Цвинтарна земля",
    zh: "坟 earth"
});
Translation.addTranslation("Consecrated Soil", {
    de: "Geweihte Erde",
    id: "Tanah Berkhatan",
    it: "Terra Consacrata",
    ja: "聖なる土",
    ko: "성스러운 토양",
    pl: "Ziemia poświęcona",
    pt: "Terra Sagrada",
    ru: "Освященная почва",
    sv: "Helgad jord",
    uk: "Свята земля",
    zh: "圣地 earth"
});
Translation.addTranslation("Smite", {
    de: "Schlag", id: "Smite",
    it: "Anatema",
    ja: "アンデッド特効",
    ko: "강타",
    pl: "Pogromca nieumarłych",
    pt: "Golpe", ru: "Небесная кара", sv: "Heligt",
    uk: "Небесна кара",
    zh: "亡灵杀手"
});
Translation.addTranslation("Bane of Arthropods", {
    de: "Der Fluch der Gliedertiere",
    id: "Hukum Serangga",
    it: "Flagello degli Artropodi",
    ja: "甲殻動物の苦",
    ko: "충수동물의 anseong",
    pl: "Plaga stawonogów",
    pt: "Fléau dos Artrópodes",
    ru: "Бич членистоногих",
    sv: "Gliederfotingarnas förbannelse",
    uk: "Прокляття Членистоногих",
    zh: "arthropoda的灾难"
});
Translation.addTranslation("Fiery", {
    de: "Feurig", id: "Fiery",
    it: "Ardente",
    ja: "灼熱", ko: "불꽃",
    pl: "Ognisty",
    pt: "Ardente",
    ru: "Воспламенение",
    sv: "Brännhet",
    uk: "Вогнистість",
    zh: "怒火"
});
Translation.addTranslation("Necrotic Bone", {
    de: "Nekrotischer Knochen",
    id: "Necrotic Bone",
    it: "Osso necrotico",
    ja: "ネクロボーン",
    ko: "영혼이 깃든 뼈",
    pl: "Nekrotyczna kość",
    pt: "Osso Necrosado",
    ru: "Некротическая кость",
    sv: "Nekrotiskt ben",
    uk: "Некротична кістка",
    zh: "噬生之骨"
});
Translation.addTranslation("Necrotic", {
    de: "Nekrotisch",
    id: "Necrotic",
    it: "Necrotico",
    ja: "ネクロマンシー",
    ko: "사령의 가시",
    pl: "Nekrotyczny",
    pt: "Necrosado",
    ru: "Некроз",
    sv: "Nekrotiskt",
    uk: "Некротичність",
    zh: "噬生"
});
Translation.addTranslation("Knockback", {
    de: "Rückschlag",
    id: "Knockback",
    it: "Contraccolpo",
    ja: "ノックバック", ko: "밀치기", pl: "Odrzut",
    pt: "Repulsão",
    ru: "Отбрасывание",
    sv: "Knuff",
    uk: "Відкидування",
    zh: "击退"
});
Translation.addTranslation("Ball of Moss", {
    de: "Moosballen",
    id: "Bola moss",
    it: "Palla di muschio",
    ja: "モスボール",
    ko: "머드 구슬",
    pl: "Kula mchu",
    pt: "Bola de líquen",
    ru: "Комок мха",
    sv: "Mossboll",
    uk: "Куля моху",
    zh: "苔球"
});
Translation.addTranslation("Mending Moss", {
    de: "Heilender Moos",
    id: "Moss regenerasi",
    it: "Muschio riparatore",
    ja: "回復の苔",
    ko: "치유의 머드",
    pl: "Naprawiający mch",
    pt: "Líquen restaurador",
    ru: "Мох восстановления",
    sv: "Återställande mossa",
    uk: "Відновлювальний мох",
    zh: "治愈苔"
});
Translation.addTranslation("Mending Moss requires at least 10 levels", {
    de: "Erfordert mindestens Stufe 10 für Heilenden Moos",
    id: "Regenerasi moss membutuhkan minimal level 10",
    it: "Il muschio curativo richiede almeno livello 10",
    ja: "回復の苔がレベル10以上必要です",
    ko: "치유의 머드는 최소 10级이 필요합니다.",
    pl: "Naprawiający mch wymaga co najmniej poziomu 10",
    pt: "Requer pelo menos nível 10 para o Líquen Restaurador",
    ru: "Мох восстановления требует по крайней мере 10 уровня",
    sv: "Återställande mossa kräver minst nivå 10",
    uk: "Відновлювальний мох вимагає принаймні 10 рівнів",
    zh: "治愈苔需要至少10级"
});
Translation.addTranslation("Mending", {
    "de": "Reparatur",
    "id": "Perbaikan",
    "it": "Riparazione",
    "ja": "修復",
    "ko": "수리",
    "pl": "Poprawka",
    "pt": "Conservar",
    "ru": "Починка",
    "sv": "Rätta",
    "uk": "Ремонт",
    "zh": "维修"
});
Translation.addTranslation("Shulking", {
    "de": "Schwebend",
    "id": "Membeku",
    "it": "Sospeso",
    "ja": "シャーキング",
    "ko": "쉬��ing",
    "pl": "Płynący w powietrzu",
    "pt": "Flutuando",
    "ru": "Левитация",
    "sv": "Svävande",
    "uk": "Утримання в повітрі",
    "zh": "漂浮"
});
Translation.addTranslation("Web", {
    "de": "Netz",
    "id": "Jaringan",
    "it": "Ragnatela",
    "ja": "ウェブ",
    "ko": "거미줄",
    "pl": "Siateczka",
    "pt": "Teia",
    "ru": "Запутанность",
    "sv": "Nät",
    "uk": "Павутина",
    "zh": "网状物"
});
///
// TOOLS -> LEVELING
///
Translation.addTranslation("Clumsy", {
    de: "Ungeschickt",
    id: "Klumpsuka",
    it: "Sgraziato",
    ja: "不器用",
    ko: "헛디짓",
    pl: "Nieporadny",
    pt: "Torpe",
    ru: "Неловкий",
    sv: "Utkastad",
    uk: "Невмілий",
    zh: "笨手笨脚"
});
Translation.addTranslation("Your %s has reached level %s.", {
    de: "Deine %s hat Level %s erreicht.",
    id: "Anda mencapai tingkat %s pada %s Anda.",
    it: "La tua %s ha raggiunto il livello %s.",
    ja: "あなたの%sがレベル%sに到達しました。",
    ko: "당신의 %s이 %s 레벨에 도달했습니다.",
    pl: "Twoje %s osiągnęło nowy poziom %s.",
    pt: "Seu %s alcançou o nível %s.",
    ru: "Ваш %s достиг нового уровня %s.",
    sv: "Ditt %s har nått upp till nivå %s.",
    uk: "Ваше %s досягло рівня %s.",
    zh: "你的%s已经升级到了%s等级。"
});
Translation.addTranslation("Comfortable", {
    de: "Bequem",
    id: "Mudah",
    it: "Aggraziato",
    ja: "快適",
    ko: "편안한",
    pl: "Wygodny",
    pt: "Confortável",
    ru: "Удобный",
    sv: "Komfortabel",
    uk: "Зручний",
    zh: "舒适"
});
Translation.addTranslation("You begin to feel comfortable handling the %s.", {
    de: "Du fängst an, dich mit dem %s wohl zu fühlen.",
    id: "Anda mulai merasa nyaman memegang %s.",
    it: "Inizi a sentirti a tuo agio nel maneggiare il %s.",
    ja: "あなたは、%sを持っていると快適に感じ始めます。",
    ko: "당신은 %s를 조작하는 것이 불편하지 않게 느껴집니다.",
    pl: "Zaczynasz poczuwać się komfortowo, obsługując %s.",
    pt: "Você começa a se sentir à vontade com o manipuleio do %s.",
    ru: "Вам становится непривычно удобно держать %s.",
    sv: "Du börjar kännas bekväm med att hantera %s.",
    uk: "Ви починаєте відчувати себе комфортно з обробкою %s.",
    zh: "您开始觉得操作%s更自然了。"
});
Translation.addTranslation("Accustomed", {
    de: "Gewohnt",
    id: "Terbiasa",
    it: "Abituato",
    ja: "慣れた",
    ko: "익숙한",
    pl: "Przyzwyczajony",
    pt: "Habitual",
    ru: "Привычный",
    sv: "Van",
    uk: "Звичний",
    zh: "习惯的"
});
Translation.addTranslation("You are now accustomed to the weight of the %s.", {
    de: "Du bist nun an das Gewicht des %s gewöhnt.",
    id: "Anda sekarang terbiasa dengan berat %s.",
    it: "Ora sei abituato al peso del %s.",
    ja: "今では%sの重さに慣れました。",
    ko: "이제 %s의 무게에 익숙해졌습니다.",
    pl: "Teraz jesteś przyzwyczajony do wagi %s.",
    pt: "Agora você está habituado ao peso de %s.",
    ru: "Вы привыкаете к стати собственного %s.",
    sv: "Du är nu van vid vikten av %s.",
    uk: "Ви звикли до ваги %s.",
    zh: "你现在已经习惯了%s的重量。"
});
Translation.addTranslation("Adept", {
    de: "Versiert",
    id: "Mahir",
    it: "Adepto",
    ja: "熟練した",
    ko: "숙련된",
    pl: "Biegły",
    pt: "Apto",
    ru: "Самородок",
    sv: "Kunnig",
    uk: "Майстерний",
    zh: "熟练的"
});
Translation.addTranslation("You have become adept at handling the %s.", {
    de: "Du bist geschickt im Umgang mit dem %s geworden.",
    id: "Anda telah menjadi mahir dalam menangani %s.",
    it: "Sei diventato abile nel gestire %s.",
    ja: "%sの取り扱いに熟練しました。",
    ko: "%s를 다루는 데에 숙련되었습니다.",
    pl: "Stałeś się biegły w obsłudze %s.",
    pt: "Você se tornou apto para lidar com %s.",
    ru: "Вас смело можно назвать самородком в работе с %s.",
    sv: "Du har blivit kunnig på att hantera %s.",
    uk: "Ви стали майстерним у володінні %s.",
    zh: "你已经熟练地处理%s了。"
});
Translation.addTranslation("Expert", {
    de: "Experte",
    id: "Ahli",
    it: "Esperto",
    ja: "専門家",
    ko: "전문가",
    pl: "Ekspert",
    pt: "Perito",
    ru: "Эксперт",
    sv: "Expert",
    uk: "Експерт",
    zh: "专家"
});
Translation.addTranslation("You are now an expert at using the %s!", {
    de: "Du bist jetzt ein Experte darin, %s zu benutzen!",
    id: "Anda sekarang ahli dalam menggunakan %s!",
    it: "Ora sei un esperto nell'uso di %s!",
    ja: "今や%sの使い方に精通しています！",
    ko: "이제 %s 사용에 대해 전문가입니다!",
    pl: "Teraz jesteś ekspertem w korzystaniu z %s!",
    pt: "Agora você é um perito em usar %s!",
    ru: "Вы настоящий эксперт в использовании %s!",
    sv: "Du är nu en expert på att använda %s!",
    uk: "Ви тепер справжній експерт у використанні %s!",
    zh: "您现在是%s的专家了！"
});
Translation.addTranslation("Master", {
    de: "Meister",
    id: "Mahir",
    it: "Maestro",
    ja: "マスター",
    ko: "마스터",
    pl: "Mistrz",
    pt: "Mestre",
    ru: "Мастер",
    sv: "Mästare",
    uk: "Майстер",
    zh: "大师"
});
Translation.addTranslation("You have mastered the %s!", {
    de: "Du hast %s gemeistert!",
    id: "Anda telah menguasai %s!",
    it: "Hai padroneggiato %s!",
    ja: "%sをマスターしました！",
    ko: "%s를 마스터하셨습니다!",
    pl: "Opanowałeś %s!",
    pt: "Você dominou %s!",
    ru: "Вы мастерски отточили свои навыки с %s!",
    sv: "Du har bemästrat %s!",
    uk: "Ви володієте майстерністю з %s!",
    zh: "您已经精通了%s！"
});
Translation.addTranslation("Grandmaster", {
    de: "Großmeister",
    id: "Grandmaster",
    it: "Gran Maestro",
    ja: "グランドマスター",
    ko: "그랜드마스터",
    pl: "Arcymistrz",
    pt: "Grão-Mestre",
    ru: "Профессионал",
    sv: "Stor Mästare",
    uk: "Великий майстер",
    zh: "大师级别"
});
Translation.addTranslation("You have grandmastered the %s!", {
    de: "Du hast das %s großmeisterhaft gemeistert!",
    id: "Anda telah menjadi grandmaster dari %s!",
    it: "Hai padroneggiato alla perfezione %s!",
    ja: "%sをグランドマスターしました！",
    ko: "%s를 그랜드마스터하셨습니다!",
    pl: "Opanowałeś %s na poziomie arcymistrzowskim!",
    pt: "Você se tornou um grão-mestre em %s!",
    ru: "Вы настоящий профессионал в использовании %s!",
    sv: "Du har bemästrat %s på stor mästarnivå!",
    uk: "Ви справжній великий майстер у використанні %s!",
    zh: "您已经达到%s的大师级水平！"
});
Translation.addTranslation("Heroic", {
    de: "Heroisch",
    id: "Heroik",
    it: "Eroico",
    ja: "英雄的",
    ko: "영웅적인",
    pl: "Heroiczny",
    pt: "Heroico",
    ru: "Героический",
    sv: "Hjältemodig",
    uk: "Героїчний",
    zh: "英勇的"
});
Translation.addTranslation("You feel like you could fulfill mighty deeds with your %s!", {
    de: "Du fühlst dich, als könntest du mit deinem %s mächtige Taten vollbringen!",
    id: "Anda merasa seolah-olah Anda bisa melakukan perbuatan luar biasa dengan %s Anda!",
    it: "Ti senti come se potessi compiere imprese potenti con il tuo %s!",
    ja: "あなたは自分の%sで偉業を成し遂げることができる気がします！",
    ko: "당신은 %s로 위대한 업적을 이룰 수 있을 것 같습니다!",
    pl: "Czujesz, że mógłbyś dokonać potężnych czynów za pomocą swojego %s!",
    pt: "Você sente que poderia cumprir feitos poderosos com o seu %s!",
    ru: "Вы начинаете чувствовать, что могли бы совершать невероятное со своим %s!",
    sv: "Du känner att du skulle kunna utföra mäktiga bedrifter med din %s!",
    uk: "Ви відчуваєте, що могли б виконувати величезні справи з вашим %s!",
    zh: "您觉得您可以用您的%s实现伟大的壮举！"
});
Translation.addTranslation("Legendary", {
    de: "Legendär",
    id: "Legendaris",
    it: "Leggendario",
    ja: "伝説的",
    ko: "전설적인",
    pl: "Legendarny",
    pt: "Lendário",
    ru: "Легендарный",
    sv: "Legendarisk",
    uk: "Легендарний",
    zh: "传奇的"
});
Translation.addTranslation("You and your %s are living legends!", {
    de: "Du und dein %s seid lebende Legenden!",
    id: "Anda dan %s Anda adalah legenda hidup!",
    it: "Tu e il tuo %s siete leggende viventi!",
    ja: "あなたとあなたの%sは生きている伝説です！",
    ko: "당신과 당신의 %s는 살아있는 전설입니다!",
    pl: "Ty i twój %s jesteście żywymi legendami!",
    pt: "Você e o seu %s são lendas vivas!",
    ru: "Вы и ваш %s настоящие живые легенды!",
    sv: "Du och din %s är levande legender!",
    uk: "Ви та ваш %s - живі легенди!",
    zh: "你和你的%s是活着的传奇！"
});
Translation.addTranslation("Godlike", {
    de: "Göttlich",
    id: "Seperti Dewa",
    it: "Divino",
    ja: "神々しい",
    ko: "신처럼 강력한",
    pl: "Boski",
    pt: "Divino",
    ru: "Богоподобный",
    sv: "Gudalik",
    uk: "Богоподібний",
    zh: "如神一般"
});
Translation.addTranslation("No god could stand in the way of you and your %s!", {
    de: "Kein Gott könnte sich dir und deinem %s in den Weg stellen!",
    id: "Tidak ada dewa yang bisa menghalangi Anda dan %s Anda!",
    it: "Nessun dio potrebbe ostacolare te e il tuo %s!",
    ja: "どの神もあなたとあなたの%sの前に立ちふさがることはできません！",
    ko: "어떤 신도 당신과 당신의 %s의 길에 섰을 수 없을 것입니다!",
    pl: "Żaden bóg nie mógłby stanąć na drodze między tobą a twoim %s!",
    pt: "Nenhum deus poderia ficar no caminho entre você e o seu %s!",
    ru: "Не дай бог кто-то станет на пути перед вами и вашим %s!",
    sv: "Ingen gud kunde stå i vägen för dig och din %s!",
    uk: "Ні один бог не зміг би встояти на шляху між тобою та твоїм %s!",
    zh: "没有神灵能阻挡你和你的%s的道路！"
});
Translation.addTranslation("Awesome", {
    de: "Fantastisch",
    id: "Mengagumkan",
    it: "Fantastico",
    ja: "すばらしい", ko: "멋진",
    pl: "Niesamowity",
    pt: "Impressionante",
    ru: "Умопомрачительный",
    sv: "Fantastisk",
    uk: "Дивовижний",
    zh: "令人敬畏的"
});
Translation.addTranslation("Your %s is pure awesome.", {
    de: "Dein %s ist einfach fantastisch.",
    id: "%s Anda benar-benar mengagumkan.",
    it: "Il tuo %s è semplicemente fantastico.",
    ja: "あなたの%sは本当に素晴らしいです。",
    ko: "당신의 %s는 정말 멋집니다.",
    pl: "Twój %s jest czysto niesamowity.",
    pt: "Seu %s é pura impressionante.",
    ru: "Ваш %s просто умопомрачителен.",
    sv: "Din %s är ren fantastisk.",
    uk: "Ваш %s просто дивовижний.",
    zh: "你的%s真是太棒了。"
});
Translation.addTranslation("Hacker", {
    de: "Hacker",
    id: "Peretas",
    it: "Hacker",
    ja: "ハッカー", ko: "해커",
    pl: "Haker",
    pt: "Hacker",
    ru: "Хакер",
    sv: "Hackare",
    uk: "Хакер",
    zh: "黑客"
});
///
// INTEGRATIONS
///
Translation.addTranslation("Part Building", {
    de: "Teilmontage",
    id: "Pembangunan bagian",
    it: "Assemblaggio di parti",
    ja: "パーツ組み立て",
    ko: "부품 조립",
    pl: "Montaż części",
    pt: "Construção de peças",
    ru: "Сборка деталей",
    sv: "Delbyggnad",
    uk: "Монтаж деталей",
    zh: "零件组装"
});
Translation.addTranslation("Melting", {
    de: "Schmelzen",
    id: "Melting",
    it: "Fusione",
    ja: "溶融", ko: "용해",
    pl: "Topienie",
    pt: "Fundição",
    ru: "Переплавка",
    sv: "Nedsmältning",
    uk: "Розплавлення",
    zh: "熔炼"
});
Translation.addTranslation("Melt", {
    de: "Schmelzen",
    id: "Mencairkan",
    it: "Sciogliere",
    ja: "溶かす",
    ko: "용융하다",
    pl: "Topienie",
    pt: "Derreter",
    ru: "Плавка",
    sv: "Smälta",
    uk: "Плавлення",
    zh: "熔化"
});
Translation.addTranslation("Alloying", {
    de: "Legieren",
    id: "Alloying",
    it: "Lega", ja: "合金化", ko: "합금",
    pl: "Mieszanie metali",
    pt: "Ligamento",
    ru: "Смешивание",
    sv: "Legering",
    uk: "Сплавляння",
    zh: "合金"
});
Translation.addTranslation("Alloy", {
    de: "Legierung",
    id: "Logam campuran",
    it: "Lega",
    ja: "合金", ko: "합금",
    pl: "Stop",
    pt: "Aleação",
    ru: "Смесь",
    sv: "Legering",
    uk: "Легування",
    zh: "合金"
});
Translation.addTranslation("Item Casting", {
    de: "Gegenstandsguss",
    id: "Penempaan barang",
    it: "Fonderia oggetto",
    ja: "アイテム・キャスティング",
    ko: "아이템 주입",
    pl: "Odlew przedmiotów",
    pt: "Couro do item",
    ru: "Литье предметов",
    sv: "Objektgjutning",
    uk: "Виливка предметів",
    zh: "物品冶炼"
});
Translation.addTranslation("Block Casting", {
    de: "Blockguss",
    id: "Pengecoran blok",
    it: "Colata blocco",
    ja: "ブロック・キャスティング",
    ko: "블록 주입",
    pl: "Blok odlewnictwo",
    pt: "Couro de bloco",
    ru: "Литье блоков",
    sv: "Blockgjutning",
    uk: "Виливка блоків",
    zh: "方块冶炼"
});
// Translation.addTranslation("Cast item is consumed on casting", {
// 	de: "Gegossener Gegenstand wird beim Zaubern verbraucht",
// 	id: "Cast item is consumed on casting",
// 	it: "L'oggetto di stampo si consuma al momento dello stampo",
// 	ja: "型はなくなります",
// 	ko: "이 아이템은 주조할 때 소모됩니다",
// 	pl: "Forma niszczy się przy odlewaniu",
// 	pt: "O item fundido é consumido na fundição",
// 	ru: "Форма расходуется во время литья",
// 	sv: "Avgjutningen konsumeras vid gjutning",
// 	uk: "Предмет-форма витрачається при литті",
// 	zh: "消耗铸模"
// });
Translation.addTranslation("Consumes cast", {
    de: "Verbraucht Form",
    id: "Memakai pemutus",
    it: "Consuma il fascio",
    ja: "キャストを消費する",
    ko: "시전을 소비합니다.",
    pl: "Zużywa zaklęcie",
    pt: "Consome lançamento",
    ru: "Расходует форму",
    sv: "Konsumerar besvärjning",
    uk: "Витрачає замовляння",
    zh: "耗费施法"
});
Translation.addTranslation("%s s", { de: "%s s", id: "%s s", it: "%s s", ja: "%s秒", ko: "%s초", pl: "%s s", pt: "%s s", ru: "%s сек", sv: "%s s", uk: "%s с", zh: "%s秒" });
Translation.addTranslation("%s°C", { de: "%s°C", id: "%s°C", it: "%s°C", ja: "%s°C", ko: "%s°C", pl: "%s°C", pt: "%s°C", ru: "%s°C", sv: "%s°C", uk: "%s°C", zh: "%s℃" });
var EPartCategory = {
    HEAD: 1 << 0,
    HANDLE: 1 << 1,
    EXTRA: 1 << 2
};
var PartCategory = {
    pickaxe: EPartCategory.HEAD,
    shovel: EPartCategory.HEAD,
    axe: EPartCategory.HEAD,
    broadaxe: EPartCategory.HEAD,
    sword: EPartCategory.HEAD,
    hammer: EPartCategory.HEAD,
    excavator: EPartCategory.HEAD,
    rod: EPartCategory.HANDLE,
    rod2: EPartCategory.HANDLE | EPartCategory.EXTRA,
    binding: EPartCategory.EXTRA,
    binding2: EPartCategory.EXTRA,
    guard: EPartCategory.EXTRA,
    largeplate: EPartCategory.HEAD | EPartCategory.EXTRA
};
var MatValue;
(function (MatValue) {
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
})(MatValue || (MatValue = {}));
var MiningLv = {
    STONE: 1,
    IRON: 2,
    DIAMOND: 3,
    OBSIDIAN: 4,
    COBALT: 5
};
var MiningLvName = {
    1: "Stone",
    2: "Iron",
    3: "Diamond",
    4: "Obsidian",
    5: "Cobalt"
};
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
        this.anim.describe({ render: this.render.getId(), skin: MoltenLiquid.PATH });
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
    function CraftingWindow(windowName, window) {
        var _this = this;
        this.name = windowName;
        this.window = window;
        this.containerByEntity = {};
        var windows = this.window.getAllWindows();
        var it = windows.iterator();
        while (it.hasNext()) {
            it.next().setAsGameOverlay(true);
        }
        this.window.setCloseOnBackPressed(true);
        ItemContainer.registerScreenFactory(this.name, function () { return _this.window; });
        if (Cfg.SlotsLikeVanilla) {
            VanillaSlots.registerForWindow(window);
        }
    }
    CraftingWindow.prototype.setupContainer = function (container) {
        var _this = this;
        container.setParent(this);
        container.setClientContainerTypeName(this.name);
        container.addServerOpenListener(function (con, client) {
            _this.onOpen(con);
            _this.onUpdate(con);
        });
        container.addServerCloseListener(function (con, client) {
            _this.onClose(con);
            var actor = new PlayerActor(client.getPlayerUid());
            var slot;
            for (var key in con.slots) {
                slot = con.slots[key];
                if (!slot.isEmpty()) {
                    actor.addItemToInventory(slot.id, slot.count, slot.data, slot.extra, true);
                    slot.clear();
                }
            }
            con.sendChanges();
        });
        container.setGlobalAddTransferPolicy(function (con, slotName, id, amount, data, extra, player) {
            if (_this.isValidAddTransfer(con, slotName, id, amount, data, extra, player)) {
                runOnMainThread(function () { return _this.onUpdate(con); });
                return amount;
            }
            return 0;
        });
        container.setGlobalGetTransferPolicy(function (con, slotName, id, amount, data, extra, player) {
            if (_this.isValidGetTransfer(con, slotName, id, amount, data, extra, player)) {
                runOnMainThread(function () { return _this.onUpdate(con); });
                return amount;
            }
            return 0;
        });
        this.addServerEvents(container);
        if (Cfg.SlotsLikeVanilla) {
            VanillaSlots.registerServerEventsForContainer(container);
        }
    };
    CraftingWindow.prototype.getContainerFor = function (player) {
        var container = this.containerByEntity[player];
        if (!container) {
            container = new ItemContainer();
            this.setupContainer(container);
            this.containerByEntity[player] = container;
        }
        return container;
    };
    CraftingWindow.prototype.isValidAddTransfer = function (container, slotName, id, amount, data, extra, player) {
        return true;
    };
    CraftingWindow.prototype.isValidGetTransfer = function (container, slotName, id, amount, data, extra, player) {
        return true;
    };
    CraftingWindow.prototype.openFor = function (player) {
        var client = Network.getClientForPlayer(player);
        if (!client) {
            return;
        }
        var container = this.getContainerFor(player);
        container.openFor(client, "main");
    };
    CraftingWindow.prototype.onOpen = function (container) {
    };
    CraftingWindow.prototype.onClose = function (container) {
    };
    CraftingWindow.prototype.addTargetBlock = function (block) {
        CraftingWindow.blocks.push({ block: getIDData(block, -1), window: this });
    };
    CraftingWindow.blocks = [];
    return CraftingWindow;
}());
Callback.addCallback("ItemUse", function (coords, item, touchBlock, isExternal, player) {
    if (Entity.getSneaking(player))
        return;
    for (var _i = 0, _a = CraftingWindow.blocks; _i < _a.length; _i++) {
        var _b = _a[_i], block = _b.block, window = _b.window;
        if (block.id === touchBlock.id && (block.data === -1 || block.data === touchBlock.data)) {
            window.openFor(player);
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
    ToolLeveling.getLocalizedLevelName = function (level) {
        return translate(this.getLevelName(level));
    };
    ToolLeveling.getLevelupMessage = function (level) {
        switch (level) {
            case 1: return "You begin to feel comfortable handling the %s.";
            case 2: return "You are now accustomed to the weight of the %s.";
            case 3: return "You have become adept at handling the %s.";
            case 4: return "You are now an expert at using the %s!";
            case 5: return "You have mastered the %s!";
            case 6: return "You have grandmastered the %s!";
            case 7: return "You feel like you could fulfill mighty deeds with your %s!";
            case 8: return "You and your %s are living legends!";
            case 9: return "No god could stand in the way of you and your %s!";
            case 10: return "Your %s is pure awesome.";
        }
        return "Your %s has reached level %s.";
    };
    ToolLeveling.getLocalizedLevelupMessage = function (level, name) {
        return translate(this.getLevelupMessage(level), name, level);
    };
    return ToolLeveling;
}());
SoundManager.init(16);
SoundManager.setResourcePath(__dir__ + "res/sounds/");
SoundManager.registerSound("tcon.anvil_use.ogg", "anvil_use.ogg");
SoundManager.registerSound("tcon.little_saw.ogg", "little_saw.ogg");
SoundManager.registerSound("tcon.levelup.ogg", "levelup.ogg");
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
        private static readonly baseTex = {
            metal: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_metal.png"),
            stone: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_stone.png"),
            other: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_other.png"),
            bucket: FileTools.ReadImage(__dir__ + "texture-source/liquid/bucket.png")
        };
    
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
        // this.create(key, name, color, type);
        LiquidRegistry.registerLiquid(key, translate(name), ["liquid." + key]);
        var id = createItem("tcon_bucket_" + key, key != "blood" ? name + " Bucket" : "Bucket o' " + name);
        Item.setCategory(id, EItemCategory.MATERIAL);
        Item.addCreativeGroup("tcon_bucket", translate("TConstruct: Buckets"), [id]);
        LiquidRegistry.registerItem(key, { id: VanillaItemID.bucket, data: 0 }, { id: id, data: 0 });
        this.register(key, temp);
    };
    MoltenLiquid.isExist = function (key) {
        return key in this.data;
    };
    MoltenLiquid.getY = function (key) {
        var _a, _b;
        return (_b = (_a = this.data[key]) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : -1;
    };
    MoltenLiquid.getTemp = function (key) {
        var _a, _b;
        return (_b = (_a = this.data[key]) === null || _a === void 0 ? void 0 : _a.temp) !== null && _b !== void 0 ? _b : -1;
    };
    MoltenLiquid.PATH = "model/tcon_liquids.png";
    MoltenLiquid.liquidCount = 0;
    MoltenLiquid.data = {};
    return MoltenLiquid;
}());
MoltenLiquid.register("water", 320);
MoltenLiquid.register("lava", 769);
MoltenLiquid.register("milk", 320);
MoltenLiquid.createAndRegister("molten_iron", "Molten Iron", 769, "#a81212");
MoltenLiquid.createAndRegister("molten_gold", "Molten Gold", 532, "#f6d609");
MoltenLiquid.createAndRegister("molten_pigiron", "Molten Pigiron", 600, "#ef9e9b");
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
        for (var _a = 0, inputs_1 = inputs; _a < inputs_1.length; _a++) {
            var input = inputs_1[_a];
            inputAmount += input.amount;
        }
        if (result.amount > inputAmount) {
            alert(translate("[TConstuct]: Invalid alloy recipe -> %s", result.liquid));
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
    { name: "Seared Tiles", texture: [11] }
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
Item.addCreativeGroup("tcon_tank", translate("Seared Tanks"), [
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
        var soundName = "";
        if (empty) {
            soundName = MoltenLiquid.getTemp(empty.liquid) < 50 ? "bucket.empty_water" : "bucket.empty_lava";
            if (stored === empty.liquid || !stored) {
                if (this.liquidStorage.getLimit(stored) - this.liquidStorage.getAmount(stored) >= empty.amount) {
                    this.liquidStorage.addLiquid(empty.liquid, empty.amount);
                    item.count--;
                    player.setCarriedItem(item);
                    player.addItemToInventory(empty.id, 1, empty.data);
                    this.region.playSound(coords, soundName);
                    this.preventClick();
                    return true;
                }
                if (item.count === 1 && empty.storage) {
                    item.data += this.liquidStorage.addLiquid(empty.liquid, empty.amount);
                    player.setCarriedItem(item);
                    this.region.playSound(coords, soundName);
                    this.preventClick();
                    return true;
                }
            }
        }
        if (stored) {
            var full = LiquidItemRegistry.getFullItem(item.id, item.data, stored);
            soundName = MoltenLiquid.getTemp(stored) < 50 ? "bucket.fill_water" : "bucket.fill_lava";
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
                    this.region.playSound(coords, soundName);
                    this.preventClick();
                    return true;
                }
                if (item.count === 1 && full.storage) {
                    player.setCarriedItem(full.id, 1, full.amount - this.liquidStorage.getLiquid(stored, full.amount));
                    this.region.playSound(coords, soundName);
                    this.preventClick();
                    return true;
                }
            }
        }
        return false;
    };
    SearedTank.prototype.destroyBlock = function (coords, player) {
        var stored = this.liquidStorage.getLiquidStored();
        var extra;
        if (stored) {
            extra = new ItemExtraData().putString("stored", stored)
                .putInt("amount", this.liquidStorage.getAmount(stored));
        }
        this.region.dropAtBlock(coords, this.blockID, 1, 0, extra);
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
    var getTooltips = function (item) {
        if (item.extra) {
            var liquid = LiquidRegistry.getLiquidName(item.extra.getString("stored"));
            var amount = item.extra.getInt("amount");
            return ["§7" + liquid + ": " + amount + " mB"];
        }
        return [];
    };
    var nameFunc = function (item, translation, name) {
        var tooltips = getTooltips(item);
        if (tooltips.length > 0) {
            return translation + "\n" + tooltips.join("\n");
        }
        return translation;
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
    Block.registerPlaceFunction(BlockID.tcon_tank_fuel, placeFunc);
    Block.registerPlaceFunction(BlockID.tcon_gauge_fuel, placeFunc);
    Block.registerPlaceFunction(BlockID.tcon_tank_ingot, placeFunc);
    Block.registerPlaceFunction(BlockID.tcon_gauge_ingot, placeFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_tank_fuel, nameFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_gauge_fuel, nameFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_tank_ingot, nameFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_gauge_ingot, nameFunc);
    var onTooltipFunc = function (item, text, level) {
        var tooltips = getTooltips(item);
        for (var _i = 0, tooltips_1 = tooltips; _i < tooltips_1.length; _i++) {
            var line = tooltips_1[_i];
            text.add(line);
        }
    };
    ModAPI.addAPICallback("KernelExtension", function (api) {
        if (typeof api.getKEXVersionCode === "function" && api.getKEXVersionCode() >= 300) {
            delete Item.nameOverrideFunctions[BlockID.tcon_tank_fuel];
            delete Item.nameOverrideFunctions[BlockID.tcon_gauge_fuel];
            delete Item.nameOverrideFunctions[BlockID.tcon_tank_ingot];
            delete Item.nameOverrideFunctions[BlockID.tcon_gauge_ingot];
            api.ItemsModule.addTooltip(BlockID.tcon_tank_fuel, onTooltipFunc);
            api.ItemsModule.addTooltip(BlockID.tcon_gauge_fuel, onTooltipFunc);
            api.ItemsModule.addTooltip(BlockID.tcon_tank_ingot, onTooltipFunc);
            api.ItemsModule.addTooltip(BlockID.tcon_gauge_ingot, onTooltipFunc);
        }
    });
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
    SearedDrain.prototype.onItemUse = function (coords, item, playerUid) {
        if (Entity.getSneaking(playerUid) && !this.controller)
            return true;
        var empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);
        if (empty) {
            var player = new PlayerEntity(playerUid);
            var soundName = MoltenLiquid.getTemp(empty.liquid) < 50 ? "bucket.empty_water" : "bucket.empty_lava";
            if (this.controller.totalLiquidAmount() + empty.amount <= this.controller.getLiquidCapacity()) {
                this.controller.addLiquid(empty.liquid, empty.amount);
                item.count--;
                player.setCarriedItem(item);
                player.addItemToInventory(empty.id, 1, empty.data);
                this.region.playSound(coords, soundName);
                this.preventClick();
                return true;
            }
            if (item.count === 1 && empty.storage) {
                item.data += this.controller.addLiquid(empty.liquid, empty.amount);
                player.setCarriedItem(item);
                this.region.playSound(coords, soundName);
                this.preventClick();
                return true;
            }
        }
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
    { name: "Seared Faucet", isTech: true },
    { name: "Seared Faucet", isTech: true },
    { name: "Seared Faucet", isTech: true }
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
        this.anim.describe({ render: this.render.getId(), skin: MoltenLiquid.PATH });
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
        this.preventClick();
        return true;
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
        var input = this.container.getSlot("slotInput");
        var output = this.container.getSlot("slotOutput");
        this.networkData.putInt("inputId", input.id);
        this.networkData.putInt("inputData", input.data);
        this.networkData.putInt("outputId", output.id);
        this.networkData.putInt("outputData", output.data);
    };
    CastingTable.prototype.clientLoad = function () {
        this.setupAnimPosScale();
        _super.prototype.clientLoad.call(this);
        this.setupAnimItem();
    };
    CastingTable.prototype.setupAnimPosScale = function () {
        this.animPos = { x: 0.5, y: 60 / 64, z: 0.5 };
        this.animScale = { x: 14 / 16, y: 1 / 16, z: 14 / 16 };
    };
    CastingTable.prototype.setupAnimItem = function () {
        var _this = this;
        this.animInput = new Animation.Item(this.x + 9 / 16, this.y + 61 / 64, this.z + 9 / 16);
        this.animInput.load();
        this.animInput.setSkylightMode();
        this.animOutput = new Animation.Item(this.x + 9 / 16, this.y + 61 / 64, this.z + 9 / 16);
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
        var empty = { id: 0, count: 0, data: 0 };
        (_a = this.animInput) === null || _a === void 0 ? void 0 : _a.describeItem(inputId === 0 ? empty : { id: Network.serverToLocalId(inputId), count: 1, data: inputData, size: 14 / 16, rotation: [Math.PI / 2, 0, 0] });
        (_b = this.animOutput) === null || _b === void 0 ? void 0 : _b.describeItem(outputId === 0 ? empty : { id: Network.serverToLocalId(outputId), count: 1, data: outputData, size: 14 / 16, rotation: [Math.PI / 2, 0, 0] });
    };
    CastingTable.prototype.updateLiquidLimits = function () {
        this.liquidStorage.liquidLimits = CastingRecipe.getTableLimits(this.container.getSlot("slotInput").id);
    };
    CastingTable.prototype.isValidCast = function (id) {
        if (IDRegistry.isVanilla(id)) {
            return id >= 256;
        }
        return ItemRegistry.isItem(id);
    };
    CastingTable.prototype.getRecipe = function (stored) {
        return CastingRecipe.getTableRecipe(this.container.getSlot("slotInput").id, stored);
    };
    CastingTable.prototype.onItemUse = function (coords, item, playerUid) {
        if (this.liquidStorage.getLiquidStored()) {
            return true;
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
            return true;
        }
        this.networkData.putInt("inputId", input.id);
        this.networkData.putInt("inputData", input.data);
        this.networkData.putInt("outputId", output.id);
        this.networkData.putInt("outputData", output.data);
        this.networkData.sendChanges();
        this.container.sendChanges();
        this.updateLiquidLimits();
        this.preventClick();
        return true;
    };
    CastingTable.prototype.onTick = function () {
        _super.prototype.onTick.call(this);
        var stored = this.liquidStorage.getLiquidStored();
        var slotInput = this.container.getSlot("slotInput");
        var slotOutput = this.container.getSlot("slotOutput");
        if (stored && this.liquidStorage.isFull(stored)) {
            if (++this.data.progress < CastingRecipe.calcCooldownTime(stored, this.liquidStorage.getAmount(stored))) {
                if ((World.getThreadTime() & 15) === 0) {
                    this.sendPacket("spawnParticle", {});
                }
            }
            else {
                var result = this.getRecipe(stored);
                if (result) {
                    slotOutput.setSlot(result.id, 1, result.data);
                    result.consume && slotInput.clear();
                    this.sendPacket("spawnParticle", {});
                }
                this.data.progress = 0;
                this.liquidStorage.setAmount(stored, 0);
                for (var key in this.liquidStorage.liquidAmounts) {
                    delete this.liquidStorage.liquidAmounts[key];
                }
                this.networkData.putInt("inputId", slotInput.id);
                this.networkData.putInt("inputData", slotInput.data);
                this.networkData.putInt("outputId", slotOutput.id);
                this.networkData.putInt("outputData", slotOutput.data);
                this.networkData.sendChanges();
            }
        }
        StorageInterface.checkHoppers(this);
        this.container.sendChanges();
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
        var input = this.container.getSlot("slotInput");
        var output = this.container.getSlot("slotOutput");
        var stored = this.tileEntity.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForTable(input.id, liquid) && output.isEmpty();
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
        if (IDRegistry.isVanilla(id)) {
            return id < 256;
        }
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
        var input = this.container.getSlot("slotInput");
        var output = this.container.getSlot("slotOutput");
        var stored = this.tileEntity.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForBasin(input.id, liquid) && output.isEmpty();
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
                header: { text: { text: translate("Smeltery") }, height: 60 },
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
        if (Cfg.SlotsLikeVanilla) {
            VanillaSlots.registerForWindow(this.window);
        }
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
        slot0: { type: "slot", x: 24 * SCALE, y: 10 * SCALE, size: 18 * SCALE },
        slot1: { type: "slot", x: 24 * SCALE, y: 28 * SCALE, size: 18 * SCALE },
        slot2: { type: "slot", x: 24 * SCALE, y: 46 * SCALE, size: 18 * SCALE },
        gauge0: { type: "scale", x: 21 * SCALE, y: 11 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1 },
        gauge1: { type: "scale", x: 21 * SCALE, y: 29 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1 },
        gauge2: { type: "scale", x: 21 * SCALE, y: 47 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1 },
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
        textDump: { type: "text", x: 104 * SCALE, y: 78 * SCALE, z: 1003, text: translate("Dump"), font: { size: 30, color: Color.WHITE, shadow: 0.5, alignment: 1 } },
        iconSelect: { type: "image", x: 131.6 * SCALE, y: 81.6 * SCALE, z: 1003, bitmap: "mod_browser_update_icon", scale: SCALE * 0.8 },
        btnR: { type: "button", x: 698, y: 13, bitmap: "classic_button_up", bitmap2: "classic_button_down", scale: 2, clicker: { onClick: function () { return RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage(["tcon_melting", "tcon_alloying"]); } } },
        textR: { type: "text", x: 698 + 14, y: 13 - 6, z: 1, text: "R", font: { color: Color.WHITE, size: 20, shadow: 0.5, align: UI.Font.ALIGN_CENTER } }
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
        return Math.round(this.liquidStorage.getAmount(liquid));
    };
    SmelteryControler.prototype.getRelativeAmount = function (liquid) {
        var capacity = this.getLiquidCapacity();
        return capacity > 0 ? this.getAmount(liquid) / capacity : 0;
    };
    SmelteryControler.prototype.getLiquid = function (liquid, amount) {
        var got = Math.min(this.getAmount(liquid), amount);
        this.liquidStorage.liquidAmounts[liquid] -= got;
        if (this.liquidStorage.liquidAmounts[liquid] < 1) {
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
        return this.totalLiquidAmount() < 1;
    };
    SmelteryControler.prototype.getScreenByName = function (screenName, container) {
        return SmelteryHandler.getWindow();
    };
    SmelteryControler.prototype.putDefaultNetworkData = function () {
        this.networkData.putBoolean("active", false);
    };
    SmelteryControler.prototype.setupContainer = function () {
        this.container.setGlobalAddTransferPolicy(function (container, slotName, id, count, data, extra, player) {
            if ((slotName === "slot0" || slotName === "slot1" || slotName === "slot2") && MeltingRecipe.isExist(id, data)) {
                var amount = 0;
                for (var i = 0; i < 3; i++) {
                    amount += container.getSlot("slot" + i).count;
                }
                return Math.max(0, Math.min(count, container.parent.getItemCapacity() - amount));
            }
            return 0;
        });
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
        this.anim.describe({ render: this.render.getId(), skin: MoltenLiquid.PATH });
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
        if (Cfg.SlotsLikeVanilla) {
            VanillaSlots.registerServerEventsForContainer(this.container);
        }
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
            if (liquids[key] < 1) {
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
        for (var _i = 0, _a = this.tanksPos; _i < _a.length; _i++) {
            var pos = _a[_i];
            iTank = StorageInterface.getLiquidStorage(this.blockSource, pos.x, pos.y, pos.z);
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
        BlockEngine.sendMessage(Network.getClientForPlayer(player), "Invalid block inside the structure");
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
            for (var _i = 0, _a = data.liqArray; _i < _a.length; _i++) {
                var _b = _a[_i], liquid = _b.liquid, amount = _b.amount;
                height = amount / data.capacity * sizeY;
                max = Math.max(sizeX, sizeZ, height);
                parts.push({
                    type: "box",
                    uv: { x: 0, y: MoltenLiquid.getY(liquid) * max },
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
        var entities = [];
        for (var _i = 0, _a = this.region.listEntitiesInAABB(this.area.from, this.area.to); _i < _a.length; _i++) {
            var ent = _a[_i];
            if (MeltingRecipe.getEntRecipe(ent)) {
                entities.push(ent);
            }
        }
        var liquidCapacity = this.getLiquidCapacity();
        var result;
        for (var _b = 0, entities_1 = entities; _b < entities_1.length; _b++) {
            var ent = entities_1[_b];
            result = MeltingRecipe.getEntRecipe(ent);
            if (this.totalLiquidAmount() + result.amount <= liquidCapacity) {
                this.liquidStorage.addLiquid(result.liquid, result.amount);
            }
            Entity.damageEntity(ent, 2);
        }
    };
    SmelteryControler.prototype.onTick = function () {
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
                for (var _i = 0, _a = AlloyRecipe.getRecipes(this.liquidStorage.liquidAmounts); _i < _a.length; _i++) {
                    var recipe = _a[_i];
                    for (var _b = 0, _c = recipe.inputs; _b < _c.length; _b++) {
                        var input = _c[_b];
                        this.getLiquid(input.liquid, input.amount);
                    }
                    this.addLiquid(recipe.result.liquid, recipe.result.amount);
                }
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
                                slots[i].markDirty();
                                slots[i].validate();
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
            if (!elem)
                continue;
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
    TinkersMaterial.prototype.getLocalizedName = function () {
        return translate(this.getName());
    };
    TinkersMaterial.prototype.getLocalizationOfPart = function (part) {
        return translate("".concat(this.getName(), " %s"), translate(part));
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
    return TinkersMaterial;
}());
//params source: slimeknights.tconstruct.tools.TinkerMaterials.java
var Material = {
    wood: new TinkersMaterial("Wooden", 0)
        .setItem("planks")
        .setHeadStats(35, 2, 2, MiningLv.STONE)
        .setHandleStats(1, 25)
        .setExtraStats(15),
    stone: new TinkersMaterial("Stone", 1)
        .setItem("cobblestone")
        .setHeadStats(120, 4, 3, MiningLv.IRON)
        .setHandleStats(0.5, -50)
        .setExtraStats(20),
    flint: new TinkersMaterial("Flint", 2)
        .setItem("flint")
        .setHeadStats(150, 5, 2.9, MiningLv.IRON)
        .setHandleStats(0.6, -60)
        .setExtraStats(40),
    cactus: new TinkersMaterial("Cactus", 3)
        .setItem("cactus")
        .setHeadStats(210, 4, 3.4, MiningLv.IRON)
        .setHandleStats(0.85, 20)
        .setExtraStats(50),
    obsidian: new TinkersMaterial("Obsidian", 4, "molten_obsidian")
        .setItem("obsidian")
        .setHeadStats(139, 7.07, 4.2, MiningLv.COBALT)
        .setHandleStats(0.9, -100)
        .setExtraStats(90),
    prismarine: new TinkersMaterial("Prismarine", 5)
        .setItem("prismarine")
        .setHeadStats(430, 5.5, 6.2, MiningLv.IRON)
        .setHandleStats(0.6, -150)
        .setExtraStats(100),
    netherrack: new TinkersMaterial("Netherrack", 6)
        .setItem("netherrack")
        .setHeadStats(270, 4.5, 3, MiningLv.IRON)
        .setHandleStats(0.85, -150)
        .setExtraStats(75),
    endstone: new TinkersMaterial("End Stone", 7)
        .setItem("end_stone")
        .setHeadStats(420, 3.23, 3.23, MiningLv.OBSIDIAN)
        .setHandleStats(0.85, 0)
        .setExtraStats(42),
    bone: new TinkersMaterial("Bone", 8)
        .setItem("bone")
        .setHeadStats(200, 5.09, 2.5, MiningLv.IRON)
        .setHandleStats(1.1, 50)
        .setExtraStats(65),
    paper: new TinkersMaterial("Paper", 9)
        .setItem(ItemID.tcon_paperstack)
        .setHeadStats(12, 0.51, 0.05, MiningLv.STONE)
        .setHandleStats(0.1, 5)
        .setExtraStats(15),
    sponge: new TinkersMaterial("Sponge", 10)
        .setItem("sponge")
        .setHeadStats(1050, 3.02, 0, MiningLv.STONE)
        .setHandleStats(1.2, 250)
        .setExtraStats(250),
    firewood: new TinkersMaterial("Firewood", 11)
        .setItem(BlockID.tcon_firewood)
        .setHeadStats(550, 6, 5.5, MiningLv.STONE)
        .setHandleStats(1, -200)
        .setExtraStats(150),
    slime: new TinkersMaterial("Slime", 12)
        .setItem(ItemID.tcon_slimecrystal_green)
        .setHeadStats(1000, 4.24, 1.8, MiningLv.STONE)
        .setHandleStats(0.7, 0)
        .setExtraStats(350),
    blueslime: new TinkersMaterial("Blue Slime", 13)
        .setItem(ItemID.tcon_slimecrystal_blue)
        .setHeadStats(780, 4.03, 1.8, MiningLv.STONE)
        .setHandleStats(1.3, -50)
        .setExtraStats(200),
    magmaslime: new TinkersMaterial("Magma Slime", 14)
        .setItem(ItemID.tcon_slimecrystal_magma)
        .setHeadStats(600, 2.1, 7, MiningLv.STONE)
        .setHandleStats(0.85, -200)
        .setExtraStats(150),
    knightslime: new TinkersMaterial("Knightslime", 15, "molten_knightslime", true)
        .setItem(ItemID.ingotKnightslime)
        .setHeadStats(850, 5.8, 5.1, MiningLv.OBSIDIAN)
        .setHandleStats(0.5, 500)
        .setExtraStats(125),
    iron: new TinkersMaterial("Iron", 16, "molten_iron", true)
        .setItem("iron_ingot")
        .setHeadStats(204, 6, 5.5, MiningLv.DIAMOND)
        .setHandleStats(0.85, 60)
        .setExtraStats(50),
    pigiron: new TinkersMaterial("Pigiron", 17, "molten_pigiron", true)
        .setItem(ItemID.ingotPigiron)
        .setHeadStats(380, 6.2, 4.5, MiningLv.DIAMOND)
        .setHandleStats(1.2, 0)
        .setExtraStats(170),
    cobalt: new TinkersMaterial("Cobalt", 18, "molten_cobalt", true)
        .setItem(ItemID.ingotCobalt)
        .setHeadStats(780, 12, 4.1, MiningLv.COBALT)
        .setHandleStats(0.9, 100)
        .setExtraStats(300),
    ardite: new TinkersMaterial("Ardite", 19, "molten_ardite", true)
        .setItem(ItemID.ingotArdite)
        .setHeadStats(990, 3.5, 3.6, MiningLv.COBALT)
        .setHandleStats(1.4, -200)
        .setExtraStats(450),
    manyullyn: new TinkersMaterial("Manyullyn", 20, "molten_manyullyn", true)
        .setItem(ItemID.ingotManyullyn)
        .setHeadStats(820, 7.02, 8.72, MiningLv.COBALT)
        .setHandleStats(0.5, 250)
        .setExtraStats(50),
    copper: new TinkersMaterial("Copper", 21, "molten_copper", true)
        .setItem(ItemID.ingotCopper)
        .setHeadStats(210, 5.3, 3, MiningLv.IRON)
        .setHandleStats(1.05, 30)
        .setExtraStats(100),
    bronze: new TinkersMaterial("Bronze", 22, "molten_bronze", true)
        .setItem(ItemID.ingotBronze)
        .setHeadStats(430, 6.8, 3.5, MiningLv.DIAMOND)
        .setHandleStats(1.1, 70)
        .setExtraStats(80),
    lead: new TinkersMaterial("Lead", 23, "molten_lead", true)
        .setItem(ItemID.ingotLead)
        .setHeadStats(434, 5.25, 3.5, MiningLv.IRON)
        .setHandleStats(0.7, -50)
        .setExtraStats(100),
    silver: new TinkersMaterial("Silver", 24, "molten_silver", true)
        .setItem(ItemID.ingotSilver)
        .setHeadStats(250, 5, 5, MiningLv.IRON)
        .setHandleStats(0.95, 50)
        .setExtraStats(150),
    electrum: new TinkersMaterial("Electrum", 25, "molten_electrum", true)
        .setItem(ItemID.ingotElectrum)
        .setHeadStats(50, 12, 3, MiningLv.IRON)
        .setHandleStats(1.1, -25)
        .setExtraStats(250),
    steel: new TinkersMaterial("Steel", 26, "molten_steel", true)
        .setItem(ItemID.ingotSteel)
        .setHeadStats(540, 7, 6, MiningLv.OBSIDIAN)
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
            stats = materials[i].getHeadStats();
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
            stats = materials[i].getExtraStats();
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
            stats = materials[i].getHandleStats();
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
var TconToolFactory;
(function (TconToolFactory) {
    var tools = {};
    var nameOverrideFunc = function (item, translation, name) {
        if (item.extra) {
            var stack = new TconToolStack(item);
            var tooltips = stack.getTooltips();
            return stack.getName() + "\n" + tooltips.join("\n");
        }
        return name;
    };
    var nameOverrideFuncWithoutTooltips = function (item, translation, name) {
        if (item.extra) {
            var stack = new TconToolStack(item);
            return stack.getName();
        }
        return translation;
    };
    var onTooltipFunc = function (item, text, level) {
        if (item.extra) {
            var stack = new TconToolStack(item);
            var tooltips = stack.getTooltips();
            for (var _i = 0, tooltips_2 = tooltips; _i < tooltips_2.length; _i++) {
                var line = tooltips_2[_i];
                text.add(line);
            }
        }
    };
    function registerTool(toolId, type, miningLevel) {
        var _a;
        (_a = tools[type]) !== null && _a !== void 0 ? _a : (tools[type] = {});
        tools[type][miningLevel] = toolId;
        Item.registerNameOverrideFunction(toolId, nameOverrideFunc);
    }
    TconToolFactory.registerTool = registerTool;
    function addKEXFeature(api) {
        var id = 0;
        for (var type in tools) {
            for (var lv in tools[type]) {
                id = tools[type][lv];
                Item.registerNameOverrideFunction(id, nameOverrideFuncWithoutTooltips);
                api.ItemsModule.addTooltip(id, onTooltipFunc);
                api.ItemsModule.setExplodable(id, true);
                api.ItemsModule.setFireResistant(id, true);
            }
        }
    }
    TconToolFactory.addKEXFeature = addKEXFeature;
    function getToolId(type, miningLevel) {
        if (tools[type]) {
            return tools[type][miningLevel] || -1;
        }
        return -1;
    }
    TconToolFactory.getToolId = getToolId;
    function createToolStack(type, materials) {
        var id = 0;
        if (!tools[type]) {
            return null;
        }
        for (var lv in tools[type]) {
            id = tools[type][lv];
            break;
        }
        if (id === 0) {
            return null;
        }
        return new TconToolStack({
            id: id,
            count: 1, data: 0,
            extra: new ItemExtraData()
                .putInt("durability", 0)
                .putInt("xp", 0)
                .putInt("repair", 0)
                .putString("materials", materials.join("_"))
                .putString("modifiers", "")
        });
    }
    TconToolFactory.createToolStack = createToolStack;
    function isTool(id) {
        for (var type in tools) {
            for (var lv in tools[type]) {
                if (id === tools[type][lv]) {
                    return true;
                }
            }
        }
        return false;
    }
    TconToolFactory.isTool = isTool;
    function getType(id) {
        for (var type in tools) {
            for (var lv in tools[type]) {
                if (id === tools[type][lv]) {
                    return type;
                }
            }
        }
        return "";
    }
    TconToolFactory.getType = getType;
    function addToCreative(type, name, partsCount) {
        var materials = [];
        var stack;
        for (var key in Material) {
            materials.length = 0;
            for (var i = 0; i < partsCount; i++) {
                materials.push(key);
            }
            stack = TconToolFactory.createToolStack(type, materials);
            if (stack && stack.id !== -1) {
                Item.addToCreative(stack.id, stack.count, stack.data, stack.extra.putInt("xp", 2e9));
            }
        }
        for (var lv in tools[type]) {
            Item.addCreativeGroup("tcontool_" + type, translate(name), [tools[type][lv]]);
        }
    }
    TconToolFactory.addToCreative = addToCreative;
})(TconToolFactory || (TconToolFactory = {}));
var TconToolStack = /** @class */ (function () {
    function TconToolStack(item) {
        this.id = item.id;
        this.count = item.count;
        this.data = item.data;
        this.extra = item.extra;
        this.instance = ToolAPI.getToolData(this.id);
        this.materials = new String(this.extra.getString("materials")).split("_").map(function (mat) { return Material[mat]; });
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
        var toolMaterial = stats.getToolMaterial();
        this.id = TconToolFactory.getToolId(this.instance.tconToolType, toolMaterial.level);
        return toolMaterial;
    };
    TconToolStack.prototype.forEachModifiers = function (func) {
        for (var key in this.modifiers) {
            Modifier[key] && func(Modifier[key], this.modifiers[key]);
        }
    };
    TconToolStack.prototype.isBroken = function () {
        return this.durability >= this.stats.durability;
    };
    TconToolStack.prototype.consumeDurability = function (value, player) {
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
        var isBroken = this.isBroken();
        this.durability += consume;
        if (!isBroken && this.isBroken()) {
            World.playSoundAtEntity(player, "random.break", 0.5);
        }
    };
    TconToolStack.prototype.addXp = function (val, player) {
        var xp = this.xp;
        var oldLv = ToolLeveling.getLevel(xp, this.instance.is3x3);
        var newLv = ToolLeveling.getLevel(xp + val, this.instance.is3x3);
        this.extra.putInt("xp", xp + val);
        if (oldLv < newLv) {
            var client = Network.getClientForPlayer(player);
            BlockEngine.sendMessage(client, "§3", ToolLeveling.getLevelupMessage(newLv), Item.getName(this.id, this.data), "" + newLv);
            client === null || client === void 0 ? void 0 : client.send("tcon.playSound", { name: "tcon.levelup.ogg" });
        }
    };
    TconToolStack.prototype.uniqueKey = function () {
        var hash = this.materials.reduce(function (value, material) { return 31 * value + material.getTexIndex(); }, 0);
        var mask = 0;
        for (var key in this.modifiers) {
            mask |= 1 << Modifier[key].getTexIndex();
        }
        return this.instance.tconToolType + ":" + hash.toString(16) + ":" + mask.toString(16);
    };
    TconToolStack.prototype.getName = function () {
        var _this = this;
        var materials = this.instance.repairParts
            .map(function (partIndex) { return _this.materials[partIndex]; })
            .filter(function (material, index, arr) { return arr.indexOf(material) === index; }); // remove duplicates
        var toolName = this.instance.name;
        for (var i = materials.length - 1; i >= 0; i--) {
            toolName = materials[i].getLocalizationOfPart(toolName);
        }
        if (this.isBroken()) {
            toolName = translate("Broken %s", toolName);
        }
        return toolName;
    };
    TconToolStack.prototype.getTooltips = function () {
        var lvInfo = ToolLeveling.getLevelInfo(this.xp, this.instance.is3x3);
        return [
            "§7" + translate("Durability: ") + (this.stats.durability - this.durability) + " / " + this.stats.durability,
            translate("Level: ") + ToolLeveling.getLocalizedLevelName(lvInfo.level),
            translate("XP: ") + lvInfo.currentXp + " / " + lvInfo.next
        ];
    };
    TconToolStack.prototype.clone = function () {
        return new TconToolStack({ id: this.id, count: this.count, data: this.data, extra: this.extra.copy() });
    };
    return TconToolStack;
}());
var PartRegistry;
(function (PartRegistry) {
    var data = {};
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
    var nameOverrideFunc = function (item, translation, name) { return translation + "\n" + getTooltips(item.id).join("\n"); };
    function createParts(key, material) {
        var id = 0;
        for (var _i = 0, types_1 = PartRegistry.types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            id = createItem("tconpart_".concat(type.key, "_").concat(key), material.getLocalizationOfPart(type.name));
            Item.registerNameOverrideFunction(id, nameOverrideFunc);
            Item.addCreativeGroup("tconpart_" + type.key, translate(type.name), [id]);
            data[id] = { type: type.key, material: key };
        }
    }
    PartRegistry.createParts = createParts;
    for (var key in Material) {
        PartRegistry.createParts(key, Material[key]);
    }
    function registerRecipes(key, material) {
        var id = 0;
        var liquid = "";
        for (var _i = 0, types_2 = PartRegistry.types; _i < types_2.length; _i++) {
            var type = types_2[_i];
            id = ItemID["tconpart_".concat(type.key, "_").concat(key)];
            liquid = material.getMoltenLiquid();
            if (liquid) {
                MeltingRecipe.addRecipe(id, liquid, MatValue.INGOT * type.cost);
                CastingRecipe.addTableRecipeForAll(type.key, liquid, id);
            }
            CastingRecipe.addMakeCastRecipes(id, type.key);
        }
    }
    PartRegistry.registerRecipes = registerRecipes;
    function getPartData(id) {
        return data[id];
    }
    PartRegistry.getPartData = getPartData;
    function getIDFromData(type, material) {
        for (var id in data) {
            if (data[id].type === type && data[id].material === material) {
                return +id;
            }
        }
        return 0;
    }
    PartRegistry.getIDFromData = getIDFromData;
    function getAllPartBuildRecipeForRV() {
        var list = [];
        for (var key in Material) {
            if (!Material[key].isMetal) {
                for (var _i = 0, types_3 = PartRegistry.types; _i < types_3.length; _i++) {
                    var type = types_3[_i];
                    list.push({
                        input: [{ id: ItemID.tcon_pattern_blank, count: 1, data: 0 }, __assign(__assign({}, Material[key].getItem()), { count: type.cost })],
                        output: [{ id: PartRegistry.getIDFromData(type.key, key), count: 1, data: 0 }],
                        pattern: type.key
                    });
                }
            }
        }
        return list;
    }
    PartRegistry.getAllPartBuildRecipeForRV = getAllPartBuildRecipeForRV;
    function getTooltips(id) {
        var tooltips = [];
        var partData = PartRegistry.getPartData(id);
        if (partData) {
            var matData = Material[partData.material];
            if (matData) {
                var mask = PartCategory[partData.type];
                if (mask & EPartCategory.HEAD) {
                    var head = matData.getHeadStats();
                    var miningTier = MiningLvName[head.level];
                    tooltips.push("", "§f" + translate("Head"));
                    tooltips.push("§7" + translate("Durability: ") + head.durability);
                    tooltips.push(translate("Mining Tier: ") + translate(miningTier));
                    tooltips.push(translate("Mining Speed: ") + head.speed);
                    tooltips.push(translate("Melee Damage: ") + head.attack);
                }
                if (mask & EPartCategory.HANDLE) {
                    var handle = matData.getHandleStats();
                    tooltips.push("", "§f" + translate("Handle"));
                    tooltips.push("§7" + translate("Multiplier: ") + handle.modifier);
                    tooltips.push(translate("Durability: ") + handle.durability);
                }
                if (mask & EPartCategory.EXTRA) {
                    var extra = matData.getExtraStats();
                    tooltips.push("", "§f" + translate("Extra"));
                    tooltips.push("§7" + translate("Durability: ") + extra.durability);
                }
            }
        }
        return tooltips;
    }
    PartRegistry.getTooltips = getTooltips;
    var onTooltipFunc = function (item, text, level) {
        var tooltips = PartRegistry.getTooltips(item.id);
        for (var _i = 0, tooltips_3 = tooltips; _i < tooltips_3.length; _i++) {
            var line = tooltips_3[_i];
            text.add(line);
        }
    };
    function replaceTooltipsWithKEX(api) {
        for (var id in data) {
            delete Item.nameOverrideFunctions[id];
            api.ItemsModule.addTooltip(+id, onTooltipFunc);
        }
    }
    PartRegistry.replaceTooltipsWithKEX = replaceTooltipsWithKEX;
})(PartRegistry || (PartRegistry = {}));
Callback.addCallback("PreLoaded", function () {
    for (var key in Material) {
        PartRegistry.registerRecipes(key, Material[key]);
    }
});
var ToolTexture = /** @class */ (function () {
    function ToolTexture(key, partsCount, brokenIndex) {
        this.path = "model/tcontool_" + key;
        this.bitmap = UI.TextureSource.get("tcon.toolbmp." + key);
        this.resolution = 256;
        this.partsCount = partsCount;
        this.brokenIndex = brokenIndex;
    }
    ToolTexture.prototype.getPath = function () {
        return this.path;
    };
    ToolTexture.prototype.getBitmap = function (coords) {
        return Bitmap.createBitmap(this.bitmap, coords.x, coords.y, 16, 16);
    };
    //partNum: head, handle..., index: material
    ToolTexture.prototype.getCoords = function (partNum, index, isBroken) {
        var part = isBroken && partNum === this.brokenIndex ? this.partsCount : partNum;
        return {
            x: (index & 15) << 4,
            y: (part << 1) + (index >> 4) << 4 // (part * 2 + (index / 16 | 0)) * 16
        };
    };
    ToolTexture.prototype.getModCoords = function (index) {
        return {
            x: (index & 15) << 4,
            y: 224 + (index >> 4)
        };
    };
    return ToolTexture;
}());
IDRegistry.genBlockID("oreCobalt");
Block.createBlock("oreCobalt", [{ name: "Cobalt Ore", texture: [["tcon_ore_cobalt", 0]], inCreative: true }]);
ToolAPI.registerBlockMaterial(BlockID.oreCobalt, "stone", MiningLv.COBALT, true);
Block.setDestroyLevel(BlockID.oreCobalt, MiningLv.COBALT);
IDRegistry.genBlockID("oreArdite");
Block.createBlock("oreArdite", [{ name: "Ardite Ore", texture: [["tcon_ore_ardite", 0]], inCreative: true }]);
ToolAPI.registerBlockMaterial(BlockID.oreArdite, "stone", MiningLv.COBALT, true);
Block.setDestroyLevel(BlockID.oreArdite, MiningLv.COBALT);
Item.addCreativeGroup("ores", translate("Ores"), [BlockID.oreCobalt, BlockID.oreArdite]);
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
Item.addCreativeGroup("tcon_slimymud", translate("Slimy Mud"), [
    createBlock("tcon_slimymud_green", [{ name: "Slimy Mud" }]),
    createBlock("tcon_slimymud_blue", [{ name: "Blue Slimy Mud" }]),
    createBlock("tcon_slimymud_magma", [{ name: "Magma Slimy Mud" }])
]);
Recipes2.addShapeless(BlockID.tcon_slimymud_green, [{ id: "slime_ball", count: 4 }, "sand", "dirt"]);
Recipes2.addShapeless(BlockID.tcon_slimymud_blue, [{ id: ItemID.tcon_slimeball_blue, count: 4 }, "sand", "dirt"]);
Recipes2.addShapeless(BlockID.tcon_slimymud_magma, [{ id: "magma_cream", count: 4 }, "soul_sand", "netherrack"]);
Item.addCreativeGroup("tcon_slimycrystal", translate("Slime Crystal"), [
    createItem("tcon_slimecrystal_green", "Slime Crystal"),
    createItem("tcon_slimecrystal_blue", "Blue Slime Crystal"),
    createItem("tcon_slimecrystal_magma", "Magma Slime Crystal")
]);
Recipes.addFurnace(BlockID.tcon_slimymud_green, ItemID.tcon_slimecrystal_green);
Recipes.addFurnace(BlockID.tcon_slimymud_blue, ItemID.tcon_slimecrystal_blue);
Recipes.addFurnace(BlockID.tcon_slimymud_magma, ItemID.tcon_slimecrystal_magma);
createBlock("tcon_clear_glass", [{ name: "Clear Glass" }]);
CastingRecipe.addBasinRecipe(0, "molten_glass", BlockID.tcon_clear_glass, 1000);
ConnectedTexture.setModelForGlass(BlockID.tcon_clear_glass, -1, "tcon_clear_glass");
createBlock("tcon_seared_glass", [{ name: "Seared Glass" }]);
Recipes2.addShaped(BlockID.tcon_seared_glass, "_a_:aba:_a_", { a: ItemID.tcon_brick, b: "glass" });
CastingRecipe.addBasinRecipe(VanillaBlockID.glass, "molten_stone", BlockID.tcon_seared_glass, MatValue.SEARED_BLOCK);
ConnectedTexture.setModelForGlass(BlockID.tcon_seared_glass, -1, "tcon_seared_glass");
createItem("tcon_pattern_blank", "Pattern");
Recipes2.addShaped({ id: ItemID.tcon_pattern_blank, count: 4 }, "ab:ba", { a: "planks", b: "stick" });
Item.addCreativeGroup("tcon_sandcast", translate("TConstuct: Sand Cast"), [
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
Item.addCreativeGroup("tcon_claycast", translate("TConstuct: Clay Cast"), [
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
Item.addCreativeGroup("tcon_cast", translate("TConstuct: Cast"), [
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
/*
ItemRegistry.registerItem(new class extends ItemThrowable {

    constructor(){
        super("tcon_efln", "EFLN", "tcon_efln", true);
        Recipes2.addShapeless(this.id, ["flint", "gunpowder"]);
    }

    onProjectileHit(projectile: number, item: ItemInstance, target: Callback.ProjectileHitTarget): void {
        const x = target.coords?.relative.x ?? Math.round(target.x);
        const y = target.coords?.relative.y ?? Math.round(target.y);
        const z = target.coords?.relative.z ?? Math.round(target.z);

    }

});
*/ 
var TinkersModifier = /** @class */ (function () {
    function TinkersModifier(key, name, texIndex, recipe, max, multi, hate) {
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
            for (var _i = 0, hate_1 = hate; _i < hate_1.length; _i++) {
                var mod = hate_1[_i];
                this.hate[mod] = true;
            }
        }
    }
    TinkersModifier.prototype.getKey = function () {
        return this.key;
    };
    TinkersModifier.prototype.getName = function () {
        return this.name;
    };
    TinkersModifier.prototype.getLocalizedName = function () {
        return translate(this.getName());
    };
    TinkersModifier.prototype.getTexIndex = function () {
        return this.texIndex;
    };
    TinkersModifier.prototype.getRecipe = function () {
        return this.recipe;
    };
    TinkersModifier.prototype.canBeTogether = function (modifiers) {
        for (var _i = 0, modifiers_1 = modifiers; _i < modifiers_1.length; _i++) {
            var mod = modifiers_1[_i];
            if (this.hate[mod.type]) {
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
    //haste:50_silk:1
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
        var _a;
        var _b;
        var mods = {};
        for (var _i = 0, _c = this.decodeToArray(code); _i < _c.length; _i++) {
            var mod = _c[_i];
            (_a = mods[_b = mod.type]) !== null && _a !== void 0 ? _a : (mods[_b] = 0);
            mods[mod.type] += mod.level;
        }
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
        if (stats.level < MiningLv.OBSIDIAN) {
            stats.level++;
        }
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
        if (stats.level < MiningLv.DIAMOND) {
            stats.level++;
        }
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
        return _super.call(this, "silk", "Silky", 5, [ItemID.tcon_silky_jewel], 1, false, ["luck"]) || this;
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
        return level >= 5 ? true : Math.random() < level * 0.2;
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
        if (headMeta !== -1 && Math.random() < 0.1 * level) {
            var region = WorldRegion.getForActor(player);
            region.dropItem(Entity.getPosition(victim), VanillaBlockID.skull, 1, headMeta);
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
Callback.addCallback("EntityDeath", function (entity, attacker, damageType) {
    if (KEX) {
        return;
    }
    if (Entity.getType(entity) === EEntityType.WHITHER_SKELETON) {
        if (Math.random() < (EntityHelper.isPlayer(Entity.getType(attacker)) ? 0.1 : 0.05)) {
            var region = WorldRegion.getForDimension(Entity.getDimension(entity));
            region.dropItem(Entity.getPosition(entity), ItemID.tcon_necrotic_bone, 1, 0);
        }
    }
});
// KEX.LootModule.createLootTableModifier("entities/wither_skeleton")
//     .createNewPool()
//         .addEntry()
//             .describeItem(ItemID.tcon_necrotic_bone)
//             .describeItem("minecraft", "tcon_necrotic_bone")
//             .setWeight(1)
//             .setCount(1)
//         .endEntry()
//         .beginConditions()
//             .addKilledByPlayerCondition()
//             .addRandomChanceWithLootingCondition(0.8, 0.1)
//         .endConditions()
//     .endPool();
var ModKnockback = /** @class */ (function (_super) {
    __extends(ModKnockback, _super);
    function ModKnockback() {
        return _super.call(this, "knockback", "Knockback", 12, [VanillaBlockID.piston], 10, true) || this;
    }
    ModKnockback.prototype.onAttack = function (item, victim, player, level) {
        var vec = Entity.getLookVector(player);
        var speed = 1 + level * 0.1;
        Entity.setVelocity(victim, vec.x * speed, 0.1, vec.z * speed);
        return 0;
    };
    return ModKnockback;
}(TinkersModifier));
createItem("tcon_moss", "Ball of Moss");
createItem("tcon_mending_moss", "Mending Moss");
Recipes2.addShapeless(ItemID.tcon_moss, [{ id: "mossy_cobblestone", count: 9 }]);
Item.registerUseFunction(ItemID.tcon_moss, function (coords, item, block, playerUid) {
    if (block.id === VanillaBlockID.bookshelf) {
        var player = new PlayerEntity(playerUid);
        var region = WorldRegion.getForActor(playerUid);
        var level = player.getLevel();
        if (level < 10) {
            BlockEngine.sendMessage(Network.getClientForPlayer(playerUid), "Mending Moss requires at least 10 levels");
            return;
        }
        player.setLevel(level - 10);
        player.decreaseCarriedItem();
        player.addItemToInventory(ItemID.tcon_mending_moss, 1, 0);
        region.playSound(coords, "random.orb", 0.5);
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
Item.addCreativeGroup("tcon_partbuilder", translate("Part Builder"), [
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
Recipes2.addShaped(BlockID.tcon_partbuilder0, "a:b", { a: ItemID.tcon_pattern_blank, b: { id: "log", data: 0 } });
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
            slotPattern: { type: "slot", x: 8, y: 136 - 36, bitmap: "tcon.slot.pattern", size: 72 },
            slotMaterial: { type: "slot", x: 80, y: 136 - 36, size: 72 },
            slotResult: { type: "slot", x: 440, y: 136 - 52, size: 104, visual: true, clicker: { onClick: function (_, container) { return container.sendEvent("craft", {}); } } },
            cursor: { type: "image", x: 0, y: 2000, z: 1, width: 64, height: 64, bitmap: "_selection" },
            textCost: { type: "text", x: 288, y: 300, font: { size: 24, color: Color.GRAY, alignment: UI.Font.ALIGN_CENTER } },
            textTitle: { type: "text", x: 780, y: 4, font: { size: 32, color: Color.YELLOW, bold: true, alignment: UI.Font.ALIGN_CENTER }, text: translate("Title") },
            textStats: { type: "text", x: 608, y: 64, font: { size: 24, color: Color.WHITE }, multiline: true, text: translate("Description") },
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
                clicker: { onClick: function (_, container) {
                        container.sendEvent("select", { index: i });
                    } }
            };
        };
        for (var i = 0; i < PartRegistry.types.length; i++) {
            _loop_1(i);
        }
        var window = new UI.StandardWindow({
            standard: {
                header: { text: { text: translate("Part Builder") }, height: 60 },
                inventory: { standard: true },
                background: { standard: true }
            },
            drawing: [
                { type: "frame", x: 580, y: 0, width: 400, height: 480, bitmap: "tcon.frame", scale: 4 }
            ],
            elements: elements
        });
        _this = _super.call(this, "tcon_partbuilder", window) || this;
        _this.selectedPattern = -1;
        ItemContainer.addClientEventListener(_this.name, "refresh", function (container, win, content, data) {
            var _a, _b;
            var elems = window.getElements();
            elems.get("slotResult").setBinding("source", data.result === 0 ? { id: 0, count: 0, data: 0 } : { id: Network.serverToLocalId(data.result), count: 1, data: 0 });
            if (data.index === -1) {
                (_a = elems.get("cursor")) === null || _a === void 0 ? void 0 : _a.setPosition(0, 2000);
            }
            else {
                var selectedElem = elems.get("btn" + data.index);
                (_b = elems.get("cursor")) === null || _b === void 0 ? void 0 : _b.setPosition(selectedElem.x, selectedElem.y);
            }
        });
        ItemContainer.addClientEventListener(_this.name, "stats", function (container, win, content, data) {
            var _a, _b, _c;
            if (data.material == null) {
                container.setText("textTitle", translate("Part Builder"));
                container.setText("textStats", addLineBreaks(20, translate("Here you can craft tool parts to fulfill your tinkering fantasies.") + "\n\n" + translate("To craft a part simply put a blank pattern into the left slot and select the part you want. The remaining slot holds the material you want to craft your part out of.")));
            }
            else {
                var material = (_b = (_a = Material[data.material]) === null || _a === void 0 ? void 0 : _a.getLocalizedName()) !== null && _b !== void 0 ? _b : "Unknown material %s";
                container.setText("textTitle", translate(material, data.material));
                var miningTier = (_c = MiningLvName[data.head.level]) !== null && _c !== void 0 ? _c : "Unknown mining tier %s";
                container.setText("textStats", addLineBreaks(20, translate("Head") + "\n" +
                    translate("Durability: ") + data.head.durability + "\n" +
                    translate("Mining Tier: ") + translate(miningTier, data.head.level) + "\n" +
                    translate("Mining Speed: ") + data.head.speed + "\n" +
                    translate("Melee Damage: ") + data.head.attack + "\n\n" +
                    translate("Handle") + "\n" +
                    translate("Multiplier: ") + data.handle.modifier + "\n" +
                    translate("Durability: ") + data.handle.durability + "\n\n" +
                    translate("Extra") + "\n" +
                    translate("Durability: ") + data.extra.durability));
                if (data.patternDataCost != null) {
                    container.setText("textCost", translate("Material value: %s", data.slotMaterialCount + " / " + data.patternDataCost));
                    return;
                }
            }
            container.setText("textCost", "");
        });
        return _this;
    }
    class_1.prototype.addServerEvents = function (container) {
        var _this = this;
        container.addServerEventListener("select", function (con, client, data) {
            _this.selectedPattern = data.index;
            _this.onUpdate(con);
        });
        container.addServerEventListener("craft", function (con, client, data) { return _this.onCraft(con, client); });
    };
    class_1.prototype.autoSetPattern = function (container, player) {
        var slotPattern = container.getSlot("slotPattern");
        if (slotPattern.isEmpty()) {
            var actor = new PlayerActor(player);
            var inv = void 0;
            for (var i = 0; i < 36; i++) {
                inv = actor.getInventorySlot(i);
                if (inv.id === ItemID.tcon_pattern_blank) {
                    slotPattern.set(inv.id, inv.count, inv.data, inv.extra);
                    slotPattern.markDirty();
                    container.sendChanges();
                    actor.setInventorySlot(i, 0, 0, 0, null);
                    break;
                }
            }
        }
    };
    class_1.prototype.isValidAddTransfer = function (container, slotName, id, amount, data, extra, player) {
        switch (slotName) {
            case "slotPattern":
                if (id === ItemID.tcon_pattern_blank)
                    return true;
                break;
            case "slotMaterial":
                var item = void 0;
                for (var key in Material) {
                    item = Material[key].getItem();
                    if (item && id === item.id && (item.data === -1 || data === item.data)) {
                        this.autoSetPattern(container, player);
                        return true;
                    }
                }
                break;
        }
        return false;
    };
    class_1.prototype.isValidGetTransfer = function (container, slotName, id, amount, data, extra, player) {
        if (slotName === "slotResult")
            return false;
        return true;
    };
    class_1.prototype.onUpdate = function (container) {
        var patternData = PartRegistry.types[this.selectedPattern];
        var slotPattern = container.getSlot("slotPattern");
        var slotMaterial = container.getSlot("slotMaterial");
        var requiresPattern = true;
        var item;
        var resultId = 0;
        if (slotPattern.id === ItemID.tcon_pattern_blank && patternData) {
            for (var key in Material) {
                item = Material[key].getItem();
                if (item && item.id === slotMaterial.id && (item.data === -1 || item.data === slotMaterial.data)) {
                    this.showMaterial(container, key, slotMaterial.count, patternData.cost);
                    if (!Material[key].isMetal) {
                        if (slotMaterial.count >= patternData.cost) {
                            resultId = PartRegistry.getIDFromData(patternData.key, key);
                        }
                    }
                    requiresPattern = false;
                    break;
                }
            }
        }
        if (requiresPattern) {
            container.sendEvent("stats", {});
        }
        container.sendChanges();
        container.sendEvent("refresh", { result: resultId, index: this.selectedPattern });
    };
    class_1.prototype.showMaterial = function (container, key, slotMaterialCount, patternDataCost) {
        var material = Material[key];
        var packet = {
            material: key,
            head: material.getHeadStats(),
            handle: material.getHandleStats(),
            extra: material.getExtraStats()
        };
        if (!material.isMetal) {
            packet.slotMaterialCount = slotMaterialCount;
            packet.patternDataCost = patternDataCost;
        }
        container.sendEvent("stats", packet);
    };
    class_1.prototype.onCraft = function (container, client) {
        var patternData = PartRegistry.types[this.selectedPattern];
        var slotPattern = container.getSlot("slotPattern");
        var slotMaterial = container.getSlot("slotMaterial");
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
            var actor = new PlayerActor(client.getPlayerUid());
            actor.addItemToInventory(resultId, 1, 0, null, true);
            slotPattern.count--;
            slotMaterial.count -= cost;
            container.markAllSlotsDirty();
            container.validateAll();
            container.sendChanges();
            client.send("tcon.playSound", { name: "tcon.little_saw.ogg" });
        }
        this.onUpdate(container);
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
    ToolForgeHandler.addRecipe = function (resultType, pattern) {
        this.recipes.push({ result: resultType, pattern: pattern });
    };
    ToolForgeHandler.getRecipes = function (isForge) {
        return this.recipes.filter(function (recipe) { return isForge || recipe.pattern.length <= 3; });
    };
    ToolForgeHandler.createForgeBlock = function (namedID, block) {
        var id = createBlock(namedID, [{ name: "Tool Forge", texture: [["tcon_toolforge", 0]] }]);
        Item.addCreativeGroup("tcon_toolforge", translate("Tool Forge"), [id]);
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
    function ToolCrafterWindow(windowName, title, isForge) {
        var _this = this;
        var window = new UI.StandardWindow({
            standard: {
                header: { text: { text: title }, height: 60 },
                inventory: { standard: true },
                background: { standard: true }
            },
            drawing: [
                { type: "frame", x: 580, y: 0, width: 400, height: 240, bitmap: "tcon.frame", scale: 4 },
                { type: "frame", x: 580, y: 260, width: 400, height: 240, bitmap: "tcon.frame", scale: 4 }
            ],
            elements: {
                imageBg: { type: "image", x: 50, y: 95, bitmap: "tcon.icon.repair", scale: 18.75 },
                slot0: { type: "slot", x: 0, y: 2000, z: 1, size: 80 },
                slot1: { type: "slot", x: 0, y: 2000, z: 1, size: 80 },
                slot2: { type: "slot", x: 0, y: 2000, z: 1, size: 80 },
                slot3: { type: "slot", x: 0, y: 2000, z: 1, size: 80 },
                slot4: { type: "slot", x: 0, y: 2000, z: 1, size: 80 },
                slot5: { type: "slot", x: 0, y: 2000, z: 1, size: 80 },
                slotResult: { type: "slot", x: 420, y: 190, size: 120, visual: true, clicker: {
                        onClick: function (_, container) { return container.sendEvent("craft", {}); }
                    } },
                buttonPrev: { type: "button", x: 50, y: 452, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                        onClick: function (_, container) { return container.sendEvent("page", { page: -1 }); }
                    } },
                buttonNext: { type: "button", x: 254, y: 452, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                        onClick: function (_, container) { return container.sendEvent("page", { page: 1 }); }
                    } }
            }
        });
        var loc = window.getWindow("content").getLocation();
        window.addWindow("stats", {
            // -14 is mistery (which is actually status bar offset, enable fullscreen!)
            location: { x: loc.x + loc.windowToGlobal(580 + 20), y: loc.y + loc.windowToGlobal(0 + 20), width: loc.windowToGlobal(400 - 40), height: loc.windowToGlobal(240 - 40), scrollY: 250 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT }
            ],
            elements: {
                textTitle: { type: "text", x: 500, y: -30, font: { size: 80, color: Color.YELLOW, shadow: 0.5, alignment: UI.Font.ALIGN_CENTER, bold: true } },
                textStats: { type: "text", x: 20, y: 120, font: { size: 72, color: Color.WHITE, shadow: 0.5 }, multiline: true }
            }
        });
        window.addWindow("modifiers", {
            location: { x: loc.x + loc.windowToGlobal(580 + 20), y: loc.y + loc.windowToGlobal(260 + 20), width: loc.windowToGlobal(400 - 40), height: loc.windowToGlobal(240 - 40), scrollY: 250 },
            drawing: [
                { type: "background", color: Color.TRANSPARENT },
                { type: "text", x: 500, y: 50, font: { size: 80, color: Color.YELLOW, shadow: 0.5, alignment: UI.Font.ALIGN_CENTER, bold: true }, text: translate("Modifiers") }
            ],
            elements: {
                textModifiers: { type: "text", x: 20, y: 120, font: { size: 72, color: Color.WHITE, shadow: 0.5 }, multiline: true }
            }
        });
        _this = _super.call(this, windowName, window) || this;
        _this.page = 0;
        _this.isForge = !!isForge;
        ItemContainer.addClientEventListener(_this.name, "changeLayout", function (container, win, content, data) {
            var centerX = 160;
            var centerY = 210;
            var scale = 5;
            var slot;
            for (var i = 0; i < 6; i++) {
                slot = content.elements["slot" + i];
                if (data.slots[i]) {
                    slot.x = data.slots[i].x * scale + centerX;
                    slot.y = data.slots[i].y * scale + centerY;
                    slot.bitmap = data.slots[i].bitmap;
                }
                else {
                    slot.y = 2000;
                }
            }
            content.elements.imageBg.bitmap = data.background;
            container.setText("textTitle", translate(data.title));
            container.setText("textStats", addLineBreaks(20, translate(data.intro)));
        });
        ItemContainer.addClientEventListener(_this.name, "showInfo", function (container, win, content, data) {
            var _a;
            var miningTier = (_a = MiningLvName[data.miningTier]) !== null && _a !== void 0 ? _a : "Unknown mining tier %s";
            container.setText("textStats", addLineBreaks(20, translate("Durability: ") + data.durability + "/" + data.maxDurability + "\n" +
                translate("Mining Tier: ") + translate(miningTier, data.miningTier) + "\n" +
                translate("Mining Speed: ") + data.miningSpeed + "\n" +
                translate("Melee Damage: ") + data.meleeDamage + "\n" +
                translate("Modifiers: ") + data.modifierSlots));
            container.setText("textModifiers", addLineBreaks(20, data.modifiers.map(function (mod) {
                var modifier = Modifier[mod.type];
                if (modifier == null) {
                    return "".concat(translate("Unknown modifier %s", mod.type), " (").concat(mod.level, ")");
                }
                return "".concat(modifier.getLocalizedName(), " (").concat(mod.level, "/").concat(modifier.max, ")");
            }).join("\n")));
        });
        ItemContainer.addClientEventListener(_this.name, "showHammer", function (container, win, content, data) {
            container.setText("textStats", addLineBreaks(20, translate(data.intro)));
            container.setText("textModifiers", "       .\n     /( _________\n     |  >:=========`\n     )(  \n     \"\"");
        });
        return _this;
    }
    ToolCrafterWindow.prototype.addServerEvents = function (container) {
        var _this = this;
        container.addServerEventListener("page", function (con, client, data) { return _this.turnPage(con, data.page); });
        container.addServerEventListener("craft", function (con, client, data) { return _this.onCraft(con, client); });
    };
    ToolCrafterWindow.prototype.onOpen = function (container) {
        this.turnPage(container, 0);
    };
    ToolCrafterWindow.prototype.onClose = function (container) {
        container.clearSlot("slotResult");
    };
    ToolCrafterWindow.prototype.onUpdate = function (container) {
        var consume = [];
        var slotTool = container.getSlot("slot0");
        if (TconToolFactory.isTool(slotTool.id) && slotTool.extra) {
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
            var mat_1 = stack_1.instance.repairParts.map(function (index) { return stack_1.materials[index].getItem(); });
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
                result = new TconToolStack(result);
                container.setSlot("slotResult", result.id, result.count, result.data, result.extra);
            }
            else {
                container.clearSlot("slotResult");
            }
        }
        else {
            var result = ToolForgeHandler.getRecipes(this.isForge).find(function (recipe) {
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
                    partData ? materials.push(partData.material) : alert(translate("Unknown slot type %s", slot.id));
                    consume[i] = 1;
                }
                var stack = TconToolFactory.createToolStack(result.result, materials);
                container.setSlot("slotResult", stack.id, stack.count, stack.data, stack.extra);
            }
            else {
                container.clearSlot("slotResult");
            }
        }
        var slotResult = container.getSlot("slotResult");
        if (TconToolFactory.isTool(slotResult.id) && slotResult.extra) {
            this.showInfo(container, slotResult);
        }
        else if (TconToolFactory.isTool(slotTool.id) && slotTool.extra) {
            this.showInfo(container, slotTool);
        }
        else {
            var layout = ToolForgeHandler.getLayoutList(this.isForge)[this.page];
            container.sendEvent("showHammer", layout);
        }
        this.consume = consume;
        container.sendChanges();
    };
    ToolCrafterWindow.prototype.onCraft = function (container, client) {
        var slotResult = container.getSlot("slotResult");
        if (slotResult.id !== 0) {
            var actor = new PlayerActor(client.getPlayerUid());
            var slot = void 0;
            for (var i = 0; i < 6; i++) {
                slot = container.getSlot("slot" + i);
                slot.count -= this.consume[i] || 0;
                slot.markDirty();
                slot.validate();
            }
            actor.addItemToInventory(slotResult.id, slotResult.count, slotResult.data, slotResult.extra, true);
            if (this.isForge) {
                client.send("tcon.playSound", { name: "tcon.anvil_use.ogg", volume: 0.5, pitch: 0.95 + 0.2 * Math.random() });
            }
            else {
                client.send("tcon.playSound", { name: "tcon.little_saw.ogg" });
            }
            this.onUpdate(container);
        }
    };
    ToolCrafterWindow.prototype.turnPage = function (container, page) {
        var layouts = ToolForgeHandler.getLayoutList(this.isForge);
        this.page += page;
        this.page = this.page < 0 ? layouts.length - 1 : this.page >= layouts.length ? 0 : this.page;
        var layout = layouts[this.page];
        container.sendEvent("changeLayout", layout);
        this.onUpdate(container);
    };
    ToolCrafterWindow.prototype.showInfo = function (container, item) {
        var stack = new TconToolStack(item);
        var modifiers = TinkersModifierHandler.decodeToArray(item.extra.getString("modifiers"));
        var level = ToolLeveling.getLevel(stack.xp, stack.instance.is3x3);
        container.sendEvent("showInfo", {
            durability: stack.stats.durability - item.extra.getInt("durability"),
            maxDurability: stack.stats.durability,
            miningTier: stack.stats.level,
            miningSpeed: (stack.stats.efficiency * 100 | 0) / 100,
            meleeDamage: (stack.stats.damage * 100 | 0) / 100,
            modifierSlots: Cfg.modifierSlots + level - modifiers.length,
            modifiers: modifiers
        });
    };
    return ToolCrafterWindow;
}(CraftingWindow));
createBlock("tcon_toolstation", [{ name: "Tinker Station" }], "wood");
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
    var winStation = new ToolCrafterWindow("tcon_toolstation", translate("Tinker Station"), false);
    var winForge = new ToolCrafterWindow("tcon_toolforge", translate("Tool Forge"), true);
    winStation.addTargetBlock(BlockID.tcon_toolstation);
    winForge.addTargetBlock(BlockID.tcon_toolforge_iron);
    winForge.addTargetBlock(BlockID.tcon_toolforge_gold);
    winForge.addTargetBlock(BlockID.tcon_toolforge_cobalt);
    winForge.addTargetBlock(BlockID.tcon_toolforge_ardite);
    winForge.addTargetBlock(BlockID.tcon_toolforge_manyullyn);
    winForge.addTargetBlock(BlockID.tcon_toolforge_pigiron);
    winForge.addTargetBlock(BlockID.tcon_toolforge_alubrass);
})();
var TconTool = /** @class */ (function (_super) {
    __extends(TconTool, _super);
    function TconTool(stringID, name, icon) {
        var _this = _super.call(this, stringID, name, icon, false) || this;
        _this.tconToolType = stringID;
        _this.isWeapon = false;
        _this.is3x3 = false;
        _this.miningSpeedModifier = 1.0;
        _this.damagePotential = 1.0;
        _this.repairParts = [1]; //head
        _this.setHandEquipped(true);
        _this.setMaxStack(1);
        _this.setMaxDamage(13);
        //this.setCategory(EItemCategory.TOOL);
        for (var i = 0; i <= _this.maxDamage; i++) {
            ItemModel.getFor(_this.id, i).setModelOverrideCallback(function (item) { return ToolModelManager.getModel(item); });
        }
        return _this;
    }
    TconTool.prototype.setToolParams = function (miningLevel) {
        ToolAPI.registerTool(this.id, { level: miningLevel, durability: this.maxDamage }, this.blockTypes || [], this);
        TconToolFactory.registerTool(this.id, this.tconToolType, miningLevel);
    };
    TconTool.prototype.getRepairModifierForPart = function (index) {
        return 1.0;
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
        if ((blockData === null || blockData === void 0 ? void 0 : blockData.material) && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()) {
            devider = stack.stats.efficiency;
            if (blockData.isNative) {
                devider *= blockData.material.multiplier;
            }
        }
        return time.base / devider / time.modifier;
    };
    TconTool.prototype.onDestroy = function (item, coords, block, player) {
        if (!item.extra) {
            return true;
        }
        var stack = new TconToolStack(item);
        var blockData = ToolAPI.getBlockData(block.id);
        //KEX compatibility (ToolAPI.getBlockData will NOT be null)
        if ((blockData === null || blockData === void 0 ? void 0 : blockData.material) && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()) {
            stack.forEachModifiers(function (mod, level) {
                mod.onDestroy(item, coords, block, player, level);
            });
            if (this.isWeapon) {
                stack.consumeDurability(2, player);
            }
            else {
                stack.consumeDurability(1, player);
                stack.addXp(1, player);
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
            stack.consumeDurability(1, player);
            stack.addXp(1, player);
        }
        else {
            stack.consumeDurability(2, player);
        }
        item.data = stack.data; //setCarriedItem in ToolAPI.playerAttackHook
        return true;
    };
    //KEX compatibility
    TconTool.prototype.getAttackDamageBonus = function (item, attacker, victim) {
        if (!item.extra) {
            return 0;
        }
        var stack = new TconToolStack(item);
        var bonus = 0;
        if (attacker !== 0 && victim !== 0) {
            stack.forEachModifiers(function (mod, level) {
                bonus += mod.onAttack(item, victim, attacker, level);
            });
        }
        return stack.stats.damage + bonus;
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
                    if ((blockData === null || blockData === void 0 ? void 0 : blockData.material) && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level) {
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
        if ((blockData === null || blockData === void 0 ? void 0 : blockData.material) && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level) {
            consume++;
            stack.forEachModifiers(function (mod, level) {
                mod.onDestroy(item, coords, block, player, level);
            });
        }
        stack.consumeDurability(consume, player);
        stack.addXp(consume, player);
        item.data = stack.data;
        return true;
    };
    return TconTool3x3;
}(TconTool));
Callback.addCallback("EntityHurt", function (attacker, victim, damageValue, damageType) {
    if (EntityHelper.isPlayer(attacker)) {
        var item = Entity.getCarriedItem(attacker);
        var tool = ToolAPI.getToolData(item.id);
        (tool === null || tool === void 0 ? void 0 : tool.onDealDamage) && tool.onDealDamage(item, victim, attacker, damageValue, damageType);
    }
});
Callback.addCallback("EntityDeath", function (entity, attacker, damageType) {
    if (EntityHelper.isPlayer(attacker)) {
        var item = Entity.getCarriedItem(attacker);
        var tool = ToolAPI.getToolData(item.id);
        (tool === null || tool === void 0 ? void 0 : tool.onKillEntity) && tool.onKillEntity(item, entity, attacker, damageType);
    }
});
Callback.addCallback("LocalTick", function () {
    if (World.getThreadTime() % 150 === 0) {
        var item = Player.getCarriedItem();
        var tool = ToolAPI.getToolData(item.id);
        (tool === null || tool === void 0 ? void 0 : tool.onMending) && tool.onMending(item, Player.get());
    }
});
var ToolModelManager = /** @class */ (function () {
    function ToolModelManager() {
    }
    ToolModelManager.getModel = function (item) {
        var _a;
        if (!item.extra) {
            return null;
        }
        var stack = new TconToolStack(item);
        var suffix = stack.isBroken() ? "broken" : "normal";
        var texture = stack.instance.texture;
        var uniqueKey = stack.uniqueKey();
        if (this.models[uniqueKey]) {
            return this.models[uniqueKey][suffix];
        }
        if ((_a = Threading.getThread("tcon_toolmodel")) === null || _a === void 0 ? void 0 : _a.isAlive()) {
            return null;
        }
        var modelNormal = ItemModel.newStandalone();
        var modelBroken = ItemModel.newStandalone();
        var path = texture.getPath();
        var mesh = [ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool()];
        var coordsNormal = [];
        var coordsBroken = [];
        var index = 0;
        for (var i = 0; i < texture.partsCount; i++) {
            index = stack.materials[i].getTexIndex();
            coordsNormal.push(texture.getCoords(i, index, false));
            coordsBroken.push(texture.getCoords(i, index, true));
        }
        for (var key in stack.modifiers) {
            index = Modifier[key].getTexIndex();
            coordsNormal.push(texture.getModCoords(index));
            coordsBroken.push(texture.getModCoords(index));
        }
        Threading.initThread("tcon_toolmodel", function () {
            var size = 1 / 16;
            var coords;
            var x = 0;
            var y = 0;
            var z = 0;
            for (var i = 0; i < 4; i++) {
                coords = i >> 1 ? coordsBroken : coordsNormal;
                for (var j = 0; j < coords.length; j++) {
                    x = coords[j].x / texture.resolution;
                    y = coords[j].y / texture.resolution;
                    z = (i & 1 ? j : (coords.length - j)) * 0.001;
                    mesh[i].setColor(1, 1, 1);
                    mesh[i].setNormal(1, 1, 0);
                    mesh[i].addVertex(0, 1, z, x, y);
                    mesh[i].addVertex(1, 1, z, x + size, y);
                    mesh[i].addVertex(0, 0, z, x, y + size);
                    mesh[i].addVertex(1, 1, z, x + size, y);
                    mesh[i].addVertex(0, 0, z, x, y + size);
                    mesh[i].addVertex(1, 0, z, x + size, y + size);
                }
                if ((i & 1) === 0) { //hand
                    mesh[i].translate(0.4, -0.1, 0.2);
                    mesh[i].rotate(0.5, 0.5, 0.5, 0, -2.1, 0.4);
                    mesh[i].scale(2, 2, 2);
                }
            }
            var bmpNormal = Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
            var bmpBroken = Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
            var cvsNormal = new Canvas(bmpNormal);
            var cvsBroken = new Canvas(bmpBroken);
            var bmp;
            for (var i = 0; i < coordsNormal.length; i++) {
                bmp = texture.getBitmap(coordsNormal[i]);
                cvsNormal.drawBitmap(bmp, 0, 0, null);
                bmp.recycle();
            }
            for (var i = 0; i < coordsBroken.length; i++) {
                bmp = texture.getBitmap(coordsBroken[i]);
                cvsBroken.drawBitmap(bmp, 0, 0, null);
                bmp.recycle();
            }
            modelNormal.setModel(mesh[0], path)
                .setUiModel(mesh[1], path)
                .setSpriteUiRender(true)
                .setModUiSpriteBitmap(bmpNormal);
            modelBroken.setModel(mesh[2], path)
                .setUiModel(mesh[3], path)
                .setSpriteUiRender(true)
                .setModUiSpriteBitmap(bmpBroken);
            bmpNormal.recycle();
            bmpBroken.recycle();
            Thread.sleep(50);
        });
        this.models[uniqueKey] = { normal: modelNormal, broken: modelBroken };
        return this.models[uniqueKey][suffix];
    };
    ToolModelManager.models = {};
    return ToolModelManager;
}());
var TconPickaxe = /** @class */ (function (_super) {
    __extends(TconPickaxe, _super);
    function TconPickaxe(miningLevel) {
        var _this = _super.call(this, "tcontool_pickaxe_lv" + miningLevel, "Pickaxe", "tcontool_pickaxe") || this;
        _this.tconToolType = "pickaxe";
        _this.blockTypes = ["stone"];
        _this.texture = new ToolTexture(_this.tconToolType, 3, 1);
        _this.setToolParams(miningLevel);
        return _this;
    }
    TconPickaxe.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1])
            .extra(materials[2])
            .handle(materials[0]);
    };
    return TconPickaxe;
}(TconTool));
ToolForgeHandler.addRecipe("pickaxe", ["rod", "pickaxe", "binding"]);
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
    function TconShovel(miningLevel) {
        var _this = _super.call(this, "tcontool_shovel_lv" + miningLevel, "Shovel", "tcontool_shovel") || this;
        _this.tconToolType = "shovel";
        _this.blockTypes = ["dirt"];
        _this.texture = new ToolTexture(_this.tconToolType, 3, 1);
        _this.damagePotential = 0.9;
        _this.setToolParams(miningLevel);
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
                stack.consumeDurability(1, player);
                stack.addXp(1, player);
                stack.applyToHand(player);
            }
        }
    };
    return TconShovel;
}(TconTool));
ToolForgeHandler.addRecipe("shovel", ["rod", "shovel", "binding"]);
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
    function TconHatchet(miningLevel) {
        var _this = _super.call(this, "tcontool_hatchet_lv" + miningLevel, "Hatchet", "tcontool_hatchet") || this;
        _this.tconToolType = "hatchet";
        _this.blockTypes = ["wood", "plant"];
        _this.texture = new ToolTexture(_this.tconToolType, 3, 1);
        _this.damagePotential = 1.1;
        _this.setToolParams(miningLevel);
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
                    stack.consumeDurability(2, player);
                }
                else {
                    stack.consumeDurability(1, player);
                    stack.addXp(1, player);
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
                stack.consumeDurability(1, player);
                stack.addXp(1, player);
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
ToolForgeHandler.addRecipe("hatchet", ["rod", "axe", "binding"]);
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
    function TconMattock(miningLevel) {
        var _this = _super.call(this, "tcontool_mattock_lv" + miningLevel, "Mattock", "tcontool_mattock") || this;
        _this.index = 0;
        _this.tconToolType = "mattock";
        _this.blockTypes = ["wood", "dirt"];
        _this.texture = new ToolTexture(_this.tconToolType, 3, 1);
        _this.miningSpeedModifier = 0.95;
        _this.damagePotential = 0.9;
        _this.repairParts = [1, 2];
        _this.setToolParams(miningLevel);
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
                stack.consumeDurability(1, player);
                stack.addXp(1, player);
                stack.applyToHand(player);
            }
        }
    };
    return TconMattock;
}(TconTool));
ToolForgeHandler.addRecipe("mattock", ["rod", "axe", "shovel"]);
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
    function TconSword(miningLevel) {
        var _this = _super.call(this, "tcontool_sword_lv" + miningLevel, "Broad Sword", "tcontool_sword") || this;
        _this.tconToolType = "sword";
        _this.blockTypes = ["fibre"];
        _this.texture = new ToolTexture(_this.tconToolType, 3, 1);
        _this.isWeapon = true;
        _this.setToolParams(miningLevel);
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
ToolForgeHandler.addRecipe("sword", ["rod", "sword", "guard"]);
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
    function TconHammer(miningLevel) {
        var _this = _super.call(this, "tcontool_hammer_lv" + miningLevel, "Hammer", "tcontool_hammer") || this;
        _this.tconToolType = "hammer";
        _this.blockTypes = ["stone"];
        _this.texture = new ToolTexture(_this.tconToolType, 4, 0);
        _this.miningSpeedModifier = 0.4;
        _this.damagePotential = 1.2;
        _this.repairParts = [1, 2, 3];
        _this.setToolParams(miningLevel);
        return _this;
    }
    TconHammer.prototype.buildStats = function (stats, materials) {
        stats.head(materials[1], materials[1], materials[2], materials[3])
            .handle(materials[0]);
        stats.level = materials[1].getHeadStats().level;
        stats.durability *= TconHammer.DURABILITY_MODIFIER;
    };
    TconHammer.prototype.getRepairModifierForPart = function (index) {
        return index === 1 ? TconHammer.DURABILITY_MODIFIER : TconHammer.DURABILITY_MODIFIER * 0.6;
    };
    TconHammer.DURABILITY_MODIFIER = 2.5;
    return TconHammer;
}(TconTool3x3));
ToolForgeHandler.addRecipe("hammer", ["rod2", "hammer", "largeplate", "largeplate"]);
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
    function TconExcavator(miningLevel) {
        var _this = _super.call(this, "tcontool_excavator_lv" + miningLevel, "Excavator", "tcontool_excavator") || this;
        _this.tconToolType = "excavator";
        _this.blockTypes = ["dirt"];
        _this.texture = new ToolTexture(_this.tconToolType, 4, 0);
        _this.miningSpeedModifier = 0.28;
        _this.damagePotential = 1.25;
        _this.repairParts = [1, 2];
        _this.setToolParams(miningLevel);
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
ToolForgeHandler.addRecipe("excavator", ["rod2", "excavator", "largeplate", "binding2"]);
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
    function TconLumberaxe(miningLevel) {
        var _this = _super.call(this, "tcontool_lumberaxe_lv" + miningLevel, "Lumber Axe", "tcontool_lumberaxe") || this;
        _this.tconToolType = "lumberaxe";
        _this.is3x3 = true;
        _this.blockTypes = ["wood"];
        _this.texture = new ToolTexture(_this.tconToolType, 3, 1);
        _this.miningSpeedModifier = 0.35;
        _this.damagePotential = 1.2;
        _this.repairParts = [1, 2];
        _this.setToolParams(miningLevel);
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
            this.treechop(coords, stack.uniqueKey(), player);
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
            stack.consumeDurability(consume, player);
            stack.addXp(consume, player);
            item.data = stack.data;
        }
        return true;
    };
    TconLumberaxe.prototype.treechop = function (coords, uniqueKey, player) {
        var updatableName = "tcon_treechop_" + player;
        var updatables = Updatable.getAll();
        var it = updatables.iterator();
        var updatable;
        while (it.hasNext()) {
            updatable = it.next();
            if (updatable.name === updatableName) {
                BlockEngine.sendMessage(Network.getClientForPlayer(player), "Tree chopping in progress...");
                return;
            }
        }
        Updatable.addUpdatable(new ChopTreeUpdatable(updatableName, coords, uniqueKey, player));
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
var ChopTreeUpdatable = /** @class */ (function () {
    function ChopTreeUpdatable(updatableName, coords, uniqueKey, player) {
        var _this = this;
        this.name = updatableName;
        this.player = player;
        this.uniqueKey = uniqueKey;
        this.target = [];
        this.visited = [];
        this.remove = false;
        this.update = function () {
            _this.remove = _this.onTick();
        };
        this.addNearest(coords);
    }
    ChopTreeUpdatable.prototype.alreadyVisited = function (coords) {
        return this.visited.some(function (p) { return p.x === coords.x && p.y === coords.y && p.z === coords.z; });
    };
    ChopTreeUpdatable.prototype.addTarget = function (coords) {
        if (!this.alreadyVisited(coords)) {
            this.target.push(coords);
        }
    };
    ChopTreeUpdatable.prototype.addNearest = function (coords) {
        for (var i = 2; i <= 5; i++)
            this.addTarget(World.getRelativeCoords(coords.x, coords.y, coords.z, i));
        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++)
                this.addTarget({ x: coords.x + i, y: coords.y + 1, z: coords.z + j });
    };
    ChopTreeUpdatable.prototype.onTick = function () {
        var _this = this;
        var carried = Entity.getCarriedItem(this.player);
        if (TconToolFactory.getType(carried.id) !== "lumberaxe" || !carried.extra)
            return true;
        var stack = new TconToolStack(carried);
        if (stack.isBroken() || stack.uniqueKey() !== this.uniqueKey)
            return true;
        var region = WorldRegion.getForActor(this.player);
        var coords;
        var block;
        while (this.target.length > 0) {
            coords = this.target.shift();
            if (!this.alreadyVisited(coords)) {
                block = region.getBlock(coords);
                if (TconLumberaxe.LOGS.indexOf(block.id) !== -1) {
                    break;
                }
                coords = null;
            }
        }
        if (!coords)
            return true;
        region.destroyBlock(coords, true, this.player);
        stack.forEachModifiers(function (mod, level) {
            mod.onDestroy(carried, { x: coords.x, y: coords.y, z: coords.z, side: EBlockSide.DOWN, relative: coords }, block, _this.player, level);
        });
        stack.consumeDurability(1, this.player);
        stack.addXp(1, this.player);
        stack.applyToHand(this.player);
        this.visited.push(coords);
        this.addNearest(coords);
        return false;
    };
    return ChopTreeUpdatable;
}());
ToolForgeHandler.addRecipe("lumberaxe", ["rod2", "broadaxe", "largeplate", "binding2"]);
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
ItemRegistry.registerItem(new TconPickaxe(MiningLv.STONE));
ItemRegistry.registerItem(new TconPickaxe(MiningLv.IRON));
ItemRegistry.registerItem(new TconPickaxe(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconPickaxe(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconPickaxe(MiningLv.COBALT));
ItemRegistry.registerItem(new TconShovel(MiningLv.STONE));
ItemRegistry.registerItem(new TconShovel(MiningLv.IRON));
ItemRegistry.registerItem(new TconShovel(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconShovel(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconShovel(MiningLv.COBALT));
ItemRegistry.registerItem(new TconHatchet(MiningLv.STONE));
ItemRegistry.registerItem(new TconHatchet(MiningLv.IRON));
ItemRegistry.registerItem(new TconHatchet(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconHatchet(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconHatchet(MiningLv.COBALT));
ItemRegistry.registerItem(new TconMattock(MiningLv.STONE));
ItemRegistry.registerItem(new TconMattock(MiningLv.IRON));
ItemRegistry.registerItem(new TconMattock(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconMattock(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconMattock(MiningLv.COBALT));
ItemRegistry.registerItem(new TconSword(MiningLv.STONE));
ItemRegistry.registerItem(new TconSword(MiningLv.IRON));
ItemRegistry.registerItem(new TconSword(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconSword(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconSword(MiningLv.COBALT));
ItemRegistry.registerItem(new TconHammer(MiningLv.STONE));
ItemRegistry.registerItem(new TconHammer(MiningLv.IRON));
ItemRegistry.registerItem(new TconHammer(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconHammer(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconHammer(MiningLv.COBALT));
ItemRegistry.registerItem(new TconExcavator(MiningLv.STONE));
ItemRegistry.registerItem(new TconExcavator(MiningLv.IRON));
ItemRegistry.registerItem(new TconExcavator(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconExcavator(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconExcavator(MiningLv.COBALT));
ItemRegistry.registerItem(new TconLumberaxe(MiningLv.STONE));
ItemRegistry.registerItem(new TconLumberaxe(MiningLv.IRON));
ItemRegistry.registerItem(new TconLumberaxe(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconLumberaxe(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconLumberaxe(MiningLv.COBALT));
TconToolFactory.addToCreative("pickaxe", "Pickaxe", 3);
TconToolFactory.addToCreative("shovel", "Shovel", 3);
TconToolFactory.addToCreative("hatchet", "Hatchet", 3);
TconToolFactory.addToCreative("mattock", "Mattock", 3);
TconToolFactory.addToCreative("sword", "Broad Sword", 3);
TconToolFactory.addToCreative("hammer", "Hammer", 4);
TconToolFactory.addToCreative("excavator", "Excavator", 4);
TconToolFactory.addToCreative("lumberaxe", "Lumber Axe", 4);
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
    TconLumberaxe.LOGS.push(BlockID.rubberTreeLog);
    TconLumberaxe.LOGS.push(BlockID.rubberTreeLogLatex);
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
            _this = _super.call(this, translate("Part Building"), BlockID.tcon_partbuilder0, {
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
            elements.get("imagePattern").setBinding("texture", recipe.pattern ? "tcon.pattern." + recipe.pattern : "_default_slot_empty");
        };
        return class_2;
    }(api.RecipeType)));
    api.RecipeTypeRegistry.register("tcon_melting", new /** @class */ (function (_super) {
        __extends(class_3, _super);
        function class_3() {
            var _this = _super.call(this, translate("Melting"), BlockID.tcon_smeltery, {
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
            _this.setDescription(translate("Melt"));
            _this.setTankLimit(MatValue.BLOCK);
            return _this;
        }
        class_3.prototype.getAllList = function () {
            return MeltingRecipe.getAllRecipeForRV();
        };
        class_3.prototype.onOpen = function (elements, recipe) {
            elements.get("textTemp").setBinding("text", translate("%s°C", recipe.temp));
        };
        return class_3;
    }(api.RecipeType)));
    api.RecipeTypeRegistry.register("tcon_alloying", new /** @class */ (function (_super) {
        __extends(class_4, _super);
        function class_4() {
            var _this = _super.call(this, translate("Alloying"), BlockID.tcon_smeltery, {
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
            _this.setDescription(translate("Alloy"));
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
            elements.get("textTime").setBinding("text", translate("%s s", (CastingRecipe.calcCooldownTime(recipe.inputLiq[0].liquid, recipe.inputLiq[0].amount) / 20).toFixed(1)));
            elements.get("textConsume").setBinding("text", recipe.consume ? translate("Consumes cast") : "");
        };
        return CastingRV;
    }(api.RecipeType));
    api.RecipeTypeRegistry.register("tcon_itemcast", new CastingRV(translate("Item Casting"), BlockID.tcon_itemcast, "tcon.rv.table", "table"));
    api.RecipeTypeRegistry.register("tcon_blockcast", new CastingRV(translate("Block Casting"), BlockID.tcon_blockcast, "tcon.rv.basin", "basin"));
});
//@ts-ignore
var KEX;
ModAPI.addAPICallback("KernelExtension", function (api) {
    if (typeof api.getKEXVersionCode === "function" && api.getKEXVersionCode() >= 300) {
        //@ts-ignore
        KEX = api;
        Callback.addCallback("PostLoaded", function () {
            PartRegistry.replaceTooltipsWithKEX(api);
            TconToolFactory.addKEXFeature(api);
        });
        api.LootModule.addOnDropCallbackFor("entities/wither_skeleton", function (drops, context) {
            var player = context.getKillerPlayer();
            if (Math.random() < (player ? 0.1 : 0.05)) {
                drops.addItem(ItemID.tcon_necrotic_bone, 1, 0);
            }
        });
    }
});
ModAPI.registerAPI("TConAPI", {
    MatValue: MatValue,
    SmelteryFuel: SmelteryFuel,
    MeltingRecipe: MeltingRecipe,
    AlloyRecipe: AlloyRecipe,
    CastingRecipe: CastingRecipe
});
