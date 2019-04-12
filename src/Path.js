/**
 * Model for drawing Paths. The model is extremely limited right now.<br/>
 * This element extends {@link Linen.Model} and inherits all of it's methods.
 * @tutorial path-clipping
 */
Linen.Path = class extends Linen.Model {

    /**
     * @param {Linen} Linen - The instance of Linen.
     */
    constructor(Linen) {
        super(Linen);
        this.paths = [];
    }

    /**
     * Multiple paths may be added to the Path element for ease of use.
     * All paths on the element will recieve the same fillStyle and strokeStyle.
     * @param {string} path
     * @returns {unresolved}
     */
    addPath(path) {
        this.paths.push(new Path2D(path));
        return this;
    }

    /**
     * Render the Rectangle on the Linen.canvas object
     * @access private
     */
    render() {
        super.render();
        this.context().translate(this.x(), this.y());
        this.paths.map((Path) => {
            this.context().beginPath();
            if (this.fill) {
                this.context().fill(Path);
            }
            if (this.stroke) {
                this.context().stroke(Path);
            }
            if (this.clip) {
                this.context().clip(Path);
            }
        });
        return this;
    }

    /**
     * Prevent the default clip behavior.
     * @access private
     */
    afterRender() {
        this.Linen.renderQueued();
        return this;
    }
};
