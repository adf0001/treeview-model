
var ele_id = require("ele-id");
var insert_adjacent_return = require("insert-adjacent-return");

var { getNode } = require("./node.js");
var { nodePart, DEFAULT_TO_EXPAND_TEMPLATE } = require("./part.js");

var ELEMENT_NODE_TYPE = Node.ELEMENT_NODE;
var TEXT_NODE_TYPE = Node.TEXT_NODE;
var regSpaces = /^\s+$/;

//sweep spaces text nodes
function sweepSpaces(nodeStart, nodeEnd) {
	var elFirst;

	while (true) {
		var nodeNext = nodeStart.nextSibling;	//preserve next

		if (nodeStart.nodeType === TEXT_NODE_TYPE) {
			if (regSpaces.test(nodeStart.nodeValue))
				nodeStart.parentNode?.removeChild(nodeStart);
		}
		else {
			if (nodeStart.nodeType === ELEMENT_NODE_TYPE) {
				sweepSpaces(nodeStart.firstChild);
			}
			if (!elFirst) elFirst = nodeStart;
		}

		if (!nodeNext || nodeNext === nodeEnd) return elFirst;

		nodeStart = nodeNext;
	}
}

/*
options:{ (outerHtml | innerHtml/content | name | nameHtml, toExpand, toExpandTemplate),
	childrenTemplate, insert, sweepSpaces } | name.
childrenContainer: set true if the 'elNode' is already a children container; ignored if `.insert` is true;
*/
var addNode = function (elNode, options, childrenContainer) {
	//arguments
	if (!options) options = {};
	else if (typeof options === "string") options = { name: options };

	options.innerHtml = options.innerHtml || options.content;

	//build outerHtml
	if (!options.outerHtml) {
		var a = [];
		a[a.length] = "<div class='tree-node'>";
		if (options.innerHtml) {
			a[a.length] = options.innerHtml;
		}
		else {
			if (options.toExpand) a[a.length] = options.toExpandTemplate || DEFAULT_TO_EXPAND_TEMPLATE;

			//fast nameHtml, not safe;
			a[a.length] = "<span class='tree-name'>" + (options.nameHtml || "item") + "</span>";
		}
		a[a.length] = "</div>";
		options.outerHtml = a.join("");
	}

	var el;
	if (options.insert) {
		el = insert_adjacent_return.prependOut(getNode(elNode), options.outerHtml);
	}
	else {
		//prepare children
		var elChildren = childrenContainer
			? elNode
			: nodePart(elNode, "tree-children", options.childrenTemplate || true);

		//add
		el = insert_adjacent_return.append(elChildren, options.outerHtml);
	}

	if (options.sweepSpaces) el = sweepSpaces(el);

	if (!el.classList.contains("tree-node")) el.classList.add("tree-node");

	//set safe name
	if (options.name && !options.nameHtml) {
		var elName = el.querySelector("#" + ele_id(el) + " > .tree-name");
		if (elName) elName.textContent = options.name;
	}

	return el;
}

//module exports

module.exports = {
	addNode,
	add: addNode,

	sweepSpaces,
};
