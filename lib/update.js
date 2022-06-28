
var { getNode } = require("./node.js");
var { getContainer } = require("./container.js");
var { getNodeInfo, INFO_NODE, INFO_TYPE } = require("./node-info.js");
var { nodeName, nodeToExpand } = require("./part.js");
var { selectedState, unselectInElement } = require("./selected.js");
var { setToExpandState } = require("./to-expand.js");

/*
updateNode(elNode, content | name, options)
	content
		.nameHtml
			name html;
		.name
			name text;

return the updated node
*/
var updateNode = function (elNode, content, options) {
	//arguments
	if (!content) {
		console.log("invalid data", content);
		return null;
	}

	var ni = getNodeInfo(elNode, true);
	if (!ni) return null;

	elNode = ni[INFO_NODE];

	if (typeof content === "string") content = { name: content };

	//update
	if (content.nameHtml)
		nodeName(elNode).innerHTML = content.nameHtml;
	else
		nodeName(elNode).textContent = content.name + "";

	return elNode;
}

//module exports

module.exports = {
	updateNode,
	update: updateNode,
};
