(function(app) {
	var score = 0,
		 category = '',
		 level = '',
		 actionBtns = document.getElementsByClassName('btn--action'),
		 sections = document.getElementsByClassName('section'),
		 generatedNumbers = [],
		 modalWrapper = document.getElementById('modalWrapper'),
		 modalContent = document.getElementById('modalContent'),
         modalCloseBtn = document.querySelector('.btn--modalClose'),
         rows,
         digits, 
		 result = '',
		 myResult = '',


		 /**
		 * Show Section
		 */
		 showSection = function(name) {
			 for(var i = 0; i < sections.length; i++) {
				 if(sections[i].classList.contains(name) ) {
					 sections[i].classList.remove('hidden');
				 } else {
					 if(!sections[i].classList.contains('hidden')) {
						 sections[i].classList.add('hidden');
					 }
				 }
			 }
		 },


		 /**
		* Handle button functions
		*/
		 handleActionBtns = function() {
			 if(this.classList.contains('operation')) {
                 category = this.dataset.category;
				 showSection('level');
			 } else if(this.classList.contains('level')) {
				 level = this.dataset.level;
                 setNumberOfDigits();
				 sections[2].appendChild(buildAlgorithm());

				 showSection('algorithm');
			 }
		 },


         /**
          * Set number of digits to display
          * - Easy: 2 digits
          * - Normal: 3 digits
          * - Hard : 4 digits
          */
        setNumberOfDigits = function() {

            switch(level) {
                case 'easy': 
                    digits = 2;
                    break;
                case 'normal': 
                    digits = 3;
                    break;
                case 'hard': 
                    digits = 4;
                    break;
                default: 
                    break;
            }
        },

		 /**
		 * Generate numbers 
		 *  - Easy level: 0-99
		 *  - Normal level: 0-999
		 *  - Hard level: 0-9999
		 */
		 generateNumber = function() {
			 var number = '';

			 switch(level) {
				 case 'easy':
					 number = Math.round(Math.random() * 99);
					 break;
				 case 'normal':
					 number = Math.round(Math.random() * 999);
					 break;
				 case 'hard':
					 number = Math.round(Math.random() * 9999);
					 break;
			 }

			 generatedNumbers.push(number);

			 return number;
		 },


		 /**
		 * Show modal
		 */
		 showModal = function() {
			 modalWrapper.classList.remove('hidden');
		 },


		 /**
		 * Close modal
		 */
		 closeModal = function() {
			 modalWrapper.classList.add('hidden');
			 restartGame();
		 },


		 /**
		 * Clear algorithm section
		 */
		 clearAlgorithm = function() {
			 sections[2].innerHTML  = ''; 
		 },


         /**
          * Set number of input rows
          */
         setNumberOfInputRows = function() {
            if(category === 'add' || category === 'subtract') {
                rows = 1;
            } else if(category === 'multiply') {
                rows = generatedNumbers[1].toString().length;
            }
         },


		 /**
		 * Build algorithm user inputs
		 */
		 renderUserInputs = function() {

            setNumberOfInputRows();

            for(var i = 0; i < rows; i++) {
                var userInputRow = document.createElement('div');
                userInputRow.className = 'userInputRow';	

                if(category === 'add' || category === 'subtract') {
                    userInputRow.classList.add('result');
                }

                for(var j = 0; j <= digits; j++) {
                    var userInput = document.createElement('INPUT');
                    userInput.className = 'userInput';
                    userInput.setAttribute('maxlength', 1);
                    userInput.setAttribute('oninput', "this.value=this.value.replace(/[^0-9]/g,'')");

                    userInputRow.appendChild(userInput);
                }
            }

            return userInputRow;
		 },


         /**
          * Render dummy inputs
          */
         renderDummyInput = function() {
            var dummyInput = document.createElement('INPUT');
            dummyInput.className = 'userInput userInput--dummy';

            return dummyInput;
         },


         /**
          * Render multiplication inputs
          */
         renderMultiplyInputs = function() {
            debugger;   
            var lastRowDigits = 0;
            setNumberOfInputRows(); 

            var multiplyFrag = document.createDocumentFragment();

            for(var i = 0; i < rows; i++) {
                var userInputRow = document.createElement('div');
                userInputRow.className = 'userInputRow userInputRow--multiply';
            
                for(var j = 0; j <= digits; j++) {
                    var userInput = document.createElement('INPUT');
                    userInput.className = 'userInput userInput--multiply';
                    userInput.setAttribute('maxlength', 1);
                    userInput.setAttribute('oninput', "this.value=this.value.replace(/[^0-9]/g,'')");
                    userInputRow.appendChild(userInput);
                }

                for(var k = 0; k < i; k++) {
                    userInputRow.appendChild(renderDummyInput());
                }

                multiplyFrag.appendChild(userInputRow);
            }

            var multiplyLine = document.createElement('DIV');
            var multiplyResult = document.createElement('DIV');
            multiplyLine.className = 'line line--multiply';
            multiplyResult.className = 'userInputRow userInputRow--multiply result';
            
            multiplyFrag.appendChild(multiplyLine);

            for(var k = 0; k < (digits + rows + 1); k++) {
                var userInput = document.createElement('INPUT');
                userInput.className = 'userInput userInput--multiply';
                userInput.setAttribute('maxlength', 1);
                userInput.setAttribute('oninput', "this.value=this.value.replace(/[^0-9]/g,'')");
                multiplyResult.appendChild(userInput);
            }
            
            multiplyFrag.appendChild(multiplyResult);
            
            return multiplyFrag;
        
        },


		 /**
		 * Get my result
		 */
		 getMyResult = function() {
            var inputs = document.getElementsByClassName('userInput');
            var value = [];

            for(var i = 0; i < inputs.length; i++) {
                value.push(inputs[i].value);
            }

            myResult = parseInt(value.join(''));
         },
         

        /**
         * Update score
         */
        updateScore = function() {
            var storageObj = JSON.parse(localStorage.getItem('mathQuizzer'));
            storageObj.score = score;

            localStorage.setItem('mathQuizzer', JSON.stringify(storageObj));
        },

		 /**
		 * Compare results
		 */
        compareResults = function() {
            showModal();
            getMyResult();

            if(myResult == result) {
                modalContent.innerHTML= '<div class="result-icon result-icon--correct fas fa-award"></div><h1 class="result-message">Well done!!!</h1>';

                if(level === 'easy') {
                    score += 1;
                }	 else if(level === 'normal') {
                    score += 3;
                } else if(level === 'hard') {
                    score += 5;
                }

            } else {
                modalContent.innerHTML = '<div class="result-icon result-icon--incorrect fas fa-times-circle"></div><h1 class="result-message">Try again! I\'m sure you can do better</h1>';

                if(level === 'easy') {
                    score -= 1;
                }	 else if(level === 'normal') {
                    score -= 3;
                } else if(level === 'hard') {
                    score -= 5;
                }
            }
            
            updateScore();
        },


		 /**
		 * Calculate result
		 */
        calcResult = function() {

            switch(category) {
                case 'add':
                    result = generatedNumbers[0] + generatedNumbers[1];	 
                    break;
                case 'subtract':
                    result = generatedNumbers[0] - generatedNumbers[1];	
                    break;
                case 'multiply':
                    result = generatedNumbers[0] * generatedNumbers[1];	
                    break;
                default: break;
            }

        },

		 /**
		 * Restart game
		 */
		 restartGame = function(){
			 clearAlgorithm();
			 showSection('landing');
             generatedNumbers = [];
             rows = '';
             digits = '';
			 result = '';
			 myResult = '';
		 },


		 /**
		 * Build the algorithm
		 */
        buildAlgorithm = function() {
            var frag = document.createDocumentFragment(),
                line = document.createElement('DIV'),
                lineMultiply = document.createElement('DIV'),
                operator = document.createElement('DIV'),
                restartBtn = document.createElement('BUTTON'),
                checkResultBtn = document.createElement('BUTTON'),
                nums = [];

            operator.className = 'operator';
            line.className = 'line';
            lineMultiply.className = 'line line--multiply';
            checkResultBtn.className = 'btn btn--checkResult';
            checkResultBtn.textContent = 'Check result';
            restartBtn.className = 'btn btn--restart fas fa-redo';
            restartBtn.setAttribute('title', 'Restart game');
            restartBtn.addEventListener('click', restartGame);
            checkResultBtn.addEventListener('click', compareResults);
            checkResultBtn.setAttribute('title', 'Check my result');

            nums[0] = generateNumber();

            if(category !== 'subtract') {
                nums[1] = generateNumber();
            } else {
                nums[1] = Math.round(Math.random() * nums[0]);
                generatedNumbers[1] = nums[1];
            }

            calcResult();

            nums.forEach(function(item) {
                var num = item.toString().split(''),
                    term = document.createElement('DIV');

                term.className = 'term';

                num.forEach(function(a){
                    var digit = document.createElement('DIV');

                    digit.className = 'digit';
                    digit.textContent = a;
                    term.appendChild(digit);
                });			

                frag.appendChild(term);	
            });

            switch(category) {
                case 'add':
                    operator.classList.add('add');
                    frag.appendChild(operator);
                    break;
                case 'subtract':
                    operator.classList.add('subtract');
                    frag.appendChild(operator);
                    break;
                case 'multiply':
                    operator.classList.add('multiply');
                    frag.appendChild(operator);
                    break;
                default: break;
            }

            frag.appendChild(line);

            if(category === 'add' || category === 'subtract') {
                frag.appendChild(renderUserInputs());
            } else if(category === 'multiply') {
                frag.appendChild(renderMultiplyInputs());
            }
        
            frag.appendChild(restartBtn);
            frag.appendChild(checkResultBtn);

            return frag;
        },


		 /**
          * Init local storage
          */
		 initLocalStorage = function() {
			 var storage = localStorage.getItem('mathQuizzer');
			 var storageObject = {
				 score: 0
			 }
			 
			 if(storage === null) {
				 localStorage.setItem('mathQuizzer', JSON.stringify(storageObject));
			 }
		 },
		 

		 /**
		 * Attach event listeners
		 */
		 attachEventListeners = function() {
			 for(var i = 0; i < actionBtns.length; i++) {
				 actionBtns[i].addEventListener('click', handleActionBtns)
			 }

			 modalCloseBtn.addEventListener('click', closeModal);
		 },


		 /**
		* Init function
		*/
		 init = function() {
			 showSection('landing');
			 attachEventListeners();
			 
			 window.addEventListener('load', initLocalStorage);
		 };

	app.init = init;	

})(window.mathQuizzer = window.mathQuizzer || {});

mathQuizzer.init(); 		