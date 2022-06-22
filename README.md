# treeview-model
dom treeview ui model
# Install
```
npm install treeview-model
```

# Usage & Api
```javascript

var treeview_model = require("treeview-model");

document.getElementById('divResult3').innerHTML =
	`<div class="tree-container" id="tree1">
		<div class="tree-node" id=nd1>
			<span class='tree-name'>nd1</span>
			<div class="tree-children">
				<div class="tree-node" id=nd2>
					<span class='tree-name'>nd2</span>
				</div>
				<div class="tree-node" id=nd3>
					<span class='tree-name' id=name3>nd3</span>
					<span class='my-1' id=nd3my1>-my1</span>
				</div>
			</div>
		</div>
	</div>`;

var el = document.getElementById('tree1');	//container

var nd3 = document.getElementById('nd3');
var my1 = document.getElementById('nd3my1');

//.containerAttribute(el, name, value, json)		//get or set container attribute, refer to element-attribute @ npm.
treeview_model.containerAttribute(my1, "aa", 11);
treeview_model.containerAttribute(my1, "bb", { b: 22 });

done(!(

	//.getNode(el)		//get 'tree-node' from self or ancestor of an element
	treeview_model.getNode(my1) === nd3 &&

	/*
	.nodePart(el, className, template, before)
		template: { (outerHtml | innerHtml | createByDefault) } 
			| innerHtml | createByDefault===true

		shortcuts:
			.nodeChildren(el, template)
			.nodeName(el, template)
			.nodeToExpand(el, template, before)
	*/
	treeview_model.nodeName(my1) === document.getElementById('name3') &&
	treeview_model.nodePart(nd3, "my-1") === my1 &&

	//.getContainer(el)		//get 'tree-container' from self or ancestor of an element
	treeview_model.getContainer(my1) === el &&

	el.getAttribute("aa") === "11" &&
	el.getAttribute("bb") === '{"b":22}' &&
	treeview_model.containerAttribute(my1, "aa") === "11" &&
	treeview_model.containerAttribute(my1, "aa", void 0, true) === 11 &&
	JSON.stringify(treeview_model.containerAttribute(my1, "bb")) === '{"b":22}' &&
	treeview_model.containerAttr(my1, "bb", void 0, false) === '{"b":22}' &&

	treeview_model.isContainer(el) &&
	treeview_model.isPart(nd3, "tree-node") &&
	treeview_model.isPart(nd3.parentNode, "tree-children") &&

	true
));

```

# Convention

```
a treeview is defined as

lv1:	<div class='tree-container'>						//tree container at topmost, required;
			...
lv1:		<div class='tree-node'>							//tree node main element, required;

				//all sub items should be direct children of 'tree-node'

lv2:			<span class='tree-to-expand'>...</span>		//expand/collapse command element, optional;
lv2:			//<span class='tree-to-expand tree-to-collapse/tree-disable'>...</span>	//state

lv2:			<span class='tree-name'>...</span>			//name element, optional;

lv4:			...											//other user defined content;

				//the last sub item is 'tree-children'

lv1:			<div class='tree-children'>...</div>		//required if a node contains children;
			</div>

lv2:		<div class='tree-node tree-selected tree-selected-last'>...</div>
															//tree-node selected state, optional;

		</div>

* lv1 - basic required;
* lv2 - optional, with tool set in this lib;
* lv3 - optional, editing tools in this lib;
* lv4 - user defined;

* the 'class' names are the required properties;
* the element tags are in user's favour;

```
