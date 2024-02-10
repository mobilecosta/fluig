var loading = FLUIGC.loading(window); 
var user = "ecm";
var pass = "ecm1";
var codigoAdmGente = "TDI-RH-AdmGente-";
var erro = "";
var janIni = "";
var janFim = "";

var zoom = "";
var codEmpAnterior = "";
var codFilialAnterior = "";
var codFornecAnterior = "";
var codBancoAnterior = "";
var datavelhasolicpagto;
var vValBrutoAnterior;

function init() {
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var numeroAtividade = document.getElementById("numAtiv").value;
	var matricula = document.getElementById("matriculaUsuario").value;
	var mailCurrentUser = document.getElementById("emailUsuarioCorrente").value;
	var solicitacao = document.getElementById("cdSolicitacao").value;
	var vpagtoAntecipado = document.getElementById("descricaoItem").value;
	
	document.getElementById("codPrefixo").addEventListener("keyup", function(){ this.value = this.value.toUpperCase(); });
	

	//document.getElementById("marcador").setAttribute("class","");
	$("#divAvalPrimNivel").hide();
	document.getElementById("divAprovFiscal").style.display = "none";
	document.getElementById("divAprovContasPagar").style.display = "none";
	document.getElementById("divCPGeraTitulo").style.display = "none";
	document.getElementById("divCPGeraTituloIntegr").style.display = "none";
	
	document.getElementById("divCorrecao").style.display = "none";
	
	// USADO PARA MOBILE - NAO APAGAR
/*	document.getElementById("sampleApproved").style.display = "none";
	
	document.getElementById("divAvisoMobile").style.display = "none";
	window.mobilecheck = function() {
		 var check = false;
		 (function(a){
			   if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		 		return check; 
	     }
	
	////console.log ("window.mobilecheck? : " + window.mobilecheck());
	////console.log("descricaoItem: " + document.getElementById("descricaoItem").value);
	
	var retorno = window.mobilecheck();
	
	// teste!!
	//var retorno = false;
	
	if (retorno == true){
		//console.log ("retorno == true --> mobile");
		document.getElementById('hiddenMobile').value = "Mobile";
		document.getElementById("divAvisoMobile").style.display = "inline";
		document.getElementById("labelMobile").innerHTML = "Caro Participante: " +
				"O processo de  Solicita&ccedil;&atilde;o de Pagamento <br>" +
				"n&atilde;o est&aacute; dispon&iacute;vel via Mobile. <br>" +
				"Favor acessar o Fluig atrav&eacute;s de um desktop para acesso a este processo. Obrigado.";
		document.getElementById("corpo").style.display = "none";
		document.getElementById("divAprovGestores").style.display = "none";
	}*/
		//////console.log ("retorno == false --> NAO mobile");
		
	if(numeroAtividade == "247" || $("#nmAvalPrimNivel").val() != ""){
		$("#divAvalPrimNivel").show();
	}
	
		if (mode != "VIEW" && (numeroAtividade == "0" || numeroAtividade == "" || numeroAtividade == null || numeroAtividade == "1")) {
		
			// matriculas felipe, bianca e cristina
			//if ((matricula != "7529817") && (matricula != "170731594") && (matricula != "34302534")) {
				// SOLICITACAO DA PATRICIA - AREA CST
				//document.getElementById("divAvisoFora").style.display = "inline";
				//document.getElementById("corpo").style.display = "none";
				//document.getElementById("divAprovGestores").style.display = "none";
				// RETIRAR TODOS QUANDO O PROCESSO FOR PARA O AR E DESCOMENTAR A LOGICA ABAIXO
			//}
			//else{
			console.log("departamento");
			formpagamento.getdepartamento(matricula,mailCurrentUser);
			mostraEsconde("0", "divCorrecao");
			//setData("dataPagamento");
			tdifunctions.setCnpj("cnpjEmpresa");
			tdifunctions.setCpf("CpfDest");
			document.getElementById('valorBruto').value = "0,00";
			document.getElementById('acrescimo').value = "0,00";
			document.getElementById('decrescimo').value = "0,00";
			if(document.getElementById('retencao').value == "1") { alteraLabelRetencao (true); }
			else { alteraLabelRetencao (false); }
			//}
			 
		} 
		// aprovacao gestores
		else if (numeroAtividade == "155") {
			
			$(".group-zoom[data-event='beneficiario']").hide();
			AguardeGestorAprovador("labels");
			mostraEsconde("0", "divCorrecao");
			mostraEsconde("1", "divAprovGestores");
			mostraEsconde("0", "divAprovFiscal");
			mostraEsconde("0", "divAprovContasPagar");
	
			var currentTime = new Date();
			var month = currentTime.getMonth() + 1;
			var day = currentTime.getDate();
			var year = currentTime.getFullYear();
			if (month < 10) { month = "0" + month; }
			if (day < 10) { day = "0" + day; }
			
			document.getElementById('idDataAprov___' + document.getElementById('hiddenNumeroDaVez').value).value = day + "/" + month + "/" + year;
			
			//document.getElementById("marcador").setAttribute("class","required");
			var inputGEstor = document.getElementById('idTipoAprovac___' + document.getElementById('hiddenNumeroDaVez').value).parentNode.innerHTML;
			document.getElementById('idTipoAprovac___' + document.getElementById('hiddenNumeroDaVez').value).parentNode.innerHTML = "<span style='color: red;margin-left: -85px;'>*</span>"+inputGEstor;
			
			
			
			var camponome = 'idHoraAprov___' + document.getElementById('hiddenNumeroDaVez').value;
			horaPorSegundo(camponome);
			
			desabilitaCorpo(numeroAtividade);
			//desabilitaSelect(); 
			alteraRequired(numeroAtividade);
			alteraDestaqueAprovacDaVez(numeroAtividade);
			
			if(document.getElementById('retencao').value == "1") { alteraLabelRetencao (true); }
			else { alteraLabelRetencao (false); } 
		} 
		// aprovacao area fiscal - pa
		else if (numeroAtividade == "55") {
			$(".group-zoom[data-event='beneficiario']").hide();
			AguardeGestorAprovador("labels");
			mostraEsconde("0", "divCorrecao");
			mostraEsconde("1", "divAprovGestores");
			mostraEsconde("1", "divAprovFiscal");
			mostraEsconde("0", "divAprovContasPagar");
			horaPorSegundo("hrFiscal");
			desabilitaCorpo(numeroAtividade);
			desabilitaSelect();
			alteraRequired(numeroAtividade);
			if(document.getElementById('retencao').value == "1") { alteraLabelRetencao (true); }
			else { alteraLabelRetencao (false); }
			//document.getElementById("retencao").setAttribute("className","col-sm-5 control-label");
			//document.getElementById("retencao").setAttribute("class","col-sm-5 control-label");
			document.getElementById("retencao").readOly = false;
		} 
		// aprovacao ger ctas a pagar - pa
		else if (numeroAtividade == "142") {
			$(".group-zoom[data-event='beneficiario']").hide();
			AguardeGestorAprovador("labels");
			mostraEsconde("0", "divCorrecao");
			mostraEsconde("1", "divAprovGestores");
			mostraEsconde("1", "divAprovFiscal");
			mostraEsconde("1", "divAprovContasPagar");
			horaPorSegundo("hrContasPagar");
			desabilitaCorpo(numeroAtividade);
			desabilitaSelect();
			alteraRequired(numeroAtividade);
			if(document.getElementById('retencao').value == "1") { alteraLabelRetencao (true); }
			else { alteraLabelRetencao (false); } 
		} 
		// validacao e gerar titulo
		else if (numeroAtividade == "5") {
			$(".group-zoom[data-event='beneficiario']").hide();
			AguardeGestorAprovador("labels");
			document.getElementById("gerouManual").value = "2";
			mostraEsconde("0", "divCorrecao");
			mostraEsconde("1", "divAprovGestores");
			if (vpagtoAntecipado == "00"
					&& document.getElementById("hiddenVaiParaAprovPA").value == "Sim") {
				mostraEsconde("1", "divAprovFiscal");
				mostraEsconde("1", "divAprovContasPagar");
			}
			mostraEsconde("1", "divCPGeraTitulo");
			
			if (document.getElementById("statusCPGeraTitulo").value == "1") {
				mostraEsconde("1", "divCPGeraTituloIntegr");
			}
			
			horaPorSegundo("hrCPGeraTitulo");
			desabilitaCorpo(numeroAtividade);
			// solicitacao da Bianca que ficasse habilitado.
			//setReadOnlyField("justificativaItem");
	
			desabilitaSelect();
			alteraRequired(numeroAtividade);
			
			if (document.getElementById("numTitulo").value != "") {
				aguardeValidaTitulo();
				document.getElementById('btGerarTitulo').style.visibility = "hidden";
			}
			if(document.getElementById('retencao').value == "1") { alteraLabelRetencao (true); }
			else { alteraLabelRetencao (false); }
			//document.getElementById("retencao").setAttribute("className","");
			//document.getElementById("retencao").setAttribute("class","");
			document.getElementById("retencao").readOly = false;

			//setData("dataPagamento");
			//setNumero("codBarras", 0, false);
			habilitaCamposGeraTitulo();
			
			if (document.getElementById("hiddenEncontrouGroupSolicPag").value == "Nao"){
				FLUIGC.toast({ title: 'Erro:', message: "Prezado participante: Voce nao possui permissao a pasta de comprovantes deste fluxo, na pasta da area, e nao esta relacionado ao grupo SOLICPAGTO. Favor solicitar junto a ao atendimento Fluig (via Chamado ou telefone suporte), para que você possa finalizar esta solicitacao e gravar os dados de anexos e ficha na pasta da area. Obrigada", type: 'warning' });
			}

		} 
	
		else if (numeroAtividade == "6") {
	
			////console.log ("ENTROU ATIVIDADE 6 - CORRIGIR");
			// o hiddenRetornouRevisaoPRI nao pode zerar, mas este deve zerar senao da problema ao enviar - vai cair sempre em revisao
			document.getElementById("hiddenRetornouRevisao").value = "";
			
			formpagamento.getdepartamento($('#matriculabeneficiario').val());
			
			//guardando observacoes
			document.getElementById('obsIncons').value = "Situações a serem corrigidas:";
			
			mostraEsconde("1", "divCorrecao");
		
			////console.log ("ENTROU ATIVIDADE 6 - ANTES DESABILITACORPO");
			desabilitaCorpo(numeroAtividade);
			desabilitaSelect();
			//setData("dataPagamento");
			if(document.getElementById('retencao').value == "1") { alteraLabelRetencao (true); }
			else { alteraLabelRetencao (false); }
	
			//guardando observacoes
			document.getElementById('obsIncons').value = "Situações a serem corrigidas:";
			var tabela = document.getElementById("tbAprovacoes");
			if (tabela && tabela.rows.length > 2) {
			
				/* logica antiga
				for (var i=2;i<tabela.rows.length;i++) {
					var row  = tabela.rows[i];
					var linhaS = row.getElementsByTagName("select");
					var linhaT = row.getElementsByTagName("textarea");
					
					var select = linhaS[0];
			    	if(select.value == "3"){
			    		var text = linhaT[0];
			    		document.getElementById('obsIncons').value = document.getElementById('obsIncons').value + " - " + text.value;
			    	}
				} // for
				*/
				
				// logica nova - quando campo selecfica desabilitado vira span, nao funciona a logica acima
				for (var i=2;i<tabela.rows.length;i++) {
					var row  = tabela.rows[i];
					var linhaT = row.getElementsByTagName("textarea");
					numLinha = linhaT[0].name;
					numLinha = numLinha.replace("_idObsAprov___","");
					var text = linhaT[0];
		    		document.getElementById('obsIncons').value = "\n" + document.getElementById('obsIncons').value + " - " + text.value;
		    	} // for
				
			}
			
			if (document.getElementById("observacoesFiscalAprovacao").value != "") {
				document.getElementById('obsIncons').value = document.getElementById('obsIncons').value + " - Observacoes Fiscal: " +
															 document.getElementById('observacoesFiscalAprovacao').value
			}
			if (document.getElementById("observacoesContasPagarAprovac").value != "") {
				document.getElementById('obsIncons').value = document.getElementById('obsIncons').value + " - Observacoes CPagar-Aprovacao: " +
															 document.getElementById('observacoesContasPagarAprovac').value
			}			
			if (document.getElementById("observacoesCPGeraTituloAprovac").value != "") {
				document.getElementById('obsIncons').value = document.getElementById('obsIncons').value + " - Observacoes CPagar-Titulos: " +
															 document.getElementById('observacoesCPGeraTituloAprovac').value
			}
			
			limpezatabelaAprovadores();
			calcValorPagar("");
			
		} // ativ 6
		
		if (mode == "VIEW") {
			console.log ("VIEW");
			
			$(".no-view").hide();

			if ($("#hiddenFiscalPassou").val() != "") { mostraEsconde("1","divAprovFiscal"); }
			else { mostraEsconde("0","divAprovFiscal"); }
				
			if ($("#hiddenContasPagarPassou").val() != "") { mostraEsconde("1","divAprovContasPagar"); }
			else { mostraEsconde("0","divAprovContasPagar"); }
			
			var status = ($('#statusCPGeraTitulo').text()).toUpperCase();
			//console.log ("$('#statusCPGeraTitulo').text()).toUpperCase(): " + $('#statusCPGeraTitulo').text()).toUpperCase());
			// status != Selecione
			if (status.substring(0,2) != "SE") { mostraEsconde("1","divCPGeraTitulo"); mostraEsconde("1", "divCPGeraTituloIntegr"); }
			else { mostraEsconde("0","divCPGeraTitulo"); mostraEsconde("0","divCPGeraTituloIntegr");  }
			
					
			if (document.getElementById("hiddenValidaTitulo").value == "OK") {
				document.getElementById("imgValidacaoOk").style.visibility = "visible";
				document.getElementById("imgValidacaoNok").style.visibility = "hidden";
			} else if (document.getElementById("hiddenValidaTitulo").value == "NOK") {
				document.getElementById("imgValidacaoNok").style.visibility = "visible";
				document.getElementById("imgValidacaoOk").style.visibility = "hidden";
			} else if (document.getElementById("hiddenValidaTitulo").value == "") {
				document.getElementById("imgValidacaoOk").style.visibility = "hidden";
				document.getElementById("imgValidacaoNok").style.visibility = "hidden";
			}
			
			vGerouManual = ($('#gerouManual').text()).toUpperCase();
			document.getElementById("imgValidacaoOk").style.visibility = "hidden";
			document.getElementById("imgValidacaoNok").style.visibility = "hidden";
	
			//console.log ("$('#gerouManual').text()).toUpperCase(): " + $('#gerouManual').text()).toUpperCase());
			
			if (vGerouManual == "SIM") { // esta gravado  em caps acima
				mostraCampos(false);
			} 
			else {
				mostraCampos(true);
			}
			
			desabilitaCorpo("0");
			desabilitaBotoes();
			desabilitaSelect();
			alteraRequired(numeroAtividade);
			if(document.getElementById('retencao').value == "1") { alteraLabelRetencao (true); }
			else { alteraLabelRetencao (false); } 
	
		} 
	
		tdifunctions.setMoeda("valorBruto", 2, false);
		tdifunctions.setMoeda("acrescimo", 2, false);
		tdifunctions.setMoeda("decrescimo", 2, false);
		tdifunctions.setMoeda("valorMulta", 2, false);
		tdifunctions.setMoeda("valorJuros", 2, false);
		tdifunctions.setMoeda("valorCMon", 2, false);
		tdifunctions.setMoeda("valorTaxas", 2, false);
		tdifunctions.setMoeda("valorPagar", 2, false);
	
		desabilitaSelectAprovac();
	
} // fim function


