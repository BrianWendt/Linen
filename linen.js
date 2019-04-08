/*
 * This is the primary Linen class.
 * @author Brian Wendt
 */
var Linen = class {

    /**
     * @param {object} canvas - HTML DOM reference to canvas element
     */
    constructor(canvas) {
        this.canvas = null;
        
        this.elements = [];

        /*
         dpi
         72 - Standard Screen
         144 - Good preview DPI
         300 - Standard Printing DPI
         */
        this.dpi = 144;

        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingQuality = "high";
        
        this.elements = [];
    }

    /**
     * Factory to create Linen element and add it to the canvas.
     * @param {string} type
     * @returns {Object|Boolean}
     */
    addElement(type) {
        if (typeof Linen[type] !== "function") {
            console.log("cannot addElement ", type);
            console.log(type, " is ", typeof Linen[type]);
            return false;
        } else {
            const element = new Linen[type](this);
            this.elements.push(element);
            return element;
        }
    }

    /**
     * Get the canvas' context
     * @returns {CanvasRenderingContext2D}
     */
    context() {
        return this.ctx;
    }
    
    /**
     * Render the elements onto the canvas.
     */
    render() {
        this.elements.sort(function(a, b) {
            return (a.settings.zindex > b.settings.zindex);
        });
        this.elements.map(element => {
            element.render();
        });
    }
}
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
/**
 * Model for drawing rectangles
 */
Linen.Rectangle = class extends Linen.Model {

    /**
     * @param {Linen} Linen - The instance of Linen.
     */
    constructor(Linen) {
        super(Linen);
    }

    /**
     * Render the Rectangle on the Linen.canvas object
     */
    render() {
        super.render();
        this.context().beginPath();
        var width = super.width();
        var height = super.height();
        var x = super.x();
        var y = super.y();
        this.context().rect(x, y, width, height);
        if (this.fill) {
            this.context().fill();
        }
        if (this.stroke) {
            this.context().stroke();
        }
    }
};
/**
 * Model for drawing arcs (circle/oval)
 */
