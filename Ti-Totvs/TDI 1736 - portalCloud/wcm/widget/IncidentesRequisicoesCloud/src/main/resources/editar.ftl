<#if pageRender.isUserLogged()>
<#attempt>
<#include '/social_widget_logged.ftl'>

<div id="sociallogin_ftl" class="fluig-style-guide wcm-widget-class wcm_login wcm-widget-login super-widget" data-params="SocialLogin.instance()">

	<img data-update-image-profile="${user.login!''}" data-image-size="X_SMALL_PICTURE" src="/social/api/rest/social/image/profile/${user.login!''}/X_SMALL_PICTURE" class="img-rounded fluig-style-guide thumb-profile thumb-profile-xs">
	<div class="dropdown fs-display-inline-block">
		<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
			<span id="logged-user-name">${user.firstName!''} ${user.lastName!''}</span>
			<span class="fluigicon fluigicon-cog"></span>
			<span class="sr-only">Toggle Dropdown</span>
		</button>
		<ul class="dropdown-menu dropdown-menu-right" role="menu">
		<#if widgetRender.isUserLogged ()=true >
		    <#if user.getUserType() !=2>
                <li id="identity-context" style="display:none" data-choose-context><a href="#"><strong>${i18n.getTranslation('label.login.identity.context')}</strong></a>
                	<a id="identityUserContext" href="#"></a>
                </li>
                <li id="identity-app-company" style="display:none" data-choose-company><a href="#"><strong>${i18n.getTranslation('label.login.identity.company')}</strong></a>
                	<a id="identityAppCompany" href="#"></a>
                </li>
                <li id="identity-clear" style="display:none" class="divider"></li>

                <li data-login-config-list-itens data-page-alias="wcmuserpreferences"><a href="">${i18n.getTranslation('label.login.editprofile')}</a></li>
                <#if widgetRender.isEditMode()=true >
                    <#if pageService.isPossibleDeleteUnpublished(pageId)=true>
                        <li data-login-config-list-itens data-page-alias="wcm-discard-draft" data-href="${pageFriendlyURL}"><a href="">${i18n.getTranslation('label.login.discard.draft')}</a></li>
                    </#if>
                    <li data-login-config-list-itens data-page-alias="wcm-publish-page" data-href="${pageFriendlyURL}?edit=true"><a href="">${i18n.getTranslation('label.login.publish.page')}</a></li>
                    <li data-login-config-list-itens data-page-alias="wcm-view-history" data-href="${pageFriendlyURL}?edit=true"><a href="">${i18n.getTranslation('label.login.view.history')}</a></li>
                <#else>
                	<li data-edit-image-profile><a href="">${i18n.getTranslation('label.login.editimage')}</a></li>
                    <#if editablePage && pageRender.hasPermissionByCode('page.'+pageId,'pageUpdate')>
                        <li data-login-config-list-itens data-page-alias="wcm-edit" data-href="${pageFriendlyURL}?edit=true"><a href="">${i18n.getTranslation('label.login.edit')}</a></li>
                    </#if>
                </#if>
                <li class="divider"></li>
                <li data-login-config-list-itens data-page-alias="language"><a href="">${i18n.getTranslation('label.login.language')}</a></li>
                <li data-login-config-list-itens data-page-alias="pagehelp"><a href="">${i18n.getTranslation('label.login.help')}</a></li>
			</#if>
				<li class="divider"></li>
				<li  data-login-config-list-itens data-page-alias="logoff"><a href="">${i18n.getTranslation('label.login.signout')}</a></li>
			<#else>
				<form action="j_security_check" class="external-login">
					<table>
						<tr><td>${i18n.getTranslation('Username.Label')}</td><td>${i18n.getTranslation('Password.Label')}</td></tr>
						<tr>
							<td><input type="text" id="j_username" name="j_username"/></td>
							<td><input type="password" id="j_password" name="j_password"/></td>
						</tr>
					</table>
					<div style="text-align: right;">
						<input name="btn" type="button" value="${i18n.getTranslation('LogIn.Label')}" onclick="javascript:Login_login();">
					</div>
				</form>
			</#if>
		</ul>
	</div>

    <script type="text/template" class="tpl_select_identity_context" >
        <div id="identityCompany_{{instanceId}}" class="wcm-widget-class widget-select-identity widget-select-identity-{{type}} super-widget">
        	<div class="fluig-style-guide">
	            <ul>
	                {{#list}}
	                <li class="dialog-select-identity {{#selected}}bg-info{{/selected}} " data-id="{{id}}" data-select-{{type}} >{{displayName}}</li>
	                {{/list}}
	            </ul>
            </div>
        </div>
    </script>

</div>

<#recover>
	<#include "/social_error.ftl">
</#attempt>
</#if>
