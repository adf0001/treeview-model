# treeview-model
dom treeview ui model
# Install
```
npm install treeview-model
```

# Usage & Api
```javascript

var treeview_model = require("treeview-model");

document.getElementById('divResult3').innerHTML = '<div></div>';

var el = document.getElementById('divResult3').firstChild;

/*
.addNode(elNode, options, childrenContainer)
	options:{ (outHtml | innerHtml/content | name, toExpand, toExpandTemplate),
		childrenTemplate, insert, sweepSpaces } | name.
	childrenContainer: set true if the 'elNode' is already a children container; ignored if `.insert` is true;

shortcuts:
	.add(elNode, options, childrenContainer)

	.insertNode(elNode, options, toNext)
	.insert(elNode, options, toNext)

	.insertNodeToNext(elNode, options)
	.insertNext(elNode, options)
*/
var elNode1 = treeview_model.add(el, "aaa", true);	//add by 'name'

var elNode2 = treeview_model.add(elNode1, "bbb");
treeview_model.nodeToExpand(elNode2, true);		//create to-expand by default

var elNode3 = treeview_model.add(elNode2,	//create by template
	{
		content: "<span class='tree-name'>ccc</span><span class='my-cls'>ddd</span>"
	}
);

/*
.nodePart(el, className, template, before)
	template: { (outerHtml | innerHtml/content | createByDefault) } 
		| content | createByDefault===true

	shortcuts:
		.nodeChildren(el, template)
		.nodeName(el, template)
		.nodeToExpand(el, template, before)
*/
var elMy1 = treeview_model.nodePart(elNode3, "my-cls");
var elMy2 = treeview_model.nodePart(elNode3, "my-cls2", true);	//create part if not exist, by default

el.onclick = function (evt) {
	var target = evt.target;

	if (target.classList.contains("tree-to-expand")) {

		/*
		.setToExpandState(el, state, text, updateChildren)		//set state of 'tree-to-expand'.
			state:
				bool, or string "toggle" or "disable"

			updateChildren:
				update children part flag;
					true	- default; set css style 'display' to 'none' or '', when state is bool-value;
					false	- do not touch 'tree-children';
					"none"/""/string	- set css style 'display' value;
			
			return the to-expand element;

		.getToExpandState(el)		//return null/true/false/"disable"
		*/
		treeview_model.setToExpandState(target, "toggle");

		//.getToExpandState(el)		//return null/true/false/"disable"
		var state = treeview_model.getToExpandState(target);
		target.style.background = state ? "lime" : "yellow";
	}
};

done(!(
	//.getNode (el)		//get 'tree-node' from self or ancestor of an element
	treeview_model.getNode(elMy1) === elNode3 &&
	treeview_model.getNode(elNode3) === elNode3
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

lv2:		<div class='tree-node tree-selected'>...</div>	//tree-node selected state, optional;

		</div>

* lv1 - basic required;
* lv2 - optional, with tool set in this lib;
* lv3 - optional, editing tools in this lib;
* lv4 - user defined;

* the 'class' names are the required properties;
* the element tags are in user's favour;

```
