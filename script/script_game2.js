       
//canvas init//
var context;
var CanvasWidth;
var canvasHeight;

$(function(){
    context = document.getElementById('myCanvas').getContext('2d'); 
    CanvasWidth = 1000;
    canvasHeight = 640;

    var start = new Image();
    start.src="images/start_pixel.png";

    start.onload= function(){
      context.drawImage(start, 0,0);
  };

});
//////////////

//UserInfo Attribute//
var userName;
var nickName;
var email;
var additional;
/////////////////////

//gamePlay attribute//
var gamePlaying = false;
var score;
var heartCount;

var timer;
var timer2;

var ini0;
var ini1;
var ini2;
/////////////////////


//images//
var image = new Image();
image.src = "images/backGround_pixel2.png";

var intro = new Image();
intro.src = "images/intro1_pixel.png";

var intro2 = new Image();
intro2.src = "images/intro2_pixel.png";

var gameOver = new Image();
gameOver.src="images/GameOver_pixel.png";

var victory = new Image();
victory.src="images/victory_pixel.png";

var boom = new Image(110,101);
boom.src="images/boom_pixel.png";

var plane = new Image();
plane.src="images/plane_pixel.png";

var ddraw = new Image();
ddraw.src="images/Draw_pixel.png";

var heart = new Image();
heart.src="images/heart_pixel.png";

var boss = new Image();
boss.src="images/enemyBoss_pixel.png";

var clear = new Image();
clear.src="images/clear_pixel.png";
///////////


//게임의 요소들. 아군비행기, 적, 미사일들////
var myPlane;

var enemies;
var maxEnemy;
var enemyAlive;

var playerMissile;
var enemyMissile;

var enemyBoss;
var enemyBossAlive;
var beam;
var noBeam;
var bossMissile;
var noMissile;


/////////////////////////////////////////


//////////////
//게임의 시작//
/////////////////////////////////////////////////////////////////////////
//유저 정보를 기억하고, 게임을 시작하는 메소드를 부른다.//
function addInfo() {
    userName = document.getElementById("userName").value;
    nickName = document.getElementById("nickName").value;
    email = document.getElementById("email").value;
    additional = document.getElementById("additional").value;
    startMsg();
}

//게임 시작하는 메소드//
function startMsg() {
 init();
}

//게임을 시작하기 위해 값을 초기화한다. 
function init() {
    if(!gamePlaying){
        score=0;
        heartCount=15;

        maxEnemy=5;
        enemies = [];
        enemyAlive = 0;
        playerMissile = [];
        enemyMissile = [];
        enemyBoss=null;
        enemyBossAlive=false;
        beam=null;
        noBeam=true;
        bossMissile=null;
        noMissile=true;
        myPlane = new Player();



        ini0=setTimeout(()=>drawBackground(intro), 1000);
        ini1=setTimeout(()=>drawBackground(intro2), 2000);
        ini2=setTimeout(function(){
            createEnemy();
            draw();
            gameResume();
            clearTime();
        }, 3000);


    }
}

function clearTime(){
  clearTimeout(ini0);
  clearTimeout(ini1);
  clearTimeout(ini2);
}

//게임을 시작한다. INTERVAL을 사용해서 무한반복시키면서.
function gameResume(){
  gamePlaying=true;

  timer = setInterval(draw, 15);
  timer2 = setInterval(enemyAttack, 500);

  myPlane.planeLeftPressed=false;
  myPlane.planeRightPressed=false;
  myPlane.planeUpPressed=false;
  myPlane.planeDownPressed=false;
}
/////////////////////////////////////////////////////////////////////////


/////////////////////
//게임의 끝&일시정지//
/////////////////////////////////////////////////////////////////////////
//게임이 끝났다.
function gameSet(resultImage){
    gameStop();

    context.drawImage(resultImage,(CanvasWidth/2)-(resultImage.width/2),(canvasHeight/2)-(resultImage.height/2));
    var table=$('#scoreTable').html();
    var scoreRow="<tr><td>"+nickName+"</td><td>:::</td><td>"+score+"</td></tr>";

    $('#scoreTable').html(table+scoreRow);
    $('#score').attr("value",score);
    


    ini2=setTimeout(function(){
           if(confirm("게임 점수를 저장하시겠습니까?")){
        document.form.submit();
       }
        }, 3000);
    
    
}

