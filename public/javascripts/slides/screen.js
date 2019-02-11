Main.Screen = {
	
	main: Main,
		
	init: function() {
		$(window).resize(this.update.bind(this));
		
		this.is_mob_safari = !!navigator.userAgent.match(/(iPod|iPhone|iPad)/i);
		
		this.is_android = !!navigator.userAgent.match(/(Android)/i);
		
		this.is_ios7 = !!navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i);
		
		var html = document.documentElement;
		
		if(this.is_mob_safari)
			html.className += ' mob-safari';
		
		if(this.is_android)
			html.className += ' mob-android';
		
		this.setPageZoom();
		
		this.fixMobSafariBar();
	},
	
	is_mob_safari: false,
	
	is_android: false,
	
	isTouch: function(){
		return this.is_mob_safari || this.is_android;
	},
	
	initFooter: function() {
		this.update();
	},
	
	old: '',
	
	update: function() {
		var w = $(document.body).width();
		
		var html = document.documentElement;
		
		if(w < 720)
		{
			cur = 'small';
		}
		else if(w < 1024)
		{
			cur = 'mid';
		}
		else
		{
			cur = 'big';
		}
		
		if(this.old != cur)
		{
			this['set_' + cur]();
			
			this.old = cur;
			html.className = html.className.replace(/scr-([^ ]+)/, '') + ' scr-' + cur; 
		}
	},
	
	set_small: function() {
		this.main.ScrollNav.scroll_fix = 2;
		this.main.ScrollNav.prevent_scroll_jump = true;
		//this.main.prevent_slideshow = true;
		//this.main.stopSliders();
		
	},
	
	set_mid: function() {
		this.main.ScrollNav.prevent_scroll_jump = (this.is_mob_safari || this.is_android);
		this.main.ScrollNav.scroll_fix = -10;
		this.main.prevent_slideshow = false;
		this.main.runSliders();
	},
	
	set_big: function() {
		this.main.ScrollNav.prevent_scroll_jump = (this.is_mob_safari || this.is_android);
		this.main.ScrollNav.scroll_fix = -10;
		this.main.prevent_slideshow = false;
		this.main.runSliders();
	},
	
	isMobile: function() {
		return this.old == 'small';
	},
	
	
	fixMobSafariBar: function() {
		$(window).load(function() {
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 1);
		});
	},
	
	setPageZoom: function()
	{
		
		var zoom = window.innerWidth / 640;
		
		//console.log('sdfsdf: ' + window.innerWidth);
		
		if(zoom >= 1 || window.innerWidth > 700)
		{
			zoom = 1.0;
		}
		else
		{
			this._is_mobile = true;
			
			this.fixZoom = function() {
				
				//console.log(window.innerWidth);
				//console.log(this.zoomLevel());
				
				if(window.innerWidth != 640 && !this._fix_zoom)
				{
					this.setDefaultViewport();						
					this._fix_zoom = true;
					
					setTimeout(arguments.callee.bind(this), 10);
				}
				else if(this._fix_zoom)
				{
					this._fix_zoom = false;
					
					this.setScaledViewport();
				}
			};
		}
		
		if(zoom < 1)
			this.setScaledViewport();	
	},
	
	setDefaultViewport: function() {
		this.setViewport({width: 'device-width', initial_scale: 1, maximum_scale: 1});
	},
	
	_is_mobile: false,
	
	setScaledViewport: function() {
		
		var zoom = window.innerWidth / 640;
	
		if(zoom < 0.5)
		{
			zoom = 0.5;
		}
		
		this.setViewport({width: 640, initial_scale: zoom, maximum_scale: zoom});
	},
	
	setViewport: function(data) {
		
		var args = [];
		
		$.each(data, function(k, i)
		{
			args.push(k.replace(/_/g, '-') + '=' + i);
		});
		
		$('meta[name=viewport]').attr('content', args.join(','));
	},
	
	zoomLevel: function()
	{
		return document.documentElement.clientWidth / window.innerWidth;
	}
	
};

Main.Screen.init();