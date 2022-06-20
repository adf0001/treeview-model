
var ele_id = require("ele-id");
var insert_adjacent_return = require("insert-adjacent-return");
var sweep_spaces = require("sweep-spaces");

var { getNode } = require("./node.js");
var { nodePart, DEFAULT_TO_EXPAND_TEMPLATE } = require("./part.js");
var { getNodeInfo, INFO_NODE } = require("./node-info.js");
var { setToExpandState } = require("./to-expand.js");

/*
options:{ (outerHtml | innerHtml/content | name | nameHtml, toExpand, toExpandTemplate),
	childrenTemplate, insert, sweepSpaces } | name.

	.toExpand
		default `true`; flag to add to-expand part or not;
	
	.insert
		insert mode;
	
	.sweepSpaces
		remove all text nodes that contains only spaces;
	
childrenContainer:
	true
		indicated the 'elNode' is already a children container;
			in this case, the parent to-expand state will be untouched;
			it's caller's duty to update it;

		when `.insert` is true, the function fail;
*/
var addNode = function (elNode, options, childrenContainer) {
	//arguments
	if (!options) options = {};
	else if (typeof options === "string") options = { name: options };

	if (childrenContainer && options.insert) {
		console.error("inserting fail on children container");
		return;
	}

	if (typeof options.toExpand === "undefined") options.toExpand = true;

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
		elNode = getNode(elNode);
		el = insert_adjacent_return.prependOut(elNode, options.outerHtml);
	}
	else {
		//prepare children
		var elChildren = childrenContainer
			? elNode
			: nodePart(elNode, "tree-children", options.childrenTemplate || true);

		//add
		el = insert_adjacent_return.append(elChildren, options.outerHtml);
	}

	if (options.sweepSpaces) el = sweep_spaces(el, options.insert ? elNode : null);

	if (!el.classList.contains("tree-node")) el.classList.add("tree-node");

	//set safe name
	if (options.name && !options.nameHtml) {
		var elName = el.querySelector("#" + ele_id(el) + " > .tree-name");
		if (elName) elName.textContent = options.name;
	}

	//update parent to-expand state
	if (!childrenContainer) setToExpandState(el.parentNode, false);

	return el;
}

//shortcuts for .addNode()

var insertNode = function (elNode, options, toNext) {
	//node info
	var ni = getNodeInfo(elNode, true);	//only tree-node
	if (!ni) return null;

	elNode = ni[INFO_NODE];

	//arguments
	if (!options) options = { insert: true };
	else if (typeof options === "string") options = { name: options, insert: true };
	else {
		options = Object.create(options);
		options.insert = true;
	}

	if (toNext) {
		if (elNode.nextElementSibling) return addNode(elNode.nextElementSibling, options);
		else {
			options.insert = false;
			return addNode(elNode.parentNode, options);
		}
	}
	else return addNode(elNode, options);
}

var insertNodeToNext = function (elNode, options) { return insertNode(elNode, options, true); }

//module exports

module.exports = {
	addNode,
	add: addNode,

	insertNode,
	insert: insertNode,

	insertNodeToNext,
	insertNext: insertNodeToNext,
};
