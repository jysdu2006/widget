
//var avatar = $api.dom('#avatar img');
//var url = avatar.src;
//var cover = $api.dom('#cover');
//var pos = $api.offset(cover);
//var coverImg = $api.dom('#cover .cover');
//coverImg.src = url;
//var css = 'width:'+ pos.w +'px; height:'+ pos.h +'px;';
//$api.css(coverImg,css);

//function openActDetail(){
//api.openWin({
//  name: 'actDetail',
//  url: 'actDetail.html',
//  delay: 400
//});
//}


function openActDetail(did){
	api.openWin({
		name: 'actDetail',
		url: 'actDetail.html',
//		delay: 200,
		pageParam:{dataId:did}
	});
}

function openMer(did){
    api.openWin({
        name: 'restaurant',
        url: 'restaurant.html',
        opaque: true,
        pageParam:{dataId: did},
        vScrollBarEnabled: false
    });
}

//init personal center
function initPersonalCenter(json){
	json = json || {};
	if(!json.nickname){
		return;
	}
	var pc = api.require('personalCenter');
    var headerH = api.pageParam.headerHeight;
    
    var photo = json.photo || 'widget://image/userTitle.png';
    var point = json.point || 0;
    var actFav = json.actFav || 0;
    var merFav = json.merFav || 0;
    var newsFav = json.newsFav || 0;
    pc.open({
        y: 0,
        height: 200,
        fixedOn: 'user',
        fixed: true,
		imgPath: photo,
		placeHoldImg: photo,
		showLeftBtn: false,
		showRightBtn: false,
		username: json.nickname,
		count: point,
		modButton: {
			bgImg: 'widget://image/edit.png',
			lightImg: 'widget://image/edit.png'
		},
		btnArray:[{
			bgImg: 'widget://image/personal_btn_nor.png',
			lightImg: 'widget://image/personal_btn_light.png',
            selectedImg: 'widget://image/personal_btn_sele.png',
			title: '活动收藏',
			count: actFav,
			titleColor: '#ffffff',
			titleLightColor: '#55abce',
			countColor: '#ffffff',
			countLightColor: '#55abce'
		},{
            bgImg: 'widget://image/personal_btn_nor.png',
            lightImg: 'widget://image/personal_btn_light.png',
            selectedImg: 'widget://image/personal_btn_sele.png',
            title: '商家收藏',
			count: merFav,
			titleColor: '#ffffff',
			titleLightColor: '#55abce',
			countColor: '#ffffff',
			countLightColor: '#55abce'
		},{
            bgImg: 'widget://image/personal_btn_nor.png',
            lightImg: 'widget://image/personal_btn_light.png',
            selectedImg: 'widget://image/personal_btn_sele.png',
            title: '新闻收藏',
			count: newsFav,
			titleColor: '#ffffff',
			titleLightColor: '#55abce',
			countColor: '#ffffff',
			countLightColor: '#55abce'
		}]
	},function(ret,err){
		
		if(ret.click === 0){
			getFavData('act');
		}
		if(ret.click === 1){
			getFavData('mer');
		}
		if(ret.click === 2){
			getFavData('news');
		}
		
	});
}

//search database
function getData(dataTable, idArr, callback){
	idArr = idArr || [];
	dataTable = dataTable || 'activity';
	
	api.showProgress({
        title: '加载中...',
        modal: false
    });
    
	var model = api.require('model');
    
    var i = 0, len = idArr.length;
    
    for(i; i<len; i++){
    	var curId = idArr[i];
    	
    	model.findById({
    		class: dataTable,
    		id: curId
    	},function(ret, err){
    		if(ret){
//  			alert(JSON.stringify(ret));
    			
    			callback && callback(ret);
    		}else{
//  			alert(JSON.stringify(err));
    		}
    	});
	    
    }
    
}


function getFavData(type){
	var model = api.require('model');
    var query = api.require('query');
    
    type = type || 'act';
    
    //activity, news, merchant favorites
    var actArr, newsArr, merArr;
    var actJson, newsJson, merJson;
    
    var act_fav = $api.getStorage('act_fav');
    var mer_fav = $api.getStorage('mer_fav');
    var news_fav = $api.getStorage('news_fav');
    
    //template
    var content = $api.byId('activity');
    var tpl = $api.byId('template').text;
    var tempFn = doT.template(tpl);
    
    
    $api.byId('activity').innerHTML = '';
    
    if(act_fav && type === 'act'){
    	actArr = act_fav.split(',');
    	
    	getData('activity', actArr, function(data){
    		
//  		alert(JSON.stringify(data));

			if(!data){return;}
			
			data.favType = 'act';
            $api.append(content, tempFn(data));
            
            api.hideProgress();
            
    	});
    	
    }
    if(mer_fav && type === 'mer'){
    	merArr = mer_fav.split(',');
    	
    	getData('merchant', merArr, function(data){
//  		alert(JSON.stringify(data));

			if(!data){return;}
    		
    		data.favType = 'mer';
            $api.append(content, tempFn(data));
            
            api.hideProgress();
            
    	});
    	
    }
    if(news_fav && type === 'news'){
    	newsArr = news_fav.split(',');
    	
    	getData('news', newsArr, function(data){
//  		alert(JSON.stringify(data));

			if(!data){return;}
    		
    		data.favType = 'news';
            $api.append(content, tempFn(data));
            
            api.hideProgress();
            
    	});
    	
    }
    
}

function init(){
	var uid = $api.getStorage('uid');
	
	api.showProgress({
        title: '加载中...',
        modal: false
    });
    
	var model = api.require('model');
    
    //user id
    var userId = uid;
    
    model.findById({
    	class: 'user',
    	id: userId
    }, function(ret, err){
    	if(ret){
//	        alert(JSON.stringify(ret));
	
			var data = ret || {};
			var af, mf, nf;
			if(data.act_fav){
				
				af = data.act_fav.split(',').length;
				$api.setStorage('act_fav', data.act_fav);
			}
			if(data.mer_fav){
				mf = data.mer_fav.split(',').length;
				$api.setStorage('mer_fav', data.mer_fav);
			}
			if(data.news_fav){
				nf = data.news_fav.split(',').length;
				$api.setStorage('news_fav', data.news_fav);
			}
			
			
			var photoUrl = 'http://file.apicloud.com/mcm/A6965864070945/91f4a5f93b962c7c0f4e83effc4973fd.png';
			if(data.photo){
				photoUrl = data.photo.url;
			}
			
			//init personal center
			initPersonalCenter({
				nickname: data.nickname || 'APICloud',
				photo: photoUrl,
				point: data.point || 0,
				actFav: af || 0,
				merFav: mf || 0,
				newsFav: nf || 0
			});

            //show activity default
            getFavData('act');
	
	        //hide loading
	        api.hideProgress();
	    }else{
	        // alert(JSON.stringify(err));
	    }
	    
    });

}

function updateInfo(){
    var pc = api.require('personalCenter');
    pc.close();
    init();
}

apiready = function(){
	
	init();

};

