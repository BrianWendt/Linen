/**
* Simple object for non ES6 namespacing due to browser support.
* This may end up being a factory.
*/
var Linen = {
	/*
	dpi
		72 - Standard Screen
		144 - Good preview DPI
		300 - Standard Printing DPI
	*/
	dpi: 144
};

/**
* Generic class that the other elements are extension of.
* Virtually all 2d elements will share the a number of attributes and common methods.
*/
Linen.BoxModel = class {
	
	/**
	* Contruct with reference to Canvas
	* @param {Object} Canvas - The instance of Linen.Canvas to render on.
	*/
	constructor(Canvas){
		this.Canvas = Canvas;
		this.width = '100%'
		this.height = '100%';
		this.x = 0;
		this.y = 0;
		this.fillStyle = 'black';
		this.strokeStyle = 'black';
		this.lineWidth = .005;
		this.alignment = 'left';
		this.v_alignment = 'top';
	}
	
	/**
	* Get the context
	* @return {Object} instance of 2d context of Canvas
	*/
	context(){
		return this.Canvas.context;
	}
	
	/**
	* Get the width of the element
	* @return {number} px
	*/
	width(){ return this.getBoxProp('width'); }
	
	/**
	* Get the height of the card
	* @return {number} px
	*/
	height(){ return this.getBoxProp('height'); }
	
	/**
	* Get the x positioning of the element with reference point considered.
	* @return {number} px
	*/
	x(){
		var x = this.getBoxProp('x'); //px
		var w = this.getBoxProp('width'); //px
		switch(this.alignment){
			case 'center':
				return x - (w/2);
			case 'right':
				return x - w;
		}
		return x;
	}
	
	/**
	* Get the y positioning of the element with reference point considered.
	* @return {number} px
	*/
	y(){
		var y = this.getBoxProp('y'); //px
		var h = this.getBoxProp('height'); //px
		switch(this.v_alignment){
			case 'middle':
				return y - (h/2);
			case 'bottom':
				return y - h;
		}
		return y;
	}
	
	/**
	* Set the width of the element
	* @param {number} val - width in inches (numeric) or percentage (string)
	* @return {Object} self
	*/
	setWidth(val){ return this.setProp('width', val); }
	
	/**
	* Set the height of the element
	* @param {number} val - height in inches (numeric) or percentage (string)
	* @return {Object} self
	*/
	setHeight(val){ return this.setProp('height', val); }
	
	/**
	* Set the x positioning of the element
	* @param {number} val - x positioning in inches (numeric) or percentage (string)
	* @return {Object} self
	*/
	setX(val){ return this.setProp('x', val); }
	
	/**
	* Set the y positioning of the element
	* @param {number} val - y positioning in inches (numeric) or percentage (string)
	* @return {Object} self
	*/
	setY(val){ return this.setProp('y', val); }
	
	/**
	* Shorthand to set the x and y positioning of the element
	* @param {number} x - x positioning in inches (numeric) or percentage (string)
	* @param {number} y - y positioning in inches (numeric) or percentage (string)
	* @return {Object} self
	*/
	setXY(x, y){ return this.setX(x).setY(y); }
	
	/**
	* Set the x reference point for positioning
	* @param {string} val - left(default)|center|right
	* @return {Object} self
	*/
	setAlignment(val){ return this.setProp('alignment', val.toLowerCase()); }
	
	/**
	* Set the reference point for positioning to center
	* @return {Object} self
	*/
	center(){ return this.setAlignment('center') }
	
	/**
	* Set the y reference point for positioning
	* @param {string} val - top(default)|middle|bottom
	* @return {Object} self
	*/
	setVAlignment(val){ return this.setProp('v_alignment', val.toLowerCase()); }
	
	/**
	* Set the y reference point for positioning to bottom
	* @return {Object} self
	*/
	middle(){ return this.setVAlignment('middle'); }
	
	/**
	* Enable or disable rendering the fill
	* @param {bool} bool - TRUE|FALSE
	* @return {Object} self
	*/
	setFill(bool){ return this.setProp('fill', bool); }
	
	/**
	* Enable or disable rendering the stroke
	* @param {bool} bool - TRUE|FALSE
	* @return {Object} self
	*/
	setStroke(bool){ return this.setProp('stroke', bool); }
	
	/**
	* Set the fillStyle to be used for rendering.
	* @see {@link https://www.w3schools.com/tags/canvas_fillstyle.asp|w3schools}
	* @param {string} style - color|gradient|pattern
	* @return {Object} self
	*/
	setFillStyle(style){ return this.setProp('fillStyle', style); }
	
	/**
	* Set the strokeStyle to be used for rendering.
	* @see {@link https://www.w3schools.com/tags/canvas_strokestyle.asp|w3schools}
	* @param {string} style - color|gradient|pattern
	* @return {Object} self
	*/
	setStrokeStyle(style){ return this.setProp('strokeStyle', style); }
	
	/**
	* Get the value in px of a 2d attribute.
	* @param {string} prop - property name on this object.
	* @return {number} px
	*/
	getBoxProp(prop){
		var val = this[prop];
		var type = typeof val;
		if(val === null){
			return null;
		}
		switch(type){
			case 'string':
				/* percentage */
				return (this.percentage(val, prop) * Linen.dpi);
			case 'function':
				return val(this);
			case 'number':
				return (val * Linen.dpi);
			default:
				return val;
		}
	}
	
	/**
	* Set the value of a given propery. Primarily for 2d attributes.
	* @param {string} prop - property name on this object.
	* @param {*} value - mixed value
	* @return {Object} self
	*/
	setProp(prop, value){
		this[prop] = value;
		return this;
	}
	
	/**
	* Set the value of a given propery. Primarily for 2d attributes.
	* @param {number} val - px value to compare from.
	* @param {string} prop - property name on this object that should be compared to.
	* @return {number} px
	*/
	percentage(val, prop){
		var n = parseFloat(val)/100;
		var o = 0;
		switch(prop){
			case 'width':
			case 'x':
			case 'x2':
				o = this.Canvas.width();
				break;
			case 'height':
			case 'y':
			case 'y2':
				o = this.Canvas.height();
				break;
			default:
				return 0;
		}
		return n*o;
	}
	
	/**
	* Generic settings that just about any element might use.
	* @return {undefined}
	*/
	render(){
		this.context().fillStyle = this.fillStyle;
		this.context().strokeStyle = this.strokeStyle;
		this.context().lineWidth = (this.lineWidth * Linen.dpi);
	}
}

