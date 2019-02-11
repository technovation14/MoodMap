var Old_Browser = true;
var NoCSS3 = false;
var ShowOldNotice = true;


(function($)
{

	if(	   ($.browser.mozilla  && $.browser.version >= '1.9.1')
		|| ($.browser.chrome && $.browser.version >= '10.0')
		|| ($.browser.webkit && $.browser.version >= '525.13')
		|| ($.browser.msie && $.browser.version > '8.0')
		|| ($.browser.opera && $.browser.version > '11'))
	{
		Old_Browser = false;
		ShowOldNotice = false;
	}

	if($.browser.msie && $.browser.version < '9.0')
	{
		NoCSS3 = true;
		ShowOldNotice = false;
	}

	if(!Old_Browser)
	{

	    var currentFile = location.pathname.split('/');
	    currentFile = currentFile[1];

	    Url_Suffix = 'ajax/';

	    if(location.pathname.match(/index\.html$/))
	    {
	    	Url_Suffix += 'index.html';
	    }
	    else if (currentFile != '')
	    {
	       document.write('<style>body{display:none;}</style>');

	       var path = location.pathname.replace(/\/$/, '').replace(/^\//, '');

	      // location.href = Site_Url + '#' + path;
	    }
		else
		{
			$(function($)
			{
				$(document.body).removeClass('no_js').addClass('js');
			});
		}

	}


})(jQuery);