Linen.Arc = class extends Linen.Model {

    /**
     * @param {Linen} Linen - The instance of Linen.
     */
    constructor(Linen) {
        super(Linen);
        this.radius = 1;
        this.startAngle = 0;
        this.endAngle = (2 * Math.PI);
        this.anticlockwise = false;
        this.offsetXY = true;
    }

    /**
     * Set the radius
     * @param {number} val - radius
     * @return {self} self
     */
    setRadius(val) {
        return this.setProp('radius', val);
    }

    /**
     * Render the Arc on the Linen.Canvas object
     */
    render() {
        super.render()
        this.context().beginPath();
        this.dimensions.width = this.dimensions.height = (this.radius * 2);

        var x = super.x();
        var y = super.y();

        //correct for arc drawing from center.
        if (this.offsetXY) {
            x += this.radius;
            y += this.radius;
        }

        this.context().arc(x, y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
        if (this.fill) {
            this.context().fill();
        }
        if (this.stroke) {
            this.context().stroke();
        }
    }
};
/**
 * Model for drawing images
*/
Linen.Image = class extends Linen.Model {

    /**
     * @param {Linen} Linen - The instance of Linen.
     */
    constructor(Linen) {
        super(Linen);
        this.dimensions.width = 0;
        this.dimensions.height = 0;
        this.img = new Image;
    }

    /**
     * Set the url of the image.
     * @param {string} url - fully qualified URL of image to use
     * @return {self} self
     */
    setSrc(url) {
        this.img.src = url;
        return this;
    }

    /**
     * Render the Image on the Linen.Canvas object
     */
    render() {
        super.render()
        this.img.addEventListener("load", function () {
            this.drawImage();
        }.bind(this), false);
    }

    /**
     * Private callback method executed after image "load" event.
     * @access private
     */
    drawImage() {
        var width = super.width();
        var height = super.height();
        if (width < 1) {
            width = this.dimensions.width = this.img.width;
        }
        if (height < 1) {
            height = this.dimensions.height = this.img.height;
        }
        var x = super.x();
        var y = super.y();

        this.context().drawImage(this.img, x, y, width, height);
    }
};
/**
 * Model for drawing lines
*/
Linen.Line = class extends Linen.Model {

    /**
     * @param {Linen} Linen - The instance of Linen.
     */
    constructor(Linen) {
        super(Linen);
        this.dimensions.x2 = this.dimensions.y2 = 0;
    }

    /**
     * Set the start and end coordinates for the line to be rendered.
     * @param {number} x1 - Starting x position
     * @param {number} y1 - Starting y position
     * @param {number} x2 - Ending x position
     * @param {number} y2 - Ending y position
     * @return {Object} self
     */
    setCords(x1, y1, x2, y2) {
        this.setDimension("x", x1);
        this.setDimension("y", y1);
        this.setDimension("x2", x2);
        this.setDimension("y2", y2);
        return this;
    }

    /**
     * Render the Line on the Linen.Canvas object
     */
    render() {
        super.render();
        
        var x1 = super.x();
        var y1 = super.y();
        var x2 = super.getDimensionPx("x2");
        var y2 = super.getDimensionPx("y2");
        
        this.context().beginPath();
        this.context().moveTo(x1, y1);
        this.context().lineTo(x2, y2);
        this.context().stroke();
    }
};
/**
 * Model for drawing text
 */
Linen.Text = class extends Linen.Model {

    /**
     * @param {Linen} Linen - The instance of Linen.
     */
    constructor(Linen) {
        super(Linen);
        this.wrap = false;
        this.text = '';
    }

    /**
     * set whether to wrap text or not.
     * @param {boolean} bool
     * @returns {self} self
     */
    setWrap(bool) {
        return this.setProp('wrap', bool);
    }

    /**
     * Set the text that will be rendered.
     * @param {string} text - the text to be rendered
     * @return {self} self
     */
    setText(text) {
        return this.setProp('text', text);
    }

    /**
     * Set the font family that the text will be rendered in.
     * @param {string} fontFamily - font family that the text will be rendered in.
     * @return {self} self
     */
    setFontFamily(fontFamily) {
        return this.setSetting('fontSize', fontFamily);
    }

    /**
     * Set the font size that the text will be rendered in.
     * @param {*} fontSize - font size in pixels, points (pt), or inches (in)
     * @return {self} self
     */
    setFontSize(fontSize) {
        return this.setSetting('fontSize', this.translateToPx(fontSize));
    }
    
    /**
     * Render the Text on the Linen.Canvas object
     * Splits the text into lines and sends it to private methods for wrapping.
     */
    render() {
        super.render();
        var lines = this.text.split("\n");
        var x = this.x();
        var y = this.y();

        this.setFont();
        if (this.wrap) {
            lines = this.wrapLines(lines);
        } else if (this.width() > 0) {
            this.fitTextWidth(lines);
        }

        if (this.height() > 0) {
            this.fitTextHeight(lines);
        }

        lines.map(line => {
            this.writeLine(line, x, y);
            y += this.textHeight(line);
        });
    }
    
    /* Private Functions */

    /**
     * Private method to fit lines within width dimension.
     * @access private
     * @param {array} lines - array of lines
     * @return {boolean} will return true when complete.
     */
    fitTextWidth(lines) {
        var fit = true;
        if (this.settings.fontSize <= 1) {
            return true;
        }
        var w = this.width();
        lines.map(line => {
            if (this.textWidth(line) > w) {
                fit = false;
            }
        });

        if (!fit) {
            this.settings.fontSize -= 1;
            this.setFont();
            this.fitTextWidth(lines);
        } else {
            return true;
        }
    }

    /**
     * Private method to fit lines within height dimension.
     * @access private
     * @param {array} lines - array of lines
     * @return {boolean} will return true when complete.
     */
    fitTextHeight(lines) {
        var fit = true;
        if (this.settings.fontSize <= 1) {
            return true;
        }

        var h = 0;
        lines.map(line => {
            h += this.textHeight(line);
        });
        if (h > this.height()) {
            fit = false;
        }

        if (!fit) {
            this.settings.fontSize -= 1;
            this.setFont();
            this.fitTextHeight(lines);
        } else {
            return true;
        }
    }

    /**
     * Private method to get the calculated width of a given string.
     * @access private
     * @param {string} text - The text to calculate the width of
     * @return {number} px
     */
    textWidth(text) {
        return this.context().measureText(text).width;
    }

    /**
     * Private method to get the calculated height of a given string.
     * @access private
     * @param {string} text - The text to calculate the height of
     * @return {number} px
     */
    textHeight(text) {
        return this.settings.fontSize * this.context().textLineHeight;
    }

    /**
     * Private method to write a single line of text after breaks and wraps are calculated.
     * Context should be set before running this method.
     * @access private
     * @param {string} line - The text to render
     * @param {number} x - The x position of the textbox
     * @param {number} y - The y position of the textbox
     */
    writeLine(line, x, y) {
        var w = super.width();
        var h = super.height();
        var tw = this.textWidth(line);

        switch (this.context().textAlign) {
            case 'center':
                x += Math.round(w / 2);
                break;
            case 'right':
                x += w;
                break;
        }

        if (this.fill) {
            this.context().fillText(line, x, y);
        }
        if (this.stroke) {
            this.context().strokeText(line, x, y);
        }
    }

    /**
     * Private method used to calculate wrapping.
     * @access private
     * @param {array} lines - array of lines.
     * @return {array} lines after processing.
     */
    wrapLines(lines) {
        var newLines = [];
        const w = this.width();
        lines.map(line => {
            var newLine = '';
            line.split(' ').map(word => {
                if (this.textWidth(newLine + word + ' ') > w) {
                    newLines.push(newLine);
                    newLine = word + ' ';
                } else {
                    newLine += word + ' ';
                }
            });
            newLines.push(newLine);
        });
        return newLines;
    }
};
