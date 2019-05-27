//Storage Controller
const StorageCtrl = (() => {

	//Public methods
	return {
		storeItem: item => {
			let items;
			//Check if any items in ls
			if(localStorage.getItem('items') === null){
				items = [];
				//Push new item
				items.push(item);
				//Set ls
				localStorage.setItem('items', JSON.stringify(items));
			} else {
				items = JSON.parse(localStorage.getItem('items'));
				//Push new item
				items.push(item);
				//Set ls
				localStorage.setItem('items', JSON.stringify(items));
			}
		},

		getStoredItems: () => {
			let items;
			if(localStorage.getItem('items') === null){
				items = [];
			} else {
				items = JSON.parse(localStorage.getItem('items'));
			}
			return items
		}
	}
})();

//Item Controller
const ItemCtrl = (() => {
	//Item constructor
	class Item {
		constructor(id, name, calories) {
			this.id = id;
			this.name = name;
			this.calories = calories;
		}
	}

	//Placeholder data / data structure
	const data = {
		items: StorageCtrl.getStoredItems(),
		currentItem: null,
		totalCalories: 0
	};

	//Public methods
	return {
		getItems: () => {
			return data.items;
		},

		addItem: (name, calories) => {
			//Create ID
			let id;
			if (data.items.length > 0) {
				id = data.items[data.items.length - 1].id + 1;
			} else {
				id = 0;
			}
			//Calories to number
			calories = parseInt(calories);

			//Create new item
			newItem = new Item(id, name, calories);
			//Add to data items array
			data.items.push(newItem);

			return newItem;
		},

		getTotalCalories: () => {
			let total = 0;
			//Loop through items and add cal
			data.items.forEach(item => {
				total += item.calories;
			});

			//Set total cal in data structure
			data.totalCalories = total;
			return total;
		},

		getItemById: id => {
			let found = null;
			data.items.forEach(item => {
				if (item.id === id) {
					found = item;
				}
			});
			return found;
		},

		setCurrentItem: item => {
			data.currentItem = item;
		},

		getCurrentItem: () => {
			return data.currentItem;
		},

		udpateItem: (name, calories) => {
			//Calories to number
			calories = parseInt(calories);

			let found = null;

			data.items.forEach(item => {
				if (item.id === data.currentItem.id) {
					item.name = name;
					item.calories = calories;
					found = item;
				}
			});
			return found;
		},

		deleteItem: id => {
			//Get ids
			ids = data.items.map(item => {
				return item.id;
			});

			//Get index
			const index = ids.indexOf(id);

			//Remove data
			data.items.splice(index, 1);
		},

		clearAllItems: () => {
			data.items = [];
		},

		logData: () => {
			return data;
		}
	};
})();

//UI Controller
const UICtrl = (() => {
	//UISelectors object
	const UISelectors = {
		itemList: '#item-list',
		addBtn: '.add-btn',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		totalCalories: '.total-calories',
		updateBtn: '.update-btn',
		deleteBtn: '.delete-btn',
		backBtn: '.back-btn',
		listItems: '#item-list li',
		clearBtn: '.clear-btn'
	};

	//Public methods
	return {
		populateItemList: items => {
			let html = '';
			items.forEach(item => {
				html += `
					<li class="collection-item" id="item-${item.id}">
						<strong>${item.name}: </strong><em>${
					item.calories
					} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil" aria-hidden="true"></i></a>
					</li>
				`;
			});
			//Populate into UI
			document.querySelector(UISelectors.itemList).innerHTML = html;
		},

		getItemInput: () => {
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput).value
			};
		},

		addListItem: item => {
			//Show the list
			document.querySelector(UISelectors.itemList).style.display = 'block';
			//Create li element
			const li = document.createElement('li');
			li.className = 'collection-item';
			li.id = `item-${item.id}`;
			//Add HTML
			li.innerHTML = `
				<strong>${item.name}: </strong><em>${
				item.calories
				} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil" aria-hidden="true"></i></a>
			`;
			//Insert item
			document
				.querySelector(UISelectors.itemList)
				.insertAdjacentElement('beforeend', li);
		},

		//Clear input
		clearInput: () => {
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},

		//Hide list
		hideList: () => {
			document.querySelector(UISelectors.itemList).style.display = 'none';
		},

		showTotalCalories: calories => {
			document.querySelector(UISelectors.totalCalories).textContent = calories;
		},

		addItemToForm: () => {
			document.querySelector(
				UISelectors.itemNameInput
			).value = ItemCtrl.getCurrentItem().name;
			document.querySelector(
				UISelectors.itemCaloriesInput
			).value = ItemCtrl.getCurrentItem().calories;
			UICtrl.showEditState();
		},

		updateListItem: item => {
			let listItems = document.querySelectorAll(UISelectors.listItems);
			listItems.forEach(listItem => {
				const itemId = listItem.getAttribute('id');

				if (itemId === `item-${item.id}`) {
					document.querySelector(`#${itemId}`).innerHTML = `
						<strong>${item.name}: </strong><em>${
						item.calories
						} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil" aria-hidden="true"></i></a>
					`;
				}
			});
		},

		deleteListItem: id => {
			const itemId = `#item-${id}`;
			const item = document.querySelector(itemId);
			item.remove();
		},

		removeItems: () => {
			let listItems = document.querySelectorAll(UISelectors.listItems);

			listItems.forEach(item => {
				item.remove();
			})
		},

		clearEditState: () => {
			document.querySelector(UISelectors.updateBtn).style.display = 'none';
			document.querySelector(UISelectors.deleteBtn).style.display = 'none';
			document.querySelector(UISelectors.backBtn).style.display = 'none';
			document.querySelector(UISelectors.addBtn).style.display = 'inline';
			UICtrl.clearInput();
		},

		showEditState: () => {
			document.querySelector(UISelectors.updateBtn).style.display = 'inline';
			document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
			document.querySelector(UISelectors.backBtn).style.display = 'inline';
			document.querySelector(UISelectors.addBtn).style.display = 'none';
		},

		getSelectors: () => {
			return UISelectors;
		}
	};
})();

