createItem("tcon_necrotic_bone", "Necrotic Bone");


class ModNecrotic extends TinkersModifier {

    constructor(){
        super("necrotic", "Necrotic", 1, true);
        this.texIndex = 11;
        this.setRecipe([ItemID.tcon_necrotic_bone]);
    }

    override onDealDamage(victim: number, player: number, damageValue: number, damageType: number, level: number): void {
        const add = damageValue * 0.1 * level | 0;
        if(add > 0){
            Entity.setHealth(player, Math.min(Entity.getHealth(player) + add, Entity.getMaxHealth(player)));
        }
    }
    
}

Callback.addCallback("EntityDeath", (entity, attacker, damageType) => {
    if(KEX){
        return;
    }
    if(Entity.getType(entity) === EEntityType.WHITHER_SKELETON){
        if(Math.random() < (EntityHelper.isPlayer(Entity.getType(attacker)) ? 0.1 : 0.05)){
            const region = WorldRegion.getForDimension(Entity.getDimension(entity));
            region.dropItem(Entity.getPosition(entity), ItemID.tcon_necrotic_bone, 1, 0);
        }
    }
});


// KEX.LootModule.createLootTableModifier("entities/wither_skeleton")
//     .createNewPool()
//         .addEntry()
//             .describeItem(ItemID.tcon_necrotic_bone)
//             .describeItem("minecraft", "tcon_necrotic_bone")
//             .setWeight(1)
//             .setCount(1)
//         .endEntry()
//         .beginConditions()
//             .addKilledByPlayerCondition()
//             .addRandomChanceWithLootingCondition(0.8, 0.1)
//         .endConditions()
//     .endPool();
