$(function(){
			
			shopId = getUrlParam("shopId");
			$("#cartid").attr("href","cart.html?shopId="+shopId);
           $("#index").attr("href","index.html?shopId="+shopId);
           $("#findid").attr("href","find.html?shopId="+shopId);
           $("#personalid").attr("href","personal.html?shopId="+shopId);
			var itemId = getUrlParam("itemId");
			var num = getUrlParam("num");
			var ids = getUrlParam("ids");
			var adrid = getUrlParam("id");
			setTimeout(function(){
				$(".settleorder").append('<div class="settleorderright">确认付款</div>');
				$(".settleorderright").click(function(){
					if(!$(".orderAddressY").is(":hidden")&&$(".addressTitle").data("adrid")){
						orderFormJson.shopId = shopId;
						orderFormJson.itemAmount = parseFloat($("#sum").html()).toFixed(2);
						orderFormJson.orderAmount = parseFloat($("#settlesum").html()).toFixed(2);
						/*orderFormJson.payFee = parseFloat($("#settlesum").html()).toFixed(2);*/
						orderFormJson.postscript = $("textarea").val();
						orderFormJson.addressId = $(".addressTitle").data("adrid");
						orderFormJson.orderType = $("input[name=orderpay]:checked").val();
						orderFormJson.shopId = shopId;
						if($("input[name=orderpay]:checked").val() == 2){
							orderFormJson.paymentRate = 0.1;
						}
						console.log(orderFormJson);
						var b = new Base64();  
		        		var str = b.encode(JSON.stringify(orderFormJson)); 
						createOrder(str);}
					else{alert("请添加地址")}
				});
			},300)
			if(ids){var strId = ids.split(",");}
			orderFormJson = {};
			getOrderlist();
			getaddress();
			orderFormJson.orderItemsList = [];
			param = [];
			/*createOrder(orderFormJson);*/
			function getOrderlist(){
				sum = 0;
				if(num){
					jsonp("/weixin/itemDetail?requestType=1&version=1.0","post",{itemId:itemId},function(data,status){
						console.log(data);
						if(data.flag == -1){
							isLogin(shopId,null,1,null);
						}
						else{
							
							var orderlist = {};
							var redpaperlist = {};
							redpaperlist.itemId = data.data.itemId;
							redpaperlist.num = num;
							orderlist.itemId = data.data.itemId;
							orderlist.productName = data.data.title;
							orderlist.itemNum = num;
							orderlist.marketPrice = data.data.marketPrice;
							orderlist.price = data.data.shopPrice;
							orderlist.itemProps = 1;
							data.data.num = num;
							data.data.picture = data.data.pictures[0];
							
							var price = parseFloat(data.data.shopPrice);
							var count = parseInt(num);
							sum += price*count.toFixed(2);
							orderFormJson.orderItemsList.push(orderlist);
							param.push(redpaperlist);
							param = JSON.stringify(param);
							getredpaper()
						}
						
					},function(err){
						
					});
				}
				else if(ids){
					for(i=0;i<strId.length;i++){
						jsonp("/user/core/searchCart?requestType=1&version=1.0","post",{id:strId[i],shopId:shopId},function(data,status){
							console.log(data)
							if(data.flag == -1){
								isLogin(shopId,null,1,null);
							}
							else{
								data.data.imgUrl = imgUrl;
								var orderlist = {};
								var redpaperlist = {};
								redpaperlist.itemId = data.data[0].itemId;
								redpaperlist.num = data.data[0].num;
								orderlist.itemId = data.data[0].itemId;
								orderlist.productName = data.data[0].title;
								orderlist.itemNum = data.data[0].num;
								orderlist.marketPrice = data.data[0].formerPrice;
								orderlist.price = data.data[0].price;
								orderlist.itemProps = 1;
								
								var price = parseFloat(data.data[0].price);
								var count = parseInt(data.data[0].num);
								sum += price*count.toFixed(2);
								
								orderFormJson.orderItemsList.push(orderlist);
								param.push(redpaperlist);
								if(param.length == strId.length){
									param = JSON.stringify(param);
									getredpaper()
								}
								
							}	
						},function(err){
							alert("出错了");
						})
					}}
				
			}
			$("input[name=orderpay]").click(function(){
				getsum();				
			});
			
			
			$(".orderAddressN").click(function(){
				if(num){
					window.location.href = "addAdr.html?itemId="+itemId+"&shopId="+shopId+"&num="+num;
				}else{
					window.location.href = "addAdr.html?ids="+ids+"&shopId="+shopId;
				}
				
			})
			$(".orderAddressY").click(function(){
				if(num){
					window.location.href = "adrlist.html?itemId="+itemId+"&shopId="+shopId+"&num="+num;
				}else{
					window.location.href = "adrlist.html?ids="+ids+"&shopId="+shopId;
				}
			})
			function createOrder(str){
				var ordersum = $("#settlesum").html();
				console.log(str)
				jsonp("/user/core/createOrder?requestType=1&version=1.0","post",{orderFormJson:str,shopId:shopId},function(data,status){
					console.log(data);
					if(data.flag == 1){
						window.location.href = "pay.html?orderid="+data.data+"&&ordersum="+ordersum+"&shopId="+shopId;
					}
					else if(data.flag == 0){
						alert(data.message);
					}
					
				},function(err){
					alert("出错了")
				})
			}
			function getaddress(){
				if(adrid){
					jsonp("/user/core/searchAddress?requestType=1&version=1.0","post",{id:adrid,shopId:shopId},function(data,status){
						if(data.flag == -1){
							isLogin(shopId,null,1,null);
						}
						else{
							$(".orderAddressN").hide();
							var addressSource = $("#address").html();
							var addressTemplate = Handlebars.compile(addressSource);
							var addressHtml = addressTemplate({data:data.data});
							$(".orderAddressY").html(addressHtml);
							if(data.data.isDefault){
								$(".addeault").show();
							}
							else $(".addeault").hide();
						}
						
					},function(err){
						alert("出错了");
					})
				}
				else{	
					jsonp("/user/core/searchDefaultAddress?requestType=1&version=1.0","post",{shopId:shopId},function(data,status){
						if(data.flag == 0){
							$(".orderAddressY").hide();	
						}
						else if(data.flag == 1){
							$(".orderAddressN").hide();
							var addressSource = $("#address").html();
							var addressTemplate = Handlebars.compile(addressSource);
							var addressHtml = addressTemplate({data:data.data});
							$(".orderAddressY").html(addressHtml);
							$(".addeault").show();
						}
						else if(data.flag == -1){
							isLogin(shopId,null,1,null);
						}
						console.log(data)
					},function(err){
						alert("出错了");
					})
				}
			}
			function redsum(){
				if($(".redpaperother input:checked").length > 0){
					$("#redsum").html("-0");
					$("#sum").html(parseFloat(sum).toFixed(2));
					/*$("#settlesum").html(parseFloat(sum).toFixed(2));*/
					var sumhtml = '应付总金额：¥<span id="settlesum">'+parseFloat(sum).toFixed(2)+'</span>';
					$(".settleNum").html(sumhtml);
					$(".settleNum").removeClass("settelactive");
				}
				else if($(".redright input:checked").length > 0){
					var redsum = $(".redright input:checked").data("money");
					var couponId = $(".redright input:checked").data("id");
					$("#redsum").html("-"+parseFloat(redsum).toFixed(2));
					orderFormJson.couponId = couponId;
					orderFormJson.couponMoney = parseFloat(redsum).toFixed(2);
					if(redsum){
						/*$("#settlesum").html(parseFloat(sum-redsum).toFixed(2));*/
						var sumhtml = '应付总金额：¥<span id="settlesum">'+parseFloat(sum-redsum).toFixed(2)+'</span>';
						$(".settleNum").html(sumhtml);
						$(".settleNum").removeClass("settelactive");
					}
				}
			}
			function getsum(){
				if($("input[name=orderpay]:checked").val() == 1){
					$("#sum").html(parseFloat(sum).toFixed(2));
					var sumhtml = '应付总金额：¥<span id="settlesum">'+parseFloat(sum).toFixed(2)+'</span>';
					$(".settleNum").html(sumhtml);
					$(".settleNum").removeClass("settelactive");
				}
				else if($("input[name=orderpay]:checked").val() == 2){
					$(".redright input[name=redpaper]:checked").prop("checked",false);
					$("#redsum").html("-0");
					$("#sum").html(parseFloat(sum).toFixed(2));
					var sumhtml = '订金支付：¥<span id="settlesum">'+parseFloat(sum*0.1).toFixed(2)+'</span><p style="margin-bottom: 0;font-size: 10px;">('+parseFloat(sum*0.9).toFixed(2)+'需线下支付)</p>';
					$(".settleNum").html(sumhtml);
					$(".settleNum").addClass("settelactive");
				}
			}
			function getredpaper(){
				console.log(param);
				jsonp("/user/core/getCreateOrder?requestType=1&version=1.0","post",{param:param,shopId:shopId},function(data,status){
					console.log(data);
					data.data.imgUrl = imgUrl;
					Handlebars.registerHelper("time",function(item,options){
				  		var out = "";
				  		out = init(item);	
			           return out;
			         });
					Handlebars.registerHelper("hongbao",function(item,moneytype,options){
				  		var out = "";
				  		if(moneytype == 0){
				  			out = "<span>无门槛</span>"
				  		}
				  		else{
				  			out = "<span>满"+item+"可用</span>"
				  		}
			           return out;
			         });
					var orderlistSource = $("#orderlist").html();
					var orderlistTemplate = Handlebars.compile(orderlistSource);
					var orderlistHtml = orderlistTemplate({data:data.data});
					$(".orderlistContainer").append(orderlistHtml);
					$("input[name=redpaper]").click(function(){
						if($("input[name=orderpay]:checked").val() == 2){
							alert("订金支付不能用红包");
							$(this).prop("checked",false);
							$("#redsum").html("-0");
						}
						else{
							redsum();	
						}				
					});
					
					getsum();
					
					$(".redpapertop").click(function(){
						$(this).next().toggle();
					})
					
				},function(err){
					alert("出错了")
				})
			}
			function init(t){
				var d=new Date(t);
				var year=d.getFullYear();
				var day=d.getDate();
				var month=+d.getMonth()+1;
				var hour=d.getHours();
				var minute=d.getMinutes();
				var second=d.getSeconds();
				var f=year+"-"+formate(month)+"-"+formate(day);	
				return f;
			}
			function formate(d){
				return d>9?d:'0'+d;
			}
		});	