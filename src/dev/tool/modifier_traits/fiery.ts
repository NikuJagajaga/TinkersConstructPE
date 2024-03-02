const TraitFiery = new class extends TconTrait {

    constructor(){
        super("fiery", "Fiery", "#ea9e32");
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.setFire(victim, 1 + (level >> 3), true);
        return 0;
    }
    
}
