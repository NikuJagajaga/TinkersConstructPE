class ModFiery extends TinkersModifier {

    constructor(){
        super("fiery", "Fiery", 25, true);
        this.texIndex = 10;
        this.setRecipe(["blaze_powder"]);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.setFire(victim, 1 + (level >> 3), true);
        return 0;
    }
    
}
