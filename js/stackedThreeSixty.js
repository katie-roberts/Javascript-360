Colouriser = (function( colouriser )
{
	var me = colouriser.ThreeSixty = colouriser.ThreeSixty || {};
	
	var _threesixty;
	var _base;
	var _mask;
	var _reflection;
	
	var _framerate = 45;
	var _frameInterval = 1000 / _framerate;
	var _timer;
	
	var baseImageRef	= [];
	var baseImageSrc	= [];
	var reflectionImageRef = [];
	var reflectionImageSrc	= [];
	var maskImageRef	= [];
	var maskImageSrc	= [];
	
	var _delta = 0;
	var _currentImage = 0;
	
	var _maskImage;
	var _refImage;
	var _baseImage;
	
	var _width = 770;
	var _height = 335;
	
	var _canRotate = true;
	
	
	
	me.createThreeSixy = function( containerId, width, height )
	{
		
		_width = width;
		_height = height;
	
		_threesixty = $( 'threesixty' );
		_mask = $( 'mask' );
		_base = $( 'base' );
		_reflection = $( 'reflection' );
			
	//	_threesixty.addEvent( 'mousedown', startClickRotation );
	//	_threesixty.addEvent( 'mouseup', stopRotation );
		
		$( 'redBtn' ).addEvent('click', function()
			{

				changeColour('#ff0000');
			})
		$( 'greenBtn' ).addEvent('click', function()
			{
				changeColour('#006600');
			})
		$( 'blueBtn' ).addEvent('click', function()
			{
				changeColour('#0000ff');
			})
		$( 'yellowBtn' ).addEvent('click', function()
			{
				changeColour('#ffff00');
			})
		$( 'whiteBtn' ).addEvent('click', function()
			{
				changeColour('#ffffff');
			})
		$( 'purpleBtn' ).addEvent('click', function()
			{
				changeColour('#6600ff');
			})
		$( 'blackBtn' ).addEvent('click', function()
			{
				changeColour('#000000');
			})
	
		createImageReferences();
	}
	
	
	function startClickRotation(e)
	{
		e.preventDefault();
		//_delta = this == _clockwiseButton ? 1 : -1;
		_currentImage ++;
		if ( _timer ) clearTimeout( _timer );
		_timer = setInterval( rotate, _frameInterval );
	}


	function stopRotation(e)
	{
		e.preventDefault();

		clearTimeout( _timer );

		_canRotate = false;

	}
	
	function changeColour(hex)
	{
		var color = $( 'color' );
		color.setStyles( {'background-color': hex});
		
	}

	function createImageReferences()
	{
		
		var baseString = 'img/base/base';
		var reflectionString = 'img/ref/ref';
		var maskString = 'img/mask/diff';
		for (var i = 0; i<40; i++)
		{
			var addString;
			var j = i*5;
			if (j<10)
				addString = '000'+j+'.png';
			else if (j>=10 && j<100)
				addString = '00'+j+'.png';
			else
				addString = '0'+j+'.png';
		
			baseImageRef.push(baseString+addString);
			reflectionImageRef.push(reflectionString+addString);
			maskImageRef.push(maskString+addString);
		}
		
		preload();
		
	}
	
	function preload()
	{
		var imageLoad = new Element( 'img', {src: baseImageRef[0]});
		
		$( 'imageLoader' ).grab(imageLoad);
		
		for (var i=0; i<baseImageRef.length; i++)
		{
			
			imageLoad.grab(new Element('img', { src:baseImageRef[i] }));
			imageLoad.grab(new Element('img', { src:maskImageRef[i] }));
			imageLoad.grab(new Element('img', { src:reflectionImageRef[i] }));
		}
	
		imagesDidLoad();
	
	}
	
	function imagesDidLoad()
	{
		_currentImage = 0;

		// create image element
		_maskImage = new Element( 'img', { src:maskImageRef[0], width:_width, height:_height } );
		_mask.grab( _maskImage );
		
		_baseImage = new Element( 'img', { src:baseImageRef[0], width:_width, height:_height } );
		_base.grab( _baseImage );
		
		_refImage = new Element( 'img', { src:reflectionImageRef[0], width:_width, height:_height } );
		_reflection.grab( _refImage );
		
		var controls = new Element( 'div', { 'class':'controls' } );
		controls.setStyles( { opacity:0 } );
		_clockwiseButton = new Element( 'a', { 'class':'rotate rotate-clockwise', href:'#', html:'clockwise', title:'rotate clockwise' } );
		_anticlockwiseButton = new Element( 'a', { 'class':'rotate rotate-anticlockwise', href:'#', html:'anticlockwise', title:'rotate anticlockwise' } );
		
		controls.grab( _clockwiseButton );
		controls.grab( _anticlockwiseButton );
		_reflection.grab( controls );
		controls.set( 'morph', { duration:750, transition:Fx.Transitions.Quad.easeInOut } );
		controls.morph( { opacity:1 } );
		
		// bind the control buttons
		var buttons = controls.getElements( 'a.rotate' );
		buttons.addEvent( 'mousedown', startClickRotation );
		buttons.addEvent( 'mouseup', stopRotation );
		buttons.addEvent( 'click', function(e) { e.preventDefault() } );
		controls.addEvent( 'mousedown', function(e) { e.stopPropagation() } );
		
		buttons.addEvent( 'keydown', keyDown );
		buttons.addEvent( 'keyup', lostFocus );

		// bind drag event
		_threesixty.addEvent( 'mousedown', startDrag );
		if ( document.addEventListener ) _threesixty.addEventListener( 'touchstart', startDrag, false );
		_threesixty.addEvent( 'selectstart', function(e) { e.preventDefault(); e.stopPropagation() } );

		// and a key listner
		$( document.body ).addEvent( 'keydown', startKeyRotation );
		
		updateImage();
			
	}
	
	function updateImage()
	{
		var maskImage = maskImageRef[ _currentImage ];
		var refImage = reflectionImageRef[_currentImage];
		var baseImage = baseImageRef[_currentImage];

		_maskImage.set( 'src', maskImage );
		_refImage.set('src', refImage);
		_baseImage.set('src', baseImage);
		
		
	}
	
	function keyDown(e)
	{
		if (e.key == 'space')
		{
			startClickRotation.call( this, e );
		}
	}
	
	function lostFocus(e)
	{
		stopRotation(e);
	}
	
	
	function startDrag(e)
	{
		e.preventDefault();

		_initialX = e.touches ? e.touches[0].pageX : e.page.x;
		_delta = 0;

		// set events
		_threesixty.addEvent( 'mousemove', didDrag );
		if ( document.addEventListener ) _threesixty.addEventListener( 'touchmove', didDrag, false );
		$( document.body ).addEvent( 'mouseup', stopRotation );
		if ( document.addEventListener ) _threesixty.addEventListener( 'touchend', stopRotation, false );
		
		if ( _timer ) clearTimeout( _timer );
		_timer = setInterval( rotate, _frameInterval );
	}


	function didDrag(e)
	{
		e.preventDefault();
	
		_delta = e.touches ? _initialX - e.touches[0].pageX : _initialX - e.page.x;
		var round = _delta > 0 ? Math.ceil : Math.floor;
		_delta = Math.abs( _delta ) > 500 ? 5 : round( _delta / ( 1.6 * _framerate ) );
	}


	function rotate()
	{
		var currentImage = _currentImage;
		currentImage += _delta;

		if ( currentImage > baseImageRef.length - 1 ) currentImage = 0;
		else if ( currentImage < 0 ) currentImage = baseImageRef.length - 1;
		
		_currentImage = currentImage;

		updateImage();
	}


	function startClickRotation(e)
	{
		e.preventDefault();

		_delta = this == _clockwiseButton ? 1 : -1;

		if ( _timer ) clearTimeout( _timer );
		_timer = setInterval( rotate, _frameInterval );
	}


	function startKeyRotation(e)
	{
		if ( e.key == 'right' ) _delta = -1;
		else if ( e.key == 'left' ) _delta = 1;
		else return;

		// set events
		$( document.body ).removeEvent( 'keydown', startKeyRotation );
		$( document.body ).addEvent( 'keyup', stopRotation );

		if ( _timer ) clearTimeout( _timer );
		_timer = setInterval( rotate, _frameInterval );
	}


	function keyRotation()
	{
		if ( e.key == 'right' ) rotateRight();
		else if ( e.key == 'left' ) rotateLeft();

		if ( _currentImage >= baseImageRef.length - 1 ) _currentImage = 0;
		else _currentImage++;
	}


	function stopRotation(e)
	{
		e.preventDefault();

		clearTimeout( _timer );

		_canRotate = false;

		// remove events
		_threesixty.removeEvent( 'mousemove', didDrag );
		if ( document.removeEventListener ) _threesixty.removeEventListener( 'touchmove', didDrag, false );
		$( document.body ).removeEvent( 'mouseup', stopRotation );
		if ( document.removeEventListener ) document.body.removeEventListener( 'touchend', stopRotation, false );
		$( document.body ).addEvent( 'keydown', startKeyRotation );
		$( document.body ).removeEvent( 'keyup', stopRotation );
	}

	
	return colouriser;

})( window.Colouriser || {} );
