Main.Sections =
{
	main: Main,
	
	initFooter: function() {
		this.min_header_h = $('section.manifesto header').height();
	},
	
	top_pos: {},
	w_height: 0,
		
	onResize: function(w, h){
		
		this.w_height = h;
		
		$('section.active').each(function(i, item) {
			
			var tpl = item.className.match(/tpl-([^ ]+)/)[1];
			
			var m = 'on_' + tpl + '_resize';
			
			if(this[m])
				this[m](w, h, $(item));
			else
				this.on_all_resize(w, h, $(item));
			
			this.top_pos[item.id] = $(item).offset().top;
			
		}.bind(this));
	},
	
	//top_pos: {},
	
	angle: Math.PI/180*8,
	
	
	getDelta: function(w)
	{
		return Math.round(w * Math.tan(this.angle));
	},
	
	on_all_resize: function(w, h, $item)
	{
		$item.css({height: h});
	},
	
	min_header_h: 0,
	min_mob_bg_h: 520,
		
	setSectionLink: function($item, d) {
		$item.find('.next-sect').css({
			height: Math.round(d / 2 - 10),
			top: -d
		});
	},
	
	on_home_resize: function(w, h, $item) {
		
		if(this.main.Screen.isMobile())
			h -= Math.round(this.getDelta(w) / 2);
		else
			h -= 10;
		
		$item.css({height: h});
	},
	
	on_manifesto_resize: function(w, h, $item) {
		
		var d = this.getDelta(w);
		
		var m = this.main.Screen.isMobile();
		
		var m_h_h = m? 206: this.min_header_h; 
		
		var h_h = Math.max(m_h_h, d);
		
		var t_h = $('section.manifesto .text-box').height();
		
		var s_h = m? this.min_mob_bg_h + t_h + d: h; 
		
		$item.css({
			marginTop: Math.ceil(d/2),
			height: s_h
		})
		.find('header').css({
			height: h_h,
			top: -Math.ceil(d/2)
		});
		
		$item.find('.bg').css({
			bottom: t_h - Math.ceil(d/2)
		});
		
		$item.find('.video-tb').css({
			top: h_h - Math.ceil(d/2), 
			bottom: t_h
		});

	},
	
	on_collection_resize: function(w, h, $item) {
		var d = this.getDelta(w);
		
		var m = this.main.Screen.isMobile();
		
		if(this.main.Screen.is_mob_safari)
		{
			$item.find('.text-box .cnt1').hide();
			
			setTimeout(function() {
				$item.find('.text-box .cnt1').show();
			}, 10);
		}
		
		var t_h = $item.find('.text-box .cnt').height();
		
		$item.css({
			height: m? 430 + t_h + d: h,
			marginTop: Math.ceil(m? -d/2: d/2)
		})
		.find('.bg').css({
			top: m? 0: -d,
			bottom: Math.floor(t_h - d/2)
		});
		
		this.setSectionLink($item, d);
		
		$item.find('article>h1').css({
			bottom: t_h
		});
	},
	
	on_about_resize: function(w, h, $item) {
		var d = this.getDelta(w);
		
		var m = this.main.Screen.isMobile();
		
		var t_h = $item.find('.social').height();
		
		var c_h = $item.find('.box.cnt div div div').height();
		
		$item.css({
			height: m? 60 + c_h + t_h + d: h,
			marginTop: Math.ceil(m? -d/2: d/2)
		})
		.find('article>.bg').css({
			top: m? 0: -d,
			bottom: Math.floor(t_h - d/2)
		});
		
		this.setSectionLink($item, d);
		
		$item.find('.box').css({
			top: 0,
			bottom: t_h
		});
	},
	
	on_subscribe_resize: function(w, h, $item) {
		var d = this.getDelta(w);
		
		var m = this.main.Screen.isMobile();
		var t_h = $item.find('.cnt div div div').height();	
		
		$item.css({
			height: m? 200 + t_h + d: h,
			marginTop: Math.ceil(d/2)
		})
		.find('article>.bg').css({
			top: m? 0: -d
		});
		
		this.setSectionLink($item, d);
	
		if(m)
			$item.find('.copy').css({
				height: d
			});
		else
			$item.find('.copy').attr('style', ' ');
	},
	
	getPos: function(section) {
		return this.top_pos[section + '_'];
	},
	
	onScroll: function(top) {
		$.each(this.top_pos, function(k, v) {
			if(top <= v && top + (this.w_height * 0.75) > v)
			{
				this.main.ScrollNav.setNav(k.replace(/_$/, ''));
				return false;
			}
		}.bind(this));
	}
};