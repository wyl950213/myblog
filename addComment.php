<?php
	require("config.php");
	$query="INSERT INTO comment (title,user,comment ,date) 
		VALUES('{$_POST['title']}','{$_POST['user']}','{$_POST['comment']}',NOW())";
	mysql_query($query) or die("新增失败".mysql_error());
    echo mysql_affected_rows();
    mysql_close();
?>