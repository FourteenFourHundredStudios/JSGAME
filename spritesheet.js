function SpriteSheet(img,context){
	this.img=img;
	this.context=context;

	this.paintImg = function(px,py,x,y){
		context.drawImage(sprites,srcX,srcY,srcW,srcH,destX,destY,destW,destH);

	}


}