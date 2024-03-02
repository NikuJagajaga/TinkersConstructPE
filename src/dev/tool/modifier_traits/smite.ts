class TraitSmite extends TconTrait {

    constructor(parent: TconModifier){
        super("smite", "Smite", parent);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return EntityHelper.isUndead(victim) ? 7 / this.parent.maxLevel * level : 0;
    }

}
