canvas.width = window.innerWidth-300;
canvas.height = window.innerHeight-100;


width=canvas.width;
height=canvas.height;


grassImg=new Image();

grassImg.src="images/grass.png";

tallgrass1=new Image();
tallgrass1.src="images/tallgrass1.png";

tallgrass2=new Image();
tallgrass2.src="images/tallgrass2.png";

treeImg1=new Image();
treeImg1.src="images/Tree1.png";

treeImg2=new Image();
treeImg2.src="images/Tree2.png";

fireball=new Image();
//fireball.onload = function() { alert("Height: " + this.height); }
fireball.src="images/fireball.png";

stone=new Image();
//fireball.onload = function() { alert("Height: " + this.height); }
stone.src="images/stone.png";



imageMap={

	grass:grassImg,
	tallgrass:[tallgrass1,tallgrass2],
	tree:[treeImg1,treeImg2],
	fireball:fireball,
	stone:stone,

	itemizer:treeImg1
};


function random(min,max){
 	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//alert(imageMap["grass"]);
//test="ddd";