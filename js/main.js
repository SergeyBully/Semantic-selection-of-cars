
jQuery(document).ready(function($){
//     Код – це фрагмент коду, який закриває спадне меню фільтра, коли користувач натискає будь-яку іншу вкладку.
// Перший рядок коду перевіряє, чи клацнув користувач уже вибраний фільтр, якщо так, він закриє спадне меню та змінить значення тексту/типу даних заповнювача.
// Другий рядок коду перевіряє, чи клацнув користувач ще не вибраний фільтр, і в такому випадку він додасть клас «selected» до вибраного елемента фільтра та видалить клас «selected» з усіх інших елементів.
//    клік на меню іконку --Розгортання
	$('.cd-filter-trigger').on('click', function(){
		triggerFilter(true);
	});
	$('.cd-filter .cd-close').on('click', function(){
		triggerFilter(false);
	});

	function triggerFilter($bool) {
		var elementsToTrigger = $([$('.cd-filter-trigger'), $('.cd-filter'), $('.cd-tab-filter'), $('.cd-gallery'), $('.cd-gallery li')]);
		elementsToTrigger.each(function(){
			$(this).toggleClass('filter-is-visible', $bool);
		});
	}

	//mobile version - detect click event on filters tab
	var filter_tab_placeholder = $('.cd-tab-filter .placeholder a'),
		filter_tab_placeholder_default_value = 'Select',
		filter_tab_placeholder_text = filter_tab_placeholder.text();
	
	$('.cd-tab-filter li').on('click', function(event){
//        Код починається зі створення нової змінної під назвою selected_filter.
//        Це фільтр, який буде використовуватися у меню під хедером.
		//detect which tab filter item was selected
		var selected_filter = $(event.target).data('type');
        
        
//        Потім він створює прослуховувач подій, коли користувач натискає один із фільтрів, і перевіряє, чи натиснув він на вже вибраний фільтр.
//        Якщо так, він змінює текстове значення цього фільтра на те, що було натиснуто, і видаляє його клас із відкритості.
//         В іншому випадку він закриває спадне меню і встановлює для свого текстового значення те, що було натиснуто перед додаванням або видаленням класів, залежно від того, чи є на даний момент фіксований перегляд галереї (виправлено означає відсутність прокручування).
		//check if user has clicked the placeholder item
		if( $(event.target).is(filter_tab_placeholder) ) {
			(filter_tab_placeholder_default_value == filter_tab_placeholder.text()) ? filter_tab_placeholder.text(filter_tab_placeholder_text) : filter_tab_placeholder.text(filter_tab_placeholder_default_value) ;
			$('.cd-tab-filter').toggleClass('is-open');

		//check if user has clicked a filter already selected 
		} else if( filter_tab_placeholder.data('type') == selected_filter ) {
			filter_tab_placeholder.text($(event.target).text());
			$('.cd-tab-filter').removeClass('is-open');	

		} else {
			//close the dropdown and change placeholder text/data-type value
			$('.cd-tab-filter').removeClass('is-open');
			filter_tab_placeholder.text($(event.target).text()).data('type', selected_filter);
			filter_tab_placeholder_text = $(event.target).text();
			
			//add class slected to the selected filter item
			$('.cd-tab-filter .selected').removeClass('selected');
			$(event.target).addClass('selected');
		}
	});
	
	//close filter dropdown inside lateral .cd-filter 
	$('.cd-filter-block h4').on('click', function(){
		$(this).toggleClass('closed').siblings('.cd-filter-content').slideToggle(300);
	})

	//fix lateral filter and gallery on scrolling
	$(window).on('scroll', function(){
		(!window.requestAnimationFrame) ? fixGallery() : window.requestAnimationFrame(fixGallery);
	});

    
    
//    Код починається зі створення двох змінних: offsetTop, яка зберігає, де в пікселях ми знаходимося з нашою позицією прокрутки, і scrollTop, яка зберігає, на скільки пікселів ми знаходимося з нашою позицією прокручування.
//    Потім код перевіряє, чи ми знаходимося вище цієї верхньої точки зміщення, тому що інакше ми були б нижче, оскільки прокрутка вгору віддаляє нас від цієї точки далі, ніж прокрутка вниз (навпаки).
//    Якщо так, то весь наш вміст було прокручено за цей момент, тому весь наш вміст тепер має бути виправлено, тобто більше не буде прокручування, доки не станеться щось інше, наприклад, натиснути іншу кнопку або знову перемістити курсор миші на щось інше.
	function fixGallery() {
		var offsetTop = $('.cd-main-content').offset().top,
			scrollTop = $(window).scrollTop();
		( scrollTop >= offsetTop ) ? $('.cd-main-content').addClass('is-fixed') : $('.cd-main-content').removeClass('is-fixed');
	}
    
    
//Код починається з ініціалізації buttonFilter.
// Функція init() — це метод, який викликається під час запуску фільтра.
// Далі ми встановлюємо деякі параметри для нашого фільтра mixItUp: елементи керування: {enable: false}, зворотні виклики: {onMixStart: function(){}} та додаткові відомості на https://mixitup.kunkalabs.com/ або http:// codepen.io/patrickkunka/.
// Параметр Controls повідомляє mixItUp вимкнути всі його елементи керування (кнопки), щоб вони не заважали звичайній функціональності вашого сайту, поки ви використовуєте його для зображень у своїй галереї.
// Це також запобіжить будь-які випадкові клацання під час переходу слайд-шоу галереї!
// Параметр callback дозволяє нам вказати, що відбувається, коли користувач взаємодіє з однією з наших кнопок у переході слайд-шоу в нашій галереї - у цьому випадку ми використовуємо onMixStart(), який запускається, коли хтось натискає одну з наших кнопок під час переходу слайд-шоу, а потім викликає в ньому анонімну функцію, яка виконує щось інше, пов’язане зі змішуванням фотографій, наприклад, додає їх разом або переміщує їх на основі їхньої подібності (що ми обговоримо пізніше).
//     Код являє собою фрагмент коду, який дозволить buttonFilter працювати.
// Код являє собою фрагмент коду, який вимкне роботу buttonFilter.
	buttonFilter.init();
	$('.cd-gallery ul').mixItUp({
	    controls: {
	    	enable: false
	    },
//        Виводить або забирає повідомленя про те що нічого не знайдено
	    callbacks: {
	    	onMixStart: function(){
	    		$('.cd-fail-message').fadeOut(200);
	    	},
	      	onMixFail: function(){
	      		$('.cd-fail-message').fadeIn(200);
	    	}
	    }
	});

//     Код починається з налаштування змінної під назвою inputText.
// Це текст, який буде введено у вікно пошуку.
// Потім код створює порожній масив під назвою $matching, який зберігатиме всі результати функції пошуку.
// Наступний рядок встановлює функцію затримки, яка приймає два параметри: callback і ms (мілісекунди).
// Перший параметр — це функція, яку потрібно викликати, коли вона буде виконана, а другий параметр — це тривалість очікування перед повторним викликом.
	var inputText;
	var $matching = $();

	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
		    timer = setTimeout(callback, ms);
		};
	})();

