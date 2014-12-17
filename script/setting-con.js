function modifyNick(nickname){
	nickname = nickname || '';
	api.openWin({
		name: 'modifyNick',
		url: 'modifyNick.html',
		opaque: true,
		pageParam:{
			nickname: nickname
		},
		vScrollBarEnabled: false
	});
}

function modifyPwd(){
	api.openWin({
		name: 'modifyPwd',
		url: 'modifyPwd.html',
		opaque: true,
		vScrollBarEnabled: false
	});
}

function loginBtn(){
	api.openWin({
		name: 'userLogin',
		url: 'userLogin.html',
		opaque: true,
		vScrollBarEnabled:false
	});
}

function loginOut(){
	var user = api.require('user');
	user.logout(function(ret, err){
		if(ret){
			$api.clearStorage();
			
			api.execScript({
				name: 'root',
				script: 'openTab("main");'
			});
			setTimeout(function(){
				api.closeWin();
			},100);
			
		}else{
			alert(JSON.stringify(err));
		}
	});
	
}

function toRegister(){
	api.openWin({
		name: 'userLogin',
		url: 'userLogin.html',
		opaque: true,
		vScrollBarEnabled:false
	});
}

//清除下载缓存文件、拍照临时文件、网页缓存文件等
function clearData(){
	api.clearCache();
	
	setTimeout(function(){
		api.alert({
			msg: '缓存已清空!'
		});
	},300);
}

function openAbout(){
	api.openWin({
		name: 'about',
		url: './about.html'
	});
}

function init(){
	
	var uid = $api.getStorage('uid');
	
	var model = api.require('model');
	var query = api.require('query');
	 query.createQuery(function(ret, err) {
		if (ret && ret.qid) {
			var queryId = ret.qid;
			query.whereEqual({
				qid: queryId,
				column: "id",
				value: uid
			});
			model.findAll({class:"user", qid:queryId}, function(ret, err){
				if (ret) {
//              alert(JSON.stringify(ret));
				
					var content = $api.byId('content');
					var tpl = $api.byId('template').text;
					var tempFn = doT.template(tpl);
					content.innerHTML = tempFn(ret[0]);
					
				} else {
//                  alert(JSON.stringify(err));
				}
			});
		}
	});
	
}

apiready = function(){
	init();
};