//게임을 멈춘다.
function gameStop(){
   clearInterval(timer);
   clearInterval(timer2);
   gamePlaying=false;
}

function stageClear(){
    gameStop();
    context.drawImage(clear,(CanvasWidth/2)-(clear.width/2),(canvasHeight/2)-(clear.height/2));
    var stc = setTimeout(gameResume, 1000);

}

//게임을 일시정지하고, 게임을 종료하거나, 게임을 다시 한다. 
function pauseGame(){
    if(gamePlaying){
        gameStop();
        var flag =confirm("게임을 이어서 하시겠습니까?");
        if(flag){
            gameResume();
        }else{
            gameSet(ddraw);
        }
    }
}
///////////////////////////////////////////////////////////////////////////


////////////////
//키보드 핸들러//
/////////////////////////////////////////////////////////////////////////
function keydownHandler(event) {


   if (event.keyCode == 88) { 
    pauseGame();

    //왼쪽.
}else if (event.keyCode == 37) { 
    myPlane.planeLeftPressed = true;

    //오른쪽.
} else if (event.keyCode == 39) { 
    myPlane.planeRightPressed = true;

    //위쪽
} else if (event.keyCode == 38) { 
    myPlane.planeUpPressed = true;

    //아래쪽
} else if (event.keyCode == 40) { 
    myPlane.planeDownPressed = true;
}
};

function keyupHandler(event) {

    //Z키 눌렀을 때 
    if (event.keyCode == 90) {
     myPlane.fire();

    //왼쪽.
}else if (event.keyCode == 37) { 
    myPlane.planeLeftPressed = false;

    //오른쪽.
} else if (event.keyCode == 39) { 
    myPlane.planeRightPressed = false;

        //위쪽
    } else if (event.keyCode == 38) { 
        myPlane.planeUpPressed = false;

        //아래쪽
    } else if (event.keyCode == 40) { 
        myPlane.planeDownPressed = false;
    }
};
document.addEventListener("keydown", keydownHandler, false);
document.addEventListener("keyup", keyupHandler, false);
/////////////////////////////////////////////////////////////////////////

/////////////////////
//화면 그리기 메소드//interval
/////////////////////////////////////////////////////////////////////////
function draw() {

    context.clearRect(0, 0, CanvasWidth, canvasHeight);  
    drawBackground(image);
    drawPlane();
    drawEnemy();
    drawMissile();
    drawScore();            
}

function drawBackground(targetImage) {
    context.drawImage(targetImage,0,0,1000,640);          
}

//아군비행기 그리기
function drawPlane() {
    myPlane.move();            
    myPlane.draw();
}


//적 그리기
function drawEnemy() {
    for (var i in enemies) {
        enemies[i].move();
        enemies[i].draw();
        enemies[i].onHit(myPlane);
    }
    if(enemyBossAlive){
        enemyBoss.move();
        enemyBoss.draw();
        enemyBoss.onHit(myPlane);
    }
}

//미사일 그리기
function drawMissile() { 
    //적 미사일 그리기
    for (var i in enemyMissile) { 
        if (i<enemyMissile.length) {
            enemyMissile[i].draw();
            enemyMissile[i].move();
            enemyMissile[i].onHit();
        }
    }  
    //아군 미사일 그리기
    for (var i in playerMissile) {
        if (i<playerMissile.length) {
            playerMissile[i].draw();
            playerMissile[i].move();
            for (var j in enemies) {
                if(j<enemyMissile.length)
                    playerMissile[i].onHit(enemies[j]);
            }
            if(enemyBossAlive)
               playerMissile[i].onHit(enemyBoss);                 
       }
   }


   if(!noBeam){
    beam.move();
    beam.draw();
    beam.onHit(myPlane);
}else if(!noMissile){
    bossMissile.draw();
    bossMissile.onHit(myPlane);
}
}

//좌측 상단에 체력이랑 점수 그리기
function drawScore(){
    $('#debugArea').text(heartCount);

    var heartx=10;
    for(var i=0; i<heartCount; i++){
       context.drawImage(heart, heartx,10);
       heartx+=10+heart.width;   
   }

   context.font='italic 30px calibri';
   context.fillText("점수:"+score,0,60);
}
/////////////////////////////////////////////////////////////////////////


