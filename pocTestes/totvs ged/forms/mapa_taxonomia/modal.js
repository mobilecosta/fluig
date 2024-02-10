const NIVEL = {
	prepararModal: function(el){
		let $this = $(el);
		let obj = ESTRUTURA.getData($this);
		if(!ESTRUTURA.temSubNivel(obj)){
			obj["tipo_pasta_nivel"] = "";
			obj["nome_pasta"] = "";
		}
		NIVEL.modal(obj);
	}
	, modal: function(dados){
		let _id = 'modal_'+ dados.qual_nivel;
		let mdl = FLUIGC.modal({
		    title: 'Definir sub-níveis',
		    content: Mustache.render($("#tpl_modal_nivel").html(), dados),
		    id: _id,
		    size : "full",
		    actions: [{
		        'label': 'Fechar',
		        'classType' : 'btn-primary fechar'
		    }]
		}, function(err, data) {
			if(!err) {
				NIVEL.ajustaZoomAssunto(_id);
				
				hasZoom();
				MaskEvent.initMask($("[mask]"));
				NIVEL.bind(_id);
				
				if(dados !== undefined && dados !== null) {
					NIVEL.processaModal(_id, dados);
					
					
				}
			}
		});
	}
	
	, bind: function(idModal){
		let $mdl = $('#'+idModal);
		$mdl.on('hide.bs.modal', function () {
			NIVEL.atualizarTabela($mdl);
		});
		$mdl.find(".fechar").on("click", function() {
			$mdl.find('.close').trigger('click');
		});
	}
	
	, ajustaZoomAssunto: function(_id){
		let zoom = $("#" + _id + " input[type='zoom']");
		for(let i = 0; i < zoom.length; i++){
			let $zoom = $(zoom[i]);
			$zoom.attr("name", "nm_assunto_" + _id + "_" + i);
			$zoom.siblings('[type="hidden"]').attr("name", "cd_assunto_" + _id + "_" + i);
		}
	}
	
	, processaModal: function(idModal, dados){
		let $modal = $('#'+idModal);
		let $bread = $modal.find('.breadcrumb');
		let pastas = dados.caminho.split(' / ');
		for(let i = 0; i < pastas.length; i++){
			let $li = $('<li>');
			$li.html(pastas[i]);
			
			$bread.append($li);
		}
		//let $li = $('<li>');
		//$li.html(dados.nome_pasta == '' 
		//	? dados.nome_complementar_pasta : dados.nome_pasta);
		//$bread.append($li);
		
		$('[name="referencia_nivel_modal"]').each(function(){
		    let $tr = $(this).parents('tr');
		    let $tipoPasta = $tr.find('[name="tipo_pasta_nivel_modal"] > :selected');
		    
		    if($tipoPasta.html() == this.value){
				$tipoPasta.prop('selected', false);
			}
		});
		
		for(let i in dados.subniveis) {
			if(dados.subniveis[i].nm_assunto.length > 0){
				window[`nm_assunto_${idModal}_${i}`].setValue({cd_assunto : dados.subniveis[i].cd_assunto, nm_assunto : dados.subniveis[i].nm_assunto[0]});
			}
		}
		
		$modal.find('[name^="tipo_pasta_nivel_modal"]').each(function(){
		    MAIN.trocaTipoPasta(this);
		});
	}
	
	, atualizarTabela: function($mdl){
		let rowsMdl = [];
		$mdl.find('tr:gt(0)').each(function(){
			rowsMdl.push(ESTRUTURA.getData(this));
		});
		
		for(let r in rowsMdl){
			let row = rowsMdl[r];
			let msgValidacao = ESTRUTURA.validar(row);
			if(msgValidacao != ''){
				FLUIGC.toast({
					title: 'Aviso: ',
					message: msgValidacao,
					type: 'warning'
				});
				throw msgValidacao;
			}
			ESTRUTURA.atualizar(row);
		}
	}
	
	, removerItem: function(el){
		let $el = $(el);
		let $uuid_modal = $el.parents('tr').find('[name^="uuid_nivel_"]');
		NIVEL.removerSubItens($uuid_modal.val());
		
		let idx = ESTRUTURA.findIdxByUuid($uuid_modal.val());
		let $uuid_tbl = $('[name="uuid_nivel___'+idx+'"');
		
		ESTRUTURA.removerItem($uuid_tbl.parents('tr')[0]);
		if($uuid_tbl == null || $uuid_tbl.length == 0){
			ESTRUTURA.removerSubItens($uuid_modal.val());
		}
		
		fnWdkRemoveChild($el.parents('tr')[0]);
	}
	
	, removerSubItens: function(uuid_nivel){
		$('[id^="tbl_estrutura_modal"]').find('[name^="uuid_pai_"]').each(function(){
			let $uuid_pai = $(this);
		    if($uuid_pai.val() == uuid_nivel){
				let tr = $uuid_pai.parents('tr')[0];
		        fnWdkRemoveChild(tr);
		    }
		});
	}
	
	, controleExibicao: function($tr){
		$tr.show();
		let btn = $tr.find('button.vinculos')[0];
		btn.onclick = function(){ NIVEL.modal(ESTRUTURA.getData(btn)) };
	}
	
	, efetivarTodas: function(){
		//Carrega lista de todas as modais abertas
		var arr = [];
		$('div.modal').each(function() { arr.push(this); });
		
		//Grava os valores no pai x filho da modal mais externa para a mais interna
		for(let i = arr.length-1; i >= 0; i--){
		    let $modal = $(arr[i]);
		    $modal.find('.fechar').trigger('click');
		}
	}
}