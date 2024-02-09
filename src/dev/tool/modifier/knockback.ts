class ModKnockback extends TinkersModifier {

    constructor(){
        super("knockback", "Knockback", 10, true);
        this.texIndex = 12;
        this.setRecipe([VanillaBlockID.piston]);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        const vec = Entity.getLookVector(player);
        const speed = 1 + level * 0.1;
        Entity.setVelocity(victim, vec.x * speed, 0.1, vec.z * speed);
        return 0;
    }
    
}
