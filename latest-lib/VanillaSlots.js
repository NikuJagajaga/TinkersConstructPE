LIBRARY({
    name: "VanillaSlots",
    version: 3,
    shared: true,
    api: "CoreEngine"
});
var _TextureSource = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.ui.TextureSource');
_TextureSource = _TextureSource.instance;
function StringToBitmap(encodedString){
    try{
        encodeByte = android.util.Base64.decode(encodedString, 0);
        bitmap = android.graphics.BitmapFactory.decodeByteArray(encodeByte, 0, encodeByte.length);
        return bitmap;
    }
    catch(e){
        return null;
    }
}
_TextureSource.put('___transferBarFull', StringToBitmap("iVBORw0KGgoAAAANSUhEUgAAAA8AAAADCAIAAADDdsJmAAAAEUlEQVR4AWNk+M9APGCkoWoADp8DAS0NIF4AAAAASUVORK5CYII="));
_TextureSource.put('___transferBarEmpty', StringToBitmap("iVBORw0KGgoAAAANSUhEUgAAAA8AAAADCAIAAADDdsJmAAAAEklEQVR4AWP08fFlIBow0lA1APMhArOjizwiAAAAAElFTkSuQmCC"));
function getScrollY(window){
    let view = window.layout;
    var scrollY = 0;
    try {
        while(true) {
            scrollY += view.getScrollY();
            view = view.getChildAt(0);
        }
    } catch(errr) {};
    return scrollY;
}

var JAVA_ANIMATOR = android.animation.ValueAnimator;
var JAVA_HANDLER = android.os.Handler;
var LOOPER_THREAD = android.os.Looper;

var JAVA_HANDLER_THREAD = new JAVA_HANDLER(LOOPER_THREAD.getMainLooper());
function createAnim(_values, _duration, _updateFunc){
    var animation = JAVA_ANIMATOR.ofFloat(_values);
    animation.setDuration(_duration);
    if(_updateFunc)animation.addUpdateListener({
        onAnimationUpdate : function(updatedAnim){
            _updateFunc(updatedAnim.getAnimatedValue(), updatedAnim);
        }
    });
    JAVA_HANDLER_THREAD.post({
        run: function(){
            animation.start();
        }
    })
    return animation;
};

if (!Object.assign) {
	Object.defineProperty(Object, 'assign', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function (target, firstSource) {
			'use strict';
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert first argument to object');
			}

			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) {
					continue;
				}

				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
			return to;
		}
	});
}

function defaultOptions(){
    return {
        anim: {
            speed: 200,
            bonusSize: 0
        }
    }
}

