function initSlide(){
    var slide = $api.byId('slide');
    var pointer = $api.domAll('#pointer a');
    window.mySlide = Swipe(slide, {
      // startSlide: 2,
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

function openActDetail(did){
  api.openWin({
    name: 'actDetail',
    url: 'actDetail.html',
    delay: 400,
    pageParam:{dataId:did}
  });
}

function openLifeDetail(){
    
    api.openWin({
        name: 'life-list',
        url: 'life-list.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function getData(){
    //show loading
    api.showProgress({
        title: '加载中...',
        modal: false
    });

    var model = api.require('model');
    var query = api.require('query');
    //mcm config
    model.config({
        appKey: 'A991A337-0212-A29D-0C9C-A518E39F2319',
        host: 'https://d.apicloud.com'
    });
    query.createQuery(function(ret, err){
        if(ret && ret.qid){
            var queryId = ret.qid;
            model.findAll({class:"activity", qid:queryId}, function(ret, err){
                if(ret){
                    // alert(JSON.stringify(ret));

                    var content = $api.byId('act-content');
                    var tpl = $api.byId('act-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret);

                    //hide loading
                    api.hideProgress();
                }else{
                    // alert(JSON.stringify(err));
                }
            });
        }
    });
}

function getBanner(){
    var model = api.require('model');
    var query = api.require('query');

    query.createQuery(function(ret, err){
        if(ret && ret.qid){
            var queryId = ret.qid;
            query.limit({qid:queryId, value:3});
            model.findAll({class:"activity", qid:queryId}, function(ret, err){
                if(ret){
                    // alert(JSON.stringify(ret));

                    var content = $api.byId('banner-content');
                    var tpl = $api.byId('banner-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret);

                    initSlide();
                }else{
                    // alert(JSON.stringify(err));
                }
            });
        }
    });
}

apiready = function(){
    getBanner();

    getData();

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
    	
    	var model = api.require('model');
    	var query = api.require('query');
    
        query.createQuery(function(ret, err){
            if(ret && ret.qid){
                var queryId = ret.qid;
                model.findAll({class:"activity", qid:queryId}, function(ret, err){
                    if(ret){
//                      alert(JSON.stringify(ret));

                        var content = $api.byId('act-content');
                        var tpl = $api.byId('act-template').text;
                        var tempFn = doT.template(tpl);
                        content.innerHTML = tempFn(ret);

                        //pull to refresh
                        api.refreshHeaderLoadDone();
                    }else{
//                      alert(JSON.stringify(err));
                    }
                });
            }
        });
    });
    
    
    api.addEventListener({
	    name: 'scrolltobottom'
	}, function(ret, err){
	    getData();
	});

};