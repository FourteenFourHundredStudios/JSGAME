
class Entity{

	constructor(image,x,y,data){

		this.image=image;
		this.x=x;
		this.y=y;
		this.data=data;
	}

	action(){

	}

	paint(){
	
	}

	static paintEntity(){
		for(var i=0;i<rects.length;i++){
			this.obj=rects[i];
			this.obj.paint();
			this.obj.action();
		}
	}

}


class ProjectileEntity extends Entity{

	constructor(image,x,y,speed,size,rot,data){
		super(image,x,y,data)
		this.speed=speed;
		this.size=size;
		this.rot=rot;

		this.you={
			x:player.x+xCam,
			y:player.y+yCam,
			w:player.size,
			h:player.size
		}
	}

	paint(){
		this.img=imageMap[this.image];
		context.drawImage(this.img, this.x+xCam, this.y+yCam,this.size,this.size);
	}

	action(){
	//	if(this.x+xCam > width - (this.size*2) || this.y+yCam < 0 + (this.size*2) || this.y+yCam > height - (this.size*2) || this.x+xCam < 0 + (this.size*2)){
			//rects.splice(this.count,1);
	//	}
		this.x+= Math.abs(this.speed)*Math.cos(this.rot);
		this.y+= Math.abs(this.speed)*Math.sin(this.rot);

		//MOVE THIS CHECK TO WORKER BECAUSE IT IS SLOWING GAME DONWN
		//console.log("FROM "+this.data.from + " === " + player.username);


	}
}

class ItemEntity extends Entity{

	constructor(image,x,y,data){
		super(image,x,y,data);
		this.rot=180;
		this.size=20;
		this.growing=false;


	}

	paint(){
		context.save();
		context.translate( (this.x+xCam+(this.size/2))  , (this.y+yCam+(this.size/2)) );
		context.rotate(this.rot);
		context.translate( -(this.x+xCam +(this.size/2)) , -(this.y+yCam +(this.size/2)));
		this.img=imageMap[this.image];
		if(this.img instanceof Array){
			this.img=imageMap[this.image][0];
		}
		context.drawImage(this.img, this.x+xCam, this.y+yCam,this.size,this.size);
		context.restore();
	}

	action(){
		this.rot+=0.05;
		if(!this.growing){
			this.size-=0.10;
			if(this.size<11){
				this.growing=true;
			}
		}else{
			this.size+=0.10;
			if(this.size>19){
				this.growing=false;
			}
		}

		this.me={};
		this.me.x=this.x+xCam;
		this.me.y=this.y+yCam;
		this.me.w=this.size;
		this.me.h=this.size;

		this.you={};
		this.you.x=player.x+xCam;
		this.you.y=player.y+yCam;
		this.you.w=player.size;
		this.you.h=player.size;

		if(intersects(this.me,this.you)){
			console.log("remove "+this.data.id);
			socket.emit('removeEntity',this.data.id);
			addItem(this.image,1);
			return;
		}


	}

}

class FireballEntity extends ProjectileEntity {

	constructor(data){
		super("fireball",data.x,data.y,10,15,data.rot,{
			from:data.from,
			id:data.id
		});
	}
}


class itemizerEntity extends ProjectileEntity {

	constructor(data){
		super("itemizer",data.x,data.y,10,15,player.theta,{
			from:data.from,
			id:data.id
		});
	}

}

class spawnerEntity extends ItemEntity {

	constructor(data){
		//console.log(data);
		super(data.item,data.x,data.y,{
			from:data.data.from,
			id:data.data.id
		});
	}

}




EntityMap={
	fireball:FireballEntity,
	spawner:spawnerEntity,
	itemizer:itemizerEntity
}


entityTimer = new Worker("entitytimer.js");
entityTimer.postMessage("start");

entityTimer.onmessage=function(e){

	you={
		x:player.x+xCam,
		y:player.y+yCam,
		w:player.size,
		h:player.size
	}

	rects.forEach(function(obj){

		if(obj instanceof ProjectileEntity){

			me={};
			me.x=obj.x+xCam;
			me.y=obj.y+yCam;
			me.w=obj.size;
			me.h=obj.size;

			if(!(obj.data.from==player.username)){
				//console.log(obj.data.from);
				//console.log("THIS IS IMPORTANT");


				if(intersects(me,you)){
					//rects.splice(i,1);
					socket.emit('removeEntity',obj.data.id);
					player.health-=5;

					if(player.health<1){
						socket.emit('hit',obj.data.from);
						death();
					}
					
				}

			}else{
				if(obj.x+xCam > width - (obj.size*2) || obj.y+yCam < 0 + (obj.size*2) || obj.y+yCam > height - (obj.size*2) || obj.x+xCam < 0 + (obj.size*2)){
				//rects.splice(this.count,1);
					socket.emit('removeEntity',obj.data.id);
				}
			}


			if(obj.data.from==player.username){
				for(var i=0; i<map.length;i++){
					var objs=map[i];
					
					you={};
					you.x=objs.x+xCam;
					you.y=objs.y+yCam;
					you.w=objs.tileSize;
					you.h=objs.tileSize;
					
					if(intersects(me,you)&&(objs.image=="tree"||objs.image=="stone")){
						socket.emit('removeEntity',obj.data.id);
						
						map[i].hit();
						
						if(obj instanceof itemizerEntity){
							map[i].itemize();				
						}
						return;


					}

				}
			}


		}

	});



	//console.log(firstMapIndex);
	//console.log(imageMap);
}
