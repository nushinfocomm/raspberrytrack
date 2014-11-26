function observeTree(object, cb) {
	Object.observe(object, function (changes) {
		console.log(changes[0].type);
		if ((changes[0].type == "add" || changes[0].type == "update") && typeof changes[0].object[changes[0].name] == "object") {
			observeTree(changes[0].object[changes[0].name], cb);
		}
		cb(changes);
	});
}