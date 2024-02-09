interface HeadStats {durability: number, efficiency: number, damage: number, level: number}
interface HandleStats {modifier: number, durability: number}
interface ExtraStats {durability: number}


class TinkersMaterial {

    private item: Tile;
    private headStats: HeadStats;
    private handleStats: HandleStats;
    private extraStats: ExtraStats;

    constructor(private name: string, private texIndex: number, private moltenLiquid?: string, public readonly isMetal?: boolean){

    }

    getName(): string {
        return this.name;
    }

    getLocalizedName(): string {
        return translate(this.getName());
    }

    getLocalizationOfPart(part: string): string {
        return translate(`${this.getName()} %s`, translate(part));
    }

    getTexIndex(): number {
        return this.texIndex;
    }

    getMoltenLiquid(): string {
        return this.moltenLiquid || "";
    }

    setItem(item: AnyID): this {
        if(item){
            this.item = getIDData(item, -1);
        }
        return this;
    }

    getItem(): Tile {
        return this.item;
    }

    setHeadStats(durability: number, efficiency: number, damage: number, level: number): this {
        this.headStats = {durability, efficiency, damage, level};
        return this;
    }

    setHandleStats(modifier: number, durability: number): this {
        this.handleStats = {modifier, durability};
        return this;
    }

    setExtraStats(durability: number): this {
        this.extraStats = {durability};
        return this;
    }

    getHeadStats(): HeadStats {
        return this.headStats;
    }

    getHandleStats(): HandleStats {
        return this.handleStats;
    }

    getExtraStats(): ExtraStats {
        return this.extraStats;
    }

}


//params source: slimeknights.tconstruct.tools.TinkerMaterials.java
const Material: {[key: string]: TinkersMaterial} = {

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

    pigiron: new TinkersMaterial("Pig Iron", 17, "molten_pigiron", true)
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
