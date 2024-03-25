// deno-lint-ignore-file
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// views/Button.js
var Button_exports = {};
__export(Button_exports, {
  default: () => Button
});

// views/TextElem.js
var TextElem_exports = {};
__export(TextElem_exports, {
  default: () => TextElem
});
var TextElem = class {
  id = 0;
  // N/A
  activeView = false;
  enabled = false;
  hovered = false;
  focused = false;
  path = new Path2D();
  index = 0;
  zOrder = 0;
  // assigned by activeViews.add()
  tabOrder = 0;
  // N/A
  name;
  size;
  textSize;
  location;
  textLocation;
  padding = 10;
  strokeColor = "black";
  fillColor;
  fontColor;
  fontSize;
  text;
  lastText;
  hasBorder = false;
  fill = true;
  textAlign;
  textBaseline;
  TextLocation;
  boundingBox = { left: 0, top: 0, width: 0, height: 0 };
  /**
   * ctor that instantiates a new virtual Text view
   * @param {{ kind?: string; idx: any; tabOrder?: number; id: any; text: any; location: any; size: any; fontSize?: any; bind: any; color?: any; fontColor?: any; padding?: any; textAlign?: any; textBaseline?: any; TextLocation?: any; fill?: any; hasBoarder?: any; }} el
  */
  constructor(el) {
    this.name = el.id;
    this.index = el.idx;
    this.text = el.text ?? "";
    this.lastText = "";
    this.size = el.size ?? { width: 30, height: 30 };
    this.textSize = { width: this.size.width, height: this.size.height };
    this.location = el.location;
    this.boundingBox = {
      left: this.location.left,
      top: this.location.top,
      width: this.size.width,
      height: this.size.height
    };
    this.fillColor = el.color ?? "transparent";
    this.fontColor = el.fontColor || "black";
    this.fontSize = el.fontSize || 18;
    this.padding = el.padding || 10;
    this.textAlign = el.textAlign || "center";
    this.textBaseline = el.textBaseline ?? "middle";
    this.TextLocation = el.TextLocation ?? "middle";
    this.textLocation = { left: el.location.left, top: el.location.top };
    this.fill = el.fill ?? true;
    this.hasBorder = el.hasBoarder ?? false;
    this.calculateMetrics();
    if (el.bind) {
      signals.on(
        "UpdateText",
        this.name,
        (data) => {
          this.calculateMetrics();
          this.hasBorder = data.border;
          this.fill = data.fill;
          this.fillColor = data.fillColor;
          this.fontColor = data.fontColor;
          this.lastText = data.text;
          this.text = data.text;
          this.update();
        }
      );
    }
  }
  /** 
   * updates and renders this view 
   * called from a host (Button host or main-VM) 
   */
  update() {
    this.calculateMetrics();
  }
  /** 
   * render this Text-View onto the canvas 
   */
  render() {
    if (!ctx)
      return;
    ctx.save();
    ctx.font = `${this.fontSize}px Tahoma, Verdana, sans-serif`;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    if (this.fill === true) {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(
        this.location.left,
        this.location.top,
        this.size.width,
        this.size.height
      );
    }
    const bb = this.boundingBox;
    if (this.hasBorder === true) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.strokeRect(bb.left, bb.top, bb.width, bb.height);
    }
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.text + " ", this.textLocation.left, this.textLocation.top);
    ctx.restore();
  }
  /** not implemented - TextElem are not activeElements */
  touched() {
  }
  /** 
   * calculate location based on font
   */
  calculateMetrics() {
    switch (this.TextLocation) {
      case "top":
        this.textLocation.top = this.location.top + this.padding;
        break;
      case "middle":
        this.textLocation.top = this.location.top + this.size.height * 0.5;
        break;
      default:
        this.textLocation.top = this.location.top + this.padding;
        break;
    }
    switch (this.textAlign) {
      case "left":
        this.textLocation.left = this.location.left + this.padding;
        break;
      case "center":
        this.textLocation.left = this.location.left + this.size.width * 0.5;
        break;
      case "right":
        this.textLocation.left = this.location.left + this.padding;
        break;
      default:
        this.textLocation.left = this.location.left + this.padding;
        break;
    }
    this.render();
  }
};
__name(TextElem, "TextElem");

// views/Button.js
var Button = class {
  id = 0;
  activeView = true;
  index = -1;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  path;
  size;
  location;
  color;
  fontColor;
  textNode;
  boarderWidth;
  text = "";
  /**
   * instantiate a new vitual Button-View
   * @param {{ id: string; tabOrder: number; location: any; boarderWidth: number; size: { width: number; height: number; }; radius: any; text: string; fontSize: any; color: string; fontColor: string; }} el
   */
  constructor(el) {
    this.name = el.id;
    this.zOrder = 0;
    this.tabOrder = el.tabOrder || 0;
    this.location = el.location;
    this.boarderWidth = el.boarderWidth || 1;
    this.size = el.size || { width: 50, height: 30 };
    this.enabled = true;
    this.path = this.buildPath(el.radius || 10);
    this.textNode = new TextElem(
      {
        kind: "TextElem",
        idx: -1,
        tabOrder: 0,
        id: this.name + "Label",
        text: el.text || "",
        location: { left: this.location.left + 10, top: this.location.top + 10 },
        size: { width: this.size.width - 20, height: this.size.height - 20 },
        //this.size,
        fontSize: el.fontSize || 18,
        bind: true
      }
    );
    this.color = el.color || "red";
    this.fontColor = el.fontColor || "white";
    this.text = el.text || "??";
    this.render();
    signals.on(
      "UpdateButton",
      this.name,
      (data) => {
        this.enabled = data.enabled;
        this.color = data.color;
        this.text = data.text;
        this.update();
      }
    );
  }
  /**
   * build the Path2D
   * @param {number} radius
   */
  buildPath(radius) {
    const path = new Path2D();
    path.roundRect(
      this.location.left,
      this.location.top,
      this.size.width,
      this.size.height,
      radius
    );
    return path;
  }
  /** 
   * called from core/systemEvents when this element is touched
   * fires an event on the eventBus to inform VMs 
   */
  touched() {
    if (this.enabled) {
      signals.fire("ButtonTouched", this.name, null);
    }
  }
  /** 
   * updates and renders this view 
   * called from /core/systemEvents (hover test) 
   */
  update() {
    this.render();
  }
  /** 
   * render this Button view onto the canvas 
   */
  render() {
    ctx.save();
    ctx.lineWidth = this.boarderWidth;
    ctx.strokeStyle = this.hovered ? "orange" : "black";
    ctx.stroke(this.path);
    ctx.fillStyle = this.color;
    ctx.fill(this.path);
    ctx.fillStyle = "white";
    ctx.restore();
    this.textNode.fillColor = this.color;
    this.textNode.fontColor = this.fontColor;
    this.textNode.text = this.text;
    this.textNode.update();
  }
};
__name(Button, "Button");

