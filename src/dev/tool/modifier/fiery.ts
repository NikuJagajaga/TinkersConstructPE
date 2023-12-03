class ModFiery extends TinkersModifier {

    constructor(){
        super("fiery", "Fiery", 10, ["blaze_powder"], 25, true);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.setFire(victim, 1 + (level >> 3), true);
        return 0;
    }
    
}