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
