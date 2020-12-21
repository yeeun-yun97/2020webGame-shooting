       



var userName;
var nickName;
var email;
var additional;
var gamePlaying = false;
var score;

$(function(){
  var start = new Image();
  start.src="images/start_pixel.png";

  start.onload= function(){
      var tempContext = document.getElementById('myCanvas').getContext('2d');
      tempContext.drawImage(start, 0,0);
  };


});


function startMsg() {
 init();
}
function addInfo() {
    userName = document.getElementById("userName").value;
    nickName = document.getElementById("nickName").value;
    email = document.getElementById("email").value;
    additional = document.getElementById("additional").value;
    startMsg();
}
function nonRegiStart() {
    startMsg();
}


                ////////////////////////////// attribute ///////////////////////////
        // canvas
        var score=0;


        var context;
        var width = 1000;
        var height = 640;
        var image = new Image();
        image.src = "images/backGround_pixel2.png";

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

        var timer;
        var timer2;
        // tank        
        var myPlane;
        // enemy
        var enemies = [];
        var maxEnemy = 10;
        var enemyAlive = 0;
        // bullet
        var playerMissile = [];
        var enemyMissile = [];
        var playerMissileIndex = 0;
        var enemyMissileIndex = 0;

        var heartCount;

        ///////////////////////////////////////


        function random (min, max){
            return Math.floor(Math.random() * (max - min) + min);
        }
        ////////////////////////////// function ///////////////////////////
        function init() {
            if(!gamePlaying){



                score=0;
                heartCount=3;

                enemies = [];
                enemyAlive = 0;
                playerMissile = [];
                enemyMissile = [];
                playerMissileIndex = 0;
                enemyMissileIndex = 0;
                context = document.getElementById('myCanvas').getContext('2d'); 
                myPlane = new Player();
                createEnemy();
                draw();

                gameResume();
            }
        }

        function gameResume(){
                  //interval 계속 실행
                  gamePlaying=true;

                  timer = setInterval(draw, 15);
                  timer2 = setInterval(enemyAttack, 500);
              }

              function createEnemy() {
                if(maxEnemy>enemies.length){
                    for(; enemies.length<maxEnemy; ) {
                        enemies.push(new Enemy());
                        enemyAlive++;
                    }

                }
            }

            function enemyAttack() {
                createEnemy();
                for (var i = 0; i < enemyAlive; i++){
                    var temp = random(0,3);
                    if (temp > 1 && enemies[i] != null) {                    
                        enemies[i].fire();                    
                    }
                }
            }

        //비행기와 적과 미사일들을 그린다. interval 15
        function draw() {
            context.clearRect(0, 0, width, height);  
            drawBackground();
            drawPlane();
            drawEnemy();
            drawMissile();
            drawScore();            
        }

        function drawScore(){
            $('#debugArea').text(heartCount);


            var heartx=10;
            var hearty=10;

            for(var i=0; i<heartCount; i++){
               context.drawImage(heart, heartx,10);
               heartx+=10+heart.width;   
           }


           context.font='italic 30px calibri';
           context.fillText("점수:"+score,0,60);
       }

        //draw에서 호출: 비행기를 움직이게 하고, 그린다. 
        function drawPlane() {
            myPlane.move();            
            myPlane.draw();
        }
        //draw에서 호출: 적을 움직이게 하고, 그린다. 
        function drawEnemy() {
            for (var i in enemies) {
                enemies[i].move();
                enemies[i].draw();
            }
        }
        //draw에서 호출: 미사일을 그린다. 
        function drawMissile() { 
            for (var i in enemyMissile) { 
                if (enemyMissile[i] != null) {
                    enemyMissile[i].enemyShot();
                    enemyMissile[i].onHit(myPlane);
                    enemyMissile[i].draw();
                }
            }  
            for (var i in playerMissile) {
                playerMissile[i].playerShot();
                for (var j in enemies) {
                    playerMissile[i].onHit(enemies[j]);
                }
                playerMissile[i].draw();                
            }       
        }

        //
        function attack() {
            myPlane.fire();
        }

        //배경을 그린다. 
        function drawBackground() {
            context.drawImage(image,0,0);
         // context.beginPath();
         // context.rect(0, 0, width, height);
         // context.fillStyle = "black";
         // context.fill();           
     }

     function gameSet(resultImage){
        gameStop();

        context.drawImage(resultImage,(width/2)-(resultImage.width/2),(height/2)-(resultImage.height/2));
        var table=$('#scoreTable').html();
        var scoreRow="<tr><td>"+nickName+"</td>:::<td>"+score+"</td></tr>";

        $('#scoreTable').html(table+scoreRow);
    }


    function gameStop(){
       clearInterval(timer);
       clearInterval(timer2);
       gamePlaying=false;
   }


   function exitGame(){
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

        ////////////////////////////keyListener//////////////////////////
        function keydownHandler(event) {

            $('#debugArea').text(event.keyCode);

             if (event.keyCode == 90) { // z key

            }else if (event.keyCode == 88) { // x key
                exitGame();
            }else  if (event.keyCode == 67) { // c key
                gameMenu();
            }else if (event.keyCode == 37) { // leftArrow <-
                myPlane.planeLeftPressed = true;
            } else if (event.keyCode == 39) { // rightArrow ->
                myPlane.planeRightPressed = true;
            } else if (event.keyCode == 32) { // spaceBar

            }
        };

        function keyupHandler(event) {
               if (event.keyCode == 90) { // z key
                 myPlane.fire();
            }else if (event.keyCode == 37) { // leftArrow <-
                myPlane.planeLeftPressed = false;
            } else if (event.keyCode == 39) { // rightArrow ->
                myPlane.planeRightPressed = false;
            } else if (event.keyCode == 32) { // spaceBar
                myPlane.missileLaunch = false;
            }
        };

        document.addEventListener("keydown", keydownHandler, false);
        document.addEventListener("keyup", keyupHandler, false);
        ////////////////////////////// object ///////////////////////////
        function Player() {
            this.width = plane.width;
            this.height = plane.height;
            this.X = 500;
            this.Y = 550;
            this.planeVX = 5;
            this.planeLeftPressed = false;
            this.planeRightPressed = false;
            this.color = "white";

            this.draw = function() {
                context.drawImage(plane,this.X,this.Y);
            }

            this.move = function() {
                //영역밖으로 안나간다.
                if (this.planeLeftPressed && this.X > 0) {
                    this.X -= this.planeVX;
                }
                if (this.planeRightPressed && this.X+this.width < width) {
                    this.X += this.planeVX;
                }
            }
            this.fire = function() {
                playerMissile[playerMissileIndex++] = new Missile(this.color, this.X, this.Y);
                playerMissile[playerMissileIndex++] = new Missile(this.color, this.X+this.width, this.Y);
            }

            this.boom = function(){
             context.drawImage(boom,this.X+(this.width/2)-(boom.width)
               ,this.Y+(this.height/2)-(boom.height));
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
                enemyMissile[enemyMissileIndex] = new Missile(this.color, this.X+this.width/2, this.Y);
                enemyMissile[enemyMissileIndex].setSpeed();
                enemyMissileIndex++;
            }

            this.boom = function(){
                context.drawImage(boom,this.X+(this.width/2)-(boom.width)
                   ,this.Y+(this.height/2)-(boom.height));
            }         
        }


        function Missile(color, X, Y) {
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

                //성능이슈를 위해 여기서 만약 미사일이 
                //캔버스에서 나갔을 때 배열에서 지워주는게 좋을 것 같다..

            }
            this.playerShot = function() {
                this.Y -= this.missileVY;
            }
            this.enemyShot = function() {
                this.Y += this.missileVY;
            }
            this.setSpeed = function() {
                this.missileVY = random(3, 7);
            }
            this.onHit = function(object) {
                if (this.X > object.X && this.X < object.X+object.width
                    && this.Y > object.Y && this.Y < object.Y+object.height) 
                {
                    enemyMissile.splice(enemyMissile.indexOf(this),1);
                    object.boom();
                    if (object == myPlane) {
                        heartCount--;
                        if(heartCount<=0){
                           gameSet(gameOver);
                       }
                   } else {
                    const index =enemies.indexOf(object);
                    if(index>-1) enemies.splice(index,1);
                    enemyAlive--;
                    score+=10;
                    if(enemyAlive===0){
                       gameSet(victory);

                   }
               }
           }
       }                
   }