const TraitSmite = new class extends TconTrait {

    constructor(){
        super("smite", "Smite", "#e8d500");
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return EntityHelper.isUndead(victim) ? 7 / this.parent.maxLevel * level : 0;
    }

}
