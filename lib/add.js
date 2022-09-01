
var ele_id = require("ele-id");
var insert_adjacent_return = require("insert-adjacent-return");
var sweep_spaces = require("sweep-spaces");

var { getNode } = require("./node.js");
var { nodePart, DEFAULT_TO_EXPAND_TEMPLATE } = require("./part.js");
var { getNodeInfo, INFO_TYPE } = require("./node-info.js");
var { setToExpandState } = require("./to-expand.js");

//return el or elNode
var verifyChildrenContainer = function (el, insertMode, childrenContainer) {
	if (childrenContainer) {
		if (insertMode) throw Error("inserting fail on children container");

		if (childrenContainer !== "true" && !getNodeInfo(el)?.[INFO_TYPE]) {
			throw Error("children container type fail");
		}

		return el;
	}
	else return getNode(el);
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

return the added node;
throw excption if fail;
*/
var addNode = function (el, content, options, childrenContainer) {
	//arguments
	if (typeof content === "string") content = { name: content };

	//verify insert
	el = verifyChildrenContainer(el, options?.insert, childrenContainer);
	if (!el) throw Error("verify element fail");

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

//module exports

module.exports = {
	addNode,
	add: addNode,

	verifyChildrenContainer,
};
