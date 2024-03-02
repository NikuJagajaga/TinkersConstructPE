const TraitCreative = new class extends TconTrait {

    constructor(){
        super("creative", "Creative");
    }

    getBonusSlots(level: number): number {
        return level;
    }
    
}