function defaultChestData(){
    return {
        container: null,
        currentWindow: null,
        start: false,
        item: {
            maxCount: 0,
            count: 0
        },
        barData: {
            name: "",
            x: 0,
            y: 0
        },
        pre_selectedSlot: null,
        selectedSlot: null,
        selectedSlotType: null,
        lastClickTime: 0,
        anim: {
            pos1: {
                slotSize: 0,
                window: null,
                x: 0,
                y: 0
            },
            pos2: {
                x: 0,
                y: 0
            }
        }
    }
}
var chestData = defaultChestData();
var defaultFunctions = {
    SlotToSlot: function(container, eventData, connectedClient) {
        //alert('SlotToSlot: ' + JSON.stringify(eventData));
        var slot1 = container.getSlot(eventData.slot1).asScriptable();
        var transferPolicy1 = container.getGetTransferPolicy(eventData.slot1);
        var slot2 = container.getSlot(eventData.slot2).asScriptable();
        var transferPolicy2 = container.getAddTransferPolicy(eventData.slot2);
        if((slot2.id != slot1.id || slot2.data != slot1.data || (slot2.extra != slot1.extra && ((!slot2.extra || slot2.extra.getAllCustomData()) != (!slot1.extra || slot1.extra.getAllCustomData())))) && slot2.id != 0){
            container.setSlot(eventData.slot1, slot2.id, slot2.count, slot2.data, slot2.extra);
            container.setSlot(eventData.slot2, slot1.id, slot1.count, slot1.data, slot1.extra);
            container.sendChanges();
            return;
        }
        var _count = slot2.id != 0 ? Math.min(eventData.count, Item.getMaxStack(slot2.id) - slot2.count) : eventData.count;
        if(_count <= 0) return;
        if(transferPolicy1)_count = (transferCount = transferPolicy1.transfer(container, eventData.slot1, slot1.id, _count, slot1.data, slot1.extra, connectedClient.getPlayerUid())) != undefined && transferCount != null ? transferCount : _count;
        if(_count <= 0) return;
        if(transferPolicy2)_count = (transferCount = transferPolicy2.transfer(container, eventData.slot2, slot1.id, _count, slot1.data, slot1.extra, connectedClient.getPlayerUid())) != undefined && transferCount != null ? transferCount : _count;
        if(_count <= 0) return;
        container.setSlot(eventData.slot2, slot1.id, slot2.id != 0 ? slot2.count + _count : _count, slot1.data, slot1.extra);
        container.setSlot(eventData.slot1, slot1.id, slot1.count - _count, slot1.data, slot1.extra);
        container.getSlot(eventData.slot1).validate();
        container.sendChanges();
    },
    InventorySlotToSlot: function(container, eventData, connectedClient) {
        //alert('InventorySlotToSlot: ' + JSON.stringify(eventData));
        var player = new PlayerActor(connectedClient.getPlayerUid());
        var slot1 = player.getInventorySlot(eventData.slot1);
        var slot2 = player.getInventorySlot(eventData.slot2);
        if((slot2.id != slot1.id || slot2.data != slot1.data || (slot2.extra != slot1.extra && ((!slot2.extra || slot2.extra.getAllCustomData()) != (!slot1.extra || slot1.extra.getAllCustomData())))) && slot2.id != 0){
            player.setInventorySlot(eventData.slot1, slot2.id, slot2.count, slot2.data, slot2.extra);
            player.setInventorySlot(eventData.slot2, slot1.id, slot1.count, slot1.data, slot1.extra);
            return;
        }
        var _count = slot2.id != 0 ? Math.min(eventData.count, Item.getMaxStack(slot2.id) - slot2.count) : eventData.count;
        if(_count <= 0) return;
        player.setInventorySlot(eventData.slot1, slot1.id, slot1.count - _count, slot1.data, slot1.extra);
        player.setInventorySlot(eventData.slot2, slot1.id, slot2.id != 0 ? slot2.count + _count : _count, slot1.data, slot1.extra);
    },
    SlotToInventorySlot: function(container, eventData, connectedClient) {
        //alert('SlotToInventorySlot: ' + JSON.stringify(eventData));
        var player = new PlayerActor(connectedClient.getPlayerUid());
        var slot1 = container.getSlot(eventData.slot1).asScriptable();
        var transferPolicy1 = container.getGetTransferPolicy(eventData.slot1);
        var slot2 = player.getInventorySlot(eventData.slot2);
        if((slot2.id != slot1.id || slot2.data != slot1.data || (slot2.extra != slot1.extra && ((!slot2.extra || slot2.extra.getAllCustomData()) != (!slot1.extra || slot1.extra.getAllCustomData())))) && slot2.id != 0){
            player.setInventorySlot(eventData.slot2, slot1.id, slot1.count, slot1.data, slot1.extra);
            container.setSlot(eventData.slot1, slot2.id, slot2.count, slot2.data, slot2.extra);
            container.sendChanges();
            return;
        }
        var _count = slot2.id != 0 ? Math.min(eventData.count, Item.getMaxStack(slot2.id) - slot2.count) : eventData.count;
        if(_count <= 0) return;
        if(transferPolicy1)_count = (transferCount = transferPolicy1.transfer(container, eventData.slot1, slot1.id, _count, slot1.data, slot1.extra, connectedClient.getPlayerUid())) != undefined && transferCount != null ? transferCount : _count;
        player.setInventorySlot(eventData.slot2, slot1.id, slot2.id != 0 ? slot2.count + _count : _count, slot1.data, slot1.extra);
        container.setSlot(eventData.slot1, slot1.id, slot1.count - _count, slot1.data, slot1.extra);
        container.getSlot(eventData.slot1).validate();
        container.sendChanges();
    },
    InventorySlotToContainerSlot: function(container, eventData, connectedClient) {
        //alert('InventorySlotToContainerSlot: ' + JSON.stringify(eventData));
        var player = new PlayerActor(connectedClient.getPlayerUid());
        var slot1 = player.getInventorySlot(eventData.slot1);
        var slot2 = container.getSlot(eventData.slot2).asScriptable();
        var transferPolicy2 = container.getAddTransferPolicy(eventData.slot2);
        if((slot2.id != slot1.id || slot2.data != slot1.data || (slot2.extra != slot1.extra && ((!slot2.extra || slot2.extra.getAllCustomData()) != (!slot1.extra || slot1.extra.getAllCustomData())))) && slot2.id != 0){
            player.setInventorySlot(eventData.slot1, slot2.id, slot2.count, slot2.data, slot2.extra);
            container.setSlot(eventData.slot2, slot1.id, slot1.count, slot1.data, slot1.extra);
            container.sendChanges();
            return;
        }
        var _count = slot2.id != 0 ? Math.min(eventData.count, Item.getMaxStack(slot2.id) - slot2.count) : eventData.count;
        if(_count <= 0) return;
        if(transferPolicy2)_count = (transferCount = transferPolicy2.transfer(container, eventData.slot2, slot1.id, _count, slot1.data, slot1.extra, connectedClient.getPlayerUid())) != undefined && transferCount != null ? transferCount : _count;
        if(_count <= 0) return;
        player.setInventorySlot(eventData.slot1, slot1.id, slot1.count - _count, slot1.data, slot1.extra);
        container.setSlot(eventData.slot2, slot1.id, slot2.id != 0 ? slot2.count + _count : _count, slot1.data, slot1.extra);
        container.sendChanges();
    }
}

