let MAIN = {
	loading : {}

	,init : function() {
		MAIN.loading = FLUIGC.loading(window);
		
		MAIN.bind();
		MAIN.bindDateTimeFields();
		
		MAIN.displayForm();
		
		ATIVIDADES.carregar();
	
		enableFields();
	}
	
	, bind: function(){
		$("#verDisponibilidade").on("click", function() {
			let cnpj = $('#cnpjCliente').val();
			let client = $("#cliente").val();
			window.open("/portal/p/1/agenda?cnpj="
					+cnpj+"&client="+client, "blank_");
		});
		
		if(CONTEXT.MODE != "VIEW"){
			$('[name="tipo_de_mudanca"]').on('change', MAIN.displayForm);
			
			$('#adicionarAtividade').on('click', function(){
				ATIVIDADES.modalAtividades(null, true);
			});
		}
		if(CONTEXT.MODE != "VIEW" 
			&& CONTEXT.CURRENT_STATE == Activity.AVALIAR_SDM){
			$('[name="parecer"]').on('change', MAIN.requerObservacaoCGM);
		}
		else if(CONTEXT.MODE != "VIEW" 
			&& (CONTEXT.CURRENT_STATE == Activity.VALIDAR_MUDANCA)){
			$('[name="resultado"]').on('change', MAIN.requerObservacaoValidacao);
		}
		
		$(document).on('shown.bs.modal','#atividades-modal', function () {
			let that = this;
			setTimeout(function(){
				$(that).find('.modal-body').css({
	 	        	"width":'auto',
	 	        	"height":'auto',
	 	        	"max-height":'75%'
	 	    	});
			}, 100);
		});
	}
	
	, bindDateTimeFields: function(){
		if(CONTEXT.MODE == "VIEW" 
			|| (CONTEXT.CURRENT_STATE != Activity.ZERO
					&& CONTEXT.CURRENT_STATE != Activity.SOLICITAR_MUDANCA
					&& CONTEXT.CURRENT_STATE != Activity.AVALIAR_SDM))
			return false;
		
		FLUIGC.calendar('.calendar', {useCurrent: false});				
		
		$(".calendar" ).on("change", function() {
			if(this.value != '')
				UTILS.validateDate($(this));
		});
		
		$(".time" ).mask("99:99");
		$(".time" ).on("change", function() {
			if(this.value != '')
				UTILS.validateTime($(this));
		});
	}

	, displayForm : function() {
		if(CONTEXT.MODE != "VIEW"
			&& (CONTEXT.CURRENT_STATE == Activity.ZERO 
					|| CONTEXT.CURRENT_STATE == Activity.SOLICITAR_MUDANCA)){
			ZOOMS.executeQuandoPronto("cnpjCliente", prepareClientZoom);
		}
		
		if(CONTEXT.CURRENT_STATE == Activity.AVALIAR_SDM){
			$('#panelPlanoTecnico').show();
			$('#panelAprovacaoCGM').show();
			
			let title = $('#panelAprovacaoCGM').find('.panel-title b');
			if($('[name="tipo_de_mudanca"]:checked').val() == "Emergencial"){
				title.html("Aprovação CGM - Emergência");
			}
			else{
				title.html("Aprovação CGM");
			}
		}
		else if(CONTEXT.CURRENT_STATE == Activity.ELABORAR_PLANO_TECNICO){
			$('#panelPlanoTecnico').show();
			
			if(CONTEXT.MODE != "VIEW"){
				ZOOMS.executeQuandoPronto("zoom_plano_referencia", prepareZoomPlano);
				$('#adicionarAtividade').prop('disabled', false);
			}
			$('#observacoes').parents('.form-group').show();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.DOUBLE_CHECK){
			$('#panelPlanoTecnico').show();
			
			$('#observacoes').parents('.form-group').show();
			$('#aprovarReprovarTodas').parent().show();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.AVALIAR_PLANO_TECNICO){
			$('#panelPlanoTecnico').show();
			
			$('#observacoes').parents('.form-group').show();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.EXECUTAR_MUDANCA){
			$('#panelPlanoTecnico').show();
			$('#panelAprovacaoCGM').show();
			
			$('#observacoes').parents('.form-group').show();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.VALIDAR_MUDANCA){
			$('#panelPlanoTecnico').show();
			$('#panelAprovacaoCGM').show();
			$('#panelValidacaoMudanca').show();
			
			$('#observacoes').parents('.form-group').show();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.FIM_SDM_CONCLUIDA
				|| CONTEXT.CURRENT_STATE == Activity.FIM_SDM_REPROVADA){
			$('#panelPlanoTecnico').show();
		}
		else if(CONTEXT.PROCESS_TYPE == "SUB_AVALIACAO"){
			$('#aprovarReprovarTodas').parent().show();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.EQUIPE_CHEASY_I
				|| CONTEXT.CURRENT_STATE == Activity.EQUIPE_CHEASY_II
				|| CONTEXT.CURRENT_STATE == Activity.EQUIPE_CHEASY_III
				|| CONTEXT.CURRENT_STATE == Activity.EQUIPE_CHEASY_IV){
			$('#panelPlanoTecnico').show();
		}
		
		
		$('.exibir').each(function(idx, el){
		    let $el = $(el);
		    let parent = $el.parents('.panel');
		    
		    if($el.val() != "") parent.show();
		    else parent.hide();
		});
		
		let tipoMudanca = $('[name="tipo_de_mudanca"]:checked').val();
		if(tipoMudanca == "Emergencial" 
			|| CONTEXT.CURRENT_STATE == Activity.AVALIAR_SDM){
			$('#dataAplicacao').parent().siblings('label').addClass('required');
			$('#apartir_de_horario').siblings('label').addClass('required');
			$('#justificativa').parent().show();
		}
		else{
			$('#dataAplicacao').parent().siblings('label').removeClass('required');
			$('#apartir_de_horario').siblings('label').removeClass('required');
			$('#justificativa').parent().hide();
		}
	}
	
	, requerObservacaoCGM: function(){
		let parecer = $('[name="parecer"]:checked').val();
		if(parecer == "aprovado"){
			$('#obs_aprovacao_cgm').siblings('label').removeClass('required');
		}
		else{
			$('#obs_aprovacao_cgm').siblings('label').addClass('required');
		}
	}
	
	, requerObservacaoValidacao: function(){
		let parecer = $('[name="resultado"]:checked').val();
		if(parecer == "sucesso"){
			$('#obs_validacao_mudanca').siblings('label').removeClass('required');
		}
		else{
			$('#obs_validacao_mudanca').siblings('label').addClass('required');
		}
	}
	
	, enabledCalendar : function() {
	
	}
	
	, getDateBR : function(date) {
		return new Date(date.split("/")[2], date.split("/")[1] - 1, date.split("/")[0])
	}
	
	, getDateEN_US : function(date) {
		return new Date(date.split("/")[0], date.split("/")[1] - 1, date.split("/")[2])
	}
}

