<?php
	include_once("config.php");

	if (($_FILES["image"]["type"] != "image/jpeg")
		|| ($_FILES["image"]["size"] > 5120000)){
		echo "<script>alert('只能上传小于5M的图片文件')</script>";
		exit();
	}

	if(empty($_POST['type'])){
		echo "<script>alert('请选择类型')</script>";
		exit();
	}
	if(empty($_POST['date'])){
		echo "<script>alert('请选择时间')</script>";
		exit();
	}
	if(empty($_POST['name'])){
		echo "<script>alert('请输入姓名')</script>";
		exit();
	}
	if(empty($_POST['phone'])){
		echo "<script>alert('请输入电话')</script>";
		exit();
	}
	if(empty($_POST['message'])){
		echo "<script>alert('请输入描述')</script>";
		exit();
	}

	$image_filename = md5(time()) . '.jpg';
	move_uploaded_file($_FILES["file"]["tmp_name"], "uploads/" . $image_filename);

	$date = mysql_real_escape_string($_POST['date']);
	$type = mysql_real_escape_string($_POST['type']);
	$name = mysql_real_escape_string($_POST['name']);
	$phone = mysql_real_escape_string($_POST['phone']);
	$message = mysql_real_escape_string($_POST['message']);
	$qq = mysql_real_escape_string($_POST['qq']);

	$sql = "INSERT INTO records (type, name, phone, message, qq, date, filename) VALUES ('{$type}', '{$name}', '{$phone}', '{$message}', '{$qq}', '{$date}', '{$image_filename}' )";
	mysqli_query($_conn, $sql) or die(mysqli_error($_conn) . "数据库错误");
	echo "<script>alert('登记成功')</script>";

?>
