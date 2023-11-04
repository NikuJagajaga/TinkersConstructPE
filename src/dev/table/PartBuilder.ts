createBlock("tcon_partbuilder", [
    {name: "Part Builder", texture: [0, 0, ["log_side", 0]]},
    {name: "Part Builder", texture: [0, 0, ["log_side", 1]]},
    {name: "Part Builder", texture: [0, 0, ["log_side", 2]]},
    {name: "Part Builder", texture: [0, 0, ["log_side", 3]]},
    {name: "Part Builder", texture: [0, 0, ["log2", 0]]},
    {name: "Part Builder", texture: [0, 0, ["log2", 2]]}
], "wood");

Item.addCreativeGroup("tcon_partbuilder", "Part Builder", [BlockID.tcon_partbuilder]);

BlockModel.register(BlockID.tcon_partbuilder, (model, index) => {
    const tex = index <= 3 ? "log_side" : "log2";
    const meta = index <= 3 ? index : (index - 4) * 2;
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, tex, meta);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, tex, meta);
    return model;
}, 6);

Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 0}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 1}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 1}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 1}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 2}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 2}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 3}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 3}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 4}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log2", data: 0}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 5}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log2", data: 1}});