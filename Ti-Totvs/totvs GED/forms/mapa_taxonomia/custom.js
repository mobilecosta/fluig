$( document ).ready(function() {
	ESTRUTURA.init();
	MAIN.init();
});

const MAIN = {
	cardPublisher: { 'apply': null}
	, init: function(){
		MAIN.bind();
		MAIN.modificarGravacao();
	}
	, bind: function(){
		$('[name^="tipo_pasta_nivel___"]').each(function(){
			MAIN.trocaTipoPasta(this);
		});
	}
	/**Sobrepõe a gravação padrão de ficha
	* para primeiro fechar as modais dos níveis
	* atualizar o pai x filho com os dados inputados
	* para então acionar a gravação padrão */
	, modificarGravacao: function(){
		$cardSave = $('#ecm-documentview-cardSave', window.parent.document);
		$cardEdit = $('#ecm-documentview-cardEdit', window.parent.document);
		if($cardEdit != null && $cardEdit.length > 0 && $cardEdit.is(':visible')){
			return false;
		}
		else if($cardSave != null && $cardSave.length > 0 && $cardSave.is(':visible')){
			if(parent.ECM.documentView.cardSave.name == 'tratarGravacao') return false;
			MAIN.cardPublisher.apply = parent.ECM.documentView.cardSave.clone();
			parent.ECM.documentView.cardSave = MAIN.tratarGravacao;
		}
		else{
			if(parent.ECM.cardPublisher.apply.name == 'tratarGravacao') return false;
			MAIN.cardPublisher.apply = parent.ECM.cardPublisher.apply.clone();
			parent.ECM.cardPublisher.apply = MAIN.tratarGravacao;
		}
	}
	, tratarGravacao: function(){
		NIVEL.efetivarTodas();
		MAIN.cardPublisher.apply();
	}
	
	, adicionarNivel: function(uuidPai, nivel, ref, el){
		let $el = $(el);
		let uuid = FLUIGC.utilities.randomUUID();
		if($el.hasClass('modal')){
			let $modal = $el.parents('.modal');
			let $tblModal = $modal.find('#tbl_estrutura_modal');

			let idx = wdkAddChild('tbl_estrutura');
			$('#tbl_estrutura').find('tr')
				.last()
			//	.clone()
				.appendTo($tblModal);
			
			let $tr = $tblModal.find('tr').last();
			let $qual_nivel = $tr.find('[name^="qual_nivel"]');
			$qual_nivel.val(nivel);
			$tr.find('[name^="referencia_nivel"]').val(ref);
			$tr.find('[name^="uuid_nivel"]').val(uuid);
			$tr.find('[name^="uuid_pai"]').val(uuidPai);
			$tr.find('[name^="idx"]').val(idx);
			
			let pai = ESTRUTURA.getPaiByUuid(uuidPai);
			
			$tr.find('[name^="caminho"]').val(pai.caminho);
			$tr.find('[name^="tipo_pasta_nivel"]').val('');
			$tr.find('[name^="nome_pasta"]').val('');
			$tr.find('[name^="cd_assunto"]').val('');
			
			MAIN.controleExibicaoNivel($tr);
			NIVEL.controleExibicao($tr);
		}
		else if($el.hasClass('normal')){
			let idx = wdkAddChild('tbl_estrutura');
			let $qual_nivel = $('#qual_nivel___'+idx);
			$qual_nivel.val(nivel);
			$('#referencia_nivel___'+idx).val(ref);
			$('#uuid_nivel___'+idx).val(uuid);
			$('#uuid_pai___'+idx).val(uuidPai);
			$('#idx___'+idx).val(idx);
			
			let $tr = $qual_nivel.parents('tr');
			if(nivel != 2) ESTRUTURA.hideRow($tr);
			MAIN.controleExibicaoNivel($tr);
		}
	}
	
	, controleExibicaoNivel: function(row){
		let rows = (row == null) 
			? $('#tbl_estrutura').find('tr:gt(1)') : [$(row)];
		for(let r in rows){
			let $r = rows[r];
			let nivel = parseInt($r.find('[name^="qual_nivel___"]').val(), 10);
			if(nivel > 2) $r.hide();
			else $r.show();
		}
	}
	
	, trocaTipoPasta: function(el){
		let $el = $(el);
		let $tr = $el.parents('tr');
		let $tipoSelecionado = $el.find(':selected');
		let tipoSelecionado = $tipoSelecionado.val();
		
		//Valida tipo
		if(tipoSelecionado == 'unidades_totvs'
			|| tipoSelecionado == 'ano'
			|| tipoSelecionado == 'ano_mes'
			|| tipoSelecionado == 'sobdemanda'){
			let uuid_pai = $tr.find('[name^="uuid_pai_"]').val();
			let uuid_nivel = $tr.find('[name^="uuid_nivel_"]').val();
			if(ESTRUTURA.nivelJaUtilizado(tipoSelecionado, uuid_pai, uuid_nivel)){
				$tipoSelecionado.prop('selected', false);
			}
		}
		
		//Controle exibição
		let $publicacao = $tr.find('.publicacao');
		let $subniveis = $tr.find('.subniveis');
		if(tipoSelecionado != 'publicacao' 
			&& tipoSelecionado != 'publicacao_diretoria') {
			$publicacao.hide();
			$subniveis.show();
		}
		else {
			$publicacao.show();
			$subniveis.hide();
		}
		
		let $especifico = $tr.find('.especifico');
		if(tipoSelecionado == 'especifico'){
			$especifico.show();
			$especifico.find('input').prop('readonly', false);
		}
		else {
			$especifico.hide();
			let $input = $especifico.find('input');
			$input.prop('readonly', true).val('');
		}
		if(tipoSelecionado == '') {
			$publicacao.hide();
			$subniveis.hide();
			$especifico.hide();
		}
	}
}