// views/CheckBox.js
var CheckBox_exports = {};
__export(CheckBox_exports, {
  default: () => CheckBox
});
var CheckBox = class {
  id = 0;
  activeView = true;
  index = -1;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  path;
  size;
  location;
  color;
  fontColor;
  boarderWidth;
  fontSize;
  text = "";
  checked = false;
  /**
   * instantiate a new vitual CheckBox-View
   * @param {{ id: string; tabOrder: number; location: { left: any; top: any; }; boarderWidth: number; size: { width: number; height: number; }; radius: any; color: string; fontColor: string; text: string; fontSize: number; }} el
   */
  constructor(el) {
    this.name = el.id;
    this.zOrder = 0;
    this.tabOrder = el.tabOrder || 0;
    this.location = el.location;
    const { left: left3, top: top2 } = el.location;
    this.boarderWidth = el.boarderWidth || 1;
    this.size = el.size || { width: 50, height: 30 };
    const { width, height } = this.size;
    this.enabled = true;
    this.path = this.buildPath(el.radius || 0);
    this.color = el.color || "red";
    this.fontColor = el.fontColor || "white";
    this.text = el.text || "??";
    this.fontSize = el.fontSize || 24;
    this.render();
    signals.on(
      "UpdateCheckBox",
      this.name,
      (data) => {
        this.checked = data.checked;
        this.color = data.color;
        this.text = data.text;
        this.update();
      }
    );
  }
  /**
   * build the Path2D
   * @param {number} radius
   */
  buildPath(radius) {
    const path = new Path2D();
    path.roundRect(
      this.location.left,
      this.location.top,
      this.size.width,
      this.size.height,
      radius
    );
    return path;
  }
  /** 
   * called from core/systemEvents when this element is touched
   * fires an event on the eventBus to inform VMs 
   */
  touched() {
    if (this.enabled) {
      signals.fire("CheckBoxTouched", this.name, { checked: this.enabled });
    }
  }
  /** 
   * updates and renders this view 
   * called from /core/systemEvents (hover test) 
   */
  update() {
    this.render();
  }
  /** 
   * render this Button view onto the canvas 
   */
  render() {
    ctx.save();
    ctx.lineWidth = 8;
    ctx.strokeStyle = this.hovered ? "orange" : "black";
    ctx.stroke(this.path);
    ctx.fillStyle = this.color;
    ctx.fill(this.path);
    ctx.fillStyle = "white";
    ctx.restore();
    ctx.save();
    ctx.font = `${this.fontSize}px Tahoma, Verdana, sans-serif`;
    ctx;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "limegreen";
    ctx.fillRect(this.location.left, this.location.top, this.size.width, this.size.height);
    ctx.fillStyle = this.fontColor;
    const top2 = this.location.top + this.size.height * 0.5;
    const left3 = this.location.left + this.size.width * 0.5;
    ctx.fillText(this.text + " ", left3, top2);
    ctx.restore();
  }
};
__name(CheckBox, "CheckBox");

// views/Container.js
var Container_exports = {};
__export(Container_exports, {
  default: () => Container
});

// views/Scrollbar.js
var Scrollbar = class {
  container;
  mousePos = 0;
  dragging = false;
  hovered = false;
  visible = true;
  left = 0;
  top = 0;
  width = 0;
  height = 0;
  fill;
  cursor;
  path;
  /**
   * Scrollbar ctor
   * @param {*} host
   */
  constructor(host) {
    this.container = host;
    this.left = host.left + host.width - host.scrollBarWidth, this.top = host.top;
    this.height = host.height, this.width = host.scrollBarWidth;
    this.fill = "#dedede";
    this.cursor = {
      index: 0,
      top: 0,
      bottom: host.height - host.scrollBarWidth,
      left: this.left + this.width - host.scrollBarWidth,
      width: host.scrollBarWidth,
      length: host.scrollBarWidth,
      fill: "#bababa"
    };
    this.path = new Path2D();
    this.path.rect(
      this.left,
      this.top,
      this.width - 2,
      this.height
    );
    this.mousePos = 0;
  }
  /**
   * called from - container.js - 97
   * @param {number} ItemsLength
   * @param {number} capacity
   */
  render(ItemsLength, capacity) {
    const ratio = capacity / ItemsLength;
    this.cursor.length = 100;
    ctx.save();
    ctx.fillStyle = this.fill;
    ctx.fill(this.path);
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.cursor.left,
      this.container.top + this.cursor.top,
      this.cursor.width,
      this.cursor.length
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.hovered ? "orange" : "#bababa";
    ctx.stroke(this.path);
    ctx.restore();
  }
  /**
   * called by the scroll event - container.js - 63
   * @param {number} delta
   */
  scroll(delta) {
    const { height, lineHeight, rowCapacity, top: top2 } = this.container;
    this.cursor.index -= delta;
    if (this.cursor.index < 0)
      this.cursor.index = 0;
    const newTop = this.cursor.index * lineHeight;
    if (newTop + this.cursor.length >= height + top2) {
    } else {
      this.cursor.top = newTop;
    }
    if (this.cursor.top < 0)
      this.cursor.top = 0;
    this.container.render();
  }
};
__name(Scrollbar, "Scrollbar");

