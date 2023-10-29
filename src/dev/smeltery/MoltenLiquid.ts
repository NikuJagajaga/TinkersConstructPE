class MoltenLiquid {

    /*
    private static readonly baseTex = {
        metal: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_metal.png"),
        stone: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_stone.png"),
        other: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_other.png"),
        bucket: FileTools.ReadImage(__dir__ + "texture-source/liquid/bucket.png")
    };
    */

    private static liquidCount: number = 0;
    private static data: {[key: string]: {y: number, bmp: android.graphics.Bitmap, temp: number}} = {};

    static getTexScale(): {width: number, height: number} {
        return {width: 64, height: this.liquidCount * 32};
    }
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
    static register(key: string, temp: number): void {
        if(temp < 300){
            return;
        }
        this.data[key] = {y: this.liquidCount * 32, bmp: LiquidRegistry.getLiquidUIBitmap(key, 16, 16), temp: temp - 300};
        this.liquidCount++;
    }

    static createAndRegister(key: string, name: string, temp: number, color: string, type: "metal" | "stone" | "other" = "metal"): void {
        //this.create(key, name, color, type);
        LiquidRegistry.registerLiquid(key, name, ["liquid." + key]);
        
        const id = createItem("tcon_bucket_" + key, name + " Bucket");
        Item.addCreativeGroup("tcon_bucket", "TCon Buckets", [id]);
        LiquidRegistry.registerItem(key, {id: VanillaItemID.bucket, data: 0}, {id: id, data: 0});
        this.register(key, temp);
    }

    static isExist(key: string): boolean {
        return key in this.data;
    }

    static getY(key: string): number {
        return this.isExist(key) ? this.data[key].y : -1;
    }

    static getTemp(key: string): number {
        return this.isExist(key) ? this.data[key].temp : -1;
    }

}


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