function alteraRequired(pnumeroAtividade) {

	document.getElementById("labeldepart").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelAreaSolic").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelEmpPag").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelCnpjEmpPag").setAttribute("class", "col-sm-3 control-label");
	//document.getElementById("labelDest").setAttribute("class", "col-sm-3 control-label");
	//document.getElementById("labelCpfDest").setAttribute("class", "col-sm-3 control-label");
	//document.getElementById("labelCcustoDest").setAttribute("class", "col-sm-3 control-label");
	//document.getElementById("labelItemDest").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelidEmpresa").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labeltipoFornec").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelcpfCnpjFornec").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelformaPagto").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelBanco").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelAgencia").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelCC").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labeldataPagto").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labeldescricaoItem").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelmesReferencia").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labeljustificativaItem").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelvalorBruto").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelAcrescimo").setAttribute("class", "col-sm-3 control-label");
	document.getElementById("labelDecrescimo").setAttribute("class", "col-sm-3 control-label");

	if (pnumeroAtividade == "155") {
		//document.getElementById("labelSitGestores").setAttribute("class","col-sm-3 control-label required");
	}
	if (pnumeroAtividade == "55") {
		document.getElementById("labelRetencao").setAttribute("class","col-sm-3 control-label required");
	}
	if (pnumeroAtividade == "142") {
		document.getElementById("labelRetencao").setAttribute("class", "col-sm-3 control-label");
	}
	if (pnumeroAtividade == "5") {
		document.getElementById("labelNatureza").setAttribute("class","col-sm-3 control-label required");
		document.getElementById("labelRetencao").setAttribute("class", "col-sm-3 control-label");
		document.getElementById("labelSitCPGeraTitulo").setAttribute("class","col-sm-3 control-label required");
		document.getElementById("labelRetencao").setAttribute("class","col-sm-3 control-label required");
	}
	if (pnumeroAtividade == "6") {
		document.getElementById("labelSitCPGeraTitulo").setAttribute("class", "col-sm-3 control-label");
	}

} // fim funtion


function desabilitaSelect() {

	var numeroAtividade = document.getElementById("numAtiv").value;
	
	var entiredoc = document.documentElement;
	var elements = entiredoc.getElementsByTagName("*");

	for ( var i = 0; i < elements.length; i++) {
		if (elements[i].tagName.toUpperCase() == "SELECT") {

			if (elements[i].id == "areaSolic"
				|| elements[i].id == "tipoFornec"
				|| (elements[i].id == "formaPagto" && numeroAtividade != "6")
				|| elements[i].id == "descricaoItem"
				|| elements[i].id == "mesReferencia"
				|| elements[i].id == "anoReferencia") {

				elements[i].addEventListener('onclick',travarCampoSelect(elements[i]), true);
				elements[i].readOnly = true;
				//elements[i].setAttribute("className", "readonly");
				//elements[i].setAttribute("class", "readonly");
			}
			if (numeroAtividade == "155" || numeroAtividade == "142"){
				if (elements[i].id == "retencao") {
					elements[i].addEventListener('onclick',
							travarCampoSelect(elements[i]), true);
					elements[i].readOnly = true;
					//elements[i].setAttribute("className", "readonly");
					//elements[i].setAttribute("class", "readonly");
				}
			}
		}
	}
} // fim function


function desabilitaSelectAprovac() {

	var numeroAtividade = document.getElementById("numAtiv").value;
	
	if (numeroAtividade != "55") {	
		document.getElementById("observacoesFiscalAprovacao").readOnly = true;
	}
	if (numeroAtividade != "142") {		
		document.getElementById("observacoesContasPagarAprovac").readOnly = true;
	}
	if ( numeroAtividade != "5" && document.getElementById("statusCPGeraTitulo").value != "x") {

		document.getElementById("statusCPGeraTitulo").addEventListener('onclick',travarCampoSelect(document.getElementById("statusCPGeraTitulo")), true);
		//document.getElementById("statusCPGeraTitulo").setAttribute("className","readonly");
		//document.getElementById("statusCPGeraTitulo").setAttribute("class","readonly");
		document.getElementById("statusCPGeraTitulo").readOnly = true;
		document.getElementById("observacoesCPGeraTituloAprovac").readOnly = true;
		//document.getElementById("observacoesCPGeraTituloAprovac").setAttribute("className", "readonly");
		//document.getElementById("observacoesCPGeraTituloAprovac").setAttribute("class", "readonly");
	}
}


function mostraEsconde(pTipo, pNomeObj) {

	if (pNomeObj == "divCorrecao") {
		document.getElementById("labelAvisoAlteracaoSolicCorrecao").style.visibility = "hidden";
		if (pTipo == "0") {
			document.getElementById("divCorrecao").style.display = "none";
		} else if (pTipo == "1") {
			document.getElementById("divCorrecao").style.display = "inline";
			if (document.getElementById("hiddenSolicCorrecaoAlterouVal").value == "Sim") {
				document.getElementById("labelAvisoAlteracaoSolicCorrecao").style.visibility = "visible";
			}

		}
	} else if (pNomeObj == "divAprovGestores") {
		if (pTipo == "0") {
			document.getElementById("divAprovGestores").style.display = "none";
		} else if (pTipo == "1") {
			document.getElementById("divAprovGestores").style.display = "inline";
			if (document.getElementById("hiddenGestorAlterouValor").value == "Sim") {
			}
		}
	} else if (pNomeObj == "divAprovFiscal") {
		document.getElementById("labelAvisoAlteracaoFiscal").style.visibility = "hidden";
		if (pTipo == "0") {
			document.getElementById("divAprovFiscal").style.display = "none";
			document.getElementById("labelRetencao").style.visibility = "hidden";
		} else if (pTipo == "1") {
			document.getElementById("divAprovFiscal").style.display = "inline";
			document.getElementById("labelRetencao").style.visibility = "visible";
			if (document.getElementById("hiddenFiscalAlterouValor").value == "Sim") {
				document.getElementById("labelAvisoAlteracaoFiscal").style.visibility = "visible";
			}
		}
	} else if (pNomeObj == "divAprovContasPagar") {
		document.getElementById("labelRetencao").style.visibility = "hidden";
		document.getElementById("labelAvisoAlteracaoContasPagar").style.visibility = "hidden";
		if (pTipo == "0") {
			document.getElementById("divAprovContasPagar").style.display = "none";
		} else if (pTipo == "1") {
			document.getElementById("divAprovContasPagar").style.display = "inline";
			if (document.getElementById("hiddenContasPagarAlterouValor").value == "Sim") {
				document.getElementById("labelAvisoAlteracaoContasPagar").style.visibility = "visible";
			}
		}
	} else if (pNomeObj == "divCPGeraTitulo") {
		document.getElementById("labelRetencao").style.visibility = "hidden";
		document.getElementById("labelAvisoAlteracaoCPGeraTitulo").style.visibility = "hidden";
		if (pTipo == "0") {
			document.getElementById("divCPGeraTitulo").style.display = "none";
		} else if (pTipo == "1") {
			document.getElementById("divCPGeraTitulo").style.display = "inline";
			if (document.getElementById("hiddenCPGeraTituloAlterouValor").value == "Sim") {
				document.getElementById("labelAvisoAlteracaoCPGeraTitulo").style.visibility = "visible";
			}
		}
	} else if (pNomeObj == "divCPGeraTituloIntegr") {
		if (pTipo == "0") {
			document.getElementById("divCPGeraTituloIntegr").style.display = "none";
		} else if (pTipo == "1") {
			document.getElementById("divCPGeraTituloIntegr").style.display = "inline";
		}
	}
} // fim function


function mascaraCnpjCpf() {
	if (document.getElementById("tipoFornec").value == "1") {
		tdifunctions.setCpf("cpfCnpjFornec");
	} else if (document.getElementById("tipoFornec").value == "2") {
		tdifunctions.setCnpj("cpfCnpjFornec");
	}
} // fim function


function desabilitaCampoFomaPagto(campo) {

	if (campo.value == "2") {
		document.getElementById("IdBanco").value = document.getElementById("hiddenCodBanco").value;
		//document.getElementById("nmBanco").value = document.getElementById("hiddenNmBanco").value;
		document.getElementById("IdAg").value = document.getElementById("hiddenCodAgencia").value;
		document.getElementById("conta").value = document.getElementById("hiddenContaC").value;
		document.getElementById("Inform").value = "";
	}
	else{
		document.getElementById("IdBanco").value = "";
		//document.getElementById("nmBanco").value = "";
		document.getElementById("IdAg").value = "";
		document.getElementById("conta").value = "";
	}
		
} // fim function


function messagePagtoAntecipado(obj) {
	var index = obj.selectedIndex;
	document.getElementById("hiddenDescItem").value = obj.options[index].text;
	if (document.getElementById("descricaoItem").value == "00") {
		FLUIGC.toast({ title: 'Atencao:', message: "Pagamento Antecipado: Quando o documento fiscal for recebido, voce devera entregar para equipe de GESTAO DE CONTRATOS com a informacao de que se trata de um Pagamento Antecipado para a regularizacao do processo. Fique atento, pois o prazo para regularizacao, ou seja, a entrada da Nota Fiscal devera ser DENTRO DO MES DA ANTECIPACAO.", type: 'warning' });
	}
} // fim function


function messageDadosBancarios() {
	if (document.getElementById("formaPagto").value == "1") {
		FLUIGC.toast({ title: 'Atencao:', message: "Favor anexar o boleto bancario atraves da aba anexos. Para pagamento via boleto bancario, o cedente deve ser o mesmo que o fornecedor!", type: 'warning' });
	} else if (document.getElementById("formaPagto").value == "2") {
		FLUIGC.toast({ title: 'Atencao:', message: "Pagamento via credito em conta corrente, Doc ou Ted, os dados bancarios devem ser do CPF/CNPJ do fornecedor!", type: 'warning' });
	}
} // fim function


function desabilitaCorpo(pnumAtiv) {
	
	$(".group-zoom").hide();
	
	console.log($(".group-zoom[data-event='natureza']").length)
	
	if (pnumAtiv == "6") {
		$(".group-zoom[data-event='empresa']").show();
		$(".group-zoom[data-event='cnpj']").show();
	}
	if (pnumAtiv == "5") {
		$(".group-zoom[data-event='natureza']").show();
		document.getElementById('idBtLimpar').disabled = false;
	}

	
} // fim function


function desabilitaBotoes() {

	document.getElementById('idBtLimpar').disabled = true;
	document.getElementById('btValidarTitulo').disabled = true;
	document.getElementById('btGerarTitulo').disabled = true;
}


function travarCampoSelect(obj) {
	var index = obj.selectedIndex;
	obj.onkeypress = function() {
		obj.options[index].selected = true;
		return false;
	};
	obj.onclick = function() {
		obj.options[index].selected = true;
		return false;
	};
	obj.onchange = function() {
		obj.options[index].selected = true;
		return false;
	};
	obj.onkeyup = function() {
		obj.options[index].selected = true;
		return false;
	};
	return true;
} // fim function


function habilitaDivCPGeraTituloIntegr() {
	var statusCP = document.getElementById("statusCPGeraTitulo").value;

	if (statusCP == "1") {
		mostraEsconde("1", "divCPGeraTituloIntegr");
	} else {
		mostraEsconde("0", "divCPGeraTituloIntegr");
	}
} // fim function

function habilitaCamposGeraTitulo() {
	
	var vGerouManual = document.getElementById("gerouManual").value;
	document.getElementById("imgValidacaoOk").style.visibility = "hidden";
	document.getElementById("imgValidacaoNok").style.visibility = "hidden";

	if (vGerouManual == "1") {
		mostraCampos(false);
	} 
	else if (vGerouManual == "2") {
		mostraCampos(true);
	}
	
} // fim function


