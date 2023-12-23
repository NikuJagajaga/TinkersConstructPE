class TconToolStack implements ItemInstance {

    id: number;
    count: number;
    data: number;
    extra: ItemExtraData;

    readonly instance: TconTool;
    readonly materials: TinkersMaterial[];
    readonly modifiers: {[key: string]: number};
    readonly stats: ToolAPI.ToolMaterial;

    constructor(item: ItemInstance){

        this.id = item.id;
        this.count = item.count;
        this.data = item.data;
        this.extra = item.extra || null;

        this.instance = ItemRegistry.getInstanceOf(this.id) as TconTool;
        this.materials = new String(this.extra.getString("materials")).split("_").map(mat => Material[mat]);
        this.modifiers = TinkersModifierHandler.decodeToObj(this.extra.getString("modifiers"));
        this.stats = this.getStats();

    }

    get durability(): number {
        return this.extra.getInt("durability", 0);
    }

    set durability(value: number) {
        const dur = Math.min(Math.max(0, value), this.stats.durability);
        this.extra.putInt("durability", dur);
        this.data = Math.ceil(dur / this.stats.durability * this.instance.maxDamage);
    }

    get xp(): number {
        return this.extra.getInt("xp", 0);
    }

    get repairCount(): number {
        return this.extra.getInt("repair", 0);
    }

    applyToHand(player: number): void {
        Entity.setCarriedItem(player, this.id, this.count, this.data, this.extra);
    }

    getBaseStats(): ToolStats {
        const stats = new ToolStats();
        this.instance.buildStats(stats, this.materials);
        return stats;
    }

    private getStats(): ToolAPI.ToolMaterial {
        const stats = this.getBaseStats();
        stats.speed *= this.instance.miningSpeedModifier;
        stats.attack *= this.instance.damagePotential;
        this.forEachModifiers((mod, level) => {
            mod.applyStats(stats, level);
        });
        return stats.getToolMaterial();
    }

    forEachModifiers(func: (mod: TinkersModifier, level: number) => void): void {
        for(let key in this.modifiers){
            Modifier[key] && func(Modifier[key], this.modifiers[key]);
        }
    }

    isBroken(): boolean {
        return this.durability >= this.stats.durability;
    }

    consumeDurability(value: number): void {

        let cancel = false;
        let consume = 0;

        for(let i = 0; i < value; i++){
            cancel = false;
            this.forEachModifiers((mod, level) => {
                if(mod.onConsume(level)) cancel = true;
            });
            if(!cancel) consume++;
        }

        this.durability += consume;
        
    }

    addXp(val: number): void {
        const xp = this.xp;
        const oldLv = ToolLeveling.getLevel(xp, this.instance.is3x3);
        const newLv = ToolLeveling.getLevel(xp + val, this.instance.is3x3);
        this.extra.putInt("xp", xp + val);
        if(oldLv < newLv){
            Game.message("§3" + ToolLeveling.getLevelupMessage(newLv, Item.getName(this.id, this.data)));
            SoundManager.playSound("tcon.levelup.ogg");
        }
    }

    uniqueKey(): string {
        const hash = this.materials.reduce((value, material) => 31 * value + material.getTexIndex(), 0);
        let mask = 0;
        for(let key in this.modifiers){
            mask |= 1 << Modifier[key].getTexIndex();
        }
        return this.id + ":" + hash.toString(16) + ":" + mask.toString(16);
    }

    clone(): TconToolStack {
        return new TconToolStack({id: this.id, count: this.count, data: this.data, extra: this.extra.copy()});
    }

}
