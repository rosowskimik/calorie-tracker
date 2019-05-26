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
		itemCaloriesInput: '#item-calories' 
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

			//Clear input
			UICtrl.clearInput()
		}
		e.preventDefault();
	}

	//Public methods
	return {
		init: () => {
			//Fetch items
			const items = ItemCtrl.getItems();

			//Check if any items
			if(items.length === 0) {
				UICtrl.hideList();
			} else {
				//Output items into UI
				UICtrl.populateItemList(items);
			}

			//Load event listeners
			loadEventListeners();
		}
	}
})(ItemCtrl, UICtrl);

App.init();