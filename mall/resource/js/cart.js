$(function(){
				shopId = getUrlParam("shopId");
				$("#cartid").attr("href","cart.html?shopId="+shopId);
	           $("#index").attr("href","index.html?shopId="+shopId);
	           $("#findid").attr("href","find.html?shopId="+shopId);
	           $("#personalid").attr("href","personal.html?shopId="+shopId);
				
				getCart();
				function getCart(){
					$.ajax({
						type:"post",
						url:baseurl+"/user/core/cartList?requestType=1&version=1.0",
						async:false,
						data:{shopId:shopId},
						success:function(data,status){
							console.log(data);
							if(data.flag == 0 && data.data){
								var commendSource = $("#cartNull").html();
								var commendTemplate = Handlebars.compile(commendSource);
								data.data.imgUrl = imgUrl;
								data.data.shopId = shopId;
								var commendHtml = commendTemplate({commend:data.data});
								$(".mui-content").html(commendHtml);
							}
							else if(data.flag == 1){
								data.data.imgUrl = imgUrl;
								$("#cartnum").html(data.data.length);	
								var cartSource = $("#cartList").html();
								var cartTemplate = Handlebars.compile(cartSource);
								var cartHtml = cartTemplate({cart:data.data});
								$(".cart-list").html(cartHtml);
								mui('.mui-numbox').numbox();
								console.log(data.shopName)
								$("#shopname").html(data.shopName);
							}
							else if(data.flag == -1){
								isLogin(shopId,null,4,null);
							}
						},
						error:function(err){
							alert("出错了");
						}
					});
				}
			
		$("#all").click(function(){
			$("input[type=checkbox]").prop("checked",$(this).prop("checked"));
			ChangeAmount();
		})
        $(".cart-item-left input").change(function(){
        	ChangeAmount()   
        });
        $('.mui-input-numbox').change(function() {
            var id = $(this).parent().parent().parent().parent().parent().data('id');
            jsonp("/user/core/updateCart?requestType=1&version=1.0","post",{id:id,num:$(this).val(),shopId:shopId},function(data,status){
            	ChangeAmount();
            },function(err){
            	alert("修改失败");
            })
        });

        var btnbuy = document.getElementById('btnbuy');
        if (btnbuy) {
            btnbuy.addEventListener('tap', function () {
                var ids = '';
                var valueList = new Array();
                $(".cart-item-left input:checked").each(function() {
                    valueList.push(this.value);
                });
                if (valueList.length == 0) {
                    mui.toast("请先选择购物车商品");
                    return false;
                }
                
                ids = valueList.join(',');
                
                window.location.href="order.html?ids="+ids+"&&shopId="+shopId;
            });
        }
        var btndeleteall = document.getElementById('btndeleteall');
        if (btndeleteall) {
            btndeleteall.addEventListener('tap', function () {
            	var valueList = new Array();
                $(".cart-item-left input:checked").each(function() {
                    valueList.push(this.value);
                });
                if (valueList.length == 0) {
                    mui.toast("请先选择购物车商品");
                    return false;
                }
                var r = confirm("确定删除这个商品吗?");
                if (r == true) {
                    $(".cart-item-left input:checked").each(function () {
                        var id = $(this).parent().parent().data("id");
                        jsonp("/user/core/delCart?requestType=1&version=1.0","post",{id:id,shopId:shopId},function(data,status){	
			            	getCart();
			            	ChangeAmount();
			            },function(err){
			            	alert("删除失败");
			            })
                    });
                }
            });
        }
    

    function ChangeAmount() {
    	toatlamount = 0;
    	count = 0
        $(".cart-item-left input:checked").each(function(){
            var proinfo = $(this).parent().parent();     
            var price = parseFloat($(proinfo).data('price'));
         	var id = $(proinfo).data('id');
            count += parseInt($('#num'+id).val());
            toatlamount += price * parseInt($('#num'+id).val());   
        });
        $("#total").html(toatlamount.toFixed(2));
        $("#total-num").html(count);
    }
    });