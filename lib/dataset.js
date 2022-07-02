
/*
require listen-on-click, based on .getOnClickOptions();

	map eid of tree-children/tree-container, to data;
*/

var { getOptions } = require("./options.js");

var getDataset = function (el) {
	return getOptions(el)?.dataset;
}

//set dataset to `false` will prevent creating new dataset
var initDataset = function (el, entryKey, entryData, dataset) {
	if (!dataset) {
		var curDataset = getDataset(el);
		if (!curDataset && dataset === false) return;		//`false` will prevent creating new dataset

		dataset = curDataset || {};
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
