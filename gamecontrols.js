
keysdown=[];
arrowAim=false;

function keyUsed(){
	for(var i=0; i< keysdown.length;i++){
		key=keysdown[i];
		
		if(arrowAim){
			if(key==37){
				//console.log("right");
				player.theta+=3;
			}
			if(key==39){
				//console.log("left");
				player.theta-=3;
			}
			if(player.theta> 360){
				player.theta-=360;
			}
			if(player.theta<0){
				player.theta+=360;
			}

			if(key==38){
				items[selectedItem].action(mx-xCam,my-yCam);
			}
		}

		if(key>48 && key< 58){
			selectedItem=(key-49);
		}

		if(key==87){
			player.vy-=player.speed+10;
			//player.y-=player.speed;
		}

		if(key==83){
			player.vy+=player.speed+10;
		}
		if(key==65){
			player.vx-=player.speed+10;
			
			
		} 
		if(key==68){
			player.vx+=player.speed+10;
		}

		if(key==13){
			socket.emit('entity',{
				object:"spawner",args: {
				item: items[selectedItem].image, 
				x:mx-xCam,
				y:my-yCam,
				rot:player.theta,
				data:{
					from:player.username,
					id:random(1111111,999999)
				}		
			}});
			items[selectedItem].remove();
		}


		if(key==81){
			player.vx+=Math.floor(player.speed+10*Math.cos(player.theta));
			player.vy+=Math.floor(player.speed+10*Math.sin(player.theta));
		}

	//	if(arrowAim){
			
		//}


	}
}


function keyDown(event){
	key=event.keyCode;
	//console.log(key);
	if(!(keysdown.indexOf(key) > -1)){
		keysdown.push(key);
	}
	//console.log(key);
	
}

function keyUp(event){
	key=event.keyCode;
	//delete key;
	delete keysdown[keysdown.indexOf(key)];
}



function doMouseMove(){
	//mx=event.pageX;
	//my=event.pageY;  
	var rect = canvas.getBoundingClientRect();
    mx= event.clientX - rect.left; 
    my= event.clientY - rect.top;
}


function doMouseDown(){

	items[selectedItem].action(mx-xCam,my-yCam);
}


if(!arrowAim){
	canvas.onmousemove=doMouseMove;
}

canvas.onmousedown=doMouseDown;


window.addEventListener('keydown',this.keyDown,false);
window.addEventListener('keyup',this.keyUp,false);
