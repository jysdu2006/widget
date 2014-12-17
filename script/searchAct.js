   var body = $api.dom('body');
   var contains = function(parent, el) {
       var mark = false;
       if (el === parent) {
           mark = true;
           return mark;
       } else {
           do {
               el = el.parentNode;
               if (el === parent) {
                   mark = true;
                   return mark;
               }
           } while (el === document.body || el === document.documentElement);

           return mark;
       }
   };
   $api.addEvt(body, 'touchend', function(e) {
       var main = $api.dom('#main');
       var wrap = $api.dom('#wrap');
       if (!contains(main, e.target) || !contains(wrap, e.target)) {
           api.execScript({
               name: 'root',
               script: 'closeFramGroup();'
           });
       }
   });



function searchActArea(cityName) {
    if(!cityName){return;}
    //change title
    var that = $api.dom(event.target, 'span');
    var txt = $api.text(that);
    api.execScript({
		name: 'root',
		script: 'changeCityTab("'+ txt +'");'
    });
    //update content
    api.execScript({
		frameName: 'activity',
		script: 'getDataByFilter("city", "'+ cityName +'");'
    });
    
}


function searchActType(typeName) {
	if(!typeName){return;}
    //change title
    var that = $api.dom(event.target, 'span');
    var txt = $api.text(that);
    api.execScript({
		name: 'root',
		script: 'changeTypeTab("'+ txt +'");'
    });
    api.execScript({
		frameName: 'activity',
		script: 'getDataByFilter("type", "'+ typeName +'");'
    });
    
}


function getActFilter(){
	var model = api.require('model');
    var query = api.require('query');
    var cityCon = $api.byId('city-content');
    var typeCon = $api.byId('type-content');
    
    query.createQuery(function(ret, err) {
        
        if (ret && ret.qid) {
            var queryId = ret.qid;
            
            //render city
            if(cityCon){
            	model.findAll({
	                class: "allCity",
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
	                class: "allActType",
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
}


apiready = function() {
    
    getActFilter();

};


