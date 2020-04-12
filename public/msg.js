
const ongoingTouches = [];
const el = document.getElementById("canvas");
const ctx = el.getContext("2d");
const p = document.getElementById('log');
var socket=io();
console.log(socket);
socket.emit('chat message','123');
let clickTime=1000;

startup();



function startup() {
  el.width = 600;
  el.height = 600;
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);
  log("初始化成功。",p);
}

function handleStart(evt) {
  evt.preventDefault();
  log("触摸开始。",p);
  let time= new Date();
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    log("开始第 " + i + " 个触摸 ...",p);
    
    ongoingTouches.push(copyTouch(touches[i],time.getTime()));
    log("第 " + i + " 个触摸已开始。",p);
  }
}

function handleMove(evt) {
  evt.preventDefault();
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    //const color = colorForTouch(touches[i]);
    const idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      
      socket.emit('mousemove',{x:touches[i].pageX-ongoingTouches[idx].pageX,y:touches[i].pageY-ongoingTouches[idx].pageY});

      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // 切换到新触摸
    } else {
      log("无法确定下一个触摸点。",p);
    }
}
}

function handleEnd(evt) {
  
  evt.preventDefault();
  log("触摸结束。",p);
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    //const color = colorForTouch(touches[i]);
    
    const idx = ongoingTouchIndexById(touches[i].identifier);
    console.log(idx)
    if (idx >= 0) {
      
      if (new Date().getTime()-ongoingTouches[idx].starttime<clickTime)
      {
        
      let leftno=0;

      for (let j=0;j<ongoingTouches.length;j++)
      {
        if (ongoingTouches[j].pageX<ongoingTouches[idx].pageX)
        {
          leftno++;
        }
      }
      
      /*log('idx:'+idx,leftno);
      log('toucheslength:'+ongoingTouches.length+', leftno:'+leftno);*/
      emitMeg(ongoingTouches.length,leftno);
        //socket.emit('leftclick');

      }
      ongoingTouches.splice(idx, 1);  // 用完后移除
    } else {
      log("无法确定下一个触摸点。",p);
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  log("触摸取消。",p);
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[i].identifier);


    ongoingTouches.splice(idx, 1);  // 用完后删除
  }
}

// 以下是便捷函数

function colorForTouch(touch) {
  const r = (touch.identifier % 16).toString(16);
  const g = (Math.floor(touch.identifier / 3) % 16).toString(16);
  const b = (Math.floor(touch.identifier / 7) % 16).toString(16);
  const color = "#" + r + g + b;
  log("identifier " + touch.identifier + " 的颜色为：" + color,p);
  return color;
}


function copyTouch(touch,starttime) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
    starttime:starttime
  };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id === idToFind) {
      return i;
    }
  }
  return -1;    // 未找到
}


function log(msg,ele) {
    
  // ele.innerHTML =
  //   new Date().toString().substring(16, 24) + ' ' + msg + "\n" + ele.innerHTML;
  
    //socket.emit('chat message',new Date().toString().substring(16, 24) + ' ' + msg + "\n");
    
}

function emitMeg(length,leftno)
{
  let oneFingerTap=[0]
  let twoFingerTap=[1,2];
  let threeFingerTap=[3,4,5];
  let fourFingerTap=[6,7,8,9];
  let fingerTap=[oneFingerTap,twoFingerTap,threeFingerTap,fourFingerTap];

  //console.log('mouseClickEvent'+fingerTap[length-1][leftno]);
  socket.emit('mouseClickEvent'+fingerTap[length-1][leftno]);
  

}