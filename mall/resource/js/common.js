/*授权登录*/
loginUrl = "http://test.jiuqu1688.com/weixin/share?";
/*判断是否微信授权*/
function isLogin(s,u,j,i){	
	window.location.href = loginUrl+"s="+shopId+"&u="+u+"&j="+j+"&i="+i;	
}
/*获取url参数*/
function getUrlParam(name)
	{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = decodeURI(window.location.search).substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]);
	return null; //返回参数值
	}
/*图片链接*/
imgUrl = "http://192.168.1.10:8083/jiuqu-admin/upload";
baseurl = "http://192.168.1.10:8080/jiuqu-server";
	/*var base = "http://test.jiuqu1688.com";*/
/*imgUrl = "http://restest.jiuqu1688.com";*/