/** Model for drawing Arcs (circle/oval) */
Linen.Arc = class extends Linen.BoxModel {
	
	/**
	* Contruct with reference to Canvas
	* @param {Object} Canvas - The instance of Linen.Canvas to render on
	*/
	constructor(Canvas){
		super(Canvas);
		this.fill = false;
		this.stroke = true;
		this.radius = 1;
		this.startAngle = 0;
		this.endAngle = (2 * Math.PI);
		this.anticlockwise = false;
		this.offsetXY = true;
	}
	
	/**
	* Set the radius
	* @param {number} val - radius as inch (number) or percentage (string)
	* @return {Object} self
	*/
	setRadius(val){ return this.setProp('radius', val); }
	
	/**
	* Render the Arc on the Linen.Canvas object
	* @return {undefined}
	*/
	render(){
		super.render()
		this.context().beginPath();
		var radius = super.getBoxProp('radius');
		this.width = this.height = (radius / Linen.dpi) * 2;
		
		var x = super.x();
		var y = super.y();
		
		//correct for arc drawing from center.
		if(this.offsetXY){
			x += radius;
			y += radius;
		}
		
		this.context().arc(x, y, radius, this.startAngle, this.endAngle, this.anticlockwise);
		if(this.fill){
			this.context().fill();
		}
		if(this.stroke){
			this.context().stroke();
		}
	}
}

