class ModSpider extends TinkersModifier {

    private static targets = {
        [Native.EntityType.SPIDER]: true,
        [Native.EntityType.CAVE_SPIDER]: true,
        [Native.EntityType.SILVERFISH]: true,
        [Native.EntityType.ENDERMITE]: true
    };

    constructor(){
        super("spider", "Bane of Arthropods", 9, [VanillaItemID.fermented_spider_eye], 24, true);
    }

    onAttack(item: ItemInstance, victim: number, level: number): number {
        return ModSpider.targets[Entity.getType(victim)] ? 7 / this.max * level : 0;
    }
    
}