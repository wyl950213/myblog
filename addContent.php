<?php 
	require "config.php";
    $query="INSERT INTO article (title,content,author,class,date,view,comment) 
    VALUES('{$_GET['title']}','{$_GET['content']}','{$_GET['author']}','{$_GET['class']}',NOW(),
    '{$_GET['view']}','{$_GET['comment']}')";
    mysql_query($query) or die("新增失败".mysql_error());
    echo mysql_affected_rows();
    mysql_close();
?>
