/**
 * Model for embedding another canvas onto another canvas.<br/>
 * This element extends {@link Linen.Model} and inherits all of it's methods.
 * @tutorial advanced1
 */
Linen.Canvas = class extends Linen.Model {

    /**
     * @param {Linen} Linen - The instance of Linen.
     */
    constructor(Linen) {
        super(Linen);
        this.canvas = null
    }
    
    /**
     * 
     * @param {HTMLCanvasElement} canvas - accepts a HTML5 canvas element.
     * @returns {self} self
     */
    setCanvas(canvas){
        return this.setProp('canvas', canvas);
    }

    /**
     * Render the Rectangle on the Linen.canvas object
     * @access private
     */
    render() {
        super.render();
        var width = super.width();
        var height = super.height();
        if (width < 1) {
            width = this.dimensions.width = this.canvas.width;
        }
        if (height < 1) {
            height = this.dimensions.height = this.canvas.height;
        }
        var x = super.x();
        var y = super.y();
        
        this.context().drawImage(this.canvas, x, y);
        return this;
    }
};
