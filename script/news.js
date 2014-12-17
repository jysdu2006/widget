function initSlide(){
    var slide = $api.byId('slide');
    var pointer = $api.domAll('#pointer a');
    window.mySlide = Swipe(slide, {
        // startSlide: 4,
        auto: 5000,
        continuous: true,
        disableScroll: true,
        stopPropagation: true,
        callback: function(index, element) {
            var actPoint = $api.dom('#pointer a.active');
            $api.removeCls(actPoint,'active');
            $api.addCls(pointer[index],'active');
        },
        transitionEnd: function(index, element) {
            
        }
    });
}

function getBanner(){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
    
    var model = api.require('model');
    var query = api.require('query');


    query.createQuery(function(ret, err){
        if(ret && ret.qid){
            var queryId = ret.qid;
            query.limit({qid:queryId, value:3});
            model.findAll({class:"news", qid:queryId}, function(ret, err){
                if(ret){
//                  alert(JSON.stringify(ret));

                    var content = $api.byId('banner-content');
                    var tpl = $api.byId('banner-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret);

                    initSlide();
                    
                    api.hideProgress();
                }else{
                    // alert(JSON.stringify(err));
                }
            });
        }
    });
}

function openNews(el, type){
	type = type || 't';
	
	var newsId = $api.attr(el,'newsId');
	//text news
	if(type === 't'){
		api.openWin({
			name: 'news-text',
			url: 'news-text.html',
			pageParam: {newsId: newsId},
			opaque: true,
			vScrollBarEnabled: false
		});
	}else if(type === 'p'){	//picture news
		api.openWin({
			name: 'news-pic',
			url: 'news-pic.html',
			pageParam: {newsId: newsId},
			opaque: true,
			vScrollBarEnabled: false
		});
		
	}else if(type === 'v'){	//video news
		
		api.openWin({
			name: 'news-video',
			url: 'news-video.html',
			opaque: true,
			vScrollBarEnabled: false,
			pageParam: {newsId: newsId}
		});
		
		event.preventDefault();
	}
	
}

function initPage(){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
	
		
	var model, query;
	model = api.require('model');
    query = api.require('query');
    
    var html = '';
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId = ret.qid;
            model.findAll({
                class: "news",
                qid: queryId
            }, function(ret, err) {
                if (ret) {
                    var obj = $api.byId('txtNewsList');
                   
//                  alert(JSON.stringify(ret));
                    
                    for (var i = 0, len = ret.length; i < len; i++) {
                    	var thisItem = ret[i];
                    	var nType = thisItem.type;
                    	
	                    if(nType === 'p'){
	                    	var pic = thisItem.picture;
	                    	var picArr = pic.split(',');
	                    	
	                    	html += '<li class="pic"><h2>'+ thisItem.title +'</h2><div class="p">';
	                    	
	                    	for(var j = 0; j<3; j++){
	                    		html += '<a tapmode="" style="background-image:url('+ picArr[j] +')" newsId="'+ thisItem.id +'" onclick="openNews(this, \'p\');">';
	                    		html += '</a>';
	                    	}
	                    	
	                    	html += '</div></li>';
	                    	
	                    }else{
	                    	html += '<li class="'+ nType +'"><a tapmode="active" newsId="'+ thisItem.id +'" onclick="openNews(this, \''+ nType +'\');"><img src="'+ thisItem.thumbnail.url +'" />';
	                    	html += '<div class="content"><h2>'+ thisItem.title +'</h2><p>'+ thisItem.summary+ '</p></div></a></li>';
	                    }
                    }
                    
					$api.html(obj, html);
					
					api.hideProgress();
					api.refreshHeaderLoadDone();
					
					//init tapmode
					api.parseTapmode();
                    
                } else {
//              	alert(JSON.stringify(err));
                }
            });
        }
    });
    
}


apiready = function() {

    getBanner();
    initPage();
    
    //pull to refresh
    api.setRefreshHeaderInfo({
        visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function(ret, err){
    	
    	initPage();
    	
    });

};