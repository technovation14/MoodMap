$ = jQuery;

Main =
{
	init: function()
	{

	},

	initFooter: function()
	{
		this.Screen.initFooter();

		this.Form.initFooter();

		this.Sections.initFooter();

		this.ScrollNav.initFooter();

		this.Paralax.initFooter();

		this.Video.initFooter();

		this.Loader.initFooter();

		this.setupSocialHovers();

		if(this.isDev())
		{
			$(window).resize(function() {
				console.log('Width: ' + $('body').width());
			});
		}

	},

	setupHomeSlider: function() {

		var start = 0;
		var speed = 600;

		function setBG(color){

			$('.tpl-home .bgc div').css({
				backgroundColor: color
			}).animate({opacity: 1}, speed, function() {
				$('.tpl-home .bgc').css({
					backgroundColor: color
				});

				$(this).css({opacity: 0});
			});
		}

		$('.tpl-home .slider')
		.find('li').each(function(i) {

			//$('<b>' + i + '</b>').appendTo(this);

			var color = this.style.backgroundColor;

			this.style.backgroundColor = 'transparent';

			if(i == start)
				setBG(color);

			$(this).attr('data-color', color);
		});

		$('.tpl-home .slider')
		.flexslider({
			animation: 'slide',
			animationLoop: true,
			slideshowSpeed: 4000,
			slideshow: false,
			startAt: start,
			randomize: false,
			pauseOnHover: true,
			useCSS: false,
			animationSpeed: speed,
			after: function(slider) {

			},
			before: function(slider) {
				setBG($(slider.slides[slider.animatingTo]).data('color'));
			}
			/*minItems: 3,
			maxItems: 3,
			itemWidth: 200,
			move: 1*/
		});

		$('.tpl-home .slider .flex-viewport li').not('.clone').each(function(i) {
			$('.tpl-home .flex-control-paging a').eq(i)
			.css({backgroundColor: $(this).data('color')})
			.wrap('<span/>');
		});

		$('.tpl-home .slider .flex-control-paging').insertAfter('.home .slider');

	},

	setupProductSlider: function() {

		$('.tpl-collection .slider').flexslider({
			animation: 'slide',
			animationLoop: true,
			slideshowSpeed: 3000,
			pauseOnHover: true,
			startAt: 0,
			slideshow: false,
			useCSS: false
		});

	},

	setupSocialHovers: function(){

		if(this.Screen.isMobile() || this.Screen.isTouch())
			return;

		$('.tpl-about .social a').hover(function() {
			$('.tpl-about .social h3 i').text(' ' + $(this).text().split(' ')[1])
			.stop().css({opacity: 0}).animate({opacity: 1}, 'fast');
		},
		function() {
			$('.tpl-about .social h3 i').stop().animate({opacity: 0}, 'fast', function(){
				$(this).text('');
			});
		});

	},

	prevent_slideshow: false,
	have_sliders: false,

	runSliders: function() {
		if(!this.have_sliders)
			return;

		if(this.prevent_slideshow)
			return;

		$('.slider').each(function() {

			if(!$(this).find('li').length)
				return;

			$(this).flexslider('play');
		});
	},

	stopSliders: function() {
		if(!this.have_sliders)
			return;

		$('.slider').each(function() {

			if(!$(this).find('li').length)
				return;

			$(this).flexslider('stop');
		});
	},

	initLoad: function(){
		// this.ScrollNav.initLoad();
		this.setupDBGOV();

		this.setupHomeSlider();
		this.setupProductSlider();
		this.have_sliders = true;

		$(window).resize();
		this.Loader.initLoad();
	},

	setupDBGOV:function()
	{
		var mpos = {x: 0, y:0};
		var pos;
		var drag = false;

		$('.dbg-ov').mousedown(function(e) {
			mpos.x = e.pageX;
			mpos.y = e.pageY;

			pos = $(this).offset();
			drag = true;
		})
		.mousemove(function(e) {
			if(!drag)
				return;

			$(this).css(
			{
				left: pos.left + (e.pageX - mpos.x),
				top: pos.top + (e.pageY - mpos.y)
			});
		})
		.mouseup(function() {
			drag = false;
		});
	},

	isDev: function() {
		return location.host.match(/^(loc|192)/) && !location.href.match(/nodev/);
	}

};

Main.init();



$(window).load(Main.initLoad.bind(Main));
