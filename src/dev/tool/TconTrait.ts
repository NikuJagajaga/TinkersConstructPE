const Traits: {[key: string]: TconTrait} = {};


abstract class TconTrait {

    readonly key: string;
    readonly name: string;
    readonly color: number;
    readonly leveled: boolean = false;
    parent?: TconModifier;

    constructor(key: string, name: string, color?: string){
        this.key = key;
        this.name = name;
        this.color = color ? Color.parseColor(color) : Color.WHITE;
        this.leveled = false;
        Traits[key] = this;
    }

    setParent(modifier: TconModifier): void {
        this.parent = modifier;
    }

    getLocalizedName(level: number): string {
        let name = translate(this.name);
        let times = level;
        if(this.parent && this.parent.maxLevel > 1){
            times = Math.ceil(level / this.parent.maxLevel);
        }
        if(times > 1){
            name += "" + toRoman(times);
        }
        return name;
    }

    getBonusSlots(level: number): number {
        return 0;
    }

    getRepairModifier(value: number, level: number): number {
        return value;
    }

    applyStats(stats: ToolStats, level: number): void {}
    applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {}

    onDestroy(stack: TconToolStack, coords: Callback.ItemUseCoordinates, block: Tile, player: number, level: number): void {}

    onAttack(stack: TconToolStack, victim: number, player: number, baseDamage: number, damage: number, level: number): number {
        return damage;
    }

    onDealDamage(stack: TconToolStack, victim: number, player: number, damageValue: number, damageType: number, level: number): void {}
    onPlayerDamaged(stack: TconToolStack, victim: number, player: number, damageValue: number, damageType: number, level: number): void {}

    onKillEntity(stack: TconToolStack, victim: number, player: number, damageType: number, level: number): void {}
    onPlayerDeath(stack: TconToolStack, victim: number, player: number, damageType: number, level: number): void {}

    onConsume(stack: TconToolStack, level: number): boolean {
        return false;
    }

    onTick(stack: TconToolStack, player: number, level: number): void {}

}


abstract class TconTraitLeveled extends TconTrait {

    override readonly leveled: boolean = true;

    override getLocalizedName(level: number): string {
        let name = translate(this.name);
        let times = level;
        if(this.parent && this.parent.maxLevel > 1){
            times = Math.ceil(level / this.parent.maxLevel);
        }
        if(times > 1){
            name += "" + toRoman(times);
        }
        return name;
    }

}
