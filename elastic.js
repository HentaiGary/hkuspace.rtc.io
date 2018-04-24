
var nDots = 7;
if (document.all&&window.print)
document.body.style.cssText="overflow-x:hidden;overflow-y:scroll"
var Xpos = 0;
var Ypos = 0;


var DELTAT = .01;
var SEGLEN = 10;
var SPRINGK = 10;
var MASS = 1;
var GRAVITY = 50;
var RESISTANCE = 10;
var STOPVEL = 0.1;
var STOPACC = 0.1;
var DOTSIZE = 35;
var BOUNCE = 0.75;

var isNetscape = navigator.appName=="Netscape";

var followmouse = true;

var dots = new Array();
init();
function init()
{
    var i = 0;
    for (i = 0; i < nDots; i++) {
        dots[i] = new dot(i);
    }
    
     for (i = 0; i < nDots; i++) {
        dots[i].obj.left = dots[i].X + "px";
        dots[i].obj.top = dots[i].Y + "px";
    }
    
    if (isNetscape) {
        startanimate();
    } else {
        setTimeout("startanimate()", 20);
    }
}

function dot(i) 
{
    this.X = Xpos;
    this.Y = Ypos;
    this.dx = 0;
    this.dy = 0;
    this.obj = eval("document.getElementById('dot" + i + "').style");
}

document.onmousemove = MoveHandler;

function startanimate() {	
    setInterval("animate()", 20);
}

function MoveHandler(e) {

	if (!e) {
		Xpos = window.event.x + document.body.scrollLeft;
		Ypos = window.event.y + document.body.scrollTop;
	} else {
		Xpos = e.pageX;
		Ypos = e.pageY;
	}
}

function vec(X, Y)
{
    this.X = X;
    this.Y = Y;
}

function springForce(i, j, spring)
{
    var dx = (dots[i].X - dots[j].X);
    var dy = (dots[i].Y - dots[j].Y);
    var len = Math.sqrt(dx*dx + dy*dy);
    if (len > SEGLEN) {
        var springF = SPRINGK * (len - SEGLEN);
        spring.X += (dx / len) * springF;
        spring.Y += (dy / len) * springF;
    }
}

function animate() {	
     var start = 0;
    if (followmouse) {
        dots[0].X = Xpos;
        dots[0].Y = Ypos;
        start = 1;
    }
    
    for (i = start ; i < nDots; i++ ) {
        
        var spring = new vec(0, 0);
        if (i > 0) {
            springForce(i-1, i, spring);
        }
        if (i < (nDots - 1)) {
            springForce(i+1, i, spring);
        }
        
         var resist = new vec(-dots[i].dx * RESISTANCE,
            -dots[i].dy * RESISTANCE);
        
         var accel = new vec((spring.X + resist.X)/ MASS,
            (spring.Y + resist.Y)/ MASS + GRAVITY);
        
          dots[i].dx += (DELTAT * accel.X);
        dots[i].dy += (DELTAT * accel.Y);
        
          if (Math.abs(dots[i].dx) < STOPVEL &&
            Math.abs(dots[i].dy) < STOPVEL &&
            Math.abs(accel.X) < STOPACC &&
            Math.abs(accel.Y) < STOPACC) {
            dots[i].dx = 0;
            dots[i].dy = 0;
        }
        
         dots[i].X += dots[i].dx;
        dots[i].Y += dots[i].dy;

         var height, width;
        if (isNetscape) {
            height = window.innerHeight + document.scrollTop;
            width = window.innerWidth + document.scrollLeft;
        } else {	
            height = document.body.clientHeight + document.body.scrollTop;
            width = document.body.clientWidth + document.body.scrollLeft;
        }
        
        if (dots[i].Y >=  height - DOTSIZE - 1) {
            if (dots[i].dy > 0) {
                dots[i].dy = BOUNCE * -dots[i].dy;
            }
            dots[i].Y = height - DOTSIZE - 1;
        }
        if (dots[i].X >= width - DOTSIZE) {
            if (dots[i].dx > 0) {
                dots[i].dx = BOUNCE * -dots[i].dx;
            }
            dots[i].X = width - DOTSIZE - 1;
        }
        if (dots[i].X < 0) {
            if (dots[i].dx < 0) {
                dots[i].dx = BOUNCE * -dots[i].dx;
            }
            dots[i].X = 0;
        }
        
        dots[i].obj.left = dots[i].X + "px";
        dots[i].obj.top =  dots[i].Y + "px";
    }
}