/** Model for manipulating the Canvas  */
Linen.Canvas = class {
	
	/**
	* Contruct with reference to the html5 canvas element.
	* @param {Object} canvas - DOM element of the canvas.
	* @param {Object} width - Width of canvas in inches.
	* @param {Object} height - Height of canvas in inches.
	*/
	constructor(canvas, width, height){
		this.canvas = canvas;
		this.canvas.width = (Linen.dpi * width);
		this.canvas.height = (Linen.dpi * height);
		this.context = this.canvas.getContext('2d');
		this.defaults = {
			fontFamily: 'serif',
			fontSize: 16,
			text_align: 'left',
			text_baseline: 'top'
		};
		this.components = [];
	}
	
	/**
	* Get the canvas width in inches
	* @return {number} inches
	*/
	width(){ return (this.canvas.width / Linen.dpi); }
	
	/**
	* Get the canvas height in inches
	* @return {number} inches
	*/
	height(){ return (this.canvas.height / Linen.dpi); }
	
	/**
	* Overwrite the values in the self.defaults object.
	* @param {Object} props - key value paired list of props and new values.
	* @return {Object} self
	*/
	setDefaults(props){
		Object.assign(this.defaults, props);
		return this;
	}
	
	/**
	* Overwrite the value in the self.defaults object.
	* @param {Object} prop - key of property to overwrite
	* @param {Object} value - new value of property
	* @return {Object} self
	*/
	setDefaultProp(prop, value){
		this.defaults[prop] = value;
		return this;
	}
	
	/**
	* Shorthand method to set a background. Puts the Rectangle compoent to beginning of array.
	* @see {@link https://www.w3schools.com/tags/canvas_fillstyle.asp|w3schools}
	* @param {string} style - the fill style
	* @return {Object} self
	*/
	setBackground(style){
		var BG = (new Linen.Rectangle(this)).setFillStyle(style).setStroke(false);
		this.components.unshift(BG);
		return BG;
	}
	
	/**
	* Create a new Arc component
	* @return {Object} instance of Linen.Arc
	*/
	addArc(){ return this._pushComponent(new Linen.Arc(this)); }
	
	/**
	* Create a new Image component
	* @return {Object} instance of Linen.Image
	*/
	addImage(){ return this._pushComponent(new Linen.Image(this)); }
	
	/**
	* Create a new Line compoent
	* @return {Object} instance of Linen.Line
	*/
	addLine(){ return this._pushComponent(new Linen.Line(this)); }
	
	/**
	* Create a new Rectangle compoent
	* @return {Object} instance of Linen.Rectangle
	*/
	addRectangle(){ return this._pushComponent(new Linen.Rectangle(this)); }
	
	/**
	* Create a new Text compoent
	* @return {Object} instance of Linen.Text
	*/
	addText(){ return this._pushComponent(new Linen.Text(this)); }
	
	/**
	* Execture the render mothod of the components.
	* @return {undefined}
	*/
	render(){
		for(var i = 0; i<this.components.length; i++){
			this.components[i].render();
		}
	}
	
	/**
	* Private method for adding component to component array.
	* @param {Object} component - instance of a Linen modal.
	* @return {Object} self
	*/
	_pushComponent(component){
		this.components.push(component);
		return component;
	}
	
}

