









// namespace TableWindow {

//     export const container = new UI.Container();

//     export const window = new UI.TabbedWindow({
//         isButtonHidden: true,
//         location: {x: 0, y: 0, width: ScreenHeight * 1.5, height: ScreenHeight},
//         elements: {}
//     });

//     const elemsPartBuilder: UI.ElementSet = {
//     };

//     for(let i = 0; i < 36; i++){
//         elemsPartBuilder["inv" + i] = {
//             type: "invSlot",
//             x: 50 + (i % 9) * 100,
//             y: i < 9 ? 620 : 200 + (i / 9 | 0) * 100,
//             size: 100,
//             index: i
//         }
//     }

//     window.setTab(0, {}, {
//         elements: elemsPartBuilder
//     });

//     window.setBlockingBackground(true);
//     window.setCloseOnBackPressed(true);

//     window.getWindowForTab(0).setInventoryNeeded(true);

// }




// Callback.addCallback("ItemUseLocal", (coords, item, block, player) => {

//     if(block.id === BlockID.tcon_partbuilder){

//         TableWindow.container.openAs(TableWindow.window);

//     }

// });