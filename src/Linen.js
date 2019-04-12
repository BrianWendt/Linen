/*
 * This is the primary Linen class.
 * @author Brian Wendt
 */
var Linen = class {

    /**
     * @param {object} canvas - HTML DOM reference to canvas element
     */
    constructor(canvas = false) {
        this.elements = [];

        /*
         dpi
         72 - Standard Screen
         144 - Good preview DPI
         300 - Standard Printing DPI
         */
        this.dpi = 144;
        const type = typeof canvas;
        switch (type) {
            case "object":
                this.canvas = canvas;
                break;
            case "string":
                this.canvas = document.querySelector(canvas);
                break;
            default:
                this.canvas = document.createElement('canvas');
        }
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
     * Set the width of the HTML5 canvas node
     * @param {string} width
     * @returns {Linen}
     */
    setWidth(width){
        this.canvas.width = width;
        return this;
    }
    
    /**
     * Set the height of the HTML5 canvas node
     * @param {string} height
     * @returns {Linen}
     */
    setHeight(height){
        this.canvas.height = height;
        return this;
    }
    
    /**
     * Get the dataURL of the canvas.
     * Note: this may not work if you've "tainted" the canvas with an image.
     * @param {string} format - image/png | image/jpg
     * @returns {string}
     */
    getUrl(format = 'image/png'){
        return this.canvas.toDataURL(format);
    }

    /**
     * Get the canvas' context
     * @returns {CanvasRenderingContext2D}
     */
    context() {
        return this.ctx;
    }

    /**
     * Sort the elements by zindex and start the rendering queue.
     */
    render() {
        this.elements = this.elements.sort(function (a, b) {
            if (a.settings.zindex > b.settings.zindex) {
                return 1;
            } else if (a.settings.zindex < b.settings.zindex) {
                return -1;
            } else {
                return 0;
            }
        });
        this.renderQueued();
    }

    /**
     * Render the next element onto the canvas.
     * @access private
     */
    renderQueued() {
        if (this.elements.length > 0) {
            const element = this.elements.shift();
            element.render().afterRender();
        }
    }
}
