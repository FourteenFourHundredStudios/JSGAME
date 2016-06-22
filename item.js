itemHolder=new Image();
itemHolder.src="images/itemHolder.png";

itemHolderSelected=new Image();
itemHolderSelected.src="images/itemHolderSelected.png";

items=[];

function addEntityItem(itemImage){
	for(var i=0;i<items.length;i++){
		if(items[i].image==itemImage){
			items[i].count++;
			return;
		}
	}
	items.push(new EntityItem(itemImage,1));
}

function addItem(itemImage){
	for(var i=0;i<items.length;i++){
		if(items[i].image==itemImage){
			items[i].count++;
			return;
		}
	}
	items.push(new Item(itemImage,1));
}


class Item{

	constructor(image,count){
		this.image=image;
		this.count=count;
	}

	remove(){
		this.count--;
		if(this.count<1){			
			for(var i=0;i<items.length;i++){
				if(items[i]===this){
					items.splice(i,1);
					selectedItem=0;
				}
			}
		}
	}

	action(x,y){
		this.remove();
		this.onUse(x,y);
	}

	onUse(x,y){
		socket.emit('setTile',{x:mx-xCam,y:my-yCam,value:this.image});
	}

	static paintItemScreen(){

		context.font = "30px helvetica";
		context.fillText(items[selectedItem].image,29, (height-110));

		for(var i=0;i<items.length;i++){
			this.item=items[i];
			if(i==selectedItem){
				context.drawImage(itemHolderSelected, ((30+50)*i)+30, height-100,60,60);
			}else{
				context.drawImage(itemHolder, ((30+50)*i)+30, height-100,60,60);
			}
			this.img=imageMap[this.item.image];
			if(this.img instanceof Array){
				this.img=imageMap[this.item.image][0];
			}		
			context.drawImage(this.img, ((30+50)*i)+45, (height-100)+15,30,30);

			context.font = "15px helvetica";
			context.fillText(this.item.count+"",((30+50)*i)+36, (height-100)+18);

		}
		
	}

}




class EntityItem extends Item{

	constructor(image,count){
		super(image,count);
	}

	onUse(x,y){	
		socket.emit('entity',{object:this.image,args: {x:player.x,y:player.y,rot:player.theta,from:player.username,id:Math.random()} });
	}

}


//items.push(new EntityItem("spawner",10));
items=[new EntityItem("fireball",1000)];

if(player.username=="marc"||player.username=="Marc"){
	items.push(new EntityItem("itemizer"));
	//addEntityItem("itemizer");
}