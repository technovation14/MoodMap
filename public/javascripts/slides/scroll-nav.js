Main.ScrollNav =
{
	main: Main,

	scrollSel: 'body',
	scrollObj: null,
	scroll_fix: -10,
	height_fix: 0,

	initFooter: function() {
		if($.browser.mozilla || $.browser.msie)
			this.scrollSel = 'html,' + this.scrollSel;

		this.scrollObj = $(this.scrollSel);

		this.setupMenu();
		this.setupSections();
		this.setupSectionNav();

		this.scrollObj.scrollTop(0);

		this.get404();

		/*
		this.__defineGetter__('_scroll', function(){
	        return this.__scroll;
	    });

		this.__defineSetter__('_scroll', function(val){
	        this.__scroll = val;

	        console.trace();
	    });
		*/
	},

	initLoad: function() {
	


	},

	setupSections: function() {

		$('section').each(function(i)
		{
			$(this).attr('id', $(this).attr('id') + '_').data('ind', i);
		});
	},

	setupSectionNav: function()
	{
		$('.next-sect, .collection-link').click(function() {
			setTimeout(this.hashControl.bind(this), 10);
		}.bind(this));
	},

	setupMenu: function() {
		var self = this;

		$('nav.main .nav a').on('click',function(e, is_scroll)
		{
			e.preventDefault();

			self.goToPage(this.hash);

			return true;
		});


		$('nav.main').show();

		var h = $('nav .cn').height();

		$('nav.main .cn').css({marginTop: -h / 2});

		$('nav.main').attr('style', ' ');

		$('nav.main li').each(function(i, item) {

			var spd = 600;

			$(item).on('ft.anim-in', function(e) {
				$(e.target).find('em, span').stop().css({width: 'auto'}).animate({opacity: 1}, spd);

				return true;
			}.bind(this))
			.on('ft.anim-out', function() {

				var items = $(this).hasClass('active')? $(this).find('span'): $(this).find('em,span');

				items.stop().animate({opacity: 0}, spd, function() {
					$(this).css({width: 0});
				});

				return true;
			});

			if(this.main.Screen.isTouch())
				return;

			$(item).hover(function() {
				$(this).trigger('ft.anim-in');
			},
			function() {
				$(this).trigger('ft.anim-out');
			});
		}.bind(this));
	},

	menuItemActivate: function(item) {

		item.parent().find('li').removeClass('active').trigger('ft.anim-out');

		$({})
		.queue(function(next) {
			item.addClass('active').trigger('ft.anim-in');
			next();
		})
		.delay(this.main.Screen.isTouch()? 4000: 1200)
		.queue(function() {
			item.trigger('ft.anim-out');
		});
	},


	_h_change: 0,

	min_height: 640,
	no_scroll_jump: false,
	prevent_scroll_jump: false,

	current_height: 0,
	current_width: 0,
	_check_again: 0,

	setupSectionHeight: function(no_hash_check) {

		if(this._check_again)
			clearTimeout(this._check_again);

		var w_h = this.windowHeight();

		if(w_h < this.min_height)
		{
			this.no_scroll_jump = true;
			w_h = this.min_height;
		}
		else
			this.no_scroll_jump = false;

		var w_w = $('section').width();

		var h_changed = false;
		var w_changed = false;

		if(this.current_height != w_h)
		{
			//this._scroll = true;

			this.current_height = w_h;

			h_changed = true;
		}

		if(this.current_width != w_w)
		{
			this.current_width = w_w;
			w_changed = true;
		}

		if(h_changed || w_changed)
		{
			this.main.Sections.onResize(w_w, w_h);
			this.main.Paralax.onResize(w_w, w_h);
		}

		if(!h_changed && !w_changed)
			return;


		if(this._h_change)
			clearTimeout(this._h_change);

		this._check_again = setTimeout(function()
		{
			this.setupSectionHeight(false);
		}.bind(this), 500);

		if(!no_hash_check)
		{
			this._h_change = setTimeout(function()
			{
				this.hashControl();
			}.bind(this), 500);
		}
	},

	windowHeight: function() {
		if(this.main.Screen.is_ios7)
			return Math.min(window.innerHeight, window.outerHeight) + this.height_fix;


		return Math.max(window.innerHeight || 0, $(window).height()) + this.height_fix;
	},

	goToPage: function(hash)
	{
		location.hash = hash;
	},

	no_scroll: false,

	setNav: function(hash)
	{
		if(location.hash.replace('#', '') == hash)
			return;

		this.no_scroll = true;
		this.goToPage(hash);
	},

	_scroll_stop: 0,

	hashControl: function()
	{
		var hash = location.hash;

		if(!hash || hash == '#')
			hash = '#home';

		//console.log('hhh:' + hash);

		if(this._scroll && this._scrolling_to == hash)
			return;

		if(this._scroll_stop)
			clearTimeout(this._scroll_stop);

		this._scroll = true;

		this._scrolling_to = hash;

		hash = hash.replace(/\//g, '--');

		var section = $(hash + '_');

		if(!section.length)
		{
			this.show404();
			//this._scroll = false;
			return;
		}


		if(this.is_404)
			this.hide404();


		this.menuItemActivate($('nav.main a[href=' + hash + ']').parent());

		if(this.no_scroll)
		{
			this._scroll = false;
			this.no_scroll = false;
			this.trackPageview(hash.replace('#', ''));
			return;
		}

		//console.log('hc: '+ hash);

		this.scrollObj.stop()
		.animate(
		{
			scrollTop: section.offset().top + this.scroll_fix //this.windowHeight() * section.data('ind')

		}, 1200, /*'easeInOutExpo'*/ 'easeOutQuad', function()
		{
			this.trackPageview(hash.replace('#', ''));

			if(this._scroll_stop)
				clearTimeout(this._scroll_stop);

			this._scroll_stop = setTimeout(function() {
				this._scroll = false;
			}.bind(this), 500);

		}.bind(this));
	},

	_scroll_dir: 0,
	_scroll_top: false,
	_scroll_int: 0,
	_scroll: true,
	_scroll_m: false,

	_mouse_scroll: false,

	mouseDown: function()
	{
		this._scroll_m = true;
		this._mouse_scroll = this.scrollObj.scrollTop();
	},

	mouseMove: function()
	{

	},

	mouseUp: function()
	{
		this._scroll_m = false;

		if(this.scrollObj.scrollTop() != this._mouse_scroll)
		{
			this._scroll_top = this._mouse_scroll;
			this.checkScroll();
		}
	},

	wheel: function(e)
	{
		if(this._scroll || this._scroll_m)
		{
			return false;
		}
	},

	_menu_pos: 0,

	checkScroll: function(e)
	{
		//return;
		//console.trace();


		var top = this.scrollObj.scrollTop();

		//console.log('sss:' + top, this._scroll);

		if(this.main.Screen.is_mob_safari && !this.main.Screen.isMobile())
		{
			if(this._menu_pos)
				clearTimeout(this._menu_pos);

			this._menu_pos = setTimeout(function() {

				var max = $('section.active:last').offset().top;

				if(top > max)
					top = max;

				$('nav.main').stop().animate({top: top}, 'fast');
			}, 500);
		}

		this.main.Paralax.update(top);

		this._scroll_dir = top - this._scroll_top;

		if(this._scroll_dir != 0)
			this._scroll_dir /= Math.abs(this._scroll_dir);

		this._scroll_top = top;

		if((this.no_scroll_jump || this.prevent_scroll_jump) && !this._scroll)
			this.main.Sections.onScroll(top);

		if(this._scroll_m || this._scroll || this.no_scroll_jump || this.prevent_scroll_jump)
			return;

		if(this._scroll_int)
			clearTimeout(this._scroll_int);

		this._scroll_int = setTimeout(function()
		{
			/*var pos = this._scroll_top / this.current_height;

			var diff = Math.abs(this._scroll_top - (Math.round(pos) * this.current_height));

			if(diff < 12)
				return;

			pos = this._scroll_dir > 0? Math.ceil(pos): Math.floor(pos);
			*/
			if(this._scroll)
				return;

			var ind = $('nav.main .nav li.active').index();

			//console.log(this._scroll_dir, ind, this._scroll);

			ind += this._scroll_dir;

			if(ind < 0)
				return;

			if(ind > $('nav.main .nav li').length - 1)
				return;

			$('nav.main .nav a').eq(ind).trigger('click', [true]);
		}.bind(this), 10);
	},


	_prev_page: '',

	trackPageview: function(page)
	{
		if(page == this._prev_page)
			return;

		this._prev_page = page;

		if(this.main.isDev())
		{
			console.log('Pageview:' + page);
			return;
		}

		if(window._gaq)
			_gaq.push(['_trackPageview', Site_Url + page + '/']);
	},

	get404: function()
	{
		$.get(Site_Url + '404-page-not-found/ajax/', function(data)
		{
			this.page404 = $(data).appendTo(document.body).hide()
			.css(
			{
				position: 'fixed',
				zIndex: 15,
				width: '100%',
				height: '100%',
				top: 0,
				left:0
			});

			this.page404.find('a')
			.attr('href', '#' + $('.tpl-collection:first').attr('id').replace('_', ''))
			.click(this.hide404.bind(this));

			this.page404.removeClass('active');

		}.bind(this));
	},

	is_404: false,

	show404: function()
	{
		this.is_404 = true;

		this.trackPageview('404-page-not-found');

		this.page404.fadeIn();

		this.blockScroll(0);

	},

	hide404: function()
	{
		this.is_404 = false;

		this.page404.fadeOut();
		this.unblockScroll();

	},

	blockTop: false,

	blockScroll: function(top) {

		this._scroll = true;

		if(typeof top != 'undefined')
		{
			top += this.scroll_fix;

			this.scrollObj.scrollTop(top);
			this.blockTop = top;
		}
		else
			this.blockTop = false;

		$('body').addClass('block-scroll');

		return this.scrollObj.scrollTop();
	},

	unblockScroll: function() {
		$('body').removeClass('block-scroll');

		if(this.blockTop !== false)
			this.scrollObj.scrollTop(this.blockTop);

		this.checkScroll();

		this._scroll = false;
	}
};
