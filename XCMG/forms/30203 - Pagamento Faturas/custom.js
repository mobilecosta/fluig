const formatter = new Intl.NumberFormat('pt-BR', {
	minimumFractionDigits: 2,
});

$(document).ready(function() {
	MAIN.init();
});

let MAIN = {
	loading: {},
	
	init: function(){
		loading = FLUIGC.loading(window);												
				
		BINDINGS.init();
		MAIN.displayForm();
	},
	displayForm : function() {
		if(CONTEXT.MODE == "VIEW" || (CONTEXT.ACTIVITY != Activity.ABERTURA && CONTEXT.ACTIVITY != Activity.INICIO)){
			$(".no-view").hide();
		}	
		
		if(CONTEXT.MODE != "VIEW"){
			if(CONTEXT.ACTIVITY == Activity.ABERTURA || CONTEXT.ACTIVITY == Activity.INICIO){
				ZOOM.execWhenReady("cd_centro_custo", function(){
					ZOOM.prepareCostCenterZoom();
				});
				
				if($("#cd_centro_custo").val() != ""){
					APPROVERS.reloadApprovers();
				}
			}
			else if(CONTEXT.ACTIVITY == Activity.DEFINIR_CONTA_PA 
					|| CONTEXT.ACTIVITY == Activity.VERIFICAR_SITUACAO){
				let filial = ZOOM.getValue("cd_filial",0);
				ZOOM.execWhenReady("cd_natureza", function(){
					ZOOM.reloadNatureZoom();
				});
				ZOOM.execWhenReady("nm_banco_xcmg", function(){
					reloadZoomFilterValues("nm_banco_xcmg", 'cd_filial,'+filial);
				});
			}
		}
		MAIN.showIntegrationDiv();
		MAIN.setUpProcessType();
		MAIN.setCurrencyRate();
	}
	, showIntegrationDiv: function(){
		let $nm_banco_xcmg = $('#nm_banco_xcmg');
		
	
		let $nr_titulo_pagar = $('#nr_titulo_pagar');
		if($nm_banco_xcmg.val() != "" || $nr_titulo_pagar.val() != "" 
			|| Activity.wasIntegrated(CONTEXT.ACTIVITY)){
			$('#div-integracoes').show();	
		}
	}
	, requireFiscalObservation: function(){
		let decision = $("input[name=rd_lancado]:checked").val();
		let $obsLabel = $('[for="ds_obs_lancar_nota"]');
		if(decision == "Sim"){
			$obsLabel.removeClass('required');
		}
		else{
			$obsLabel.addClass('required');
		}		
	},
	requireApproverObservation: function(target){
		let decision = target.value;
		let $obsLabel = $('[for="' + $(target).data("obsId") + '"]');
		if(decision == "Aprovado"){
			$obsLabel.removeClass('required');
		}
		else{
			$obsLabel.addClass('required');
		}
	},
	validateAdvancePolicy: function(){
		let payDayDate = moment($("#dt_pagamento").val() + " 22:59:59", "DD/MM/YYYY hh:mm:ss");
		let today = moment().add(3, 'days');
		let policy = $("#nm_politica_antecedencia").val();
		if(payDayDate.format("DD/MM/YYYY") != $("#dt_pagamento").val()){
			console.warn("validateAdvancePolicy - Diferente"
				, payDayDate.format("DD/MM/YYYY")
				, $("#dt_pagamento").val());
		}
		
		if(payDayDate.isBefore(today)){			
			FLUIGC.toast({
				message : "Pagamento fora da política de antecedência", 
				type: "warning"
			});
			$("#nm_politica_antecedencia").val("Fora política");
		}else{
			$("#nm_politica_antecedencia").val("Dentro política");
		}
		
		$("#dt_pagamento_iso").val(moment(payDayDate).format("YYYY-MM-DD"));
		$('#dt_prazo_antecedencia_iso').val(payDayDate.subtract(7, 'days').format("YYYY-MM-DD"));
		
		MAIN.requireObservation();
	},
	requireObservation: function(){
		let policy = $("#nm_politica_antecedencia").val();
		
		if(policy == "Fora política"){
			$('#div-politica-antecedencia').show();
		}
		else{
			$('#div-politica-antecedencia').hide();
			$("#ds_justificativa_politica").val('');
		}
	},
	setAccomplishedValue: function(){
		let vlAccomplished = 0;
		
		$(".vl-viagem").each(function(){
			vlAccomplished += ($(this).val() == "") ? 0 : UTILS.moneyParser($(this).val());
		});
		
		let type = $("input[name=rd_tipo]:checked").val();
		let $field = (type == "adiantamento") ? $('#vl_adiantado') : $('#vl_realizado');
		$field.val(formatter.format(vlAccomplished));
		
		MAIN.setTotalValue();
	},
	setTotalValue: function(){
		let vlInAdvance = $("#vl_adiantado").val();
		let vlAccomplised = $("#vl_realizado").val();
		
		if(vlInAdvance != "" || vlAccomplised != ""){
			let type = $("input[name=rd_tipo]:checked").val();
			
			let vlTotal = (type == "adiantamento") ? UTILS.moneyParser(vlInAdvance)
				: UTILS.moneyParser(vlAccomplised) - UTILS.moneyParser(vlInAdvance);
			$("#vl_total").val(formatter.format(vlTotal));	
			MAIN.calculateBudget();
		}
	},	
	setUpProcessType: function(){
		let process = $("input[name=rd_processo]:checked,[name='_rd_processo']:checked");
		let type = $("input[name=rd_tipo]:checked,[name='_rd_tipo']:checked");
		$("#tipo_approval").val(type.next("span").html());
		
		let $fsViagem = $("#fs-viagem");
		
		let $dt_pagamento = $("#dt_pagamento");
		let $vl_realizado = $("#vl_realizado");
		let $vl_adiantado = $("#vl_adiantado");
		let $referencia_adiantamento = $('#referencia_adiantamento');
		if(type.val() == "adiantamento"){
			$referencia_adiantamento.hide();
			
			if(Activity.isBeginning(CONTEXT.ACTIVITY)) $vl_realizado.val("");
			$vl_realizado.siblings('label').removeClass("required");
			MAIN.enableMoneyField($vl_realizado, false);
			
			$vl_adiantado.siblings('label').addClass("required");
			$dt_pagamento.parent().siblings('label').addClass("required");
			if(process.val() == "viagem"){
				if(Activity.isBeginning(CONTEXT.ACTIVITY)) $vl_adiantado.val("");
				MAIN.enableMoneyField($vl_adiantado, false);
				
				$fsViagem.show();
				$fsViagem.find("label").each(function() {
					$(this).removeClass("required");
				});
			}else if(process.val() == "fornecedor"){
				MAIN.enableMoneyField($vl_adiantado, true);
				
				$fsViagem.hide();
				$fsViagem.find("input").each(function() {
					$(this).val('');
				});
			}
		}else if(type.val() == "prestacao"){
			$referencia_adiantamento.show();
			
			if(Activity.isBeginning(CONTEXT.ACTIVITY)) $vl_adiantado.val("");
			$vl_adiantado.siblings('label').removeClass("required");
			MAIN.enableMoneyField($vl_adiantado, false);
			
			$vl_realizado.siblings('label').addClass("required");
			$dt_pagamento.parent().siblings('label').removeClass("required");
			if(process.val() == "viagem"){
				if(Activity.isBeginning(CONTEXT.ACTIVITY)) $vl_realizado.val("");
				MAIN.enableMoneyField($vl_realizado, false);
				
				$fsViagem.show();				
				$fsViagem.find("label").each(function() {
					$(this).addClass("required");
				});
			}else if(process.val() == "fornecedor"){
				if(Activity.isBeginning(CONTEXT.ACTIVITY)) $vl_realizado.val("");
				MAIN.enableMoneyField($vl_realizado, true);
				
				$fsViagem.hide();
				$fsViagem.find("input").each(function() {
					$(this).val('');
				});
			}
		}
		
		ZOOM.execWhenReady("cd_solicitacao_adiantamento", function(){
			ZOOM.reloadAdvancesZoom();
		});
	}
	
	, enableMoneyField: function($field, enabled){
		enableField($field, enabled);
		if(enabled){
			$field.mask("#.##0,00", {reverse: true});
			$field.on('focus touchstart', function(ev){
			    ev.preventDefault();
			    if($(this).val() == "") $(this).val('0');
			});
		}
		else{
			$field.unbind();
		}
	}
	
	, setCurrencyRate: function(){
		let rate = $("#sl_moeda").val();
		
		if(rate != "1"){
			$(".taxa-moeda").show();
		}else{
			$(".taxa-moeda").hide();
			$("#vl_taxa").val("1");
		}
	}
	
	, calculateBudget: function(){
		let branch = $("#cd_filial").val();
		let costCenter = $("#cd_centro_custo").val()[0];
		let account = $("#cd_conta_contabil").val()[0];	
						
		var contaAux = $("#cd_conta_contabil").val()+'';
		
		console.log("contaAux = " + contaAux);
		console.log("contaAux.substring(0,1) = " + contaAux.substring(0,1));
		
		//contas pagamento RH
		if(contaAux.substring(0,1) == "2"){
			$("#nm_situacao_budget").val("Não valida Budget");
			
			
		}else if(branch != "" && costCenter != "" && account != null && account.charAt(0) == "4"){	
			MAIN.getBudgetFromFluigProcesses(branch, costCenter, account);
		}
		else $("#nm_situacao_budget").val("");
	}
	
	, getBudgetFromFluigProcesses : function(branch, costCenter, account) {
		let constraints = [];
		constraints.push(DatasetFactory.createConstraint("cd_filial", branch, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cd_centro_custo", costCenter, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cd_conta_contabil", account, null, ConstraintType.MUST));
		DatasetFactory.getDataset("fluig_verifica_total_budget", null, constraints, null, {
			success : function(data) {
				let fluigBudget = 0.0;
				if(data != null && data.values.length > 0) {
					fluigBudget = parseFloat(data.values[0].budget);
				}		
				MAIN.checkBudget(branch, costCenter, account, fluigBudget);
			}, error : function(err) {
				console.error("Erro ao consultar budget de processos: " + err);
			}
		});			
	}
	
	, checkBudget : function(branch, costCenter, account, fluigBudget) {
		let constraints = [];
		constraints.push(DatasetFactory.createConstraint("cd_filial", branch, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cd_centro_custo", costCenter, null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cd_conta_contabil", account, null, ConstraintType.MUST));
		
		DatasetFactory.getDataset("protheus_orcamento", null, constraints, null, {
			success : function(data) {
				if(data != null && data.values.length > 0) {
					let budget = parseFloat(data.values[0].Saldo) - fluigBudget;
					
					let taxa = UTILS.moneyParser($("#vl_taxa").val());
					let total = UTILS.moneyParser($("#vl_total").val())*taxa;
					
					if(total > budget){
						$("#nm_situacao_budget").val("Indisponível");
						FLUIGC.toast({
							title: '',
							message: 'Orçamento indisponível para operação. 無法運營的預算',
							type: 'warning'
						});
					}
					else $("#nm_situacao_budget").val("Orçamento OK");							
				}else{
					FLUIGC.toast({
						title: '',
						message: 'Não foi possível resgatar o orçamento para a filial '
							+branch+', centro de custo '+costCenter+', e conta contábil '+account
							+". 不能為機構"+branch+"、成本中心 "+costCenter+" 和總帳科目 "+account+" 贖回預算",
						type: 'warning'
					});
				}				
			}, error : function(err) {
				$("#nm_situacao_budget").val("Indisponível")
				console.error("Erro ao consultar orçamento: " + err);
			}
		});
	}
};

