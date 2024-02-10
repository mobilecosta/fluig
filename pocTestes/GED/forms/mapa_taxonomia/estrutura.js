const ESTRUTURA = {
	init: function(){
		$('.linha-estrutura').each(function(){
			ESTRUTURA.hideRow($(this));
		});
	}
	
	, findIdxByUuid: function(uuid){
		var idx = null;
		$('#tbl_estrutura').find('tr:gt(1)').each(function(){
			let $uuid_nivel = $(this).find('[name^=uuid_nivel_]');
			if($uuid_nivel.val() == uuid) {
				idx = $uuid_nivel.attr('name').split('___')[1];
			}
		});
		return idx;
	}
	
	, hideRow:function($tr){
		let $qual_nivel = $tr.find('[name^=qual_nivel]');
		if($qual_nivel.val() != 2) {
			$tr.hide();
		}
	}
	
	, getData: function(el){
		let $el = $(el);
		let $tr = (el.tagName == 'TR') ? $el : $el.parents('tr');
		
		let obj = {};
		obj['idx'] = $tr.find('[name^="idx_"]').val();
		obj['uuid_pai'] = $tr.find('[name^="uuid_pai_"]').val();
		obj['uuid_nivel'] = $tr.find('[name^="uuid_nivel_"]').val();
		obj['qual_nivel'] = parseInt($tr.find('[name^="qual_nivel_"]').val(), 10);
		obj['proximo_nivel'] = obj['qual_nivel']+1;
		obj['referencia_nivel'] = $tr.find('[name^="referencia_nivel_"]').val();
		obj['tipo_pasta_nivel'] = $tr.find('[name^="tipo_pasta_nivel_"] > :selected').val();
		obj['nome_pasta'] = $tr.find('[name^="nome_pasta_"]').val();
		obj['cd_assunto'] = $tr.find('[name^="cd_assunto_"]').val();
		obj['nm_assunto'] = $tr.find('[name^="nm_assunto_"]').val();
		
		obj['nome_complementar_pasta'] = '';
		if(obj['tipo_pasta_nivel'] == 'unidades_totvs'){
			obj['nome_complementar_pasta'] = 'Unidades TOTVS';
		}
		else if(obj['tipo_pasta_nivel'] == 'ano'){
			obj['nome_complementar_pasta'] = 'Ano';
		}
		else if(obj['tipo_pasta_nivel'] == 'ano_mes'){
			obj['nome_complementar_pasta'] = 'Ano - Mês';
		}
		else if(obj['tipo_pasta_nivel'] == 'sobdemanda'){
			obj['nome_complementar_pasta'] = 'Sobdemanda';
		}
		else{
			obj['nome_complementar_pasta'] = obj['nome_pasta'];
		}
		
		// Usado no template mustache
		if(obj['tipo_pasta_nivel'] == "") obj['sem_tipo'] = true; 
		else obj[obj['tipo_pasta_nivel']] = true; 
		
		obj['caminho'] = $tr.find('[name^="caminho"]').val();
		obj['caminho'] = ESTRUTURA.getCaminho(obj);
		$tr.find('[name^="caminho"]').val(obj['caminho']);
		
		obj['subniveis'] = ESTRUTURA.getSubNivelData(obj);
		
		return obj;
	}
	, getCaminho: function(obj){
		const SEP = ' / ';
		var caminho = obj.caminho;
		
		if((caminho == null || caminho == '')
			&& obj.qual_nivel > 2){
			$('#modal_'+(obj.qual_nivel-1)).find('ol>li').each(function(){
			    let pedaco_caminho = $(this).html();
			    if(pedaco_caminho == '') return;
			    caminho += SEP + pedaco_caminho;
			});		
		}
		if((caminho == null || caminho == '')
			|| caminho.indexOf(obj.referencia_nivel) < 0){
			caminho += SEP + obj.referencia_nivel;
		}
		if((obj.nome_pasta != '' && caminho.indexOf(obj.nome_pasta) < 0)
			|| caminho.indexOf(obj.nome_complementar_pasta) < 0){
			caminho += SEP;
			caminho += (obj.nome_pasta == '') 
				? obj.nome_complementar_pasta : obj.nome_pasta;
		}
		return caminho;
	}
	, getSubNivelData: function(obj){
		let subnivel = [];
		//Para cada linha da tabela estrutura
		$('#tbl_estrutura').find('tr').each(function(i, el){
		    let $uuid_pai = $(el).find('[name^="uuid_pai_"]');
		    //Verifique se o uuid_pai é o uuid recebido como parametro da função
		    // ou seja, se essa é uma linha filha da referencia recebida
		    if($uuid_pai.val() == obj.uuid_nivel){
				//Se for, recupere o objeto dessa linha filha
				let filho = ESTRUTURA.getData(this);
				let fCaminho = filho.caminho;
				
				//Se o caminho do pai não estiver no filho, complementar
				if(fCaminho.indexOf(obj.caminho) < 0){
					filho.caminho = obj.caminho + ' / ' + filho.caminho;
				}
				
				//Apesar de na documentação do mustache dizer que ao iterar numa lista o contexto é o item da lista
				//ele continua olhando o objeto completo da estrutura, logo é preciso
				//diferenciar a flag pai da flag filha para correta renderização
				filho['sub_'+filho.tipo_pasta_nivel] = filho[filho.tipo_pasta_nivel];
				
				//Adicionar o objeto da linha filha p/ retorno
		        subnivel.push(filho);
		    }
		});
		if(subnivel.length == 0){
			//subnivel.push(ESTRUTURA.vazio(obj));
		}
		return subnivel;
	}
	, temSubNivel: function(obj){
		var tem = false;
		$('#tbl_estrutura').find('tr').each(function(i, el){
		    let $uuid_pai = $(el).find('[name^="uuid_pai_"]');
		    if($uuid_pai.val() == obj.uuid_nivel){
		        tem = true;
		    }
		});
		return tem;
	}
	, vazio: function(obj){
		return { 
			'uuid_pai': obj.uuid_nivel
			, 'uuid_nivel': FLUIGC.utilities.randomUUID()
			, 'qual_nivel': obj.proximo_nivel, 'proximo_nivel': obj.proximo_nivel+1
			, 'referencia_nivel': obj.nome_complementar_pasta
			, 'tipo_pasta_nivel': '', 'nome_pasta': ''
			, 'cd_assunto': '', 'nm_assunto': ''
			, 'nome_complementar_pasta': '', 'tipo_pasta_nivel': ''
			, 'caminho': obj.caminho, 'subniveis': []
		};
	}
	
	, atualizar: function(row){
		let idxExistente = ESTRUTURA.findIdxByUuid(row.uuid_nivel);
		let idx = (idxExistente != null) ? idxExistente : wdkAddChild('tbl_estrutura');
		
		let $uuid_nivel = $('#uuid_nivel___'+idx);
		$uuid_nivel.val(row.uuid_nivel);
		$('#uuid_pai___'+idx).val(row.uuid_pai);
		$('#caminho___'+idx).val(row.caminho);
		$('#qual_nivel___'+idx).val(row.qual_nivel);
		$('#referencia_nivel___'+idx).val(row.referencia_nivel);
		$('#tipo_pasta_nivel___'+idx).val(row.tipo_pasta_nivel);
		$('#nome_pasta___'+idx).val(row.nome_pasta);
		
		console.warn('Verificar se os valores são armazenados corretamente');
		$('#cd_assunto___'+idx).val(row.cd_assunto);

		if(row.cd_assunto != "")
			window['nm_assunto___' + idx].setValue({cd_assunto : row.cd_assunto, nm_assunto : row.nm_assunto[0]});
		
		if(row.qual_nivel != 2) ESTRUTURA.hideRow($uuid_nivel.parents('tr'));
	}
	
	, removerItem: function(tr){
		let $tr = $(tr);
		let uuid_nivel = $tr.find('[name^="uuid_nivel_"]').val();
		
		ESTRUTURA.removerSubItens(uuid_nivel);
		
		fnWdkRemoveChild(tr);
	}
	
	, removerSubItens: function(uuid_pai){
		$('#tbl_estrutura').find('[name^="uuid_pai_"]').each(function(){
			let $uuid_pai = $(this);
		    if($uuid_pai.val() == uuid_pai){
				let tr = $uuid_pai.parents('tr')[0];
		        fnWdkRemoveChild(tr);
		    }
		});
	}
	
	/**
	 *	Verifica se um nível da estrutura abaixo daquele pai 
	 *	já possui uma pasta não duplicável na estrutura do tipo informado
	 *	@param uuid_pai -> Pasta pai, abaixa da qual se quer avaliar
	 *	@param uuid_nivel -> uuid exceção, deve ser diferente desse para ser considerado
	 *	@return boolean
	 */
	, nivelJaUtilizado: function(tipo, uuid_pai, uuid_nivel){
		var jaTemTipo = false;
		$('[id^="tbl_estrutura"]').find('[name^="uuid_pai_"]').each(function(){
			let $uuid_pai = $(this);
			let $tr = $uuid_pai.parents('tr');
			
			let $uuid_nivel = $tr.find('[name^="uuid_nivel_"]');
		    
		    if($uuid_pai.val() == uuid_pai
		      && $uuid_nivel.val() != uuid_nivel
		      && tipo == $tr.find('[name^="tipo_pasta_nivel_"] :selected').val()){
		        jaTemTipo = true;
		    }
		});
		return jaTemTipo;
	}
	
	, validar: function(row){
		var msg = '';
		if(row.tipo_pasta_nivel == ''){
			msg += 'Tipo de pasta é obrigatório \n';
		}
		if(row.tipo_pasta_nivel == 'especifico' 
			&& row.nome_pasta == ''){
			msg += 'Nome da pasta é obrigatório \n';
		}
		if((row.tipo_pasta_nivel == 'publicacao' 
		|| row.tipo_pasta_nivel == 'publicacao_diretoria')
			&& (row.cd_assunto == null || row.cd_assunto.length == 0)){
			msg += 'Assunto é obrigatório \n';
		}
		return msg;
	}
	
	, getPaiByUuid: function(uuidPai, $contexto){
		var pai = null;
		let $table = ($contexto == null) ? $('#tbl_estrutura') : $contexto;
		$table.find('tr').each(function(i, el){
		    let $uuid_nivel = $(el).find('[name^="uuid_nivel_"]');
		    if($uuid_nivel.val() == uuidPai){
		        pai = ESTRUTURA.getData($uuid_nivel[0]);
		    }
		});
		return pai;
	}
}