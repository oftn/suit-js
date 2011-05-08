suit.Scroller = function(child) {
	suit.Bin.call(this);
	
	this.scrollX = 0; // Distance from left of child to left of scroller. <= 0
	this.scrollY = 0; // Distance from top of child to top of scroller. <= 0
	
	this.event_mask =
		suit.Event.ButtonPress | suit.Event.ButtonRelease | suit.Event.Scroll;
	
	this.dragging = false;
	this.startDragX = null;
	this.startDragY = null;
	
	this.policyX = "never"; // "never", "always"
	this.policyY = "always";
	
	if (child) {
		this.set_child(child);
	}
	this.connect("add", this.on_event_add);
	this.connect("event_button", this.on_event_button);
	this.connect("event_scroll", this.on_event_scroll);
	this.connect("event_motion", this.on_event_motion);

	this.style = {
		padding_top: 5,
		padding_bottom: 5,
		padding_left: 8,
		padding_right: 8
	};
};
suit.Scroller.prototype = suit.Bin.inherit();
suit.Scroller.prototype.name = "Scroller";

suit.Scroller.prototype.draw = function(context) {
	var a = this.allocation;
	
	context.set_shadow (0, 0, 5, "#000");
	context.set_fill_stroke ("#fff");
	context.rect(a.x, a.y, a.width, a.height);
	context.set_shadow();
	
	var gradhei = Math.min(a.y+a.height, a.y+20);
	context.set_fill_stroke (
		context.create_linear_gradient (a.x, a.y, a.x, gradhei,
		[
			[0, "#eee"],
			[1, "#fff"]
		]));
	context.rect(a.x, a.y+1, a.width, gradhei);
	
	if (this.child) {
		context.push_clip(a.x, a.y, a.width, a.height);
		this.child.draw(context);
	
		var ca = this.child.get_allocation();
		context.set_stroke_style (3, "round");
		context.set_fill_stroke (null, "#333");
		var x = a.x + a.width - 6;
		var y = 6 + a.y + ((-this.scrollY) / ca.height * a.height);
		var h = a.height/ca.height*(a.height-12) - 12;
		context.path([
			[x, y],
			[x, y+h]
		]);
		
		context.pop_clip();
	}
};

suit.Scroller.prototype.set_allocation = function(allocation) {
	suit.Widget.prototype.set_allocation.call(this, allocation);
	
	var cw, ch;
	if (this.child) {
		if (this.policyX === "never" && this.policyY === "always") {
			cw = allocation.width - this.style.padding_left - this.style.padding_right - 1;
			ch = this.child.get_preferred_height_for_width(cw).natural;
		} else if (this.policyX === "never" && this.policyY === "never") {
			cw = allocation.width - this.style.padding_left - this.style.padding_right - 1;
			ch = allocation.height - this.style.padding_top - this.style.padding_bottom - 1;
		} else if (this.policyX === "always" && this.policyY === "always") {
			cw = this.child.get_preferred_width().natural;
			ch = this.child.get_preferred_height().natural;
		} else if (this.policyX === "always" && this.policyY === "never") {
			ch = allocation.height - this.style.padding_top - this.style.padding_bottom - 1;
			cw = this.child.get_preferred_width_for_height(ch).natural;
		}
		this.child.set_allocation(new suit.Allocation(0, 0, cw, ch));
		this.update_scroll_position();
	}
};

suit.Scroller.prototype.on_event_add = function(widget) {
	if (this.allocation) {
		this.set_allocation(this.allocation);
	}
};

suit.Scroller.prototype.update_scroll_position = function() {
	if (this.child) {
		var ca = this.child.get_allocation();
		var a = this.get_allocation();
		
		var max_scrollX = a.width - ca.width - this.style.padding_left - this.style.padding_right;
		var max_scrollY = a.height - ca.height - this.style.padding_bottom - this.style.padding_top;
		
		this.scrollX = this.scrollX > 0 ? 0 :
			(this.scrollX < max_scrollX ? max_scrollX : this.scrollX);
		this.scrollY = this.scrollY > 0 ? 0 :
			(this.scrollY < max_scrollY ? max_scrollY : this.scrollY);
		
		if (this.policyX === "never") this.scrollX = 0;
		if (this.policyY === "never") this.scrollY = 0;
		
		ca.x = a.x + this.style.padding_left + this.scrollX;
		ca.y = a.y + this.style.padding_top + this.scrollY;
		this.child.set_allocation(ca);
		this.queue_redraw();
	}
};

suit.Scroller.prototype.on_event_scroll = function(e) {
	if (e.deltaY) {
		this.scrollY += e.deltaY;
		this.update_scroll_position();
	}
};

suit.Scroller.prototype.on_event_button = function(e) {
	switch (e.type) {
	case suit.Event.ButtonPress:
		this.startDragX = e.x;
		this.startDragY = e.y;
		this.dragging = true;
		this.event_mask_add (suit.Event.Motion);
		this.lock();
		break;
	case suit.Event.ButtonRelease:
		if (this.dragging) {
			this.dragging = false;
			this.event_mask_sub (suit.Event.Motion);
			this.unlock();
		}
	}
};

suit.Scroller.prototype.on_event_motion = function(e) {
	if (this.dragging) {
		this.scrollY -= this.startDragY - e.y;
		this.startDragY = e.y;
		this.update_scroll_position();
	}
};

suit.Scroller.prototype.get_request_mode = function() {
	if (this.child) {
		return this.child.get_request_mode ();
	}
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};
suit.Scroller.prototype.get_preferred_width = function() {
	var preferred = new RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_width();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_height = function() {
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_height();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_width_for_height = function(height) {
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_width_for_height();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_height_for_width = function(width) {
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_height_for_width(width);
	}
	return preferred;
};