//////////////
//공격 메소드//interval
/////////////////////////////////////////////////////////////////////////
function enemyAttack() {
    if(!enemyBossAlive){
        createEnemy();
    }
    for (var i = 0; i < enemyAlive; i++){
        var temp = random(0,3);
        if (temp > 1 && enemies[i] != null) {                    
            enemies[i].fire();                    
        }
    }

    if(enemyBossAlive){
        enemyBoss.fire();
    }
}
//난수생성 메소드
function random (min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

//적 추가하기
function createEnemy() {
    if(maxEnemy>enemies.length){
        for(; enemies.length<maxEnemy; ) {
            enemies.push(new Enemy());
            enemyAlive++;
        }
    }
}

function createBoss(){
    enemyBoss= new Boss();
    enemyBossAlive=true;
}

/////////////////////////////////////////////////////////////////////////



//////////////
//객체들//
/////////////////////////////////////////////////////////////////////////
function Player() {
    this.width = plane.width;
    this.height = plane.height;
    this.X = 500;
    this.Y = 550;
    this.D = 5;
    this.planeLeftPressed = false;
    this.planeRightPressed = false;
    this.planeUpPressed = false;
    this.planeDownPressed = false;
    this.color = "white";

    this.draw = function() {
        context.drawImage(plane,this.X,this.Y);
    }


    this.move = function() {
    //영역밖으로 안나간다.
    if (this.planeLeftPressed && this.X > 0) {
        this.X -= this.D;
    }
    if (this.planeRightPressed && this.X+this.width < CanvasWidth) {
        this.X += this.D;
    }
    if(this.planeUpPressed && this.Y>0){
        this.Y -= this.D;
    }
    if(this.planeDownPressed && this.Y+this.height<canvasHeight){
        this.Y += this.D;
    }
}
this.fire = function() {
    playerMissile[playerMissile.length] = new PMissile(this.color, this.X, this.Y);
    playerMissile[playerMissile.length] = new PMissile(this.color, this.X+this.width, this.Y);
}

this.boom = function(){
    heartCount--;
    context.drawImage(boom,this.X+(this.width/2)-(boom.width)
       ,this.Y+(this.height/2)-(boom.height));

    if(heartCount<=0){
       gameSet(gameOver);
   }
}          
}

function Enemy() {
    this.X = random(0, 1000-70);
    this.Y = random(0, 300-20);
    this.width = 50;
    this.height = 40;
    this.enemyVX = random(1, 4);
    this.direction = false;
    this.color = "hsl("+ random(0, 360) +", 60%, 50%)";

    this.draw = function() {
        context.beginPath();
        context.moveTo(this.X,this.Y);
        context.lineTo(this.X+this.width,this.Y);
        context.lineTo(this.X+(this.width/2),this.Y+this.height);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }

    this.onHit = function(object){
       if ((this.X > object.X && this.X < object.X+object.width)  &&( this.Y > object.Y && this.Y < object.Y+object.height)) 
       {
        this.boom();
        object.boom();
    }
}

this.move = function() {
                if (!this.direction) { // move to left
                    this.X -= this.enemyVX; 
                    if (this.X < 4) // switch direction
                        this.direction = true;
                } else { // move to right
                    this.X += this.enemyVX;
                    if (this.X > 1000-70) // switch direction
                        this.direction = false;
                }                
            }
            this.fire = function() {
                enemyMissile[enemyMissile.length] = new EMissile(this.color, this.X+this.width/2, this.Y);
                enemyMissile[enemyMissile.length-1].setSpeed();
            }

            this.boom = function(){
                context.drawImage(boom,this.X+(this.width/2)-(boom.width)
                   ,this.Y+(this.height/2)-(boom.height));

                const index =enemies.indexOf(this);
                if(index>-1) enemies.splice(index,1);
                enemyAlive--;

                score+=10;
                
                if(score%(200)===0&&!enemyBossAlive){
                    createBoss();
                }

                if(enemyAlive===0&&!enemyBossAlive){
                    // gameSet(victory);
                }
            }         
        }

        function Boss() {
            this.width = boss.width;
            this.height = boss.height;

            this.followMode=true;

            this.X = (CanvasWidth/2)-(this.width/2);
            this.Y = 50;
            this.D=2;

            this.health=10;

            this.color = "hsl("+ random(0, 360) +", 60%, 50%)";

            this.draw = function() {
                context.drawImage(boss,this.X, this.Y);
            }
            this.move = function() {

                //플레이어가 보스보다 왼쪽에 있을 떄
                var location=this.X+(this.width/2);
                var targetlocation=myPlane.X+(myPlane.width/2);

                if (location>targetlocation&&location-targetlocation>1&&this.X > 0) {
                    this.X -= this.D;
                }else if (location<targetlocation&&targetlocation-location>1 &&this.X+this.width< CanvasWidth) {
                    this.X += this.D;
                }
            }

            this.fire = function() {

                if(this.followMode&&noBeam){ 
                    beam=new Beam(this.X, this.Y);
                    noBeam=false;
                }

            }

            this.boom = function(){
                context.drawImage(boom,this.X+(this.width/2)-(boom.width)
                   ,this.Y+(this.height/2)-(boom.height));
                this.health--;

                if(this.health===0){
                    score+=50;
                    enemyBoss=null;
                    enemyBossAlive=false;

                    maxEnemy++;
                    heartCount++;

                    stageClear();
                }

            }  

            this.onHit = function(object){
               if ((this.X > object.X && this.X < object.X+object.width)  &&( this.Y > object.Y && this.Y < object.Y+object.height)) {
                this.boom();
                object.boom();
            }
        }       
    }

    function Beam(X,Y){
        this.width = 20;

        this.X = X+(boss.width/2)-(this.width/2);
        this.Y = Y+boss.height;

        this.height=canvasHeight-Y;

        this.count=15;
        this.move=function(){
           this.X = enemyBoss.X+(boss.width/2)-(this.width/2);
           this.Y = enemyBoss.Y+boss.height;
       }

       this.draw = function() {
        this.count--;
        if(this.count>0){
            context.beginPath();
            context.rect(this.X, this.Y, this.width, this.height);
            context.fillStyle = "pink";
            context.fill();
        }else{
            noBeam=true;
        }
    }

    this.onHit = function(object) {
        var a=this.X < object.X+object.width;
        var b=this.X+this.width > object.X;
        var c= this.Y < object.Y+object.height;
        var d=this.Y+this.height>object.Y;

        if ( a&&b&&c&&d) {

            noBeam=true;
                    //상대를 터뜨림
                    object.boom();
                }else{
                }
            } 

        }


        function EMissile(color, X, Y) {
            this.X = X;
            this.Y = Y;
            this.width = 5;
            this.height = 10;
            this.missileVY = 4;
            this.color = color;

            this.draw = function() {
                context.beginPath();
                context.rect(this.X, this.Y, this.width, this.height);
                context.fillStyle = this.color;
                context.fill();
            }
            this.move = function() {
                this.Y += this.missileVY;
            }
            this.setSpeed = function() {
                this.missileVY = random(3, 7);
            }
            this.onHit = function() {

                if (this.X > myPlane.X && this.X < myPlane.X+myPlane.width
                    && this.Y > myPlane.Y && this.Y < myPlane.Y+myPlane.height) 
                {
                    //이 미사일을 배열에서 제거
                    const index=enemyMissile.indexOf(this);
                    enemyMissile.splice(index,1);
                    //상대를 터뜨림
                    myPlane.boom();
                }

                if(this.Y>canvasHeight){
                    enemyMissile.splice(enemyMissile.indexOf(this),1);
                }
            }                
        }

        //아군 미사일
        function PMissile(color, X, Y) {
            this.X = X;
            this.Y = Y;
            this.width = 5;
            this.height = 10;
            this.missileVY = 4;
            this.color = color;
            
            this.draw = function() {
                context.beginPath();
                context.rect(this.X, this.Y, this.width, this.height);
                context.fillStyle = this.color;
                context.fill();
                this.move();
            }
            this.move = function() {
                this.Y -= this.missileVY;
            }
            this.onHit = function(object) {

              if(this.Y<0){
                playerMissile.splice(playerMissile.indexOf(this),1);

            }

            if (this.X > object.X && this.X < object.X+object.width
                && this.Y > object.Y && this.Y < object.Y+object.height) 
            {   
                    //상대방 적을 터뜨림
                    object.boom();

                    //이 미사일을 배열에서 제거
                    playerMissile.splice(playerMissile.indexOf(this),1);
                    
                    //터진 적을 배열에서 제거
                }


            }                
        }