suit.Packer = function(orientation) {
	suit.Container.call(this);
	
	this.connect("add", this.on_event_add);

	this.orientation = orientation || "horizontal"; // "horizontal" or "vertical"
	this.align = "start"; // "start", "end" or "middle"
	this.spacing = 20;
	this.style = {
		padding_top: 0,
		padding_bottom: 0,
		padding_left: 0,
		padding_right: 0
	};

};
suit.Packer.prototype = suit.Container.inherit();
suit.Packer.prototype.name = "Packer";

/*suit.Packer.prototype.draw = function(context) {
	var a = this.allocation;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		this.children[i].draw(context);
	};
};*/

suit.Packer.prototype.set_allocation = function(allocation) {
	suit.Widget.prototype.set_allocation.call(this, allocation);
	
	var majorsize, minorsize;
	if (this.orientation === "horizontal") {
		majorsize = (this.orientation === "horizontal") ?
			allocation.width : allocation.height;
		minorsize = (this.orientation === "horizontal") ?
			allocation.height : allocation.width;
	} else {
		majorsize = (this.orientation === "horizontal") ?
			allocation.height : allocation.width;
		minorsize = (this.orientation === "horizontal") ?
			allocation.width : allocation.height;
	}
	
	var childsize = 0;
	var childsize_parts = [];
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var majchild = (this.orientation === "horizontal") ?
			child.get_preferred_width_for_height(minorsize).natural :
			child.get_preferred_height_for_width(majorsize).natural

		childsize += majchild;
		if (i !== 0) { childsize += this.spacing; }
		childsize_parts.push(majchild);
	}
	
	/*if (childsize > majorsize) {
		for (var i = 0, len = childsize_parts.length; i < len; i++) {
			childsize_parts[i] *= (majorsize/childsize);
		}
	}*/
	
	var majpos = (this.orientation === "horizontal") ? 
		allocation.x : allocation.y;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var ca;
		if (i !== 0) { majpos += this.spacing; }
		if (this.orientation === "horizontal") {
			ca = new suit.Allocation(
				majpos, allocation.y, childsize_parts[i], allocation.height);
		} else {
			ca = new suit.Allocation(
				allocation.x, majpos, allocation.width, childsize_parts[i]);
		}
		child.set_allocation(ca);
		majpos += childsize_parts[i];
	}
};

suit.Packer.prototype.on_event_add = function(widget) {
	if (this.allocation) {
		this.set_allocation(this.allocation);
	}
};

suit.Packer.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};

suit.Packer.prototype.get_preferred_width = function() {
	var minimum = 0;
	var natural = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var size = child.get_preferred_width();
		minimum += size.minimum;
		natural += size.natural;
	}
	
	minimum += this.spacing * (len-1);
	natural += this.spacing * (len-1);
	
	return {
		minimum: minimum,
		natural: natural
	};
};

suit.Packer.prototype.get_preferred_height = function() {
	var minimum = 0;
	var natural = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var size = child.get_preferred_height();
		minimum += size.minimum;
		natural += size.natural;
	}
	
	minimum += this.spacing * (len-1);
	natural += this.spacing * (len-1);
	
	return {
		minimum: minimum,
		natural: natural
	};
};

suit.Packer.prototype.get_preferred_width_for_height = function(height) {
	var minimum = 0;
	var natural = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var size = child.get_preferred_width_for_height(height);
		minimum += size.minimum;
		natural += size.natural;
	}
	
	minimum += this.spacing * (len-1);
	natural += this.spacing * (len-1);
	
	return {
		minimum: minimum,
		natural: natural
	};
};

suit.Packer.prototype.get_preferred_height_for_width = function(width) {
	var minimum = 0;
	var natural = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var size = child.get_preferred_height_for_width(width);
		minimum += size.minimum;
		natural += size.natural;
	}
	
	minimum += this.spacing * (len-1);
	natural += this.spacing * (len-1);
	
	return {
		minimum: minimum,
		natural: natural
	};
};
