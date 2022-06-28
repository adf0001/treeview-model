
var ele_id = require("ele-id");

var { nodeClass, isContainerClassNodeMultiple } = require("./node-class.js");
var { getContainer } = require("./container.js");

//shortcut for "tree-selected"
var selectedState = function (el, boolValue, toOrFromContainer, multiple) { return nodeClass(el, "tree-selected", boolValue, toOrFromContainer, multiple); }
var getSelected = function (el, fromContainer) { return nodeClass(el, "tree-selected", void 0, fromContainer); }
var isSelectedMultiple = function (el) { return isContainerClassNodeMultiple(el, "tree-selected"); }

var getOneSelected = function (el) {
	var elSelected = getSelected(el, true);
	return (elSelected instanceof Array) ? elSelected[elSelected.length - 1] : elSelected;
}

//set "tree-selected-last" class to the last selected item, when the selected count is 2 or more.
var updateMultipleLastSelected = function (el) {
	var container = getContainer(el);
	if (!container) return;

	//old last
	var elLast = container.getAttribute("tree-selected-last-eid");

	//new last
	var elSelected = getSelected(container, true);
	if (elSelected && (elSelected instanceof Array) && elSelected.length > 1) {
		elSelected = elSelected[elSelected.length - 1];

		if (elSelected) {
			if (elSelected.id === elLast) return;

			container.setAttribute("tree-selected-last-eid", elSelected.id);
			elSelected.classList.add("tree-selected-last");
		}
		else container.removeAttribute("tree-selected-last-eid");
	}
	else if (elLast) {
		container.removeAttribute("tree-selected-last-eid");
	}

	//clear last
	elLast = elLast && document.getElementById(elLast);
	if (elLast) elLast.classList.remove("tree-selected-last");
}

/*
return an unselect element array, or null.
*/
var unselectInElement = function (el, include) {
	var elSelected = getSelected(el, true);
	if (!elSelected) return null;

	var a = null;
	if (elSelected instanceof Array) {	//multiple selection
		elSelected.forEach(v => {
			if (el.contains(v)) {
				if (include || v !== el) {
					selectedState(v, false, true, true);	//multiple==true
					(a || (a = [])).push(v);
				}
			}
		});
	}
	else {		//single selection
		if (el.contains(elSelected)) {
			if (include || elSelected !== el) {
				selectedState(elSelected, false, true, false);	//multiple==false
				(a || (a = [])).push(elSelected);
			}
		}
	}

	return a;
}

//shortcuts for container
var unselectAll = function (el) {
	var container = getContainer(el);
	if (!container) return 0;

	return unselectInElement(container, false);
}

//module exports

module.exports = {
	selectedState,
	getSelected,
	isSelectedMultiple,
	getOneSelected,

	unselectInElement,
	unselectAll,

	updateMultipleLastSelected,
	updateLastSelected: updateMultipleLastSelected,

};
