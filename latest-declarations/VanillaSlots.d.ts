/// <reference path="./core-engine.d.ts" />
interface VanillaSlotsOptions {
    /**
     * Speed of transfer animation
     */
    speed?: number;
    /**
     * Bonus size for transfer animation
     */
    bonusSize?: number;
}
declare namespace VanillaSlots {
    /**
     * Register events for ItemContainer
     * 
     * Use this if you haven't passed an container to registerForWindow
     * @param container server ItemContainer of window, used for registering events
     */
    export function registerServerEventsForContainer(container: ItemContainer): void;
    /**
     * Register Vanilla Slots for window
     * @param window window object
     * @param container server ItemContainer of window, used for registering events
     * @param options options for Vanilla Slots
     */
    export function registerForWindow( window: UI.Window | UI.WindowGroup | UI.StandardWindow, container?: ItemContainer, options?: VanillaSlotsOptions): void;
    /**
     * Register Vanilla Slots for TileEntity window
     * @param id id of TileEntity block. Throw error if TileEntity with this id is not registered
     * @param window window of this tile entity. If not defined, window taken from TileEntity.getScreenByName("main")
     */
    export function registerForTile(id: number, window?: UI.Window | UI.WindowGroup | UI.StandardWindow): void;
}