
//global variable, for html page, refer tpsvr @ npm.
treeview_model = require("../treeview-model.js");

add_css_text = require("add-css-text");

//tools
function getUpdateSel() {
	var updateSel = document.getElementById("selUpdateSel").value;
	if (updateSel === "true") updateSel = true;
	else if (updateSel === "false") updateSel = false;

	//alert(updateSel);
	return updateSel;
}

module.exports = {
	"level-1": function (done) {
		treeview_model = require("../level-1.js");

		document.getElementById('divResult3').innerHTML =
			`<div id=div-tool>
				<div style="border-bottom:1px solid gray;padding-bottom:0.3em;">
					level-1: 
					<span class='-ht-cmd' id=cmdBoldName>style-bold</span>/<span class='-ht-cmd' id=cmdStyleCancel title="cancel">-</span>
				</div>
			</div>` +
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

		document.getElementById("cmdBoldName").onclick =
			document.getElementById("cmdStyleCancel").onclick =
			function (evt) {
				var eid = evt?.target?.id;
				if (eid === "cmdBoldName") {
					add_css_text(".tree-container .tree-node .tree-name{font-weight:bold;}", "tvm-test-style", true);
				}
				else if (eid === "cmdStyleCancel") {
					add_css_text("", "tvm-test-style", true);
				}
			};

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
				template: { (outerHtml | innerHtml/content | createByDefault) } 
					| content | createByDefault===true
	
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

			true
		));
	},

	"level-2": function (done) {
		module.exports["level-1"](function (err, data) {
			if (err) { done(err); return; }

			treeview_model = require("../level-2.js");

			var container = treeview_model.getContainer("nd1");

			var elTool = document.getElementById('div-tool');
			elTool.insertAdjacentHTML("beforeend",
				`<div style="border-bottom:1px solid gray;padding-bottom:0.3em;">
					level-2: 
					<span class='-ht-cmd' id=cmdToggle>toggle</span>
					<span class='-ht-cmd' id=cmdDisable>disable</span>
					<span class='-ht-cmd' id=cmdClick>click</span>/<span class='-ht-cmd' id=cmdClickname title="click name">name</span>
					<label><input id=chkMultiple type=checkbox>multiple</label>
					<label><input id=chkToggleSelection type=checkbox>toggle-selection</label>
					<select id=selUpdateSel>
						<optgroup  label="update select"></optgroup>
						<option value="false">false</option>
						<option value="true">true/remove</option>
						<option value="shift">shift</option>
					</select>
					<span class='-ht-cmd' id=cmdUnselect title="unselect in element">unselect-in</span>/<span class='-ht-cmd' id=cmdUnselectAll title="unselect all">all</span>
					<label title="unselect-in include"><input id=chkIncude type=checkbox>include</label>
					&nbsp;
					<span id=spMsg></span>
				</div>`
			);

			document.getElementById("cmdToggle").onclick =
				document.getElementById("cmdDisable").onclick =
				document.getElementById("cmdClick").onclick =
				document.getElementById("cmdClickname").onclick =
				document.getElementById("cmdUnselect").onclick =
				document.getElementById("cmdUnselectAll").onclick =
				function (evt) {
					var eid = evt?.target?.id;

					var elSel = treeview_model.getSelected(container, true);
					var elSelOne = (elSel instanceof Array) ? elSel[elSel.length - 1] : elSel;

					if (eid === "cmdToggle" || eid === "cmdDisable") {
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
						if (elSelOne) treeview_model.setToExpandState(elSelOne, (eid === "cmdToggle") ? "toggle" : "disable");
					}
					else if (eid === "cmdClick") {
						/*
						.clickPart(el, className, delay)
			
						shortcuts
							.clickName(el, delay)
							.clickToExpand(el, delay)
							.clickContainer(el, delay)
						*/
						if (elSelOne) treeview_model.clickToExpand(elSelOne);
					}
					else if (eid === "cmdClickname") {
						if (elSelOne) treeview_model.clickName(elSelOne);
					}
					else if (eid === "cmdUnselect") {
						/*
						.unselectInElement(el, include)		//return unselect count
			
						shortcuts:
							.unselectAll(el)
						*/
						if (elSelOne) treeview_model.unselectInElement(elSelOne, document.getElementById("chkIncude").checked);
					}
					else if (eid === "cmdUnselectAll") {
						if (elSelOne) treeview_model.unselectAll(elSelOne);
					}

					treeview_model.clickContainer(container);	//update info
				};

			function setOnClick() {
				/*
				.listenOnClick(el, options)		//listen click event by setting container.onclick.
					options:
						.multipleSelection
							boolean type; multiple selection flag;
	
						.updateSelection
							false		//default
								don't touch selection; 
							true/"remove"
								remove the collapsed nodes from the selection;
							"shift"
								remove the collapsed nodes from the selection;
									and if any node is removed from the selection,
										add the node that casused collapsing to the selection;
	
						.toggleSelection
							boolean type; selection can be canceled by another click;
						
						.notifyClick
							set a click event to container after setting container.onclick;
				*/

				treeview_model.listenOnClick(container, {
					multipleSelection: document.getElementById("chkMultiple").checked,
					updateSelection: getUpdateSel(),
					toggleSelection: document.getElementById("chkToggleSelection").checked,
					notifyClick: true,
				});
			}

			setOnClick();

			//listen to container click event
			container.addEventListener("click", function () {
				setTimeout(() => {
					document.getElementById("spMsg").textContent = container.getAttribute("tree-selected-eid-data");
				}, 0);	//delay for linstener sequence
			});


			document.getElementById("chkMultiple").onclick =
				document.getElementById("selUpdateSel").onchange =
				document.getElementById("chkToggleSelection").onclick = setOnClick;

			treeview_model.nodeChildren('nd3my1', true).insertAdjacentHTML(
				"beforeend",
				`
				<div class="tree-node" id=nd5>
					<span class='tree-name'>nd5</span>
				</div>
				<div class="tree-node" id=nd6>
					<span class='tree-name'>nd6</span>
				</div>`
			);

			treeview_model.nodeChildren('nd5', true).insertAdjacentHTML(
				"beforeend",
				`
				<div class="tree-node" id=nd7>
					<span class='tree-name'>nd7</span>
				</div>
				<div class="tree-node" id=nd8>
					<span class='tree-name'>nd8</span>
				</div>`
			);

			var nd1 = document.getElementById('nd1');
			var nd3 = document.getElementById('nd3');
			var nd5 = document.getElementById('nd5');

			treeview_model.setToExpandState(nd1, "toggle");
			treeview_model.setToExpandState(nd3, "disable");

			/*
			.setNodeClass(el, className, value [, toContainer [, multiple ]] )	//set node class
				toContainer
					false
						only set current node class, don't save data to container;
					true
						save node eid data to container attribute className+"-eid-data";
	
						if "multiple" is false
							if "value" is true, toggle the last;
							then save eid as a json string object, or null;
						if "multiple" is true
							save as eid array, or empty array;
						if "multiple" is `undefined`
							get current "multiple" from the data, then save;
				value
					boolean type;
					when toContainer is true,
						set true to add to the container attribute;
						set false to remove from the container attribute;
		
			//shortcut for getNodeClass()/setNodeClass()/getClassNode()
			.nodeClass(el, className, boolValue, toOrFromContainer, multiple)

			//get multiple state from container
			.isClassNodeMultiple(el, className)

			shortcuts:
				//shortcut for "tree-selected"
				.selectedState(el, boolValue, toOrFromContainer, multiple)
				.getSelected(el, fromContainer)
				.isSelectedMultiple(el)
				.unselectInElement(el, include)
				.unselectAll(el)
			*/
			treeview_model.nodeClass(nd5, "my-cls1", true);
			treeview_model.nodeClass(nd5, "my-cls2", true, true);
			treeview_model.nodeClass(nd5, "my-cls3", true, true, true);
			treeview_model.nodeClass(nd5, "my-cls4", true);
			treeview_model.nodeClass(nd5, "my-cls4", false);

			treeview_model.clickName(nd5);

			done(!(
				treeview_model.getToExpandState(nd1) === false &&
				treeview_model.getToExpandState(nd3) === "disable" &&
				treeview_model.getToExpandState(nd5) === null &&

				nd5.classList.contains("my-cls1") &&
				nd5.classList.contains("my-cls2") &&
				nd5.classList.contains("my-cls3") &&

				container.getAttribute("my-cls1-eid-data") === null &&
				container.getAttribute("my-cls2-eid-data") === '"nd5"' &&
				container.getAttribute("my-cls3-eid-data") === '["nd5"]' &&

				treeview_model.getNodeClass(nd5, "my-cls1") === true &&
				treeview_model.getNodeClass(nd5, "my-cls2") === true &&
				treeview_model.getNodeClass(nd5, "my-cls3") === true &&
				treeview_model.getNodeClass(nd5, "my-cls4") === false &&

				typeof treeview_model.nodeClass(container, "my-cls1", void 0, true) === "undefined" &&
				treeview_model.nodeClass(container, "my-cls2", void 0, true).id === "nd5" &&
				treeview_model.nodeClass(container, "my-cls3", void 0, true)[0].id === "nd5" &&

				treeview_model.getClassNode(container, "my-cls2").id === "nd5" &&
				treeview_model.getClassNode(container, "my-cls3")[0].id === "nd5" &&

				treeview_model.isClassNodeMultiple(container, "my-cls2") === false &&
				treeview_model.isClassNodeMultiple(container, "my-cls3") === true &&

				treeview_model.getSelected(nd5) === true &&
				treeview_model.getSelected(nd5, true).id === "nd5" &&
				treeview_model.getSelected(container, true).id === "nd5" &&

				treeview_model.isSelectedMultiple(container) === false &&

				true
			));
		})
	},

	"level-3": function (done) {
		module.exports["level-2"](function (err, data) {
			if (err) { done(err); return; }

			treeview_model = require("../level-3.js");

			var container = treeview_model.getContainer("nd1");

			var elTool = document.getElementById('div-tool');
			elTool.insertAdjacentHTML("beforeend",
				`<div style="border-bottom:1px solid gray;padding-bottom:0.3em;">
					level-3: 
					<span class='-ht-cmd' id=cmdAdd>add</span>/<span class='-ht-cmd' id=cmdAdd2>2</span> &nbsp;
					<span class='-ht-cmd' id=cmdInsert>insert</span>/<span class='-ht-cmd' id=cmdInsert2>2</span> &nbsp;
					<span class='-ht-cmd' id=cmdInsertNext>insert-next</span>/<span class='-ht-cmd' id=cmdInsertNext2>2</span> &nbsp;
					<span class='-ht-cmd' id=cmdRemove>remove</span>/<span class='-ht-cmd' id=cmdRemoveChildren title="remove only children">ch</span> &nbsp;
					<span class='-ht-cmd' id=cmdUpdate>update</span> &nbsp;
				</div>`
			);

			document.getElementById("cmdAdd").onclick =
				document.getElementById("cmdAdd2").onclick =
				document.getElementById("cmdInsert").onclick =
				document.getElementById("cmdInsert2").onclick =
				document.getElementById("cmdInsertNext").onclick =
				document.getElementById("cmdInsertNext2").onclick =
				document.getElementById("cmdRemove").onclick =
				document.getElementById("cmdRemoveChildren").onclick =
				document.getElementById("cmdUpdate").onclick =
				function (evt) {
					var eid = evt?.target?.id;

					var elSel = treeview_model.getSelected(container, true);
					var elSelOne = (elSel instanceof Array) ? elSel[elSel.length - 1] : elSel;

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

					var elNew;
					var newName = (new Date()).toLocaleString();

					if (eid === "cmdAdd") {
						elNew = treeview_model.add(elSelOne || container, newName, !elSelOne);
					}
					else if (eid === "cmdAdd2") {
						elNew = treeview_model.add(elSelOne || container, newName + "<b>-1</b>", !elSelOne);
						elNew = treeview_model.add(elSelOne || container, { nameHtml: newName + "<b>-2</b>" }, !elSelOne);
					}
					else if (eid === "cmdInsert") {
						elNew = treeview_model.insert(elSelOne, newName);
					}
					else if (eid === "cmdInsert2") {
						elNew = treeview_model.insert(elSelOne, newName + "<b>-3</b>");
						elNew = treeview_model.insert(elSelOne, { nameHtml: newName + "<b>-4</b>" });
					}
					else if (eid === "cmdInsertNext") {
						elNew = treeview_model.insertNext(elSelOne, newName);
					}
					else if (eid === "cmdInsertNext2") {
						elNew = treeview_model.insertNext(elSelOne, newName + "<b>-5</b>");
						elNew = treeview_model.insertNext(elSelOne, { nameHtml: newName + "<b>-6</b>" });
					}
					else if (eid === "cmdRemove") {
						/*
						.removeNode(elNode, options)		//remove node
							options:
								.onlyChildren
									set true to remove only the children, not the elNode itself;
						
								.removeEmptyChildren
									set true remove empty tree-children;
						
								.updateSelection
									true/false/any-others		//default
										remove the disappeared nodes from the selection;
									"shift"
										remove the disppeared nodes from the selection;
											and if any node is removed from the selection,
												add the next/previous/parent node to the selection;
						
							return true if finished
						
						shortcuts:
							.removeAllChildren(elNode, options)
						*/

						treeview_model.remove(elSel, {
							updateSelection: getUpdateSel()
						});
					}
					else if (eid === "cmdRemoveChildren") {
						treeview_model.removeChildren(elSel, {
							updateSelection: getUpdateSel()
						});
					}
					else if (eid === "cmdUpdate") {
						if (elSelOne) {
							treeview_model.nodeName(elSelOne).textContent = newName;
						}
					}

					if (elNew && !treeview_model.isSelectedMultiple(elNew)) {
						treeview_model.clickName(elNew);
					}
				};

			treeview_model.add(
				'nd5',
				{
					outerHtml: `
						<div class="tree-node" id=nd9>
							<span class='tree-name'>nd9</span>
						</div>
						<div class="tree-node" id=nd10>
							<span class='tree-name'>nd10</span>
						</div>`,
					sweepSpaces: true,
				}
			);

			//.getNodeInfo(elNode, onlyTreeNode)
			//get a NodeInfo, that is, [elNode]/[elChildren,"children"]/[elContainer, "container"]

			var nd5 = document.getElementById("nd5");

			var nf1 = treeview_model.getNodeInfo(nd5);
			var nf1b = treeview_model.getNodeInfo("nd5", true);
			var nf1c = treeview_model.getNodeInfo(nf1, true);

			var nd5Children = treeview_model.nodeChildren("nd5");	//a children part
			var nf2 = treeview_model.getNodeInfo(nd5Children);
			var nf2b = treeview_model.getNodeInfo(nd5Children, true);

			var nf3 = treeview_model.getNodeInfo(container);	//the container
			var nf3b = treeview_model.getNodeInfo(container, true);

			var { INFO_NODE, INFO_TYPE } = treeview_model;

			done(!(
				nf1[INFO_NODE] === nd5 &&
				!nf1[INFO_TYPE] &&
				nf1b[INFO_NODE] === nd5 &&
				!nf1b[INFO_TYPE] &&
				nf1 === nf1c &&

				nf2[INFO_NODE] === nd5Children &&
				nf2[INFO_TYPE] === "children" &&
				nf2b === null &&

				nf3[INFO_NODE] === container &&
				nf3[INFO_TYPE] === "container" &&
				nf3b === null &&

				true
			));
		})
	},

	"check exports": function (done) {
		for (var i in treeview_model) {
			if (typeof treeview_model[i] === "undefined") {
				done("undefined: " + i);
				return;
			}
		}
		console.log(treeview_model);
		console.log("export list: " + Object.keys(treeview_model).join(", "));
		done(false);
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('treeview_model', function () { for (var i in module.exports) { it(i, module.exports[i]).timeout(5000); } });