function mostraCampos(lOpcao){
	
	////console.log("opcao: " + lOpcao);
	
	document.getElementById("labelPortador").setAttribute("class","col-sm-3 control-label");
	document.getElementById('labelPortador').style.visibility = "hidden";

	document.getElementById("codPortador").readOnly = true;
	//document.getElementById("codPortador").setAttribute("className", "readOnly");
	//document.getElementById("codPortador").setAttribute("class", "readOnly");
	document.getElementById("codPortador").value = "";
	document.getElementById('codPortador').style.visibility = "hidden";
	
	document.getElementById("labelCodBarras").setAttribute("class","col-sm-3 control-label");
	document.getElementById('labelCodBarras').style.visibility = "hidden";

	document.getElementById("codBarras").readOnly = true;
	//document.getElementById("codBarras").setAttribute("className", "readOnly");
	//document.getElementById("codBarras").setAttribute("class", "readOnly");
	document.getElementById("codBarras").value = "";
	document.getElementById('codBarras').style.visibility = "hidden";
	
	if (lOpcao == false) {
			
		/* CONFORME DEFINICAO DA BIANCA - CST - NAO DEVE SER SOLICITADO PREFIXO E TITULO NO GERA MANUAL = 1 = SIM.
		 * A SOLICITACAO FICARAO SEM A INFORMAÇÃO DE TITULO SE FOR MANUAL
		document.getElementById("numTitulo").readOnly = false;
		document.getElementById("numTitulo").setAttribute("className", "");
		document.getElementById("numTitulo").setAttribute("class", "");
		document.getElementById("numTitulo").setAttribute("class", "");
		document.getElementById("retornoConsultaTit").value = "";

		document.getElementById("retornoIntegracao").style.visibility = "hidden";
		document.getElementById('btGerarTitulo').style.visibility = "hidden";
		*/
		
		document.getElementById("labelTitulo").setAttribute("class","col-sm-3 control-label required");
		document.getElementById('labelTitulo').style.visibility = "hidden";
		
		document.getElementById("numTitulo").readOnly = true;
		//document.getElementById("numTitulo").setAttribute("className", "readOnly");
		//document.getElementById("numTitulo").setAttribute("class", "readOnly");
		document.getElementById("numTitulo").value = "";
		document.getElementById('numTitulo').style.visibility = "hidden";
		
		document.getElementById("labelCodPrefixo").setAttribute("class","col-sm-3 control-label");
		document.getElementById('labelCodPrefixo').style.visibility = "hidden";
		
		document.getElementById("codPrefixo").readOnly = true;
		//document.getElementById("codPrefixo").setAttribute("className", "readOnly");
	//	document.getElementById("codPrefixo").setAttribute("class", "readOnly");
		document.getElementById("codPrefixo").value = "";
		document.getElementById('codPrefixo').style.visibility = "hidden";

		document.getElementById("labelPortador").setAttribute("class","col-sm-3 control-label");
		document.getElementById('labelPortador').style.visibility = "hidden";

		document.getElementById("codPortador").readOnly = true;
		//document.getElementById("codPortador").setAttribute("className", "readOnly");
		//document.getElementById("codPortador").setAttribute("class", "readOnly");
		document.getElementById("codPortador").value = "";
		document.getElementById('codPortador').style.visibility = "hidden";
		
		document.getElementById("labelCodBarras").setAttribute("class","col-sm-3 control-label");
		document.getElementById('labelCodBarras').style.visibility = "hidden";

		document.getElementById("codBarras").readOnly = true;
		//document.getElementById("codBarras").setAttribute("className", "readOnly");
		//document.getElementById("codBarras").setAttribute("class", "readOnly");
		document.getElementById("codBarras").value = "";
		document.getElementById('codBarras').style.visibility = "hidden";
		
		document.getElementById("retornoConsultaTit").value = "";
		document.getElementById("retornoConsultaTit").style.visibility = "hidden";
		
		document.getElementById("retornoIntegracao").value = "";
		document.getElementById("retornoIntegracao").style.visibility = "hidden";
		
		document.getElementById('btGerarTitulo').style.visibility = "hidden";
		document.getElementById('btValidarTitulo').style.visibility = "hidden";
		document.getElementById('idBtLimpar').style.visibility = "hidden";
		
	} 
	else if (lOpcao == true) {
		
		document.getElementById("labelTitulo").setAttribute("class","col-sm-3 control-label");
		document.getElementById('labelTitulo').style.visibility = "visible";
		
		document.getElementById("numTitulo").readOnly = true;
		//document.getElementById("numTitulo").setAttribute("className","readonly");
		//document.getElementById("numTitulo").setAttribute("class", "readonly");
		document.getElementById("numTitulo").value = "";
		document.getElementById('numTitulo').style.visibility = "visible";
		
		document.getElementById("labelCodPrefixo").setAttribute("class","col-sm-3 control-label required");
		document.getElementById('labelCodPrefixo').style.visibility = "visible";

		document.getElementById("codPrefixo").readOnly = false;
		document.getElementById("codPrefixo").setAttribute("className", "");
		document.getElementById("codPrefixo").setAttribute("class", "");
		document.getElementById("codPrefixo").value = "";
		document.getElementById('codPrefixo').style.visibility = "visible";

		////console.log ("function mostracampos: " + document.getElementById("descricaoItem").value+
		//		" - " + document.getElementById("formaPagto").value);
		
		if (document.getElementById("descricaoItem").value == "00"){
		
			document.getElementById("labelPortador").setAttribute("class"," col-sm-3 control-label required");
			document.getElementById('labelPortador').style.visibility = "visible";
	
			document.getElementById("codPortador").readOnly = false;
		//	document.getElementById("codPortador").setAttribute("className", "");
		//	document.getElementById("codPortador").setAttribute("class", "");
			document.getElementById("codPortador").value = "";
			document.getElementById('codPortador').style.visibility = "visible";
			
			if (document.getElementById("formaPagto").value == "1") {
				document.getElementById("labelCodBarras").setAttribute("class","col-sm-3 control-label required");
				document.getElementById('labelCodBarras').style.visibility = "visible";
		
				document.getElementById("codBarras").readOnly = false;
				//document.getElementById("codBarras").setAttribute("className", "");
			///	document.getElementById("codBarras").setAttribute("class", "");
				document.getElementById("codBarras").value = "";
				document.getElementById('codBarras').style.visibility = "visible";
			}
		}
		
		document.getElementById("retornoConsultaTit").value = "";
		document.getElementById("retornoConsultaTit").style.visibility = "visible";
		
		document.getElementById("retornoIntegracao").value = "";
		document.getElementById("retornoIntegracao").style.visibility = "visible";
		
		document.getElementById('btGerarTitulo').style.visibility = "visible";
		document.getElementById('btValidarTitulo').style.visibility = "visible";
		document.getElementById('idBtLimpar').style.visibility = "visible";

	}

} // fim function


function horaPorSegundo(nomeCampo) {

	var dt = new Date();

	var hrs = dt.getHours();
	var min = dt.getMinutes();
	var sec = dt.getSeconds();

	var Tm = " " + ((hrs < 10) ? "0" : "") + hrs + ":";
	Tm += ((min < 10) ? "0" : "") + min + ":";
	Tm += ((sec < 10) ? "0" : "") + sec + " ";

	if (nomeCampo == "hrFiscal") {
		document.getElementById("hrFiscal").value = Tm;
		setTimeout("horaPorSegundo('hrFiscal')", 1000);
	}
	if (nomeCampo == "hrContasPagar") {
		document.getElementById("hrContasPagar").value = Tm;
		setTimeout("horaPorSegundo('hrContasPagar')", 1000);
	}
	if (nomeCampo == "hrCPGeraTitulo") {
		document.getElementById("hrCPGeraTitulo").value = Tm;
		setTimeout("horaPorSegundo('hrCPGeraTitulo')", 1000);
	}
	if(nomeCampo.substring(0,11) ==  "idHoraAprov") {
		var campo = 'idHoraAprov___' + document.getElementById('hiddenNumeroDaVez').value;
		document.getElementById(campo).value = Tm;
		setTimeout("horaPorSegundo('" + campo + "')", 1000);
	}

} // fim function


function zoomEmpresa() {
	zoom = "empresapag";

	limpezaDadosFornec();
	limpezaDadosBanco();

	//var x = new Array();
	// campos recebidos pelo fields no dataset
	//x.push(""); // nao pode enviar nada de valor neste zoom senao vai filtrar
	//x.push("CA_CNPJ");

	// retorno conforme a ordem dos campos na tela
	//openZoom(
		//	'dsUnidadesTOTVSProtheus','CC_CNPJ,CC_CODIGO,CC_NMEMPR,CC_FILIAL,CC_NMFIL',
		//	'CNPJ,Cod Emp,Nome Emp,Cod Filial,Nome Filial','','0,1,2,3,4','cnpjEmpresa,hiddenCodEmp,razaoSocial,hiddenCodFilial,hiddenNmFilial',x, 500, 350);

	tdizoom.open("ds_unidades_totvs_protheus", "CC_CNPJ,CNPJ,CC_CODIGO,Cod Emp,CC_NMEMPR,Nome Emp,CC_FILIAL,Cod Filial,CC_NMFIL,Nome Filial", "CC_CNPJ,CC_CODIGO,CC_NMEMPR,CC_FILIAL,CC_NMFIL", "Zoom de Unidade", "", "empresapag");
	
} // fim function


function limpaDadosFornec () {
	
	//document.getElementById("idEmpresa").setAttribute("className","");
	//document.getElementById("idEmpresa").setAttribute("class","");
	document.getElementById("idEmpresa").value = "";
	
	document.getElementById("nomeEmpresa").readOnly = false;
	
	//document.getElementById("nomeEmpresa").setAttribute("className","");
	//document.getElementById("nomeEmpresa").setAttribute("class","");
	document.getElementById("nomeEmpresa").value = "Digite nome do Fornecedor/Participante (aceita parcial)";
	//document.getElementById("cpfCnpjFornec").setAttribute("className","");
	//document.getElementById("cpfCnpjFornec").setAttribute("class","");
	document.getElementById("cpfCnpjFornec").value = "";
	document.getElementById("IdBtZoom3").style.visibility = "visible";
	document.getElementById("IdBtZoom4").style.visibility = "visible";
	document.getElementById("idBtLimpar1").style.visibility = "visible";
	document.getElementById("idBtLimpar2").style.visibility = "visible";
}

function zoomFornecedor() {
	zoom = "fornecedor";

	document.getElementById("cpfCnpjFornec").readOnly = true;
	
	document.getElementById("IdBtZoom4").style.visibility = "hidden";
	document.getElementById("idBtLimpar2").style.visibility = "hidden";
	document.getElementById("IdBtZoom3").style.visibility = "visible";
	document.getElementById("idBtLimpar1").style.visibility = "visible";
	
	document.getElementById("formaPagto").value = "x";
	desabilitaCampoFomaPagto(document.getElementById("formaPagto"));

	limpezaDadosBanco();

	if ($("#hiddenCodEmp").val() == ""){
		FLUIGC.toast({ title: 'Erro:', message: "Escolha primeiramente a Empresa Pagadora", type: 'danger' });
		limpaDadosFornec();
		return false;
	} 
	if ($("#nomeEmpresa").val() == "") {
		FLUIGC.toast({ title: 'Erro:', message: "Informe o Nome do Fornecedor (completo ou parcial)!", type: 'danger' });
		limpaDadosFornec();
		return false;
	}
	var c = "C_EMPRESA," + $("#hiddenCodEmp").val() + ",C_FILIAL," + $("#hiddenCodFilial").val() + ",CB_NOME," + $("#nomeEmpresa").val();
	tdizoom.open("ds_fornecedor_protheus", "CB_CODIGO,Codigo,CB_NOME,Razao Social,CB_CNPJ,CNPJ,CB_CODBANC,Banco,CB_AGENCIA,Agencia,CB_NUMCONT,Conta,CB_TIPO,Tipo,CB_LOJA,Loja", "CB_CODIGO,CB_NOME,CB_CNPJ,CB_CODBANC,CB_AGENCIA,CB_NUMCONT,CB_LOJA,CB_PAIS", "Zoom de Fornecedor", c, "fornecedor");
} // fim function



function zoomFornecedorCPNJ() {
	zoom = "fornecedorCNPJ";

	document.getElementById("idEmpresa").readOnly = true;
	document.getElementById("idEmpresa").value = "";
	document.getElementById("nomeEmpresa").readOnly = true;
	document.getElementById("nomeEmpresa").value = "";
	
	document.getElementById("IdBtZoom4").style.visibility = "visible";
	document.getElementById("idBtLimpar2").style.visibility = "visible";
	document.getElementById("IdBtZoom3").style.visibility = "hidden";
	document.getElementById("idBtLimpar1").style.visibility = "hidden";
	
	document.getElementById("formaPagto").value = "x";
	desabilitaCampoFomaPagto(document.getElementById("formaPagto"));

	limpezaDadosBanco();

	if (document.getElementById("hiddenCodEmp").value == "") {
		FLUIGC.toast({ title: 'Erro:', message: "Escolha primeiramente a Empresa Pagadora", type: 'danger' });
		limpaDadosFornec();
		return false;
	}
	
	var cCnpj  = ""
		cCnpj = $("#cpfCnpjFornec").unmask(); 
	    cCnpj = cCnpj.replace("-", "");

    var c = "C_EMPRESA," + $("#hiddenCodEmp").val() + ",C_FILIAL," + $("#hiddenCodFilial").val() + ",CNPJ," + cCnpj;
	tdizoom.open("ds_fornecedor_protheus", "CB_CODIGO,Codigo,CB_NOME,Razao Social,CB_CNPJ,CNPJ,CB_CODBANC,Banco,CB_AGENCIA,Agencia,CB_NUMCONT,Conta,CB_TIPO,Tipo,CB_LOJA,Loja", "CB_CODIGO,CB_NOME,CB_CNPJ,CB_CODBANC,CB_AGENCIA,CB_NUMCONT,CB_LOJA,CB_PAIS", "Zoom de Fornecedor", c, "fornecedorCNPJ");

} // fim function


function zoomNatureza() {
	zoom = "natureza";

	//var x = new Array();
	// campos recebidos pelo fields no dataset
	//x.push(""); // nao pode enviar nada de valor neste zoom senao vai filtrar
	//x.push("CD_CDNATDE");
	//x.push(""); // nao pode enviar nada de valor neste zoom senao vai filtrar
	//x.push("CD_CDNTATE");

	// retorno conforme a ordem dos campos na tela
	//openZoom('dsNaturezaProtheus', 'CD_CODIGO,CD_DESCR', 'Codigo, Descricao','', '0,1', 'codNatureza,nomeNatureza', x, 500, 350);
	//window.open("/webdesk/zoom.jsp?datasetId=dsNaturezaProtheus&dataFields=CD_CODIGO," + escape("Código")+",CD_DESCR," + escape("Descrição")
	//		+"&resultFields=,CD_CODIGO,,CD_DESCR&type="
	//		+ "natureza&filterValues=","zoom","status , scrollbars=no ,width=600, height=350 , top=0 , left=0");

	if (document.getElementById("hiddenCodEmp").value == "") {
		FLUIGC.toast({ title: 'Erro:', message: "Escolha primeiramente a Empresa Pagadora", type: 'danger' });
		return false;
	}
	
    var c = "C_EMPRESA," + $("#hiddenCodEmp").val() + ",C_FILIAL," + $("#hiddenCodFilial").val();
    tdizoom.open("ds_natureza_protheus", "CD_CODIGO,Codigo,CD_DESCR,Descrição", "CD_CODIGO,CD_DESCR", "Zoom de Natureza", c, "natureza");
} // fim function


function zoomBeneficiario() {
	tdizoom.open("colleague", "colleagueName,Nome,colleagueId,Código,mail,E-mail", "colleagueId,colleagueName,mail", "Zoom de Beneficiario", "", "beneficiario");
}

function zoomCcusto (){
	zoom = "cCusto";
	if (document.getElementById("hiddenCodEmp").value == "") {
		FLUIGC.toast({ title: 'Erro:', message: "Escolha primeiramente a Empresa Pagadora", type: 'danger' });
		document.getElementById("codCentroCusto").value = "";
		document.getElementById("nomeCentroCusto").value = "";
		return false;
	}
	tdizoom.open("ds_centro_custo_protheus", "CG_COD,Código,CG_DESCR,Descrição", "CG_COD,CG_DESCR", "Zoom de Centro Custo", "", "cCusto");
}


function zoomItemContabil (){
	zoom = "itemContabil";
	if (document.getElementById("hiddenCodEmp").value == "" ||
		document.getElementById("codCentroCusto").value == "") {
		FLUIGC.toast({ title: 'Erro:', message: "Escolha primeiramente a Empresa Pagadora e o Centro de Custo", type: 'danger' });
		document.getElementById("codItemContabil").value = "";
		document.getElementById("nomeItemContabil").value = "";
	}
	else{
		var c = "empresa," + $("#hiddenCodEmp").val();
		if ($("#codCentroCusto").val() != "") { c += ",centrocusto," + $("#codCentroCusto").val(); }
		tdizoom.open("ds_item_contabil_protheus", "C_CODITCTB,Código,C_DSCITCTB,Descrição", "C_CODITCTB,C_DSCITCTB", "Zoom de Item", c, "itemContabil");
	}
}



function zoomClasse (){
	zoom = "classe";
	if (document.getElementById("hiddenCodEmp").value == "" ||
		document.getElementById("codCentroCusto").value == "" ||
		document.getElementById("codItemContabil").value == "") {
		FLUIGC.toast({ title: 'Erro:', message: "Escolha primeiramente a Empresa Pagadora, Centro de Custo e Item Contabil", type: 'danger' });
		document.getElementById("codClasse").value = "";
		document.getElementById("nomeClasse").value = "";
	}
	else{ 
		var c = "empresa," + $("#hiddenCodEmp").val() + ",filial," + $("#hiddenCodFilial").val();
		if ($("#codCentroCusto").val() != "") { c += ",centrocusto," + $("#codCentroCusto").val(); }
		if ($("#codItemContabil").val() != "") { c += ",itemcontabil," + $("#codItemContabil").val(); }
		tdizoom.open("ds_classe_protheus", "CL_COD,Código,CL_DESCR,Descrição", "CL_COD,CL_DESCR", "Zoom de Classe", c, "classe");
	}
}


