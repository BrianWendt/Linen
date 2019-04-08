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
