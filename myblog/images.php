<?php
header("Content-type:images/jpg");
$Psize=filesize('images/s8.jpg');
$picturedata = fread(fopen('images/s8.jpg', "r"), $PSize); echo $picturedata;
?>