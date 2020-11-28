interface HeadStats {durability: number, speed: number, attack: number, level: number};
interface HandleStats {modifier: number, durability: number};
interface ExtraStats {durability: number};


class TinkersMaterial {

    static readonly STONE = 1;
    static readonly IRON = 2;
    static readonly DIAMOND = 3;
    static readonly OBSIDIAN = 4;
    static readonly COBALT = 5;

    static readonly level = {
        1: "Stone",
        2: "Iron",
        3: "Diamond",
        4: "Obsidian",
        5: "Cobalt"
    };

    private item: number;
    private headStats: HeadStats;
    private handleStats: HandleStats;
    private extraStats: ExtraStats;

    constructor(private name: string, private texIndex: number, private moltenLiquid?: string, public isMetal?: boolean){

    }

    getName(): string {
        return this.name;
    }

    getTexIndex(): number {
        return this.texIndex;
    }

    getMoltenLiquid(): string {
        return this.moltenLiquid || "";
    }

    setItem(id: number): void {
        this.item = id;
    }

    getItem(): number {
        return this.item;
    }

    setHeadStats(durability: number, speed: number, attack: number, level: number): void {
        this.headStats = {durability: durability, speed: speed, attack: attack, level: level};
    }

    setHandleStats(modifier: number, durability: number): void {
        this.handleStats = {modifier: modifier, durability: durability};
    }

    setExtraStats(durability: number): void {
        this.extraStats = {durability: durability};
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


const Material: {[key: string]: TinkersMaterial} = {
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