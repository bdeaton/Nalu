console.log('app LOADING');
var Nalu = window.Nalu || {};
Nalu.App = Nalu.App || {};
Nalu.Specials = Nalu.Specials || {};
window.AppData = {};

Nalu.App = {
	init: function(){
		console.log('app.init');
		Nalu.App.setupListeners();
	},	

	setupListeners:function(){
		$(document).on("AppDataLoaded", Nalu.App.setupApp);
		$( document ).bind( "mobileinit", function() {
			// Make your jQuery Mobile framework configuration changes here!
			$.support.cors = true;
			$.mobile.phonegapNavigationEnabled = true;
			$.mobile.allowCrossDomainPages = true;
		});
		Nalu.App.setupApp();
	},	

	setupApp:function(){
		console.log('}}}}}}}}}}}}}}}}}} setupApp');
		Nalu.App.setupHandlers();
		Nalu.Specials.init();
	},	

	setupHandlers:function(){
		$('.header-primary .btn').on('click',function(){
			/*//
			var href = $(this).data('href');
			$(href).panel('open', {});
			//*/
			$( "#home-panel-menu" ).panel('open');
		});
		$( "#home-panel-menu" ).panel();
	}
	
};


