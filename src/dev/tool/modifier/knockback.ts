class ModKnockback extends TinkersModifier {

    constructor(){
        super("knockback", "Knockback", 12, [VanillaBlockID.piston], 10, true);
    }

    onAttack(item: ItemInstance, victim: number, level: number): number {
        const vec = Entity.getLookVector(player);
        const speed = 1 + level * 0.1;
        Entity.setVelocity(victim, vec.x * speed, vec.y, vec.z * speed);
        return 0;
    }
    
}