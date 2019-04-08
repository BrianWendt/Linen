/**
 * All 
 */
Linen.Model = class {

    /**
     * @param {Linen} Linen - The instance of Linen.
     */
    constructor(Linen) {
        this.Linen = Linen;
        this.dimensions = {
            x: 0,
            y: 0,
            width: "100%",
            height: "100%"
        };

        this.settings = {
            alignment: "left",
            bold: false,
            fillStyle: "#000000",
            filter: "none",
            fontFamily: "Arial",
            fontSize: "12pt",
            globalAlpha: 1,
            italic: false,
            lineCap: "butt",
            lineDashOffset: 0,
            textLineHeight: 1.2,
            lineJoin: "miter",
            lineWidth: 1,
            miterLimit: 10,
            shadowBlur: 0,
            shadowColor: "#000000",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            strokeStyle: "#000000",
            textAlign: "left",
            textBaseline: "top",
            v_alignment: "top",
            zindex: 1
        };

        this.fill = false;
        this.stroke = false;

    }

    /**
     * Get the dpi of the Linen instance
     * @return {number} dpi
     */
    dpi() {
        return this.Linen.dpi;
    }

    /**
     * Get the width of the element
     * @return {number} px
     */
    width() {
        return this.getDimensionPx("width");
    }

    /**
     * Get the height of the element
     * @return {number} px
     */
    height() {
        return this.getDimensionPx("height");
    }

    /**
     * Get the x positioning of the element with reference point considered.
     * @return {number} px
     */
    x() {
        var x = this.getDimensionPx("x"); //px
        var w = this.width(); //px
        switch (this.getDimension("alignment")) {
            case "center":
                return x - (w / 2);
            case "right":
                return x - w;
        }
        return x;
    }

    /**
     * Get the y positioning of the element with reference point considered.
     * @return {number} px
     */
    y() {
        const y = this.getDimensionPx("y"); //px
        const h = this.height(); //px
        switch (this.settings.v_alignment) {
            case "middle":
                return y - (h / 2);
            case "bottom":
                return y - h;
        }
        return y;
    }

    /**
     * Set the width of the element
     * @param {number} val - width
     * @return {self} self
     */
    setWidth(val) {
        return this.setDimension("width", val);
    }

    /**
     * Set the height of the element
     * @param {number} val - height
     * @return {self} self
     */
    setHeight(val) {
        return this.setDimension("height", val);
    }

    /**
     * Set the x positioning of the element
     * @param {number} val - x positioning
     * @return {self} self
     */
    setX(val) {
        return this.setDimension("x", val);
    }

    /**
     * Set the y positioning of the element
     * @param {number} val - y positioning
     * @return {self} self
     */
    setY(val) {
        return this.setDimension("y", val);
    }

    /**
     * Shorthand to set the x and y positioning of the element
     * @param {number} x - x positioning
     * @param {number} y - y positioning
     * @return {self} self
     */
    setXY(x, y) {
        return this.setX(x).setY(y);
    }

    /**
     * Set the x reference point for positioning
     * @param {string} val - left(default)|center|right
     * @return {self} self
     */
    setAlignment(val) {
        return this.setSetting("alignment", val.toLowerCase());
    }

    /**
     * Set the reference point for positioning to center
     * @return {self} self
     */
    center() {
        return this.setAlignment("center");
    }

    /**
     * Set the y reference point for positioning
     * @param {string} val - top(default)|middle|bottom
     * @return {self} self
     */
    setVAlignment(val) {
        return this.setSetting("v_alignment", val.toLowerCase());
    }

    /**
     * Set the y reference point for positioning to bottom
     * @return {self} self
     */
    middle() {
        return this.setVAlignment("middle");
    }

    /**
     * Enable or disable rendering the fill
     * @param {bool} bool - TRUE|FALSE
     * @return {self} self
     */
    setFill(bool) {
        return this.setProp("fill", bool);
    }

    /**
     * Enable or disable rendering the stroke
     * @param {bool} bool - TRUE|FALSE
     * @return {self} self
     */
    setStroke(bool) {
        return this.setProp("stroke", bool);
    }

    /**
     * Get the value in px of a 2d attribute.
     * @param {string} dimension - dimension name.
     * @return {mixed} value
     */
    getDimension(dimension) {
        return this.dimensions[dimension] || null;
    }

    /**
     * Get the value in px of a 2d attribute.
     * @param {string} dimension - dimension name.
     * @return {number} px
     */
    getDimensionPx(dimension) {
        const value = this.getDimension(dimension);
        if (value === null) {
            return 0;
        }
        const type = typeof value;
        switch (type) {
            case "string":
                return this.translateDimension(value, dimension);
            case "function":
                return value(this);
            case "number":
                return value;
            default:
                return 0;
        }
    }

    /**
     * Set the value of a given dimension.
     * @param {string} dimension - dimension name.
     * @param {*} value - mixed value
     * @return {self} self
     */
    setDimension(dimension, value) {
        this.dimensions[dimension] = value;
        return this;
    }

    /**
     * Get the value of a given setting.
     * @param {string} setting - setting name.
     * @return {string} value
     */
    getSetting(setting) {
        return this.settings[setting] || null;
    }

    /**
     * Set the value of a given setting.
     * @param {string} setting - setting name.
     * @param {*} value - mixed value
     * @return {self} self
     */
    setSetting(setting, value) {
        this.settings[setting] = value;
        return this;
    }

    /**
     * Set the value of a given property.
     * @param {string} prop - property name.
     * @param {*} value - mixed value
     * @return {self} self
     */
    setProp(prop, value) {
        this[prop] = value;
        return this;
    }

    /**
     * Get the canvas' context
     * @return {CanvasRenderingContext2D} instance of 2d context of Canvas
     */
    context() {
        return this.Linen.context();
    }

    /**
     * 
     * @param {string|number} value - The dimension raw value.
     * @param {string} dimension - The dimension name.
     * @returns {number} dimension in px
     */

    translateDimension(value, dimension = "") {
        return this.translateToPx(value, dimension);
    }

    translateToPx(value, dimension = "") {
        if (typeof value !== "string") {
            return value;
        }
        const pattern = /^([0-9.]+)([^0-9]+)/i;
        const parts = value.match(pattern);
        const number = parseFloat(parts[1]);
        const unit = parts[2].toLowerCase();
        switch (unit) {
            case "%":
                return Math.round(this.percentage(number, dimension));
            case "pt":
                return Math.round(number * (this.dpi() / 72));
            case "in":
                return Math.round(number * this.dpi());
            default:
                return number + "px";
    }
    }

    /**
     * Set the value of a given propery. Primarily for 2d attributes.
     * @param {number} px - px value to compare from.
     * @param {string} dimension - dimension name.
     * @return {number} px
     */
    percentage(px, dimension = "") {
        const n = px / 100;
        var o = 0;
        switch (dimension) {
            case "width":
            case "x":
            case "x2":
                o = this.context().canvas.width;
                break;
            case "height":
            case "y":
            case "y2":
                o = this.context().canvas.height;
                break;
            default:
                return 0;
        }
        return n * o;
    }

    render() {
        Object.assign(this.Linen.ctx, this.settings);
        this.setFont();
    }

    /**
     * Canvas 2d Context Settings
     */

    /**
     * Set the fillStyle to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_fillstyle.asp|w3schools}
     * @param {string} fillStyle - color|gradient|pattern
     * @return {self} self
     */
    setFillStyle(fillStyle) {
        return this.setSetting("fillStyle", fillStyle);
    }

    /**
     * Set the filter to be used for rendering.
     * @see {@link https://www.w3schools.com/cssref/css3_pr_filter.asp|w3schools}
     * @param {string} filter - none | blur() | brightness() | contrast() | drop-shadow() | grayscale() | hue-rotate() | invert() | opacity() | saturate() | sepia() | url();
     * @return {self} self
     */
    setFilter(filter) {
        return this.setSetting("fillter", filter);
    }

    /**
     * Set the font to be used for rendering.
     * @deprecated 0.1.0 Do not set font directly. Use setFontSize(), setFontFamily(), setBold(), and setItalic() on Linen.Text instead.
     * @access private
     * @see {@link https://www.w3schools.com/tags/canvas_font.asp|w3schools}
     * @return {self} self
     */
    setFont() {
        const font = [
            this.settings.bold ? "bold " : "",
            this.settings.italic ? "italic " : "",
            this.settings.fontSize + "px",
            " ",
            this.settings.fontFamily
        ];
        this.context().font = font.join("");
        return this.setSetting("font", font.join(""));
    }

    /**
     * Set the globalAlpha to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_globalalpha.asp|w3schools}
     * @param {float} globalAlpha - 1 being completely opaque and 0 being completely transparent
     * @return {self} self
     */
    setGlobalAlpha(globalAlpha) {
        return this.setSetting("globalAlpha", globalAlpha);
    }

    /**
     * Set the lineCap to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_linecap.asp|w3schools}
     * @param {string} lineCap - butt|round|square
     * @return {self} self
     */
    setLineCap(lineCap) {
        return this.setSetting("lineCap", lineCap);
    }

    /**
     * Set the lineJoin to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_linejoin.asp|w3schools}
     * @param {string} lineJoin - bevel|round|miter
     * @return {self} self
     */
    setLineJoin(lineJoin) {
        return this.setSetting("lineJoin", style);
    }

    /**
     * Set the lineWidth to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_linewidth.asp|w3schools}
     * @param {*} lineWidth - size in px, pt, inches (in), or percentage (%)
     * @return {self} self
     */
    setLineWidth(lineWidth) {
        return this.setSetting("lineWidth", this.translateToPx(lineWidth));
    }

    /**
     * Set the miterLimit to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_miterlimit.asp|w3schools}
     * @param {number} miterLimit - A positive number that specifies the maximum miter length.
     * @return {self} self
     */
    setMiterLimit(miterLimit) {
        return this.setSetting("miterLimit", miterLimit);
    }

    /**
     * Set the shadowBlur to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_shadowblur.asp|w3schools}
     * @param {number} shadowBlur - The blur level for the shadow.
     * @return {self} self
     */
    setShadowBlur(shadowBlur) {
        return this.setSetting("shadowBlur", shadowBlur);
    }

    /**
     * Set the shadowColor to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_shadowcolor.asp|w3schools}
     * @param {string} shadowColor - color|gradient|pattern
     * @return {self} self
     */
    setShadowColor(shadowColor) {
        return this.setSetting("shadowColor", shadowColor);
    }

    /**
     * Set the shadowOffsetX to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_shadowoffsetx.asp|w3schools}
     * @param {number} shadowOffsetX - A positive or negative number that defines the horizontal distance of the shadow from the shape.
     * @return {self} self
     */
    setShadowOffsetX(shadowOffsetX) {
        return this.setSetting("shadowOffsetX", this.translateToPx(shadowOffsetX));
    }

    /**
     * Set the shadowOffsetY to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_shadowoffsety.asp|w3schools}
     * @param {number} shadowOffsetY - A positive or negative number that defines the vertical distance of the shadow from the shape.
     * @return {self} self
     */
    setShadowOffsetY(shadowOffsetY) {
        return this.setSetting("shadowOffsetY", this.translateToPx(shadowOffsetY));
    }

    /**
     * Set the strokeStyle to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_strokestyle.asp|w3schools}
     * @param {string} strokeStyle - color|gradient|pattern
     * @return {self} self
     */
    setStrokeStyle(strokeStyle) {
        return this.setSetting("strokeStyle", strokeStyle);
    }

    /**
     * Set the textAlign to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_textalign.asp|w3schools}
     * @param {string} textAlign - center|end|left|right|start
     * @return {self} self
     */
    setTextAlign(textAlign) {
        return this.setSetting("textAlign", textAlign);
    }

    /**
     * Set the textBaseline to be used for rendering.
     * @see {@link https://www.w3schools.com/tags/canvas_textbaseline.asp|w3schools}
     * @param {string} textBaseline - alphabetic|top|hanging|middle|ideographic|bottom
     * @return {self} self
     */
    setTextBaseline(textBaseline) {
        return this.setSetting("textBaseline", textBaseline);
    }
};
