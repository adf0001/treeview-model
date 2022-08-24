
var { getNode } = require("./node.js");

var INFO_NODE = 0;
var INFO_TYPE = 1;

/*
get a NodeInfo, that is, [elNode]/[elChildren/el,"children"]/[elContainer/el, "container"];
return Error if fail;
*/
var getNodeInfo = function (el, onlyTreeNode) {
	if (!el) return Error("invalid element");

	//tree-node filter
	if (onlyTreeNode) {
		var ni = getNodeInfo(el);
		if (ni instanceof Error) return ni;
		return ni[INFO_TYPE] ? Error("not a tree-node") : ni;
	}

	if (el instanceof Array) return el;		//already a NodeInfo
	else if (typeof el === "string") el = document.getElementById(el);	//ensure an dom element

	if (el) {
		if (el.classList.contains("tree-container")) return [el, "container"];
		if (el.classList.contains("tree-children")) return [el, "children"];

		el = getNode(el);	//get the tree-node
	}

	if (!el) return Error("invalid node");

	return [el];
}

//module exports

module.exports = {
	INFO_NODE,
	INFO_TYPE,

	getNodeInfo,
};
