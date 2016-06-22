socket.on('projectileEntityData', function(msg){
	//console.log(msg);
	rects.push(new ProjectileEntity(msg.type,msg.x,msg.y,msg.speed,msg.size,msg.theta,msg.info));
});

socket.on('removeEntity', function(msg){
	//console.log(msg);
	for(var i=0;i<rects.length;i++){
		if(rects[i].data.id==msg){
			rects.splice(i,1);
		}
	}
});

socket.on('blockData', function(msg){
	map.push(new Tile(msg.x,msg.y,msg.image));
});

socket.on('hit', function(msg){
	if(player.username==msg){
		points++;
	}
});


socket.on('itemEntityData', function(msg){
	rects.push(new ItemEntity(msg.type,msg.x,msg.y));
});

function factory(eatable, argumentList){
    var obj = Object.create(eatable.prototyope);
    return eatable.apply(obj, argumentList) || obj;
}

socket.on('entity', function(msg){
	rects.push(new EntityMap[msg.object](msg.args));
});

socket.on('setTile', function(msg){
	//map.push(new Tile(msg.x,msg.y,msg.image));
	Tile.setTile(msg.x,msg.y,msg.value);
});

socket.on('logout', function(msg){
	count=0;
	players.forEach(function(obj){
		if(obj.username==msg){
			players.splice(count,1);
		} 
		count++;
	});
});


socket.on('playerData', function(msg){
	//console.log("message: "+msg);
    //io.emit('playerData',msg);
  
    //console.log(msg);
    count=0;
    c=false
    if(!(msg.username==player.username)){
	    players.forEach(function(obj){
			if(obj.username==msg.username){
				players[count]=msg;
				//paintRect(msg.x,msg.y,msg.size,msg.size,"blue",msg.theta);
				c=true;
				//break;
			}
			count++;
		});
		if(c==false){
		
			players.push(msg);
		}
	}
});

