console.log('specials LOADING');
Nalu.Specials = {
	init: function(){
		console.log('specials.init');
		Nalu.Specials.setupHandlers();
	},	

	setupHandlers:function(){
		$('#list-specials li .item-header').on('click',function(){
			var $this = $(this);
			var $li = $this.parent('li');
			$li.toggleClass('item-open');
		});
	}
	
};


