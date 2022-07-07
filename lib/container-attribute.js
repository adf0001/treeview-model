
var element_attribute = require("element-attribute");

var { getContainer } = require("./container.js");

//get or set container attribute, refer to element-attribute @ npm.
var containerAttribute = function (el, name, value, json) {
	var container = getContainer(el);
	if (!container) return;

	return element_attribute(container, name, value, json);
}

//module exports

module.exports = {
	containerAttribute,
	containerAttr: containerAttribute,
};
