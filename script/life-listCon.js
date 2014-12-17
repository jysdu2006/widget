
function getRestData(){
	var model = api.require('model');
    var query = api.require('query');
    
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId = ret.qid;
            model.findAll({
                class: "merchant",
                qid: queryId
            }, function(ret, err) {
                if (ret) {
//                    alert(JSON.stringify(ret));
                    
                    var content = $api.byId('lifeList');
                    var tpl = $api.byId('act-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret);
                    
                    //hide loading
                    api.hideProgress();
                    api.refreshHeaderLoadDone();
                    
                    //init tapmode
					api.parseTapmode();
                    
                } else {
                	//alert(JSON.stringify(err));
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
            model.findAll({class:"merchant", qid:queryId}, function(ret, err){
                if(ret){
                    // alert(JSON.stringify(ret));

                    var content = $api.byId('lifeList');
                    var tpl = $api.byId('act-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret);

                    //hide loading
                    api.hideProgress();
                    api.refreshHeaderLoadDone();
                    
                    //init tapmode
					api.parseTapmode();
					
                }else{
                    // alert(JSON.stringify(err));
                }
            });
        }
    });
    
}


function call(el) {
    event.stopPropagation();
    event.preventDefault();
    var num = $api.attr(el, 'rel');
    api.call({
        type: 'tel_prompt',
        number: num
    });
}

function openRest(el) {   
    var dataId = $api.attr(el, 'data-id');
    
    api.openWin({
        name: 'restaurant',
        url: 'restaurant.html',
        opaque: true,
        pageParam:{dataId: dataId},
        vScrollBarEnabled: false
    });

}

apiready = function() {
     
    getRestData();

    api.setRefreshHeaderInfo({
        visible: true,
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function(ret, err) {
    	getRestData();
    });
    
}

