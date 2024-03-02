class TraitCreative extends TconTrait {

    constructor(parent: TconModifier){
        super("creative", "Creative", parent);
    }

    getBonusSlots(level: number): number {
        return level;
    }
    
}