/** Model for drawing Images */
Linen.Image = class extends Linen.BoxModel {
	
	/**
	* Contruct with reference to Canvas
	* @param {Object} Canvas - The instance of Linen.Canvas to render on
	*/
	constructor(Canvas){
		super(Canvas);
		this.img = new Image;
		this.width = null;
		this.height = null;
		this.align = 'left';
	}
	
	/**
	* Set the url of the image.
	* @param {string} url - fully qualified URL of image to use
	* @return {Object} self
	*/
	setSrc(url){
		this.img.src = url;
		return this;
	}
	
	/**
	* Render the Image on the Linen.Canvas object
	* @return {undefined}
	*/
	render(){
		super.render()
		this.img.addEventListener('load', function(){
			this._drawImage();
		}.bind(this), false);
	}
	
	/**
	* Private callback method executed after image 'load' event.
	* @return {undefined}
	*/
	_drawImage(){
		var width = super.width();
		var height = super.height();
		if(width < 1){
			width = this.img.width;
			this.width = (width / Linen.dpi);
		}
		if(height < 1){
			height = this.height = this.img.height;
			this.height = (height / Linen.dpi);
		}
		var x = super.x();
		var y = super.y();
		
		this.context().drawImage(this.img, x, y, width, height);
	}
}

/** Model for drawing Lines */
Linen.Line = class extends Linen.BoxModel {
	
	/**
	* Contruct with reference to Canvas
	* @param {Object} Canvas - The instance of Linen.Canvas to render on
	*/
	constructor(Canvas){
		super(Canvas);
		this.fill = true;
		this.stroke = true;
		this.x2 = 0;
		this.y2 = 0;
	}
	
	/**
	* Set the start and end coordinates for the line to be rendered.
	* @param {number} x1 - Starting x position in inches (numeric) or percentage (string)
	* @param {number} y1 - Starting y position in inches (numeric) or percentage (string)
	* @param {number} x2 - Ending x position in inches (numeric) or percentage (string)
	* @param {number} y2 - Ending y position in inches (numeric) or percentage (string)
	* @return {Object} self
	*/
	setCords(x1, y1, x2, y2){
		this.setProp('x', x1);
		this.setProp('y', y1);
		this.setProp('x2', x2);
		this.setProp('y2', y2);
		return this;
	}
	
	/**
	* Render the Line on the Linen.Canvas object
	* @return {undefined}
	*/
	render(){
		super.render()
		this.context().beginPath();
		var x1 = super.x();
		var y1 = super.y();
		var x2 = super.getBoxProp('x2');
		var y2 = super.getBoxProp('y2');
		
		this.context().moveTo(x1, y1);
		this.context().lineTo(x2, y2);
		if(this.fill){
			this.context().fill();
		}
		if(this.stroke){
			this.context().stroke();
		}
	}
}

Linen.Rectangle = class extends Linen.BoxModel {
	
	/**
	* Contruct with reference to Canvas
	* @param {Object} Canvas - The instance of Linen.Canvas to render on
	*/
	constructor(Canvas){
		super(Canvas);
		this.fill = true;
		this.stroke = true;
	}
	
	/**
	* Render the Rectangle on the Linen.Canvas object
	* @return {undefined}
	*/
	render(){
		super.render()
		this.context().beginPath();
		var width = super.width();
		var height = super.height();
		var x = super.x();
		var y = super.y();
		this.context().rect(x, y, width, height);
		if(this.fill){
			this.context().fill();
		}
		if(this.stroke){
			this.context().stroke();
		}
	}
}

