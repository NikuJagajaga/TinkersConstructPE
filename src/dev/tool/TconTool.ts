class TconTool extends ItemCommon implements ItemBehavior, ToolAPI.ToolParams {

    blockTypes: string[];
    isWeapon: boolean;
    is3x3: boolean;
    miningSpeedModifier: number;
    damagePotential: number;
    repairParts: number[];
    texture: ToolTexture;

    toolMaterial: ToolAPI.ToolMaterial;

    constructor(stringID: string, name: string, icon: string){

        super(stringID, name, icon, true);

        this.isWeapon = false;
        this.is3x3 = false;
        this.miningSpeedModifier = 1.0;
        this.damagePotential = 1.0;
        this.repairParts = [1]; //head

        this.setHandEquipped(true);
        this.setMaxStack(1);
        this.setMaxDamage(13);

        for(let i = 0; i <= this.maxDamage; i++){
            ItemModel.getFor(this.id, i).setModelOverrideCallback(item => this.onModelOverride(item));
        }

    }

    setToolParams(): void {
        ToolAPI.registerTool(this.id, {durability: this.maxDamage}, this.blockTypes || [], this);
    }

    buildStats(stats: ToolStats, materials: string[]): void {
    }

    getRepairModifierForPart(index: number): number {
        return 1.0;
    }

    onModelOverride(item: ItemInstance): ItemModel {
        return ToolModelManager.getModel(item);
    }

    onNameOverride(item: ItemInstance, translation: string, name: string): string {
        if(item.extra){
            const stack = new TconToolStack(item);
            const head = Material[stack.materials[1]].getName();
            if(stack.isBroken()){
                return `Broken ${head} ${name}`;
            }
            const lvInfo = ToolLeveling.getLevelInfo(stack.xp, this.is3x3);
            return `${head} ${name}\n` +
                `§7${stack.stats.durability - stack.durability} / ${stack.stats.durability}\n` +
                `Level: ${ToolLeveling.getLevelName(lvInfo.level)}\n` +
                `XP: ${lvInfo.currentXp} / ${lvInfo.next}`;
        }
        return name;
    }

    onBroke(item: ItemInstance): boolean {
        return true;
    }

    modifyEnchant(enchant: ToolAPI.EnchantData, item: ItemInstance, coords?: Callback.ItemUseCoordinates, block?: Tile): void {
        if(item.extra){
            const stack = new TconToolStack(item);
            stack.forEachModifiers((mod, level) => {
                mod.applyEnchant(enchant, level);
            });
        }
    }

    calcDestroyTime(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, time: {base: number, devider: number, modifier: number}, defaultTime: number): number {
        if(!item.extra){
            return time.base;
        }
        const stack = new TconToolStack(item);
        const blockData = ToolAPI.getBlockData(block.id);
        let devider = 1;
        if(this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()){
            devider = stack.stats.efficiency;
            if(blockData.isNative){
                devider *= blockData.material.multiplier;
            }
            this.toolMaterial.level = stack.stats.level;
        }
        else{
            this.toolMaterial.level = 0;
        }
        return time.base / devider / time.modifier;
    }

    onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number): boolean {
        if(!item.extra){
            return true;
        }
        const stack = new TconToolStack(item);
        const blockData = ToolAPI.getBlockData(block.id);
        if(this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()){
            stack.forEachModifiers((mod, level) => {
                mod.onDestroy(item, coords, block, player, level);
            });
            if(this.isWeapon){
                stack.consumeDurability(2);
            }
            else{
                stack.consumeDurability(1);
                stack.addXp(1);
            }
            item.data = stack.data; //setCarriedItem by ToolAPI.destroyBlockHook
        }
        return true;
    }

    onAttack(item: ItemInstance, victim: number, player: number): boolean {
        if(!item.extra){
            return true;
        }
        const stack = new TconToolStack(item);
        let bonus = 0;
        stack.forEachModifiers((mod, level) => {
            bonus += mod.onAttack(item, victim, player, level);
        });
        this.toolMaterial.damage = stack.stats.damage + bonus;
        if(this.isWeapon){
            stack.consumeDurability(1);
            stack.addXp(1);
        }
        else{
            stack.consumeDurability(2);
        }
        item.data = stack.data; //setCarriedItem by ToolAPI.playerAttackHook
        return true;
    }

    onDealDamage(item: ItemInstance, victim: number, damageValue: number, damageType: number): void {
        if(!item.extra){
            return;
        }
        const stack = new TconToolStack(item);
        stack.forEachModifiers((mod, level) => {
            mod.onDealDamage(victim, damageValue, damageType, level);
        });
    }

    onKillEntity(item: ItemInstance, entity: number, damageType: number): void {
        if(!item.extra){
            return;
        }
        const stack = new TconToolStack(item);
        stack.forEachModifiers((mod, level) => {
            mod.onKillEntity(entity, damageType, level);
        });
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {

    }

    onMending(item: ItemInstance, player: number): void {
        if(!item.extra){
            return;
        }
        const stack = new TconToolStack(item);
        let add = 0;
        stack.forEachModifiers((mod, level) => {
            add += mod.onMending(level);
        });
        if(add > 0){
            stack.durability -= add;
            Entity.setCarriedItem(player, stack.id, 1, stack.data, stack.extra);
        }
        
    }

}


Callback.addCallback("EntityHurt", (attacker: number, victim: number, damageValue: number, damageType: number) => {
    if(EntityHelper.isPlayer(attacker)){
        const item = Entity.getCarriedItem(attacker);
        //const tool = ToolAPI.getToolData(item.id) as TconTool;
        const tool = ItemRegistry.getInstanceOf(this.id) as TconTool;
        tool?.onDealDamage(item, victim, damageValue, damageType);
    }
});

Callback.addCallback("EntityDeath", (entity: number, attacker: number, damageType: number) => {
    if(EntityHelper.isPlayer(attacker)){
        const item = Entity.getCarriedItem(attacker);
        //const tool = ToolAPI.getToolData(item.id) as TconTool;
        const tool = ItemRegistry.getInstanceOf(this.id) as TconTool;
        tool?.onKillEntity(item, entity, damageType);
    }
});

Callback.addCallback("LocalTick", () => {
    if(World.getThreadTime() % 150 === 0){
        const item = Player.getCarriedItem();
        //const tool = ToolAPI.getToolData(item.id) as TconTool;
        const tool = ItemRegistry.getInstanceOf(this.id) as TconTool;
        tool?.onMending(item, Player.get());
    }
});
