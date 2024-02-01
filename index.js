
let selectedOptn ;
let canvasDiv = document.getElementById("canvas-area") ;
let sideMenu = document.getElementById("side-menu") ;
let canvas = document.getElementById("myCanvas") ;
let colorPalette = document.getElementById("curr_color") ;
let titleDiv = document.getElementById("sheet-title") ;
let x1, y1; 
let startX, startY ;
let ctx = canvas.getContext("2d") ;
let drawing = false;
let defColor ="#202020" ;
let shape = [] ;

const intitCanvas=()=>{
  canvas.height = canvasDiv.clientHeight;
  canvas.width = canvasDiv.clientWidth;
  let workSpaceData = JSON.parse(localStorage.getItem("sheet")) ;
  titleDiv.innerText = 'Untitled Sheet' ;
  if(workSpaceData){
    shape = Object.values(workSpaceData)[0];
    titleDiv.innerText = Object.keys(workSpaceData)[0] ;
    redrawShape() ;
  }
}

const menuSelected = (e) =>{
  selectedOptn = e.target.dataset.name ;
  if(selectedOptn == 'pen'){
    canvasDiv.style.cursor = "url(http://icons.iconarchive.com/icons/designcontest/vintage/32/Patent-Pen-icon.png) 0 30, progress";
  }else if(selectedOptn == 'eraser'){
    canvasDiv.style.cursor = "url(./assets/eraser.png) 50 10, progress";
  }else{
    canvasDiv.style.cursor = "crosshair";
  }
}

const initDraw = (e) =>{
  x1 = startX = e.offsetX ; 
  y1 = startY = e.offsetY;
  drawing = true ;
}

const draw =(e)=>{
  if(drawing){
    let currX = e.offsetX ;
    let currY = e.offsetY ;
    if(selectedOptn == 'pen'){
      ctx.beginPath(); 
      ctx.moveTo(x1, y1)
      ctx.lineTo(e.offsetX,e.offsetY);
      ctx.stroke();
      ctx.strokeStyle = defColor ;
      shape.push({x:x1,y:y1,p1:e.offsetX,p2:e.offsetY, shape: 'line', color: defColor}) ; 
      x1 = e.offsetX; 
      y1 = e.offsetY;
    }else if(selectedOptn == 'rectangle') {
      let width = currX - x1 ;
      let height = currY - y1 ;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawShape() ;
      drawRectangle(x1, y1, width, height, defColor) ; 
    }else if(selectedOptn == 'circle'){
      let radius = Math.sqrt(Math.pow(currX - x1, 2) + Math.pow(currY - y1, 2));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawShape() ;
      drawCircle(x1, y1, radius, defColor);
    }else if(selectedOptn == 'triangle'){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawShape() ;
      drawTriangle(x1, y1, currX, currY, defColor) ;
    }
  }
  
  if(selectedOptn == 'eraser'){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shape = [];
  }
}

const redrawShape =()=>{
  shape.forEach((sh)=>{
    if(sh.shape == 'rect'){
      drawRectangle(sh.x, sh.y, sh.width, sh.height, sh.color) ;
    }else if(sh.shape == 'line') {
      ctx.beginPath() ;
      ctx.moveTo(sh.x,sh.y) ;
      ctx.lineTo(sh.p1, sh.p2) ;
      ctx.stroke() ;
      ctx.strokeStyle = sh.color ;
    }else if(sh.shape == 'circle'){
      drawCircle(sh.x, sh.y, sh.radius, sh.color) ;
    }else if(sh.shape == 'triangle'){
      drawTriangle(sh.x, sh.y, sh.x1, sh.y1, sh.color) ;
    }
  })
}

const drawTriangle=(x, y, x1, y1, color)=>{
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x1+ 120, y1); 
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}


const drawRectangle=(x,y,w,h, color)=>{
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
}

function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

const stopDraw = (e) =>{
  drawing = false ;
  let currX = e.offsetX ;
  let currY = e.offsetY ;
  if(selectedOptn == 'rectangle'){
    let width = currX - x1 ;
    let height = currY - y1 ;
    shape.push({x : x1, y: y1, width: width, height: height, shape: 'rect', color: defColor}) ;
  }else if(selectedOptn == 'circle'){
    let radius = Math.sqrt(Math.pow(currX - x1, 2) + Math.pow(currY - y1, 2));
    shape.push({x: x1, y:y1, radius: radius, shape: 'circle', color: defColor}) ;
  }else if(selectedOptn == 'triangle'){
    shape.push({x: x1, y: y1, x1:currX, y1: currY, shape: 'triangle', color: defColor}) ;
  }
}

const selectColor=(e)=>{
  defColor = e.target.value ;
}

const saveSheet =(e)=>{
  if (e.ctrlKey && e.key === 's'){
    let sheetArr = {} ;
    sheetArr[titleDiv.innerText] = JSON.parse(JSON.stringify(shape)) ;
    const sheetData = JSON.stringify(sheetArr) ;
    localStorage.setItem('sheet', sheetData) ;
  }
}

intitCanvas() ;

sideMenu.addEventListener('click', menuSelected) ;

canvasDiv.addEventListener('mousedown', initDraw) ;

canvas.addEventListener('mousemove', draw) ;

canvas.addEventListener('mouseup', stopDraw) ;

colorPalette.addEventListener('change', selectColor) ;

document.addEventListener('keydown', saveSheet) ;
