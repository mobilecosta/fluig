//Carregue essa função como arquivo JS no arquivo HTML
//Necessita de jQuery
//No onload form ou ready jquery colocar a chamada enableFields()

function enableFields() {
	if (CONTEXT.MODE == "VIEW") return;

	if (CONTEXT.CURRENT_STATE != Activity.ZERO && CONTEXT.CURRENT_STATE != Activity.INICIO) {
		enableField($('#add_titulo'), false);
		enableField($('.flaticon-trash'), false);
	}

	
}

//Carregue essa função como arquivo JS no arquivo HTML
//Necessita de jQuery
//No onload form ou ready jquery colocar a chamada enableFields()

var beginWithDisabled = new RegExp(/^d_/);
function filterDisabled(index, element) {
	return !beginWithDisabled.test(element.id);
}

function disableField($el, disabled) {
	//Pega o ID, pois no caso do radio é preciso desabilitar cada item do radio.
	//Pendente avaliar qual o comportamento FLUIG quanto a radio no pai x filho:
	//XXX: Por hora é obrigatório ter ids diferentes por linha e por opção do radio

	var selector = "#d_" + $el.attr("id") + "[name='d_" + $el.attr("name") + "']";
	$el = $el.filter(filterDisabled);
	if (disabled) {
		$(selector).hide();
		$el.show();
	}
	else {
		($(selector).length > 0) ? $(selector).show() : $el.before($el.clone().attr({ "id": ("d_" + $el.attr("id")), "name": ("d_" + $el.attr("name")) }).attr("disabled", true));
		$(selector).val($el.val());
		$el.hide();
	}
}

function enableContainer($el, enabled) {
	$($el).find("input[type='radio'],input[type='text'],input[type='checkbox'],input[type='zoom'],textarea,select,input[type='button'],img,button,span,i").each(function (i) {
		enableField($(this), enabled);
	});
};

function enableField($el, enabled) {
	if ($el.attr("type") == "text") {
		$el.prop("readonly", !enabled);
	}
	else if (window['data-zoom_' + $el.attr('name')] != undefined) {
		ZOOMS.executeQuandoPronto($el.attr('name'), function () {
			//console.log("enableField",$el);
			window[$el.attr('name')].disable(!enabled);
		});
	}
	else if ($el.prop("tagName") == "TEXTAREA") {
		$el.prop("readonly", !enabled);
	}
	else if ($el.prop("tagName") == "SELECT") {
		disableField($el, enabled);
	}
	else if ($el.attr("type") == "button" || $el.prop("tagName") == "BUTTON") {
		$el.prop("disabled", !enabled);
		handleOpacity($el, enabled);
	}
	else if ($el.prop("tagName") == "SPAN") {
		!enabled ? $el.css("pointer-events", "none") : $el.css("pointer-events", "auto");
		handleOpacity($el, enabled);
	}
	else if ($el.prop("tagName") == "IMG") {
		$el.prop("onclick", enabled);
		handleOpacity($el, enabled);
	}
	else if ($el.prop("tagName") == "I") {
		$el.css('visibility', 'hidden');
	}
	else if ($el.attr("type") == "radio" || $el.attr("type") == "checkbox") {
		var nameOf = $el.attr("name");

		//Como ID não recebe ___, seletor por ID
		//Nâo há como automatizar desabilitar específico pelo ID, justamente por não receber ___

		if (nameOf != "") {
			var selector = "[name='" + nameOf + "'],[name^='" + nameOf + "___']";
			$el = $(selector).filter(filterDisabled);
			if ($el.length && $el.length > 0 && ($el.attr("type") == "radio" || $el.attr("type") == "checkbox")) {
				$el.each(function (i) {
					var labelSelector = "label[for^='" + $(this).prop("id") + "'],label[for^='d_" + $(this).prop("id") + "']";
					$(labelSelector).each(function (i) {
						var prefix = (beginWithDisabled.test($(this).prop("for"))) ? "d_" : "";
						if (enabled) {
							$(this).prop("for", $(this).prop("for").replace(beginWithDisabled, ""));
						}
						else if (prefix == "") {
							$(this).prop("for", "d_" + $(this).prop("for"));
						}
					});
					disableField($(this), enabled);
				});
			}
		}
		else {
			disableField($el, enabled);
		}
	}
	else {
		$el.prop("readonly", !enabled);
	}
}
function handleOpacity($el, enabled) {
	if (enabled) {
		$el.css("opacity", 1);
		$el.css("filter", "");
	} else {
		$el.css("opacity", 0.7);
		$el.css("filter", "alpha(opacity=70)");
	}
}

