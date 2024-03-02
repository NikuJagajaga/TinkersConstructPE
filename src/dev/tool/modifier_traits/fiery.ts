class TraitFiery extends TconTrait {

    constructor(parent: TconModifier){
        super("fiery", "Fiery", parent);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.setFire(victim, 1 + (level >> 3), true);
        return 0;
    }
    
}