// zoom padrao
function setSelectedZoomItem(selectedItem) {
	var tipo = selectedItem.type;
	
	//if (tipo == "destinatario") {
	//	document.getElementById('IdDest').value = selectedItem.colleagueName;
	//	document.getElementById('hiddenMatrDest').value = selectedItem.colleagueId;
	//	aguardeDestinatario();
	//}else 
	if (tipo == "empresapag") {
		
		document.getElementById('cnpjEmpresa').value = selectedItem.CC_CNPJ;
		document.getElementById('hiddenCodEmp').value = selectedItem.CC_CODIGO;
		//document.getElementById('razaoSocial').value = selectedItem.CC_NMEMPR;
		document.getElementById('razaoSocial').value = selectedItem.CC_NMFIL;
		document.getElementById('hiddenCodFilial').value = selectedItem.CC_FILIAL;
		document.getElementById('hiddenNmFilial').value = selectedItem.CC_NMFIL;
		tdifunctions.setCnpj("cnpjEmpresa");
		AguardeGestorAprovador("aprovador");
		
		console.log('retorno zoom empresa: selectedItem.CC_CODIGO: ' + selectedItem.CC_CODIGO + 'selectedItem.CC_FILIAL: ' + selectedItem.CC_FILIAL);
		

	} else if(tipo == "cCusto"){
		document.getElementById('codCentroCusto').value = selectedItem.CG_COD;
		document.getElementById('nomeCentroCusto').value = selectedItem.CG_DESCR;
		AguardeGestorAprovador("aprovador");
	} else if(tipo == "itemContabil"){
		document.getElementById('codItemContabil').value = selectedItem.C_CODITCTB;
		document.getElementById('nomeItemContabil').value = selectedItem.C_DSCITCTB;
		AguardeGestorAprovador("aprovador");

	} else if(tipo == "classe"){
		document.getElementById('codClasse').value = selectedItem.CL_COD;
		document.getElementById('nomeClasse').value = selectedItem.CL_DESCR;
	} else if((tipo == "fornecedor") || (tipo == "fornecedorCNPJ")){
		
		document.getElementById('idEmpresa').value = selectedItem.CB_CODIGO;
		document.getElementById('nomeEmpresa').value = selectedItem.CB_NOME;
		document.getElementById('cpfCnpjFornec').value = selectedItem.CB_CNPJ;
		document.getElementById('hiddenCodBanco').value = selectedItem.CB_CODBANC;
		document.getElementById('hiddenCodAgencia').value = selectedItem.CB_AGENCIA;
		document.getElementById('hiddenContaC').value = selectedItem.CB_NUMCONT;
		document.getElementById('hiddentipoFornec').value = selectedItem.CB_TIPO;
		document.getElementById('hiddenLojaFornec').value = selectedItem.CB_LOJA;
		
		if (document.getElementById("hiddentipoFornec").value == "F") {
			document.getElementById("tipoFornec").value = "1";
		} else {
			document.getElementById("tipoFornec").value = "2";
		}
		mascaraCnpjCpf();

	} else if(tipo == "natureza"){
		document.getElementById('codNatureza').value = selectedItem.CD_CODIGO;
		document.getElementById('nomeNatureza').value = selectedItem.CD_DESCR;
	} else if (tipo == "beneficiario") {
		$('#matriculabeneficiario').val(selectedItem.colleagueId);
		$('#nomebeneficiario').val(selectedItem.colleagueName);
		$('#emailbeneficiario').val(selectedItem.mail);
		formpagamento.getdepartamento(selectedItem.colleagueId);
	}
} // fim function


function limpaZoom(fields,num){
	var arrayFields = fields.split(',');
	
	for(i = 0; i< arrayFields.length; i++){
		$("#"+arrayFields[i]).val("");
	}
	
	if (num == "1" || num == "6" || num == "7" || num == "8") {
		document.getElementById("hiddenEncontrouFaixaAprovador").value = "Nao";
		document.getElementById("hiddenRefazFaixaAprovador").value = "Sim";
		AguardeGestorAprovador("aprovador");
	}
		
}

function limpezaDadosFornec() {

	document.getElementById("idEmpresa").value = "";
	if (zoom == "empresapag") {
		document.getElementById("nomeEmpresa").value = "Digite nome do Fornecedor/Participante (aceita parcial)";
	}
	document.getElementById("hiddentipoFornec").value = "x";
	document.getElementById("cpfCnpjFornec").value = "";

} // fim function


function limpezaDadosBanco() {

	document.getElementById("hiddenCodBanco").value = "";
	//document.getElementById("hiddenNmBanco").value = "";
	document.getElementById("hiddenCodAgencia").value = "";
	document.getElementById("hiddenContaC").value = "";

	document.getElementById("formaPagto").value = "x";
	document.getElementById("IdBanco").value = "";
	
	document.getElementById("IdAg").value = "";
	document.getElementById("conta").value = "";
} // fim function


function limpaDesc(obj) {
	if ((obj.value).substring(0, 6) == "Digite") {
		obj.value = "";
	}
	document.getElementById("cpfCnpjFornec").value = "";
} // fim function


function limpaCNPJ(obj) {
	document.getElementById("tipoFornec").value = "x";
	document.getElementById("cpfCnpjFornec").value = "";
	document.getElementById("idEmpresa").value = "";
	document.getElementById("nomeEmpresa").value = "";
} // fim function


function verificaDesc(obj) {
	if (obj.id == "nomeEmpresa") {
		if (obj.value == "") {
			limpezaDadosFornec();
		}
	} 
	
	//else if (obj.id == "nmBanco") {
	//	if (obj.value == "") {
	//		limpezaDadosBanco();
	//	}
	//}
} // fim function


function guardaValAnt(obj) {

	if (obj.id == "nomeEmpresa") {
		codFornecAnterior = obj.value;
	}
	
} // fim function


//FUNCAO DE GERAR TITULOS NO PROTHEUS -----------------
// botao gerar titulo
function aguardeGeraTitulo() {
	loading.show();
	setTimeout(habilitaGeraTitulo, 1000);
} // fim function