//    У цьому випадку ми хочемо зачекати 200 мілісекунд, перш ніж знову викликати нашу функцію зворотного виклику, щоб не було затримки між введенням тексту та переглядом того, що повертається в результаті нашого запиту.
// Далі ми створюємо прослуховувач подій, коли хтось вводить щось у поле пошуку на .cd-filter-content input[type='search'] за допомогою keyup().
// Коли це станеться, ми перебираємо кожен символ по черзі, поки вони не натиснуть клавішу Enter або Return на клавіатурі; якщо вони роблять будь-яку з цих речей, ми перестаємо дивитися на персонажів і переходимо до їх аналізу.
// Якщо вони введуть щось інше, наприклад, пробіл або розділовий знак, наприклад !@#$%^&*()_+|~?/:,;<>,.,[]{}#\
    
//!!!    Пошук
// Код починається зі створення змінної під назвою inputText.
// Це текст, який було введено в поле пошуку у верхній частині сторінки.
// Потім код перевіряє, чи є якісь символи в цьому рядку, і якщо так, він перебирає всі елементи нашого основного HTML-документа (мікс) і створює об’єкт для кожного з них.
// У наступному рядку використовується функція .each() jQuery для проходження кожного елемента в нашому документі міксу.
// Це робиться нами використовувати $this як посилання на кожен окремий елемент у нашому документі міксу.
// Потім він використовує метод val() jQuery, щоб отримати значення зсередини кожного елемента (у цьому випадку «пошук»).
// Нарешті, він перетворює це значення на малі літери за допомогою вбудованого в JavaScript методу String під назвою .toLowerCase().

    
//     Код встановлює значення inputText у нижній регістр того, що вводиться в полі пошуку.
// Якщо в поле пошуку введено текст, він перебирає кожен елемент на .mix і перевіряє, чи має цей елемент властивість довжини зі значенням більше 0.
// Якщо так, то він перевіряє, чи має цей елемент атрибут input[type='search'].
// Якщо так, то він встановить значення inputText рівним тому, що було введено в цьому полі.
    
    
// Код починається зі створення нового екземпляра плагіна MixItUp.
// Далі він створює порожній елемент ul з класом cd-gallery і додає його до DOM.
// Потім він встановлює функцію, яка буде викликатися, коли введений текст буде введено в поле введення.
// Починається з перевірки, чи є в заголовку елементи, які відповідають введеному.
// Якщо так, то вони додаються до масиву $matching .
// Потім, якщо вони не знайдені, вони видаляються з $matching .
// Нарешті, виконується $('.cd-gallery ul').mixItUp('filter', $matching), який відфільтровує всі елементи, крім тих, що відповідають inputText .
	$(".cd-filter-content input[type='search']").keyup(function(){
	  	// Delay function invoked to make sure user stopped typing
	  	delay(function(){
	    	inputText = $(".cd-filter-content input[type='search']").val().toLowerCase();
	   		// Check to see if input field is empty
	    	if ((inputText.length) > 0) {            
	      		$('.mix').each(function() {
		        	var $this = $(this);
		        
		        	// add item to be filtered out if input text matches items inside the title   
		        	if($this.attr('class').toLowerCase().match(inputText)) {
		          		$matching = $matching.add(this);
		        	} else {
		          		// removes any previously matched item
		          		$matching = $matching.not(this);
		        	}
	      		});
	      		$('.cd-gallery ul').mixItUp('filter', $matching);
	    	} else {
	      		// resets the filter to show all item if input is empty
	      		$('.cd-gallery ul').mixItUp('filter', 'all');
	    	}
	  	}, 200 );
	});
});

