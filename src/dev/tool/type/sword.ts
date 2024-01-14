class TconSword extends TconTool {

    private static DURABILITY_MODIFIER = 1.1;

    constructor(){

        super("tcontool_sword", "Broad Sword");

        this.blockTypes = ["fibre"];
        this.texture = new ToolTexture("sword", 3, 1);
        this.isWeapon = true;

        this.setToolParams();
        this.addToCreative(3);

    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1])
             .extra(materials[2])
             .handle(materials[0]);
        stats.attack += 1;
        stats.durability *= TconSword.DURABILITY_MODIFIER;
    }

    override getRepairModifierForPart(index: number): number {
        return TconSword.DURABILITY_MODIFIER;
    }

}


ItemRegistry.registerItem(new TconSword());
ToolForgeHandler.addRecipe(ItemID.tcontool_sword, ["rod", "sword", "guard"]);
ToolForgeHandler.addLayout({
    title: "Broad Sword",
    background: "tcon.icon.sword",
    intro: "The Broad Sword is a universal weapon. Sweep attacks keep enemy hordes at bay. Also good against cobwebs!",
    slots: [
        {x: -21, y: 20, bitmap: "tcon.slot.rod"},
        {x: 15, y: -16, bitmap: "tcon.slot.sword"},
        {x: -3, y: 2, bitmap: "tcon.slot.guard"}
    ]
});