let BINDINGS = {
		init: function(){
			BINDINGS.bindMasks();
			BINDINGS.bindFields();
			BINDINGS.bindDateFields();
		},
		bindMasks: function(){
			$('.campo-data').mask('00/00/0000');
		},
		bindFields: function(){
			$('input[type="text"]').on("change", function(){
			    this.value = $.trim(this.value);
			});						
			
			if(CONTEXT.CURRENT_STATE != Activity.ABERTURA && CONTEXT.CURRENT_STATE != Activity.INICIO){
				$('.aprovacao').on('change', function(e,i,a){
					MAIN.requireApproverObservation(e.target);
				});						
				
				$('input[name="rd_lancado"]').on('change', function(e,i,a){
					MAIN.requireFiscalObservation();		
				});
				
				
				$('input[name="rd_aprov_financeiro"]').on('change', function(e,i,a){
					let decision = $(this).val();
					let $obsLabel = $('[for="ds_obs_aprov_financeiro"]');
					let $bancoLabel = $('[for="nm_banco_xcmg"]');
					if(decision == "Aprovado"){
						$obsLabel.removeClass('required');
						$bancoLabel.addClass('required');
					}
					else{
						$obsLabel.addClass('required');
						$bancoLabel.removeClass('required');
					}					
				});
				
				
				
				
			}
			
			$('input[name="rd_processo"]').on('change', function(e,i,a){
				MAIN.setUpProcessType();				
			});
			
			$('input[name="rd_tipo"]').on('change', function(e,i,a){
				MAIN.setUpProcessType();
			});
			
			$("#ck_rateio").on('click', function(){
				let sharing = $("#ck_rateio").is(":checked");
				if(sharing){					
					FLUIGC.toast({
						title: '',
						message: 'Não esqueça de anexar documento de detalhamento do rateio!',
						type: 'warning'
					});
				}
				MAIN.calculateBudget();
			});							
			
			$('.currency_rate').mask("00.000,0000", {reverse: true});			
			
			$('.money').mask("#.##0,00", {reverse: true});			
			$('.money').on('focus touchstart', function(ev){
			    ev.preventDefault();
			    if($(this).val() == "") $(this).val('0');
			});
			
			$('#sl_moeda').on('change', function() {
				MAIN.setCurrencyRate();
				MAIN.calculateBudget();
			});
			
			$('#vl_taxa').on('blur', function() {
				MAIN.calculateBudget();				
			});	
			
			$('.vl-viagem').on('blur', function() {
				MAIN.setAccomplishedValue();				
			});	
			
			$('#vl_adiantado,#vl_realizado').on('blur', function() {
				MAIN.setTotalValue();				
			});	
		},
		bindDateFields: function(){
			if(CONTEXT.ACTIVITY == Activity.ABERTURA || CONTEXT.ACTIVITY == Activity.INICIO || CONTEXT.ACTIVITY == Activity.VERIFICAR_SITUACAO){				
				FLUIGC.calendar('.campo-data', {
					useCurrent: false,
					minDate: new Date()
				});				
			}
			
			$(".campo-data" ).on("change", function() {
				if(this.value != '')
					UTILS.validateDate($(this));
					
				MAIN.validateAdvancePolicy();	
			});	
		}
};