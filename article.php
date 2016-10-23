<?php 
	require'config.php';
	$_sql=mysql_query("SELECT COUNT(*) AS count FROM article");
	$_result=mysql_fetch_array($_sql,MYSQL_ASSOC);
	
	$_page=1;
	$_pagesize=5;
	$_count=ceil($_result["count"]/$_pagesize);
//	echo $_count;
	
	if(!isset($_POST['page'])){
		$_page=1;
	} 
	else{
		$_page=$_POST['page'];
		if($_page>$_count){
			$_page=$_count;
		}
	}
	$_limit=($_page-1)*$_pagesize;
	$query=mysql_query("SELECT ({$_count}) as count,title,content,author,class,date,view,comment,img FROM article ORDER BY date DESC LIMIT {$_limit},{$_pagesize}")or die('SQL 错误！');
	$json='';
while(!!$row=mysql_fetch_array($query,MYSQL_ASSOC)) 
{ 
	foreach ($row as $key=> $value)
	{ 
		$row[$key] =urlencode(str_replace("\n","", $value)); 
	}
	 $json.= urldecode(json_encode($row)).',';
}
echo'['.substr($json,0,strlen($json)- 1).']';
mysql_close();
?>