function habilitaGeraTitulo() {
	
	var solicitacao = document.getElementById("cdSolicitacao").value;
	var lErro = false;

	if (mode == "MOD" && document.getElementById("codNatureza").value == null || document.getElementById("codNatureza").value == "") {
		FLUIGC.toast({ title: 'Erro:', message: "E necessario escolher a Natureza de Operação!", type: 'danger' });
		lErro = true;
	}

	if (mode == "MOD" && document.getElementById("retencao").value == "x"){
		FLUIGC.toast({ title: 'Erro:', message: "E necessario escolher a Retencao!", type: 'danger' });
		lErro = true;
	}
	
	if (lErro == false) {
		if (mode == "MOD" && document.getElementById("codPrefixo").value == null || document.getElementById("codPrefixo").value == "") {
			FLUIGC.toast({ title: 'Erro:', message: "E necessario informar o prefixo!", type: 'danger' });
			lErro = true;
		}
	}

	if (lErro == false) {
		if (mode == "MOD" && document.getElementById("descricaoItem").value == "00") {
			if (mode == "MOD" && document.getElementById("codPortador").value == null || document.getElementById("codPortador").value == "") {
				FLUIGC.toast({ title: 'Erro:', message: "E necessario informar o Portador!", type: 'danger' });
				lErro = true;
			}
		}
	}

	if (lErro == false) {
		if (mode == "MOD" && document.getElementById("descricaoItem").value == "00" && document.getElementById("formaPagto").value == "1") {
			if (mode == "MOD" && document.getElementById("codBarras").value == null || document.getElementById("codBarras").value == "") {
				FLUIGC.toast({ title: 'Erro:', message: "E necessario informar o Codigo de Barras!", type: 'danger' });
				lErro = true;
			}
		}
	}

	if (lErro == false) {
		
		try{
			
			document.getElementById("btGerarTitulo").style.visibility = "hidden";
	
			// ACIONA WEBSERVICE TITULO PARA CRIACAO
			var cdEmpPag = document.getElementById("hiddenCodEmp").value; // empresa pagadora
			var cdFilial = document.getElementById("hiddenCodFilial").value; // empresa pagadora
			var cdPrefixo = document.getElementById("codPrefixo").value;
	
			// definicao Henrique Ghidini <henrique.ghidini@totvspartners.com.br> e Denison
			var cdTipo;
			//Quando for Pagamento Antecipado mandar o tipo PA
			if (document.getElementById("descricaoItem").value == "00") {
				cdTipo = "PA";
			} 
			//Quando for a tag 19 – impostos selecionada, mandar o tipo como TX.
			else if (document.getElementById("descricaoItem").value == "19") {
				cdTipo = "TX";
			}
			//Caso não seja nenhuma das opções acima manda DP.
			else cdTipo = "DP";
	
			var cdNatur = document.getElementById("codNatureza").value;
			var cdFornec = document.getElementById("idEmpresa").value;
			var cdLojaFornec = document.getElementById("hiddenLojaFornec").value;
			
			var dtVenc = document.getElementById("dataPagamento").value; // pega data de inicio da solic - formulario
			
			var dataDem = dtVenc.split("/"); // faz separacao
			var month = dataDem[1]; // recebe mes da dtRegistro
			var day = dataDem[0]; // recebe dia da dtRegistro
			var year = dataDem[2]; // recebe ano da dtRegistro
			var fmonth = 0;
			if (month.length == 1) {
				month = "0" + month;
				fmonth = parseInt(month) - 1;
				month = (fmonth).toString;
			}
			if (day.length == 1) {
				day = "0" + day;
			}
			dtVenc = year + month + day; // esta certo!!!! trata o char la no webservice depois!
	
			var cdvalorBruto = tdifunctions.getFloatValue('valorBruto').toString();
			
			var cdHistorico = document.getElementById("justificativaItem").value;
			var cdCcusto = document.getElementById("codCentroCusto").value;
			var cdItemContab = document.getElementById("codItemContabil").value;
			var cdMoeda = "01"; // fixo real
			
			var cdvalorMulta = tdifunctions.getFloatValue('valorMulta').toString();
			
			var cdvalorJuros = tdifunctions.getFloatValue('valorJuros').toString();
			
			var cdvalorCMon = tdifunctions.getFloatValue('valorCMon').toString();
			
			var cdvalorTaxas = tdifunctions.getFloatValue('valorTaxas').toString();
			
			/*
			var cdvalorIss = document.getElementById("valorIss").value;
			cdvalorIss = cdvalorIss.substring(3, cdvalorIss.length); // esta certo, tem que tirar o R$ !!
			cdvalorIss = cdvalorIss.replace(".", "");
			cdvalorIss = cdvalorIss.replace(",", ".");

			var cdvalorPis = document.getElementById("valorPis").value;
			cdvalorPis = cdvalorPis.substring(3, cdvalorPis.length); // esta certo, tem que tirar o R$ !!
			cdvalorPis = cdvalorPis.replace(".", "");
			cdvalorPis = cdvalorPis.replace(",", ".");

			var cdvalorCofins = document.getElementById("valorCofins").value;
			cdvalorCofins = cdvalorCofins.substring(3, cdvalorCofins.length); // esta certo, tem que tirar o R$ !!
			cdvalorCofins = cdvalorCofins.replace(".", "");
			cdvalorCofins = cdvalorCofins.replace(",", ".");

			var cdvalorIrrf = document.getElementById("valorIrrf").value;
			cdvalorIrrf = cdvalorIrrf.substring(3, cdvalorIrrf.length); // esta certo, tem que tirar o R$ !!
			cdvalorIrrf = cdvalorIrrf.replace(".", "");
			cdvalorIrrf = cdvalorIrrf.replace(",", ".");

			var  cdvalorInss = document.getElementById("valorInss").value;
			cdvalorInss = cdvalorInss.substring(3, cdvalorInss.length); // esta certo, tem que tirar o R$ !!
			cdvalorInss = cdvalorInss.replace(".", "");
			cdvalorInss = cdvalorInss.replace(",", ".");

			var cdvalorCsll = document.getElementById("valorCsll").value;
			cdvalorCsll = cdvalorCsll.substring(3,cdvalorCsll.length); // esta certo, tem que tirar o R$ !!
			cdvalorCsll = cdvalorCsll.replace(".", "");
			cdvalorCsll = cdvalorCsll.replace(",", ".");
			*/
			
			var cdacrescimo = tdifunctions.getFloatValue('acrescimo').toString();
			var cddecrescimo = tdifunctions.getFloatValue('decrescimo').toString();
			
			var codBarras = "";
			if (document.getElementById("descricaoItem").value == "00") {
				codBarras = document.getElementById('codBarras').value;
			}

			var codPortador = document.getElementById('codPortador').value;
			
			var codClasse= document.getElementById("codClasse").value;
			
			////console.log ("portador: " + codPortador );
			var c1 = DatasetFactory.createConstraint("C_EMPRESA", cdEmpPag, cdEmpPag, ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("C_FILIAL", cdFilial, cdFilial, ConstraintType.MUST);
			var c3 = DatasetFactory.createConstraint("CF_PREF", cdPrefixo, cdPrefixo, ConstraintType.MUST);
			var c4 = DatasetFactory.createConstraint("CF_TIPO", cdTipo, cdTipo,	ConstraintType.MUST);
			var c5 = DatasetFactory.createConstraint("CF_NATUR", cdNatur, cdNatur,ConstraintType.MUST);
			var c6 = DatasetFactory.createConstraint("CF_FORN", cdFornec, cdFornec,ConstraintType.MUST);
			var c7 = DatasetFactory.createConstraint("CF_LOJA", cdLojaFornec, cdLojaFornec, ConstraintType.MUST);
			var c8 = DatasetFactory.createConstraint("CF_DTVENC", dtVenc.toString(), dtVenc.toString(),ConstraintType.MUST);
			var c9 = DatasetFactory.createConstraint("CF_VALOR", cdvalorBruto, cdvalorBruto,ConstraintType.MUST);
			var c10 = DatasetFactory.createConstraint("CF_HIST", cdHistorico, cdHistorico, ConstraintType.MUST);
			var c11 = DatasetFactory.createConstraint("CF_CCUSTO", cdCcusto, cdCcusto, ConstraintType.MUST);
			var c12 = DatasetFactory.createConstraint("CF_ITCT", cdItemContab, cdItemContab, ConstraintType.MUST);
			var c13 = DatasetFactory.createConstraint("CF_MOEDA", cdMoeda, cdMoeda,ConstraintType.MUST);
			var c14 = DatasetFactory.createConstraint("CF_BCOADT", "", "", ConstraintType.MUST);
			var c15 = DatasetFactory.createConstraint("CF_AGENADT", "", "", ConstraintType.MUST);
			var c16 = DatasetFactory.createConstraint("CF_CTNADT", "", "", ConstraintType.MUST);
			var c17 = DatasetFactory.createConstraint("CF_MULTA", cdvalorMulta, cdvalorMulta, ConstraintType.MUST);
			var c18 = DatasetFactory.createConstraint("CF_JUROS", cdvalorJuros,cdvalorJuros ,ConstraintType.MUST);
			var c19 = DatasetFactory.createConstraint("CF_CORRMON",cdvalorCMon , cdvalorCMon, ConstraintType.MUST);
			var c20 = DatasetFactory.createConstraint("CF_TAXAS",cdvalorTaxas ,cdvalorTaxas , ConstraintType.MUST);
			
			//definido pela Bianca que o numero do titulo é prefixo + numero da solicitação
			var c21 = DatasetFactory.createConstraint("CF_NUMTIT",solicitacao ,solicitacao, ConstraintType.MUST);
			//nao é para solic pagamento e sim é para pagto internacional
			var c22 = DatasetFactory.createConstraint("CF_TPTIT","NAO","NAO", ConstraintType.MUST);

			/*
			var c23 ;
			var c24 ;
			var c25 ;
			var c26 ;
			var c27 ;
			var c28 ;
			
			if (document.getElementById("retencao").value == "1"){
				c23 = DatasetFactory.createConstraint("CF_ISS",cdvalorIss,cdvalorIss, ConstraintType.MUST);
				c24 = DatasetFactory.createConstraint("CF_PIS",cdvalorPis,cdvalorPis, ConstraintType.MUST);
				c25 = DatasetFactory.createConstraint("CF_COFINS",cdvalorCofins,cdvalorCofins, ConstraintType.MUST);
				c26 = DatasetFactory.createConstraint("CF_IRRF",cdvalorIrrf,cdvalorIrrf, ConstraintType.MUST);
				c27 = DatasetFactory.createConstraint("CF_INSS",cdvalorInss,cdvalorInss, ConstraintType.MUST);
				c28 = DatasetFactory.createConstraint("CF_CSLL",cdvalorCsll,cdvalorCsll, ConstraintType.MUST);
			}
			else if (document.getElementById("retencao").value == "2"){
				c23 = DatasetFactory.createConstraint("CF_ISS","0","0", ConstraintType.MUST);
				c24 = DatasetFactory.createConstraint("CF_PIS","0","0", ConstraintType.MUST);
				c25 = DatasetFactory.createConstraint("CF_COFINS","0","0", ConstraintType.MUST);
				c26 = DatasetFactory.createConstraint("CF_IRRF","0","0", ConstraintType.MUST);
				c27 = DatasetFactory.createConstraint("CF_INSS","0","0", ConstraintType.MUST);
				c28 = DatasetFactory.createConstraint("CF_CSLL","0","0", ConstraintType.MUST);
			}
			*/
			
			
			
			//var constraints1 = new Array(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10,c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25, c26, c27, c28);
			var c29 ;
			if (document.getElementById("retencao").value == "1") {
				c29 = DatasetFactory.createConstraint("CF_RETIMP","SIM","SIM", ConstraintType.MUST);
			}
			else{
				c29 = DatasetFactory.createConstraint("CF_RETIMP","NAO","NAO", ConstraintType.MUST);
			}
			
			var c30 = DatasetFactory.createConstraint("CF_ACRESC",cdacrescimo,cdacrescimo, ConstraintType.MUST);

			var c31 = DatasetFactory.createConstraint("CF_DECRESC",cddecrescimo,cddecrescimo, ConstraintType.MUST);
			
			var c32 = DatasetFactory.createConstraint("CF_CODBAR",codBarras,codBarras, ConstraintType.MUST);
			
			var c33 = DatasetFactory.createConstraint("CF_PORTADO",codPortador,codPortador, ConstraintType.MUST);
			
			var c34 = DatasetFactory.createConstraint("CF_CLVL",codClasse,codClasse, ConstraintType.MUST);
			
			var constraints1 = new Array(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10,c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c29,c30,c31,c32,c33,c34);
			var dsCriaTituloProtheus = DatasetFactory.getDataset("dsCriaTituloProtheus", null, constraints1, null);
			
		}
		catch(error) {
			lErro = true;
			document.getElementById("retornoIntegracao").value = "Titulo Nao gerado: " + error.message ;
		}
		
		var property;
		var record;
		var cfMenret = "";
		var cfNumTit = "";
		var cfInss = "";
		var cfIrrf = "";
		var cfCsll = "";
		var cfPis = "";
		var cfCofins = "";
		var cfvalLiq = "";

		if (lErro == false) {
			if (dsCriaTituloProtheus) {
				////console.log ("SOLICPAGAMENTO - DSCRIAPROTHEUS - PTO 1");
				if (dsCriaTituloProtheus.values.length > 0) {
					////console.log ("SOLICPAGAMENTO - DSCRIAPROTHEUS - PTO 2 - MAIOR QUE ZERO");
					for ( var x = 0; x < dsCriaTituloProtheus.values.length; x++) {
	
						record = dsCriaTituloProtheus.values[x];
	
						////console.log ("SOLICPAGAMENTO - DSCRIAPROTHEUS - PTO 3");
						
						// CF_MENRET
						property = "record[\"" + dsCriaTituloProtheus.columns[0] + "\"]";
						cfMenret = eval(property);
	
						// CF_NUMTIT
						property = "record[\"" + dsCriaTituloProtheus.columns[1] + "\"]";
						cfNumTit = eval(property);
						
						// CF_INSS
						property = "record[\"" + dsCriaTituloProtheus.columns[2] + "\"]";
						cfInss = eval(property);
						
						// CF_ISS
						property = "record[\"" + dsCriaTituloProtheus.columns[3] + "\"]";
						cfIss = eval(property);
						
						// CF_IRRF
						property = "record[\"" + dsCriaTituloProtheus.columns[4] + "\"]";
						cfIrrf = eval(property);
						
						// CF_CSLL
						property = "record[\"" + dsCriaTituloProtheus.columns[5] + "\"]";
						cfCsll = eval(property);
						
						// CF_PIS
						property = "record[\"" + dsCriaTituloProtheus.columns[6] + "\"]";
						cfPis = eval(property);
						
						// CF_COFINS
						property = "record[\"" + dsCriaTituloProtheus.columns[7] + "\"]";
						cfCofins = eval(property);
						
						// CF_VALLIQ
						property = "record[\"" + dsCriaTituloProtheus.columns[8] + "\"]";
						cfvalLiq = eval(property);
						
						////console.log ("SOLICPAGAMENTO - DSCRIAPROTHEUS - PTO 4 - cfvalLiq: " + cfvalLiq);
						
						if (cfMenret == "erro" ||cfMenret == "") {
							////console.log ("SOLICPAGAMENTO - DSCRIAPROTHEUS - PTO 5 - NAO GEROU");
							lErro = true;
							document.getElementById("retornoIntegracao").value = "Titulo Nao gerado.";
						} 
						else {
							////console.log ("SOLICPAGAMENTO - DSCRIAPROTHEUS - PTO 6 - GEROU - cfMenret:  " + cfMenret);
							document.getElementById("retornoIntegracao").value =  "Titulo Gerado: " + cfMenret + 
																				  "Valor a pagar: " + cfvalLiq ;
							
							document.getElementById("numTitulo").value = cfNumTit;
							document.getElementById("valorInss").value = cfInss;
							document.getElementById("valorIss").value = cfIss;
							document.getElementById("valorIrrf").value = cfIrrf;
							document.getElementById("valorCsll").value = cfCsll;
							document.getElementById("valorPis").value = cfPis;
							document.getElementById("valorCofins").value = cfCofins;
							
							calcValorPagar("");
							
							document.getElementById("obsValorPagarRetenc").innerHTML = "<small>** O valor esta considerando retencao de impostos (Calculado ap?s Gera??o do titulo)</small>";
						}
					} // for
				} // if (dsCriaTituloProtheus.values.length > 0)
				else {
					lErro = true;
					document.getElementById("retornoIntegracao").value = "Titulo Nao gerado.";
				}
			} // if (dsCriaTituloProtheus)
			else {
				lErro = true;
				document.getElementById("retornoIntegracao").value = "Titulo Nao gerado.";
			}
		} // lErro == false
	} // lErro == false

	if (lErro == true) {
		document.getElementById("btGerarTitulo").style.visibility = "visible";
	}

	loading.hide();
	if (lErro == false && document.getElementById("numTitulo").value != "") {
		aguardeValidaTitulo();
	}
} // fim function
//FIM FUNCAO DE GERAR TITULOS NO PROTHEUS -----------------



//FUNCAO DE CONSULTA DE TITULOS NO PROTHEUS -----------------
// botao validar
function aguardeValidaTitulo() {
	loading.show();
	setTimeout(habilitaValidaTitulo, 1000);
}

function habilitaValidaTitulo() {

	// ACIONA WEBSERVICE TITULO PARA VERIFICAR SE EXISTE.
	// tem este codigo no validate-forms tambem.

	var lErro = false;

	if (mode == "MOD" && (document.getElementById("codNatureza").value == null || document.getElementById("codNatureza").value == "")) {
		FLUIGC.toast({ title: 'Erro:', message: "E necessario escolher a Natureza de Operação!", type: 'danger' });
		lErro = true;
	}

	if (lErro == false) {
		if (mode == "MOD" && (document.getElementById("codPrefixo").value == null || document.getElementById("codPrefixo").value == "")){
			FLUIGC.toast({ title: 'Erro:', message: "E necessario informar o prefixo!", type: 'danger' });
			lErro = true;
		}
	}

	if (lErro == false) {
		if (mode == "MOD" && (document.getElementById("numTitulo").value == null || document.getElementById("numTitulo").value == "")) {
			FLUIGC.toast({ title: 'Erro:', message: "E necessario informar o numero do título!", type: 'danger' });
			lErro = true;
		}
	}

	if (lErro == false) {
		var cdEmpPag = document.getElementById("hiddenCodEmp").value; 
		var cdFilial = document.getElementById("hiddenCodFilial").value;
		var cdTitulo = document.getElementById("numTitulo").value;
		var cdPrefixo = document.getElementById("codPrefixo").value;
		var cnpjFornec = document.getElementById("cpfCnpjFornec").value; 

		var c1 = DatasetFactory.createConstraint("C_EMPRESA", cdEmpPag,cdEmpPag, ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("C_FILIAL", cdFilial,cdFilial, ConstraintType.MUST);
		var c3 = DatasetFactory.createConstraint("C_TITULO", cdTitulo,cdTitulo, ConstraintType.MUST);
		var c4 = DatasetFactory.createConstraint("C_PREF", cdPrefixo,cdPrefixo, ConstraintType.MUST);
		var c5 = DatasetFactory.createConstraint("C_CNPJ", cnpjFornec,cnpjFornec, ConstraintType.MUST);
		var c6 = DatasetFactory.createConstraint("CB_CODIGO", document.getElementById("idEmpresa").value,document.getElementById("idEmpresa").value, ConstraintType.MUST);
		var c7 = DatasetFactory.createConstraint("CB_LOJA", document.getElementById("hiddenLojaFornec").value,document.getElementById("hiddenLojaFornec").value, ConstraintType.MUST);
		var constraints1 = new Array(c1, c2, c3, c4, c5, c6, c7);
		var dsConsultaTituloProtheus = DatasetFactory.getDataset("dsConsultaTituloProtheus", null, constraints1, null);

		var property;
		var record;
		var cdCodigoFornecRet;
		var cdLojaFornecRet;
		var cdTituloRet;
		var cdParcelaRet;
		var cdPrefixoRet;
		var valorTituloRet;
		var cdTipoRet;
		var ret;
		var cfInss;
		var cfIss;
		var cfIrrf;
		var cfCsll;
		var cfPis;
		var cfCofins;
		
		if (dsConsultaTituloProtheus) {
			if (dsConsultaTituloProtheus.values.length > 0) {
				for ( var x = 0; x < dsConsultaTituloProtheus.values.length; x++) {

					record = dsConsultaTituloProtheus.values[x];

					// cdCodigoFornecRet
					property = "record[\""	+ dsConsultaTituloProtheus.columns[0] + "\"]";
					cdCodigoFornecRet = eval(property);

					// cdLojaFornecRet
					property = "record[\"" + dsConsultaTituloProtheus.columns[1] + "\"]";
					cdLojaFornecRet = eval(property);

					// cdTituloRet
					property = "record[\""	+ dsConsultaTituloProtheus.columns[2] + "\"]";
					cdTituloRet = eval(property);

					// cdParcelaRet
					property = "record[\"" + dsConsultaTituloProtheus.columns[3] + "\"]";
					cdParcelaRet = eval(property);

					// cdPrefixoRet
					property = "record[\"" + dsConsultaTituloProtheus.columns[4] + "\"]";
					cdPrefixoRet = eval(property);

					//cdTipoRet
					property = "record[\"" + dsConsultaTituloProtheus.columns[5] + "\"]";
					cdTipoRet = eval(property);
					
					//valorTituloRet
					property = "record[\"" + dsConsultaTituloProtheus.columns[6] + "\"]";
					valorTituloRet = eval(property);

					// CF_INSS
					property = "record[\"" + dsConsultaTituloProtheus.columns[7] + "\"]";
					cfInss = eval(property);
					
					// CF_ISS
					property = "record[\"" + dsConsultaTituloProtheus.columns[8] + "\"]";
					cfIss = eval(property);
					
					// CF_IRRF
					property = "record[\"" + dsConsultaTituloProtheus.columns[9] + "\"]";
					cfIrrf = eval(property);
					
					// CF_CSLL
					property = "record[\"" + dsConsultaTituloProtheus.columns[10] + "\"]";
					cfCsll = eval(property);
					
					// CF_PIS
					property = "record[\"" + dsConsultaTituloProtheus.columns[11] + "\"]";
					cfPis = eval(property);
					
					// CF_COFINS
					property = "record[\"" + dsConsultaTituloProtheus.columns[12] + "\"]";
					cfCofins = eval(property);
					
					document.getElementById("retornoConsultaTit").value = "";
					if (cdTituloRet == "erro" || cdTituloRet == "") {
						ret = 1;
					} else {
						ret = 0;
						document.getElementById("retornoConsultaTit").value = "Fornec: " + cdCodigoFornecRet + " - " +
																			  "Loja: " + cdLojaFornecRet + " - " +
																			  "Prefixo: " + cdPrefixoRet + " - " +
																			  "Titulo: " + cdTituloRet + " - " +
																			  "Tipo: " + cdTipoRet + " - " +
																			  "Valor a pagar: " + valorTituloRet ;
						
						document.getElementById("valorInss").value = cfInss;
						document.getElementById("valorIss").value = cfIss;
						document.getElementById("valorIrrf").value = cfIrrf;
						document.getElementById("valorCsll").value = cfCsll;
						document.getElementById("valorPis").value = cfPis;
						document.getElementById("valorCofins").value = cfCofins;
						
						calcValorPagar("");
						
						document.getElementById("obsValorPagarRetenc").innerHTML = "<small>** O valor esta considerando retencao de impostos (Retorno do Titulo no Protheus)</small>";
						
					}
				} // for
				
				if (ret == 0 && cdTituloRet != "") {

					// se existe
					document.getElementById("imgValidacaoOk").style.visibility = "visible";
					document.getElementById("imgValidacaoNok").style.visibility = "hidden";
					document.getElementById("hiddenValidaTitulo").value = "OK";
					document.getElementById("retornoConsultaTit").value = document.getElementById("retornoConsultaTit").value	+ " >> TITULO OK";
				} 
				else {
					// se nao existe
					document.getElementById("imgValidacaoOk").style.visibility = "hidden";
					document.getElementById("imgValidacaoNok").style.visibility = "visible";
					document.getElementById("hiddenValidaTitulo").value = "NOK";
					document.getElementById("retornoConsultaTit").value = document.getElementById("retornoConsultaTit").value + " >> TITULO NOK";
				}
				
			} // if (dsConsultaTituloProtheus.values.length > 0)
			else {
				// se nao existe
				document.getElementById("imgValidacaoOk").style.visibility = "hidden";
				document.getElementById("imgValidacaoNok").style.visibility = "visible";
				document.getElementById("hiddenValidaTitulo").value = "NOK";
				document.getElementById("retornoConsultaTit").value = document.getElementById("retornoConsultaTit").value + " >> TITULO NOK";
			}
			
		} // if (dsConsultaTituloProtheus)
		else {
			// se nao existe
			document.getElementById("hiddenValidaTitulo").value = "NOK";
			document.getElementById("imgValidacaoOk").style.visibility = "hidden";
			document.getElementById("imgValidacaoNok").style.visibility = "visible";
			document.getElementById("retornoConsultaTit").value = document.getElementById("retornoConsultaTit").value + " >> TITULO NOK";
		}
		
	} // if (lErro == false)

	loading.hide();

} // fim function
//FIM FUNCAO DE CONSULTA DE TITULOS NO PROTHEUS -----------------


function limpaTitulo() {

	//console.log("function limpaTitulo - pto 1");
	if (document.getElementById("gerouManual").value == "2"
			&& document.getElementById("numTitulo").value != "") {
		//console.log("function limpaTitulo - pto 2");
		FLUIGC.message.confirm({
		    message: "A Limpeza dos dados acarreta na perda da integração do título gerado e é necessario acessar o Protheus e realizar a eliminação manual deste títuo. Deseja continuar a limpeza?",
		    title: 'ATEN\u00c7\u00c3O',
		    labelYes: 'Sim',
		    labelNo: 'N\u00e3o'
		}, function(result, el, ev) {
			if (result) {
				//console.log("function limpaTitulo - pto 3");
				document.getElementById("codPrefixo").value = "";
				document.getElementById("numTitulo").value = "";
				document.getElementById("imgValidacaoOk").style.visibility = "hidden";
				document.getElementById("imgValidacaoNok").style.visibility = "hidden";
				document.getElementById("retornoConsultaTit").value = "";
				document.getElementById("retornoIntegracao").value = "";
				document.getElementById("btGerarTitulo").style.visibility = "visible";
			}
		});						
	} 
	else {
		//console.log("function limpaTitulo - pto 4");
		document.getElementById("codPrefixo").value = "";
		document.getElementById("numTitulo").value = "";
		document.getElementById("imgValidacaoOk").style.visibility = "hidden";
		document.getElementById("imgValidacaoNok").style.visibility = "hidden";
		document.getElementById("retornoConsultaTit").value = "";
		document.getElementById("retornoIntegracao").value = "";
		document.getElementById("btGerarTitulo").style.visibility = "visible";
	}
} // fim function


function messageRetencao(){
	if (document.getElementById("retencao").value == "1") {
		FLUIGC.message.confirm({
		    message: "Essa escolha ira reter os impostos alterando o valor líquido do pagamento. Deseja continuar?",
		    title: 'ATEN\u00c7\u00c3O',
		    labelYes: 'Sim',
		    labelNo: 'N\u00e3o'
		}, function(result, el, ev) {
			if (result) {
				alteraLabelRetencao(true);
				document.getElementById("decrescimo").value = "0,00";
				//document.getElementById("decrescimo").className = "readonly";
				//document.getElementById("decrescimo").className = "readonly";
				document.getElementById("decrescimo").readOnly = true;
			} else {
				alteraLabelRetencao(false);
				document.getElementById("decrescimo").value = "0,00";
				//document.getElementById("decrescimo").className = "";
				//document.getElementById("decrescimo").className = "";
				document.getElementById("decrescimo").readOnly = false;
			}
		});						
		
	} 
	else{
		alteraLabelRetencao(false);
		document.getElementById("decrescimo").value = "0,00";
		//document.getElementById("decrescimo").className = "";
		//document.getElementById("decrescimo").className = "";
		document.getElementById("decrescimo").readOnly = false;
	}
}	

function alteraLabelRetencao(lopcao){
	if (lopcao == true) {
		document.getElementById("obsValorPagarRetenc").innerHTML = "<small>** O valor esta considerando retencao de impostos (Calculado ap?s Gera??o do titulo)</small>";
	}
	else{
		document.getElementById("retencao").value == "2";
		document.getElementById("obsValorPagarRetenc").innerHTML = "";
	}
	
}

function pegaValBrutoAtual(){
	vValBrutoAnterior = tdifunctions.getFloatValue("valorBruto");
	//console.log("vValBrutoAnterior: " + vValBrutoAnterior);
}


function mostraAguardeVal(){
	//alert ("oiee");
}

function calcValorPagar(pOrigem) {

	var numeroAtividade = document.getElementById("numAtiv").value;
	
	var fValorBruto = tdifunctions.getFloatValue("valorBruto");
	
	//console.log("calcValorPagar - vValBrutoAnterior: " + vValBrutoAnterior + " - fValorBruto: " + fValorBruto);
	
	var fValorInss = tdifunctions.getFloatValue("valorInss");
	var fValorIss = tdifunctions.getFloatValue("valorIss");
	var fValorIrrf = tdifunctions.getFloatValue("valorIrrf");
	var fValorCsll = tdifunctions.getFloatValue("valorCsll");
	var fValorPis = tdifunctions.getFloatValue("valorPis");
	var fValorCofins = tdifunctions.getFloatValue("valorCofins");
	var fValorMulta = tdifunctions.getFloatValue("valorMulta");
	var fValorJuros = tdifunctions.getFloatValue("valorJuros");
	var fValorCMon = tdifunctions.getFloatValue("valorCMon");
	var fValorTaxas = tdifunctions.getFloatValue("valorTaxas");
	var fValorAcresc = tdifunctions.getFloatValue("acrescimo");
	var fValorDecresc = tdifunctions.getFloatValue("decrescimo");


	tdifunctions.setMoeda("valorBruto", 2, false);

	var fValorPagar = 0.00;
	fValorPagar = fValorBruto - fValorInss - fValorIss - fValorIrrf - fValorCsll - fValorPis - fValorCofins 
	 			  + fValorMulta + fValorJuros + fValorCMon + fValorTaxas
	 			  + fValorAcresc - fValorDecresc;

	//console.log ("funcao calcValorPagar - fValorPagar: " + fValorPagar.toString());
	
	document.getElementById("valorPagar").value = fValorPagar.toFixed(2);
	
	tdifunctions.setMoeda("valorPagar", 2, true);

	// 04/11
	if (pOrigem == "html" && (vValBrutoAnterior == fValorBruto)){
		//console.log("html - val ant igual bruto --> nao faz a funcao");
		//AguardeGestorAprovador("aprovador");
	} 
	else if (pOrigem == "html" && ((vValBrutoAnterior != fValorBruto) || document.getElementById("hiddenRefazFaixaAprovador").value == "Sim")){
		//console.log("html - val ant dif bruto");
		if (fValorBruto != 0 && (numeroAtividade == "0" || numeroAtividade == "" || numeroAtividade == null || numeroAtividade == "1" || numeroAtividade == "6" )) {
			AguardeGestorAprovador("aprovador");
		}
	} 
	else if (fValorBruto != 0 && (numeroAtividade == "0" || numeroAtividade == "" || numeroAtividade == null || numeroAtividade == "1" || numeroAtividade == "6" )) {
		//console.log("not html - val bruto > 0");
		if (document.getElementById("hiddenMatrDest").value != "") {
			AguardeGestorAprovador("aprovador");
		}
	}
	// 04/11
	
} // fim function




//FUNCAO DE CONSULTA DE TITULOS NO PROTHEUS -----------------
//botao validar
function AguardeGestorAprovador(cTipo) {
	setTimeout(mostraAprovacaoSupSoliceDestinatario(cTipo), 1000);
}



// MODO NOVO - ATRAVES CAD DE FAIXAS DO PROTHEUS 
function mostraAprovacaoSupSoliceDestinatario(cTipo) {
	
	var numeroAtividade = document.getElementById("numAtiv").value;
	
	//A primeira aprovacao, sera do superior imediato do DESTINATARIO DA DESPESA , EXCETO:
	// *****ESSA REGRA NAO TEM MAIS A VALIDAcaO DE CCUSTO 601610311
	//	NAO 1- REGRA NOVA: Caso a area escolhida seja FISCAL, e o destinatario da despesa seja do centro de custo 601610311:
	//	NAO- Se o destinatario NÃO estiver relacionado neste PAPEL(se não for o Newton ou Carlos) deve- se encaminhar a aprovação para um NOVO PAPEL;
	//	NAO- Se o destinatario estiver relacionado neste PAPEL(se for o Newton ou Carlos) , deve-se encaminhar para o superior imediato do destinatario da despesa;
	//	NAO- O novo papel a ser criado, tera o nome - SOLIC_PAGAMENTO_FISCAL_601610311.

	
    //  NOVA 1- REGRA NOVA: Caso a area escolhida seja FISCAL:
	//	- Se o destinatario NÃO estiver relacionado neste PAPEL(se não for o Newton) deve- se encaminhar a aprovação para um NOVO PAPEL;
	//	- Se o destinatario estiver relacionado neste PAPEL(se for o Newton) , deve-se encaminhar para o superior imediato do destinatario da despesa;
	//	O papel tera o nome - SOLIC_PAGAMENTO_FISCAL.

	//	Caso não entre na regra acima:
	//	2- Quando o usuario solicitante escolher o a area ADM GENTE OU COMISSOES:
	//      - Aprovacao de gestor do Ccusto/Departamento ADM GENTE OU COMISSOES sera o gestor da matriz (cada area um papel diferente com gestores da area):
	//          Papeis criados para estes departamentos:
	//	           >> ADM GENTE, vai para: Lilian Carla Peterlini, Vivian Moura Benfica, Estela Medeiros, Camilla Braniz Monari - papel SOLIC_PAGAMENTO_ADM_GENTE
	//	           >> COMISSOES, sempre vai para o Jeferson Costa e Paulo Eduardo - SOLIC_PAGAMENTO_COMISSOES

	//	Exceção: QUANDO O DESTINATARIO DA DESPESA ESTA EM UM DOS PAPEIS, então sera  enviado para o superior imediato do destinatario da despesa;
	

	// Obs: o servico de hierarquia ja retorna no minimo o superior do colaborador. Ex:
	// rodrigo zuge é gerente, no campo coordenador e gerente aparece ele mesmo

	if (mode != "VIEW" && (numeroAtividade == "0" || numeroAtividade == "" || numeroAtividade == null || numeroAtividade == "1" || numeroAtividade == "6")) {
		
		
		limpezatabelaAprovadores();
		
		// 03/11
		// ---------------- limpando o index, ele inicia novamente com 1 ------------------
		//WdksetNewId('0'); // nao colocar na funcao acima.
		//console.log ("newid1");
		// ---------------- limpando o index, ele inicia novamente com 1 -----------------

		// NOVO 24/11 - NAO FUNCIONA MAIS O DECIMA
		// ---------------- limpando o index, ele inicia novamente com 1 ------------------
		WdksetNewId('{"tbAprovacoes":0}'); // nao colocar na funcao acima.
		console.log ("newid-24/11");
		// ---------------- limpando o index, ele inicia novamente com 1 -----------------
		
		
		
		var fValorBruto = tdifunctions.getFloatValue("valorBruto");
		
		if (fValorBruto != 0) {
			
			var cErro = "";
			var property;
			var record;
			var ret;
		
			// inicializa com branco, e tem que receber sim ou nao --> se vai para aprovacao PA ou nao
			if (cTipo == "aprovador") {
				document.getElementById("hiddenVaiParaAprovPA").value = "";
				document.getElementById("hiddenEncontrouFaixaAprovador").value = "";
				document.getElementById("hiddenNumTotAprovac").value = "";
				document.getElementById("hiddenAprovadorDaVez").value = "";
				document.getElementById("hiddenNumeroDaVez").value = "";
			}
		
			
			// TRATAMENTO DESTINATARIO NO PAPEL, OU AREA EXCECAO ---------------------------------------------------------------------------------------
			var lEncontrouAreasExcecao = false; 
			var lEncontrouPapelIgualDestin = false;
			var lEntrouAlgumaCondicao = false;
			
			if (document.getElementById("areaSolic").value != "x" && document.getElementById("areaSolic").value != "4" && document.getElementById("areaSolic").value != "5" && document.getElementById("areaSolic").value != "6" && document.getElementById("areaSolic").value != "7") {
				
				
				// 1- SE ENCONTROU O COLABORADOR DESTINATARIO NO PAPEL DA AREA DE EXCECAO, ENTAO NAO PODE - TEM QUE PEGAR O SUPERIOR DO DESTINATARIO
				var cPapel = "";
				if (document.getElementById("areaSolic").value == "1"){
					cPapel = "SOLIC_PAGAMENTO_ADM_GENTE";
				}
				else if (document.getElementById("areaSolic").value == "2"){
					cPapel = "SOLIC_PAGAMENTO_COMISSOES";
				}
				else if (document.getElementById("areaSolic").value == "3"){
					
					// regra nao eh mais valida
					//if (document.getElementById("codCentroCusto").value == "601610311"){
						//cPapel = "SOLIC_PAGAMENTO_FISCAL_601610311";
					//}
					//else{
					//	cPapel = "";
					//}

					// MUDANCA DE REGRA
					cPapel = "SOLIC_PAGAMENTO_FISCAL";
					
				}
			// NAO PRECISA MAIS A REGRA - POIS NAO HA A ESCOLHA DO COLABORADOR NO DESTINATARIO - APENAS CCUSTO
			// PROCED DAS AREAS - SOMENTE SE FOR DA AREA, ESCOLHE A AREA ESPECIFICA, SENAO ESCOLHE "OUTRAS AREAS"
				//console.log ("workflowColleagueRole - pto 1");
				//if (cPapel != ""){
					//console.log ("workflowColleagueRole - papel != branco");
				//	var chiddenMatrDest = document.getElementById("hiddenMatrDest").value;
				//	var fields = new Array("workflowColleagueRolePK.colleagueId","workflowColleagueRolePK.roleId");
				//	var cW1 = DatasetFactory.createConstraint("colleagueId",chiddenMatrDest ,chiddenMatrDest ,ConstraintType.MUST);
				//	var cW2 = DatasetFactory.createConstraint("roleId",cPapel ,cPapel ,ConstraintType.MUST);
					
				//	var constraintsW = new Array();
				//		constraintsW.push(cW1);
				//		constraintsW.push(cW2);
				//	var dsworkflowColleagueRole = DatasetFactory.getDataset("workflowColleagueRole", fields, constraintsW, null);
					
					//console.log ("workflowColleagueRole - dsworkflowColleagueRole.values.length:" + dsworkflowColleagueRole.values.length);
					
				//	if (dsworkflowColleagueRole){
				//		if (dsworkflowColleagueRole.values.length > 0) {
							//console.log ("workflowColleagueRole - usuario encontrado");
				//			lEncontrouPapelIgualDestin = true; 	// SIGNIFICA QUE ENCONTROU, ENTAO NAO DEVE UTILIZAR ESTA REGRA POIS 
																//O DESTINATARIO ESTA NO PAPEL DE APROVACAO 
				//		}
				//	}
				//}
				// FIM DESTINATARIO NO PAPEL
				
				// 2- SE NAO ENCONTROU O DESTINATARIO NO PAPEL, ENTAO VERIFICA A AREA EXCECAO	
				//if (lEncontrouPapelIgualDestin == false){
				
					if (document.getElementById("descricaoItem").value == "00") {
						document.getElementById("hiddenVaiParaAprovPA").value = "Sim";
					} else {
						document.getElementById("hiddenVaiParaAprovPA").value = "Nao";
					}	
				
					if (document.getElementById("areaSolic").value == "1") {
						
						document.getElementById("hiddenAprovadorDaVez").value = "PAPEL:SOLIC_PAGAMENTO_CONTAS_PAGAR_PA";
						cPapel = "SOLIC_PAGAMENTO_CONTAS_PAGAR_PA";

						// 03/11 - comentado
						//document.getElementById("hiddenNumTotAprovac").value = "1";
						//document.getElementById("hiddenNumeroDaVez").value = "1";
						
						lEncontrouAreasExcecao = true; // ENCONTROU - ENTAO UTILIZAR ESTA REGRA

						// centralizado num so lugar
						//if (document.getElementById("descricaoItem").value == "00") {
						//	document.getElementById("hiddenVaiParaAprovPA").value = "Sim";
						//} else {
						//	document.getElementById("hiddenVaiParaAprovPA").value = "Nao";
						//}
					}
					
					// retirado cfme solicitacao patricia
					//if (document.getElementById("areaSolic").value == "2") {
						
						//document.getElementById("hiddenAprovadorDaVez").value = "PAPEL:SOLIC_PAGAMENTO_COMISSOES";
						//cPapel = "COMISSOES";
						
						// 03/11 - comentado
						//document.getElementById("hiddenNumeroDaVez").value = "1";
						//document.getElementById("hiddenNumTotAprovac").value = "1";
						
						//document.getElementById("hiddenVaiParaAprovPA").value = "Nao";
						
						//lEncontrouAreasExcecao = true; // ENCONTROU - ENTAO UTILIZAR ESTA REGRA
					//}
					
					if (document.getElementById("areaSolic").value == "3") {
						// regra nao eh mais usada
						//if (document.getElementById("codCentroCusto").value == "601610311"){
						//	document.getElementById("hiddenNumTotAprovac").value = "1";
						//	document.getElementById("hiddenAprovadorDaVez").value = "PAPEL:SOLIC_PAGAMENTO_FISCAL_601610311";
						//  cPapel = "FISCAL_601610311";
						//document.getElementById("hiddenNumeroDaVez").value = "1";
						//lEncontrouAreasExcecao = true; // ENCONTROU - ENTAO UTILIZAR ESTA REGRA
						//}
						//else{ //papel é branco pois o ccusto nao é 601610311 - em que ir p superior imediato
						//	lEncontrouAreasExcecao = false;
						//}

						
						document.getElementById("hiddenAprovadorDaVez").value = "PAPEL:SOLIC_PAGAMENTO_FISCAL";
						cPapel = "FISCAL";
						
						// 03/11 - comentado
						//document.getElementById("hiddenNumeroDaVez").value = "1";
						//document.getElementById("hiddenNumTotAprovac").value = "1";
						
						lEncontrouAreasExcecao = true; // ENCONTROU - ENTAO UTILIZAR ESTA REGRA
							
						//centralizado num lugar so
						//if (document.getElementById("descricaoItem").value == "00") {
						//	document.getElementById("hiddenVaiParaAprovPA").value = "Sim";
						//} 
						//else {
						//	document.getElementById("hiddenVaiParaAprovPA").value = "Nao";
					    //}
					}
					
					
					if (lEncontrouAreasExcecao == true){
						
						//console.log("lEncontrouAreasExcecao == true - papel valido para aprovacao");
						
						// criando a tabela de aprovadores COM O PAPEL
						var index = wdkAddChild("tbAprovacoes");
						
						//console.log ("INDEX 2: " + index);
						
						//$("#identAprovacao___" + index).val(" ");
						$("#idTipoAprovac___" + index).val("POOL USUARIOS");
						$("#idSugeridoDataset___" + index).val(cPapel);
						$("#idMatrAprovador___" + index).val("");
						$("#idNomeAprovador___" + index).val("");
						$("#idEmailAprovador___" + index).val("");
						
						$("#idDataAprov___" + index).val("");
						$("#idHoraAprov___" + index).val("");
						
						//$("#labelSitGestores").hide();
						$("#idObsAprov___" + index).val("");
						// 03/11 - valores recebem index
						document.getElementById("hiddenNumeroDaVez").value = index;
						document.getElementById("hiddenNumTotAprovac").value = index;

					}
					
				//} // if
				// FIM AREA EXCECAO
					
			} // if area != x e != 4
			
			// 3- CASO AS CONDICOES 1 E 2 NAO SEJAM ACEITAS - BUSCAR O GESTOR IMEDIATO CONFORME FAIXA DE VALORES DA MATRIZ ----------------------------------
			if (lEncontrouAreasExcecao == false) {
				
				//console.log("lEncontrouAreasExcecao == false - procura aprovador gestor");
				
				if (cTipo == "aprovador") {
					if (document.getElementById("descricaoItem").value == "00") {
						document.getElementById("hiddenVaiParaAprovPA").value = "Sim";
					} else {
						document.getElementById("hiddenVaiParaAprovPA").value = "Nao";
					}
				}
		
				/*
				if (document.getElementById("hiddenCodEmp").value == "" || document.getElementById("hiddenCodEmp").value == null ||
					document.getElementById("hiddenCodFilial").value == "" || document.getElementById("hiddenCodFilial").value == null ||
					document.getElementById("codCentroCusto").value == "" || document.getElementById("codCentroCusto").value == null ||
					document.getElementById("codItemContabil").value == "" || document.getElementById("codItemContabil").value == null
					) {
					document.getElementById("hiddenEncontrouFaixaAprovador").value = "Nao";
					alert ("Não foi possivel resgatar os possiveis aprovadores.Verifique se foi informada a Empresa pagadora, Centro de Custo e Item contabil.");
				}
				else{
				*/
					// se entrar em alguma faixa
					// 1- localizar e-mail usuarios aprovadores 
					// --------------------------------------------------
					
					var retAprovacao = retornaPapUsuAprovacao();
					
					// --------------------------------------------------
					if (retAprovacao) {
						console.log("#retAprovacao.values.length: "+retAprovacao.values.length);
						if (retAprovacao.values.length > 0) {
							
							var record ;
							var property ;
							var emailAprovadores = new Array();
							
							document.getElementById("hiddenEncontrouFaixaAprovador").value = "Sim";
							
							var lFirst = false;
							var ret = 0;
							var aprovadores = [];
							
							for ( var i = 0; i < retAprovacao.values.length; i++) {
								
								record = retAprovacao.values[i];
								console.log("#record: "+record);
								// emailAprovadores
								property = "record[\"" + retAprovacao.columns[1] + "\"]";
								var mail = eval(property);
								console.log("#mail: "+mail);
								var found = false;
								for (var x=0; x<emailAprovadores; x++){
									if (emailAprovadores[x] == mail) {
										found = true;
										break;
									}
								}
								
								if (found) { continue; }
								
								emailAprovadores[i] = mail;
								
								// TESTE!!
									//emailAprovadores[i] = "cristina.poffo@totvs.com.br";
								// FIM TESTE !!
								
								var fields = new Array("colleaguePK.colleagueId","colleagueName","mail","active");
							    var c1 = DatasetFactory.createConstraint("mail",emailAprovadores[i], emailAprovadores[i], ConstraintType.MUST);
								var constraints1 = new Array(c1);
								var colaborador = DatasetFactory.getDataset("colleague", fields, constraints1, null);
								if(colaborador) {
									console.log("#colaborador.values.length: "+colaborador.values.length);
									if (colaborador.values.length > 0) {
								
										var record = colaborador.values[0];
										console.log("#record2: "+record);
										var matr;
										var matr = eval("record[\"colleaguePK.colleagueId\"]");
										var nom  = eval("record[\"colleagueName\"]");
										var ativo = eval("record[\"active\"]");
										
										if (ativo == "true") { // TEM QUE SER ATIVOSSSSSSSS - SENAO O PRIMEIRO PODE DAR ERRADO!
											ret = ret + 1;
											// criando a tabela de aprovadores
											var row = retAprovacao.values[i];
											
											var index = wdkAddChild("tbAprovacoes");
											aprovadores.push(nom);
											//console.log("INDEX 2: " + index);
	
											$("#idTipoAprovac___" + index).val("GESTOR -" + (i + 1));
											
											$("#idDataAprov___" + index).val("");
											$("#idHoraAprov___" + index).val("");
				
											
											$("#idSugeridoDataset___" + index).val(emailAprovadores[i]);
											$("#idMatrAprovador___" + index).val(matr);
	
											$("#idNomeAprovador___" + index).val(nom);
											$("#idEmailAprovador___" + index).val(emailAprovadores[i]);
										//	$("#labelSitGestores").hide();
											$("#idObsAprov___" + index).val("");
																			
											var tabelaName = document.getElementById("tbAprovacoes").tBodies[0]; 
											
											if (lFirst == false){
												lFirst = true;
												document.getElementById("hiddenAprovadorDaVez").value = "USUAR:" + matr;
												document.getElementById("hiddenNumeroDaVez").value = index;  
											}
											
											document.getElementById("hiddenNumTotAprovac").value = index;
										
										}
									} // if
								} //if
							} // for							
							var centroC = $("#codCentroCusto").val();
							var area = $("#areaSolic").val();
							
							if(area == "5"){
								centroC = "515600830";
							}else if(area == "6"){
								centroC = "515600850";
							}else if(area == "7"){
								centroC = "511600820";
							}
							
							FLUIGC.toast({ title: 'FLUXO DE APROVAÇÃO:', message: "Aviso: Ao iniciar essa solicitação, ela passará pela aprovação do(s) usuário(s): <b>"+aprovadores.join(", ")+"</b>, hierarquia do Centro de custo <b>"+centroC+"</b>. Caso a estrutura de aprovação esteja incorreta, entre em contato com a equipe de CST.", type: 'info', timeout: 12000 });
							
							if (ret == 0) {
								document.getElementById("hiddenEncontrouFaixaAprovador").value = "Nao";
								FLUIGC.toast({ title: 'Erro:', message: "Não foi possivel resgatar os possiveis aprovadores.Verifique se foi informada a Empresa pagadora, Centro de Custo e Item contabil.!", type: 'danger' });
							}
						} 
						else{
							document.getElementById("hiddenEncontrouFaixaAprovador").value = "Nao";
							FLUIGC.toast({ title: 'Erro:', message: "Não foi possivel resgatar os possiveis aprovadores: retorno = nenhum aprovador - Favor verificar com area CST.", type: 'danger' });
						}
					}
					else{
						document.getElementById("hiddenEncontrouFaixaAprovador").value = "Nao";
						FLUIGC.toast({ title: 'Erro:', message: "Não foi possivel resgatar os possiveis aprovadores: retorno = nulo - Favor verificar com area CST.", type: 'danger' });
					}
				//}
				
	
			} // if (lEncontrouAreasExcecao == false) {
			
			// -----------------------------------------------------------------------------------------
		} // valor bruto > 0
		
	} // ativ inicial
	
} // fim function



// MODO NOVO - ATRAVES CAD DE FAIXAS DO PROTHEUS 
function retornaPapUsuAprovacao() {
	
	var retornoFuncao = new Array();
	var area = $("#areaSolic").val();
	
	var cErro = "";

	var cdEmpresa		= document.getElementById("hiddenCodEmp").value;
	var cdFilial 		= document.getElementById("hiddenCodFilial").value;
	
	//var cdCpf 			= document.getElementById("CpfDest").value;
	//cdCpf 			= cdCpf.replace("-","");
	//cdCpf 			= cdCpf.replace(".","");
	//cdCpf 			= cdCpf.replace(".","");
	//cdCpf 			= cdCpf.replace(".","");
	//cdCpf 			= cdCpf.replace(".","");
	//cdCpf 			= cdCpf.replace(".","");
	
	var cdCcusto 		= document.getElementById("codCentroCusto").value;
	
	var cdItemCtbl 		= document.getElementById("codItemContabil").value;
	var fValorBruto 	= tdifunctions.getFloatValue("valorBruto");
	
	var fValor 			= tdifunctions.getFloatValue("valorPagar");
	
	if(area == "5"){
		cdEmpresa = "";
		cdFilial = "";
		cdItemCtbl = "";
		cdCcusto = "515600830";
	}else if(area == "6"){
		cdEmpresa = "";
		cdFilial = "";
		cdCcusto = "515600850";
	}else if(area == "7"){
		cdEmpresa = "";
		cdFilial = "";
		cdItemCtbl = "";
		cdCcusto = "511600820";
	}
	
	console.log ('NOVO 18/08 - emailUsuarioCorrente: ' + document.getElementById("emailbeneficiario").value);
	if (fValor > 0) {

		var lEntrou = false;
		var record;
		var emailAprovadores = new Array();
		
		// novos parametros: Empresa, Filial, Centro de Custo, Item Contábil, Valor
		var c1 = DatasetFactory.createConstraint("C_EMPRESA", cdEmpresa, cdEmpresa,ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("C_FILIAL", cdFilial, cdFilial, ConstraintType.MUST);
		//var c3 = DatasetFactory.createConstraint("CK_CPF", cdCpf, cdCpf, ConstraintType.MUST);
		var c3 = DatasetFactory.createConstraint("CK_CC", cdCcusto, cdCcusto, ConstraintType.MUST);
		var c4 = DatasetFactory.createConstraint("CK_ITCT", cdItemCtbl, cdItemCtbl, ConstraintType.MUST);
		var c5 = DatasetFactory.createConstraint("CK_VALOR", fValorBruto.toString(), fValorBruto.toString(), ConstraintType.MUST);
		//novo 18/08
		var c6 = DatasetFactory.createConstraint("C_EMAIL", $("#emailbeneficiario").val(), $("#emailbeneficiario").val(), ConstraintType.MUST);

		//var constraints1 = new Array(c1,c2,c3,c4,c5,c6);

		//Incluido a passagem do campo Classe para o dataset, conforme a issues TIPDIN-565
		var c7 = DatasetFactory.createConstraint("CK_CLVL", $("#codClasse").val(), $("#codClasse").val(), ConstraintType.MUST);
		var constraints1 = new Array(c1,c2,c3,c4,c5,c6,c7);
		
		var dsAprovadoresFaixaValorProtheus = DatasetFactory.getDataset("dsAprovadoresFaixaValorProtheus", null, constraints1, null);
		
		if (dsAprovadoresFaixaValorProtheus) {
			if (dsAprovadoresFaixaValorProtheus.values.length > 0) {
				
				lEntrou = true;
				
			} // if
			else {
				cErro = "erro 1- Funcao dsAprovadoresFaixaValorProtheus.values.length <= 0";
			}
		} 
		else {
			cErro = "erro 1- Funcao dsAprovadoresFaixaValorProtheus == null";
		}

		retornoFuncao = dsAprovadoresFaixaValorProtheus;
		
	} // if valor > 0
	else {
		cErro = "";
		retornoFuncao = null;
	}

	return retornoFuncao;

} // fim funcao



function RemoverItem(oElement){ 

	fnWdkRemoveChild(oElement);
	var tabela = document.getElementById("tbAprovacoes").tBodies[0];	 
} // fim function
// FIM LIMPEZA TABELA APROVACAO



function alteraDestaqueAprovacDaVez(numeroAtividade){
	
	if (numeroAtividade == "155"){
		
		var numAprovacDavez = document.getElementById("hiddenNumeroDaVez").value;
		for ( var i = 1; i <= numAprovacDavez ; i++) {
			if (i == numAprovacDavez){
				document.getElementById("idObsAprov___" + numAprovacDavez).removeAttribute("readonly");
			}
			else{
				document.getElementById("idTipoAprovac___" + numAprovacDavez).readOnly = true;
				document.getElementById("idSugeridoDataset___" + numAprovacDavez).readOnly = true;
				document.getElementById("idNomeAprovador___" + numAprovacDavez).readOnly = true;
				document.getElementById("idEmailAprovador___" + numAprovacDavez).readOnly = true;
				document.getElementById("idDataAprov___" + numAprovacDavez).readOnly = true;
				document.getElementById("idHoraAprov___" + numAprovacDavez).readOnly = true;			
				document.getElementById("idObsAprov___" + numAprovacDavez).readOnly = true;
			}
		}

    } // if numeroAtividade
	
} // fim function


function verificaData(obj){
	
	var dtVencUsuario = obj.value;
	if (datavelhasolicpagto != dtVencUsuario) {
		datavelhasolicpagto = dtVencUsuario;
		var dataDem = dtVencUsuario.split("/"); 
		var month = dataDem[1]; 
		var day = dataDem[0]; 
		var year = dataDem[2]; 
		
		var fmonth = 0;
		if (month.length == 1) {
			month = "0" + month;
			fmonth = parseInt(month) - 1;
			month = (fmonth).toString;
		}
		if (day.length == 1) {
			day = "0" + day;
		}
		dtVencUsuario = year + month + day; // esta certo!!!! trata o char la no webservice depois!
		
		var data = new Date();
		diaSemana = data.getDay();
		//dom
		if (diaSemana == 0){ data.setDate(data.getDate() + 3); numDias = "3"; }
		//seg
		if (diaSemana == 1){ data.setDate(data.getDate() + 3); numDias = "3"; }
		//ter
		if (diaSemana == 2){ data.setDate(data.getDate() + 3); numDias = "3"; }
		//qua
		if (diaSemana == 3){ data.setDate(data.getDate() + 5); numDias = "5"; }
		//qui
		if (diaSemana == 4){ data.setDate(data.getDate() + 5); numDias = "5"; }
		//sex
		if (diaSemana == 5){ data.setDate(data.getDate() + 5); numDias = "5"; }
		//sab
		if (diaSemana == 6){ data.setDate(data.getDate() + 4); numDias = "4";}
		var dia = data.getDate().toString();
		if	(dia.length == 1){ dia = 0 + dia; }
		var mes = (data.getMonth() + 1).toString();
		if	(mes.length == 1){ mes = 0 + mes; }
		var ano = data.getFullYear().toString();
		
		var dataSugerida = ano + mes + dia;
		
		if (dtVencUsuario < dataSugerida){
			FLUIGC.toast({ title: 'Atencao:', message: "Conforme política o prazo mínimo  para o pagamento é de 72 horas. Sera iniciado validação e liberação para o pagamento após todas as aprovações conforme alçada. Esta solicitação esta fora do prazo e sera avaliada pela equipe de Contas a Pagar o pagamento por exceção", type: 'warning' });
		}
	}

} // fim function



function limpezatabelaAprovadores(){
	/* logica antiga - nao pode ser assim porque quando desabilita o select vira <span>
	// LIMPEZA TABELA APROVACAO
	var tabela = document.getElementById("tbAprovacoes");
	if (tabela && tabela.rows.length > 2) {
		for (var i=2;i<tabela.rows.length;i++) {
			var row  = tabela.rows[i];
			var linha = row.getElementsByTagName("select");
	    	var select = linha[0];
	    	if(select.getAttribute("id") != "idStatusAprov"){
	    		RemoverItem(select);
			}
	    	i--; // nao tirar!!!!! a tabela fica menor
		} // for
	}
	*/
	
	// LIMPEZA TABELA APROVACAO - logica nova
	var tabela = document.getElementById("tbAprovacoes");
	if (tabela && tabela.rows.length > 2) {
		for (var i=2;i<tabela.rows.length;i++) {
			var row  = tabela.rows[i];
			var linha = row.getElementsByTagName("textarea");
	    	var select = linha[0];
			//console.log ("select: " + select );
			
			if(select.getAttribute("id") != "idObsAprov" || select.getAttribute("id") != "_idObsAprov"){
	    		//console.log ("remove!");
	    		RemoverItem(select);
			}
	    	i--; // nao tirar!!!!! a tabela fica menor
		} // for
	}
	
	
	document.getElementById("hiddenAprovadorDaVez").value == "";
	document.getElementById("hiddenNumTotAprovac").value == "";
	document.getElementById("hiddenNumeroDaVez").value == "";


} // fim function




function gravaSituacao(obj){
	
	if (obj.value == "3") {
		document.getElementById("hiddenRetornouRevisao").value = "Sim";
		if (document.getElementById("hiddenRetornouRevisaoPri").value == ""){
			document.getElementById("hiddenRetornouRevisaoPri").value = "Sim";
		}
	}
	else{
		document.getElementById("hiddenRetornouRevisao").value = "";
	}
		
} // fim function


function aguardeCentroCusto() {
	loading.show();
	setTimeout(verificaCentroCusto, 500);
}

function verificaCentroCusto(){
	
	// alimentando banco conforme os dados do fornecedor
	var cdEmp = document.getElementById("hiddenCodEmp").value;
	var cdFilial = document.getElementById("hiddenCodFilial").value;
	var cdCcusto = document.getElementById("codCentroCusto").value;

	var c1 = DatasetFactory.createConstraint("empresa", cdEmp, cdEmp,ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("filial", cdFilial,cdFilial, ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint("centrocusto", cdCcusto,cdCcusto, ConstraintType.MUST);
	var constraints1 = new Array(c1, c2, c3);
	var dsCentroCustoProtheus = DatasetFactory.getDataset("ds_centro_custo_protheus", null, constraints1, null);

	var property;
	var record;
	var nome;
	var ret;
	if (dsCentroCustoProtheus) {
		if (dsCentroCustoProtheus.values.length > 0) {
			for ( var x = 0; x < dsCentroCustoProtheus.values.length; x++) {
				record = dsCentroCustoProtheus.values[x];
				// cod
				property = "record[\"" + dsCentroCustoProtheus.columns[0] + "\"]";
				cod = eval(property);
				// descr
				property = "record[\"" + dsCentroCustoProtheus.columns[1] + "\"]";
				nome = eval(property);
				if (cod == "erro") {
					ret = 1;
				} 
				else {
					document.getElementById("codCentroCusto").value = cod;
					document.getElementById("nomeCentroCusto").value = nome;
					if (document.getElementById("codItemContabil").value != "" && document.getElementById("codClasse").value != "") {
						AguardeGestorAprovador("aprovador");
					}
				}
			}
		}
	}
	loading.hide();
	
	if (ret == 1){
		FLUIGC.toast({ title: 'Erro:', message: "Nao foi possivel verificar o centro de custo informado, verifique a Empresa Pagadora informada e tente novamente ou entre em contato com o Atendimento Tdi -Portais", type: 'danger' });
	}
	
	
}


function aguardeItemContabil() {
	loading.show();
	setTimeout(verificaItemContabil, 500);
}

function verificaItemContabil(){
	
	// alimentando banco conforme os dados do fornecedor
	var cdEmp = document.getElementById("hiddenCodEmp").value;
	var cdFilial = document.getElementById("hiddenCodFilial").value;
	var cdCcusto = document.getElementById("codCentroCusto").value;

	var c1 = DatasetFactory.createConstraint("empresa", cdEmp, cdEmp,ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("filial", cdFilial,cdFilial, ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint("centrocusto", cdCcusto,cdCcusto, ConstraintType.MUST);
	var c4 = DatasetFactory.createConstraint("itemcontabil", document.getElementById("codItemContabil").value, document.getElementById("codItemContabil").value, ConstraintType.MUST);
	var constraints1 = new Array(c1, c2, c3, c4);
	var dsItemContabilProtheus = DatasetFactory.getDataset("ds_item_contabil_protheus",null, constraints1, null);

	var property;
	var record;
	var nome;
	var ret;
	if (dsItemContabilProtheus) {
		if (dsItemContabilProtheus.values.length > 0) {
			for ( var x = 0; x < dsItemContabilProtheus.values.length; x++) {
				record = dsItemContabilProtheus.values[x];
				// cod
				property = "record[\"" + dsItemContabilProtheus.columns[0] + "\"]";
				cod = eval(property);
				// descr
				property = "record[\"" + dsItemContabilProtheus.columns[1] + "\"]";
				nome = eval(property);
				if (cod == "erro") {
					ret = 1;
				} 
				else {
					document.getElementById("codItemContabil").value = cod;
					document.getElementById("nomeItemContabil").value = nome;
					if (document.getElementById("codCentroCusto").value != "" && document.getElementById("codClasse").value != "") {
						AguardeGestorAprovador("aprovador");
					}
				}
			}
		}
	}
	loading.hide();
	
	if (ret == 1){
		FLUIGC.toast({ title: 'Erro:', message: "Nao foi possivel verificar o Item Contabil informado, verifique a Empresa Pagadora/Centro Custo informados e tente novamente ou entre em contato com o Atendimento Tdi -Portais", type: 'danger' });
	}
	
}

function aguardeClasse() {
	loading.show();
	setTimeout(verificaClasse, 500);
}

function verificaClasse(){
	// alimentando banco conforme os dados do fornecedor
	var cdEmp = document.getElementById("hiddenCodEmp").value;
	var cdFilial = document.getElementById("hiddenCodFilial").value;
	var cdCcusto = document.getElementById("codCentroCusto").value;
	var cdItemCtbl = document.getElementById("codItemContabil").value;

	var c1 = DatasetFactory.createConstraint("empresa", cdEmp, cdEmp,ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("filial", cdFilial,cdFilial, ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint("centrocusto", cdCcusto,cdCcusto, ConstraintType.MUST);
	var c4 = DatasetFactory.createConstraint("itemcontabil", cdItemCtbl,cdItemCtbl, ConstraintType.MUST);
	var c5 = DatasetFactory.createConstraint("classe", document.getElementById("codClasse").value, document.getElementById("codClasse").value, ConstraintType.MUST);
	var constraints1 = new Array(c1, c2, c3, c4, c5);
	var dsClasseProtheus = DatasetFactory.getDataset("ds_classe_protheus", null, constraints1, null);

	var property;
	var record;
	var nome;
	var ret;
	if (dsClasseProtheus) {
		if (dsClasseProtheus.values.length > 0) {
			for ( var x = 0; x < dsClasseProtheus.values.length; x++) {
				record = dsClasseProtheus.values[x];
				// cod
				property = "record[\"" + dsClasseProtheus.columns[0] + "\"]";
				cod = eval(property);
				// descr
				property = "record[\"" + dsClasseProtheus.columns[1] + "\"]";
				nome = eval(property);
				if (cod == "erro") {
					ret = 1;
				} 
				else {
					document.getElementById("codClasse").value = cod;
					document.getElementById("nomeClasse").value = nome;
					if (document.getElementById("codItemContabil").value != "" && document.getElementById("codCentroCusto").value != "") {
						AguardeGestorAprovador("aprovador");
					}
				}
			}
		}
	}
	loading.hide();
	
	if (ret == 1){
		FLUIGC.toast({ title: 'Erro:', message: "Nao foi possivel verificar Classe informada, verifique a Empresa Pagadora/Centro Custo/Item Contabil informados e tente novamente ou entre em contato com o Atendimento Tdi -Portais", type: 'danger' });
	}
	
}


var callbackform = {
	current: null,
	success: function(data) { callbackform.current(data); },
	error: function(jqXHR, textStatus, errorThrown) {
		console.log("callback error")
		console.log("jqXHR", jqXHR.responseJSON.message)
		FLUIGC.toast({ title: 'Erro:', message: jqXHR.responseJSON.message, type: 'danger' });
		callbackform.current(null);
	}		
}

var formpagamento = (function(){
	var loading = FLUIGC.loading(window);
	return {
		getmust: function(campo, valor) {
			return DatasetFactory.createConstraint(campo, valor, valor, ConstraintType.MUST);
		},
		getdepartamento: function(matricula,mailCurrentUser) {
			loading.show();
			var c = [formpagamento.getmust("colleaguePK.colleagueId", matricula)];
			var colaborador = DatasetFactory.getDataset("colleague", null, c, null);
			var record = colaborador.values[0]; // retorna lista de valores e posiciona na primeira posição
			console.log("#record.mail: "+record.mail);
			console.log("#record: "+JSON.stringify(record));
			var c1 = [formpagamento.getmust("mail", record.mail)];
			callbackform["current"] = formpagamento.readygetdepartamento;
			DatasetFactory.getDataset("dsHierarquiaCST", null, c1, null, callbackform);
		},
		readygetdepartamento: function(dataset) {
			console.log("readygetdepartamento", dataset)
			loading.hide();
			if (dataset && dataset.values.length > 0) {
				for (var x=0; x<dataset.values.length; x++) {
					var row = dataset.values[x];

					if (row["CODCCUSTO"] == "erro") {
						FLUIGC.toast({ title: 'Erro:', message: row["EMAIL_PARTICIPANTE"], type: 'danger' });
						return false;
					}
					
					$("#codDepartamento").val(row["CODCCUSTO"]);
					$("#nomeDepartamento").val(row["NOME_CCUSTO"]);
					
				}
			}
		}
	}
})();

