<style type="text/css">
.line{
width:100%;
float:left;
margin-top:5px;
}
.part2{
  float:left;
}
.btn-abrir{
  background-color:transparent;border:1px solid white;height:3vh;font-size:12px; border-radius:30px;width:70%;margin-left:15%;margin-top:30px;display:flex;flex-direction:row; align-items:center; justify-content:center;
}

.botao{
vertical-align:middle;
width:11.5%;
margin-left:6px;
height:auto;
color:white;
text-align:center;
float:left;
margin-bottom:30px;
}
.wcm-all-content .wcm_widget {
    padding: 0px!important;
}
.botao img{
	width:100%;
}
.botao:hover{
 transform: scale(1.05);
cursor:pointer;
position: relative;
}
.footer{
margin-bottom:6vh;
}
p{
    padding: 0px!important;
}
</style>
<div id="IncidentesRequisicoesCloud" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
	<div class="line footer">
		<div class="botao" data-open-monitoramento-cloud>
			<img src="/IncidentesRequisicoesCloud/resources/images/consulta_cloud.png"></img>
		</div>
		
		<div class="botao" data-open-cloud-insights>
			<img src="/IncidentesRequisicoesCloud/resources/images/insigth_cloud.png"></img>
		</div>
		
		<div class="botao" data-open-cherwell>
			<img src="/IncidentesRequisicoesCloud/resources/images/cherwell.png"></img>
		</div>
		
		<div class="botao" data-open-zendesk>
			<img src="/IncidentesRequisicoesCloud/resources/images/zendesk.png"></img>
		</div>
		
		<div class="botao" data-open-tcloud>
			<img src="/IncidentesRequisicoesCloud/resources/images/tcloud.png"></img>
		</div>
		
		<div id="openFAQ" class="botao" data-open-faq>
			<img src="/IncidentesRequisicoesCloud/resources/images/faq_duvidas.png"></img>
		</div>

		<div class="botao" data-open-search-contato>
			<img src="/IncidentesRequisicoesCloud/resources/images/contatos.png"></img>
		</div>
		
		<div class="botao" data-open-utils>
			<img src="/IncidentesRequisicoesCloud/resources/images/link.png"></img>
		</div>
	</div>
	
</div>

<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>

<script type="text/template" id="templatePasso1">
    <tr>
        {{#ativo}}
            <td data-open-resposta style="font-weight: bold !important;font-size: 20px; height: 100px;"><img src="/escalonamentoCloud/resources/images/element.png" alt="">{{pergunta}}</td>
        {{/ativo}}
        {{^ativo}}<td style="display: none;"></td>{{/ativo}}
        <td>{{resposta}}</td>
    </tr>
</script>


