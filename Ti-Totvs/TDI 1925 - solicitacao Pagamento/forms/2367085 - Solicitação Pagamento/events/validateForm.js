function validateForm(form){
	log.info("#VALIDATEFORM - SOLICITAR PAGAMENTO");
	var numActivity 	= getValue("WKNumState");
	var numProxAct		= getValue("WKNextState");	
	var numSolicitacao = getValue("WKNumProces"); 
	var cdSolicitacao	 = form.getValue('cdSolicitacao');
	var mode = form.getFormMode();	
	var matriculaUsuario = form.getValue('matriculaUsuario');
	var tarCompleta 	= getValue("WKCompletTask");
	
	log.info("SOLICPAGAMENTO - VALIDATE FORM - INICIO - processo: " + numSolicitacao + "atividade: " + numActivity);
	
	var usuario     = getValue("WKUser");
	var senha       = getValue("WKUserPassword");

	var numcompany  = new java.lang.Integer(getValue("WKCompany")); 

	var dataHoje;
    var month;
	var day;
	var year;
	var dataPagto;
    var dataDem;
    var data;

    log.info("SOLICPAGAMENTO - VALIDATE FORM - INICIO - tarCompleta: " + tarCompleta);
    
    if (tarCompleta == "true"){
    	
    	log.info("SOLICPAGAMENTO - VALIDATE FORM - hiddenMobile: " + form.getValue('hiddenMobile'));

    	if (form.getValue('hiddenMobile') == "Mobile"){
    		throw "O processo de  Solicitacao de Pagamento nao esta disponivel via Mobile." +
    			  "Favor acessar o Fluig atraves de um desktop para acesso a este processo. Obrigado.!";
    	}
    	else{
		    if (numActivity == "1") {
			
				// JUSTIFICATIVA DO ITEM EH OBRIGATORIA
				// NATUREZA DO ITEM NAO EH OBRIGATORIA no inicio, apenas na geracao do titulo - atividade 5
				// data pagamento - deve ser o dia de hoje + 5 dias no minimo.
		
		
				if (form.getValue("codDepartamento") == null || form.getValue("codDepartamento") == "") {
					throw "E necessario informar o Departamento!";
				}
		
				if (form.getValue("areaSolic") == "x") {
					throw "E necessario informar a Area!";
				}
		
				if (form.getValue("razaoSocial") == null || form.getValue("razaoSocial") == "") {
					throw "E necessario informar a Empresa Pagadora!";
				}
		
				if (form.getValue("codCentroCusto") == null || form.getValue("codCentroCusto") == "") {
					throw "E necessario informar o Centro de Custo!";
				}

				if (form.getValue("codItemContabil") == null || form.getValue("codItemContabil") == "") {
					throw "E necessario informar o Item Contabil!";
				}

				if (form.getValue("codClasse") == null || form.getValue("codClasse") == "") {
					throw "E necessario informar a Classe!";
				}

				//if (form.getValue("IdDest") == null || form.getValue("IdDest") == "") {
				//	throw "E necessario informar o Destinatario da Despesa(Fornecedor)!";
				//}
		
			    if (form.getValue("idEmpresa") == null || form.getValue("idEmpresa") == "") {
					throw "E necessario informar a Razao Social ou Nome do Fornecedor!";
				}
			    
			    //if (form.getValue("cpfCnpjFornec") == null || form.getValue("cpfCnpjFornec") == "") {
			    //	throw "E necessário informar o cnpj/cpf do fornecedor!";
			    //}
			    
			    if (form.getValue("formaPagto") == "x" ) {
					throw "E necessario escolher uma opcao para o campo \"Forma de Pagamento\"!";
				}   	
				else if (form.getValue("formaPagto") == "1" || form.getValue("formaPagto") == "3") {
					if (form.getValue("Inform") == null || form.getValue("Inform") == "") {
						throw "Enecessario informar as informacoes complementares!";
					}
				}
				else if (form.getValue("formaPagto") == "2" ) {
					if (form.getValue("IdBanco") == null || form.getValue("IdBanco") == "") {
						throw "E necessario informar o banco!";
					}
					if (form.getValue("IdAg") == null || form.getValue("IdAg") == "") {
						throw "E necessario informar a Agencia!";
					}
					if (form.getValue("conta") == null || form.getValue("conta") == "") {
						throw "E necessario informar a Conta Corrente!";
					}
				}
							
				// VALIDACAO DATA - DEVE SER MAIOR QUE HOJE + 5 DIAS
		    	if (form.getValue("dataPagamento") == null || form.getValue("dataPagamento") == "") {
					throw "E necessario informar a data de pagamento!";
				}
				
			    // fim validacao data
				if (form.getValue("descricaoItem") == "x" ) {
					throw "E necessario escolher uma opcao  para o campo Item!";
				}
				
				if (form.getValue("mesReferencia") == "x" ) {
					throw "E necessario escolher uma opcao  para o campo Mes de Competencia!";
				}
		
				if (form.getValue("anoReferencia") == "x" ) {
					throw "E necessario escolher uma opcao  para o campo Ano de Competencia!";
				}
		
				if (form.getValue("justificativaItem") == null || form.getValue("justificativaItem") == "") {
					throw "E necessario informar uma justificativa para o Item escolhido!";
				}
				
				
				// tratamento  campo float:
		    	var cValorBruto = form.getValue("valorBruto");
		    	var cValorBruto = cValorBruto.substring(3,cValorBruto.length());
		    	log.info(" SOLICPAGAMENTO - VALIDATE FORM - cValorBruto:" + cValorBruto);
		    	
				if (cValorBruto == null || cValorBruto == "" || cValorBruto == "0,00") {
					throw "E necessario informar o valor bruto!";
				}
						
				if (form.getValue("hiddenAprovadorDaVez") == "") {
					throw "Por favor verifique dados de e-mail do destinatario e dos gestores. O retorno dos gestores nao esta sendo possivel. Favor entrar em contato com area CST ou abra um chamado para ti@totvs.com.br!.";
				}
				
		    } // fim if
		
		    if(numActivity == "247"){
		    	if (form.getValue("obsAvalPrimNivel") == "") {
					throw "É necessário informar a observação!";
				}
		    }
		    
		    if (numActivity == "155") {
		    	
		    	log.info ("SOLICPAGAMENTO - VALIDATE FORM - atividade 155 - hiddenNumeroDaVez: " + form.getValue("hiddenNumeroDaVez"));
		    	
		    	var numAprovacDavez = form.getValue("hiddenNumeroDaVez");
		    			    	
		    	
			} // fim ativ 155
		    
		    // FISCAL PA		    	
			if (numActivity == "55") {
				
				// Para todas as atividades
		    	if (form.getValue("retencao") == "x") {
					//throw "E necessario informar se o pagamento possui retencao de impostos!!";
				}
		    	
			}
		
			if (numActivity == "142") {
			
			}
			
			if (numActivity == "5") {
				
				if (form.getValue("hiddenEncontrouGroupSolicPag") == "Nao" ) {
				    throw "Prezado participante: Voce nao possui permissao a pasta de comprovantes deste fluxo, na pasta da area, e nao esta relacionado ao grupo PASTASOLICPAGTO. Favor solicitar junto a ao atendimento Fluig (via Chamado ou telefone suporte), para que vocÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âª possa finalizar esta solicitacao e gravar os dados de anexos e ficha na pasta da area. Obrigada";
				    	}

				// Para todas as atividades
		    	if (form.getValue("retencao") == "x") {
					throw "E necessario informar se o pagamento possui retencao de impostos!!";
				}
		    	
		    	if (form.getValue("statusCPGeraTitulo") == "x" || form.getValue("statusCPGeraTitulo") == null ) {
					throw "E necessario escolher uma opcao para o campo Situacao - na aprovacao da area Contas a Pagar!";
				}
		    	else if (form.getValue("statusCPGeraTitulo") != "1" ) {
		    		if (form.getValue("observacoesCPGeraTituloAprovac") == null || form.getValue("observacoesCPGeraTituloAprovac") == "") {
		    			throw "E necessario informar a justificativa da solicitacao!";
		    		}
				}
				
				var CPGeraTitulo = form.getValue("statusCPGeraTitulo");
		
		    	if (CPGeraTitulo == "1") {
		
			    	if (form.getValue("codNatureza") == null || form.getValue("codNatureza") == "") {
						throw "E necessario escolher a Natureza de Operacao!";
					}    	
			    	
			    	var vGerouManual = form.getValue("gerouManual");
	
			    	// CONFORME DEFINICAO DA BIANCA - CST - NAO DEVE SER SOLICITADO PREFIXO E TITULO NO GERA MANUAL = 1 = SIM.
		    		// A SOLICITACAO FICARAO SEM A INFORMAÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢O DE TITULO SE FOR MANUAL
		    		 
		    		if (vGerouManual == "2") {
			    		
				    	if (form.getValue("codPrefixo") == null || form.getValue("codPrefixo") == "") {
							throw "E necessario informar o prefixo!";
						}
				    	
			    		if (form.getValue("descricaoItem") == "00") {
			    			if (form.getValue("codPortador") == null || form.getValue("codPortador") == "") {
			    				throw "E necessario informar o Portador!";
			    			}
			    		}
			    	
			    		if (form.getValue("descricaoItem") == "00" && form.getValue("formaPagto") == "1") {
			    			if (form.getValue("codBarras") == null || form.getValue("codBarras") == "") {
			    				throw "E necessario informar o Codigo de Barras!";
			    			}
			    		}
				    	
				    	if (form.getValue("numTitulo") == null || form.getValue("numTitulo") == "") {
							throw "E necessario realizar a geracao do titulo!";
						}
				    	
				    	// VALIDACAO NUMERO DE TITULO
				    	
				    	//ACIONA WEBSERVICE TITULO PARA VERIFICAR SE EXISTE.
				    	
				    	log.info(" SOLICPAGAMENTO - VALIDATE FORM - VALIDACAO TITULO INFORMADO - PTO 1");
				    	var cdEmpPag   = form.getValue("hiddenCodEmp"); // empresa pagadora
				    	var cdFilial   = form.getValue("hiddenCodFilial"); // empresa pagadora
				    	var cdTitulo   = form.getValue("numTitulo");
				    	var cdPrefixo  = form.getValue("codPrefixo");
				    	var cnpjFornec = form.getValue("cpfCnpjFornec"); // cnpj fornecedor
				
				    	log.info(" SOLICPAGAMENTO - VALIDATE FORM - VALIDACAO TITULO INFORMADO - PTO 1.5: " +
				    			 " cdEmpPag: " + cdEmpPag +
				    			 " cdFilial: " + cdFilial +
				    			 " cdTitulo: " + cdTitulo +
				    			 " cdPrefixo: " + cdPrefixo +
				    			 " cnpjFornec: " + cnpjFornec);
				    	
				    	var c1 = DatasetFactory.createConstraint("C_EMPRESA", cdEmpPag, cdEmpPag, ConstraintType.MUST);
				    	var c2 = DatasetFactory.createConstraint("C_FILIAL", cdFilial, cdFilial, ConstraintType.MUST);
				    	var c3 = DatasetFactory.createConstraint("C_TITULO", cdTitulo, cdTitulo, ConstraintType.MUST);
				    	var c4 = DatasetFactory.createConstraint("C_PREF", cdPrefixo, cdPrefixo, ConstraintType.MUST);
				    	var c5 = DatasetFactory.createConstraint("C_CNPJ", cnpjFornec, cnpjFornec, ConstraintType.MUST);
				    	var constraints1 = new Array(c1,c2,c3,c4,c5);
				    	var dsConsultaTituloProtheus = DatasetFactory.getDataset("dsConsultaTituloProtheus", null, constraints1, null);
				    	
				    	log.info(" SOLICPAGAMENTO - VALIDATE FORM - VALIDACAO TITULO INFORMADO - PTO 2: " + dsConsultaTituloProtheus.rowsCount);
				    	
				    	var property ;
				    	var record;
				    	var cdCodigoFornecRet;
				    	var cdLojaFornecRet;
				    	var cdTituloRet;
				    	var cdParcelaRet;
				    	var cdPrefixoRet;
				    	var valorTituloRet;
				    	var cdtipo;
				    	var ret;
				    	
				    	if (dsConsultaTituloProtheus != null) {
				    		for (var x = 0; x < dsConsultaTituloProtheus.rowsCount; x++) {
				    			
				    				cdCodigoFornecRet = dsConsultaTituloProtheus.getValue(x,"CE_CODIGO");
				    				cdLojaFornecRet = dsConsultaTituloProtheus.getValue(x,"CE_LOJA");
				    				cdTituloRet = dsConsultaTituloProtheus.getValue(x,"CE_NUMTIT");
				    				cdParcelaRet = dsConsultaTituloProtheus.getValue(x,"CE_PARCELA");
				    				cdPrefixoRet = dsConsultaTituloProtheus.getValue(x,"CE_PEFIXO");
				    				cdtipo = dsConsultaTituloProtheus.getValue(x,"CE_TIPO");
				    				valorTituloRet = dsConsultaTituloProtheus.getValue(x,"CE_VALOR");
				
				    				log.info(" SOLICPAGAMENTO - VALIDATE FORM - PTO 3 - " +
				    						 " cdCodigoFornecRet: " + cdCodigoFornecRet +
				    						 " cdLojaFornecRet: " + cdLojaFornecRet +
				    						 " cdTituloRet: " + cdTituloRet +
				    						 " cdParcelaRet: " + cdParcelaRet +
				    						 " cdPrefixoRet: " + cdPrefixoRet +
				    						 " cdtipo: " + cdtipo +
				    						 " valorTituloRet: " + valorTituloRet );
				    				
				    			if (cdCodigoFornecRet == "" || cdCodigoFornecRet == "Erro"){
				    				ret = 1;
				    				log.info(" SOLICPAGAMENTO - VALIDATE FORM - VALIDACAO TITULO INFORMADO - PTO 4 - NAO ENCONTRADO TITULO");
				    			} 
				    			else{ 
				    				ret = 0;
				    				log.info(" SOLICPAGAMENTO - VALIDATE FORM - VALIDACAO TITULO INFORMADO - PTO 5 - ENCONTRADO TITULO");
				    			}
				    		} // for
				    	} // if
					
						if (ret == 1){
							log.info(" SOLICPAGAMENTO - VALIDATE FORM - VALIDACAO TITULO INFORMADO - TITULO NAO ENCONTRADO");
							throw "Titulo nao encontrado, favor verificar dados de prefixo e numero do titulo!";
						}
				    	
			    	} //if (vGerouManual == "2") {
			    
		    		
		    		
			    	
		    	} // if status == 1
				
		    	// FIM VALIDACAO
		    	
		    	log.info("SOLICPAGAMENTO - VALIDATE FORM - FIM ");
			} // fim atividade 5
			
    	} // else mobile = ""
    } // fim tarCompleta
} // FIM FUNCTION