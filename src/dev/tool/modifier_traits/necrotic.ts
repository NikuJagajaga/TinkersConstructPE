class TraitNecrotic extends TconTrait {

    constructor(parent: TconModifier){
        super("necrotic", "Necrotic", parent);
    }

    override onDealDamage(stack: TconToolStack, victim: number, player: number, damageValue: number, damageType: number, level: number): void {
        const add = damageValue * 0.1 * level | 0;
        if(add > 0){
            Entity.setHealth(player, Math.min(Entity.getHealth(player) + add, Entity.getMaxHealth(player)));
        }
    }
    
}
