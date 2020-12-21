<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>
    7조 비행기 게임
  </title>
  <link type="text/css" rel="stylesheet" href="css/mystyle.css" >
  <link type="text/css" rel="stylesheet" href="css/style_game.css" >

  <script src="script/jquery-3.5.1.js"></script>
  <script src="script/script_game2.js"></script>

  <?php
  $conn=mysqli_connect('localhost','visiter','1234','game');
  // $htmls(11)='';

      // 데이터베이스에 연결 실패
  if(!$conn){
    echo mysqli_connect_error($conn);
    ?>


    <script>
      alert('데이터베이스에 연결 실패!');
    </script>


    <?php

      //데이터베이스 정상 연결
  }
  ?>



</head>
<body id="container">
  <div>
    <header id="headerCon">
      <h3>Avoid and Escape</h3>
    </header>
    <nav>
      <ul>
        <li><a href="game.html">Play</a></li>
        <li></li><li></li><li></li><li></li>
        <li><a href="howto.html">How To?</a></li>
        <li></li><li></li><li></li><li></li>
        <li><a href="aboutus.html">About us</a></li>
        <li></li><li></li><li></li><li></li>
        <li><a href="contacts.html">contacts</a></li>
      </ul>
    </nav>
    <aside id="left">
      <div>
        <h2>등록 정보</h2>
        <form name="form" method="post" action="writePost.php">
          <label for="userName">사용자 이름 :</label>
          <input type="text" name="showName" id="userName" value="userName" onfocus="this.value=''" size="10" style="font-family: 'HYPost', serif;">
          <br /><br />
          <label for="nickName">닉네임     :</label>
          <input type="text" name="nickName" id="nickName" value="nickName" onfocus="this.value=''" size="15" style="font-family: 'HYPost', serif;">
          <br /><br />
          <label for="email">이메일     :</label>
          <input type="email" name="email" id="email" value="email@email.com" onfocus="this.value=''" size="15" style="font-family: 'HYPost', serif;">
          <br /><br />
          <label for="additional">비고    :</label>
          <input type="text" name="additional" id="additional" value="비고"  onfocus="this.value=''" size="17" style="font-family: 'HYPost', serif;">
          <input type="hidden" name="score" id="score" value=0>
          <br /><br />
          <div id="btn_group">
            <button type="button" id="addButton btn1" value="등록" onclick="addInfo()" style="font-family: 'HYPost', serif; font-weight: bold;">등록하기</button>
            <button type="reset" id= "btn2" value="초기화" style="font-family: 'HYPost', serif; font-weight: bold;">초기화</button>
          </div>
          <!--<button type="button" id="nonRegiStart" value="미등록 게임시작" style="font-family: 'HYPost', serif; font-weight: bold;">미등록 게임시작</button>!-->
        </form>                    
      </div>
      <hr>
      <div>
        <h2>Score Baord</h2>
      </div>
      <div>
        <h6 style="font-size: 6px; color: darksalmon;">
        *등록된 사용자만 보여집니다!</h6>
        <form>
         <table id="scoreTable">
           <tr>
             <th>User</th>
             <th>:::</th>
             <th>Score</th>
           </tr>  


           <?php

           $sql="SELECT nickName,score FROM scoreboard ORDER BY score desc LIMIT 0, 10 ";
           $result=mysqli_query($conn,$sql);

           for($i=0; $i<$result->num_rows; $i++){
            $row=mysqli_fetch_array($result);

            ?>
          
             <tr><td><?=$row['nickName']?></td><td>:::</td><td><?=$row['score']?></td></tr>
           <?php
         }

         ?>







       </table>
     </form>
   </div>
 </aside>
 <section id="right">
  <article id="gamePlace">
   <canvas id="myCanvas" width="1000px" height="640px"></canvas>
 </article>
</section>
<footer>
  <small>Copyright 2020, 박정훈, 윤예은, 김기연. All rights reserved.</small>           
</footer>
</div>
</body>
</html>