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
