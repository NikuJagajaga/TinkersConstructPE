class TraitReinforced extends TconTrait {

    constructor(parent: TconModifier){
        super("reinforced", "Reinforced", parent);
    }

    override onConsume(stack: TconToolStack, level: number): boolean {
        return level >= 5 ? true : Math.random() < level * 0.2;
    }
    
}
