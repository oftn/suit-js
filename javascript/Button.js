var Button = function(text) {
	Bin.call(this);
	this.pressed = false;
	if (text) {
		this.set_child(new Label(text));
		this.child.set_align ("center");
		this.child.set_valign ("middle");
	}
	this.connect("add", this.on_event_add);
};
Button.prototype = SUIT.construct_prototype(Bin);

Button.prototype.draw = function(context) {
	var a = this.allocation;
	
	// TODO: Move this into a theme class
	context.set_shadow (0, 0, 5, "#000");
	context.rect(a.x, a.y, a.width, a.height);
		// Safari can't do shadows on shapes with gradients I guess
	context.set_shadow();

	var stops;
	if (!this.pressed) {
		stops = [
			[0, "#3f3f3f"],
			[1, "#2e2e2e"]
		];
	} else {
		stops = [
			[0, "#2e2e2e"],
			[1, "#3f3f3f"]
		];
	}
	
	context.set_fill_stroke (
		context.create_linear_gradient (a.x, a.y, a.x, a.y+a.height, stops),
		"#575757");
	context.rect(a.x, a.y, a.width, a.height);
		
	context.set_stroke_style (1, "butt", "miter");
	context.path([
		[a.x,           a.y + a.height - 1],
		[a.x,           a.y],
		[a.x + a.width - 1, a.y],
		[a.x + a.width - 1, a.y + a.height - 1]
	]);
	
	context.set_fill_stroke ("#ffffff", "#0b0b0b");
	context.path([
		[a.x + a.width - 1, a.y + a.height - 1],
		[a.x,           a.y + a.height - 1]
	]);
	
	// Demonstration purposes
	context.set_shadow (1, 1, 1, "black");
	this.child.draw(context);
	//context.set_font_style ("16px \"Droid Sans\", Cabin, sans-serif", "center", "middle");
	//var top = a.y+((a.height-1)/2);
	//context.text("Droid Sans", (a.x + (a.width-1)/2) |0, top+(this.pressed?1:0));
	context.set_shadow ();
};

Button.prototype.set_allocation = function(allocation) {
	Widget.prototype.set_allocation.call(this, allocation);
	if (this.child) {
		this.child.set_allocation(new Allocation(
			allocation.x + 10,
			allocation.y + 10,
			allocation.width - 20,
			allocation.height - 20
		));
	}
};

Button.prototype.on_event_add = function(widget) {
	if (this.allocation) {
		Button.prototype.set_allocation(this.allocation);
	}
};

Button.prototype.get_request_mode = function() {
	if (this.child) {
		return this.child.get_request_mode ();
	}
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};
Button.prototype.get_preferred_width = function() {
	var preferred = new RequestedSize(12, 12); // Button padding * 2
	if (this.child) {
		var childpref = this.child.get_preferred_width();
		preferred.mininum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
Button.prototype.get_preferred_height = function() {
	var preferred = new RequestedSize(12, 12); // Button padding * 2
	if (this.child) {
		var childpref = this.child.get_preferred_height();
		preferred.mininum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
Button.prototype.get_preferred_width_for_height = function(height) {
	var preferred = new RequestedSize(12, 12); // Button padding * 2
	if (this.child) {
		var childpref = this.child.get_preferred_height();
		preferred.mininum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
Button.prototype.get_preferred_height_for_width = function(width) {
	var preferred = new RequestedSize(12, 12); // Button padding * 2
	if (this.child) {
		var childpref = this.child.get_preferred_height();
		preferred.mininum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};

