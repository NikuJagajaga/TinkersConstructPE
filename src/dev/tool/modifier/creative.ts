createItem("tcon_creative_modifier", "Creative Modifier");


class ModCreative extends TinkersModifier {

    constructor(){
        super("creative", "Creative", 99, false);
        this.consumeSlots = 0;
        this.setRecipe([ItemID.tcon_creative_modifier]);
    }

    getBonusSlots(level: number): number {
        return level;
    }
    
}
