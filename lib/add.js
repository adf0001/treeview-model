
var ele_id = require("ele-id");
var insert_adjacent_return = require("insert-adjacent-return");
var sweep_spaces = require("sweep-spaces");

var { getNode } = require("./node.js");
var { nodePart, DEFAULT_TO_EXPAND_TEMPLATE } = require("./part.js");
var { getNodeInfo, INFO_NODE, INFO_TYPE } = require("./node-info.js");
var { setToExpandState } = require("./to-expand.js");

var verifyChildrenContainer = function (el, insertMode, childrenContainer) {
	if (childrenContainer) {
		if (insertMode) {
			console.error("inserting fail on children container");
			return false;
		}

		if (childrenContainer !== "true" && !getNodeInfo(el)?.[INFO_TYPE]) {
			console.error("children container type error");
			return false;
		}
	}
	return true;
}

/*
add node
addNode(el, content | name, options, childrenContainer)

	content:
		.outerHtml
			outer html;
		.innerHtml
			inner html; ignore if 'outerHtml' existed;
		.nameHtml
			name html, fast but not safe; ignore if 'innerHtml/outerHtml' existed;
		.name
			safe name text; ignore if 'outerHtml/innerHtml/nameHtml' existed;
		
	options:
		.toExpand
			flag to add to-expand part or not; default `true`;

		.toExpandTemplate
			a user-defined to-expand part template;

		.childrenTemplate
			a user-defined children part template;

		.insert
			insert mode;
		
		.sweepSpaces
			remove all text nodes that contains only spaces;
	
	.childrenContainer:
		true / "true"
			indicated the 'el' is already a children container;
				in this case, the parent to-expand state will be untouched;
				it's caller's duty to update it;

			when `options.insert` is true, the function fail;

			a string "true" will skip node type checking;
*/
var addNode = function (el, content, options, childrenContainer) {
	//arguments
	if (typeof content === "string") content = { name: content };

	if (!childrenContainer) el = getNode(el);
	else if (!verifyChildrenContainer(el, options?.insert, childrenContainer)) return;

	var toExpand = options?.toExpand;
	if (typeof toExpand === "undefined") toExpand = true;

	//build outerHtml
	var outerHtml = content?.outerHtml;
	if (!outerHtml) {
		var a = [];
		a[a.length] = "<div class='tree-node'>";
		if (content?.innerHtml) {
			a[a.length] = content.innerHtml;
		}
		else {
			if (toExpand) a[a.length] = options?.toExpandTemplate || DEFAULT_TO_EXPAND_TEMPLATE;

			//fast nameHtml, not safe;
			a[a.length] = "<span class='tree-name'>" + (content?.nameHtml || "item") + "</span>";
		}
		a[a.length] = "</div>";
		outerHtml = a.join("");
	}

	var elNew;
	if (options?.insert) {
		el = getNode(el);
		elNew = insert_adjacent_return.prependOut(el, outerHtml);
	}
	else {
		//prepare children
		var elChildren = childrenContainer
			? el
			: nodePart(el, "tree-children", options?.childrenTemplate || true);

		//add
		elNew = insert_adjacent_return.append(elChildren, outerHtml);
	}

	if (options?.sweepSpaces) elNew = sweep_spaces(elNew, options.insert ? el : null);

	if (!elNew.classList.contains("tree-node")) elNew.classList.add("tree-node");

	//set safe name
	if (content?.name && !content.nameHtml) {
		var elName = elNew.querySelector("#" + ele_id(elNew) + " > .tree-name");
		if (elName) elName.textContent = content.name;
	}

	//update parent to-expand state
	if (!childrenContainer) setToExpandState(elNew.parentNode, false);

	return elNew;
}

//shortcuts for .addNode()

var insertNode = function (el, content, options, toNext) {
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
		if (el.nextElementSibling) return addNode(el.nextElementSibling, content, options);
		else {
			options.insert = false;
			return addNode(el.parentNode, content, options, "true");
		}
	}
	else return addNode(el, content, options);
}

var insertNodeToNext = function (el, content, options) { return insertNode(el, content, options, true); }

//module exports

module.exports = {
	addNode,
	add: addNode,

	insertNode,
	insert: insertNode,

	insertNodeToNext,
	insertNext: insertNodeToNext,

	verifyChildrenContainer,

};
