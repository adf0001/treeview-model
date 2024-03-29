
/*
get 'tree-node' from self or ancestor of an element;
return null if unfound;
*/
var getNode = function (el) {
	if (typeof el === "string") el = document.getElementById(el);

	while (el?.classList) {
		if (el.classList.contains('tree-node')) return el;
		if (el.classList.contains('tree-container')) return null;
		el = el.parentNode;
	}
	return null;
}

//is tree-node
var isNode = function (el) {
	return el?.classList.contains("tree-node");
}

//module exports

module.exports = {
	getNode,
	isNode,
};
