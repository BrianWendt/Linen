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
