var express=require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path=require('path');
var robot=require('robotjs');



app.get('/', function(req, res){
  var Cookies={};
  req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
    var parts = Cookie.split('=');
    Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
});
  console.log(Cookies);
  res.sendFile(__dirname + '/socket.html');
});

app.use('/public',express.static('./public'));

// app.get('/public/socket.io.js',function(req,res){
//   res.sendFile(path.join(__dirname,'public','socket.io.js'));
// })

let usernumber=0;
let userno=0;

let mouseEvent=[
  {
    excFunction:function(){
      robot.mouseClick('left',false);
    }
  },
  {
    
    excFunction:function(){
      robot.mouseClick('left',false);
    }
  },
  {
    excFunction:function(){
      robot.mouseClick('right',false);
    }
  },
  {
    excFunction:function(){
      console.log('1/3')
    }
  }
];

io.on('connection', function(socket){

  robot.setMouseDelay(0);
  robot.typeStringDelayed(1);
  userno++;
  usernumber++;
  
  let id=userno;

  io.emit('userstatus',{"userstatus":`${usernumber} users online`});
  console.log(`No ${id} user connected`);

  let n=0;
  socket.on('disconnect',()=>{usernumber--;console.log(`No ${userno} user disconnected`)});
  socket.on('chat message',function(msg){
	  n++;
    console.log(`No ${id} user's No ${n} message:${msg}`);
    io.emit('chat message',{'message':msg,'id':id});
  }); 

  socket.on('mousemove',function(msg){
    let mouse=robot.getMousePos();
    //console.log('mousemove',msg);
    robot.moveMouse(msg.x+mouse.x,msg.y+mouse.y);
  })

  socket.on('inputmessage',function(msg){

    robot.typeString(msg);
  })

  /*socket.on('leftclick',function(msg){
    console.log('leftclick');
    robot.mouseClick('left');
  })*/
  for (let i=0;i<mouseEvent.length;i++)
  {
    console.log('mouseClickEvent'+i+ ' ready');
    socket.on('mouseClickEvent'+i,function(msg){
      mouseEvent[i].excFunction();
    });
  }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});