class ToolData {

    toolData: TinkersTool;
    materials: string[];
    modifiers: {[key: string]: number};
    stats: ToolAPI.ToolMaterial;

    constructor(private item: ItemInstance){
        this.init();
    }

    private init(): void {
        //this.toolData = ToolAPI.getToolData(this.item.id) as TinkersTool;
        this.toolData = TinkersToolHandler.getToolData(this.item.id);
        this.materials = new String(this.item.extra.getString("materials")).split("_");
        this.modifiers = TinkersModifierHandler.decodeToObj(this.item.extra.getString("modifiers"));
        this.stats = this.getStats();
    }

    applyHand(): void {
        const item = Player.getCarriedItem();
        if(item.id === this.item.id){
            Player.setCarriedItem(this.item.id, this.item.count, this.item.data, this.item.extra);
        }
    }

    getBaseStats(): ToolStats {
        for(let i = 0; i < this.materials.length; i++){
            if(!Material[this.materials[i]]){
                return null;
            }
        }
        return this.toolData.buildStats(this.materials);
    }

    getStats(): ToolAPI.ToolMaterial {
        const stats = this.getBaseStats();
        stats.speed *= this.toolData.miningSpeedModifier();
        stats.attack *= this.toolData.damagePotential();
        this.forEachModifiers((mod, level) => {
            mod.applyStats(stats, level);
        });
        return stats.getToolMaterial();
    }

    isBroken(): boolean {
        return this.item.extra.getInt("durability") >= this.stats.durability;
    }

    setDurability(val: number): void {
        const dur = Math.min(Math.max(0, val), this.stats.durability);
        this.item.extra.putInt("durability", dur);
        this.item.data = Math.ceil(dur / this.stats.durability * 14);
    }

    consumeDurability(val: number): void {
        for(let mod in this.modifiers){
            if(Modifier[mod].onConsume(this.modifiers[mod])){
                return;
            }
        }
        this.setDurability(this.item.extra.getInt("durability") + val);
    }

    addXp(val: number): void {
        const oldLv = this.getLevel();
        this.item.extra.putInt("xp", this.item.extra.getInt("xp") + val);
        const newLv = this.getLevel();
        if(oldLv < newLv){
            Game.message("§3" + this.getLevelupMessage(newLv));
            //SoundManager.startPlaySound(SourceType.ENTITY, player, "saw.ogg", 0.5);
        }
    }

    getLevel(): number {
        const xp = this.item.extra.getInt("xp");
        let total = 0;
        let next = Cfg.toolLeveling.baseXp;
        let lv = 0;
        if(this.toolData.is3x3){
            next *= 9;
        }
        while(total + next <= xp){
            total += next;
            next *= Cfg.toolLeveling.multiplier;
            lv++;
        }
        return lv;
    }

    getLevelName(level?: number): string {
        const lv = level || this.getLevel();
        switch(lv){
            case 0: return "Clumsy";
            case 1: return "Comfortable";
            case 2: return "Accustomed";
            case 3: return "Adept";
            case 4: return "Expert";
            case 5: return "Master";
            case 6: return "Grandmaster";
            case 7: return "Heroic";
            case 8: return "Legendary";
            case 9: return "Godlike";
        }
        if(lv < 19) return "Awesome";
        if(lv < 42) return "MoxieGrrl";
        if(lv < 66) return "boni";
        if(lv < 99) return "Jadedcat";
        return "Hacker";
    }

    getLevelupMessage(lv: number): string {
        const name = Item.getName(this.item.id, this.item.data);
        switch(lv){
            case 1: return `You begin to feel comfortable handling the ${name}`;
            case 2: return `You are now accustomed to the weight of the ${name}`;
            case 3: return `You have become adept at handling the ${name}`;
            case 4: return `You are now an expert at using the ${name} !`;
            case 5: return `You have mastered the ${name}!`;
            case 6: return `You have grandmastered the ${name}!`;
            case 7: return `You feel like you could fulfill mighty deeds with your ${name}!`;
            case 8: return `You and your ${name} are living legends!`;
            case 9: return `No god could stand in the way of you and your ${name}!`;
            case 10: return `Your ${name} is pure awesome.`;
            default: return `Your ${name} has reached level ${lv}`;
        }
    }

    getName(name: string): string {
        const head = Material[this.materials[1]].getName();
        if(this.isBroken()){
            return `Broken ${head} ${name}`;
        }
        const xp = this.item.extra.getInt("xp");
        let total = 0;
        let next = Cfg.toolLeveling.baseXp;
        if(this.toolData.is3x3){
            next *= 9;
        }
        while(total + next <= xp){
            total += next;
            next *= Cfg.toolLeveling.multiplier;
        }
        return `${head} ${name}\n§7${this.stats.durability - this.item.extra.getInt("durability")} / ${this.stats.durability}\nLevel: ${this.getLevelName()}\nXP: ${xp - total} / ${next}`;
    }

    forEachModifiers(func: (mod: TinkersModifier, level: number) => void): void {
        for(let key in this.modifiers){
            Modifier[key] && func(Modifier[key], this.modifiers[key]);
        }
    }
    
    uniqueKey(): string {
        const hash = this.materials.reduce((a, v) => 31 * a + Material[v].getTexIndex(), 0);
        let mask = 0;
        for(let key in this.modifiers){
            mask |= 1 << Modifier[key].getTexIndex();
        }
        return this.item.id + ":" + hash.toString(16) + ":" + mask.toString(16);
    }

}


/*
(() => {

    const time = Debug.sysTime();

    const genHash = (o1: number, o2: number, o3: number, o4: number): number => {
        let result = 0;
        result = 31 * result + o1;
        result = 31 * result + o2;
        result = 31 * result + o3;
        result = 31 * result + o4;
        return result;
    };

    const cache = {};

    let hash: number;
    loop:
    for(let i = 0; i < 27; i++){
    for(let j = 0; j < 27; j++){
    for(let k = 0; k < 27; k++){
    for(let l = 0; l < 27; l++){
        hash = genHash(i, j, k, l);
        if(hash !== [i, j, k, l].reduce((current, v) => 31 * current + v, 0)){
            alert("chigauyo!!");
            break loop;
        }
        if(hash in cache){
            alert("break: " + hash);
            break loop;
        }
        else{
            cache[hash] = true;
        }
    }
    }
    }
    }

    alert("finish: " + (Debug.sysTime() - time) + "ms");

})();
*/