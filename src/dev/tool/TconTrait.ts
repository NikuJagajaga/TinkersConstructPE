abstract class TconTrait {

    abstract readonly key: string;
    abstract readonly name: string;
    parent: TconModifier;

    setParent(modifier: TconModifier): void {
        this.parent = modifier;
    }

    getLocalizedName(): string {
        return translate(this.name);
    }

    getBonusSlots(level: number): number {
        return level;
    }

    applyStats(stats: ToolStats, level: number): void {}
    applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {}

    onDestroy(stack: TconToolStack, coords: Callback.ItemUseCoordinates, block: Tile, player: number, level: number): void {}

    onAttack(stack: TconToolStack, victim: number, player: number, level: number): number {
        return 0;
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


const Trait: {[key: string]: TconTrait} = {
    
};
