function jsonp(url,type,params,callback,errorcallbak){
	var base = "http://192.168.1.10:8080/jiuqu-server";
	/*var base = "http://test.jiuqu1688.com";*/
	url = base + url;
	if(type = "post"){
		$.ajax(url, {
		data:params,
		async: true,
		dataType: 'json', 
		type: 'post', 
		timeout: 15000,
		success: function(data) {
			 if(callback){
			 	callback(data);
			}
		},
		error: function(xhr, type, errorThrown) {
			if(errorcallbak){
			 	errorcallbak();
			}			
			console.log(errorThrown);
		}
	});	
	}
	else if(type == "get"){
		$.ajax(url, {
			async: true,
			dataType: 'json', 
			type: 'get', 
			success: function(data) {
				if (typeof(msgdata)=="string" ) {
					data = JSON.parse(data);
				}
				 if(callback){
				 	callback(data);
				}
			},
			error: function(xhr, type, errorThrown) {
				if(errorcallbak){
				 	errorcallbak();
				}			
				console.log(errorThrown);
			}
		});	
	}
	
}