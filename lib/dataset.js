
/*
require set-on-click, based on .getOnClickOptions();

	map eid of tree-children/tree-container, to data;
*/

var { getOptionsProperty } = require("./options.js");

var getDataset = function (el, options, updateOptions) {
	return getOptionsProperty(el, options, "dataset", updateOptions);
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
		dataset[entryKey] = dataset[" "] = entryData;		//a space char for top index
	}

	return dataset;
}

//module exports

module.exports = {
	getDataset,

	initDataset,
}
