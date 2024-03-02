const TraitSpider = new class extends TconTrait {

    constructor(){
        super("spider", "Bane of Arthropods", "#61ba49");
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return EntityHelper.isArthropods(victim) ? 7 / this.parent.maxLevel * level : 0;
    }
    
}
