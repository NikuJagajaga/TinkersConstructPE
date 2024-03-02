const TraitBeheading = new class extends TconTrait {

    constructor(){
        super("beheading", "Beheading", "#10574b");
    }

    override onKillEntity(stack: TconToolStack, victim: number, player: number, damageType: number, level: number): void {
        const headMeta = EntityHelper.getHeadMeta(victim);
        if(headMeta !== -1 && Math.random() < 0.1 * level){
            const region = WorldRegion.getForActor(player);
            region.dropItem(Entity.getPosition(victim), VanillaBlockID.skull, 1, headMeta);
        }
    }

}
