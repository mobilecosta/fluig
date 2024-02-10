var docsPrazoExpiracao = SuperWidget.extend({

    //método iniciado quando a widget é carregada
    init: function() {
    	this.calendario();
    	
    },
    docsPrazoExpiracaoChart: function(){
    	var chart = FLUIGC.chart('#docsPrazoExpiracao', {
    	    id: 'docsPrazoExpiracaoChart',
    	    width: '700',
    	    height: '200',
    	});
       
    	var data = [];
    	var dataset = this.consulta_kpi_proximo_expirar();
    	if($('[name="agruparPor"]').val() == "assuntos"){
    	for(var i = 0 ; i < dataset.values.length ; i++){
    		data.push({
    			value: dataset.values[i].count_et_cdAssunto,
    	        label: dataset.values[i].cdAssunto
    		});
    		}
    	}if($('[name="agruparPor"]').val() == "unidades"){
    	for(var i = 0 ; i < dataset.values.length ; i++){
    		data.push({
    		    value: dataset.values[i].count_et_idUnidade,
    		    label: dataset.values[i].idUnidade
    		});
    		}
    		
    	}

    	var polarChart = chart.polar(data, "");
    },
    
    consulta_kpi_proximo_expirar : function(){
    	var cs = []
    	
    	          cs.push(DatasetFactory.createConstraint('et.raiz', 91705, 91705, ConstraintType.MUST));
    						
    			if($('[name="agruparPor"]').val() == "assuntos"){
    			cs.push(DatasetFactory.createConstraint('groupby_et.cdAssunto', null, null, ConstraintType.MUST));
    			}
    			if($('[name="agruparPor"]').val() == "unidades"){
    	      cs.push(DatasetFactory.createConstraint('groupby_et.idUnidade', null, null, ConstraintType.MUST));
    			}
    			
    			var dataFinal = moment($("#dt_final").val()).format('YYYY-MM-DD');
    	         cs.push(DatasetFactory.createConstraint('dDocumento.dt_criacao',moment($("#dt_inicial").val()).format('YYYY-MM-DD'), moment($("#dt_final").val()).format('YYYY-MM-DD'), ConstraintType.MUST));
	
    	return DatasetFactory.getDataset('arquivo_kpi_proximo_expirar',[],cs,[]);
    },
    	calendario : function(){
    		var mySimpleCalendar = FLUIGC.calendar('#dt_inicial');
    		var mySimpleCalendar = FLUIGC.calendar('#dt_final');
    	},	
    //BIND de eventos
    bindings: {
        local: {
            
        },
        global: {
        	"carregar":["click_docsPrazoExpiracaoChart"]
        }
    },
 
    executeAction: function(htmlElement, event) {
    }

});


