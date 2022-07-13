
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

var getOptionsProperty = function (el, options, name, updateOptions) {
	if (!options) {
		options = getOnClickOptions(el);
		return options ? options[name] : (void 0);
	}
	else if (!(name in options)) {
		var v = getOnClickOptions(el)?.[name];
		if (updateOptions && typeof v !== "undefined") options[name] = v;
		return v;
	}
	else return options[name];
}

//module exports

module.exports = {
	getOnClickOptions,
	getOptions: getOnClickOptions,

	getOptionsProperty,

	combineCurrentOptions,
};
