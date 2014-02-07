var Nalu = window.Nalu || {};
Nalu.App = Nalu.App || {};
window.AppData = {};
Nalu.App = {
	init: function(){
		Nalu.App.setupListeners();
	},	

	setupListeners:function(){
		$(document).on("AppDataLoaded", Nalu.App.setupApp);
		Nalu.App.setupApp();
	},	

	setupApp:function(){
		console.log('}}}}}}}}}}}}}}}}}} setupApp');
		Nalu.App.setupHandlers();
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
$(function() {
	Nalu.App.init();
});