// views/Container.js
var Container = class {
  id = 0;
  activeView = true;
  index = 1;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  path;
  height;
  width;
  padding = 10;
  left = 0;
  top = 0;
  color;
  lineHeight = 0;
  showPlaceholder = true;
  scrollBarWidth = 25;
  /** the number of characters that will fit in this width */
  textCapacity = 0;
  /** number of rows that will fit container height */
  rowCapacity = 0;
  scrollBar;
  /**
   * Container ctor
   * @param { { id: string; tabOrder: number; location: 
   * { left: number; top: number; }; 
   * size: { width: number; height: number; }; 
   * color: string; 
   * }
   * } el
   */
  constructor(el) {
    this.name = el.id;
    this.tabOrder = el.tabOrder || 0;
    this.left = el.location.left;
    this.top = el.location.top;
    this.width = el.size?.width ?? 100;
    this.height = el.size?.height ?? 40;
    this.color = el.color || "white";
    this.path = new Path2D();
    this.path.rect(
      this.left,
      this.top,
      this.width,
      this.height
    );
    this.scrollBar = new Scrollbar(this);
    signals.on("Scroll", "", (evt) => {
      this.scrollBar.scroll(evt.deltaY);
    });
    signals.on("TextMetrics", this.name, (data) => {
      this.textCapacity = data.capacity.columns - 1;
      this.rowCapacity = data.capacity.rows;
    });
  }
  touched() {
  }
  update() {
    this.render();
  }
  render() {
    ctx.save();
    ctx.lineWidth = 2;
    if (this.focused === false) {
      ctx.strokeStyle = this.hovered ? "orange" : "black";
      ctx.fillStyle = this.color;
    } else {
      ctx.strokeStyle = "blue";
      ctx.fillStyle = "white";
    }
    ctx.stroke(this.path);
    ctx.fill(this.path);
    ctx.restore();
    if (this.focused === true) {
      this.scrollBar.render(50, 27);
    }
  }
};
__name(Container, "Container");

// views/Popup.js
var Popup_exports = {};
__export(Popup_exports, {
  default: () => Popup
});
var left = 1;
var top = 1;
var Popup = class {
  id = 0;
  // assigned by activeViews.add() 
  index = -1;
  activeView = true;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  path;
  shownPath;
  hiddenPath;
  location;
  size;
  color = "black";
  textNode;
  text = "";
  fontColor = "red";
  fontSize = 28;
  visible = true;
  /**
   * ctor that instantiates a new vitual Popup view
   * @param {{ tabOrder: number; location: any; size: 
   * { width: number; height: number; }; 
   * radius: any; 
   * fontSize: number; 
   * text: any; }
   * } el
   */
  constructor(el) {
    this.tabOrder = el.tabOrder || 0;
    this.enabled = true;
    this.color = "white";
    this.location = el.location;
    this.hiddenPath = new Path2D();
    this.hiddenPath.rect(1, 1, 1, 1);
    this.size = el.size || { width: 300, height: 300 };
    this.shownPath = this.buildPath(el.radius || 30);
    this.path = this.hiddenPath;
    this.fontSize = el.fontSize || 24;
    this.textNode = new TextElem(
      {
        kind: "TextElem",
        idx: -1,
        tabOrder: 0,
        id: this.name + "Label",
        text: el.text || "",
        location: this.location,
        size: this.size,
        bind: true
      }
    );
    signals.on("ShowPopup", "", (data) => {
      this.show(data.msg);
    });
    signals.on("HidePopup", "", () => this.hide());
  }
  /**
   * build a Path2D
   * @param {number} radius
   */
  buildPath(radius) {
    const path = new Path2D();
    path.roundRect(this.location.left, this.location.top, this.size.width, this.size.height, radius);
    return path;
  }
  /**
   * show the virtual Popup view
   * @param {string[]} msg
   */
  show(msg) {
    signals.fire("FocusPopup", " ", this);
    this.text = msg[0];
    left = this.location.left;
    top = this.location.top;
    this.path = this.shownPath;
    this.visible = true;
    setHasVisiblePopup(true);
    this.render();
  }
  /** hide the virtual Popup view */
  hide() {
    if (this.visible) {
      left = 1;
      top = 1;
      this.path = this.hiddenPath;
      this.visible = false;
      setHasVisiblePopup(false);
    }
  }
  /** called from Surface/canvasEvents when this element has been touched */
  touched() {
    this.hide();
    signals.fire("PopupReset", "", null);
  }
  /** update this virtual Popups view (render it) */
  update() {
    if (this.visible)
      this.render();
  }
  /** render this virtual Popup view */
  render() {
    ctx.save();
    ctx.shadowColor = "#404040";
    ctx.shadowBlur = 45;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = windowCFG.containerColor;
    ctx.fill(this.path);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = 1;
    ctx.strokeStyle = windowCFG.textColor;
    ctx.stroke(this.path);
    this.textNode.fontSize = this.fontSize;
    this.textNode.fillColor = this.color;
    this.textNode.fontColor = this.fontColor;
    this.textNode.text = this.text;
    this.textNode.update();
    ctx.restore();
    this.visible = true;
  }
};
__name(Popup, "Popup");

// views/TextArea.js
var TextArea_exports = {};
__export(TextArea_exports, {
  default: () => TextArea
});

// viewModels/constants.js
var HAIRSPACE = "\u200A";
var CARETBAR = "|";
var PLACEHOLDER = "\u200B";
var EDIT = "\u270D";
var CLOSE = "\u274C";
var CUT = "\u2702";
var CHECKEDBOX = "\u2705";
var TRASH = "\u{1F9FA}";
var CHECKMARK = "\u2714";

