abstract class TconTool extends ItemCommon implements ItemBehavior, ToolAPI.ToolParams {

    tconToolType: string;
    blockTypes: string[];
    isWeapon: boolean;
    is3x3: boolean;
    miningSpeedModifier: number;
    damagePotential: number;
    repairParts: number[];
    texture: ToolTexture;

    toolMaterial: ToolAPI.ToolMaterial;

    constructor(stringID: string, name: string, icon: string){

        super(stringID, name, icon, false);

        this.tconToolType = stringID;
        this.isWeapon = false;
        this.is3x3 = false;
        this.miningSpeedModifier = 1.0;
        this.damagePotential = 1.0;
        this.repairParts = [1]; //head

        this.setHandEquipped(true);
        this.setMaxStack(1);
        this.setMaxDamage(13);
        this.setCategory(EItemCategory.TOOL);

        for(let i = 0; i <= this.maxDamage; i++){
            ItemModel.getFor(this.id, i).setModelOverrideCallback(item => ToolModelManager.getModel(item));
        }

    }

    setToolParams(miningLevel: number): void {
        ToolAPI.registerTool(this.id, {level: miningLevel, durability: this.maxDamage}, this.blockTypes || [], this);
        TconToolFactory.registerTool(this.id, this.tconToolType, miningLevel);
    }

    abstract buildStats(stats: ToolStats, materials: TinkersMaterial[]): void;

    getRepairModifierForPart(index: number): number {
        return 1.0;
    }

    onBroke(item: ItemInstance): true {
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
        if(blockData?.material && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()){
            devider = stack.stats.efficiency;
            if(blockData.isNative){
                devider *= blockData.material.multiplier;
            }
        }
        return time.base / devider / time.modifier;
    }

    onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number): boolean {
        if(!item.extra){
            return true;
        }
        const stack = new TconToolStack(item);
        const blockData = ToolAPI.getBlockData(block.id);
        //KEX compatibility (ToolAPI.getBlockData will NOT be null)
        if(blockData?.material && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()){
            stack.forEachModifiers((mod, level) => {
                mod.onDestroy(item, coords, block, player, level);
            });
            if(this.isWeapon){
                stack.consumeDurability(2, player);
            }
            else{
                stack.consumeDurability(1, player);
                stack.addXp(1, player);
            }
            item.data = stack.data; //setCarriedItem in ToolAPI.destroyBlockHook
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
            stack.consumeDurability(1, player);
            stack.addXp(1, player);
        }
        else{
            stack.consumeDurability(2, player);
        }
        item.data = stack.data; //setCarriedItem in ToolAPI.playerAttackHook
        return true;
    }

    //KEX compatibility
    getAttackDamageBonus(item: ItemInstance, attacker: number, victim: number): number {
        if(!item.extra){
            return 0;
        }
        const stack = new TconToolStack(item);
        let bonus = 0;
        if(attacker !== 0 && victim !== 0){
            stack.forEachModifiers((mod, level) => {
                bonus += mod.onAttack(item, victim, attacker, level);
            });
        }
        return stack.stats.damage + bonus;
    }

    onDealDamage(item: ItemInstance, victim: number, player: number, damageValue: number, damageType: number): void {
        if(!item.extra){
            return;
        }
        const stack = new TconToolStack(item);
        stack.forEachModifiers((mod, level) => {
            mod.onDealDamage(victim, player, damageValue, damageType, level);
        });
    }

    onPlayerDamaged(item: ItemInstance, victim: number, player: number, damageValue: number, damageType: number): void {
        if(!item.extra){
            return;
        }
        const stack = new TconToolStack(item);
        stack.forEachModifiers((mod, level) => {
            mod.onPlayerDamaged(victim, player, damageValue, damageType, level);
        });
    }

    onKillEntity(item: ItemInstance, victim: number, player: number, damageType: number): void {
        if(!item.extra){
            return;
        }
        const stack = new TconToolStack(item);
        stack.forEachModifiers((mod, level) => {
            mod.onKillEntity(victim, player, damageType, level);
        });
    }

    onPlayerDeath(item: ItemInstance, victim: number, player: number, damageType: number): void {
        if(!item.extra){
            return;
        }
        const stack = new TconToolStack(item);
        stack.forEachModifiers((mod, level) => {
            mod.onPlayerDeath(victim, player, damageType, level);
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
            stack.applyToHand(player);
        }
        
    }

}


