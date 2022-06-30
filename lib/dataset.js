
/*
require listen-on-click, based on .getOnClickOptions();

	map eid of tree-children/tree-container, to data;
*/

var { getOptions } = require("./listen-on-click.js");

var getDataset = function (el) {
	return getOptions(el)?.dataset;
}

var initDataset = function (el, entryKey, entryData, dataset) {
	if (!dataset) {
		dataset = getDataset(el);
		if (!dataset) dataset = {};
	}

	for (var i in dataset) delete dataset[i];	//clean it

	if (entryKey) {
		dataset[entryKey] = dataset[""] = entryData;
	}

	return dataset;
}

//module exports

module.exports = {
	getDataset,

	initDataset,
}
