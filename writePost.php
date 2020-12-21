<!DOCTYPE html>

<html>
<head>

</head>
<body>

	<div id=background>

		<div id="mainContainer">


			<?php
			$userName=$_POST['showName'];
			$nickName=$_POST['nickName'];
			$email=$_POST['email'];
			$additional=$_POST['additional'];
			$score=$_POST['score'];
			?>

			이름:<?=$userName?> 닉네임:<?=$nickName?> 이메일:<?=$email?> 추가:<?=$additional?> 점수:<?=$score?>

			<?php
			$conn=new mysqli('localhost','root','1010qpqp','game');
			$sql="INSERT INTO scoreboard (userName, nickName, email, additional, score)
			VALUES ('$userName', '$nickName', '$email', '$additional', '$score')";
			$conn->query($sql);





			header('location: game.php');
			?>


		</div>
	</div>

</body>
</html>