// views/TextArea.js
var caretChar = HAIRSPACE;
var placeholder = "text";
var TextArea = class extends Container {
  id = 0;
  activeView = true;
  index = 1;
  zOrder = 0;
  tabOrder = 0;
  name = "";
  enabled = true;
  hovered = false;
  focused = false;
  log = false;
  path;
  size;
  padding = 10;
  location;
  color;
  fontColor;
  lineHeight = 0;
  text = "";
  lines = [];
  trimmedLeft = "";
  trimmedRight = "";
  insertionColumn = 0;
  insertionRow = 0;
  selectStart = 0;
  selectEnd = 0;
  widthPerChar = 15;
  solidCaret = true;
  /** 
   * the number of characters that will fit in this width  
   */
  textCapacity = 0;
  rowCapacity = 0;
  showPlaceholder = true;
  fontSize;
  /**
   * @param {{ id: any; tabOrder: any; location: any; size: any; color: any; fontSize?: any; }} el
   */
  constructor(el) {
    super(el);
    this.name = el.id;
    this.tabOrder = el.tabOrder || 0;
    this.location = el.location;
    this.size = el.size || { width: 100, height: 40 };
    this.color = el.color || "white";
    this.fontColor = "black";
    this.fontSize = el.fontSize || 28;
    this.getMetrics();
    this.path = new Path2D();
    this.path.rect(
      this.location.left,
      this.location.top,
      this.size.width,
      this.size.height
    );
    signals.fire(
      "TextMetrics",
      this.name,
      {
        size: this.size,
        capacity: { rows: this.rowCapacity, columns: this.textCapacity }
      }
    );
    signals.on("Blink", "", (data) => {
      this.solidCaret = data;
      this.render();
      console.log("Blink");
    });
    signals.on(
      "UpdateTextArea",
      this.name,
      (data) => {
        const {
          _reason,
          text,
          lines,
          focused,
          insertionColumn,
          insertionRow,
          selectStart,
          selectEnd
        } = data;
        this.insertionColumn = insertionColumn;
        this.insertionRow = insertionRow;
        this.selectStart = selectStart;
        this.selectEnd = selectEnd;
        this.focused = focused;
        this.lines = lines;
        this.text = text;
        this.showPlaceholder = this.text.length === 0;
        if (this.focused === true) {
          caretChar = CARETBAR;
        }
        let str = "";
        for (const line of this.lines) {
          str += `${JSON.stringify(line)}
            `;
        }
        const A = true;
        if (A)
          console.log(` 
         focused: ${this.focused} insertionRow: ${this.insertionRow} 
         highlighted text: ${text.substring(this.selectStart, this.selectEnd)}
         selection -- start: ${this.selectStart}, end: ${this.selectEnd} 
         insertion -- row: ${this.insertionRow}, column: ${this.insertionColumn}
         ${str}`, "TextArea.UpdateTextArea");
        this.render();
      }
    );
    this.render();
  }
  getMetrics() {
    ctx.font = `${this.fontSize}px Tahoma, Verdana, sans-serif`;
    const t = "This is a test! A very very long text!";
    const m = ctx.measureText(t);
    this.lineHeight = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
    this.size.height = this.size.height;
    this.widthPerChar = m.width / t.length;
    this.textCapacity = this.size.width / this.widthPerChar;
  }
  getUnusedSpace() {
    return this.size.width - ctx.measureText(this.text).width;
  }
  touched() {
    signals.fire("TextViewTouched", this.name, null);
  }
  update() {
    this.render();
  }
  /** render the container and text */
  render() {
    super.render();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.save();
    if (this.focused === true) {
      caretChar = CARETBAR;
    } else {
      caretChar = "";
    }
    let lineNumber = 0;
    for (const line of this.lines) {
      if (line.length <= 0)
        continue;
      const textTop = this.location.top + this.lineHeight * (lineNumber + 1);
      if (this.showPlaceholder && this.focused === false) {
        ctx.fillStyle = "Gray";
        ctx.fillText(
          placeholder,
          this.location.left + this.padding,
          textTop
        );
      } else {
        let txt2 = "";
        this.positionCaret(line.text);
        if (line.hasSelection)
          this.renderHighlight(line);
        txt2 = this.insertionRow === lineNumber ? this.trimmedLeft + caretChar + this.trimmedRight : line.text;
        ctx.fillStyle = this.fontColor;
        ctx.fillText(
          txt2,
          this.location.left + this.padding,
          textTop
        );
      }
      ctx.restore();
      lineNumber++;
    }
  }
  /**
   * locate Caret
   * @param {string} line
   */
  positionCaret(line) {
    const col = this.insertionColumn;
    this.trimmedLeft = line.substring(0, col);
    this.trimmedRight = line.substring(col);
  }
  /**
   * Highlight selected text
   * @param {{ start: number; end: number; index: any; }} line
   */
  renderHighlight(line) {
    const { lineHeight, padding, location, selectStart, selectEnd, text } = this;
    const rectX = selectStart <= line.start ? 0 : ctx.measureText(text.substring(line.start, selectStart)).width;
    const endFrom = selectStart > line.start ? selectStart : line.start;
    const endTo = selectEnd >= line.end ? line.end : selectEnd;
    const rectWidth = ctx.measureText(text.substring(endFrom, endTo)).width;
    const rectY = location.top + lineHeight * line.index + padding;
    ctx.fillStyle = "lightblue";
    ctx.fillRect(
      location.left + padding + rectX,
      rectY,
      rectWidth,
      lineHeight
    );
  }
};
__name(TextArea, "TextArea");

// base_manifest.js
var baseManifest = {
  views: {
    "./views/Button.js": Button_exports,
    "./views/CheckBox.js": CheckBox_exports,
    "./views/Container.js": Container_exports,
    "./views/Popup.js": Popup_exports,
    "./views/TextElem.js": TextElem_exports,
    "./views/TextArea.js": TextArea_exports
  },
  baseUrl: import.meta.url
};
var base_manifest_default = baseManifest;

// events/signals.js
var signals = buildSignalAggregator();
function buildSignalAggregator() {
  const eventHandlers = /* @__PURE__ */ new Map();
  const newSignalAggregator = {
    /** 
     * on - registers a handler function to be executed when a signal is sent
     *  
     * @param {*} signalName - signal name (one of `TypedEvents` only)!
     * @param {string} id - id of a target element (may be an empty string)
     * @param {*} handler - eventhandler callback function
     */
    on(signalName, id, handler) {
      const keyName = signalName + "-" + id;
      if (eventHandlers.has(keyName)) {
        const handlers = eventHandlers.get(keyName);
        handlers.push(handler);
      } else {
        eventHandlers.set(keyName, [handler]);
      }
    },
    /** 
     * Execute all registered handlers for a strongly-typed signal (signalName)
     * @param {*} signalName - signal name - one of `TypedEvents` only!
     * @param {string} id - id of a target element (may be an empty string)
     * @param {*} data - data payload, typed for this category of signal
     */
    fire(signalName, id, data) {
      const keyName = signalName + "-" + id;
      const handlers = eventHandlers.get(keyName);
      if (handlers) {
        for (const handler of handlers) {
          handler(data);
        }
      }
    }
  };
  return newSignalAggregator;
}
__name(buildSignalAggregator, "buildSignalAggregator");

