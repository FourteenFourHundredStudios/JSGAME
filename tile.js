


class Tile{

	constructor(x,y,image){
		//console.log(imageMap);
		this.x=x;
		this.y=y;
		this.image = image;
		this.tileSize=30;
		this.currentFrame=0;
		this.health=20;
	}

	static getTile(x,y){
		//this.returnBlock=null;
		//var obj;
		for(var i=0; i<map.length;i++){
			var obj=map[i];
		 	//console.log((x-30 )+"<"+obj.x+"<"+(x+30))
			if (obj.x>x-30 && obj.x<x+30 && obj.y>y-30 && obj.y<y+30){
				//console.log("d");
				return obj;
			}
		}
		return null;
	}

	static paintWorld(){
		drawing=0;
		//map.forEach(function(obj){
		for(var i=firstMapIndex;i<map.length;i++){
			this.obj=map[i];

			if(this.obj.x<width-xCam && this.obj.x>-30-xCam&& this.obj.y<height-yCam && this.obj.y>-30-yCam){
				this.obj.paintTile();
				drawing++;


			}else{
				//break;
				//return;
			}
			
		}
		//});
	}   

	static setTile(x,y,blockValue){
		for(var i=0; i<map.length;i++){
			var obj=map[i];
			if (obj.x>x-30 && obj.x<x+30 && obj.y>y-30 && obj.y<y+30){
				map[i]=new Tile(obj.x,obj.y,blockValue);
				return;
			}
		}

	}

	paintTile(){
		this.img=imageMap[this.image];
		if(this.img instanceof Array){
			this.img=imageMap[this.image][this.currentFrame];
		}		
		context.drawImage(this.img, this.x+xCam, this.y+yCam,this.tileSize,this.tileSize);

	}

	hit(){
		
		this.health--;
		if(this.health<1){
			this.itemize();
		}
	}

	itemize(){
		socket.emit('entity',{
			object:"spawner",args: {
			item: this.image, 
			x:this.x,
			y:this.y,
			rot:player.theta,
			data:{
				from:player.username,
				id:random(1111111,999999)
			}	
		}});
		//this.image="grass";
		socket.emit('setTile',{x:this.x,y:this.y,value:"grass"});
	}

	nextFrame(){
		//console.log(imageMap);
		if(this.currentFrame==imageMap[this.image].length-1){
			this.currentFrame=-1;
		}
		this.currentFrame++;
	}

}
