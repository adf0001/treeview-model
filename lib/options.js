
var { getContainer } = require("./container.js");

var { onclickPortal } = require("global-event-handler-portal");

var getOnClickOptions = function (el) {
	return onclickPortal(getContainer(el), "get-options");
}

//combine current options with new options
var combineCurrentOptions = function (el, newOptions) {
	var curOptions = getOnClickOptions(el);
	if (!curOptions) return newOptions || {};	//ensure options is an object

	if (!newOptions) return curOptions;

	for (var i in curOptions) {
		if (!(i in newOptions)) newOptions[i] = curOptions[i];
	}
	return newOptions;
}

//module exports

module.exports = {
	getOnClickOptions,
	getOptions: getOnClickOptions,

	combineCurrentOptions,
};