// render/renderContext.js
var windowCFG = {
  containerColor: "snow",
  textColor: "black"
};
var elementDescriptors;
var appManifest;
var initCFG = /* @__PURE__ */ __name((theCanvas, cfg, applicationManifest) => {
  canvas = theCanvas;
  windowCFG = cfg.winCFG;
  elementDescriptors = cfg.nodes;
  appManifest = applicationManifest;
}, "initCFG");
var fontColor = "white";
var getFactories = /* @__PURE__ */ __name(() => {
  const baseUrl = new URL("./", appManifest.baseUrl).href;
  console.log(`baseUrl ${baseUrl}`);
  const factories2 = /* @__PURE__ */ new Map();
  for (const [self2, module] of Object.entries(base_manifest_default.views)) {
    const url = new URL(self2, baseUrl).href;
    const path = self2.substring("views/".length);
    const name = sanitizeName(path.substring(1, path.length - 3));
    const id = name.toLowerCase();
    factories2.set(id, { id, name, url, component: module.default });
  }
  if (appManifest.views) {
    for (const [self2, module] of Object.entries(appManifest.views)) {
      const url = new URL(self2, baseUrl).href;
      const path = self2.substring("views/".length);
      const name = sanitizeName(path.substring(1, path.length - 3));
      const id = name.toLowerCase();
      factories2.set(id, { id, name, url, component: module.default });
    }
  }
  return factories2;
}, "getFactories");
var hasVisiblePopup = false;
var setHasVisiblePopup = /* @__PURE__ */ __name((val) => hasVisiblePopup = val, "setHasVisiblePopup");
var tickCount = 0;
var solid = true;
var incrementTickCount = /* @__PURE__ */ __name(() => {
  tickCount++;
  if (tickCount > 60) {
    tickCount = 0;
    solid = !solid;
    signals.fire("Blink", "", solid);
  }
}, "incrementTickCount");
var canvas;
var ctx;
var setupRenderContext = /* @__PURE__ */ __name((canvas2) => {
  ctx = /** @type {CanvasRenderingContext2D}*/
  canvas2.getContext("2d");
  refreshCanvasContext();
}, "setupRenderContext");
var refreshCanvasContext = /* @__PURE__ */ __name(() => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = windowCFG.containerColor;
  ctx.fillStyle = windowCFG.containerColor;
  ctx.font = "28px Tahoma, Verdana, sans-serif";
  ctx.textAlign = "center";
}, "refreshCanvasContext");
function toPascalCase(text) {
  return text.replace(
    /(^\w|-\w)/g,
    (substring) => substring.replace(/-/, "").toUpperCase()
  );
}
__name(toPascalCase, "toPascalCase");
function sanitizeName(name) {
  const fileName = name.replace("/", "");
  return toPascalCase(fileName);
}
__name(sanitizeName, "sanitizeName");

// render/activeNodes.js
var activeNodes = /* @__PURE__ */ new Set();
var addNode = /* @__PURE__ */ __name((view) => {
  activeNodes.add(view);
  signals.fire(
    "AddedView",
    "",
    {
      type: view.constructor.name,
      index: view.index,
      name: view.name
    }
  );
}, "addNode");
var renderNodes = /* @__PURE__ */ __name(() => {
  incrementTickCount();
  if (ctx) {
    const { width, height } = ctx.canvas;
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "snow";
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, width, height);
    ctx.restore();
    for (const el of activeNodes) {
      el.update();
    }
  }
}, "renderNodes");

// events/systemEvents.js
var left2 = 0;
var x = 0;
var y = 0;
var boundingRect = null;
var hit = false;
var node = null;
var hoveredNode = null;
var focusedNode = null;
function initHostEvents() {
  addEventListener("input", (evt) => {
    if (focusedNode !== null) {
      signals.fire("WindowInput", focusedNode.name, evt);
    }
  });
  addEventListener("keydown", (evt) => {
    let focusNum = 0;
    if (evt.code === "Tab") {
      if (focusedNode !== null) {
        const direction = evt.shiftKey ? -1 : 1;
        focusNum = focusNext(focusedNode.tabOrder + direction, evt.shiftKey);
      } else {
        focusNum = focusNext(1, evt.shiftKey);
      }
      if (focusNum === 0) {
        const last = evt.shiftKey ? 20 : 1;
        focusNext(last, evt.shiftKey);
      }
      return;
    }
    if (evt.code === "Enter") {
      if (hasVisiblePopup === true) {
        signals.fire(`PopupReset`, "", null);
      } else if (focusedNode !== null) {
        focusedNode.touched();
      }
    }
    if (focusedNode !== null) {
      signals.fire("WindowKeyDown", focusedNode.name, evt);
    }
  });
  addEventListener("mousedown", (evt) => {
    evt.preventDefault();
    if (evt.button === left2) {
      if (hasVisiblePopup === false) {
        handleClickOrTouch(evt.pageX, evt.pageY);
      } else {
        signals.fire(`PopupReset`, "", null);
      }
    }
  }, false);
  addEventListener("mousemove", (evt) => {
    evt.preventDefault();
    if (hasVisiblePopup === false) {
      handleMouseMove(evt);
    }
  });
  addEventListener("scroll", (evt) => {
    evt.preventDefault();
  });
}
__name(initHostEvents, "initHostEvents");
function handleMouseMove(evt) {
  boundingRect = canvas.getBoundingClientRect();
  x = evt.clientX - boundingRect.x;
  y = evt.clientY - boundingRect.y;
  node = null;
  for (const n of activeNodes) {
    if (ctx.isPointInPath(n.path, x, y)) {
      node = n;
    }
  }
  if (node !== null) {
    if (node !== hoveredNode) {
      clearHovered();
      node.hovered = true;
      node.update();
      hoveredNode = node;
      document.documentElement.style.cursor = "hand";
    }
  } else {
    if (hoveredNode !== null) {
      clearHovered();
      hoveredNode = null;
    }
  }
}
__name(handleMouseMove, "handleMouseMove");
function handleClickOrTouch(mX, mY) {
  x = mX - canvas.offsetLeft;
  y = mY - canvas.offsetTop;
  hit = false;
  for (const node2 of activeNodes) {
    if (!hit) {
      if (ctx.isPointInPath(node2.path, x, y)) {
        node2.touched();
        clearFocused();
        focusedNode = node2;
        if (focusedNode)
          signals.fire("Focused", focusedNode.name, true);
        hit = true;
      }
    }
  }
  if (!hit)
    clearFocused();
}
__name(handleClickOrTouch, "handleClickOrTouch");
function clearFocused() {
  if (focusedNode !== null) {
    focusedNode.focused = false;
    focusedNode.hovered = false;
    signals.fire("Focused", focusedNode.name, focusedNode.focused);
    focusedNode.update();
  }
}
__name(clearFocused, "clearFocused");
function clearHovered() {
  document.documentElement.style.cursor = "arrow";
  if (hoveredNode !== null) {
    hoveredNode.hovered = false;
    hoveredNode.update();
  }
}
__name(clearHovered, "clearHovered");
function focusNext(target, _shift) {
  hit = false;
  for (const node2 of activeNodes) {
    if (hit === false) {
      if (node2.tabOrder === target) {
        clearFocused();
        clearHovered();
        focusedNode = node2;
        if (focusedNode) {
          focusedNode.focused = true;
          focusedNode.hovered = true;
          focusedNode.update();
          signals.fire("Focused", focusedNode.name, true);
        }
        hit = true;
      }
    }
  }
  return hit === false ? 0 : target;
}
__name(focusNext, "focusNext");

