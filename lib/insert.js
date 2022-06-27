
var { getNodeInfo, INFO_NODE } = require("./node-info.js");
var { addNode } = require("./add.js");

//create insert functions for .addNode()
var createInsertByAdd = function (addFunc, toNext) {
	return function (el, content, options) {
		//node info
		var ni = getNodeInfo(el, true);	//only tree-node
		if (!ni) return null;

		el = ni[INFO_NODE];

		//arguments
		if (!options) options = { insert: true };
		else {
			options = Object.create(options);
			options.insert = true;
		}

		if (toNext) {
			if (el.nextElementSibling) return addFunc(el.nextElementSibling, content, options);
			else {
				options.insert = false;
				return addFunc(el.parentNode, content, options, "true");
			}
		}
		else return addFunc(el, content, options);
	}
}

var insertNode = createInsertByAdd(addNode);
var insertNodeToNext = createInsertByAdd(addNode, true);

//module exports

module.exports = {
	createInsertByAdd,

	insertNode,
	insert: insertNode,

	insertNodeToNext,
	insertNext: insertNodeToNext,

};
