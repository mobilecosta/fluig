<div id="WidgetNotas_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="WidgetNotas.instance()">
	<div id="tituloNotas">
	</div>
	<div class="row">
		<div class="col-md-12">
			<div id="listaPedidosConteudo">
			</div>
		</div>
	</div>

</div>

<script type="text/javascript" src="/fluighub/assets/js/fluighub.js"></script>
<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>

<script type="text/template" id="tplListaPedidos">
	<tr>
		<td>{{idRazao}}</td>
		<td>{{idRazao}}</td>
		<td>{{idRazao}}</td>				
		<td align="center">{{solicitacao}}</td>
		<td align="center">{{idCompetencia}}</td>
		<td align="center"><span class="cnpj text-nowrap">{{idCNPJ_TOTVS}}</span></td>
		<td align="center">{{idFILIAL_TOTVS}}</td>
		<td align="center">{{idNome_FILIAL_TOTVS}}</td>
		<td>{{idCanal}}</td>	
		<td align="center">{{idFornecedor_nome}}</td>
		<td align="center">{{idPedido}}</td>
		<td align="center">{{parseDataPagamento}}</td>
		<td align="right"><span class="moeda">{{idValor}}</span></td>
		<td align="center">
			<span class="label label-{{tipoLabel}}">{{localizacao}}</span>
		</td>
		<td>
		{{#anexo}}
			<i class="flaticon flaticon-paperclip icon-md" data-toggle="tooltip" data-placement="left" title="Anexar notas"
				solicitacao="{{solicitacao}}" observacao="{{ObsContasPagar}}" localizacao="{{localizacao}}" data-anexar-modal></i>
		{{/anexo}}
		</td>
	</tr>
</script>

<script type="text/template" id="tplCabecalho">
	<div class="row">
		<div class="col-md-4">
			<small>
				<strong>CNPJ CANAL</strong>
			</small>
			<br/>
			<h4>{{idCNPJ_canal}}</h4>
		</div>
		<div class="col-md-4">
			<small>
				<strong>CÓDIGO DO FORNECEDOR</strong>
			</small>
			<br/>
			<h4>{{idCodigo_fornecedor}}</h4>
		</div>
		<div class="col-md-4">
			<small>
				<strong>RAZÃO SOCIAL</strong>
			</small>
			<br/>
			<h4>{{idRazao}}</h4>
		</div>
	</div>
</script>

<script type="text/template" id="tplListaPedidosConteudo">
	<div class="panel panel-default fs-md-margin-left fs-md-margin-right">
		<div class="panel-body">
			<div class="row">
				<div class="col-md-12">
					<div id="cabecalhoPedidos">
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="panel panel-default fs-md-margin-left fs-md-margin-right">
		<div class="panel-body">
			<div class="row">
				<div class="col-md-12">
					<div id="listaPedidos">
					</div>
				</div>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="tplLogin">
	<div class="row box-login-parent">
		<div class="box-login">
			<div class="fs-text-center login-logo">
				<img width="200px" src="/notas/resources/images/logo.png"></img>
			</div>
			<div class="form-group">
				<label for="CNPJ">CNPJ</label>
				<input type="text" class="form-control" id="CNPJ"></input>
			</div>
			<div class="form-group">
				<label for="senha">Senha</label>
				<input type="password" class="form-control" id="senha"></input>
			</div>
			<div>
				<button type="button" class="btn btn-info fs-full-width" data-login>Acessar</button>
			</div>
		</div> 
	</div>
</script>

<script type="text/template" id="tplModalAnexo">
	<div class="row">
		<div class="col-md-12 alerta-inconsistencia fs-display-none">
			<div class="alert alert-warning" role="alert">
				<h4><b>Atenção:</b></h4>
				{{observacao}}
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<input type="hidden" id="solicitacao" value="{{solicitacao}}"/>
			<input type="hidden" id="arquivos"/>
			<input type="file" class="btn btn-primary btn-sm" title="Anexar nota fiscal" id="anexoProcesso" accept="image/*,.pdf" data-anexar/>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<label for="observacaoUsuario"> Observação: </label><br>
			<textarea name="observacaoUsuario" id="observacaoUsuario" cols="75" rows="3"></textarea>
		</div>
	</div>
	<div class="row">
		<div id="listaAnexos">
		</div>		
	</div>
</script>

<script type="text/template" id="tplAnexo">
	<div class="col-md-12 anexo-{{idDocumento}} fs-sm-margin-top">
		<div idDocumento="{{idDocumento}}" class="fs-full-width label-anexo fs-sm-padding-left fs-sm-padding-right fs-xs-padding-bottom fs-xs-padding-top">
			<span>{{documento}}</span>
			<i class="flaticon flaticon-close icon-xs fs-cursor-pointer fs-float-right fs-xs-margin-top fs-font-bold" 
			data-toggle="tooltip" data-placement="top" title="Remover anexo" data-remove-anexo></i>
		</div>
	</div>
</script>

<script type="text/template" id="tplTitulo">
	<nav class="navbar navbar-default" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand" href="#">
					<img width="120px" src="/notas/resources/images/logo.png"></img>
				</a>
			</div>
			<div class="collapse navbar-collapse">
				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="flaticon flaticon-settings icon-md"></i> <span class="caret"></span></a>
						<ul class="dropdown-menu" role="menu">
							<#if pageRender.isUserLogged() && pageRender.isUserAdmin()>
							<li><a href="#" data-editar-pagina>Editar página</a></li>
							<li class="divider"></li>
							</#if>
							<li><a href="#" data-logout>Sair</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</script>