var model, query;
apiready = function() {
	api.showProgress({
        title: '加载中...',
        modal: false
    });
    
	//load detail
    model = api.require('model');
    query = api.require('query');
    var dataId = api.pageParam.dataId; //activity id
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId = ret.qid;
            query.whereEqual({
                qid: queryId,
                column: "id",
                value: dataId
            });
            model.findAll({
                class: "activity",
                qid: queryId
            }, function(ret, err) {
                if (ret) {
//                	 alert(JSON.stringify(ret[0]));

                    var content = $api.byId('act-detail');
                    var tpl = $api.byId('act-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret[0]);
                    
                    var picLen = ret[0].picture.split(',').length;
                    if(picLen >= 4){
                    	//carousel
                    	$('#picture').carousel();
                    }
                } else {
                	// alert(JSON.stringify(err));
                }
                
                //hide loading
                api.hideProgress();
            });
        }
    });

};