// render/uiContainer.js
var factories;
function containerInit(canvas2, cfg, manifest) {
  initCFG(canvas2, cfg, manifest);
  setupRenderContext(canvas2);
  initHostEvents();
}
__name(containerInit, "containerInit");
var render = /* @__PURE__ */ __name(() => {
  renderNodes();
}, "render");
var hydrateUI = /* @__PURE__ */ __name(() => {
  factories = getFactories();
  for (const el of elementDescriptors) {
    addElement(el);
  }
}, "hydrateUI");
function addElement(el) {
  const thisKind = el.kind.toLowerCase();
  if (factories.has(thisKind)) {
    const View = factories.get(thisKind).component;
    addNode(new View(el));
  } else {
    const errMsg = `No view named ${el.kind} was found! 
Make sure your view_manifest is up to date!`;
    console.error(errMsg);
    throw new Error(errMsg);
  }
}
__name(addElement, "addElement");

// viewModels/button.js
var thisID;
var initButton = /* @__PURE__ */ __name((id) => {
  thisID = id;
  signals.on("ButtonTouched", thisID, () => {
    signals.fire("ShowPopup", "", { title: "", msg: [""] });
  });
}, "initButton");

// viewModels/checkBox.js
var thisID2;
var checked = false;
var txt = "  ";
var checkmark = " \u2705";
var empty = "  ";
var initCheckbox = /* @__PURE__ */ __name((id) => {
  thisID2 = id;
  signals.on("CheckBoxTouched", thisID2, () => {
    checked = !checked;
    txt = checked ? checkmark : empty;
    signals.fire(
      "UpdateButton",
      thisID2,
      { text: txt, color: "green", enabled: true }
    );
  });
}, "initCheckbox");

// viewModels/closeButton.js
var thisID3;
var initCloseButton = /* @__PURE__ */ __name((id) => {
  thisID3 = id;
  signals.on("ButtonTouched", thisID3, () => {
    console.log("window.close");
    self.close();
  });
}, "initCloseButton");

// constants.js
var InsertAt = {
  Calc: "Caluculate",
  LineStart: "LineStart",
  LineEnd: "LineEnd",
  TxtStart: "TextStart",
  TxtEnd: "TextEnd"
};

// viewModels/textUtilities.js
var clipboard = "";
function setClipboard(txt2) {
  clipboard = txt2;
}
__name(setClipboard, "setClipboard");
function handleEditEvents(editor, evt) {
  if (evt.code === "KeyA") {
    editor.selectStart = 0;
    editor.selectEnd = editor.fullText.length;
    for (const line of editor.lines) {
      line.hasSelection = true;
    }
    editor.updateText(editor.id, true, "Select-All");
  }
  if (evt.code === "KeyX") {
    if (editor.insertionColumn >= editor.selectEnd) {
      editor.insertionColumn = editor.selectStart;
    }
    const selection = getSelectedText(editor);
    if (selection.length > 0) {
      setClipboard(selection);
      removeSelection(editor);
      editor.refreshLines();
    }
  }
  if (evt.code === "KeyC") {
    let selected = getSelectedText(editor);
    if (selected.length > 0) {
      setClipboard(selected);
      editor.selecting = false;
      editor.selectEnd = 0;
      editor.selectStart = 0;
      editor.refreshLines();
    }
  }
  if (evt.code === "KeyV") {
    insertChars(editor, clipboard);
  }
}
__name(handleEditEvents, "handleEditEvents");
function getSelectedText(editor) {
  if (editor.selectStart === 0 && editor.selectEnd === 0)
    return "";
  return editor.fullText.substring(editor.selectStart, editor.selectEnd - 1);
}
__name(getSelectedText, "getSelectedText");
function removeSelection(editor) {
  let left3 = editor.fullText.substring(0, editor.selectStart);
  let right = editor.fullText.substring(editor.selectEnd);
  editor.fullText = left3 + right;
  editor.refreshLines();
}
__name(removeSelection, "removeSelection");
function insertChars(editor, chars = clipboard) {
  editor.resetSelectionState();
  if (chars === "\n") {
    chars += PLACEHOLDER;
    editor.insertionColumn = 0;
  } else {
    editor.insertionColumn += 1;
  }
  if (editor.insertionIndex < editor.fullText.length) {
    let left3 = editor.fullText.substring(0, editor.insertionIndex);
    let right = editor.fullText.substring(editor.insertionIndex);
    editor.fullText = left3 + chars + right;
    editor.insertionColumn += chars.length - 1;
  } else {
    editor.fullText += chars;
    editor.insertionColumn += chars.length;
  }
  editor.refreshLines();
}
__name(insertChars, "insertChars");
function isBetween(point, start, end) {
  return point >= start && point <= end;
}
__name(isBetween, "isBetween");

