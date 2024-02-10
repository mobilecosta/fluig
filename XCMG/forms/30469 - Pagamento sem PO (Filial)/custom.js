const formatter = new Intl.NumberFormat('pt-BR', {
	minimumFractionDigits: 2,
});

$(document).ready(function () {

	console.log(CONTEXT.CURRENT_STATE);

	MAIN.init();
});

let MAIN = {
	loading: {},

	init: function () {
		loading = FLUIGC.loading(window);

		BINDINGS.init();
		MAIN.displayForm();

	},
	displayForm: function () {
		if (CONTEXT.MODE == "VIEW" || (CONTEXT.ACTIVITY != Activity.ABERTURA && CONTEXT.ACTIVITY != Activity.INICIO)) {
			$(".no-view").hide();
		}

		if (CONTEXT.MODE != "VIEW") {
			if (CONTEXT.ACTIVITY == Activity.ABERTURA || CONTEXT.ACTIVITY == Activity.INICIO) {
				ZOOM.execWhenReady("cd_centro_custo", function () {
					ZOOM.prepareCostCenterZoom();
				});

				ZOOM.loadLedgerAccountZoom();
				ZOOM.loadFilialZoom();

				if ($("#cd_filial").val() != "") {
					ZOOM.loadProductZoom();

					if ($("#cd_centro_custo").val() != "") {
						APPROVERS.reloadApprovers();
					}
				}
			}


		}


		console.log(CONTEXT.MODE);

		if (CONTEXT.MODE == "VIEW") {

			//recarrega na tela a decisão dos aprovadores pois o radio perde valor			
			var aux_aprov_gerente_area = $("#aux_aprov_gerente_area").val();
			$("input[name=rd_aprov_gerente_area][value=" + aux_aprov_gerente_area + "]").prop('checked', true);

			var aux_aprov_diretor_area = $("#aux_aprov_diretor_area").val();
			$("input[name=rd_aprov_diretor_area][value=" + aux_aprov_diretor_area + "]").prop('checked', true);

			var aux_aprov_controladoria = $("#aux_aprov_controladoria").val();
			$("input[name=rd_aprov_controladoria][value=" + aux_aprov_controladoria + "]").prop('checked', true);

			var aux_aprov_diretor_geral = $("#aux_aprov_diretor_geral").val();
			$("input[name=rd_aprov_diretor_geral][value=" + aux_aprov_diretor_geral + "]").prop('checked', true);

			/* var aux_aprov_diretor_financeiro = $("#aux_aprov_diretor_financeiro").val();
			$("input[name=rd_aprov_diretor_financeiro][value=" + aux_aprov_diretor_financeiro + "]").prop('checked', true); */

			var aux_aprov_presidencia = $("#aux_aprov_presidencia").val();
			$("input[name=rd_aprov_presidencia][value=" + aux_aprov_presidencia + "]").prop('checked', true);


		} else {

			console.log("aux_aprov_gerente_area = " + $("input[name^=aux_aprov_gerente_area]").val());



			//recarrega na tela a decisão dos aprovadores pois o radio perde valor			

			var aux_aprov_gerente_area = $("input[name^=aux_aprov_gerente_area]").val();
			$("input[name^=_rd_aprov_gerente_area][value=" + aux_aprov_gerente_area + "]").prop('checked', true);

			var aux_aprov_diretor_area = $("input[name^=aux_aprov_diretor_area]").val();
			$("input[name^=_rd_aprov_diretor_area][value=" + aux_aprov_diretor_area + "]").prop('checked', true);

			var aux_aprov_controladoria = $("input[name^=aux_aprov_controladoria]").val();
			$("input[name^=_rd_aprov_controladoria][value=" + aux_aprov_controladoria + "]").prop('checked', true);

			var aux_aprov_diretor_geral = $("input[name^=aux_aprov_diretor_geral]").val();
			$("input[name^=_rd_aprov_diretor_geral][value=" + aux_aprov_diretor_geral + "]").prop('checked', true);

			/* var aux_aprov_diretor_financeiro = $("input[name^=aux_aprov_diretor_financeiro]").val();
			$("input[name^=_rd_aprov_diretor_financeiro][value=" + aux_aprov_diretor_financeiro + "]").prop('checked', true); */

			var aux_aprov_presidencia = $("input[name^=aux_aprov_presidencia]").val();
			$("input[name^=_rd_aprov_presidencia][value=" + aux_aprov_presidencia + "]").prop('checked', true);

		}

	},
	requireApproverObservation: function (target) {
		let decision = target.value;
		let $obsLabel = $('[for="' + $(target).data("obsId") + '"]');
		if (decision == "Aprovado") {
			$obsLabel.removeClass('required');
		}
		else {
			$obsLabel.addClass('required');
		}
	},


	setApproverDecision: function (target) {

		console.log(target);

		let aux_field = $(target).data("auxId");
		let decision = target.value;

		console.log(aux_field);

		$("input[name^=" + aux_field + "]").val(decision);

	},




	validateAdvancePolicy: function () {
		let today = moment(new Date(), "DD/MM/YYYY").add('days', 7);
		let payDayDate = moment($("#dt_pagamento").val() + " 22:59:59", "DD/MM/YYYY hh:mm:ss");
		let policy = $("#nm_politica_antecedencia").val();

		if (payDayDate.isBefore(today)) {
			if (policy != "Fora política") {
				FLUIGC.toast({
					message: "Pagamento fora da política de antecedência",
					type: "warning"
				});
				$("#nm_politica_antecedencia").val("Fora política");
			}
		} else {
			$("#nm_politica_antecedencia").val("Dentro política");
		}

		if ($("#nm_politica_antecedencia").val() == "Fora política") {
			$("#div-politica-antecedencia").show();
		} else {
			$("#div-politica-antecedencia").hide();
		}
	},
	setTotalValue: function () {
		let total = TABLES.calculateTotalValueTable("tb_produtos", "vl_produto");
		$("#vl_total").val(formatter.format(total));

		let indexes = UTILS.getChildrenIndexes('tb_parcelas');

		if (indexes.length == 1) {
			$("#vl_parcela___" + indexes[0]).val(formatter.format(total));
		}
	},
	validateInstallmentsDates: function () {
		let indexes = UTILS.getChildrenIndexes('tb_parcelas');

		if (indexes.length > 0) {
			let lastDate = null;
			for (let i = 0; i < indexes.length; i++) {
				let date = $("#dt_parcela___" + indexes[i]).val();
				if (date != "") {
					if (i == 0) {
						$("#dt_pagamento").val(date);
						$("#dt_pagamento_iso").val(moment(moment(date, "DD/MM/YYYY")).format("YYYY-MM-DD"));
						MAIN.validateAdvancePolicy();
					}

					let installment = $("#nr_parcela___" + indexes[i]).val();

					if (lastDate == "") {
						FLUIGC.toast({
							message: "Preencha primeiramente a data da parcela anterior",
							type: "warning"
						});
						$("#dt_parcela___" + indexes[i]).val("");
						updateLastDate = false;
					}
					else if (lastDate != null) {
						if (moment(lastDate, "DD/MM/YYYY") >= moment(date, "DD/MM/YYYY")) {
							FLUIGC.toast({
								message: "Data da parcela " + installment + " deve ser maior que a data da parcela " + (parseInt(installment, 10) - 1),
								type: "warning"
							});
							$("#dt_parcela___" + indexes[i]).val("");
							updateLastDate = false;
						}
					}

					lastDate = date;
				}
			}
		} else {
			$("#dt_pagamento").val(date);
		}
	}
};

