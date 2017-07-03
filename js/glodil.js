$(document).on("mouseenter", ".js-app-guide", function () {
    var a = $(this),
        b = a.find(".app-guide-box");
    a.find(".guide-prompt").hide(), localStorage.setItem("guide", !0), a.hasClass("disabled") || (a.addClass("disabled"), b.stop().css({
        opacity: "0",
        "margin-top": "15px"
    }).show().animate({
        opacity: "1",
        "margin-top": "0"
    }, 300));
}), $(document).on("mouseleave", ".js-app-guide", function () {
    var a = $(this),
        b = a.find(".app-guide-box");
    b.stop().animate({
        opacity: "0",
        "margin-top": "0px"
    }, 400, function () {
        b.hide();
    }), a.removeClass("disabled");
});$(document).on("mouseenter", ".app-qrcode", function () {
    var a = $(this),
        b = a.find(".app-qrcode");
    a.find(".app-qrcode").hide(), localStorage.setItem("guide", !0), a.hasClass("disabled") || (a.addClass("disabled"), b.stop().css({
        opacity: "0",
        "margin-top": "15px"
    }).show().animate({
        opacity: "1",
        "margin-top": "0"
    }, 300));
}), $(document).on("mouseleave", ".app-qrcode", function () {
    var a = $(this),
        b = a.find(".app-qrcode");
    b.stop().animate({
        opacity: "0",
        "margin-top": "0px"
    }, 400, function () {
        b.hide();
    }), a.removeClass("disabled");
}),
$(document).on("mouseenter", ".footer-icon-list .Qr-code-footer", function() {
		var a = $(this),
			b = a.find(".app-qrcode");
		a.hasClass("disabled") || (a.addClass("disabled"), b.stop().css({
			opacity: "0",
			"margin-top": "-150px"
		}).show().animate({
			opacity: "1",
			"margin-top": "-140px"
		}, 300))
	}),
		$(document).on("mouseleave", ".footer-icon-list .Qr-code-footer", function() {
		var a = $(this),
			b = a.find(".app-qrcode");
		b.stop().animate({
			opacity: "0",
			"margin-top": "-150px"
		}, 400, function() {
			b.hide()
		}), a.removeClass("disabled")
	});
	
// JavaScript Document
/*
判断手机还是电脑，导航菜单不同方式显示

*/
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

	
	
if(IsPC())
{  // $("nav-left").show();
   $("#nav").removeClass("mnav-left").addClass("nav-left");
   
	$(function(){
		$(".search-li").click(function(){
	$("#search-box").show().toggleClass("active");
		});
	$(".icon-search-close").click(function(){
		$("#search-box").hide();
		
		});
	});
	//alert("pc");
}
else{
	$(".nav-left").hide();
	  $("#nav").removeClass("nav-left").addClass("mnav-left");
   $("#nav").hide();
   $(".mnav").show();
   $(".nav-right").hide();
   
$(function(){
	$(".navbar-toggle").click(function(){
		$("#nav").toggle().removeClass("nav-left").addClass("mnav-left");
		$(this).toggleClass("active");		
		});	
	$("#nav a").click(function(){
		$("#nav").hide();
		$(".navbar-toggle").removeClass("active");
		});	  
	$("#msearch").click(function(){
	$("#search-box").toggleClass("active").show();
		 
		}); 
	$(".icon-search-close").click(function(){
		$("#search-box").hide();
		
		});
}); 

	//alert("sj");
}

function gotoTop(min_height){
$("#gotopbtn").click(//定义返回顶部点击向上滚动的动画
function(){$('html,body').animate({scrollTop:0},700);
});
//获取页面的最小高度，无传入值则默认为600像素
min_height ? min_height = min_height : min_height = 300;
//为窗口的scroll事件绑定处理函数
$(window).scroll(function(){
//获取窗口的滚动条的垂直位置
var s = $(window).scrollTop();
//当窗口的滚动条的垂直位置大于页面的最小高度时，让返回顶部元素渐现，否则渐隐
if( s > min_height){
$("#gotopbtn").fadeIn(100);
}else{
$("#gotopbtn").fadeOut(200);
};
});
};
gotoTop(); 
//文章点赞
    $.fn.postLike = function () {  
        if ($(this).hasClass('done')) {  
            alert('点多了伤身体~');  
            return false;  
        } else {  
            $(this).addClass('done');  
            var id = $(this).data("id"),  
                action = $(this).data('action'),  
                rateHolder = $(this).children('.count');  
            var ajax_data = {  
                action: "dotGood",  
                um_id: id,  
                um_action: action  
            };  
            $.post("/wp-admin/admin-ajax.php", ajax_data,  
                function (data) {  
                    $(rateHolder).html(data);  
                });  
            return false;  
        }  
    };  
    $(".dotGood").click(function () {  
        $(this).postLike();  
    }); 
/*查看子评论*/
$(".js-comments").click(function(){
	var id = $(this).data('id');
	if($("#li-comment-"+id+" ul.children").css("display")=="none"){
		$("#li-comment-"+id+" ul.children").fadeIn();
	}else{
		$("#li-comment-"+id+" ul.children").fadeOut();
	}
});

/*评论表情*/
document.addEventListener('DOMContentLoaded', function(){
   var aluContainer = document.querySelector('.comment-form-smilies');
    if ( !aluContainer ) return;
    aluContainer.addEventListener('click',function(e){
    var myField,
        _self = e.target.dataset.smilies ? e.target : e.target.parentNode,
        tag = ' ' + _self.dataset.smilies + ' ';
        if (document.getElementById('comment') && document.getElementById('comment').type == 'textarea') {
            myField = document.getElementById('comment')
        } else {
            return false
        }
        if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            sel.text = tag;
            myField.focus()
        } else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            var cursorPos = endPos;
            myField.value = myField.value.substring(0, startPos) + tag + myField.value.substring(endPos, myField.value.length);
            cursorPos += tag.length;
            myField.focus();
            myField.selectionStart = cursorPos;
            myField.selectionEnd = cursorPos
        } else {
            myField.value += tag;
            myField.focus()
        }
    });
});
jQuery(document).on("click", ".facetoggle", function($) {
    jQuery(".comment-form-smilies").toggle();
});

/*zuozheqiehuan*/
$(".postlist").click(function(){
    $('.mod-article-list').fadeIn();
    $('.comment-article-list').fadeOut();
    $(".postlist").addClass('current');
    $(".postlist").siblings('.commentlist').removeClass('current');
});
$(".commentlist").click(function(){
    $('.mod-article-list').fadeOut();
    $('.comment-article-list').fadeIn();
    $(".commentlist").addClass('current');
    $(".commentlist").siblings('.postlist').removeClass('current');
});
/*作者无限加载评论*/
$(document).on('click', '#commentsnavi a',
    function(e) {
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            beforeSend: function() {
                $('#commentsnavi').remove();
                $('.state-list').remove();
                $('#loading-comments').slideDown()
            },
            dataType: "html",
            success: function(out) {
                result = $(out).find('.state-list');
                nextlink = $(out).find('#commentsnavi');
                $('#loading-comments').slideUp(550);
                $('#loading-comments').after(result.fadeIn(800));
                $('.state-list').after(nextlink);
            }
        })
    });
