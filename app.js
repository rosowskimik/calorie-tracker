//Storage Controller

//Item Controller
const ItemCtrl = (() => {

	//Item constructor
	class Item {
		constructor(id, name, calories){
		this.id = id;
		this.name = name;
		this.calories = calories;
		}
	}

	//Placeholder data / data structure
	const data = {
		items: [
			// {id: 0, name: 'Steak Dinner', calories: 1200},
			// {id: 1, name: 'Cookies', calories: 400},
			// {id: 2, name: 'Eggs', calories: 500}
		],
		currentItem: null,
		totalCalories: 0
	}

	//Public methods
	return {
		getItems: () => {
			return data.items;
		},

		addItem: (name, calories) => {
			//Create ID
			let id;
			if(data.items.length > 0){
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
			return total
		},

		getItemById: id => {
			let found = null;
			data.items.forEach(item => {
				if(item.id === id){
					found = item;
				}
			})
			return found
		},

		setCurrentItem: item => {
			data.currentItem = item;
		},

		getCurrentItem: () => {
			return data.currentItem
		},

		logData: () => {
			return data;
		}
	}
})();

//UI Controller
const UICtrl = (() => {

	//UISelectors object
	const UISelectors = {
		itemList: '#item-list',
		addBtn: '.add-btn',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories' ,
		totalCalories: '.total-calories',
		updateBtn: '.update-btn',
		deleteBtn: '.delete-btn',
		backBtn: '.back-btn'
	};
	
	//Public methods
	return {
		populateItemList: items => {
			let html = '';
			items.forEach(item => {
				html += `
					<li class="collection-item" id="item-${item.id}">
						<strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil" aria-hidden="true"></i></a>
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
			}
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
				<strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil" aria-hidden="true"></i></a>
			`;
			//Insert item
			document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
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
			document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
			document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
			UICtrl.showEditState();
		},

		clearEditState: () => {
			UICtrl.clearInput();
			document.querySelector(UISelectors.updateBtn).style.display = 'none';
			document.querySelector(UISelectors.deleteBtn).style.display = 'none';
			document.querySelector(UISelectors.backBtn).style.display = 'none';
			document.querySelector(UISelectors.addBtn).style.display = 'inline';
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
	}
})();

//App Controller
const App = ((ItemCtrl, UICtrl) => {
	//Load event lsiteners
	const loadEventListeners = () => {
		//Get UI Selectors
		const UISelectors = UICtrl.getSelectors();

		//Add item event
		document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

		//Edit icon click event
		document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
	}

	//Add item submit
	const itemAddSubmit = e => {
		//Get form input from UICtrl
		const input = UICtrl.getItemInput();

		//Check for name and calorie input
		if(input.name !== '' && input.calories !== ''){
			//Add item
			const newItem = ItemCtrl.addItem(input.name, input.calories);

			//Add item to UI list
			UICtrl.addListItem(newItem);

			//Get total calories
			const totalCalories = ItemCtrl.getTotalCalories();
			UICtrl.showTotalCalories(totalCalories);

			//Clear input
			UICtrl.clearInput()
		}
		e.preventDefault();
	}

	//Update item submit
	const itemUpdateSubmit = e => {
		//Target edit icon
		if(e.target.classList.contains('edit-item')){
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
	}

	//Public methods
	return {
		init: () => {
			//Clear edit state
			UICtrl.clearEditState();

			//Fetch items
			const items = ItemCtrl.getItems();

			//Check if any items
			if(items.length === 0) {
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
	}
})(ItemCtrl, UICtrl);

App.init();