/*****************************************************
	MixItUp - Define a single object literal 
	to contain all filter custom functionality
*****************************************************/

//Код починається з оголошення змінної під назвою "buttonFilter", яка міститиме всі спеціальні функції для цього фільтра.
// Потім він оголошує будь-які потрібні нам змінні як властивості об’єкта та ініціалізує їх нульовим значенням.
// Далі він визначає масив під назвою "groups", який використовується для зберігання всіх груп, створених у результаті фільтрації різних об'єктів у нашій галереї.
// Наступним методом є init(), який працює на готовому документі та кешує будь-які об’єкти jQuery, які нам знадобляться, щоб їх не потрібно було завантажувати щоразу через запити AJAX.
// Далі є bindHandlers(), який прослуховує натискання кнопки та викликає parseFilters().
// Ця функція розбирає кожну групу фільтрів на окремі поля введення з активним значенням false, оскільки вони ще не фільтруються.
// Нарешті, є parseFilters(), де він створює екземпляр self (батьківський об’єкт) і призначає $filters (який містить усі фільтри) як джерело даних, щоб він міг прослуховувати зміни в цих значеннях за допомогою подій зміни на $filters.

var buttonFilter = {
  	// Declare any variables we will need as properties of the object
  	$filters: null,
  	groups: [],
  	outputArray: [],
  	outputString: '',
  
  	// The "init" method will run on document ready and cache any jQuery objects we will need.
  	init: function(){
    	var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.
    
    	self.$filters = $('.cd-main-content');
    	self.$container = $('.cd-gallery ul');
    
	    self.$filters.find('.cd-filters').each(function(){
	      	var $this = $(this);
	      
		    self.groups.push({
		        $inputs: $this.find('.filter'),
		        active: '',
		        tracker: false
		    });
	    });
	    
	    self.bindHandlers();
  	},
    // Ця штука викликає parseFilters: function
  	// The "bindHandlers" method will listen for whenever a button is clicked. 
  	bindHandlers: function(){
    	var self = this;

    	self.$filters.on('click', 'a', function(e){
	      	self.parseFilters();
    	});
	    self.$filters.on('change', function(){
	      self.parseFilters();           
	    });
  	},
  
//    Код починається з циклу по кожній групі фільтрів і побудови графіка активного фільтра для кожної з них.
// Потім він об’єднує всі фільтри в рядок, який потім виводиться на консоль.
// Код повторює кожну групу фільтрів і перевіряє, чи є вхідний перемикач або прапорець.
// Якщо це так, то активний фільтр цієї конкретної групи буде збережено в масиві під назвою group.active.
// Код також перебирає кожен вхід і перевіряє, чи це елемент select, який зберігатиме значення цього елемента select у масиві під назвою group.active.
  	parseFilters: function(){
	    var self = this;
	 
	    // loop through each filter group and grap the active filter from each one.
	    for(var i = 0, group; group = self.groups[i]; i++){
	    	group.active = [];
	    	group.$inputs.each(function(){
	    		var $this = $(this);
	    		if($this.is('input[type="radio"]') || $this.is('input[type="checkbox"]')) {
	    			if($this.is(':checked') ) {
	    				group.active.push($this.attr('data-filter'));
	    			}
	    		} else if($this.is('select')){
	    			group.active.push($this.val());
	    		} else if( $this.find('.selected').length > 0 ) {
	    			group.active.push($this.attr('data-filter'));
	    		}
	    	});
	    }
	    self.concatenate();
  	},
  
  	concatenate: function(){
    	var self = this;
    
    	self.outputString = ''; // Reset output string
    
	    for(var i = 0, group; group = self.groups[i]; i++){
	      	self.outputString += group.active;
	    }
    
	    // If the output string is empty, show all rather than none:    
	    !self.outputString.length && (self.outputString = 'all'); 
	
    	// Send the output string to MixItUp via the 'filter' method:    
		if(self.$container.mixItUp('isLoaded')){
	    	self.$container.mixItUp('filter', self.outputString);
		}
        console.log(self);
  	}
};


function functabs(number) {
   document.getElementById('divcontent' + number).classList.toggle('show');
   document.getElementById('divcontentimg' + number).classList.toggle('hidden');
}
