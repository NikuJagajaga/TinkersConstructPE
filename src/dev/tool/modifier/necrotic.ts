createItem("tcon_necrotic_bone", "Necrotic Bone");


class ModNecrotic extends TinkersModifier {

    constructor(){
        super("necrotic", "Necrotic", 11, [ItemID.tcon_necrotic_bone], 1, true);
    }

    override onDealDamage(victim: number, player: number, damageValue: number, damageType: number, level: number): void {
        const add = damageValue * 0.1 * level | 0;
        if(add > 0){
            Entity.setHealth(player, Math.min(Entity.getHealth(player) + add, Entity.getMaxHealth(player)));
        }
    }
    
}