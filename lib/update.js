
var { getNodeInfo, INFO_NODE } = require("./node-info.js");
var { nodeName } = require("./part.js");

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
