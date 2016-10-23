<?php
    sleep(5);
    require "config.php";
    $query="INSERT INTO user (user,pass,email)
                VALUES('{$_POST['reg_user']}',sha1('{$_POST['reg_password']}'),'{$_POST['email']}')";
    mysql_query($query) or die("新增失败".mysql_error());
    echo mysql_affected_rows();
    mysql_close();
?>