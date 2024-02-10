let TABLES = {
		setTableOrderAndPaymentStatus: function(tableId,orderField,payment){
			let indexes = UTILS.getChildrenIndexes(tableId);
			let order = 1;
			
			for(let i=0;i<indexes.length;i++){
				if(payment){					
					if(i==0) 
						$("#nm_pago___"+indexes[i]).val("atual");
					else
						$("#nm_pago___"+indexes[i]).val("pendente");
				}
				$("#"+orderField+"___"+indexes[i]).val(order++);
			}
		},
		
		calculateTotalValueTable: function(tableId,fieldToSum){
			let indexes = UTILS.getChildrenIndexes(tableId);
			let total = 0;
			
			for(let i=0;i<indexes.length;i++){
				let value = ($("#"+fieldToSum+"___"+indexes[i]).val() == "") ? 0 : UTILS.moneyParser($("#"+fieldToSum+"___"+indexes[i]).val());
				total += value;
			}

			console.log('Valor total tabela produtos: ' + total)
			console.log('Valor total tabela produtos: ' + parseFloat(total.toFixed(2)))

			return parseFloat(total.toFixed(2));
		}

		, calculateProductBudget: function(obj,deleteRow){
			let objId = $(obj).prop("id");
			let branch = $("#cd_filial").val();
			let costCenter = $("#cd_centro_custo").val()[0];			
			let sharing = $("#ck_rateio").is(":checked");
						
			if(objId == "ck_rateio"){
				if(sharing){
					$("#nm_situacao_budget").val("Rateio");
				}else{
					if(branch != "" && costCenter != ""){
						let indexes = UTILS.getChildrenIndexes("tb_produtos");
						for(let i=0;i<indexes.length;i++){
							let thisAccount = $("#cd_conta_contabil___"+indexes[i]).val()[0];
							if(thisAccount != "" && thisAccount.charAt(0) == "4"){

								console.log("calculateProductBudget")
								console.log(branch, costCenter, thisAccount, indexes[i])

								TABLES.getBudgetFromFluigProcesses(branch, costCenter, thisAccount, indexes[i]);
							}
						}
					}
				} 
				
				return;
			}
			
			let index = objId != '' ? objId.split("___")[1]
				: $(obj).parents('tr').find('[name^="nr_produto___"]')
					.prop('id').split("___")[1];
			let thisAccount = $("#cd_conta_contabil___"+index).val()[0];	
						
			if(deleteRow) 
				fnWdkRemoveChild(obj);
			
			if(sharing){
				$("#nm_situacao_budget").val("Rateio");
			}else if(branch != "" && costCenter != "" && thisAccount != "" && thisAccount.charAt(0) == "4"){
				
				console.log("caiu no else")
				console.log(branch, costCenter, thisAccount, index)

				TABLES.getBudgetFromFluigProcesses(branch, costCenter, thisAccount, index);
			} else {
				$("#nm_situacao_budget_cc___"+index).val("ok");
				TABLES.setProductBudget();
			}	
		}
		
		, getBudgetFromFluigProcesses : function(branch, costCenter, account, index) {
			let constraints = [];
			constraints.push(DatasetFactory.createConstraint("cd_filial", branch, null, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint("cd_centro_custo", costCenter, null, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint("cd_conta_contabil", account, null, ConstraintType.MUST));
			DatasetFactory.getDataset("fluig_verifica_total_budget_filial1006", null, constraints, null, {
				success : function(data) {
					let fluigBudget = 0.0;
					if(data != null && data.values.length > 0) {
						fluigBudget = parseFloat(data.values[0].budget);
					}
					
					console.log("getBudgetFromFluigProcesses: " + fluigBudget)


					TABLES.checkBudget(branch, costCenter, account, fluigBudget, index);
				}, error : function(err) {
					console.error("Erro ao consultar budget de processos: " + err);
				}
			});			
		}
		
		, checkBudget : function(branch, costCenter, thisAccount, fluigBudget, index) {
			let constraints = [];
			constraints.push(DatasetFactory.createConstraint("cd_filial", branch, null, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint("cd_centro_custo", costCenter, null, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint("cd_conta_contabil", thisAccount, null, ConstraintType.MUST));
			
			DatasetFactory.getDataset("protheus_orcamento", null, constraints, null, {
				success : function(data) {
					let total = 0;
					if(data != null && data.values.length > 0) {
						let budget = parseFloat(data.values[0].Saldo) - fluigBudget;
						let indexes = UTILS.getChildrenIndexes("tb_produtos");
						
						for(let i=0;i<indexes.length;i++){
							if(thisAccount == $("#cd_conta_contabil___"+indexes[i]).val()[0]){
								let value = ($("#vl_produto___"+indexes[i]).val() == "") ? 0 : UTILS.moneyParser($("#vl_produto___"+indexes[i]).val());						
								total += value;
							}
						}

						console.log("protheus_orcamento IF")
						console.log('checkBudget: budget' + budget)
						console.log('checkBudget: total' + total)
						TABLES.setProductBudgetLine(index, total, budget, branch, costCenter, thisAccount);
					}else{

						console.log("protheus_orcamento ELSE")
						console.log('checkBudget: budget' + budget)
						console.log('checkBudget: total' + total)
						TABLES.setProductBudgetLine(index, total, null, branch, costCenter, thisAccount);
					}
				}, error : function(err) {
					TABLES.setProductBudgetLine(index, total, null, branch, costCenter, thisAccount);
					console.error("Erro ao consultar orçamento: " + id, err);
				}
			});	
		}

		, setProductBudgetLine: function(index, custo, budget, branch, costCenter, account){
			let situacao = (custo == null || budget == null) 
				? "indisponivel" : (parseFloat(custo.toFixed(2)) > budget) ? "indisponivel" : "ok";
			let houveAtualizacao = custo != parseFloat($('#vl_total_anterior').val());
			
			let situacaoFinal = (!houveAtualizacao) ? "ok" : situacao;
			$("#nm_situacao_budget_cc___"+index).val(situacaoFinal);
			
			if(houveAtualizacao){
				$("#rd_lancado_sim").val('');
				$("#rd_lancado_nao").val('');
				$('[name="_rd_lancado"]').attr('checked',false);
			}
			if(budget == null){
				FLUIGC.toast({
					title: '',
					message: 'Não foi possível resgatar o orçamento para a filial '+branch+', centro de custo '+costCenter+', e conta contábil '+branch,
					type: 'warning'
				});
			}
			TABLES.setProductBudget();
		}
		, setProductBudget: function(){
			let indexes = UTILS.getChildrenIndexes("tb_produtos");
			
			for(let i=0;i<indexes.length;i++){
				if($("#nm_situacao_budget_cc___"+indexes[i]).val() == "indisponivel"){
					$("#nm_situacao_budget").val("Indisponível");
					break;
				}else{
					$("#nm_situacao_budget").val("Orçamento OK");
				}
			}
		},
		setProductDefaultAccount: function(idx, account){
			if(account == null || account.trim() == "") return;
			
			let branch = $("#cd_filial").val();
			
			let constraints = [];
			constraints.push(DatasetFactory.createConstraint("branch", branch, null, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint("CT1_CONTA", account, null, ConstraintType.MUST));
			DatasetFactory.getDataset("protheus_conta_contabil", null, constraints, null, {
				success : function(data) {
					if(data != null && data.values.length > 0) {
						window["cd_conta_contabil___"+idx].setValue({ 
							"CodCT": data.values[0].CT1_CONTA
							,"NomeCT": data.values[0].CT1_DESC01
						});
						TABLES.calculateProductBudget($("#cd_conta_contabil___"+idx));
					}else{
						console.error("Erro ao consultar conta contábil: " + account, err);
					}
				}, error : function(err) {
					console.error("Erro ao consultar conta contábil: " + account, err);
				}
			});
		},
		customDeleteProduct: function(obj){
			TABLES.calculateProductBudget(obj,"delete")			
		}
}