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

function getData(){
    //show loading
    api.showProgress({
        title: '加载中...',
        modal: false
    });

    var model = api.require('model');
    var query = api.require('query');
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
                    api.parseTapmode();
                }else{
                    // alert(JSON.stringify(err));
                }
            });
        }
    });
}

//filter data
function getDataByFilter(column, filter){
	if(!column || !filter){return;}
	
    //show loading
    api.showProgress({
        title: '加载中...',
        modal: false
    });

    var model = api.require('model');
    var query = api.require('query');
    query.createQuery(function(ret, err){
        if(ret && ret.qid){
            var queryId = ret.qid;
            
            query.whereEqual({
            	qid: queryId,
            	column: column,
            	value: filter
            });
            model.findAll({class:"activity", qid:queryId}, function(ret, err){
                if(ret){
                    // alert(JSON.stringify(ret));

                    var content = $api.byId('act-content');
                    var tpl = $api.byId('act-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret);

                    //hide loading
                    api.hideProgress();
                    api.parseTapmode();
                }else{
                    // alert(JSON.stringify(err));
                }
            });
        }
    });
}


function openActDetail(did){
	api.openWin({
		name: 'actDetail',
		url: 'actDetail.html',
//		delay: 200,
		pageParam:{dataId:did}
	});
}



function searchActArea(cityName) {
    // alert('cityName '+cityName);
    if (!cityName || cityName == '全城') {
        return;
    }
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId = ret.qid;
            query.whereEqual({
                qid: queryId,
                column: "city",
                value: cityName
            });
            // alert('searchActAreaBy '+queryId);
            model.findAll({class:"activity", qid:queryId}, function(ret, err){
                if (ret) {
                    var content = $api.byId('act-content');
                    var tpl = $api.byId('act-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret);
                    // alert('tempFn '+tempFn(ret));
                } else {
                    alert('err '+JSON.stringify(err));
                }
            });
        }
    });
}

function searchActType(typeName) {
    // alert('typeName '+typeName);
    if (!typeName || typeName == '全部类型') {
        return;
    }
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId = ret.qid;
            query.whereEqual({
                qid: queryId,
                column: "type",
                value: typeName
            });            
            model.findAll({
                class: "activity",
                qid: queryId
            }, function(ret, err) {
                if (ret) {
                    var content = $api.byId('act-content');
                    var tpl = $api.byId('act-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret);
                } else {
                    alert(JSON.stringify(err));
                }
            });
        }
    });
}

//var model=query=null;
apiready = function(){
	getBanner();
	
	getData();
	
};