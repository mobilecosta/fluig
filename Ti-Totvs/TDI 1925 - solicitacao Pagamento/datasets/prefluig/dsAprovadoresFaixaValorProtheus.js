function createDataset(fields, constraints, sortFields) {
	log.info (" ### novo 18/08 DATASET dsAprovadoresFaixaValorProtheus - INICIO!! - ####");
	//servico FLUIG
	try{
		// Cria o dataset
		var newDataset = DatasetBuilder.newDataset();
	
		newDataset.addColumn("CK_CPFAPRO");	  	// COLUNA 0 
		newDataset.addColumn("CK_EMAIL");	  	// COLUNA 1
		newDataset.addColumn("CK_NMAPROV");		// COLUNA 2
		newDataset.addColumn("CK_CARGOAPR");	// COLUNA 3
		newDataset.addColumn("CK_NIVEL");		// COLUNA 4
		newDataset.addColumn("CK_VLRMIN");		// COLUNA 5
		newDataset.addColumn("CK_VLRMAX");		// COLUNA 6
		
		log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 1");
		
		var integracao = ServiceManager.getService('FLUIG4V2');
		log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 2 - getService ok");
		
		//2- Locator
		// TESTE
		//var serviceLocator = integracao.instantiate('_197._102._16._172.FLUIGLocator');
	
		//PRODUCAO 
		//var serviceLocator = integracao.instantiate('br.com.totvs.wsautoatendimento.wscorp.FLUIGLocator');
		
		// com o pacote pkgWkfSolicPagamento definido
		//var serviceLocator = integracao.instantiate('pkgWkfSolicPagamento.FLUIGLocator');
		var serviceLocator = integracao.instantiate('pkgWkfSolicPagamento.FLUIG');		
		
		log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 3 - instantiate ok");
		
		//3- metodo dentro do Locator - Soap
		var service = serviceLocator.getFLUIGSOAP();
		log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 4 - getFLUIGSOAP ok");
		
		var cdEmpresa = "";
		var cdFilial = "";
		//var cdCpf = "";
		var cdCcusto = "";
		var cdItemCtbl = "";
		var cdValor = "";
		var emailSolic = "";
		var codClasse = "";

		
		if (fields) {
			log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 4.1");
			if (fields[0] != null){
				cdEmpresa 	= fields[0]; 			// enviado pelo custom.js - 0 eh conteudo, 1 é nome campo
				cdFilial 	= fields[2]; 	
				//cdCpf 		= fields[4]; 			
				cdCcusto 		= fields[4];
				cdItemCtbl 	= fields[6];
				cdValor 	= fields[8];
				emailSolic 	= fields[10];
				codClasse = fields[12];
				
				log.info ("DATASET dsAprovadoresFaixaValorProtheus - DADOS 1 : " + "cdEmpresa: " + cdEmpresa + "cdFilial: " + cdFilial + "cdCcusto: " + cdCcusto +"cdItemCtbl: " + cdItemCtbl +"cdValor: " + cdValor +"emailSolic: " + emailSolic + "codClasse: " + codClasse);
			}
		}		
		else if (constraints != null) {
			log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 4.2");
			cdEmpresa 	= constraints[0].getInitialValue(); 
			cdFilial 	= constraints[1].getInitialValue();
			//cdCpf 	 	= constraints[2].getInitialValue();
			cdCcusto 	 	= constraints[2].getInitialValue();
			cdItemCtbl 	 	= constraints[3].getInitialValue();
			cdValor 	= constraints[4].getInitialValue();
			emailSolic 	= constraints[5].getInitialValue();
			codClasse 	= constraints[6].getInitialValue();
			
			log.info (	"DATASET dsAprovadoresFaixaValorProtheus - DADOS 2 : " +
					"cdEmpresa: " + cdEmpresa +
					" | cdFilial: " + cdFilial +
					" | cdCcusto: " + cdCcusto +
					" | cdItemCtbl: " + cdItemCtbl +
					" | codClasse: " + codClasse +
					" | cdValor: " + cdValor +
					" | emailSolic: " + emailSolic
					);
		}

		//TESTE
//		cdEmpresa = "00";
//		cdFilial = "00001000100";
//		cdCcusto = "TRB300TRL";
//		cdItemCtbl = "0400";
//		codClasse = "T0117";
//		cdValor = "1000";
//		emailSolic = "paulo.rsouza@totvs.com.br";
		
		log.info (	"DATASET dsAprovadoresFaixaValorProtheus - DADOS 3 : " +
				"cdEmpresa: " + cdEmpresa +
				" | cdFilial: " + cdFilial +
				" | cdCcusto: " + cdCcusto +
				" | cdItemCtbl: " + cdItemCtbl +
				" | codClasse: " + codClasse +
				" | cdValor: " + cdValor +
				" | emailSolic: " + emailSolic
				);

		//teste
		//newDataset.addRow(new Array("02853029905","cristina.poffo@totvs.com.br","CRISTINA M POFFO", "80","1","100","1000"));
		// newDataset.addRow(new Array("xxxxxxxxx","gisele.lima@totvs.com.br","gisele.lima", "80","1","100","1000"));
		
		// chamada antes T12
		//var retorno = service.APROVSP(cdEmpresa,cdFilial,cdCpf,parseFloat(cdValor));
		
		//alterados parametros para o T12	
		//Empresa, Filial, Centro de Custo, Item Contábil, Valor
		//var retorno = service.APROVSP(cdEmpresa,cdFilial,cdCcusto,cdItemCtbl,parseFloat(cdValor),emailSolic);
		var retorno = service.aprovsp(cdEmpresa, cdFilial, cdCcusto, cdItemCtbl, codClasse, parseFloat(cdValor), emailSolic);
		
		log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 5 - APROVSP ok - retorno:" + retorno );
		
		var arrayListaPr = retorno.getLISTAPR();


		if (arrayListaPr){
			log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 5.1 - APROVSP ok - arrayListaPr.size():" + arrayListaPr.size() );
			if (arrayListaPr.size() > 0) {
				log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 6 - getLISTAPR ok - arrayListaPr.size(): " + arrayListaPr.size());
			    
				for (var i = 0; i < arrayListaPr.size(); i++) {
					var r = arrayListaPr.get(i);
					log.info ("DATASET dsAprovadoresFaixaValorProtheus - PTO 6.5 " +
							  "- getCK_CPFAPRO: " + r.getCKCPFAPRO() + 
							  "- getCK_EMAIL: " + r.getCKEMAIL() +
							  "- getCK_NMAPROV: " + r.getCKNMAPROV() +
							  "- getCK_CARGOAPR: " + r.getCKCARGOAPR() +
							  "- getCK_NIVEL: " + r.getCKNIVEL() +
							  "- getCK_VLRMIN: " + r.getCKVLRMIN() +
							  "- getCK_VLRMAX: " + r.getCKVLRMAX() 
							 );
					
					newDataset.addRow(new Array(r.getCKCPFAPRO(),
												r.getCKEMAIL(),
												r.getCKNMAPROV(),
												r.getCKCARGOAPR(),
												r.getCKNIVEL(),
												r.getCKVLRMIN(),
												r.getCKVLRMAX()
												)
									 );
				}
			}
		}
		
		
		log.info ("DATASET dsAprovadoresFaixaValorProtheus PTO 7 - FIM OK");
	
	} // try 
	catch(error) {
		log.info (" ++ DATASET dsAprovadoresFaixaValorProtheus - PTO 8 - ERRO:  " + error.message);
		newDataset.addRow(new Array("erro", error.message, "erro", "erro", "erro", "erro", "erro")); 
	}

	return newDataset;

}