function addEventListener(_container, event){
    _container.addServerEventListener(event, function(container, client, packetData) {
        defaultFunctions[event](container, packetData, client);
    });
}

function registerServerEventsForContainer(_container){
    for(let i in defaultFunctions){
        addEventListener(_container, i);
    }
}

var uniqueId_ = 0;

function registerForWindow(_window, _container, _options){
    _options = Object.assign({speed:250, bonusSize: 2}, _options || {});
    function startAnim(window, slot, size, size1){
        var content = window.getContent();
        var slot_id = '$slot' + (++uniqueId_);
        var pos1 = {x: chestData.anim.pos1.x, y: chestData.anim.pos1.y};
        var pos2 = {x: chestData.anim.pos2.x, y: chestData.anim.pos2.y};
        content.elements[slot_id] = {
            type: "slot",
            x: pos1.x - size/2,
            y: pos1.y - size/2,
            size: (size || 70) + _options.bonusSize,
            source: {
                id: slot.id,
                count: 1,
                data: slot.data,
                extra: slot.extra || null
            },
            bitmap: "_default_slot_empty",
            visual: true
        };
        window.forceRefresh();
        var elements = window.getElements();
        var animation = createAnim([0, 1], _options.speed, function(value){
            if(!window.isOpened()) return;
            var _x = pos1.x + (pos2.x - pos1.x)*value;
            var _y = pos1.y + (pos2.y - pos1.y)*value;
            var slotElement = window.getElements().get(slot_id);
            var _size = Math.round(size + (size1 - size)*value + _options.bonusSize);
            content.elements[slot_id].size = _size;
            content.elements[slot_id].x = _x - _size/2;
            content.elements[slot_id].y = _y - _size/2;
            slotElement.setPosition(_x - _size/2, _y - _size/2);
            window.forceRefresh();
        });
        animation.addListener({
            onAnimationEnd: function(){
                delete content.elements[slot_id];
                if(!window.isOpened()) return;
                var elementProvider = window.getElementProvider();
                elementProvider.removeElement(elements.get(slot_id));
                window.forceRefresh();
            }
        });
    }
    var groupWindow = _window.getWindow ? true : false;
    var mainWindow = groupWindow ? _window.getAllWindows().get(_window.getAllWindows().size() - 1) : _window;
    overlayWindow_object = {
        location: {
            x: 0,
            y: 0,
            width: 1000,
            height: UI.getScreenHeight()
        },
        drawing: [{type: 'color', color: android.graphics.Color.TRANSPARENT}],
        elements: {

        }
    };
    var overlayWindow = groupWindow ? _window.addWindow('overlay', overlayWindow_object) : new UI.Window(overlayWindow_object);
    overlayWindow.setAsGameOverlay(true);
    overlayWindow.setTouchable(false);
    mainWindow.setEventListener({
        onClose: function(){
            if(!groupWindow)overlayWindow.close();
        },
        onOpen: function(window){
            var elements = window.getElements();
            if(elements.get("selection1___"))elements.get("selection1___").setPosition(-1000, -1000);
            if(elements.get("scale1___"))elements.get("scale1___").setPosition(-1000, -1000);
            chestData.selectedSlot = null;
            chestData.selectedSlotType = null;
            if(!groupWindow)overlayWindow.open();
        }
    });
    function slotOnTouchEvent(element, event){
        currentSlotType = this.type == 'frame' ? 0 : 1;
        slotSize = this.size || this.slot_size || 60;
        var _elements_ = element.window.getContent().elements;
        _elements_['scale1___'].scale = 60/108*slotSize/15;
        _elements_["selection1___"].width = _elements_["selection1___"].height = slotSize;
        var slot_id = this.slot_id || this.slot_id___ || 0;
        var uiAdapter = element.window.getContainer();
        chestData.container = uiAdapter.getParent();
        chestData.currentWindow = element.window;
        var item = currentSlotType ? chestData.container.getSlot(slot_id) : Player.getInventorySlot(slot_id);
        event_type = event.type;
        var elements___ = element.window.getElements();
        if(event.type == 'CLICK' && chestData.selectedSlot != null){
            if(chestData.selectedSlot == slot_id) {
                chestData.selectedSlot = null;
                chestData.selectedSlotType = null;
                if(java.lang.System.currentTimeMillis() - chestData.lastClickTime <= 500){
                    var maxStack = Item.getMaxStack(item.id);
                    if(item.count < maxStack){
                        var needCount = maxStack - item.count;
                        var slots = chestData.container.slots;
                        var scrollY = getScrollY(element.window);
                        var inventoryWindow = element.window;
                        //var _elements = inventoryWindow.getContent().elements;
                        chestData.anim.pos2 = {
                            window: element.window,
                            x: element.window.location.windowToGlobal(this.x + slotSize/2) + element.window.location.x,
                            y: element.window.location.windowToGlobal((this.y + slotSize/2) - scrollY/element.window.getScale()) + element.window.location.y
                        };
                        //var contentWindow = element.window;
                        if(currentSlotType){
                            for(var i in slots){
                                if(i[0] == '$') continue;
                                var item2 = slots[i];
                                if(!item2 || i == slot_id || item2.id != item.id || item2.data != item.data || (item2.extra != item.extra && ((!item2.extra || item2.extra.getAllCustomData()) != (!item.extra || item.extra.getAllCustomData())))) continue;
                                var _count = Math.min(item2.count, needCount);
                                needCount -= _count;
                                chestData.container.sendEvent("SlotToSlot", {slot1: i, slot2: slot_id, count: _count});
                                var thiswindow = windowBySlotName[i];
                                if(!thiswindow) continue;
                                var _scrollY = getScrollY(thiswindow);
                                var thiswindowElements = thiswindow.getContent().elements;
                                chestData.anim.pos1 = {
                                    window: thiswindow,
                                    slotSize: thiswindowElements[i].size || 60,
                                    x: thiswindow.location.windowToGlobal(thiswindowElements[i].x + thiswindowElements[i].size/2) + thiswindow.location.x,
                                    y: thiswindow.location.windowToGlobal((thiswindowElements[i].y + thiswindowElements[i].size/2) - _scrollY/thiswindow.getScale()) + thiswindow.location.y
                                }
                                startAnim(overlayWindow, chestData.container.getSlot(i), thiswindow.location.windowToGlobal(chestData.anim.pos1.slotSize), element.window.location.windowToGlobal(slotSize));
                                if(needCount <= 0) break;
                            }
                            if(needCount > 0){
                                for (var i = 0; i <= 35; i++){
                                    var item2 = Player.getInventorySlot(i);
                                    if(!item2 || item2.id != item.id || item2.data != item.data || (item2.extra != item.extra && ((!item2.extra || item2.extra.getAllCustomData()) != (!item.extra || item.extra.getAllCustomData())))) continue;
                                    var _count = Math.min(item2.count, needCount);
                                    needCount -= _count;
                                    chestData.container.sendEvent("InventorySlotToContainerSlot", {slot1: i, slot2: slot_id, count: _count});
                                    var thiswindow = windowBySlotName[slotNameByIndex[i]];
                                    if(!thiswindow) continue;
                                    var _scrollY = getScrollY(thiswindow);
                                    var thiswindowElements = thiswindow.getContent().elements;
                                    chestData.anim.pos1 = {
                                        window: thiswindow,
                                        slotSize: thiswindowElements[slotNameByIndex[i]].size || 60,
                                        x: thiswindow.location.windowToGlobal(thiswindowElements[slotNameByIndex[i]].x + thiswindowElements[slotNameByIndex[i]].size/2) + thiswindow.location.x,
                                        y: thiswindow.location.windowToGlobal(((thiswindowElements[slotNameByIndex[i]].y + thiswindowElements[slotNameByIndex[i]].size/2)*thiswindow.getScale() - _scrollY)/thiswindow.getScale()) + thiswindow.location.y
                                    }
                                    startAnim(overlayWindow, Player.getInventorySlot(i), thiswindow.location.windowToGlobal(chestData.anim.pos1.slotSize), element.window.location.windowToGlobal(slotSize));
                                    if(needCount <= 0) break;
                                }
                            }
                        } else {
                            var maxStack = Item.getMaxStack(item.id);
                            if(item.count < maxStack){
                                for (var i = 0; i <= 35; i++){
                                    var item2 = Player.getInventorySlot(i);
                                    if(!item2 || i == slot_id || item2.id != item.id || item2.data != item.data || (item2.extra != item.extra && ((!item2.extra || item2.extra.getAllCustomData()) != (!item.extra || item.extra.getAllCustomData())))) continue;
                                    var _count = Math.min(item2.count, needCount);
                                    needCount -= _count;
                                    chestData.container.sendEvent("InventorySlotToSlot", {slot1: i, slot2: slot_id, count: _count});
                                    var thiswindow = windowBySlotName[slotNameByIndex[i]];
                                    if(!thiswindow) continue;
                                    var _scrollY = getScrollY(thiswindow);
                                    var thiswindowElements = thiswindow.getContent().elements;
                                    chestData.anim.pos1 = {
                                        window: thiswindow,
                                        slotSize: thiswindowElements[slotNameByIndex[i]].size || 60,
                                        x: thiswindow.location.windowToGlobal(thiswindowElements[slotNameByIndex[i]].x + thiswindowElements[slotNameByIndex[i]].size/2) + thiswindow.location.x,
                                        y: thiswindow.location.windowToGlobal(((thiswindowElements[slotNameByIndex[i]].y + thiswindowElements[slotNameByIndex[i]].size/2)*thiswindow.getScale() - _scrollY)/thiswindow.getScale()) + thiswindow.location.y
                                    }
                                    startAnim(overlayWindow, Player.getInventorySlot(i), thiswindow.location.windowToGlobal(chestData.anim.pos1.slotSize), element.window.location.windowToGlobal(slotSize));
                                    if(needCount <= 0) break;
                                }
                                if(needCount > 0){
                                    for(var i in slots){
                                        if(i[0] == '$') continue;
                                        var item2 = slots[i];
                                        if(!item2 || item2.id != item.id || item2.data != item.data || (item2.extra != item.extra && ((!item2.extra || item2.extra.getAllCustomData()) != (!item.extra || item.extra.getAllCustomData())))) continue;
                                        var _count = Math.min(item2.count, needCount);
                                        needCount -= _count;
                                        chestData.container.sendEvent("SlotToInventorySlot", {slot1: i, slot2: slot_id, count: _count});
                                        var thiswindow = windowBySlotName[i];
                                        if(!thiswindow) continue;
                                        var _scrollY = getScrollY(thiswindow);
                                        var thiswindowElements = thiswindow.getContent().elements;
                                        chestData.anim.pos1 = {
                                            window: thiswindow,
                                            slotSize: thiswindowElements[i].size || 60,
                                            x: thiswindow.location.windowToGlobal(thiswindowElements[i].x + thiswindowElements[i].size/2) + thiswindow.location.x,
                                            y: thiswindow.location.windowToGlobal((thiswindowElements[i].y + thiswindowElements[i].size/2) - _scrollY/thiswindow.getScale()) + thiswindow.location.y
                                        }
                                        startAnim(overlayWindow, chestData.container.getSlot(i), thiswindow.location.windowToGlobal(chestData.anim.pos1.slotSize), element.window.location.windowToGlobal(this.slot_size));
                                        if(needCount <= 0) break;
                                    }
                                }
                            }
                        }
                    }
                }
                var __window = chestData.anim.pos1.window || element.window;
                var elements___2 = __window.getElements();
                if(elements___2.containsKey("scale1___"))elements___2.get("scale1___").setPosition(-300, -300);
                if(elements___.containsKey("scale1___"))elements___.get("scale1___").setPosition(-300, -300);
                chestData.container.setScale('scale1___', 0);
                if(elements___2.containsKey("selection1___"))elements___2.get("selection1___").setPosition(-1000, -1000);
                if(elements___.containsKey("selection1___"))elements___.get("selection1___").setPosition(-1000, -1000);
                return;
            }
            chestData.item.count = Math.min(Math.floor(chestData.item.count), chestData.item.maxCount);
            if(currentSlotType){
                if(chestData.selectedSlotType == 0){
                    chestData.container.sendEvent("InventorySlotToContainerSlot", {slot1: chestData.selectedSlot, slot2: slot_id, count: chestData.item.count});
                    //chestData.container.sendInventoryToSlotTransaction(chestData.selectedSlot, slot_id, chestData.item.count);
                } else {
                    chestData.container.sendEvent("SlotToSlot", {slot1: chestData.selectedSlot, slot2: slot_id, count: chestData.item.count});
                    //chestData.container.sendSlotToSlotTransaction(chestData.selectedSlot, slot_id, chestData.item.count);
                }
            } else {
                if(chestData.selectedSlotType == 0){
                    chestData.container.sendEvent("InventorySlotToSlot", {slot1: chestData.selectedSlot, slot2: slot_id, count: chestData.item.count});
                } else {
                    chestData.container.sendEvent("SlotToInventorySlot", {slot1: chestData.selectedSlot, slot2: slot_id, count: chestData.item.count});
                }
            }
            var scrollY = getScrollY(element.window);
            chestData.anim.pos2 = {
                x: element.window.location.windowToGlobal(this.x + slotSize/2) + element.window.location.x,
                y: element.window.location.windowToGlobal((this.y + slotSize/2) - scrollY/element.window.getScale()) + element.window.location.y
            }
            var __window = chestData.anim.pos1.window;
            var elements___2 = __window.getElements();
            var _scrollY = getScrollY(__window);
            var slotSize__ = chestData.anim.pos1.slotSize || 250;
            chestData.anim.pos1.x = __window.location.windowToGlobal(chestData.anim.pos1.pre_x + slotSize__/2) + __window.location.x;
            chestData.anim.pos1.y = __window.location.windowToGlobal(((chestData.anim.pos1.pre_y + slotSize__/2)*__window.getScale() - _scrollY)/__window.getScale()) + __window.location.y;
            startAnim(overlayWindow, chestData.selectedSlotType ? chestData.container.getSlot(chestData.selectedSlot) : Player.getInventorySlot(chestData.selectedSlot), __window.location.windowToGlobal(slotSize__), element.window.location.windowToGlobal(slotSize));
            var _pos2 = {
                window: chestData.anim.pos2,
                x: chestData.anim.pos2.x,
                y: chestData.anim.pos2.y
            };
            chestData.anim.pos2 = chestData.anim.pos1;
            chestData.anim.pos1 = _pos2;
            var item2 = chestData.selectedSlotType ? chestData.container.getSlot(chestData.selectedSlot) : Player.getInventorySlot(chestData.selectedSlot);
            if(item.id != 0 && (item2.id != item.id || item2.count > Item.getMaxStack(item.id) - item.count))startAnim(overlayWindow, item, element.window.location.windowToGlobal(slotSize), chestData.anim.pos2.window.location.windowToGlobal(chestData.anim.pos2.slotSize || 251));
            if(elements___2.containsKey("scale1___"))elements___2.get("scale1___").setPosition(-300, -300);
            if(elements___.containsKey("scale1___"))elements___.get("scale1___").setPosition(-300, -300);
            chestData.container.setScale('scale1___', 0);
            if(elements___2.containsKey("selection1___"))elements___2.get("selection1___").setPosition(-1000, -1000);
            if(elements___.containsKey("selection1___"))elements___.get("selection1___").setPosition(-1000, -1000);
            chestData.selectedSlot = null;
            chestData.selectedSlotType = null;
            return;
        }
        if(event.type == 'CANCEL'){
            event_type = 'UP';
        }
        if(event.type == 'CLICK')event_type = 'UP';
        if(event_type == 'DOWN'){
            if(item.id == 0 || chestData.selectedSlot != null)return;
            chestData.item = {
                maxCount: item.count,
                count: 1
            }
            chestData.pre_selectedSlot = slot_id;
            chestData.start = World.getThreadTime() + 10;
            chestData.tickStarted = false;
            chestData.barData = {
                name: "scale1___",
                x: this.x + (slotSize - _elements_['scale1___'].scale*15)/2,
                y: this.y
            }
            element.window.forceRefresh();
            elements___.get('selection1___').setPosition(this.x, this.y);
            chestData.lastClickTime = java.lang.System.currentTimeMillis();
            chestData.anim.pos1 = {
                window: element.window,
                slotSize: slotSize,
                pre_x: this.x,
                pre_y: this.y
            };
        }
        if(event_type == 'UP'){
            if(chestData.selectedSlot != null || !chestData.start) return;
            chestData.start = false;
            chestData.selectedSlot = slot_id;
            chestData.selectedSlotType = currentSlotType;
            chestData.pre_selectedSlot = null;
            if(!chestData.tickStarted) chestData.item.count = chestData.item.maxCount;
        }
    }
    var slotNameByIndex = {};
    var windowBySlotName = {};
    var main_content = {elements:{}};
    var allWindows = groupWindow ? _window.getAllWindows().toArray() : [_window];
    for(var k in allWindows){
        var ___window = allWindows[k];
        if(overlayWindow && overlayWindow == ___window) continue;
        if(mainWindow != ___window)___window.setEventListener({
            onClose: function(){

            },
            onOpen: function(window){
                var elements = window.getElements();
                if(elements.get("selection1___"))elements.get("selection1___").setPosition(-1000, -1000);
                if(elements.get("scale1___"))elements.get("scale1___").setPosition(-1000, -1000);
            }
        });
        var windowContent = ___window.getContent();
        windowContent.elements['scale1___'] = {
            type: "scale",
            x: -300,
            y: -300,
            z: 100001,
            direction: 0,
            bitmap: "___transferBarFull",
            background: "___transferBarEmpty",
            value: 0,
            scale: 60/108*100/* slotSize *//15
        };
        windowContent.elements["selection1___"] = {
            type: "image",
            x: -1000,
            y: -1000,
            z: 100000,
            bitmap: "style:selection",
            width: 100,
            height: 100
        }
        for(var i in windowContent.elements){
            if((windowContent.elements[i].type.indexOf('slot') == -1 && windowContent.elements[i].type.indexOf('Slot') == -1) || windowContent.elements[i].clicker || windowContent.elements[i].visual || windowContent.elements[i].onTouchEvent) continue;
            if(windowContent.elements[i].type == 'invSlot'){
                slotNameByIndex[windowContent.elements[i].index] = i;
                windowContent.elements["_CLICKFRAME_" + (++uniqueId_)] = {
                    type: "frame",
                    x: windowContent.elements[i].x,
                    y: windowContent.elements[i].y,
                    z: -100,
                    width: windowContent.elements[i].size || 60,
                    height: windowContent.elements[i].size || 60,
                    bitmap: "_default_slot_empty",
                    slot_id: windowContent.elements[i].index || 0,
                    slot_size:  windowContent.elements[i].size || 60,
                    slot_textid: i,
                    scale: 1,
                    onTouchEvent: slotOnTouchEvent
                }
                continue;
            }
            windowContent.elements[i].visual = true;
            windowContent.elements[i].slot_id___ = i
            windowContent.elements[i].onTouchEvent = slotOnTouchEvent
        }
        Object.assign(main_content.elements, windowContent.elements);
        for(var k in windowContent.elements){
            windowBySlotName[k] = ___window;
        };
        ___window.forceRefresh();
    }
    if(_container)registerServerEventsForContainer(_container);
    //if(groupWindow)_window.refreshAll();
}

