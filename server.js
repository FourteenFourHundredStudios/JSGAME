//cd "/Users/Marc/Documents/Code/JSGAME";node server.js;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');
var util = require('util');
javaClients=[]
htmlClients=[]

jSock="";
hSock="";

jSockString="";

function random(min,max){
  return Math.floor((Math.random() * max) + min);
}


map=[];
patch=null;
for(var i=0;i<100;i++){
    for(var j=0;j<100;j++){
      img="tallgrass";
     //img="tree";
      if(patch==null){
        if(random(1,100)==1 ){
          patch={x:i,y:j,size:random(10,35)};
          console.log(patch);
        }
      }else{
        if(i>patch.x+random(5,10) && i  < patch.x+patch.size+random(5,10) && j>patch.y+random(5,10) && j  < patch.y+patch.size+random(5,10)){
          img="grass";
        }

         if(i>patch.x+patch.size && j > patch.y+patch.size && patch != null){
          patch=null;
        }
        //  img="tallgrass";
        
      }
      
      if(i==0 || i==99 || j==0 || j==99){
        img="stone";
      }

      if(random(1,100)==5 ){
        img="tree";
      }

      map.push({x:i*30,y:j*30,image:img});

    }
  }

io.on('connection', function(socket){
  console.log('HTML5 user connected!');
  htmlClients.push(socket);
  hSock=socket;
  socket.on('join', function (data) {
    //console.log("sending map...");
    socket.join(data.username); // We are using room of socket io
    map.forEach(function(obj){
      //io.sockets.in[socket.id].emit("blockData",obj);
      io.sockets.in(data.username).emit('blockData', obj);
      //console.log(obj);
    });
     console.log("done sending map...");
  });

  

   socket.on('disconnect', function(){
     console.log('HTML5 user disconnected :(');


  });


socket.on('playerData', function(msg){
  //console.log("message: "+msg);
    io.emit('playerData',msg);
    jemit('playerData',msg);
});

socket.on('removeEntity', function(msg){
  //console.log("message: "+msg);
    io.emit('removeEntity',msg);
    jemit('removeEntity',msg);
});

socket.on('entity', function(msg){
  //console.log("message: "+msg);
    io.emit('entity',msg);
    jemit('entity',msg);
});

socket.on('projectileEntityData', function(msg){
  //console.log("message: "+msg);
    io.emit('projectileEntityData',msg);
});

socket.on('itemEntityData', function(msg){
  //console.log("message: "+msg);
    io.emit('itemEntityData',msg);
});

socket.on('hit', function(msg){
  //console.log("message: "+msg);
    io.emit('hit',msg);
    jemit('hit',msg);
});

socket.on('chat', function(msg){
  io.emit('chat',msg);
  jemit('chat',msg);
});

socket.on('setTile', function(msg){
      //console.log("tile set");

      for(var i=0;i<map.length;i++){
        var obj=map[i];
        if (obj.x>msg.x-30 && obj.x<msg.x+30 && obj.y>msg.y-30 && obj.y<msg.y+30){
          map[i].image=msg.value;
          break;
        }
    }
    io.emit('setTile',msg);
    jemit('setTile',msg)
});

});

  
  function jemit(label,data){
   // console.log();
    //data=util.inspect(data).replace("\n","");
    data=JSON.stringify(data)

    //data=util.inspect(data).replace("\\n","");
    for(var i=0;i<javaClients.length;i++){
        javaClients[i].write(label+"=>"+data+"\n");
    }
  }

  net.createServer(function(sock) { 
    console.log("Java user connected!");

    
    javaClients.push(sock);
    jSock=sock;
    map.forEach(function(obj){
        sock.write("blockData=>"+ util.inspect(obj)+"\n")
    });
    sock.on('data', function(data) {         
       try{
          info=data.toString('utf8');
          s=JSON.parse(info.split("=>")[1]);
          io.emit(info.split("=>")[0],s);
          jemit(info.split("=>")[0],s);
         }catch(e){
          console.log("java parsing error");
          return;
        }
    });
    sock.on('close', function(data) { 
        for(var i=0;i<javaClients.length;i++){
          if(javaClients[i]==sock){
            console.log("Java user disconnected :(");
            javaClients.splice(i,1);
          }
        }
    });
  }).listen(3002, '10.0.0.19');


  console.log("JSGAME (Java) server listening on :3002");


 

app.route('/*')
  .get(function(req, res) {
    //res.send('Get a random book');
    //try{
    res.sendfile(req.path.substring(1));
    //}catch(e){
      //console.log(e);
    //}
    //console.log(req.path);
    //console.log(req.baseUrl);
    //console.log(req.hostname);
  })

app.route('/images/*')
  .get(function(req, res) {
    //res.send('Get a random book');
    res.sendfile(req.path.substring(1));
    //console.log(req.path);
    //console.log(req.baseUrl);
    //console.log(req.hostname);
  })

 app.all('/image', function (req, res, next) {
  //console.log('Accessing the secret section ...');
  console.log("WHATTTT");
  res.sendfile(req.baseUrl);
  next(); // pass control to the next handler
});

//http.listen(9000, '10.0.0.11',function(){
  
  http.listen(3001, '10.0.0.19',function(){
    console.log('JSGAME (HTML5) server listening on :3001');
  });


