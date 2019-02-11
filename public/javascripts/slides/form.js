Main.Form = {
		
	initFooter: function() {
		this.setupForm();
	},
		
	_submit : null,

	setupForm : function() {
		this._submit = $('.tpl-subscribe input[type=submit]:visible');

		this._submit.data('ready', this._submit.val());

		var items = $('.tpl-subscribe input').filter('[type=text],[type=email]')
				.on('keyup', this.validateFormInput.bind(this)).on('change',
						this.validateFormInput.bind(this));

		this._form = $(items.get(0).form);

		this.validateFormInput();

		this._form.submit(this.sendForm.bind(this));
	},

	sendForm : function(e) {

		e.preventDefault();

		var data = {ft_subscribe: 1};

		this._form.serializeArray().forEach(function(v, i) {
			data[v.name] = v.value;
		});

		data.fname = data.name.split(/\s+/)[0] || '';
		data.lname = data.name.split(/\s+/)[1] || '';

		//data.test = 1;
		data.page = 'website';

		this._submit.val(this._submit.data('wait')).attr('disabled', true);

		this._form.find('.ok span').text(data.name);

		$.post(location.href, data, function(resp) {

			this._submit.val(this._submit.data('ready'))
					.attr('disabled', false);

			if (resp.ok) {
				$('.start').fadeOut('fast', function() {
					$('.ok').fadeIn('fast');
				});
			} else {
				$('.error').fadeIn('fast').delay(5000).fadeOut('fast');
			}

		}.bind(this), 'json');

		return false;
	},

	validateFormInput : function() {

		var ok = true;

		[ 'name', 'email' ].forEach(function(type, i) {
			var item = $('input[name=' + type + ']', this._form);

			var val = item.val();

			item.attr('class', '');

			if (val) {
				if (this['validate_' + type](val))
					item.addClass('input-ok');
				else {
					item.addClass('input-bad');
					ok = false;
				}
			} else
				ok = false;

		}, this);

		if(ok && this._submit.data('ready'))
			this._submit.val(this._submit.data('valid'));
		else
			this._submit.val(this._submit.data('ready'));
			
			
		this._submit.attr('disabled', !ok);
	},

	validate_name : function(val) {

		return !val.match(/[0-9]/);
	},

	validate_email : function(val) {
		return val.match(/.+?@.+?\..+/);
	}
};