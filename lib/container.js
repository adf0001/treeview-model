
var ele_id = require("ele-id");

function cacheContainerId(elArray, containerId) {
	if (elArray.length) elArray.forEach(v => v.setAttribute("tree-container-eid", containerId));
}

/*
get 'tree-container' from self or ancestors of an element
*/
var getContainer = function (el) {
	if (typeof el === "string") el = document.getElementById(el);

	var cl, container;
	var elList = [];		//cache container id in tree-children

	while (el && (cl = el.classList)) {
		if (cl.contains('tree-container')) {
			cacheContainerId(elList, ele_id(el));
			return el;
		}

		if (cl.contains('tree-children')) {
			if (container = el.getAttribute("tree-container-eid")) {
				cacheContainerId(elList, container);
				return document.getElementById(container);
			}
			elList.push(el);
		}

		el = el.parentNode;
	}
	return null;
}

//is container
var isContainer = function (el) {
	return el?.classList.contains("tree-container");
}

//module exports

module.exports = {
	getContainer,
	isContainer,
};