let BINDINGS = {
	init: function () {
		BINDINGS.bindMasks();
		BINDINGS.bindFields();
		BINDINGS.bindDateFields();
	},
	bindMasks: function () {
		$('.campo-data').mask('00/00/0000');
	},
	bindFields: function () {
		$('input[type="text"]').on("change", function () {
			this.value = $.trim(this.value);
		});


		console.log("CONTEXT.CURRENT_STATE = " + CONTEXT.CURRENT_STATE);

		if (CONTEXT.CURRENT_STATE != Activity.ABERTURA && CONTEXT.CURRENT_STATE != Activity.INICIO) {
			$('.aprovacao').on('change', function (e, i, a) {

				MAIN.setApproverDecision(e.target);
				MAIN.requireApproverObservation(e.target);

			});

			$('input[name="rd_lancado"]').on('change', function (e, i, a) {
				let decision = $(this).val();
				let $obsLabel = $('[for="ds_obs_lancar_nota"]');
				if (decision == "Sim") {
					$obsLabel.removeClass('required');
				}
				else {
					$obsLabel.addClass('required');
				}
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

		$("#ck_rateio").on('click', function () {
			let sharing = $("#ck_rateio").is(":checked");
			if (sharing) {
				FLUIGC.toast({
					title: '',
					message: 'Não esqueça de anexar documento de detalhamento do rateio!',
					type: 'warning'
				});
			}
			TABLES.calculateProductBudget(this);
		});

		$(".money").mask("#.##0,00", { reverse: true });

		$('.vl_produto').on("blur", function () {
			MAIN.setTotalValue();
			TABLES.calculateProductBudget(this);
		});

		$('.vl_parcela').on("blur", function () {
			let totalProduct = ($("#vl_total").val() == "") ? 0 : UTILS.moneyParser($("#vl_total").val());
			let totalInstallment = TABLES.calculateTotalValueTable("tb_parcelas", "vl_parcela");

			if (totalInstallment > totalProduct) {
				FLUIGC.toast({
					message: "A soma das parcelas não pode ser maior que a soma dos produtos: R$" + formatter.format(totalProduct),
					type: "warning"
				});
				$(this).val("");
			}
		});

		$("#btn_add_produto").on("click", function () {
			let index = wdkAddChild("tb_produtos");

			TABLES.setTableOrderAndPaymentStatus('tb_produtos', 'nr_produto');

			let $vl_produto = $("#vl_produto___" + index);
			$vl_produto.mask("#.##0,00", { reverse: true });
			$vl_produto.on("blur", function () {
				MAIN.setTotalValue();
				TABLES.calculateProductBudget(this);
			});
			let branch = $("#cd_filial").val();
			reloadZoomFilterValues("cd_produto___" + index, 'branch,' + branch);

			console.log('reloadZoomFilterValues(cd_produto).btn ' + branch)
			console.log('reloadZoomFilterValues(cd_produto).btn ')
			console.log('reloadZoomFilterValues(cd_produto).btn ' + index)

			reloadZoomFilterValues("cd_conta_contabil___" + index, 'cd_matricula,' + CONTEXT.USER + ',cd_filial,' + $("#cd_filial").val() + ',cd_centro_custo,' + $("#cd_centro_custo").val()[0]);
		});

		$("#btn_add_parcela").on("click", function () {
			let index = wdkAddChild("tb_parcelas");

			TABLES.setTableOrderAndPaymentStatus('tb_parcelas', 'nr_parcela', 'sim');

			let $vl_parcela = $("#vl_parcela___" + index);
			$vl_parcela.mask("#.##0,00", { reverse: true });
			$vl_parcela.on("blur", function () {
				let totalProduct = ($("#vl_total").val() == "") ? 0 : UTILS.moneyParser($("#vl_total").val());
				let totalInstallment = TABLES.calculateTotalValueTable("tb_parcelas", "vl_parcela");

				if (totalInstallment > totalProduct) {
					FLUIGC.toast({
						message: "A soma das parcelas não pode ser maior que a soma dos produtos: R$" + formatter.format(totalProduct),
						type: "warning"
					});
					$(this).val("");
				}
			});

			BINDINGS.bindDateFields("#dt_parcela___" + index);

			$('input[name="rd_pago___' + index + '"]').attr('disabled', 'disabled');
		});

		if (CONTEXT.MODE == "ADD") {
			if (UTILS.getTableRows("tb_produtos").length < 1) {
				$("#btn_add_produto").trigger('click');
			}

			if (UTILS.getTableRows("tb_parcelas").length < 1) {
				$("#btn_add_parcela").trigger('click');
			}
		}
	},
	bindDateFields: function (id) {
		let selector = (id == null) ? '.campo-data' : id;
		if (CONTEXT.ACTIVITY == Activity.ABERTURA || CONTEXT.ACTIVITY == Activity.INICIO) {
			$(selector).mask("00/00/0000");

			FLUIGC.calendar(selector, {
				useCurrent: false,
				minDate: new Date()
			});

			$(selector).on("blur", function () {
				if (this.value != '')
					UTILS.validateDate($(this));

				MAIN.validateInstallmentsDates();
			});
		}
	}
};