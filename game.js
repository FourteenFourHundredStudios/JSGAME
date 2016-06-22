var c=document.getElementById("canvas");
var context=this.c.getContext("2d");
socket=io.connect('http://73.72.74.4:3001/');


touching="";

my=0;
mx=0;

drawing = 0;

rects=[];
players=[]
map=[]
//deg = 10;

radius=0;
theta=0;

speed=2;

inMotion=false;

selectedItem=0;

firstMapIndex=0;

points=0;

chat=["what???","aight","Marc-Arthur Fervil JR"];
chatOpen=false;

fpsAvg=[];
averageFPS=0;

var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;


//console.log(new entityMap["laser"](2,3,5,3,2,4));

function paintRect(x,y,w,h,col,rot){

	context.save();
	context.translate( (x+(w/2))  , (y+(h/2)) );

    context.rotate(rot);
	
    context.translate( -(x+(w/2))  , -(y+(h/2)) );
	
	context.beginPath();
	context.fillStyle = col;
	context.rect(x, y, w, h);
	context.fill();
	

	context.restore();

}

function paintImage(image,x,y,w,h,rot){

	context.save();
	context.translate( (x+(w/2))  , (y+(h/2)) );

    context.rotate(rot);
	
    context.translate( -(x+(w/2))  , -(y+(h/2)) );
	
	//paint
	context.drawImage(image, x, y);

	context.restore();

}



function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function intersects(r1, r2) {
    return !( r2.x > r1.x+r1.w || r2.x+r2.w < r1.x|| r2.y > r1.y+r1.h|| r2.y+r2.h < r1.y);
}

function mainLoop(){

	keyUsed();

	if(!arrowAim){
		player.theta=Math.atan2( (my-(player.y+yCam)) ,(mx-(player.x+xCam)));
	}


	socket.emit('playerData',player);
	context.clearRect(0, 0, width, height);

	Tile.paintWorld();

	Entity.paintEntity();



	//paintRect(player.x+xCam,player.y+yCam,player.size,player.size,"red",player.theta);
	paintImage(player.image,player.x+xCam,player.y+yCam,player.size,player.size,player.theta+360)


	player.velocity();

	players.forEach(function(obj){
		context.font = "15px helvetica";
		context.fillText(obj.username,obj.x+xCam,(obj.y-10)+yCam);
		if(!(obj.username==player.username)){
			//paintRect(obj.x+xCam,obj.y+yCam,obj.size,obj.size,"blue",obj.theta);
			paintImage(player.image,obj.x+xCam,obj.y+yCam,player.size,player.size,obj.theta+360)
		}
	});
	

	Item.paintItemScreen();

	paintRect(30,30,player.health*2,30,"red",0);
	context.font = "20px helvetica";
	context.fillText("health: "+player.health,45,50);

	context.beginPath();
	context.fillStyle = "black";
	context.rect(30,30,player.maxHealth*2,30);
	context.stroke();

	context.font = "20px helvetica";
	context.fillText("points: "+points,45,90);

	fps=(1000/frameTime).toFixed(1)

	context.fillText("fps: "+fps,width-110,25);

	
	
	var thisFrameTime = (thisLoop=new Date) - lastLoop;
  frameTime+= (thisFrameTime - frameTime) / filterStrength;
  lastLoop = thisLoop;
  
}




function death(){
	player.health=player.maxHealth;
	xCam=-1*random(15,1500);
	yCam=-1*random(15,1500);

	player.x=Math.abs(xCam)+(width/2);
	player.y=Math.abs(yCam)+(height/2);
}


window.onbeforeunload = function() {
	//swag
	for(var i=0;i<10;i++){
		socket.emit('entity',{object:this.image,args: {x:player.x,y:player.y,rot:random(0,360),from:player.username,id:Math.random()} });
	}
	socket.emit('logout', player.username);
};

window.unload= function(){
	socket.emit('logout', player.username);
	alert("test!!");
	for(var i=0;i<10;i++){
		socket.emit('entity',{object:this.image,args: {x:player.x,y:player.y,rot:random(0,360),from:player.username,id:Math.random()} });
	}
	socket.emit('logout', player.username);
}

socket.emit('join', {username: player.username});

thread = new Worker("thread.js");
thread.postMessage("start");

thread.onmessage=function(e){
	if(e.data=="friction"){
		player.friction();
		//socket.emit({""})
		socket.emit('playerData',player);
		//paintRect(player.x,player.y,player.size,player.size,"red",player.theta,true);
	}

}

repaint = new Worker("repaint.js");
repaint.postMessage("start");

repaint.onmessage=function(e){

	map.forEach(function(obj){
		obj.nextFrame();
	});
	//console.log(firstMapIndex);
	//console.log(imageMap);
}


optimize = new Worker("optimize.js");
optimize.postMessage("optimize");

optimize.onmessage=function(e){
	/*
	this.first=true;
	for(var i=0;i<map.length;i++){
		this.obj=map[i];

		if(this.obj.x<width-xCam && this.obj.x>-30-xCam&& this.obj.y<height-yCam && this.obj.y>-30-yCam){
			if(this.first){
				firstMapIndex=i-1;
				if(firstMapIndex<0){
					firstMapIndex=0;
				}
				this.first=false;
			}

		}

	}
*/


}

//canvas.attachEvent("onkeypress", keyListener);
//makeMap();
//setInterval(mainLoop,10);

setInterval(function(){
	window.requestAnimationFrame(mainLoop);
},10);

