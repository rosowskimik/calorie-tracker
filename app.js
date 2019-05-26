//Storage Controller

//Item Controller
const ItemCtrl = (function(){
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
		logData: function(){
			return data;
		}
	}
})();

//UI Controller
const UICtrl = (function() {
	
	//Public methods
	return{

	}
})();
//App Controller
const App = (function(ItemCtrl, UICtrl){


	//Public methods
	return {
		init: function(){
			console.log('Initalizing App...');
		}
	}
})(ItemCtrl, UICtrl);

App.init();