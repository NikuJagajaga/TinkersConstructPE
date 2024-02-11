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
        this.extra = item.extra;

        this.instance = ToolAPI.getToolData(this.id) as TconTool;
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
        stats.efficiency *= this.instance.miningSpeedModifier;
        stats.damage *= this.instance.damagePotential;
        this.forEachModifiers((mod, level) => {
            mod.applyStats(stats, level);
        });
        const toolMaterial = stats.getToolMaterial();
        this.id = TconToolFactory.getToolId(this.instance.tconToolType, toolMaterial.level);
        return toolMaterial;
    }

    forEachModifiers(func: (mod: TinkersModifier, level: number) => void): void {
        for(let key in this.modifiers){
            Modifier[key] && func(Modifier[key], this.modifiers[key]);
        }
    }

    isBroken(): boolean {
        return this.durability >= this.stats.durability;
    }

    consumeDurability(value: number, player: number): void {

        let cancel = false;
        let consume = 0;

        for(let i = 0; i < value; i++){
            cancel = false;
            this.forEachModifiers((mod, level) => {
                if(mod.onConsume(level)) cancel = true;
            });
            if(!cancel) consume++;
        }

        let isBroken = this.isBroken();

        this.durability += consume;

        if(!isBroken && this.isBroken()){
            World.playSoundAtEntity(player, "random.break", 0.5);
        }
        
    }

    addXp(val: number, player: number): void {
        const xp = this.xp;
        const oldLv = ToolLeveling.getLevel(xp, this.instance.is3x3);
        const newLv = ToolLeveling.getLevel(xp + val, this.instance.is3x3);
        this.extra.putInt("xp", xp + val);
        if(oldLv < newLv){
            const client = Network.getClientForPlayer(player);
            BlockEngine.sendMessage(client, "§3", ToolLeveling.getLevelupMessage(newLv), Item.getName(this.id, this.data), "" + newLv);
            client?.send("tcon.playSound", {name: "tcon.levelup.ogg"});
        }
    }

    getModifierInfo(): {modifiers: {type: string, level: number}[], usedCount: number, maxCount: number} {
        const modifiers = TinkersModifierHandler.decodeToArray(this.extra.getString("modifiers"));
        let usedCount = 0;
        for(const mod of modifiers){
            usedCount += Modifier[mod.type].getConsumeSlots();
        }
        return {
            modifiers,
            usedCount,
            maxCount: Cfg.modifierSlots + ToolLeveling.getLevel(this.xp, this.instance.is3x3)
        };
    }

    uniqueKey(): string {
        const hash = this.materials.reduce((value, material) => 31 * value + material.getTexIndex(), 0);
        let mask = 0;
        let index = 0;
        for(let key in this.modifiers){
            index = Modifier[key].getTexIndex();
            if(index !== -1){
                mask |= 1 << index;
            }
        }
        return this.instance.tconToolType + ":" + hash.toString(16) + ":" + mask.toString(16);
    }

    getName(): string {
        const head: string = this.instance.repairParts
            .map(partIndex => this.materials[partIndex].getLocalizedName())
            .filter((material, index, arr) => arr.indexOf(material) === index) // remove duplicates
            .join("-");
        let toolName = head + " " + translate(this.instance.name);
        if(this.isBroken()){
            toolName = translate("Broken %s", toolName);
        }
        return toolName;
    }

    getTooltips(): string[] {
        const lvInfo = ToolLeveling.getLevelInfo(this.xp, this.instance.is3x3);
        return [
            "§7" + translate("Durability: ") + (this.stats.durability - this.durability) + " / " + this.stats.durability,
            translate("Level: ") + ToolLeveling.getLocalizedLevelName(lvInfo.level),
            translate("XP: ") + lvInfo.currentXp + " / " + lvInfo.next
        ];
    }

    clone(): TconToolStack {
        return new TconToolStack({id: this.id, count: this.count, data: this.data, extra: this.extra.copy()});
    }

}
