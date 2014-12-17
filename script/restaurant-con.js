
function initBanner(){
	var banner = $api.byId('banner');
	var bannerUrl = $api.attr(banner, 'rel');
	$api.css(banner, 'background-image:url(' + bannerUrl + ')');
	
//	var pos = $api.offset(banner);
//	var content = $api.byId('content');
//	
//	var hammer = new Hammer(content);
//	hammer.get('pan').set({
//	    direction: Hammer.DIRECTION_VERTICAL
//	});
//	hammer.on('pandown', function(ev) {
//	    var distance = ev.distance;
//	    var h = pos.h + parseInt(distance, 10);
//	    $api.css(banner, 'height:' + h + 'px;');
//	});
//	hammer.on('panend', function(ev) {
//	    $api.css(banner, 'height: 150px;');
//	});
	
}

function call(el) {
    var num = $api.attr(el, 'rel');    
    api.call({
        type: 'tel_prompt',
        number: num
    });
}

function openAlbum(imgs){
	
	var imgArr = [];
	if(imgs.indexOf(',') > -1){
		imgArr = imgs.split(',');
	}
	if(imgArr.length > 0){
		var obj = api.require('imageBrowser');
		obj.openImages({
		    imageUrls: imgArr,
		    activeIndex: 0,
		    showList: false
		});
	}
	
}

apiready = function() {
    var model = api.require('model');
    var query = api.require('query');
    
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    var dataId = api.pageParam.dataId;
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId = ret.qid;
            query.whereEqual({
                qid: queryId,
                column: "id",
                value: dataId
            });
            model.findAll({
                class: "merchant",
                qid: queryId
            }, function(ret, err) {
                if (ret) {
                    // alert(JSON.stringify(ret));
                    
                    var content = $api.byId('res-content');
                    var tpl = $api.byId('res-template').text;
                    var tempFn = doT.template(tpl);
                    content.innerHTML = tempFn(ret[0]);
                    
                    initBanner();
                    api.hideProgress();
                    api.parseTapmode();
                    
                } else {
                	// alert(JSON.stringify(err));
                }
            });
        }
    });
}