abstract class TconTool3x3 extends TconTool {

    constructor(stringID: string, name: string, icon: string){
        super(stringID, name, icon);
        this.is3x3 = true;
    }

    override onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number): true {

        if(!item.extra){
            return true;
        }

        const stack = new TconToolStack(item);

        if(stack.isBroken()){
            return true;
        }

        const region = WorldRegion.getForActor(player);
        const pos = new Vector3(0, 0, 0);
        const radius: Vector = {x: 1, y: 1, z: 1};

        switch(coords.side >> 1){
            case 0: radius.y = 0; break;
            case 1: radius.z = 0; break;
            case 2: radius.x = 0; break;
        }

        let blockData: ToolAPI.BlockData;
        let block2: Tile;
        let consume = 0;

        for(let x = -radius.x; x <= radius.x; x++){
        for(let y = -radius.y; y <= radius.y; y++){
        for(let z = -radius.z; z <= radius.z; z++){
            if(x === 0 && y === 0 && z === 0) continue;
            pos.set(coords);
            pos.add(x, y, z);
            block2 = region.getBlock(pos);
            blockData = ToolAPI.getBlockData(block2.id);
            if(blockData?.material && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level){
                region.destroyBlock(pos, true, player);
                consume++;
                stack.forEachModifiers((mod, level) => {
                    mod.onDestroy(item, {x: pos.x, y: pos.y, z: pos.z, side: coords.side, relative: World.getRelativeCoords(pos.x, pos.y, pos.z, coords.side)}, block2, player, level);
                });
            }
        }
        }
        }

        blockData = ToolAPI.getBlockData(block.id);

        if(blockData?.material && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level){
            consume++;
            stack.forEachModifiers((mod, level) => {
                mod.onDestroy(item, coords, block, player, level);
            });
        }

        stack.consumeDurability(consume, player);
        stack.addXp(consume, player);
        item.data = stack.data;

        return true;
        
    }

}


Callback.addCallback("EntityHurt", (attacker: number, victim: number, damageValue: number, damageType: number) => {
    if(EntityHelper.isPlayer(attacker)){
        const item = Entity.getCarriedItem(attacker);
        const tool = ToolAPI.getToolData(item.id) as TconTool;
        tool?.onDealDamage(item, victim, attacker, damageValue, damageType);
    }
    if(EntityHelper.isPlayer(victim)){
        const item = Entity.getCarriedItem(attacker);
        const tool = ToolAPI.getToolData(item.id) as TconTool;
        tool?.onPlayerDamaged(item, victim, attacker, damageValue, damageType);
    }
});

Callback.addCallback("EntityDeath", (entity: number, attacker: number, damageType: number) => {
    if(EntityHelper.isPlayer(attacker)){
        const item = Entity.getCarriedItem(attacker);
        const tool = ToolAPI.getToolData(item.id) as TconTool;
        tool?.onKillEntity(item, entity, attacker, damageType);
    }
    if(EntityHelper.isPlayer(entity)){
        const item = Entity.getCarriedItem(attacker);
        const tool = ToolAPI.getToolData(item.id) as TconTool;
        tool?.onPlayerDeath(item, entity, attacker, damageType);
    }
});

Callback.addCallback("LocalTick", () => {
    if(World.getThreadTime() % 150 === 0){
        const item = Player.getCarriedItem();
        const tool = ToolAPI.getToolData(item.id) as TconTool;
        tool?.onMending(item, Player.get());
    }
});
