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
