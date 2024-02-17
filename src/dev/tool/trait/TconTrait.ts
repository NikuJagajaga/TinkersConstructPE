abstract class TconTrait {

    abstract readonly name: string;

    readonly level: number;

    constructor(level: number){
        this.level = level;
    }

    getLocalizedName(): string {
        return translate(this.name);
    }

    getBonusSlots(): number {
        return this.level;
    }

    applyStats(stats: ToolStats): void {}
    applyEnchant(enchant: ToolAPI.EnchantData): void {}

    onDestroy(stack: TconToolStack, coords: Callback.ItemUseCoordinates, block: Tile, player: number): void {}

    onAttack(stack: TconToolStack, victim: number, player: number): number {
        return 0;
    }

    onDealDamage(stack: TconToolStack, victim: number, player: number, damageValue: number, damageType: number): void {}
    onPlayerDamaged(stack: TconToolStack, victim: number, player: number, damageValue: number, damageType: number): void {}

    onKillEntity(stack: TconToolStack, victim: number, player: number, damageType: number): void {}
    onPlayerDeath(stack: TconToolStack, victim: number, player: number, damageType: number): void {}

    onConsume(stack: TconToolStack, player: number): boolean {
        return false;
    }

    onTick(stack: TconToolStack, player: number): void {}

}
