/**
 * Model for drawing rectangles.<br/>
 * This element extends {@link Linen.Model} and inherits all of it's methods.
 * @tutorial rectangle
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
     * @access private
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
        return this;
    }
};
