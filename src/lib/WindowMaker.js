var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
LIBRARY({
    name: "WindowMaker",
    version: 1,
    shared: true,
    api: "CoreEngine"
});
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Color = android.graphics.Color;
var Math_clamp = function (value, min, max) { return Math.min(Math.max(value, min), max); };
var FrameTex = UI.FrameTextureSource.get("workbench_frame3");
var FrameTexCentralColor = FrameTex.getCentralColor();
var McFontPaint = new android.graphics.Paint();
McFontPaint.setTypeface(WRAP_JAVA("com.zhekasmirnov.innercore.utils.FileTools").getMcTypeface());
McFontPaint.setTextSize(16);
var createHighlightBmp = function (w, h) {
    var bitmap = new Bitmap.createBitmap(w | 0, h | 0, Bitmap.Config.ARGB_8888);
    var canvas = new Canvas(bitmap);
    canvas.drawARGB(127, 255, 255, 255);
    return bitmap.copy(Bitmap.Config.ARGB_8888, true);
};
var WINDOW_OVL = "_wmOvl";
var FRAME_DETECTION = "_wmDetection";
var TOOLTIP_TEXT = "_wmText";
var TOOLTIP_FRAME = "_wmFrame";
var TOOLTIP_HIGHLIGHT = "_wmHighlight";
var THREAD_WM = "WM_showTooltip";
var WindowMaker = /** @class */ (function () {
    function WindowMaker(title, width, height, frame) {
        this.width = width;
        this.height = height;
        this.ratio = width / height;
        this.scale = this.ratio >= WindowMaker.CONTENT_SIZE.ratio ? 1000 / width : WindowMaker.CONTENT_SIZE.height / height;
        this.posX = (1000 - width * this.scale) / 2;
        this.frame = frame || "classic_frame_bg_light";
        this.z = 0;
        this.content = {
            standard: {
                header: {
                    text: { text: title },
                    height: 60
                },
                inventory: { standard: true },
                background: { standard: true }
            },
            drawing: [
                {
                    type: "frame",
                    x: this.posX,
                    y: 0,
                    width: width * this.scale,
                    height: height * this.scale,
                    bitmap: this.frame,
                    scale: this.scale
                }
            ],
            elements: {}
        };
        this.drawingMap = {};
    }
    WindowMaker.prototype.enableTooltip = function (enable) {
        this.withTooltip = enable;
        return this;
    };
    /*
        private solveName(name: string): string[] {
            const arr: string[] = [];
            const spl = name.split("^");
            if(spl.length > 1){
                const idx = spl[1].split("-");
                //if(idx.length != 2) return arr;
                const from = parseInt(idx[0]);
                const to = parseInt(idx[0]);
                //if(isNaN(from) || isNaN(to)) return arr;
                for(let i = from; i <= to; i++){
                    arr.push(spl[0] + i);
                }
            }
            else{
                arr.push(name);
            }
            return arr;
        }
    */
    /**
     * @param io Specify the slot and tank to be used in the Recipe Viewer window by name.
     * @param drawings Specify the elements and drawing to be used in the Recipe Viewer window by name.
     *
     */
    WindowMaker.prototype.getContentForRV = function (io, other) {
        var content = {
            drawing: [
                { type: "frame", x: 0, y: 0, width: 1000, height: this.height * this.scale, bitmap: this.frame, scale: this.scale }
            ],
            elements: {}
        };
        //let names: string[];
        //let n = 0;
        if (io.input) {
            for (var i = 0; i < io.input.length; i++) {
                content.elements["input" + i] = this.content.elements[io.input[i]];
            }
        }
        if (io.output) {
            for (var i = 0; i < io.output.length; i++) {
                content.elements["output" + i] = this.content.elements[io.output[i]];
            }
        }
        if (io.inputLiq) {
            for (var i = 0; i < io.inputLiq.length; i++) {
                content.elements["inputLiq" + i] = this.content.elements[io.inputLiq[i]];
            }
        }
        if (io.outputLiq) {
            for (var i = 0; i < io.outputLiq.length; i++) {
                content.elements["outputLiq" + i] = this.content.elements[io.outputLiq[i]];
            }
        }
        if (other) {
            for (var key in this.drawingMap) {
                if (other.indexOf(key) != -1) {
                    content.drawing.push(this.drawingMap[key]);
                }
            }
            for (var key in this.content.elements) {
                if (other.indexOf(key) != -1) {
                    content.elements[key] = this.content.elements[key];
                }
            }
        }
        return content;
    };
    WindowMaker.prototype.adjustScale = function (elem) {
        if ("x" in elem)
            elem.x = elem.x * this.scale + this.posX;
        if ("y" in elem)
            elem.y *= this.scale;
        if ("width" in elem)
            elem.width *= this.scale;
        if ("height" in elem)
            elem.height *= this.scale;
        if ("size" in elem)
            elem.size *= this.scale;
        if ("font" in elem && "size" in elem.font) {
            var font = __assign({}, elem.font);
            font.size *= this.scale;
            elem.font = font;
        }
        elem["scale"] = "scale" in elem ? elem["scale"] * this.scale : this.scale;
    };
    WindowMaker.prototype.getWidth = function () {
        return this.width;
    };
    WindowMaker.prototype.getHeight = function () {
        return this.height;
    };
    /**
     *
     * @param name You can also name the drawing. If you are lazy, you can use an empty string.
     * @param drawing
     * @returns
     */
    WindowMaker.prototype.addDrawing = function (name, drawing) {
        if (name == "") {
            var idx = 0;
            while (("drawing" + idx) in this.drawingMap) {
                idx++;
            }
            name = "drawing" + idx;
        }
        this.adjustScale(drawing);
        this.drawingMap[name] = drawing;
        return this;
    };
    /**
     *
     * @param name You can also name the element. If you are lazy, you can use an empty string.
     * @param elements
     * @returns
     */
    WindowMaker.prototype.addElements = function (name, elements) {
        if (name == "") {
            var idx = 0;
            while (("element" + idx) in this.drawingMap) {
                idx++;
            }
            name = "element" + idx;
        }
        this.adjustScale(elements);
        this.content.elements[name] = __assign(__assign({}, elements), { z: this.z });
        this.z++;
        return this;
    };
    WindowMaker.prototype.addSlot = function (name, x, y, size, bmpName) {
        var elemSlot = { type: "slot", x: x, y: y, size: size, bitmap: bmpName || "classic_slot" };
        return this.addElements(name, elemSlot);
    };
    WindowMaker.prototype.addScale = function (name, x, y, bmpBack, bmpFront, direction, thickness) {
        if (direction === void 0) { direction = 0; }
        if (thickness === void 0) { thickness = 0; }
        return this.addDrawing(name, { type: "bitmap", x: x, y: y, bitmap: bmpBack })
            .addElements(name, { type: "scale", x: x + thickness, y: y + thickness, bitmap: bmpFront, direction: direction });
    };
    WindowMaker.prototype.addText = function (name, x, y, text, font) {
        var fontParams = { color: Color.DKGRAY, size: 8, align: UI.Font.ALIGN_DEFAULT };
        if (typeof font == "number") {
            fontParams.size = font;
        }
        else {
            fontParams = __assign(__assign({}, fontParams), font);
        }
        return this.addElements(name, { type: "text", x: x, y: y, text: text, font: fontParams });
    };
    WindowMaker.prototype.addTextAsDrawing = function (name, x, y, text, font) {
        var fontParams = { color: Color.DKGRAY, size: 8, align: UI.Font.ALIGN_DEFAULT };
        if (typeof font == "number") {
            fontParams.size = font;
        }
        else {
            fontParams = __assign(__assign({}, fontParams), font);
        }
        return this.addDrawing(name, { type: "text", x: x, y: y, text: text, font: fontParams });
    };
    WindowMaker.prototype.setClicker = function (name, clicker) {
        var elem = this.content.elements[name];
        if (elem) {
            elem.clicker = clicker;
        }
        return this;
    };
    WindowMaker.prototype.setValidItem = function (name, validFunc) {
        var elem = this.content.elements[name];
        if (elem && elem.type === "slot") {
            elem.isValid = validFunc;
        }
        return this;
    };
    WindowMaker.prototype.makeWindow = function () {
        var _a;
        var _this = this;
        for (var key in this.drawingMap) {
            this.content.drawing.push(this.drawingMap[key]);
        }
        this.winBase = new UI.StandardWindow(this.content);
        this.winBase.getWindow("content").getLocation().setScroll(0, 0);
        this.winBase.getWindow("main").getContent().elements["_wmClose"] = {
            type: "closeButton",
            x: 1000 - 15 * 2,
            y: 0,
            bitmap: "classic_close_button",
            bitmap2: "classic_close_button_down",
            scale: 2
        };
        if (this.withTooltip) {
            this.content.elements[FRAME_DETECTION] = {
                type: "frame",
                x: 0,
                y: 0,
                z: -100,
                width: 1000,
                height: 1000,
                bitmap: "_default_slot_empty",
                onTouchEvent: function (elem, event) {
                    var eventX = event.x;
                    var eventY = event.y;
                    var eventType = event.type;
                    var elems = elem.window.getElements();
                    var it = elems.values().iterator();
                    var e;
                    while (it.hasNext()) {
                        e = it.next();
                        if (e.source) { //e is slot
                            event.preparePosition(e.window, e.elementRect);
                            if (event.localX > 0 && event.localY > 0 && event.localX < 1 && event.localY < 1) {
                                _this.showTooltip(_this.slotTooltip(e), e, eventX, eventY, eventType);
                                break;
                            }
                        }
                    }
                }
            };
            this.winOvl = new UI.Window({
                location: { x: 0, y: 0, width: 1000, height: UI.getScreenHeight() },
                elements: (_a = {},
                    _a[TOOLTIP_TEXT] = { type: "text", x: 0, y: -1000, z: 1, font: { color: Color.WHITE, size: 16, shadow: 0.5 }, multiline: true },
                    _a[TOOLTIP_FRAME] = { type: "image", x: 0, y: -1000, width: 64, height: 64, scale: 1, bitmap: "workbench_frame3" },
                    _a[TOOLTIP_HIGHLIGHT] = { type: "image", x: -1000, y: -1000, z: -1, width: 64, height: 64, scale: 1, bitmap: "_selection" },
                    _a)
            });
            this.winOvl.setBackgroundColor(Color.TRANSPARENT);
            this.winOvl.setTouchable(false);
            this.winOvl.setAsGameOverlay(true);
            this.winBase.addWindowInstance(WINDOW_OVL, this.winOvl);
        }
        return this.winBase;
    };
    WindowMaker.prototype.setTooltipFunc = function (elemName, tooltipFunc) {
        var _this = this;
        if (elemName in this.content.elements) {
            this.content.elements[elemName].onTouchEvent = function (el, ev) {
                _this.showTooltip(tooltipFunc(el), el, ev.x, ev.y, ev.type);
            };
        }
        return this;
    };
    WindowMaker.prototype.slotTooltip = function (slotElem) {
        if (slotElem.source.id != 0) {
            return Item.getName(slotElem.source.id, slotElem.source.data, slotElem.source.extra);
        }
        return "";
    };
    WindowMaker.prototype.showTooltip = function (str, elem, eventX, eventY, eventType) {
        if (!this.withTooltip)
            return;
        var location = elem.window.getLocation();
        var ovlElems = this.winOvl.getElements();
        var wmText = ovlElems.get(TOOLTIP_TEXT);
        var wmFrame = ovlElems.get(TOOLTIP_FRAME);
        var wmHighlight = ovlElems.get(TOOLTIP_HIGHLIGHT);
        var MOVEtoLONG_CLICK = eventType == "LONG_CLICK" && wmFrame.x != -1000 && wmFrame.y != -1000;
        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;
        if (str && (eventType == "MOVE" || MOVEtoLONG_CLICK)) {
            x = location.x + location.windowToGlobal(elem.x) | 0;
            y = location.y + location.windowToGlobal(elem.y) | 0;
            w = location.windowToGlobal(elem.elementRect.width()) | 0;
            h = location.windowToGlobal(elem.elementRect.height()) | 0;
            if (wmHighlight.elementRect.width() != w || wmHighlight.elementRect.height() != h) {
                wmHighlight.texture = new UI.Texture(createHighlightBmp(w, h));
                wmHighlight.setSize(w, h);
            }
            wmHighlight.setPosition(x, y);
            var split = str.split("\n");
            w = Math.max.apply(Math, split.map(function (s) { return McFontPaint.measureText(s); })) + 20;
            h = split.length * 18 + 16;
            x = location.x + location.windowToGlobal(eventX);
            y = location.y + location.windowToGlobal(eventY) - h - 50;
            if (y < -10) {
                y = location.y + location.windowToGlobal(eventY) + 70;
            }
            if (wmFrame.elementRect.width() != w || wmFrame.elementRect.height() != h) {
                wmFrame.texture = new UI.Texture(FrameTex.expandAndScale(w, h, 1, FrameTexCentralColor));
                wmFrame.setSize(w, h);
            }
            wmText.setPosition(Math_clamp(x - w / 2, 0, 1000 - w) + 10, y + 7);
            wmText.setBinding("text", str);
            wmFrame.setPosition(Math_clamp(x - w / 2, 0, 1000 - w), y);
            if (!Threading.getThread(THREAD_WM)) {
                Threading.initThread(THREAD_WM, function () {
                    while (elem.isTouched) {
                        java.lang.Thread.sleep(200);
                    }
                    wmText.setPosition(-1000, -1000);
                    wmFrame.setPosition(-1000, -1000);
                    wmHighlight.setPosition(-1000, -1000);
                });
            }
        }
        else {
            wmText.setPosition(-1000, -1000);
            wmFrame.setPosition(-1000, -1000);
            wmHighlight.setPosition(-1000, -1000);
        }
    };
    WindowMaker.SCALE_RIGHT = 0;
    WindowMaker.SCALE_UP = 1;
    WindowMaker.SCALE_LEFT = 2;
    WindowMaker.SCALE_DOWN = 3;
    WindowMaker.CONTENT_SIZE = (function () {
        var win = new UI.StandardWindow({
            standard: {
                header: { height: 60 },
                inventory: { standard: true },
                background: { standard: true }
            },
            elements: {}
        });
        var loc = win.getWindow("content").getLocation();
        return { width: loc.getWindowWidth(), height: loc.getWindowHeight(), ratio: loc.getWindowWidth() / loc.getWindowHeight() };
    })();
    return WindowMaker;
}());
EXPORT("WindowMaker", WindowMaker);
