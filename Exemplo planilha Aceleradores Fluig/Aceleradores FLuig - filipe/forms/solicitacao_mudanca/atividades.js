let ATIVIDADES = {
	dsTipoAtividades: null,
	grupoCliente: null
	
	, carregar: function() {
		console.log("ATIVIDADES-Carregar");
		if(ATIVIDADES.dsTipoAtividades == null){
			ATIVIDADES.dsTipoAtividades = DatasetFactory.getDataset("cheasy_tipo_atividade", null, null, null);
		}
		setTimeout(function() {
			ATIVIDADES.bind();
			ATIVIDADES.atualizar();
		}, 1500);
	}

	, atualizar: function(){
		ATIVIDADES.recarregarDatatable();
		ATIVIDADES.requerObservacao();
	}

	, adicionar: function(){
		let index = wdkAddChild("tbAtividadesPlano");
		
		console.log('adicionar atividade');
		
		ATIVIDADES.setFilterZoomTable();

		return index;
	}

	//DATATABLE - Atividades
	, recarregarDatatable: function(filtro) {
		let datatableRegras = FLUIGC.datatable('#datatable_atividades', {
			dataRequest: ATIVIDADES.retornaAtividades(filtro),
			renderContent: "#tpl_datatable_atividades",
			navButtons: {
				enabled: false
			},
			search: {
				enabled: false
			},
			actions: {
				enabled: true,
				template: '#tpl-regras-filtro',
				actionAreaStyle: 'col-md-4'
			},	        
			header: [{
				'title': 'Tipo',
				'size': 'col-md-1'
			},{
				'title': 'Atividade',
				'size': 'col-md-3'
			},{
				'title': 'Responsável',
				'size': 'col-md-2'
			},{
				'title': 'Duração',
				'size': 'col-md-1'
			},{
				'title': 'Validada',
				'size': 'col-md-2'
			},{
				'title': 'Status',
				'size': 'col-md-2'
			},{
				'title': '',
				'size': 'col-md-1'
			}]
		}, function(err, data) {
			if(!err) {
				$(".visualiza-atividade").on("click", function() {
					let index = this.getAttribute("index");

					ATIVIDADES.modalAtividades(ATIVIDADES.getObjAtividade(index), false);
				});

				$(".edita-atividade").on("click", function() {
					let index = this.getAttribute("index");

					ATIVIDADES.modalAtividades(ATIVIDADES.getObjAtividade(index), true);				
				});

				$(".remove-atividade").on("click", function() {
					let index = this.getAttribute("index");
					fnWdkRemoveChild($("#atividade___" + index).parent().parent().parent().parent().find("i")[0]);
					ATIVIDADES.atualizar();
				});
			}
		});
	}
	
	, getObjAtividade: function(index){
		return {
			index: index,
			tipoAtividade: $('#tipoAtividade___' + index).val(),
			atividade: $('#atividade___' + index).val(),
			duracaoPrevista: $('#duracaoPrevista___' + index).val(),
			descricaoDetalhada: $('#descricaoDetalhada___' + index).val(),
			doubleCheckOk: $("input[name='double_check_ok___" + index + "']:checked").val(),
			dtInicioReal: $('#dt_inicio_real___' + index).val(),
			dtFimRreal: $('#dt_fim_real___' + index).val(),
			ativObservacoes: $('#ativ_observacoes___' + index).val(),
			status: $('#status___' + index).val(),					
			validadoExecutor: $("input[name='validado_executor___" + index + "']:checked").val(),					
			zoomGrupoResponsavel : ZOOMS.getValue("zoom_grupo_responsavel___" + index)
		};
	}

	, bind: function(){
		ATIVIDADES.bindFiltro();
		ATIVIDADES.bindAprovarReprovar();
	}
	, bindFiltro: function(){
		let btn = $("#btFiltroAtividades");
		btn.on("click", function() {
			var filtroAtual = btn.html();
			if(filtroAtual == "Minhas atividades"){
				filtroAtual = "minhas";
				btn.html("Todas atividades");
			}
			else{
				filtroAtual = "todas";
				btn.html("Minhas atividades");
			}
			ATIVIDADES.recarregarDatatable(filtroAtual);
		});
	}
	, bindAprovarReprovar: function(){
		let btn = $("#aprovarReprovarTodas");
		
		if(CONTEXT.MODE != "VIEW" 
			&& (CONTEXT.CURRENT_STATE == Activity.DOUBLE_CHECK
					|| CONTEXT.PROCESS_TYPE == "SUB_AVALIACAO")){
			btn.on('click', function(){
				var acaoAtual = btn.html();
				if(acaoAtual == "Aprovar todas"){
					acaoAtual = "aprovar";
					btn.html("Reprovar todas");
				}
				else{
					acaoAtual = "reprovar";
					btn.html("Aprovar todas");
				}
				ATIVIDADES.aprovarReprovarTodas(acaoAtual);
				ATIVIDADES.atualizar();
			});
		}
	}
	
	, retornaAtividades: function(filtro) {
		let valores = [];
		let grupos = {};
		let campo = $("#tbody_atividade").find("input");

		for(let i = 0; i < campo.length; i++) {
			if(campo[i].id != null && campo[i].id != undefined 
					&& campo[i].id.indexOf("atividade___") > -1) {
				let index = campo[i].id.split("___")[1];
				
				let tipoAtividade = ATIVIDADES.dsTipoAtividades.values.find(function(el, idx){
					let chave = $("#tipoAtividade___" + index).val();
					return (el.cdAtividade == chave);
				});
				
				let responsavel = ZOOMS.getValue("zoom_grupo_responsavel___" + index, 0);
				grupos[responsavel] = "";
				
	            var validado = ATIVIDADES.getValidado(index, responsavel);
				let status = $("#status___" + index).val();
				
	            valores.push({
					tipoAtividade : tipoAtividade.nmAtividade,
					atividade : $("#atividade___" + index).val(),
					responsavel : responsavel,
					duracao : $("#duracaoPrevista___" + index).val(),
					validada : (validado == "validado") ? "Validado" : (validado == "reprovado") ? "Reprovado" : validado,
					status : ATIVIDADES.getStatusText(status),
					index : index,
					modo : ATIVIDADES.getModo(index, responsavel),
					permiteRemover : ATIVIDADES.permiteRemover()
				});
			}
		}
		if(filtro == "minhas"){
			let gruposUsuario = [];
			let gruposTarefas = []
			for(var g in grupos){
				gruposTarefas.push(g);
			}

			let matricula = CONTEXT.USER;
			let constraints = [ DatasetFactory.createConstraint("cdMatricula", matricula, matricula, ConstraintType.MUST) ];
			let ds = DatasetFactory.getDataset("fluig_consulta_gruposDoUsuario", null, constraints, null);
			if(ds != null && ds.values.length > 0) {
				for (var x = 0; x < ds.values.length; x++) {
					gruposUsuario.push(ds.values[x].code);
				}
			}
			//para cada grupo tarefa, verificar se o usuário esta no grupo
			let gruposFinal = gruposTarefas.filter(function(gt, idx){
				return gruposUsuario.includes(gt);
			});
			
			return valores.filter(function(el, idx){
				return gruposFinal.includes(el.responsavel);
			});
		}
		return valores;
	}
	, getValidado: function(index, responsavel){
		var validado = $("input[name='validado_executor___" + index + "']:checked").val();
		
		if(CONTEXT.PROCESS_TYPE == "SUB_AVALIACAO"){
			if(!ATIVIDADES.atividadeEhDoGrupo(responsavel)) return "Outra equipe";
		}
		else if(CONTEXT.CURRENT_STATE == Activity.AVALIAR_PLANO_TECNICO){
			return "Aguardando";
		}
		else if(validado == "" || validado == null 
        		|| CONTEXT.CURRENT_STATE == Activity.ELABORAR_PLANO_TECNICO
        		|| CONTEXT.CURRENT_STATE == Activity.DOUBLE_CHECK){
        	validado = $("input[name='double_check_ok___" + index + "']:checked").val();
        }
		return validado;
	}
	, getModo: function(index, responsavel){
		if(CONTEXT.PROCESS_TYPE == "PRINCIPAL"){
			return ((CONTEXT.MODE == "MOD" || CONTEXT.MODE == "ADD") 
				&& $("#atividade___" + index).attr("readonly") != "readonly");
		}
		else if(CONTEXT.PROCESS_TYPE == "SUB_AVALIACAO"){
			return ((CONTEXT.MODE == "MOD" || CONTEXT.MODE == "ADD") 
					&& ATIVIDADES.atividadeEhDoGrupo(responsavel));
		}
		else if(CONTEXT.PROCESS_TYPE == "SUB_EXECUCAO"){
			return ((CONTEXT.MODE == "MOD" || CONTEXT.MODE == "ADD") 
					&& ATIVIDADES.atividadeEhDoGrupo(responsavel));
		}
		return false;
	}
	, getStatus: function(status){
		return status == "finalizado_erro" 
			? "Finalizado com erro" : (status == "finalizado_sucesso") 
					? "Não executada" : (status == "nao_executada") 
							? "Finalizado com sucesso" : "";
	}
	, permiteRemover: function(){
		if(CONTEXT.PROCESS_TYPE == "PRINCIPAL"){
			return ((CONTEXT.MODE == "MOD" || CONTEXT.MODE == "ADD") 
				&& CONTEXT.CURRENT_STATE == Activity.ELABORAR_PLANO_TECNICO);
		}
		return false;
	}
	, atividadeEhDoGrupo: function(grupoAtividade){
		let grupoExecutor = $('#grupoResponsavel').val().split("Pool:Group:")[1];
		return grupoExecutor == grupoAtividade;
	}
	, aprovarReprovarTodas: function(acao){
		if(CONTEXT.PROCESS_TYPE == "PRINCIPAL"
			&& CONTEXT.CURRENT_STATE == Activity.DOUBLE_CHECK){
			let alvo = (acao == "aprovar") ? "validado" : "reprovado";
			$("[name^='double_check_ok___']")
				.filter("[value='"+alvo+"']")
				.prop('checked', true);
		}
		else if (CONTEXT.PROCESS_TYPE == 'SUB_AVALIACAO'){
			let alvo = (acao == "aprovar") ? "validado" : "reprovado";
			$("[name^='validado_executor___']").filter("[value='"+alvo+"']")
			.each(function(i, el){
				let row = el.name.split("___")[1];
				let $el = $(el);
				
				if(ATIVIDADES.atividadeEhDoGrupo(
						ZOOMS.getValue("zoom_grupo_responsavel___"+row, 0))){
					$el.prop('checked', true);
				}
			});
		}
	}
	
	//MODAL -  Atividades
	, loadTipoAtividadesModal: function() {
		if (ATIVIDADES.dsTipoAtividades != null 
				&& ATIVIDADES.dsTipoAtividades.values.length > 0) {
			for (var x = 0; x < ATIVIDADES.dsTipoAtividades.values.length; x++) {
				let linha = ATIVIDADES.dsTipoAtividades.values[x];
				$('#tipoAtividade_modal').append($('<option>', {
					value : linha.cdAtividade,
					text : linha.cdAtividade + ' - ' + linha.nmAtividade
				}));
			}
		}
	}
	
	, modalAtividades: function(atividadesData, editavel){
		let atividades = FLUIGC.modal({
		    title: 'Atividades',
		    content: Mustache.render($("#tpl_modal_atividades").html(), {}),
		    id: 'atividades-modal',
		    size : "full",
		    actions: [{
		        'label': 'Confirmar',
		        'classType' : 'btn-primary adiciona-atividade ' + (CONTEXT.MODE == "VIEW" ? "fs-display-none" : "")
		    },{
		        'label': 'Cancelar',
		        'autoClose': true
		    }]
		}, function(err, data) {
		    if(!err) {
		    	hasZoom();
				
		    	ATIVIDADES.loadTipoAtividadesModal();
		    	if(atividadesData != undefined && atividadesData != null) {
		    		ATIVIDADES.carregaAtividades(atividadesData);
				}
		    	ATIVIDADES.preparaModal();
				
				$(".adiciona-atividade").on("click", function() {
					if(ATIVIDADES.validateRequiredFields()){
						ATIVIDADES.salvar(atividades);
					}
				});
				
				if(!editavel){
					window["zoom_grupo_responsavel_modal"].disable(true);
					
					$(".adiciona-atividade").hide();
				}
		    }
		});
	}

	, salvar: function(atividades) {
		let index = $("#indice_atividade_modal").val() == "" ? wdkAddChild("tbAtividadesPlano") : $("#indice_atividade_modal").val();
		
		$("#tipoAtividade___" + index).val($("#tipoAtividade_modal").val());	
		$("#atividade___" + index).val($("#atividade_modal").val());
		$("#duracaoPrevista___" + index).val($("#duracaoPrevista_modal").val());
		$("#dt_inicio_real___" + index).val($("#dt_inicio_real_modal").val());	
		$("#dt_fim_real___" + index).val($("#dt_fim_real_modal").val());	
		$("#ativ_observacoes___" + index).val($("#ativ_observacoes_modal").val());
		$("#descricaoDetalhada___" + index).val($("#descricaoDetalhada_modal").val());
		
		console.log($("#status_modal"));
		
		$("#status___" + index).val($("#status_modal").val());	
		
		$("input[name='double_check_ok___" + index + "'][value='" + $("input[name='double_check_ok_modal']:checked").val() + "']").prop("checked", true);
		$("input[name='validado_executor___" + index + "'][value='" + $("input[name='validado_executor_modal']:checked").val() + "']").prop("checked", true);

		if(window["zoom_grupo_responsavel_modal"] != null && window["zoom_grupo_responsavel_modal"].getSelectedItems().length > 0){
			let itens = window["zoom_grupo_responsavel_modal"].getSelectedItems();
			window["zoom_grupo_responsavel___" + index].setValue(itens);
			$('#cd_grupo_responsavel___' + index).val(itens[0]);
		}

		atividades.remove();
		ATIVIDADES.atualizar();
	}

	, carregaAtividades: function(atividadesData) {
		$("#indice_atividade_modal").val(atividadesData.index);
		
		$("#tipoAtividade_modal").val(atividadesData.tipoAtividade);	
		
		$("#atividade_modal").val(atividadesData.atividade);
		$("#duracaoPrevista_modal").val(atividadesData.duracaoPrevista);
		$("#dt_inicio_real_modal").val(atividadesData.dtInicioReal);	
		$("#dt_fim_real_modal").val(atividadesData.dtFimRreal);	
		$("#descricaoDetalhada_modal").val(atividadesData.descricaoDetalhada);
		$("#ativ_observacoes_modal").val(atividadesData.ativObservacoes);
		$("#status_modal").val(atividadesData.status);

		$("input[name='validado_executor_modal'][value='" + atividadesData.validadoExecutor + "']").prop("checked", true);
		$("input[name='double_check_ok_modal'][value='" + atividadesData.doubleCheckOk + "']").prop("checked", true);
		
		if(atividadesData.zoomGrupoResponsavel !== undefined
			&& atividadesData.zoomGrupoResponsavel !== null
			&& atividadesData.zoomGrupoResponsavel.length > 0)
			window["zoom_grupo_responsavel_modal"].setValue([atividadesData.zoomGrupoResponsavel]);
	}
	
	, preparaModal: function() {
		ATIVIDADES.setFilterZoom();
		ATIVIDADES.requiredFields();
		ATIVIDADES.controleCampos();
		ATIVIDADES.maskDuracao();
		ATIVIDADES.maskPeriodoReal();
	}
	
	, setFilterZoom: function(){
		console.log("ATIVIDADES - setFilterZoom");
		if(ATIVIDADES.grupoCliente == null){
			let cnpj = $('#cnpjCliente').val();
			let constraints = [ DatasetFactory.createConstraint("cnpj", cnpj, cnpj, ConstraintType.MUST) ];
			let ds = DatasetFactory.getDataset("cheasy_consulta_clientes", null, constraints, null);
			if(ds != null && ds.values.length > 0) {
				for (var x = 0; x < ds.values.length; x++) {
					ATIVIDADES.grupoCliente = ds.values[x].grupoRaizCliente;
				}
			}
		}
		reloadZoomFilterValues("zoom_grupo_responsavel_modal", "cdGrupo,"+ATIVIDADES.grupoCliente);
	}
	
	, requiredFields: function(){
		if(CONTEXT.MODE == 'VIEW') return;
		
		if(CONTEXT.PROCESS_TYPE == 'PRINCIPAL'){
			if(CONTEXT.CURRENT_STATE == Activity.ELABORAR_PLANO_TECNICO){
				$('#tipoAtividade_modal').siblings('label').addClass('required');
				$('#atividade_modal').siblings('label').addClass('required');
				$('#duracaoPrevista_modal').siblings('label').addClass('required');
				$('#zoom_grupo_responsavel_modal').siblings('label').addClass('required');
			}
			if(CONTEXT.CURRENT_STATE == Activity.DOUBLE_CHECK){
				$('#double_check_validado_modal').parents('.radio').siblings('label').addClass('required');
			}
		}
		//SUB Avaliação
		else if(CONTEXT.PROCESS_TYPE == 'SUB_AVALIACAO'){
			$("[name='validado_executor_modal']").parents('.radio').siblings('label').addClass('required');
		}
		//SUB Execução
		else if(CONTEXT.PROCESS_TYPE == 'SUB_EXECUCAO'){
			$('#dt_inicio_real_modal').parent().siblings('label').addClass('required');
			$('#dt_fim_real_modal').parent().siblings('label').addClass('required');
			$('#status_modal').siblings('label').addClass('required');
		}
	}
	
	, requerObservacao: function(){
		if(CONTEXT.PROCESS_TYPE == "PRINCIPAL"
			&& CONTEXT.CURRENT_STATE == Activity.DOUBLE_CHECK){
			let atividades = ATIVIDADES.retornaAtividades();
			let requer = atividades.find(function(el){
			    return el.validada == "Reprovado";
			}) != null;
			
			let $obs = $('#observacoes').siblings('label');
			if(requer) $obs.addClass('required');
			else $obs.removeClass('required');
		}
		else if (CONTEXT.PROCESS_TYPE == 'SUB_AVALIACAO'){
			let requer = $("[name='validado_executor_modal']:checked").val() == "reprovado";
			
			let $obs = $('#ativ_observacoes_modal').siblings('label');
			if(requer) $obs.addClass('required');
			else $obs.removeClass('required');
		}
		else if(CONTEXT.PROCESS_TYPE == 'SUB_EXECUCAO'){
			let requer = $("#status_modal").val() == "finalizado_erro";
			
			let $obs = $('#ativ_observacoes_modal').siblings('label');
			if(requer) $obs.addClass('required');
			else $obs.removeClass('required');
		}
	}
	
	, maskDuracao: function(){
		$('#duracaoPrevista_modal').inputmask({
			'mask': '999:99'
			, 'placeholder': '000:00'
		});
		if(CONTEXT.MODE != "VIEW" && CONTEXT.PROCESS_TYPE == 'PRINCIPAL' 
			&& CONTEXT.CURRENT_STATE == Activity.ELABORAR_PLANO_TECNICO){
			$('#duracaoPrevista_modal').on('change',function(ev){
			    let val = ev.target.value;
			    if(val != null){
			        let time = val.split(':');
			        let minutos = parseInt(time[1], 10);
			        if(minutos >= 60){
			            time[1] = "59";
			            ev.target.value = time.join(':');
			        }
			    }
			});
		}
	}
	
	, maskPeriodoReal: function(){
		if(CONTEXT.MODE != "VIEW" && CONTEXT.PROCESS_TYPE == 'SUB_EXECUCAO' 
			&& CONTEXT.CURRENT_STATE == Activity.EXECUTAR_ATIVIDADES){
			$('.calendar').inputmask({
				'mask': '99/99/9999'
			});
		
			$(".calendar" ).on("change", function() {
				if(this.value != ''){
					UTILS.validateDate($(this));
					UTILS.validateDateDifference($(this)
							,$("#dt_inicio_real_modal"),$("#dt_fim_real_modal")
							,'Data fim real deve ser maior que Data início real!');
					
					let hoje = {
							val: function(){
								return (new Date()).toLocaleDateString("pt-BR");
							}
					}
					UTILS.validateDateDifference($(this)
							,$("#dt_fim_real_modal"), hoje
							,'Data fim real deve ser igual ou menor a data de hoje!');
				}
			});
		}
	}
	
	, controleCampos: function(){
		if(CONTEXT.PROCESS_TYPE != 'PRINCIPAL' 
			|| CONTEXT.CURRENT_STATE != Activity.ELABORAR_PLANO_TECNICO){
			enableField($('#tipoAtividade_modal'), false);
			enableField($('#atividade_modal'), false);
			enableField($('#duracaoPrevista_modal'), false);
			enableField($('#zoom_grupo_responsavel_modal'), false);
			enableField($('#descricaoDetalhada_modal'), false);
			
			$('#double_check_validado_modal').parents('.form-group').show();
		}

		if(CONTEXT.PROCESS_TYPE == 'PRINCIPAL'){
			if(CONTEXT.CURRENT_STATE == Activity.DOUBLE_CHECK){
				//Preenche double check
			}
			else if(CONTEXT.CURRENT_STATE == Activity.ELABORAR_PLANO_TECNICO){
				enableField($('#ativ_observacoes_modal'), false);
				
                let observacoes = $('#ativ_observacoes_modal');
                if(observacoes.val() != null && observacoes.val() != ""){
                	observacoes.parents('.form-group').show();
                }
			}
			else if(CONTEXT.CURRENT_STATE == Activity.AVALIAR_PLANO_TECNICO
					|| CONTEXT.CURRENT_STATE == Activity.AVALIAR_SDM){
				enableField($("[name='double_check_ok_modal']"), false);
				enableField($("[name='validado_executor_modal']"), false);
				
				$('#valid_executor_validado_modal').parents('.form-group').show();
			}
			else if(CONTEXT.CURRENT_STATE == Activity.EXECUTAR_MUDANCA
					|| CONTEXT.CURRENT_STATE == Activity.VALIDAR_MUDANCA
					|| CONTEXT.CURRENT_STATE == Activity.FIM_SDM_CONCLUIDA
					|| CONTEXT.CURRENT_STATE == Activity.FIM_SDM_REPROVADA){
				enableField($("[name='double_check_ok_modal']"), false);
				enableField($("[name='validado_executor_modal']"), false);
				enableField($('#dt_inicio_real_modal'), false);
				enableField($('#dt_fim_real_modal'), false);
				enableField($('#status_modal'), false);
				enableField($('#ativ_observacoes_modal'), false);
				
				$('#valid_executor_validado_modal').parents('.form-group').show();
				$('#dt_inicio_real_modal').parents('.form-group').show();
				$('#dt_fim_real_modal').parents('.form-group').show();
				$('#status_modal').parents('.form-group').show();
				$('#ativ_observacoes_modal').parents('.form-group').show();
			}
		}
		//SUB Avaliação
		else if(CONTEXT.PROCESS_TYPE == 'SUB_AVALIACAO'){
			enableField($("[name='double_check_ok_modal']"), false);
			
			$('#valid_executor_validado_modal').parents('.form-group').show();
			$('#ativ_observacoes_modal').parents('.form-group').show();
			
			if(CONTEXT.MODE == 'VIEW'){
				enableField($("[name='validado_executor_modal']"), false);
			}
			else if (!ATIVIDADES.atividadeEhDoGrupo(
					ZOOMS.getValue("zoom_grupo_responsavel_modal", 0))){
				enableField($("[name='validado_executor_modal']"), false);
				enableField($('#ativ_observacoes_modal'), false);
			}
			else{
				$("[name='validado_executor_modal']").on('change', ATIVIDADES.requerObservacao);
			}
		}
		//SUB Execução
		else if(CONTEXT.PROCESS_TYPE == 'SUB_EXECUCAO'){
			enableField($("[name='double_check_ok_modal']"), false);
			enableField($("[name='validado_executor_modal']"), false);
			
			$('#valid_executor_validado_modal').parents('.form-group').show();
			$('#dt_inicio_real_modal').parents('.form-group').show();
			$('#dt_fim_real_modal').parents('.form-group').show();
			$('#status_modal').parents('.form-group').show();
			$('#ativ_observacoes_modal').parents('.form-group').show();
			
			if(CONTEXT.MODE == 'VIEW'
				|| !ATIVIDADES.atividadeEhDoGrupo(
						ZOOMS.getValue("zoom_grupo_responsavel_modal", 0))){
				enableField($('#dt_inicio_real_modal'), false);
				enableField($('#dt_fim_real_modal'), false);
				enableField($('#status_modal'), false);
				enableField($('#ativ_observacoes_modal'), false);
			}
			else{
				$("#status_modal").on('change', ATIVIDADES.requerObservacao);
			}
		}
		
		if(CONTEXT.MODE == 'VIEW'){
			enableContainer($(".modal-body"), false);
		}
	}

	, validateRequiredFields: function(){
		let msg = "";
		
		if(CONTEXT.PROCESS_TYPE == 'PRINCIPAL'){
			if(CONTEXT.CURRENT_STATE == Activity.ELABORAR_PLANO_TECNICO){
				let tipoAtividade = $('#tipoAtividade_modal').val();
				let atividade = $('#atividade_modal').val();
				let duracao = $('#duracaoPrevista_modal').val();
				let grupo = $('#zoom_grupo_responsavel_modal').val();
	
				if (tipoAtividade == ''){
					msg += 'Preencha o campo Tipo atividade.</br>'
				}
				if (atividade == ''){
					msg += 'Preencha o campo Atividade.</br>'
				}	
				if (duracao == ''){
					msg += 'Preencha o campo Duração.</br>'
				}
				if (grupo == null || grupo == ''){
					msg += 'Preencha o campo Grupo responsável.</br>'
				}	
			}
	
			if(CONTEXT.CURRENT_STATE == Activity.DOUBLE_CHECK){
				let doubleCheck = $("[name='double_check_ok_modal']:checked").val();
				
				if (doubleCheck == null){
					msg += 'Preencha o campo Double check.</br>'
				}
			}
		}
		//SUB Avaliação
		else if(CONTEXT.PROCESS_TYPE == 'SUB_AVALIACAO'){
			let validadoExecutor = $("[name='validado_executor_modal']:checked").val();
			let obs = $('#ativ_observacoes_modal').val();
			
			if (validadoExecutor == null){
				msg += 'Preencha o campo Validado executor.</br>';
			}
			else if(validadoExecutor == "reprovado" && obs == ""){
				msg += 'Preencha o campo Observações.</br>';
			}
		}
		//SUB Execução
		else if(CONTEXT.PROCESS_TYPE == 'SUB_EXECUCAO'){
			let dtInicio = $('#dt_inicio_real_modal').val();
			let dtFim = $('#dt_fim_real_modal').val();
			let status = $('#status_modal').val();
			let observacoes = $('#ativ_observacoes_modal').val();
			
			if (dtInicio == ''){
				msg += 'Preencha o campo Data início real.</br>'
			}
			if (dtFim == ''){
				msg += 'Preencha o campo Data fim real.</br>'
			}
			
			if (status == ''){
				msg += 'Preencha o campo Status.</br>'
			}
			else if (status == 'finalizado_erro' && observacoes == ''){
				msg += 'Preencha o campo Observações.</br>'
			}
		}
		
		if(msg != ''){
			FLUIGC.toast({
				title: '',
				message: msg,
				type: 'danger'
			});
			return false;
		}
		return true;
	}
}