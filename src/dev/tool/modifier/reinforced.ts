createItem("tcon_reinforcement", "Reinforcement");
Recipes2.addShaped(ItemID.tcon_reinforcement, "aaa:aba:aaa", {a: "obsidian", b: ItemID.tcon_cast_largeplate});


class ModReinforced extends TinkersModifier {

    constructor(){
        super("reinforced", "Reinforced", 6, [ItemID.tcon_reinforcement], 1, true);
    }

    override onConsume(level: number): boolean {
        return level >= 5 ? true : Math.random() < level * 0.2;
    }
    
}