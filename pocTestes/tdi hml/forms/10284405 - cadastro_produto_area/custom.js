
$(document).ready(function () {

	window.onload = function () {
		// var today = new Date();
		// //get date
		// var dd = String(today.getDate()).padStart(2, '0');
		// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		// var yyyy = today.getFullYear();
		// today = dd + '/' + mm + '/' + yyyy;

		// $("#data_solicitacao").val(today);


	}



	// var SPMaskBehavior = function (val) {
	// 	return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
	// },
	// 	spOptions = {
	// 		onKeyPress: function (val, e, field, options) {
	// 			field.mask(SPMaskBehavior.apply({}, arguments), options);
	// 		}
	// 	};

	// $('#telefone').mask(SPMaskBehavior, spOptions);

	

	// $(document).on('change', "#grupo", function () {
	// 	setSelectedZoomItem(this);
	// 	removedZoomItem(this);
	// });


});

// function setSelectedZoomItem(selectedItem) {

// 	id = selectedItem.inputId;

// 	if (id == "grupo") {

// 		$("#idGrupo").val(selectedItem['ID']);

// 	}
// }

// function removedZoomItem(removedItem) {

// 	id = removedItem.inputId;

// 	if(id == "grupo"){
// 		$("#idGrupo").val('');
// 	}
// }

function deletaLinha(element) {
	fnWdkRemoveChild(element)
}