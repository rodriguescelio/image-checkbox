(function($){
	
	"use strict";

	$.fn.imageInput = function( option ){

		var input = $(this);

		var def = {
			multiple: false,
			borderColor: '#ff1a1a',
			iconColor: '#FFFFFF',
			imagesPerLine: 5
		};

		var settings = $.extend(def, option);

		var rand = function(){
			return Math.random().toString(36).substring(2, 8);
		};

		var isNumeric = function(n){
			return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
		};

		var createId = function(){

			var id = rand();
			var go = false;
			
			while(go == false){
				if(isNumeric(id[0])){
					id = rand();
				}else{
					if($('#' + id).length <= 0){
						go = true;
					}else{
						id = rand();
					}
				}
			}

			return id;
		};

		var createStruct = function( value ){
			
			var root = $('<div>', {
				'class': 'image-input-option',
				'data-input-value': value
			});

			var flag = $('<div>', {
				'class': 'image-input-flag'
			}).html('<i></i>');

			root.html(flag);

			return root;

		};

		var calculateWidth = function(root, cols){
			
			var cols = (100 / cols);
			var width = $(root).width();
			var px = (width * cols) / 100;
			return (px - 25);

		};

		var generateSVG = function(color){
			return '<svg height="24px" width="24px" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g><path fill="' + color + '" d="M12,0C5.373,0,0,5.373,0,12c0,6.628,5.373,12,12,12c6.627,0,12-5.372,12-12C24,5.373,18.627,0,12,0z M19.754,9.561    l-8.607,8.607c-0.176,0.177-0.462,0.177-0.637,0l-1.272-1.285c-0.175-0.176-0.462-0.464-0.636-0.642l-2.96-3.112    c-0.087-0.087-0.133-0.21-0.133-0.327c0-0.115,0.046-0.227,0.133-0.314l1.297-1.169c0.088-0.09,0.205-0.134,0.321-0.134    c0.114,0.001,0.228,0.046,0.315,0.134l2.936,2.995c0.175,0.178,0.461,0.178,0.637,0l6.699-6.681c0.176-0.177,0.461-0.177,0.636,0    l1.272,1.285C19.93,9.094,19.93,9.384,19.754,9.561z"/></g></g></svg>';
		};

		var splitInput = function(input){

			var value    = input.val();
			var arrValue = null;

			if(value == '')
				arrValue = new Array();
			else
				arrValue = value.split(', ');

			return arrValue;

		};

		var foreach = function(arr, callback){
			for(var key in arr){
				callback.call(this, key, arr[key]);
			}
		};

		var setOptions = function(elm){
			
			elm.find('.image-input-option').css('width', calculateWidth(elm, settings.imagesPerLine) );

			var option = elm.find('.image-input-option');
			var flag = option.find('.image-input-flag');
			var icon = flag.find('i');
			var svg = generateSVG(settings.iconColor);
			
			flag.css('border-top', '50px solid ' + settings.borderColor);
			icon.css('background-image', "url('data:image/svg+xml;utf8," + svg + "')");
			elm.attr('data-multi', settings.multiple);

		};

		var removeValue = function( struct, value ){
			
			struct.find('input:not(.image-input-value-control)[value="' + value + '"]').eq(0).remove();

			var inputControl = struct.find('input.image-input-value-control');

			var values = splitInput(inputControl);

			foreach(values, function(k, v){
				if(v == value){
					values.splice(k, 1);
				}
			});

			values = values.join(', ');

			inputControl.val(values);
		};

		var addValue = function( struct, value ){

			var inputName = struct.attr('data-input-name');
			
			var input = $('<input>', {
				type: 'hidden',
				name: inputName,
				value: value
			});

			struct.append(input);

			var inputControl = struct.find('input.image-input-value-control');

			var inputControlValues = splitInput(inputControl);

			inputControlValues.push(value);
			
			inputControlValues = inputControlValues.join(', ');

			inputControl.val(inputControlValues);

		};

		var setValue = function( struct, value ){
			var input = struct.find('input');
			input.val(value);
		};

		var focusOption = function( option ){
			option.attr('data-input-focus', true);
			option.find('.image-input-flag').show();
			option.css('outline', 'solid 2px ' + settings.borderColor);
		};

		var unfocusOption = function( option ){
			option.attr('data-input-focus', false);
			option.find('.image-input-flag').hide();
			option.css('outline', 'none');
		};

		var unfocusAll = function( struct ){
			var option = struct.find('.image-input-option');
			option.each(function(pos, el){
				var el = $(el);
				var focus = el.attr('data-input-focus');
				if(focus == 'true'){
					unfocusOption(el);
				}
			});
		};

		var imageInputChanged = function( struct, multi ){
			
			var input = null;
			if(multi == 'true'){
				input = struct.find('input.image-input-value-control');
			}else{
				input = struct.find('input');
			}
			input.change();

		};

		var setClickFunction = function(){
			$('.image-input-option').click(function(ev){
				
				var it = $(this);
				var struct = it.parent();
				var multi = struct.attr('data-multi');
				var value = it.attr('data-input-value');
				var focus = it.attr('data-input-focus');

				if(focus == undefined || focus == ''){
					focus = 'false';
				}

				if(multi == 'true'){
					
					if(focus == 'true'){
						removeValue(struct, value);
						unfocusOption(it);
					}else{
						addValue(struct, value);
						focusOption(it);
					}

					imageInputChanged(struct, multi);

				}else{

					if(focus == 'false'){
						setValue(struct, value);
						unfocusAll(struct);
						focusOption(it);
						imageInputChanged(struct, multi);
					}

				}
			
			});
		};

		function init(){

			input.addClass('image-input-struct');

			input.each(function(index, element){
					
				var inputName  = $(element).attr('data-input-name');
				var inputClass = $(element).attr('data-input-class');
				var selector   = input.selector;

				if(!inputName || inputName == ''){
					if(!inputClass || inputClass == ''){
						console.warn('Set a name or class for this imageInput: ' + selector);
						return;
					}
				}

				var inputControl = $('<input>', {
					type: 'hidden'
				});

				input.append(inputControl);

				if(inputName && inputName != '')
					inputControl.attr('name', inputName);

				if(settings.multiple == true){

					inputControl = $('<input>', {
						type: 'hidden',
						class: 'image-input-value-control'
					});

					input.append(inputControl);
				}

				if(inputClass && inputClass != '')
					inputControl.addClass(inputClass);


				var images = $(element).find('img');
				
				images.each(function(i, img){

					var value = $(img).attr('data-value');

					var struct = createStruct(value);

					var image = img.outerHTML;

					$(struct).append(image);

					img.outerHTML = struct[0].outerHTML;

				});

			});

			setOptions(input);
			setClickFunction();
		};

		init();

	};

})(jQuery);