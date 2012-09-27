/*
  -----------------------------------------------------------
  Canvas Logo Management
  @author: jumahe // contact@jumahe.com
  -----------------------------------------------------------
*/

var NB_CIRCLES = 10;
var NB_LINES = 0;
var CIRCLE_RADIUS = 10;

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var LINE_ALPHA = 1;

var canvas;
var stage;

var circles = new Array/*Shape*/();
var lines = new Array/*Object*/();


// -- CIRCLES creation
// -----------------------------------------------------------
function createCircles()
{
	var g = new Graphics();
	g.setStrokeStyle(1); // stroke line 1px
	g.beginStroke( Graphics.getRGB( 255, 255, 255, 1 ) ); // stroke color
	g.beginFill( "rgba(255,255,255,0.5)" );
	g.drawCircle( 0, 0, CIRCLE_RADIUS * 0.5 ); // draw circle
	
	var gbg = new Graphics();
	gbg.setStrokeStyle(1); // stroke line 1px
	gbg.beginStroke( Graphics.getRGB( 255, 255, 255, 1 ) ); // stroke color
	gbg.beginFill( "rgba(255,255,255,0.3)" );
	gbg.drawCircle( 0, 0, CIRCLE_RADIUS ); // draw circle
	
	var i;
	var circle;
	var circle_bg;
	var circle_container
	for( i = 0; i < NB_CIRCLES; i++ )
	{
		circle_container = new Container();
		circle_container.x = getXPos();
		circle_container.y = getYPos();
		
		circle_bg = new Shape(gbg);
		circle_bg.x = 0;
		circle_bg.y = 0;
		circle_container.addChild(circle_bg);
		
		circle = new Shape(g);
		circle.x = 0;
		circle.y = 0;
		circle_container.addChild(circle);
		
		circles[i] = circle_container;
		
		stage.addChild( circle_container );
	}
}

// -- draw line
// -----------------------------------------------------------
function drawLine(g, from, to)
{
	var fs = from.scaleX;
	var ts = to.scaleX;
	
	var cf = Math.round( 255 * fs );
	var ct = Math.round( 255 * ts );
	
	var facteur = .2;
	
	//var colors = [ Graphics.getRGB( cf, cf, cf, fs * .1 ), Graphics.getRGB( ct, ct, ct, ts * .1 ) ];
	var colors = [ Graphics.getRGB( cf, cf, cf, fs * facteur ), Graphics.getRGB( ct, ct, ct, ts * facteur ) ];
	//var colors = [ Graphics.getRGB( cf, cf, cf, 1 ), Graphics.getRGB( ct, ct, ct, 1 ) ];
	//var colors = [ Graphics.getRGB( 255, 255, 255, fs * .5 ), Graphics.getRGB( 255, 255, 255, ts * .5 ) ];
	
	g.clear();
	g.setStrokeStyle(1); // stroke line 1px
	//g.beginStroke( Graphics.getRGB( 255, 255, 255, LINE_ALPHA ) );
	g.beginLinearGradientStroke( colors, [0,1], from.x, from.y, to.x, to.y );
	g.moveTo( from.x, from.y );
	g.lineTo( to.x, to.y );
}

// -- LINES creation
// -----------------------------------------------------------
function createLines()
{
	var i;
	var j;
	var g;
	var lineObj;
	var line;
	var circleFrom;
	var circleTo;
	
	for( i = 0; i < NB_CIRCLES; i++ )
	{
		for( j = i; j < NB_CIRCLES; j++ )
		{
			circleFrom = circles[i];
			circleTo = circles[j];
			
			if( circleFrom != circleTo )
			{
				g = new Graphics();
				
				drawLine( g, circleFrom, circleTo );
				
				line = new Shape(g);
				line.alpha = LINE_ALPHA;
				stage.addChild(line);
				
				lineObj = 
				{
					circle_start:circleFrom,
					circle_stop:circleTo,
					line_graphics:g,
					line_shape:line
				}
				
				lines[NB_LINES] = lineObj;
				NB_LINES++;
			}
		}
	}
}

// -- INIT
// -----------------------------------------------------------
function initLogo( canvasId )
{
	// -- are canvas supported?
	if(!(!!document.createElement('canvas').getContext))
	{
		var wrapper = document.getElementById("canvasWrapper");
		wrapper.innerHTML = "Your browser does not appear to support " +
		"the HTML5 Canvas element";
		
		return;
	}

	// -- get a reference to the canvas element
	canvas = document.getElementById(canvasId);
	canvas.setAttribute("width", CANVAS_WIDTH);
	canvas.setAttribute("height", CANVAS_HEIGHT);
	
	// -- init stage
	stage = new Stage( canvas );
	
	// -- circles
	createCircles();
	
	// -- lines
	createLines();
	
	// -- tell the stage to render to the canvas
	stage.update();
	
	// -- EnterFrame + addEventListener
	Ticker.setFPS(24);
	Ticker.addListener(this);
	
	for ( var i = 0; i < NB_CIRCLES; i++ )
	{
		move( i );
	}
}

// -- onEnterFrameHandler
// -----------------------------------------------------------
function tick()
{
	var i;
	var lineObj;
	
	for ( i = 0; i < NB_LINES; i++)
	{
		lineObj = lines[i];
		
		drawLine( lineObj.line_graphics, lineObj.circle_start, lineObj.circle_stop );
		
		lineObj.line_shape.graphics = lineObj.line_graphics;
	}
	
	stage.update();
}

// -- get random y pos
// -----------------------------------------------------------
function getXPos()
{
	return CIRCLE_RADIUS + Math.round( Math.random() * (canvas.width - (CIRCLE_RADIUS * 2)) );
}

// -- get random x pos
// -----------------------------------------------------------
function getYPos()
{
	return CIRCLE_RADIUS + Math.round( Math.random() * (canvas.height - (CIRCLE_RADIUS * 2)) );
}

// -- rand range
// -----------------------------------------------------------
function getRandRange( mini, maxi )
{
	return mini + ( Math.round( (Math.random() * (maxi - mini)) * 100) / 100 );
}

// -- move the circles
// -----------------------------------------------------------
function move( id )
{
	var circle = circles[id];
	var depth = getRandRange( .3, 1 );
	var duration = getRandRange( 1500, 2500 ); // 500,1500
	var delay = getRandRange( 100, 1000 );
	
	var tween = Tween.get( circle ).to(
	{
		x:getXPos(),
		y:getYPos(),
		scaleX:depth,
		scaleY:depth,
		alpha:depth
	}, duration, Ease.quadOut ).wait( delay ).call(move, [id]);
}