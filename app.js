//budget Controller

  var budgetController = (function(){
	
	  var Expense = function(id,description,value){
	  	this.id = id;
	  	this.description = description;
	  	this.value = value;
	  };

	    var Income = function(id,description,value){
	  	this.id = id;
	  	this.description = description;
	  	this.value = value;
	  };

	  var calculateTotal = function(type){
	  	var sum = 0;
       
        data.allItems[type].forEach(function(current){

       	sum = sum + current.value;

       });

       data.totals[type] = sum;


	  };

	 

	  var data = {
	  	allItems:{
	  		exp: [],
	  		inc: [],
	  	},

	  	totals:{
	  		exp: 0,
	  		inc: 0,
	  	  
	  },

	    budget: 0,
	    percentage: -1
	  	};


	  return {
	  	addItem: function(type,des,val){
	  		var newItem,ID;

	  		
	  		//[1,2,3,4,5] next id =6
	  		if(data.allItems[type].length>0){
	  			ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
	  		}else{
	  			ID = 0;
	  		}

	  		

            //create new item based on inc or exp

	  		if(type === 'exp'){
	  		   newItem = new Expense(ID,des,val);	

	  		}else if(type === 'inc'){ 
	  			newItem = new Income(ID,des,val);
	  		}
            
            //push it into our data structure
	  		data.allItems[type].push(newItem);
	  		return newItem;

	  	},

	  	deleteItem: function(type,id){
             var ids,id;
	  		//id = 6
	  		//ids = [1,2,4,8];
	  		//index = 3

	  		ids = data.allItems[type].map(function(current){
	  			return current.id;
	  		});

	  		index = ids.indexOf(id);

	  		if(index !== -1){
	  			data.allItems[type].splice(index,1);
	  		}

	  	},

        calculateBudget: function(){

        	//calculate total income and expenses
        	calculateTotal('exp');
        	calculateTotal('inc');

           //calculate total budget: income - expense

           data.budget = data.totals.inc - data.totals.exp;

           //calculate the percentage of income that we spent

           data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
       },

       getBudget: function() {
       	 return {
       	 	budget:data.budget,
       	 	totalInc:data.totals.inc,
       	 	totalExp:data.totals.exp,
       	 	totaipercentage:data.percentage
       	 
       	 };

       },



	  	
	  	testing:function(){
	  		console.log(data);
	  	}

	  };
	
	
  })();
  
  //UI Controller
  
  var UIController = (function(){
	
	var DOMStrings = {
		 inputType: '.add__type',
		 inputDescription: '.add__description',
		 inputValue: '.add__value',
		 inputButton: '.add__btn',
		 incomeContainer: '.income__list',
		 expenseContainer: '.expenses__list',
		 budgetLevel: '.budget__value',
		 incomeLevel: '.budget__income--value',
		 expensesLevel: '.budget__expenses--value',
		 percentageLevel: '.budget__expenses--percentage',
		 container: '.container',
		 datelevel: '.budget__title--month'
		
	};

	var formatNumber = function(num, type){
          	var numSplit,int,dec,type;
          	/*
          	 + or - before number..
          	 exactly 2 decimal points
          	 comma seperating the thousands

          	 2345.4678  -> 2,345.49

          	*/

          	num = Math.abs(num);
          	num = num.toFixed(2); //2345.46777 = 2345.47

          	numSplit = num.split('.');

          	int = numSplit[0];

          	if(int.length > 3){
          		//int.substr(0, 1) + ',' + int.substr(1, 3); [//2345 = 2,345]

                int =  int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3); //23453 = 23,453

          	}
          	dec = numSplit[1];

            //+ or - before number

           // type === 'exp' ? sign = '-' : sign = '+';

            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
 

          };
 


	  
	  
	  return{
		  getInput: function(){
			  return{
				 type: document.querySelector(DOMStrings.inputType).value, //either exp or inc
			     description: document.querySelector(DOMStrings.inputDescription).value,
			     value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			  
			  };
			  
		  },

		  addListItem: function(obj,type){
             var newHtml,element;
             

            //Create HTML string with placehoder text..

            if(type === 'inc'){
            	       element = DOMStrings.incomeContainer; 

            	   html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         
            }else if(type === 'exp'){

            	element = DOMStrings.expenseContainer;
            	//html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';            
                 
            }

            //Replace placeholder with actual data

            newHtml = html.replace('%id%', obj.id);
              newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

                //Insert HTML into DOM
                 
                 document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


		  },

		  deleteListItem: function(selectorID){

		  	// document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID))

            var el = document.getElementById(selectorID);
		  	  el.parentNode.removeChild(el);


		  },



          clearFields: function(){
           var fields,arrayFields;

          fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

          //querySelectorAll list return kore..

          arrayFields =  Array.prototype.slice.call(fields);

          arrayFields.forEach(function(current,index,array){
               
               current.value="";
          });
           
           arrayFields[0].focus();
          },

          displayBudget: function(obj){
          	var type;

          	obj.budget>0 ? type ==='inc' : type = 'exp';
            
            document.querySelector(DOMStrings.budgetLevel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.incomeLevel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMStrings.expensesLevel).textContent =(obj.totalExp);
            document.querySelector(DOMStrings.percentageLevel).textContent = obj.percentage;
       	 
          },

          displayMonth: function(){
          	var now,months,year,month;

          	now = new Date();
          	year = now.getFullYear();

          	months = ['january','February','March','April','May','June','july','August','September','October','November','December'];
          	month = now.getMonth();

          	document.querySelector(DOMStrings.datelevel).textContent = months[month] + ',' + year;



          },

          

		  getDOMStrings: function(){
			 return DOMStrings;
		  }
		  
	  };

	  
  })();
  
  //GLOBAL APP Controller
  
  var controller = (function(budgetCtrl,UICtrl){

  	var setupEventListners = function() {
        
        var DOM = UICtrl.getDOMStrings();

  		document.querySelector(DOM.inputButton).addEventListener('click',ctrlADDItem);
	
	    document.addEventListener('keypress',function(event){
		if(event.keyCode === 13 || event.which === 13){
			ctrlADDItem();
			
		}

	   });

	    document.querySelector(DOM.container).addEventListener('click', ctrldeltItem);

     };
	  
      var updateBudget = function(){

         //calculate the budget
         budgetController.calculateBudget();

         //return the budget
         var budget = budgetController. getBudget();

         //display budget in ui
         UICtrl.displayBudget(budget);


      }


	 
	  
	  var ctrlADDItem = function(){

		  var input,newItem;
		  //get input field from data

		  input = UICtrl.getInput();

         if(input.description !== "" && !isNaN(input.value) && input.value>0){

         	//Add item to the budget controller

		 newItem = budgetCtrl.addItem(input.type,input.description,input.value);

		 //Add the item to the UI

		 UICtrl.addListItem(newItem, input.type);

		 //clear the fields

		 UICtrl.clearFields();

		 //calculate and update budget

		 updateBudget();

         }


		  
		
		  
	  };

	  var ctrldeltItem = function(event){
       var itemID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
        	splitID = itemID.split('-');
        	type = splitID[0];
        	ID = parseInt(splitID[1]);

        	//delete the item from data structure

        	budgetController.deleteItem(type,ID);

        	//Delete the item from UI

        	UICtrl.deleteListItem(itemID);

        	// Update budget

        	updateBudget();
        }

	  }

	  return {
        init: function(){
     	console.log('Application has started');
     	UICtrl.displayMonth();
     	UICtrl.displayBudget({
       	 	budget: 0,
       	 	totalInc: 0,
       	 	totalexp: 0,
       	 	percentage: -1
       	 });
     	setupEventListners();
     }

	  }
	
	
	
  })(budgetController,UIController);

  controller.init();