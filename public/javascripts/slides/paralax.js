Main.Paralax =
{
	main: Main,
	
	initFooter: function() {
		
	//this.initItems();
	},
	
	onResize: function(w, h)
	{
		this.w_height = h;
		this.w_width = w;
		this.b_width = $(document.body).width();
		
		this.initItems();
	},
	
	w_height: 0,
	w_width: 0,
	b_width: 0,
	
	shift_rate: 0.2,
	
	items: null,
	
	_scr_pos: -1,
	
	initItems: function()
	{
		this.items = $('.prx').each(function(i, item) {
			
			var item = $(item);
			
			var box = item.offset();
			box.w = item.width();
			box.h = item.height();
			
			box.aspect = box.w / box.h;
			
			var img = {w: item.data('width'), h: item.data('height')};
			img.aspect = img.w / img.h;
			
			box.scroll = this.w_height + box.h;
			box.start = box.top - this.w_height;
			
			box.shift = box.scroll * this.shift_rate;
			
			/*var need_height = this.w_height;// * (1 - this.shift_rate);//box.h + (this.w_height - box.h) * this.shift_rate;
			
			var new_width = need_height * img.aspect;
			
			if(false && new_width < box.w)
			{
				item.css('background-size', '100% auto');
			}
			else
			{
				item.css('background-size', 'auto ' + Math.ceil(need_height / box.h * 100) + '%');
				//console.log('auto ' + Math.ceil(need_height / box.h * 100) + '%');
			}*/
			
			item.get(0)._box = box;
				
		}.bind(this));
	},
	
	update: function(top) {
		if(this._scr_pos == top)
			return;
		
		this._scr_pos = top;
		
		this.items.each(function(i, item) {
			var box = item._box;
			var old_per = item._per;
			
			var per = 0;
			
			var pos = top - box.start;
			
			if(pos > 0)
			{
				per = pos / box.scroll;
				
				if(per > 1)
					per = 1;
				
			}
			
			if(old_per != per)
			{
				var item = $(item);
				
				//console.log('center ' + ((1 - per) * 100) + '%');
				
				//pos = -Math.round(box.h * (this.shift_rate - 1) * (1 - per));
				
				//pos = box.shift * 2 * per - box.shift;
				
				//pos = -top + box.top + pos;
				
				pos = -box.shift * per + (box.shift / 2);
				
				//pod = -pos;
				
				//console.log('50% ' + pos + 'px');
				
				var v_pos = 50 - ((54 - 10) / this.b_width * 100);
				
				if(this.main.Screen.isMobile() || this.main.Screen.is_mob_safari)
				{	
					item.css('background-position', '50% 50%');
				}
				else
				{
					item.css('background-position', Math.round(v_pos) + '% ' + Math.round(pos) + 'px');
				}
				
				this._per = per;
			}
				
		}.bind(this));
	},

};