function delWord(el){
    var input = $api.prev(el,'.txt');
    input.value = '';
}

function login(){
	api.openWin({
        name: 'userRegister',
        url: 'userRegister.html',
        opaque: true,
        vScrollBarEnabled:false
    });
}

function ensure(){
	var name = $api.byId('username').value;
	var pwd = $api.byId('password').value;
	var user = api.require('user');
	user.login({
	    username: name,
	    password: pwd
	}, function(ret, err) {
	    if (ret) {
//	    	alert(JSON.stringify(ret));
	    	
	    	$api.setStorage('uid', ret.userId);
	        
			setTimeout(function(){
	            api.closeWin();
            },100);
	
	    } else {
//	        alert(JSON.stringify(err));

			api.alert({
				msg: err.message
            });
            
	    }
	});

}

apiready = function(){
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
};