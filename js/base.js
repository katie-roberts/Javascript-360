// Ford 360 colouriser
//
// Wunderman 2010
//
// Provides: colouriser


Colouriser = (function( me )
{
	function init()
	{
		$$('body').addClass('js');

		// hide any JS required messages
		$$('.jsHide').addClass('hidden');
     
     	Colouriser.ThreeSixty.createThreeSixy('CMAXThreeSixty', 770, 335);
	}


	window.addEvent( 'domready', init );

	return me;

})( window.Colouriser || {} );