function registerForTile(id, window){
    Callback.addCallback('PreLoaded', function(){
        var Prototype = TileEntity.tileEntityPrototypes[id];
        if(!Prototype) throw 'Tile entity with ' + id + " id not registered";
        var window = window || Prototype.getScreenByName('main');
        if(!window) throw 'Cannot be get window from tileentity(' + id + ') please pass it as the second parameter';
        entityTypeName = Prototype.networkEntityTypeName;
        Prototype.__init_______________ = Prototype.init;
        Prototype.init = function(){
            registerServerEventsForContainer(this.container);
            if(this.__init_______________) this.__init_______________();
        }
        registerForWindow(window);
    });
}

Callback.addCallback('LocalTick', function(){
    if(chestData.start && World.getThreadTime() >= chestData.start && chestData.item.count < chestData.item.maxCount && chestData.currentWindow){
        var elements = chestData.currentWindow.getElements();
        var scaleElement = elements.get(chestData.barData.name);
        chestData.tickStarted = true;
        chestData.item.count += chestData.item.maxCount/25;
        if(scaleElement){
            scaleElement.setPosition(chestData.barData.x, chestData.barData.y);
            scaleElement.setBinding('value', chestData.item.maxCount > 15 ? chestData.item.count/chestData.item.maxCount : Math.floor(chestData.item.count)/chestData.item.maxCount);
        }
    }
});

var VanillaSlots_ = {
    registerServerEventsForContainer: registerServerEventsForContainer,
    registerForWindow: registerForWindow,
    registerForTile: registerForTile
}

EXPORT("VanillaSlots", VanillaSlots_);