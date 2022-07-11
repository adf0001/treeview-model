
var ele_id = require("ele-id");
var insert_adjacent_return = require("insert-adjacent-return");

var { getNode } = require("./node.js");
var { getContainer } = require("./container.js");

var DEFAULT_CHILDREN_TEMPLATE = "<div class='tree-children'></div>";
var DEFAULT_TO_EXPAND_TEMPLATE = "<span class='tree-to-expand tree-disable'>.</span>";

/*
get the direct part element of a tree-node by class name, or create by template.

template: { (outerHtml | innerHtml | createByDefault) } | innerHtml | createByDefault===true
*/
var nodePart = function (el, className, template, before) {
	if (className === "tree-container") return getContainer(el);	//shortcut for tree-container

	el = getNode(el);
	if (className === "tree-node") return el;	//shortcut for tree-node

	if (!el) return null;

	var selector = "#" + ele_id(el) + " > ." + className.replace(/^\.+/, "");
	var elPart = el.querySelector(selector);

	if (elPart?.parentNode === el) return elPart;	//existed
	if (!template) return null;		//don't create

	//arguments
	if (typeof template === "boolean") template = {};	// same as { createByDefault: template };
	else if (typeof template === "string") template = { innerHtml: template };

	//build outerHtml
	if (!template.outerHtml) {
		if (typeof template.innerHtml !== "undefined") {
			template.outerHtml = "<span class='" + className + "'>" + template.innerHtml + "</span>";
		}
		else {
			//create by default
			if (className === "tree-children") template.outerHtml = DEFAULT_CHILDREN_TEMPLATE;
			else if (className === "tree-to-expand") template.outerHtml = DEFAULT_TO_EXPAND_TEMPLATE;
			else template.outerHtml = "<span class='" + className + "'>" + className + "</span>";
		}
	}

	//create
	if (className === "tree-children") {
		elPart = insert_adjacent_return.append(el, template.outerHtml);	//append to the last
	}
	else if (before) {
		elPart = insert_adjacent_return.prepend(el, template.outerHtml);
	}
	else {
		//before tree-children
		var elChildren = el.querySelector("#" + ele_id(el) + " > .tree-children");
		elPart = elChildren
			? insert_adjacent_return.prependOut(elChildren, template.outerHtml)
			: insert_adjacent_return.append(el, template.outerHtml);
	}

	//ensure class name existed.
	if (!el.querySelector(selector)) elPart.classList.add(className);

	return elPart;
}

//shortcuts of .nodePart()
var nodeChildren = function (el, template) { return nodePart(el, "tree-children", template); }
var nodeName = function (el, template) { return nodePart(el, "tree-name", template); }
var nodeToExpand = function (el, template, before) {
	return nodePart(el, "tree-to-expand", template, (typeof before === "undefined") ? true : before);
}

//is part
var isPart = function (el, className) {
	return el?.classList.contains(className);
}

var isChildrenPart = function (el) {
	return el?.classList.contains("tree-children");
}

var isChildrenContainer = function (el) {
	return el?.classList.contains("tree-children") || el?.classList.contains("tree-container");
}

//get parent tree-node
var nodeParent = function (el) {
	el = getNode(el)?.parentNode;		//tree-children
	if (!el || el.classList.contains("tree-container")) return null;

	el = el.parentNode;		//tree-node
	return el?.classList.contains("tree-node") ? el : null;
}

//module exports

module.exports = {
	DEFAULT_CHILDREN_TEMPLATE,
	DEFAULT_TO_EXPAND_TEMPLATE,

	nodePart,

	nodeChildren,
	nodeName,
	nodeToExpand,

	isPart,
	isChildrenPart,
	isChildrenContainer,

	nodeParent,
};
