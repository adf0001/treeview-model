
var { getContainer } = require("./container.js");
var { nodeName, nodeChildren } = require("./part.js");
var { getSelected, selectedState, unselectInElement, unselectAll, updateLastSelected } = require("./selected.js");
var { clickName, clickContainer } = require("./click.js");
var { getToExpandState, setToExpandState } = require("./to-expand.js");
var { combineCurrentOptions } = require("./options.js");

/*
set container.onclick handler.
	options:
		.multipleSelection
			boolean type; multiple selection flag;

		.toggleSelection
			boolean type; selection can be canceled by another click;

		.updateSelection
			false
				don't touch selection; 
			true/"remove"
				remove the collapsed nodes from the selection;
			"shift"		//default
				remove the collapsed nodes from the selection;
					and if any node is removed from the selection,
						add the node that casused collapsing to the selection;
		
		.notifyClick
			set a click event to container after setting container.onclick;
	
	replaceOptions
		if set true, replace the whole options;
		otherwise, current options will be combined into the new `options`;
*/
var setOnClick = function (el, options, replaceOptions) {
	var container = getContainer(el);
	if (!container) return;

	//combine options
	if (!replaceOptions) {
		options = combineCurrentOptions(container, options)
	}
	else if (!options) options = {};

	var multipleSelection = !!options.multipleSelection;
	var toggleSelection = options.toggleSelection;

	var updateSelection = options.updateSelection;
	if (updateSelection !== true && updateSelection !== false && updateSelection !== "remove")
		options.updateSelection = updateSelection = "shift";

	//if evt==="get-options", return the options;
	container.onclick = function (evt) {
		if (evt === "get-options") return options;

		var elTarget = evt.target;

		if (elTarget.classList.contains("tree-to-expand")) {
			var state = getToExpandState(elTarget), elChildren;
			if (state === "disable") return;

			setToExpandState(elTarget, "toggle");
			state = !state;

			if (!state || !updateSelection ||
				!(elChildren = nodeChildren(elTarget)) || !elChildren.firstElementChild
			) return;

			var unselectList = unselectInElement(elChildren, false);

			if (unselectList && updateSelection === "shift") {
				selectedState(elTarget, false, true, multipleSelection);
				clickName(elTarget);	//may notify
			}
		}
		else {
			var elName = nodeName(elTarget);
			if (elName && elName.contains(elTarget)) {	//click on name or inside name
				selectedState(elTarget, toggleSelection ? !(getSelected(elTarget)) : true, true, multipleSelection);
				if (multipleSelection) updateLastSelected(container);
			}
		}
	}

	//refresh selection
	var sel = getSelected(container, true);
	if (multipleSelection) {
		if (!sel || !(sel instanceof Array)) {
			selectedState(sel || container, sel, true, multipleSelection);
		}
	}
	else {
		if (sel instanceof Array) {
			sel = sel[sel.length - 1] || null;
			unselectAll(container);
			selectedState(sel || container, sel, true, multipleSelection);
		}
	}

	updateLastSelected(container);	//call update when multiple or not

	if (options.notifyClick) clickContainer(container);
}

//module exports

module.exports = {
	setOnClick,
};
