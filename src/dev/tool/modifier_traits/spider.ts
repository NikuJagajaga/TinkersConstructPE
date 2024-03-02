class TraitSpider extends TconTrait {

    constructor(parent: TconModifier){
        super("spider", "Bane of Arthropods", parent);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return EntityHelper.isArthropods(victim) ? 7 / this.parent.maxLevel * level : 0;
    }
    
}