//App Controller
const App = ((ItemCtrl, UICtrl, StorageCtrl) => {
	//Load event listeners
	const loadEventListeners = () => {
		//Get UI Selectors
		const UISelectors = UICtrl.getSelectors();

		//Add item event
		document
			.querySelector(UISelectors.addBtn)
			.addEventListener('click', itemAddSubmit);

		//Disable submit on enter
		document.addEventListener('keypressed', e => {
			if (e.keyCode === 13 || e.which === 13) {
				e.preventDefault();
				return false;
			}
		});

		//Edit icon click event
		document
			.querySelector(UISelectors.itemList)
			.addEventListener('click', itemEditClick);

		//Update item event
		document
			.querySelector(UISelectors.updateBtn)
			.addEventListener('click', itemUpdateSubmit);

		//Back button event
		document
			.querySelector(UISelectors.backBtn)
			.addEventListener('click', UICtrl.clearEditState);

		//Delete button event
		document
			.querySelector(UISelectors.deleteBtn)
			.addEventListener('click', itemDeleteSubmit);

		//Clear all button event
		document
			.querySelector(UISelectors.clearBtn)
			.addEventListener('click', clearAllItemsClick)
	};

	//Add item submit
	const itemAddSubmit = e => {
		//Get form input from UICtrl
		const input = UICtrl.getItemInput();

		//Check for name and calorie input
		if (input.name !== '' && input.calories !== '') {
			//Add item
			const newItem = ItemCtrl.addItem(input.name, input.calories);

			//Add item to UI list
			UICtrl.addListItem(newItem);

			//Get total calories / add to UI
			const totalCalories = ItemCtrl.getTotalCalories();
			UICtrl.showTotalCalories(totalCalories);

			//Store in LS
			StorageCtrl.storeItem(newItem);

			//Clear input
			UICtrl.clearInput();
		}
		e.preventDefault();
	};

	//Item edit click
	const itemEditClick = e => {
		//Target edit icon
		if (e.target.classList.contains('edit-item')) {
			//Get list item id
			const listId = e.target.parentNode.parentNode.id;
			//Break into an array
			const listIdArr = listId.split('-');
			//Get the actual id
			const id = parseInt(listIdArr[1]);

			//Get item
			const itemToEdit = ItemCtrl.getItemById(id);
			//Set current item
			ItemCtrl.setCurrentItem(itemToEdit);

			//Add item to form
			UICtrl.addItemToForm();
		}

		e.preventDefault();
	};

		//Update item submit
		const itemUpdateSubmit = e => {
			//Get item input
			const input = UICtrl.getItemInput();

			//Update item
			const updatedItem = ItemCtrl.udpateItem(input.name, input.calories);

			//Update UI
			UICtrl.updateListItem(updatedItem);
			const totalCalories = ItemCtrl.getTotalCalories();
			UICtrl.showTotalCalories(totalCalories);
			UICtrl.clearEditState();
			//Clear input
			UICtrl.clearInput();

			e.preventDefault();
		};

	//Delete item submit
	const itemDeleteSubmit = e => {
		//Get current item
		const currentItem = ItemCtrl.getCurrentItem();

		//Delete from data structure
		ItemCtrl.deleteItem(currentItem.id);

		//Delete from UI
		UICtrl.deleteListItem(currentItem.id);
		const totalCalories = ItemCtrl.getTotalCalories();
		UICtrl.showTotalCalories(totalCalories);
		UICtrl.clearEditState();
		UICtrl.clearInput();

		e.preventDefault();
	};

	//Clear items event
	const clearAllItemsClick = () => {
		ItemCtrl.clearAllItems();
		UICtrl.removeItems();
		const totalCalories = ItemCtrl.getTotalCalories();
		UICtrl.showTotalCalories(totalCalories);
		UICtrl.hideList();
	}

	//Public methods
	return {
		init: () => {
			//Clear edit state
			UICtrl.clearEditState();

			//Fetch items
			const items = ItemCtrl.getItems();

			//Check if any items
			if (items.length === 0) {
				UICtrl.hideList();
			} else {
				//Output items into UI
				UICtrl.populateItemList(items);
			}

			//Get total calories
			const totalCalories = ItemCtrl.getTotalCalories();
			UICtrl.showTotalCalories(totalCalories);

			//Load event listeners
			loadEventListeners();
		}
	};
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
