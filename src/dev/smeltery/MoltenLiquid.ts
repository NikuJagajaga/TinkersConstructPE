class MoltenLiquid {

    private static readonly baseTex = {
        metal: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_metal.png"),
        stone: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_stone.png"),
        other: FileTools.ReadImage(__dir__ + "texture-source/liquid/molten_other.png"),
        bucket: FileTools.ReadImage(__dir__ + "texture-source/liquid/bucket.png")
    };

    private static liquidCount: number = 0;
    private static data: {[key: string]: {y: number, bmp: android.graphics.Bitmap, temp: number}} = {};

    static getTexScale(): {width: number, height: number} {
        return {width: 64, height: this.liquidCount * 32};
    }

    static create(key: string, name: string, color: string, type: "metal" | "stone" | "other" = "metal"): void {

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

    static register(key: string, temp: number): void {
        if(temp < 300){
            return;
        }
        this.data[key] = {y: this.liquidCount * 32, bmp: LiquidRegistry.getLiquidUIBitmap(key, 16, 16), temp: temp - 300};
        this.liquidCount++;
    }

    static createAndRegister(key: string, name: string, temp: number, color: string, type: "metal" | "stone" | "other" = "metal"): void {
        this.create(key, name, color, type);
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

    static setup(): void {

        const path = __dir__ + "res/model/tcon_liquids.png";
        const scale = this.getTexScale();
        const bitmap = new Bitmap.createBitmap(scale.width, scale.height, Bitmap.Config.ARGB_8888);
        const canvas = new Canvas(bitmap);
        let i = 0;
        for(let key in this.data){
            for(i = 0; i < 8; i++){
                canvas.drawBitmap(this.data[key].bmp, (i & 3) << 4, (i >> 2 << 4) + this.data[key].y, null);
            }
        }
        const file = new java.io.File(path);
        file.getParentFile().mkdirs();
        file.createNewFile();
        FileTools.WriteImage(path, bitmap);

        const liquids = Object.keys(this.data).filter(liq => liq !== "water" && liq !== "lava" && liq !== "milk");
        const id = createItem("tcon_bucket", "Tinkers Bucket", {name: "bucket"}, {isTech: true});
        Item.registerNameOverrideFunction(id, item => LiquidRegistry.getLiquidName(liquids[item.data]) + " Bucket");
        Item.registerIconOverrideFunction(id, item => ({name: "tcon_bucket_" + liquids[item.data]}));
        liquids.forEach((liq, i) => {
            LiquidRegistry.registerItem(liq, {id: VanillaItemID.bucket, data: 0}, {id: id, data: i});
        });

    }

    static initAnim(tile: any, posX: number, posY: number, posZ: number, scaleX: number, scaleY: number, scaleZ: number, useThread?: boolean): void {
        if(useThread){
            tile.liquidStorage.setAmount = (liquid: string, amount: number) => {
                tile.liquidStorage.liquidAmounts[liquid] = amount;
                this.updateAnimInThread(tile);
            };
        }
        tile.render = new Render();
        tile.anim = new Animation.Base(tile.x + posX, tile.y + posY - 1.5, tile.z + posZ);
        tile.anim.height = 0;
        tile.anim.scaleX = scaleX;
        tile.anim.scaleY = scaleY;
        tile.anim.scaleZ = scaleZ;
        tile.anim.describe({render: tile.render.getID(), skin: "model/tcon_liquids.png"});
        tile.anim.load();
        tile.anim.setSkylightMode();
        const stored = tile.liquidStorage.getLiquidStored();
        if(stored){
            tile.anim.height = tile.liquidStorage.getRelativeAmount(stored);
            tile.render.setPart("head", [{
                type: "box",
                uv: {x: 0, y: this.getY(stored)},
                coords: {x: 0, y: -tile.anim.height * 16 * scaleY / 2, z: 0},
                size: {x: 16 * scaleX, y: 16 * scaleY * tile.anim.height, z: 16 * scaleZ}
            }], this.getTexScale());
            tile.anim.refresh();
        }
    }

    static updateAnim(tile: any): boolean {
        const stored = tile.liquidStorage.getLiquidStored();
        const add = (tile.liquidStorage.getRelativeAmount(stored) - tile.anim.height) * 0.2;
        const box = [];
        let needRefresh = false;
        if(stored){
            if(Math.abs(add) > 0.01){
                tile.anim.height += add;
                tile.anim.height = Math.round(tile.anim.height * 100) / 100;
                box.push({
                    type: "box",
                    uv: {x: 0, y: this.getY(stored)},
                    coords: {x: 0, y: -tile.anim.height * 16 * tile.anim.scaleY / 2, z: 0},
                    size: {x: 16 * tile.anim.scaleX, y: 16 * tile.anim.scaleY * tile.anim.height, z: 16 * tile.anim.scaleZ}
                });
                needRefresh = true;
            }
        }
        else if(tile.anim.height !== 0){
            tile.anim.height = 0;
            needRefresh = true;
        }
        if(needRefresh){
            tile.render.setPart("head", box, this.getTexScale());
            tile.anim.refresh();
        }
        return needRefresh;
    }

    static updateAnimInThread(tile: any): void {
        const threadName = "tcon_liqanim_" + tile.x + ":" + tile.y + ":" + tile.z;
        const thread = Threading.getThread(threadName);
        if(thread && thread.isAlive()){
            return;
        }
        Threading.initThread(threadName, () => {
            let stored: string;
            let diff: number;
            let box: any[];
            let needRefresh: boolean;
            while(tile.isLoaded){
                stored = tile.liquidStorage.getLiquidStored();
                diff = tile.liquidStorage.getRelativeAmount(stored) - tile.anim.height;
                box = [];
                needRefresh = false;
                if(stored){
                    tile.anim.height += diff * 0.1;
                    tile.anim.height = Math.round(tile.anim.height * 1000) / 1000;
                    if(Math.abs(diff) > 0.01){
                        box = [{
                            type: "box",
                            uv: {x: 0, y: this.getY(stored)},
                            coords: {x: 0, y: -tile.anim.height * 16 * tile.anim.scaleY / 2, z: 0},
                            size: {x: 16 * tile.anim.scaleX, y: 16 * tile.anim.scaleY * tile.anim.height, z: 16 * tile.anim.scaleZ}
                        }];
                        needRefresh = true;
                    }
                }
                else if(tile.anim.height !== 0){
                    tile.anim.height = 0;
                    needRefresh = true;
                }
                if(needRefresh){
                    tile.render.setPart("head", box, this.getTexScale());
                    tile.anim.refresh();
                }
                else{
                    break;
                }
                Thread.sleep(20);
            }
        });
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


Callback.addCallback("PostLoaded", () => {
    MoltenLiquid.setup();
});