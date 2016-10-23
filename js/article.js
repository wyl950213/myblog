$.ajax({
	type: "POST",
	url: "article.php",
	async: true,
	success: function(response) {
		console.log(response);
		var json = $.parseJSON(response);
		var html = '';
		var count = 0;
		/*从服务器加载文章第一页*/
		for(var i = 0; i < json.length; i++) {
			html += "<div class='blogs'><h3>" + "<a class='title' href='/'>" + json[i].title + "</a>" + "<figure><img src='" + json[i].img + "'></figure>" + "</h3>" + "<ul><p>" + json[i].content +
				"</p><a href='/' target='_blank' class='readmore'>阅读全文&gt;&gt;</a></ul>" + "<p class='autor'><span>作者:" +
				json[i].author + "</span><span>分类：【<a href='/'>" + json[i].class + "</a>】</span><span>" +
				"浏览（<a href='/'>" + json[i].view + "</a>）</span><span class='comment'>评论（<a href='/'>" + json[i].comment +
				"</a>）</span></p><div class='dateview'>" + json[i].date + "</div><div class='comment-detial'><p><a class='comment-hide'>收起</a></p><p class='reportComment'><a>发表评论</a><form role='form' class='myComment'><div class='form-group'><label for='comment'>请输入你的评论</label><textarea class='form-control' name='comment' style='resize:none'></textarea></div><input type='submit' class='btn btn-default' value='提交'></form><ul></ul></div></div>"
		};
		count = json[json.length - 1].count;
		$(".bloglist").append(html);
		$(".bloglist").last().after("<dl style='width:100%'><dd><span class='load_more'>点击加载更多</span></dd></dl>");
		/*评论展示区封装*/
		function comment() {
			$(".comment-detial").hide();
			$(".myComment").hide();
			$(".comment").on("click",function() {
				if($.cookie("user")) {
					var title=$(this).parent().parent().find(".title").html();
					console.log(title);
					var ele=$(this).parent().next().next().children("ul");
					console.log(ele)
					$(this).parent().parent().children().show();
					$(".reportComment").on("click",function(){
						$(this).next().show();
					});
					showComment(title,ele);
					$(this).off("click");
					
				} else {
					alert("请先登录");
				}
			});
			$(".comment-hide").click(function() {
				$(this).parent().parent().hide();
				$(".comment").on("click",function(){
					$(this).parent().parent().children().show();
				});
			});
		};
		comment();/*评论区展示隐藏*/
		reportComment();/*发表评论*/

											
		/*判断是否需要加载更多文章*/
		var page = 2;
		if(page > count) {
			$(".load_more").off("click");
			$(".load_more").html("没有更多了");
			setTimeout(function() {
				$(".load_more").hide();
			}, 5000)
		}
		/*加载更多文章封装*/
		function loadMore() {
			$.ajax({
				type: "post",
				url: "article.php",
				async: true,
				data: {
					page: page,
				},
				success: function(response) {
					var json_more = $.parseJSON(response);
					var html_more = '';
					for(var i = 0; i < json_more.length; i++) {
						html_more+= "<div class='blogs'><h3>" + "<a class='title' href='/'>" + json_more[i].title + "</a>" + "<figure><img src='" + json_more[i].img + "'></figure>" + "</h3>" + "<ul><p>" + json_more[i].content +
						"</p><a href='/' target='_blank' class='readmore'>阅读全文&gt;&gt;</a></ul>" + "<p class='autor'><span>作者:" +
						json_more[i].author + "</span><span>分类：【<a href='/'>" + json_more[i].class + "</a>】</span><span>" +
						"浏览（<a href='/'>" + json_more[i].view + "</a>）</span><span class='comment'>评论（<a href='/'>" + json_more[i].comment +
						"</a>）</span></p><div class='dateview'>" + json_more[i].date + "</div><div class='comment-detial'><p><a class='comment-hide'>收起</a></p><p class='reportComment'><a>发表评论</a><form role='form' class='myComment'><div class='form-group'><label for='comment'>请输入你的评论</label><textarea class='form-control' name='comment' style='resize:none'></textarea></div><input type='submit' class='btn btn-default' value='提交'></form><ul></ul></div></div>"
					};
					$(".bloglist").append(html_more);
					comment();/*评论区展示隐藏*/
					reportComment();/*发表评论*/
					page++;
					/*判断当文章全部加载完成后，取消点击和滚动加载事件*/
					if(page > count) {
						$(window).off("scroll");
						$(".load_more").off("click");
						$(".load_more").html("没有更多了");
						setTimeout(function() {
							$(".load_more").hide();
						}, 2000)
					}
				}
			})
		}
		/*加载更多文章封装结束*/
		/*点击加载更多*/
		$(".load_more").on("click", function() {
			loadMore();
		});
		/*点击加载更多结束*/
		/*发表评论封装*/
		function reportComment(){
			$.each($(".myComment"),function(index,value){
			var that=this;
			$(this).validate({
				submitHandler:function(form){
					$(form).ajaxSubmit({
						url:"addComment.php",
						type:"POST",
						data:{
							title:$(that).parent().parent().find(".title").html(),
							user:$.cookie("user"),
						},
						beforeSubmit:function(){
							alert("数据交互中");
							$(that).find("input[type=submit]").attr("disable",true);
						},
						success:function(response){
							if(response){
								alert("以评论");
								$(that).find("input[type=submit]").removeAttr("disabled");
								setTimeout(function(){
									$(that).resetForm();
									$(that).hide()
								},1000),
								length=$(that).next().children().length;
								if(length){
									$(that).next().children().first().before("<li><span>"+$.cookie("user")+":</span>"+$(that).find("textarea").val()+"</li>");
									
								}else{
									$(that).next().append("<li><span>"+$.cookie("user")+":</span>"+$(that).find("textarea").val()+"</li>");
								}
								
								$(".reportComment").on("click",function(){
									$(this).next().show();
								})
							}
						}
					})
				},
				rules:{
					comment:{
						required:true,
					}
				},
				messages:{
					comment:{
						required:"点击提交必须输入内容",
					}
				}
					
			})
		})
		}
		/*发表评论结束*/
		/*显示评论封装*/
		function showComment(title,obj){
			/*加载评论第一页*/
			$.ajax({
				type:"post",
				url:"comment.php",
				async:true,
				data:{
					title:title,
				},
				success:function(response){
					var commentJson=$.parseJSON(response);
					console.log(commentJson);
					var html_comment="";
					var count=0;
					for(var j=0;j<commentJson.length;j++){
						console.log()
						html_comment+="<li><span>"+commentJson[j].user+":</span>"+commentJson[j].comment+"</li>";
					}
					$(obj).append(html_comment);
					
				}
			});
		}
	}
})