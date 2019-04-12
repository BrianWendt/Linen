/**
 * Model for drawing images.<br/>
 * This element extends {@link Linen.Model} and inherits all of it's methods.
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
        this.loaded = false;
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
     * @access private
     */
    render() {
        super.render()
        this.img.addEventListener("load", function () {
            console.log("Image loaded: ", this.img.src);
            this.drawImage();
            this.runCallback();
            this.Linen.renderQueued();
        }.bind(this), false);
        return this;
    }

    /**
     * Prevent the rendering queue from continuing until image loads
     * @access private
     */
    afterRender() { }

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
