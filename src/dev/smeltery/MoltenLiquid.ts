class MoltenLiquid {

    static readonly PATH = "model/tcon_liquids.png";
    static readonly PATH2 = "model/tcon_liquids_v2.png";

    private static typeCount = 6;

    private static types = {
        water: 0,
        lava: 1,
        milk: 2,
        metal: 3,
        stone: 4,
        other: 5
    };

    private static liquidCount: number = 0;
    private static data: {[liquid: string]: {y: number, temp: number}} = {};

    static getTexScale(): Render.PartParameters {
        return {
            width: 64,
            height: this.liquidCount * 32
        };
    }

    static register(liquid: string, temp: number, type: keyof typeof this.types, color: number = 0xffffff): void {
        if(temp < 300){
            return;
        }
        this.data[liquid] = {y: this.liquidCount * 32, temp: temp - 300};
        this.liquidCount++;
    }

    static createAndRegister(liquid: string, name: string, temp: number, type: keyof typeof this.types, color?: number): void {
        LiquidRegistry.registerLiquid(liquid, translate(name), ["liquid." + liquid]);
        const id = createItem("tcon_bucket_" + liquid, liquid !== "blood" ? name + " Bucket" : "Bucket o' " + name);
        Item.setCategory(id, EItemCategory.MATERIAL);
        Item.addCreativeGroup("tcon_bucket", translate("TConstruct: Buckets"), [id]);
        LiquidRegistry.registerItem(liquid, {id: VanillaItemID.bucket, data: 0}, {id: id, data: 0});
        this.register(liquid, temp, type);
    }

    static isExist(liquid: string): boolean {
        return liquid in this.data;
    }

    static getY(liquid: string): number {
        return this.data[liquid]?.y ?? -1;
    }

    static getTemp(liquid: string): number {
        return this.data[liquid]?.temp ?? -1;
    }

    // static getYOffset(liquid: string): number {
    //     return this.data[liquid]?.yOffset ?? -1;
    // }

    // static addBoxTo(mesh: RenderMesh, liquid: string, fr: Vector, to: Vector): void {
    //     const yOffset = this.getYOffset(liquid);

    //     const v1 = yOffset / this.typeCount;
    //     const v2 = (yOffset + 1) / this.typeCount;

    //     mesh.addVertex(fr.x, to.y, to.z, 0, v1);
    //     mesh.addVertex(to.x, to.y, to.z, 1, v1);
    //     mesh.addVertex(fr.x, to.y, fr.z, 0, v2);
    //     mesh.addVertex(to.x, to.y, to.z, 1, v1);
    //     mesh.addVertex(fr.x, to.y, fr.z, 0, v2);
    //     mesh.addVertex(to.x, to.y, fr.z, 1, v2);

    //     mesh.addVertex(fr.x, fr.y, to.z, 0, v1);
    //     mesh.addVertex(fr.x, to.y, to.z, 1, v1);
    //     mesh.addVertex(fr.x, fr.y, fr.z, 0, (yOffset + to.y) / this.typeCount);
    //     mesh.addVertex(fr.x, to.y, to.z, 1, v1);
    //     mesh.addVertex(fr.x, fr.y, fr.z, 0, (yOffset + to.y) / this.typeCount);
    //     mesh.addVertex(fr.x, to.y, fr.z, 1, (yOffset + to.y) / this.typeCount);

    // }

}


MoltenLiquid.register("water", 320, "water");
MoltenLiquid.register("lava", 769, "lava");
MoltenLiquid.register("milk", 320, "milk");
MoltenLiquid.createAndRegister("molten_iron", "Molten Iron", 769, "metal", 0xa81212);
MoltenLiquid.createAndRegister("molten_gold", "Molten Gold", 532, "metal", 0xf6d609);
MoltenLiquid.createAndRegister("molten_pigiron", "Molten Pig Iron", 600, "metal", 0xef9e9b);
MoltenLiquid.createAndRegister("molten_cobalt", "Molten Cobalt", 950, "metal", 0x2882d4);
MoltenLiquid.createAndRegister("molten_ardite", "Molten Ardite", 860, "metal", 0xd14210);
MoltenLiquid.createAndRegister("molten_manyullyn", "Molten Manyullyn", 1000, "metal", 0xa15cf8);
MoltenLiquid.createAndRegister("molten_knightslime", "Molten Knightslime", 370, "metal", 0xd236ff);
MoltenLiquid.createAndRegister("molten_alubrass", "Molten Aluminum Brass", 500, "metal", 0xece347);
MoltenLiquid.createAndRegister("molten_brass", "Molten Brass", 470, "metal", 0xede38b);
MoltenLiquid.createAndRegister("molten_copper", "Molten Copper", 542, "metal", 0xed9f07);
MoltenLiquid.createAndRegister("molten_tin", "Molten Tin", 350, "metal", 0xc1cddc);
MoltenLiquid.createAndRegister("molten_bronze", "Molten Bronze", 475, "metal", 0xe3bd68);
MoltenLiquid.createAndRegister("molten_zinc", "Molten Zinc", 375, "metal", 0xd3efe8);
MoltenLiquid.createAndRegister("molten_lead", "Molten Lead", 400, "metal", 0x4d4968);
MoltenLiquid.createAndRegister("molten_nickel", "Molten Nickel", 727, "metal", 0xc8d683);
MoltenLiquid.createAndRegister("molten_silver", "Molten Silver", 480, "metal", 0xd1ecf6);
MoltenLiquid.createAndRegister("molten_electrum", "Molten Electrum", 500, "metal", 0xe8db49);
MoltenLiquid.createAndRegister("molten_steel", "Molten Steel", 681, "metal", 0xa7a7a7);
MoltenLiquid.createAndRegister("molten_aluminum", "Molten Aluminum", 330, "metal", 0xefe0d5);
MoltenLiquid.createAndRegister("molten_stone", "Seared Stone", 800, "stone", 0x777777);
MoltenLiquid.createAndRegister("molten_obsidian", "Molten Obsidian", 1000, "stone", 0x2c0d59);
MoltenLiquid.createAndRegister("molten_clay", "Molten Clay", 700, "stone", 0xc67453);
MoltenLiquid.createAndRegister("molten_dirt", "Liquid Dirt", 500, "stone", 0xa68564);
MoltenLiquid.createAndRegister("molten_emerald", "Molten Emerald", 999, "metal", 0x58e78e);
MoltenLiquid.createAndRegister("molten_glass", "Molten Glass", 625, "metal", 0xc0f5fe);
MoltenLiquid.createAndRegister("blood", "Blood", 336, "other", 0x540000);
MoltenLiquid.createAndRegister("purpleslime", "Liquid Purple Slime", 520, "other", 0xa81212);
