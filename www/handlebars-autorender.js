function AutoRenderer() {
	// require()
	var parser = new DOMParser();
	// init()
	this.handles = [];
	this.context = {};
	// internal prototypes
	function Handle(scriptElement, context) {
		var templateString = scriptElement.innerHTML;
		this.template = Handlebars.compile(templateString);
		this.context = context || {};
		this.element = scriptElement;
	}
	Handle.prototype.update = function (newContext) {
		newContext && (this.context = newContext);
		var rawHTML = this.template(context);
		newElement = parser.parseFromString(rawHTML, "text/html").firstChild;
		this.element.parentElement.replaceChild(newElement, this.element);
		this.element = newElement;
	};
	// main()
	var scriptElements = document.querySelectorAll("script[type='text/x-handlebars-template']");
	Array.prototype.forEach.call(scriptElements, function (scriptElement) {
		var handler = new Handle(scriptElement, this.context);
		this.handles.push(handler);
	}.bind(this));
}

AutoRenderer.prototype.update = function (newContext) {
	// this.handles.forEach(function (handle) {
	// 	console.log(handle.context, this.context);
	// 	if (handle.context == this.constext) {
	// 		handle.update(newContext);
	// 	}
	// });
	for (var i = 0; i < this.handles.length; i++) {
		var handle = this.handles[i];
		if (handle.context == this.context) {
			handle.update(newContext);
		}
	}
	this.context = newContext;
}