var body = $api.dom('body');
$api.addEvt(body,'touchend',function(e){
   var main = $api.dom('#main');
   var wrap = $api.dom('#wrap');

   if(!$api.contains(main, e.target) || !$api.contains(wrap,e.target)){
       api.execScript({
           name: 'life-list',
           script: 'closeFramGroup();'
       });
   }
});



function searchMerArea(cityName) {
	if(!cityName){return;}

    var that = $api.dom(event.target, 'span');
    var txt = $api.text(that);
    api.execScript({
        name: 'life-list',
        script: 'changeCityTab("'+ txt +'");'
    });

    api.execScript({
    	frameName: 'life-listCon',
	    script: 'getDataByFilter("city", "'+ cityName +'");'
    });
}

function searchMerType(typeName) {
	if(!typeName){return;}
    
    var that = $api.dom(event.target, 'span');
    var txt = $api.text(that);
    api.execScript({
        name: 'life-list',
        script: 'changeTypeTab("'+ txt +'");'
    });
    api.execScript({
    	frameName: 'life-listCon',
	    script: 'getDataByFilter("type", "'+ typeName +'");'
    });
    
}


apiready = function(){
    var model = api.require('model');
    var query = api.require('query');
    var cityCon = $api.byId('city-content');
    var typeCon = $api.byId('type-content');
    
    query.createQuery(function(ret, err){
        if(ret && ret.qid){
            var queryId = ret.qid;
            
            //render city
            if(cityCon){
            	model.findAll({
	                class: "allRestCity",
	                qid: queryId
	            }, function(ret, err) {
	                if (ret) {
//	                	alert(JSON.stringify(ret));
	                	
	                    var content = $api.byId('city-content');
	                    var tpl = $api.byId('city-template').text;
	                    var tempFn = doT.template(tpl);
	                    content.innerHTML = tempFn(ret);
	                    
	                    api.parseTapmode();

	                } else {
//	                    alert(JSON.stringify(err));
	                }
	            });
            }
			
			//render type
            if(typeCon){
            	model.findAll({
	                class: "allRestaurantType",
	                qid: queryId
	            }, function(ret, err) {
	                if (ret) {
//	                    alert(JSON.stringify(ret));
	                    
	                    var content = $api.byId('type-content');
	                    var tpl = $api.byId('type-template').text;
	                    var tempFn = doT.template(tpl);
	                    content.innerHTML = tempFn(ret);
	                    api.parseTapmode();
	                    
	                } else {
//	                	alert(JSON.stringify(err));
	                }
	            });
            }
            
        }
    });

};