/** Model for drawing Text */
Linen.Text = class extends Linen.BoxModel {
	
	/**
	* Contruct with reference to Canvas
	* @param {Object} Canvas - The instance of Linen.Canvas to render on
	*/
	constructor(Canvas){
		super(Canvas);
		this.text = '';
		this.fontFamily = Canvas.defaults.fontFamily;
		this.fontSize = Canvas.defaults.fontSize;
		this.textAlign = Canvas.defaults.text_align;
		this.textBaseline = Canvas.defaults.text_baseline;
		this.lineHeight = 1.1;
		this.fill = true;
		this.stroke = true;
	}
	
	/**
	* Set the text that will be rendered.
	* @param {string} text - the text to be rendered
	* @return {Object} self
	*/
	setText(text){
		this.text = text;
		return this;
	}
	
	/**
	* Set the font family that the text will be rendered in.
	* @param {string} font - font family that the text will be rendered in.
	* @return {Object} self
	*/
	setFontFamily(font){
		this.fontFamily = font;
		return this;
	}
	
	/**
	* Set the font size that the text will be rendered in.
	* @param {number} pt - font size in points that the text will be rendered in.
	* @return {Object} self
	*/
	setFontSize(pt){
		this.fontSize = parseFloat(pt);
		return this;
	}
	
	/**
	* Set the text horizontal alignment for rendering.
	* This is different than the positioning reference point.
	* @see {@link https://www.w3schools.com/tags/canvas_textalign.asp|w3schools}
	* @param {string} text_align - horizontal alignment for rendering (left,center,right)
	* @return {Object} self
	*/
	setTextAlign(text_align){
		this.textAlign = text_align.toLowerCase();
		return this;
	}
	
	/**
	* Set the text horizontal alignment for rendering.
	* This is different than the positioning reference point.
	* @see {@link https://www.w3schools.com/tags/canvas_textalign.asp|w3schools}
	* @param {string} text_align - horizontal alignment for rendering (left,center,right)
	* @return {Object} self
	*/
	setBaseline(baseline){
		this.textBaseline = baseline.toLowerCase();
		return this;
	}
	
	/**
	* Get the font size in pixels
	* @return {number} px
	*/
	getFontSizePx(){
		return (this.fontSize * .01388) * Linen.dpi;
	}
	
	/**
	* Get the height of a line in pixels.
	* @return {number} px
	*/
	getLineHeight(){
		return this.getFontSizePx() * this.lineHeight;
	}

	/**
	* Render the Text on the Linen.Canvas object
	* Splits the text into lines and sends it to private methods for wrapping.
	* @return {undefined}
	*/
	render(){
		super.render()
		this._setContext();
		var lines = this.text.split("\n");
		for(var i = 0; i < lines.length; i++){
			this._wrapText(lines[i]);
		}
	}
	
	/**
	* Private method to get the calculated width of a given string.
	* Context should be set before running this method.
	* @param {string} text - The text to calculate the width of
	* @return {number} px
	*/
	_textWidth(text){
		return this.context().measureText(text).width;
	}
	
	/**
	* Private method to write a single line of text after breaks and wraps are calculated.
	* Context should be set before running this method.
	* @param {string} line - The text to render
	* @param {number} x - The x position of the textbox
	* @param {number} y - The y position of the textbox
	* @return {undefined}
	*/
	_writeLine(line, x, y){
		var w = super.width();
		var h = super.height();
		var tw = this._textWidth(line);
		
		switch(this.textAlign){
			case 'center':
				x += (w/2);
				break;
			case 'right':
				x += w;
				break;
		}
		
		if(this.fill){
			this.context().fillText(line, x, y);
		}
		if(this.stroke){
			this.context().strokeText(line, x, y);
		}
	}
	
	/**
	* Private method to set the Canvas context for rendering calculations and rendering.
	* @return {Object} self
	*/
	_setContext(){
		var px = this.getFontSizePx();
		this.context().font = px + 'px ' + this.fontFamily;
		this.context().textAlign = this.textAlign;
		this.context().textBaseline = this.textBaseline;
		return this;
	}
	
	/**
	* Private method used to write text with wrapping.
	* @param {string} text - The text to render.
	* @return {undefined}
	*/
	_wrapText(text) {
		var w = super.width();
		var h = super.height();
		var x = super.x();
		var y = super.y();
		var lh = this.getLineHeight();
		
        var words = text.split(' ');
        var line = '';
		var lc = 1;
		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var testWidth = this._textWidth(testLine);
			if (testWidth > w && n > 0) {
				lc++;
				this._writeLine(line, x, y);
				line = words[n] + ' ';
				y += lh;
			} else {
				line = testLine;
			}
		}
		this._writeLine(line, x, y);
		this.y += ((lc * lh) / Linen.dpi);
    }
}

