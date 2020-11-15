const Modifier: {[key: string]: TinkersModifier} = {
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


class TinkersToolHandler {

    private static tools: {[key: number]: true} = {};

    static registerTool(key: string, name: string, toolData: TinkersTool): void {
        const id = createItem("tcontool_" + key, name, {name: "tcontool_" + key}, {stack: 1, isTech: true});
        Item.setMaxDamage(id, 14);
        ToolLib.setTool(id, {durability: 0, level: 0, efficiency: 0, damage: 0}, toolData);
        Item.registerNameOverrideFunction(id, (item, name) => {
            try{
                if(!item.extra){
                    return "Invalid Tool";
                }
                const toolData = new ToolData(item);
                return toolData.getName(name);
            }
            catch(e){
                alert("nameError: " + e);
            }
        });
        ItemModel.getFor(id, -1).setModelOverrideCallback(item => {
            try{
                if(!item.extra){
                    return null;
                }
                const toolData = new ToolData(item);
                const texture = toolData.toolData.getTexture();
                const path = texture.getPath();
                const mesh = this.getMesh(item)[toolData.isBroken() ? "broken" : "normal"];
                toolData.toolData.model.setModel(mesh.hand, path);
                toolData.toolData.model.setUiModel(mesh.ui, path);
                toolData.toolData.model.setSpriteUiRender(true);
                return toolData.toolData.model;
            }
            catch(e){
                alert("iconError: " + e);
            }
        });
        this.tools[id] = true;
    }

    static isTool(id: number): boolean {
        return this.tools[id] || false;
    }

    private static meshes = {};

    private static getMesh(item: ItemInstance): {normal: {hand: any, ui: any}, broken: {hand: any, ui: any}} {
        const materials = new String(item.extra.getString("materials")).split("_");
        const modifiers = TinkersModifierHandler.decodeToObj(item.extra.getString("modifiers"));
        const code = [...materials, ...Object.keys(modifiers)].join("_");
        if(this.meshes[code]){
            return this.meshes[code];
        }
        const toolData: TinkersToolParams = ToolAPI.getToolData(item.id);
        const texture = toolData.getTexture();
        const mesh = [new RenderMesh(), new RenderMesh(), new RenderMesh(), new RenderMesh()];
        const coordsNormal: {x: number, y: number}[] = [];
        const coordsBroken: {x: number, y: number}[] = [];
        let index: number;
        for(let i = 0; i < toolData.partsCount; i++){
            index = Material[materials[i]].getTexIndex();
            coordsNormal.push(texture.getCoords(i, index));
            coordsBroken.push(texture.getCoords(toolData.partsCount, index));
        }
        for(let key in modifiers){
            index = Modifier[key].getTexIndex();
            coordsNormal.push(texture.getModCoords(index));
            coordsBroken.push(texture.getModCoords(index));
        }
        mesh.forEach((m, i) => {
            const coords = i >> 1 ? coordsBroken : coordsNormal;
            let z: number;
            for(let j = 0; j < coords.length; j++){
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
            if((i & 1) === 0){
                m.translate(0.4, -0.1, 0.2);
                m.rotate(0.5, 0.5, 0.5, 0, -2.1, 0.4);
                m.scale(2, 2, 2);
            }
        });
        const data = {
            normal: {hand: mesh[0], ui: mesh[1]},
            broken: {hand: mesh[2], ui: mesh[3]}
        };
        this.meshes[code] = data;
        Game.message("[TCon]: Tool Model has been generated");
        return data;
    }

}


interface TinkersToolParams extends ToolAPI.ToolParams {
    [key: string]: any;
}

abstract class TinkersTool implements TinkersToolParams {

    blockMaterials: {[key: string]: true};
    toolMaterial: ToolAPI.ToolMaterial;
    is3x3 = false;
    model: any;

    constructor(public blockTypes: string[], public partsCount: number, public brokenIndex: number, public isWeapon?: boolean){
        this.model = ItemModel.newStandalone();
    }

    miningSpeedModifier(): number {
        return 1;
    }

    damagePotential(): number {
        return 1;
    }

    abstract getTexture(): ToolTexture;

    getRepairParts(): number[] {
        return [1];//head
    }

    getRepairModifierForPart(index: number): number {
        return 1;
    }

    abstract buildStats(materials: string[]): ToolStats;

    modifyEnchant(enchant: ToolAPI.EnchantData, item: ItemInstance, coords?: Callback.ItemUseCoordinates, block?: Tile): void {
        if(item.extra){
            const toolData = new ToolData(item);
            toolData.forEachModifiers((mod, level) => {
                mod.applyEnchant(enchant, level);
            });
        }
    }

    calcDestroyTime(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, time: {base: number, modifier: number}): number {
        if(!item.extra){
            return time.base;
        }
        const toolData = new ToolData(item);
        const blockData = ToolAPI.getBlockData(block.id);
        let devider = 1;
        if(this.blockMaterials[blockData.material.name] && toolData.stats.level >= blockData.level && !toolData.isBroken()){
            devider = toolData.stats.efficiency;
            if(blockData.isNative){
                devider *= blockData.material.multiplier;
            }
            this.toolMaterial.level = toolData.stats.level;
        }
        return time.base / devider / time.modifier;
    }

    onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile): true {
        if(!item.extra){
            return true;
        }
        const toolData = new ToolData(item);
        const blockData = ToolAPI.getBlockData(block.id);
        if(this.blockMaterials[blockData.material.name] && toolData.stats.level >= blockData.level && !toolData.isBroken()){
            toolData.forEachModifiers((mod, level) => {
                mod.onDestroy(item, coords, block, level);
            });
            toolData.consumeDurability(this.isWeapon ? 2 : 1);
            if(!this.isWeapon){
                toolData.addXp(1);
            }
        }
        return true;
    }

    onAttack(item: ItemInstance, victim: number): true {
        if(!item.extra){
            return true;
        }
        const toolData = new ToolData(item);
        let bonus = 0;
        toolData.forEachModifiers((mod, level) => {
            bonus += mod.onAttack(item, victim, level);
        });
        this.toolMaterial.damage = toolData.stats.damage + bonus;
        toolData.consumeDurability(this.isWeapon ? 1 : 2);
        this.isWeapon && toolData.addXp(1);
        return true;
    }

    onDealDamage(item: ItemInstance, victim: number, damageValue: number, damageType: number): void {
        if(!item.extra){
            return;
        }
        const toolData = new ToolData(item);
        toolData.forEachModifiers((mod, level) => {
            mod.onDealDamage(victim, damageValue, damageType, level);
        });
    }

    onKillEntity(item: ItemInstance, entity: number, damageType: number): void {
        if(!item.extra){
            return;
        }
        const toolData = new ToolData(item);
        toolData.forEachModifiers((mod, level) => {
            mod.onKillEntity(entity, damageType, level);
        });
    }

    onBroke(item: ItemInstance): boolean {
        return true;
    }

    onMending(item: ItemInstance): void {
        if(!item.extra){
            return;
        }
        const toolData = new ToolData(item);
        let add = 0;
        toolData.forEachModifiers((mod, level) => {
            add += mod.onMending(level);
        });
        toolData.setDurability(item.extra.getInt("durability") - add);
    }

}


abstract class TinkersTool3x3 extends TinkersTool {

    is3x3 = true;

    onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile): true {

        if(!item.extra){
            return true;
        }

        const toolData = new ToolData(item);
        const vec: string[] = [["x", "z"], ["x", "y"], ["y", "z"]][coords.side >> 1];
        const c: Vector = {x: coords.x, y: coords.y, z: coords.z};
        let i: number;
        let j: number;
        let block2: Tile;
        let damage = 0;
        for(i = -1; i <= 1; i++){
        for(j = -1; j <= 1; j++){
            if(i === 0 && j === 0){
                continue;
            }
            c[vec[0]] = coords[vec[0]] + i;
            c[vec[1]] = coords[vec[1]] + j;
            block2 = World.getBlock(c.x, c.y, c.z);
            if(this.blockMaterials[ToolAPI.getBlockMaterialName(block2.id)]){
                World.destroyBlock(c.x, c.y, c.z, true);
                toolData.forEachModifiers((mod, level) => {
                    mod.onDestroy(item, {...c, side: coords.side, relative: World.getRelativeCoords(c.x, c.y, c.z, coords.side)}, block2, level)
                });
                damage++;
            }
        }
        }

        toolData.consumeDurability(damage);
        toolData.addXp(damage);
        return true;

    }

}


Callback.addCallback("LevelLoaded", () => {
    Updatable.addUpdatable({
        update: () => {
            if(World.getThreadTime() % 150 === 0){
                const item = Player.getCarriedItem();
                const toolData = ToolAPI.getToolData(item.id);
                toolData && toolData.onMending && toolData.onMending(item);
            }
        }
    });
});

Callback.addCallback("EntityHurt", (attacker: number, victim: number, damageValue: number, damageType: number) => {
    if(attacker === player){
        const item = Player.getCarriedItem();
        const toolData = ToolAPI.getToolData(item.id);
        toolData && toolData.onDealDamage && toolData.onDealDamage(item, victim, damageValue, damageType);
    }
});

Callback.addCallback("EntityDeath", (entity: number, attacker: number, damageType: number) => {
    if(attacker === player){
        const item = Player.getCarriedItem();
        const toolData = ToolAPI.getToolData(item.id);
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