const TraitKnockback = new class extends TconTrait {

    constructor(){
        super("knockback", "Knockback", "#9f9f9f");
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        const vec = Entity.getLookVector(player);
        const speed = 1 + level * 0.1;
        Entity.setVelocity(victim, vec.x * speed, 0.1, vec.z * speed);
        return 0;
    }
    
}
