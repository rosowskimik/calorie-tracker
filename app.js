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
			{id: 0, name: 'Steak Dinner', calories: 1200},
			{id: 1, name: 'Cookies', calories: 400},
			{id: 2, name: 'Eggs', calories: 500}
		],
		currentItem: null,
		totalCalories: 0
	}
	//Public methods
	return {
		logData: () => {
			return data;
		},
		getItems: () => {
			return data.items;
		}
	}
})();

//UI Controller
const UICtrl = (() => {
	const UISelectors = {
		itemList: '#item-list'
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
		}
	}
})();
//App Controller
const App = ((ItemCtrl, UICtrl) => {


	//Public methods
	return {
		init: () => {
			//Fetch items
			const items = ItemCtrl.getItems();
			//Output items into UI
			UICtrl.populateItemList(items);
		}
	}
})(ItemCtrl, UICtrl);

App.init();