function consultaPlanosTecnicos(item) {
	let loading = FLUIGC.loading(window, {textMessage : "Buscando planos técnicos"});
	loading.show();
	let constraints = [];
	let version = item.version;
	let documentId = item.documentid;

	constraints.push(DatasetFactory.createConstraint("version", version, version, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("documentid", documentId, documentId, ConstraintType.MUST));
	DatasetFactory.getDataset("cheasy_consulta_plano_atividades", ["atividade", "descricaoDetalhada", "duracaoPrevista", "grupoResponsavel", "tipoAtividade"], constraints, null, {
		success : function(data) {
			if(data != null && data.values.length > 0) {
				for(let i = 0; i < data.values.length; i++) {
					let index = wdkAddChild("tbAtividadesPlano");
					let row = data.values[i];
					
					let grupoResponsavel = (row.grupoResponsavel == "null")
						? "" : row.grupoResponsavel;
					
					$("#idPlanoOrigem___" + index).val(item.identificacaoPlano);
					$("#tipoAtividade___" + index).val(row.tipoAtividade);
					$("#atividade___" + index).val(row.atividade);
					$("#duracaoPrevista___" + index).val(row.duracaoPrevista);
					if(grupoResponsavel != ""){
						$("#cd_grupo_responsavel___" + index).val(grupoResponsavel);
						window["zoom_grupo_responsavel___" + index].setValues([grupoResponsavel]);
					}
					$("#descricaoDetalhada___" + index).val(row.descricaoDetalhada);
				}
				ATIVIDADES.recarregarDatatable();
			}
			loading.hide();
		}, error : function(err) {
			console.error("Erro ao consultar plano tecnico ", err);
			loading.hide();
		}
	});
}

function removeAtividadesPlanoTecnico(idPlano){
	var indices = retornaIndicesTabela("tbAtividadesPlano");
	for(var i in indices){
	    let idx = indices[i];
        let $idPlanoOriem = $('#idPlanoOrigem___'+idx);
	    if($idPlanoOriem.val() == idPlano){
	    	fnWdkRemoveChild($idPlanoOriem[0]);
	    }
	}
	ATIVIDADES.recarregarDatatable();
}

$(document).ready(function() {
	MAIN.init();
});