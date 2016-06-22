xCam=-1*random(450,999);
yCam=-1*random(450,999);

player={
	x:Math.abs(xCam)+(width/2),
	y:Math.abs(yCam)+(height/2),
	vx:0,
	vy:0,
	speed:2,
	speedCap:3,
	size:20,
	theta:0,
	health:100,
	maxHealth:100,
	username: prompt("what is your username?"),
	image:new Image(),

	velocity:function(){
		

		if(player.vx>player.speedCap){
			player.vx=player.speedCap;
		}
		if(player.vx<-player.speedCap){
			player.vx=-player.speedCap;
		}
		if(player.vy>player.speedCap){
			player.vy=player.speedCap;
		}
		if(player.vy<-player.speedCap){
			player.vy=-player.speedCap;
		}
		
		
		canMove=true;
		for(var i=firstMapIndex; i<map.length;i++){
			var obj=map[i];
			if( obj.image=="tree"||obj.image=="stone"){
				collideRadius=1;
				you={
					x:(player.x+(player.vx/5))+xCam,
					y:(player.y+(player.vy/5))+yCam,
					w:player.size+(collideRadius/5),
					h:player.size+(collideRadius/5)
				}

				block={
					x:obj.x+xCam,
					y:obj.y+yCam,
					w:30,
					h:30
				}
				if(intersects(you,block)  ){
					//console.log("TREE COLLISON");
					//obj.itemize();
					canMove=false;
				}
			}
		}

		if(!canMove){
			player.vx*=-1;
			player.vy*=-1;
		}
		player.x+=player.vx;
		player.y+=player.vy;
			

		xCam-=player.vx;
		yCam-=player.vy;
		socket.emit('playerData',player);
	},

	friction:function(){		
		if(player.vx>0){
			player.vx--;
		}else if(player.vx<0){
			player.vx++;
		}else if(player.vy>0){
			player.vy--;
		}else if(player.vy<0){
			player.vy++;
		}
	}

}

player.image.src="images/player.png"

