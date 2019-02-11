Main.Loader = {
	main: Main,
	
	init: function()
	{
		$(document.documentElement).addClass('prepare');
	},
	
	initFooter: function() {
		this.showLoader();
	},
	
	initLoad: function() {
		this.loaded();
	},
	
	showLoader: function()
	{
		//this.main.ScrollNav.scrollObj.scrollTop(0);
		
		if(!this.loader)
		{
			var cnt = $('<div class="loader-ov"/>').appendTo(document.body);
			
			this.loader = $('<div class="loader"/>').appendTo(cnt);
			
		}
		
		this._loading = true;
		
		$(document.body).addClass('loading');
		
		this.loader.show();
		
		this.progress();
		
		$(document.documentElement).removeClass('prepare');
	},
	
	_progr: 0,
	
	progress: function() {
		
		this._progr += 1;
		
		if(!this.loader)
			return;
		
		this.loader.css({
			backgroundPosition: this._progr + 'px 50%'
		});
		
		
		setTimeout(this.progress.bind(this), 16);
	},
	
	loaded: function()
	{
		this._loading = false;
		
		setTimeout(this.hideLoader.bind(this), 3000); //just in case
	},
	
	hideLoader: function()
	{
		if(this._loading)
			return;
		
		if(!this.loader)
			return;
		
		this.loader.parent().fadeOut('fast', function()
		{
			$(this).remove();
		});

		this.loader = false;
		
		this.prepareSequence();
		this.loadingSequence();
	},
	
	prepareSequence: function() {
		
		var shift = $('body').width() * Math.tan(8 / 180 * Math.PI);
		
		$('.tpl-home .slider').css({bottom: -shift / 2});
		
		$('nav.main').css({left: -56});
		$('.tpl-manifesto header .dbg').css({top: shift});
		$('.tpl-home header').css({top: -500});
		$('.tpl-home .slider').css({opacity: 0}).find('img').css({opacity: 0});
		$('.tpl-home ol').css({opacity: 0});
	},
	
	shift: 0,
	
	loadingSequence: function()
	{
		var spd = 500;
		
		$({})
		.queue(function(next) {
			$('nav.main').animate({left: 0}, spd, next);
		})
		.queue(function(next) {
			$('.tpl-home header').animate({top: 0}, spd, next);
		})
		.queue(function(next) {
			$('.tpl-home .slider').animate({opacity: 1}, spd, next);
		})
		.queue(function(next) {
			$('.tpl-home .slider img').animate({opacity: 1}, spd, next);
		})
		.queue(function(next) {
			$('.tpl-manifesto header .dbg').animate({top: 0}, spd, next);
		})
		.queue(function(next) {
			$('.tpl-home ol').animate({opacity: 1}, spd, next);
			
		})
		.queue(function(next) {
			$(document.body).removeClass('loading');
			next();
		})
		.delay(1000)
		.queue(function(next) {
			$(window).resize();
			
			this.main.runSliders();
			this.main.ScrollNav.hashControl();
		}.bind(this));
		
	}
	
};

Main.Loader.init();