abstract class TinkersTool implements ToolAPI.ToolParams {

    blockMaterials: {[key: string]: true};
    toolMaterial: ToolAPI.ToolMaterial;
    is3x3 = false;

    constructor(public blockTypes: string[], public partsCount: number, public brokenIndex: number, public isWeapon?: boolean){
    }

    miningSpeedModifier(): number {
        return 1;
    }

    damagePotential(): number {
        return 1;
    }

    abstract getTexture(): ToolTexture;

    getRepairParts(): number[] {
        return [1]; //head
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
        else{
            this.toolMaterial.level = 0;
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
                mod.onDestroy(item, coords, block, 0, level);
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
            bonus += mod.onAttack(item, victim, 0, level);
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
                    mod.onDestroy(item, {...c, side: coords.side, relative: World.getRelativeCoords(c.x, c.y, c.z, coords.side)}, block2, 0, level)
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

/*
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
*/

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