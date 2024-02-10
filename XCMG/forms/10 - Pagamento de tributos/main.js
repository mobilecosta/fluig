const MAIN = {
	loading: {}

	, init: function () {
		MAIN.loading = FLUIGC.loading(window);

		MAIN.bind();
		MAIN.bindDateFields();
		MAIN.setCurrencyRate();
		MAIN.displayForm();

		enableFields();


		$('.money').mask("#.##0,00", { reverse: true });

	}
	, setCurrencyRate: function () {
		let rate = $("#sl_moeda").val();

		if (rate != "1") {
			$(".taxa-moeda").show();
		} else {
			$(".taxa-moeda").hide();
			$("#vl_taxa").val("0");
		}
	}
	, bind: function () {
		if (CONTEXT.MODE != "VIEW") {
			if (CONTEXT.CURRENT_STATE == Activity.ZERO
				|| CONTEXT.CURRENT_STATE == Activity.INICIO) {
				$('#add_titulo').on('click', MAIN.addPaybleSecurityRow);


				$('#sl_moeda').on('change', function () {
					MAIN.setCurrencyRate();
					MAIN.calculateBudget();
				});

				$('#vl_taxa').on('blur', function () {
					MAIN.calculateBudget();
				});

				$('.currency_rate').mask("#.##0,0000", { reverse: true });
				$('.currency_rate').on('focus touchstart', function (ev) {
					ev.preventDefault();
					if ($(this).val() == "") $(this).val('0');
				});
			}
			if (CONTEXT.CURRENT_STATE != Activity.ZERO
				&& CONTEXT.CURRENT_STATE != Activity.INICIO) {
				$('.aprovacao').on('change', function (e, i, a) {
					MAIN.requireApproverObservation(e.target);
				});


				$('input[name="rd_aprov_financeiro"]').on('change', function (e, i, a) {
					let decision = $(this).val();
					let $obsLabel = $('[for="ds_obs_aprov_financeiro"]');
					if (decision == "Aprovado") {
						$obsLabel.removeClass('required');
					}
					else {
						$obsLabel.addClass('required');
					}
				});


			}
		}
	}
	// , bindTrashAction: function (idx) {

	// 	console.log('bindTrashAction: chamou o click para excluir')

	// 	let arr = (idx != undefined || idx != null) ? [idx]
	// 		: UTILS.getChildrenIndexes("tbTitulos");
	// 	for (let i in arr) {
	// 		$('#tit_vl_original___' + arr[i]).parents('tr').find('.flaticon-trash')
	// 			.on('click', MAIN.removePayableSecurityRow)
	// 	}
	// }

	, bindTotalCost: function (idx) {

		console.log('bindTotalCost: chamou o click para add e somar vl total')

		let arr = (idx != undefined || idx != null) ? [idx]
			: UTILS.getChildrenIndexes("tbTitulos");
		for (let i in arr) {
			$('#tit_vl_original___' + arr[i]).parents('tr').find('.totalizavel')
				.on('change', function () { MAIN.updateTotalCost(arr[i]) });
		}
	}

	, bindDateFields: function () {
		if (CONTEXT.MODE == "VIEW"
			|| (CONTEXT.CURRENT_STATE != Activity.ZERO
				&& CONTEXT.CURRENT_STATE != Activity.INICIO))
			return false;

		FLUIGC.calendar('.calendar', { useCurrent: false });

		$(".calendar").on("change", function () {
			if (this.value != '')
				UTILS.validateDate($(this));
		});
	}
	, bindPayDay: function (idx) {
		let arr = (idx != undefined || idx != null) ? [idx]
			: UTILS.getChildrenIndexes("tbTitulos");
		for (let i = 0; i < arr.length; i++) {
			$('#tit_dt_emissao___' + arr[i] + ',#tit_dt_vencimento___' + arr[i])
				.on('blur', function (ev) {
					MAIN.updatePayDay()
				});
		}
	}

	, displayForm: function () {
		/*Ao exibir o formulário verifica
			Se tem títutlos e se o título tem código, 
			se tiver bloqueia os campos relacionados aquele título */
		let arr = UTILS.getChildrenIndexes("tbTitulos");
		if (arr.length > 0) {
			//Verifica se objeto zoom foi montado
			ZOOMS.executeQuandoPronto('titulo___' + arr[0], function () {
				for (let i in arr) {
					//Se o zoom de titulo está preenchido bloqueia campos
					if (ZOOMS.getValue('titulo___' + arr[i], 0) != "") {
						MAIN.controlPayableFields(arr[i], false);
					}
				}
			});
		}
		MAIN.updatePaymentPolicy();
	}

	, addPaybleSecurityRow: function () {

		console.log('addPaybleSecurityRow: chamou oção de add linha')

		let idx = wdkAddChild("tbTitulos");
		// MAIN.bindTrashAction(idx);
		MAIN.bindTotalCost(idx);
		MAIN.initSecurityPayableZooms(idx);

		let $tipo = $("#tit_tipo___" + idx);
		$tipo.val("TX");//Taxa

		let $totalizaveis = $tipo.parents('tr').find('.totalizavel');
		$totalizaveis.mask("#.##0,00", { reverse: true });

		MAIN.bindPayableDates(idx);
		MAIN.bindPayDay(idx);
	}
	, initSecurityPayableZooms: function (idx) {
		prepareSecurityPayableZoomList(idx);
		prepareCostCenterZoomList(idx);
		prepareNatureZoomList(idx);
	}
	, bindPayableDates: function (idx) {
		let sl_dt_emissao = "#tit_dt_emissao___" + idx;
		let sl_dt_vencimento = "#tit_dt_vencimento___" + idx;
		$(sl_dt_emissao + "," + sl_dt_vencimento).mask("00/00/0000");

		FLUIGC.calendar(sl_dt_emissao, { useCurrent: false });
		FLUIGC.calendar(sl_dt_vencimento, { useCurrent: false });

		$(sl_dt_emissao + "," + sl_dt_vencimento).on("change", function () {
			if (this.value != '') {
				/*Se data não for vazia, e não for data carregada pelo zoom de titulo
					verifica se está considerando formato EUA. */
				if (ZOOMS.getValue("titulo___" + idx, 0) == ""
					&& UTILS.getLocale() == "en_US") {
					let enDate = moment(this.value, "MM-DD-YYYY");
					//Se é formato EUA, converte e atualiza o campo
					if (enDate.isValid())
						this.value = enDate.format("DD/MM/YYYY");
					else this.value = "";
				}
				UTILS.validateDate($(this));
			}
		});
	}
	, removePayableSecurityRow: function (idx) {

		console.log('removePayableSecurityRow: chamou quando exclui linha')

		fnWdkRemoveChild(idx);
		MAIN.updatePaybleSecurities();
	}

	, updateTotalCost: function (idx) {
		if (idx != undefined && idx != null) {
			let vl_original = UTILS.parseFloat($('#tit_vl_original___' + idx).val());
			let vl_juros = UTILS.parseFloat($('#tit_vl_juros___' + idx).val());
			let vl_multa = UTILS.parseFloat($('#tit_vl_multa___' + idx).val());
			let vl_taxa = UTILS.parseFloat($('#tit_vl_taxa___' + idx).val());

			let vl_total = UTILS.formatNumber(vl_original + vl_juros + vl_multa + vl_taxa);
			$('[name="tit_vl_total___' + idx + '"]').val(vl_total);
			MAIN.updateTotalCost();
		}
		else {

			console.log("updateTotalCost: Somou Valor total")

			let $totais = $('[name^="tit_vl_total___"]');
			var vl_total = 0;
			$totais.each(function (idx, el) {
				vl_total += UTILS.parseFloat($(el).val());
				console.log('valor total = ' + UTILS.parseFloat($(el).val()))
			});
			$('#vl_total_tributos').val(UTILS.formatNumber(vl_total));
		}
	}

	, updatePayDay: function () {
		let $dates = $('[name^="tit_dt_vencimento___"]');
		var min_date = 0;
		$dates.each(function (idx, el) {
			let payDayByRow = moment($(el).val(), "DD/MM/YYYY");
			if (min_date == 0 || payDayByRow.isBefore(min_date)) {
				min_date = payDayByRow;
			}
		});
		if (min_date == 0) {
			$('#dt_pagamento').val("");
			$('#dt_pagamento_iso').val("");
			$('#nm_politica_antecedencia').val("");
		}
		else {
			$('#dt_pagamento').val(min_date.format("DD/MM/YYYY"));
			$('#dt_pagamento_iso').val(min_date.format("YYYY-MM-DD"));
			$('#dt_prazo_antecedencia_iso').val(
				min_date.subtract(7, 'days').format("YYYY-MM-DD") + " 18:00");
			MAIN.updatePaymentPolicy();
		}
	}

	, updatePaymentPolicy: function () {
		let payDay = moment($("#dt_pagamento").val() + " 22:59:59", "DD/MM/YYYY hh:mm:ss");
		let status = (payDay.isBefore(moment())) ? POLICY.NOK : POLICY.OK;
		$('#nm_politica_antecedencia').val(status);

		if (status == POLICY.NOK) {
			FLUIGC.toast({
				title: 'Atenção! 注意 ！ ',
				message: 'Data de pagamento fora da política de antecedência!'
					+ ' 提前付款日期超出政策！',
				type: 'warning'
			});
		}
		MAIN.requireObservation(status);
	}

	, updatePaybleSecurities: function () {

		console.log("updatePaybleSecurities: chamou ")

		MAIN.updateTotalCost();
		MAIN.updatePayDay();
	}

	, requireObservation: function (policy) {
		if (policy == POLICY.OK) {
			$('#ds_justificativa_politica').siblings('label').removeClass('required');
		}
		else {
			$('#ds_justificativa_politica').siblings('label').addClass('required');
		}
	}

	, requireApproverObservation: function (target) {
		let decision = target.value;
		let $obsLabel = $('[for="' + $(target).data("obsId") + '"]');
		if (decision == "Aprovado") {
			$obsLabel.removeClass('required');
		}
		else {
			$obsLabel.addClass('required');
		}
	}

	, controlPayableFields: function (idx, enable) {
		enableField($("#tit_dt_emissao___" + idx), enable);
		enableField($("#tit_centro_custo___" + idx), enable);
		enableField($("#tit_tipo___" + idx), enable);
		enableField($("#tit_natureza___" + idx), enable);
		/*XXX:Conforme pedido em 10/09/2021
		, juros e multa devem ficar disponíveis para alteração*/
		//enableField($("#tit_vl_juros___"+idx), enable);
		//enableField($("#tit_vl_multa___"+idx), enable);
		enableField($("#tit_vl_original___" + idx), enable);
		enableField($("#tit_dt_vencimento___" + idx), enable);

		if (!enable) {
			$('#tit_dt_emissao___' + idx).unbind();
			$('#tit_dt_vencimento___' + idx).unbind();
		} else {
			MAIN.bindPayableDates(idx);
			MAIN.bindPayDay(idx);
		}
	}

	, getDateBR: function (date) {
		return new Date(date.split("/")[2], date.split("/")[1] - 1, date.split("/")[0])
	}

	, getDateEN_US: function (date) {
		return new Date(date.split("/")[0], date.split("/")[1] - 1, date.split("/")[2])
	}
}

const POLICY = { NOK: "Fora política", OK: "Dentro política" };

$(document).ready(function () {
	MAIN.init();
});