// viewModels/textToLines.js
function getLines(text, width) {
  const lines = [];
  const maxWidth = width;
  let currentLine = "";
  let finalWidth = 0;
  if (text.length <= 1) {
    text = PLACEHOLDER;
  }
  const parts = text.split(" ");
  for (const part of parts) {
    for (const [i, word] of part.split("\n").entries()) {
      if (i > 0) {
        finalWidth = Math.max(finalWidth, ctx.measureText(currentLine).width);
        lines.push(currentLine);
        currentLine = word;
        if (ctx.measureText(currentLine).width > maxWidth) {
          currentLine = charLines(lines, currentLine, maxWidth, finalWidth);
        }
        continue;
      }
      const spacer = currentLine === "" ? "" : " ";
      const width2 = ctx.measureText(currentLine + spacer + word).width;
      if (width2 <= maxWidth) {
        currentLine += spacer + word;
      } else {
        if (ctx.measureText(word).width > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
          currentLine = charLines(lines, currentLine, maxWidth, finalWidth);
        } else {
          finalWidth = Math.max(finalWidth, ctx.measureText(currentLine).width);
          lines.push(currentLine);
          currentLine = word;
        }
      }
    }
  }
  finalWidth = Math.max(finalWidth, ctx.measureText(currentLine).width);
  lines.push(currentLine);
  return buildTextLines(lines);
}
__name(getLines, "getLines");
function buildTextLines(lineStrings) {
  let lastLength = 0;
  const lines = [];
  let i = 0;
  for (const txt2 of lineStrings) {
    if (txt2.length > 1) {
      if (txt2.startsWith(PLACEHOLDER)) {
      }
    }
    lines.push({
      index: i,
      text: txt2,
      start: lastLength,
      end: lastLength + txt2.length,
      length: txt2.length,
      hasSelection: false
    });
    lastLength += txt2.length + 1;
    i++;
  }
  return lines;
}
__name(buildTextLines, "buildTextLines");
function charLines(lines, currentLine, maxWidth, finalWidth) {
  const chars = currentLine.split("");
  let currentPart = "";
  for (const char of chars) {
    const charWidth = ctx.measureText(currentPart + char + "-").width;
    if (charWidth <= maxWidth) {
      currentPart += char;
    } else {
      finalWidth = Math.max(finalWidth, ctx.measureText(currentPart + "-").width);
      lines.push(currentPart + "-");
      currentPart = char;
    }
  }
  return currentPart;
}
__name(charLines, "charLines");

