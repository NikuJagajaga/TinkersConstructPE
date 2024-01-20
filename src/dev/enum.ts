const EPartCategory = {
    HEAD: 1 << 0,
    HANDLE: 1 << 1,
    EXTRA: 1 << 2
} as const;

type EPartCategory = (typeof EPartCategory)[keyof typeof EPartCategory];
type EPartType = "pickaxe" | "shovel" | "axe" | "broadaxe" | "sword" | "hammer" | "excavator" | "rod" | "rod2" | "binding" | "binding2" | "guard" | "largeplate";
type ECastType = EPartType | "ingot" | "nugget" | "gem" | "plate" | "gear";


const PartCategory: {[key in EPartType]: number} = {
    pickaxe: EPartCategory.HEAD,
    shovel: EPartCategory.HEAD,
    axe: EPartCategory.HEAD,
    broadaxe: EPartCategory.HEAD,
    sword: EPartCategory.HEAD,
    hammer: EPartCategory.HEAD,
    excavator: EPartCategory.HEAD,
    rod: EPartCategory.HANDLE,
    rod2: EPartCategory.HANDLE | EPartCategory.EXTRA,
    binding: EPartCategory.EXTRA,
    binding2: EPartCategory.EXTRA,
    guard: EPartCategory.EXTRA,
    largeplate: EPartCategory.HEAD | EPartCategory.EXTRA
} as const;


namespace MatValue {
    export const INGOT = 144;
    export const NUGGET = INGOT / 9;
    export const FRAGMENT = INGOT / 4;
    export const SHARD = INGOT / 2;
    export const GEM = 666;
    export const BLOCK = INGOT * 9;
    export const SEARED_BLOCK = INGOT * 2;
    export const SEARED_MATERIAL = INGOT / 2;
    export const GLASS = 1000;
    export const BRICK_BLOCK = INGOT * 4;
    export const SLIME_BALL = 250;
    export const ORE = INGOT * Cfg.oreToIngotRatio;
}


const MiningLv = {
    STONE: 1,
    IRON: 2,
    DIAMOND: 3,
    OBSIDIAN: 4,
    COBALT: 5
} as const;

const MiningLvName = {
    1: "Stone",
    2: "Iron",
    3: "Diamond",
    4: "Obsidian",
    5: "Cobalt"
} as const;
