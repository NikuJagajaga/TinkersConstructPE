class ModSpider extends TinkersModifier {

    constructor(){
        super("spider", "Bane of Arthropods", 24, true);
        this.texIndex = 9;
        this.setRecipe(["fermented_spider_eye"]);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return EntityHelper.isArthropods(victim) ? 7 / this.max * level : 0;
    }
    
}