// viewModels/textEditor.js
var TextEditor = class {
  /** an identity string shared with a View  */
  id = "";
  //================================
  //       TextArea Metrics
  // passed in via TextMetrics event
  //================================
  /** the number of chars each line can show */
  textCapacity = 0;
  /** the number of rows this view can show */
  rowCapacity = 0;
  /** size of the View container (pixels) */
  containerSize = { width: 0, height: 0 };
  //================================
  //   strings
  //================================
  /** the current full text */
  fullText = "";
  /** fullText as an array of lines that fit the viewport */
  lines = [];
  //================================
  //   flags
  //================================
  /** does the client View have the focus? */
  focused = false;
  /** are we currently selecting text?  */
  selecting = false;
  //================================
  // pointers
  //================================
  insertionColumn = 0;
  insertionRow = 0;
  insertionIndex = 0;
  selectStart = 0;
  selectEnd = 0;
  /** 
   * LiveText constructor
   */
  constructor(id, text = "") {
    this.fullText = text;
    this.id = id;
    signals.on("TextMetrics", this.id, (data) => {
      this.containerSize = data.size;
      this.textCapacity = data.capacity.columns - 1;
      this.rowCapacity = data.capacity.rows;
      this.refreshLines(InsertAt.TxtEnd);
    });
    signals.on("TextViewTouched", this.id, () => {
      this.updateText(this.id, true, "TextViewTouched");
    });
    signals.on("Focused", this.id, (hasFocus) => {
      this.updateText(this.id, hasFocus, "Focused");
    });
    signals.on(`WindowInput`, this.id, (evt) => {
      insertChars(this, evt.data);
    });
    signals.on("WindowKeyDown", this.id, (evt) => {
      const { ctrlKey, shiftKey } = evt;
      if (ctrlKey) {
        handleEditEvents(this, evt);
        return;
      }
      this.focused = true;
      switch (evt.code) {
        case "Backspace":
          if (this.insertionColumn > 0 && this.insertionIndex > 0) {
            this.selectStart = this.insertionIndex - 1;
            this.selectEnd = this.insertionIndex;
            removeSelection(this);
            this.resetSelectionState();
          } else {
            if (this.insertionRow > 0) {
              this.insertionRow -= 1;
              this.insertionColumn = this.lines[this.insertionRow].length;
              this.refreshLines();
            }
            this.selectStart = this.insertionIndex - 1;
            this.selectEnd = this.insertionIndex;
            removeSelection(this);
            this.resetSelectionState();
          }
          break;
        case "Delete": {
          if (this.hasSelection() && shiftKey) {
            removeSelection(this);
            this.resetSelectionState();
          } else {
            if (this.insertionIndex < this.fullText.length) {
              this.selectStart = this.insertionIndex;
              this.selectEnd = this.insertionIndex + 1;
              removeSelection(this);
              this.resetSelectionState();
            }
          }
          break;
        }
        case "ArrowDown":
          if (this.hasText() === true) {
            if (this.insertionRow < this.lines.length - 1) {
              this.insertionRow += 1;
            }
            if (shiftKey) {
              if (!this.selecting) {
                this.selectStart = this.insertionIndex;
                this.selecting = true;
              }
              this.insertionColumn = this.lines[this.insertionRow].length;
              this.selectEnd = this.fullText.length;
            } else {
              this.resetSelectionState();
            }
          }
          this.updateInsertionPoint("DwnArrow");
          break;
        case "End":
          if (shiftKey) {
            if (!this.selecting) {
              this.selectStart = this.insertionIndex;
              this.selecting = true;
            }
            this.selectEnd = this.lines[this.insertionRow].end;
          } else {
            this.insertionColumn = this.lines[this.insertionRow].length;
            this.resetSelectionState();
          }
          this.updateInsertionPoint(`Home Shift = ${shiftKey}`);
          break;
        case "Enter":
          insertChars(this, "\n");
          break;
        case "Home":
          if (shiftKey) {
            if (!this.selecting) {
              this.selectEnd = this.insertionIndex;
              this.selecting = true;
            }
            this.selectStart = this.lines[this.insertionRow].start;
          } else {
            this.insertionColumn = 0;
            this.resetSelectionState();
          }
          this.updateInsertionPoint(`Home Shift = ${shiftKey}`);
          break;
        case "Insert":
          if (shiftKey) {
            insertChars(this);
            this.refreshLines();
          }
          break;
        case "ArrowLeft":
          if (this.insertionIndex > 0) {
            this.insertionColumn -= 1;
            if (this.insertionColumn < 0) {
              this.insertionRow -= 1;
              if (this.insertionRow < 0)
                this.insertionRow = 0;
              this.insertionColumn = this.lines[this.insertionRow].length;
            }
            if (shiftKey) {
              if (!this.selecting) {
                this.selectEnd = this.insertionIndex + 1;
                this.selecting = true;
              }
              this.selectStart = this.insertionIndex - 1;
            } else {
              this.resetSelectionState();
            }
            this.updateInsertionPoint(`LeftArrow Shift = ${shiftKey}`);
          }
          break;
        case "ArrowRight": {
          if (this.insertionIndex < this.fullText.length) {
            this.insertionColumn += 1;
            if (this.insertionColumn > this.lines[this.insertionRow].length) {
              this.insertionRow += 1;
              if (this.insertionRow > this.lines.length) {
                this.insertionRow = this.lines.length;
              } else {
                this.insertionColumn = 0;
              }
            }
            if (shiftKey) {
              if (this.insertionIndex < this.lines[this.insertionRow].end) {
                if (!this.selecting) {
                  this.selectStart = this.insertionIndex;
                  this.selecting = true;
                }
                this.selectEnd = this.insertionIndex + 1;
              }
            } else {
              this.resetSelectionState();
            }
          }
          this.updateInsertionPoint(`RightArrow Shift = ${shiftKey}`);
          break;
        }
        case "ArrowUp":
          if (this.hasText() === true) {
            if (this.insertionRow > 0) {
              this.insertionRow -= 1;
              if (shiftKey) {
                if (!this.selecting) {
                  this.selectEnd = this.insertionIndex;
                  this.selecting = true;
                }
                this.insertionColumn = 0;
                this.selectStart = 0;
              } else {
                this.resetSelectionState();
              }
            }
          }
          this.updateInsertionPoint("UpArrow");
          break;
        default:
          break;
      }
    });
  }
  /** resets selecting flag and start/end locations */
  resetSelectionState() {
    this.selecting = false;
    this.selectEnd = 0;
    this.selectStart = 0;
    for (const line of this.lines) {
      line.hasSelection = false;
    }
  }
  /**  fullText length > 0  */
  hasText() {
    return this.fullText.length > 0;
  }
  /** 
   * Create a new array of lines after any fullText mutation
   * Adjusts insertion point if line count was changed 
   */
  refreshLines(at = InsertAt.Calc) {
    const originalLineCnt = this.lines.length;
    this.lines = getLines(this.fullText, this.containerSize.width - 5);
    if (this.lines.length > originalLineCnt) {
      this.insertionRow += 1;
    } else if (this.lines.length < originalLineCnt) {
      if (this.insertionRow > this.lines.length - 1) {
        this.insertionRow = this.lines.length - 1;
        if (this.insertionRow < 0)
          this.insertionRow = 0;
      }
    }
    this.updateInsertionPoint("refreshLines", at);
  }
  /**
   * update the insertion column and row from insertion index
   * @param {string} from
   */
  updateInsertionPoint(from, insertAt = InsertAt.Calc) {
    switch (insertAt) {
      case InsertAt.Calc: {
        for (const line of this.lines) {
          this.testForSelection(line);
          if (this.insertionRow === line.index) {
            if (this.insertionColumn > line.length) {
              this.insertionColumn = line.length;
            }
            this.insertionIndex = line.start + this.insertionColumn;
          }
        }
        break;
      }
      case InsertAt.TxtStart:
        this.insertionRow = 0;
        this.insertionColumn = 0;
        this.insertionIndex = 0;
        break;
      case InsertAt.TxtEnd:
        this.insertionIndex = this.fullText.length;
        this.insertionRow = this.lastLineIndex();
        this.insertionColumn = this.lines[this.insertionRow].length;
        break;
      default:
        break;
    }
    this.updateText(this.id, true, from);
  }
  /** fullText has selection */
  hasSelection() {
    return this.selectEnd - this.selectStart > 0;
  }
  /**
   * this line has selection
   * @param {{ hasSelection?: any; start?: any; end?: any; }} line
   */
  testForSelection(line) {
    if (!this.hasSelection()) {
      line.hasSelection = false;
      return;
    }
    const { start, end } = line;
    if (isBetween(this.selectStart, start, end)) {
      line.hasSelection = true;
      return;
    }
    if (isBetween(this.selectEnd, start, end)) {
      line.hasSelection = true;
      return;
    }
  }
  /** get the index of our last line */
  lastLineIndex() {
    return this.lines.length - 1;
  }
  /**
   * Fire an event to update the host view
   * @param {string} id
   * @param {boolean} hasfocus
   * @param {string} reason
   */
  updateText(id, hasfocus, reason) {
    this.focused = hasfocus;
    signals.fire(
      "UpdateTextArea",
      id,
      {
        reason,
        text: this.fullText,
        lines: this.lines,
        focused: this.focused,
        insertionColumn: this.insertionColumn,
        insertionRow: this.insertionRow,
        selectStart: this.selectStart,
        selectEnd: this.selectEnd
      }
    );
  }
};
__name(TextEditor, "TextEditor");
export {
  Button_exports as Button,
  CARETBAR,
  CHECKEDBOX,
  CHECKMARK,
  CLOSE,
  CUT,
  Container_exports as Container,
  EDIT,
  HAIRSPACE,
  PLACEHOLDER,
  Popup_exports as Popup,
  TRASH,
  TextArea_exports as TextArea,
  TextEditor,
  TextElem_exports as TextElem,
  activeNodes,
  addElement,
  addNode,
  buildSignalAggregator,
  canvas,
  containerInit,
  ctx,
  elementDescriptors,
  fontColor,
  getFactories,
  getLines,
  handleEditEvents,
  hasVisiblePopup,
  hydrateUI,
  incrementTickCount,
  initButton,
  initCFG,
  initCheckbox,
  initCloseButton,
  initHostEvents,
  refreshCanvasContext,
  removeSelection,
  render,
  renderNodes,
  setHasVisiblePopup,
  setupRenderContext,
  signals,
  tickCount,
  windowCFG
};
