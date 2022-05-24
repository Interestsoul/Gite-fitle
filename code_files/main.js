$(function () {
    $("#menu").find("li.menu").each(function () {
        $(this).find("ul").hide();
    }).bind("mouseover", function () {
        $(this).find("ul").show();
    }).bind("mouseout", function () {
        $(this).find("ul").hide();
    });
    //scrollto('#main');

    ///以下绑定左右left_slide 点击收藏事件
    $("#main .left_slide a").each(function () {
        var openname = "ui-icon-triangle-1-w";
        var closename = "ui-icon-triangle-1-e";
        $(this).bind("click", function () {
            ///当前打开,变成关闭
            if ($(this).hasClass(openname)) {
                $(this).removeClass(openname).addClass(closename);
                $("#main .left ").css({
                    'width': '0px',
                    'display': 'hidden'
                });
                $("#main .middle").css({
                    'margin-left': '10px'
                });
                $("#main .left_slide").css({
                    'left': '2px'
                });
                ///隐藏菜单
                $("#main .left_slide_menu").hide();
            } else {
                $(this).removeClass(closename).addClass(openname);
                $("#main .left ").css({
                    'width': '',
                    'display': ''
                });
                $("#main .middle").css({
                    'margin-left': ''
                });
                $("#main .left_slide").css({
                    'left': ''
                });

                ///展示菜单
                $("#main .left_slide_menu").show();
            }

        });
    });

    ///以下绑定头部导航
    $("#header .top_slide a").each(function () {
        var openname = "ui-icon-triangle-1-s";
        var closename = "ui-icon-triangle-1-n";
        //默认
        $(this).bind("click", function () {
            ///当前打开,变成关闭
            if ($(this).hasClass(openname)) {
                $(this).removeClass(openname).addClass(closename);
                $("#header .head_logo_baner").hide();
            } else {
                $(this).removeClass(closename).addClass(openname);
                $("#header .head_logo_baner").show();
            }

        });
    });

    ///菜单当前连接变色
    $(".left_slide_menu li>a").each(function(){
        var dom = $(this);
        if(location.href.indexOf(dom.attr('href')) != -1){
            dom.parent().addClass('alert-danger');
        }
    });

    // 绑定自动完成
    $(":input[autocompletes^='#']").each(function () {
        $(this).attr('autocomplete', 'off');
        //关闭自动提示

        var list = [];
        $($(this).attr('autocompletes')).find('option').each(function () {
            list.push({
                label: $(this).text(),
                value: $(this).val()
            });
        });

        $(this).autocomplete({
            autoFocus: true,
            minLength: 0,
            source: list,
            select: function (e, ui) {
                //location.href = ui.item.value;
            }
        });

    });

    //绑定Store
    $(":input[autocompletes='storage']").each(function () {
        $(this).attr('autocomplete', 'off');
        //关闭自动提示

        var name = $(this).attr("id") || $(this).attr('prop');
        //storeName

        $(this).autocomplete({
            autoFocus: true,
            minLength: 0,
            source: function (request, repsonse) {
                var re = /[&=?]/g;
                var key = location.href.split("/").slice(3).join("").replace(re, '_') + "_" + name;

                var data = $.storage.get(key);
                if (!!data) {
                    repsonse($.grep(data.split('^'), function (n, i) {
                        return n.indexOf(request.term) !== -1;
                    }));
                }
            }
        });

    });

    //textarea自动高度
    $('.convert textarea').on('input propertychange', function(){
        if(this.clientHeight >= this.scrollHeight)
        {
            return ;
        }
        var self = $(this);
        var h = parseInt(self.css('height'));
        var h2 = Math.max(h,this.scrollHeight);
        self.css("height", (h2+10) + "px");
    });

    /***支持拖放操作***/
    dropDrag();

    //绑定拖放上存
    dropDragUpload();

    /***加入广告***/
    //addStopImg();
    /***h5***/
    h5();

    /***绑定上存连接的事件***/
    /*
     $("#fileToUploadBtn").bind("click", function() {
     $('#fileToUpload').click();
     });
     */

    /***定义文件上存组件内容发生变化方法 ***/
    var _tmpfunc_change =  function () {
        var f = $(this).attr("forfun");
        ///读取文件参数
        var v = $(":input[" + f + "]").attr(f);
        //读取熟悉1_args
        var args = v.split("_");
        var s = f + '(args);';
        eval(s);
    };

    if($("#fileToUpload").live) {
        $("#fileToUpload").live("change", _tmpfunc_change);
    }
    else
    {
        $(document).on("change","#fileToUpload", _tmpfunc_change);
    }


    /***定义地址输入框***/
    $("#web_url_input a.ui-icon-close").bind("click", function () {
        $('#' + $(this).attr('forid')).hide();
    });

    $("a.web_url_input").bind("click", function () {
        letDivCenter('#web_url_input', 100);
        $("#web_url_input").show();
    });

    $("#web_url_url").bind('keydown', function (e) {
        if (e.keyCode == 13) {
            $("#web_url_btn").trigger("click");
        }
    });
    ///绑定读取结果
    $("#web_url_btn").bind('click', function () {
        var dom = $(this);
        var bv = dom.val();
        var input = $("#web_url_url");
        var v = $("#web_url_url").val();
        var res = $.parseJSON(input.attr("validate"));
        var re = new RegExp(res['data'] ? res['data'] : "^http.*?$");
        if (v.length < 5 || !re.test(v))
            return showInfo(input.attr('title') ? input.attr('title') : '输入正确内容！');
        $("#web_url_input").hide();

        ///以下定义操作方法
        var id = $(this).attr("forid");
        var f = $(this).attr("forfun");
        if (id)
            return $('#' + id).val(v);
        if (f)
            eval(f + '(v);');
    });
    /***定义地址输入框完***/

        //绑定readfile
    $("#main a.ui-icon-comment[forid]").bind('click', function () {
        if (typeof(showInputUrl)!="undefined" && $.isFunction(showInputUrl))
            showInputUrl($(this).attr('forid'));
    });

    ///定义统一input 提示信息
    $("#main :input[tipsinfo]").each(function () {
        if ($(this).val() == '') {
            $(this).val($(this).attr('tipsinfo'));

            $(this).css({
                'color': '#999'
            });
        }

        $(this).bind('blur', function () {
            if ($(this).val() == '') {
                $(this).val($(this).attr('tipsinfo'));
                $(this).css({
                    'color': '#999'
                });
                //重设置颜色
            }
        }).bind('focus', function () {
            if ($(this).val() == $(this).attr('tipsinfo')) {
                $(this).val('');
                $(this).css({
                    'color': ''
                });
                //恢复颜色
            }
        });
    });
});

function resizeTextAreaHeight(){
    $('.convert textarea').each(function(i){
        if(this.clientHeight >= this.scrollHeight)
        {
            return ;
        }
        var self = $(this);
        if(self.attr('id')=='convertd') {
            var h = parseInt(self.css('height'));
            var h2 = Math.max(h,this.scrollHeight);
           self.css("height", (h2+10) + "px");
        }
    });
}
///###支持输入框拖放上存
function dropDragUpload() {
    function dropIt(e) {
        //var event = e;
        if (!event.dataTransfer.files.length) {
            return true;
        }
        fileSelected(event.dataTransfer.files, $(this));
        e.stopPropagation();
        e.preventDefault();
    }

    function pasteIt(e) {
        var clipboard = event.clipboardData;
        var myFiles = [];
        var m = 0;
        for (var i = 0; i < clipboard.items.length; i++) {
            if (clipboard.items[i].kind == 'file') {
                myFiles[m] = clipboard.items[i];
                m++;
            }
        }
        if (!myFiles.length) return true;
        fileSelected(myFiles, $(this));
        e.stopPropagation();
        e.preventDefault();
    }

    function fileSelected(myFiles, dom) {
        var type = dom.attr('dragUpload') || 'text';
        for (var i = 0, f; f = myFiles[i]; i++) {
            if (f.type && f.type.indexOf(type) == -1) {
                showInfo('不支持该类型，只允许' + type + '型文件！');
                return;
            }

            var file = $('#fileToUpload').attr("forfun");
            ///读取文件参数
            var v = $(":input[" + file + "]").attr(file);
            //读取熟悉1_args
            var args = v.split("_");
            var s = file + '(args,f);';
            eval(s);
            return;
        }
    }

    $("[dragUpload]").each(function () {
        var dom = $(this);
        $(this).on('dragenter', function () {
            return false;
        }).on('dragover', function () {
            return false;
        }).on('drop', dropIt);
        $(this).on('paste', pasteIt);
    });
}
///###支持输入框拖放
function dropDrag() {

    if (!(window.File && window.FileList && window.FileReader)) {
        return false;
    }
    //drag
    $('html').addClass('isdrag');

    function dropIt(e) {
        //var event = e;
        if (!event.dataTransfer.files.length) {
            return true;
        }
        fileSelected(event.dataTransfer.files, $(this));
        e.stopPropagation();
        e.preventDefault();
    }

    function pasteIt(e) {
        var clipboard = event.clipboardData;
        var myFiles = [];
        var m = 0;
        for (var i = 0; i < clipboard.items.length; i++) {
            if (clipboard.items[i].kind == 'file') {
                myFiles[m] = clipboard.items[i];
                m++;
            }
        }
        if (!myFiles.length) return true;
        fileSelected(myFiles, $(this));
        e.stopPropagation();
        e.preventDefault();
    }

    function fileSelected(myFiles, dom) {
        var type = dom.attr('drag') || 'text';
        for (var i = 0, f; f = myFiles[i]; i++) {
            if (type == 'text' && f.type.indexOf('image') != -1) {
                showInfo('不支持该类型，只允许' + type + '型文件！');
                return;
            }
            else if (f.type && f.type.indexOf(type) == -1) {
                showInfo('不支持该类型，只允许' + type + '型文件！');
                return;
            }
            var imageReader = new FileReader();
            imageReader.onload = function (e) {
                dom.val(this.result);
            };
            imageReader.readAsText(f);
            break;
        }
    }

    $(":input[source='file']").bind('change', function(i) {
        var files = this.files;
        if(!files)
        {
            return false;
        }
        var fread = new FileReader();

        fread.onload=function(e)
        {
            $(":input[source='true']").val(fread.result);
        }
        fread.readAsDataURL(files[0]);
    });


    function dropDo(e) {
        //var event = e;
        showInfo('处理中!');
        if (!event.dataTransfer.files.length) {
            return true;
        }
        var dom=$(this);
        if (typeof(dragFiles)!="undefined" && $.isFunction(dragFiles))
        {
              dragFiles(event.dataTransfer.files, dom);
        }
        e.stopPropagation();
        e.preventDefault();
    }

    $(":input[drag]").each(function () {
        var dom = $(this);
        $(this).on('dragenter', function () {
            return false;
        }).on('dragover', function () {
            return false;
        }).on('drop', dropIt);
        $(this).on('paste', pasteIt);

        dom.after("<div style='color:red;margin-top:5px;margin-left: 20px;'>↑ 将你电脑文件直接拖入试试^-^ </div>");
    });

    $("[dragDo='dropDo']").each(function () {
        var dom = $(this);
        dom.on('dragenter', function () {
            return false;
        }).on('dragover', function () {
            return false;
        }).on('drop', dropDo);
    });

    $(":input[source='dropDo']").bind('change', function(i) {
        var files = this.files;
        var dom = $(this);
        if (!files) {
            return false;
        }

        if(dom.attr('forfile'))
        {
            var reader = new FileReader();
            if(dom.attr('fortype')=='bin')
            {
                reader.readAsDataURL(files[0]);
            }
            else
            {
                reader.readAsText(files[0]);
            }
            reader.onload=function()
            {
                $(dom.attr('forfile')).val(reader.result);
                dom.val('');///清理选择文件
            }
            return true;
        }
        if (typeof(dragFiles) != "undefined" && $.isFunction(dragFiles)) {
            dragFiles(files, dom);
        }
    });
}

function getUserPostion(ip) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            codeAddress2(initialLocation, "HTML5 Geo获得我的位置");
            return;
        });
    }

    $.getJSON("/?m=ip&act=f&t=0&ip=" + ip, function (data) {
        var _arr = [data.country, data.province, data.city];
        codeAddress(_arr.join(), "IP计算获得我的位置");
    });
}

function marker(lng, title, content) {
    if (content instanceof Array) {
        content = content.join("</br>");
    }
    map.setCenter(lng);
    _mark = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: lng,
        title: title
    });
    markersArr.push(_mark);
    google.maps.event.addListener(_mark, 'click', function () {
        infowindow.setContent(content);
        infowindow.setPosition(lng);
        infowindow.open(map);
    });
}

function codeAddress2(latlng, title) {
    var geo = new google.maps.Geocoder();
    title = !!title ? title : '';
    geo.geocode({
        'latLng': latlng
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                info = results[0].formatted_address;
                codeAddress(info, title);
            }
        }
    });
}

function codeAddress(info, title) {
    var geo = new google.maps.Geocoder();
    title = !!title ? title : '';
    geo.geocode({
        'address': info
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            locationLng = results[0].geometry.location;

            content = title ? "<h3>" + title + "</h3>" + info : info;

            marker(locationLng, info, [content, "经度:" + locationLng.lat(), "纬度:" + locationLng.lng()]);
        }
    });
}

function clearMarker() {
    if (markersArr) {
        for (i in markersArr) {
            markersArr[i].setMap(null);
        }
        markersArr = [];
    }
}

//目标元素的id
function scrollto(des_id) {
    var des = $(des_id).offset().top;
    $(document.documentElement).animate({
        scrollTop: des
    }, 400);
    //for Firefox&IE
    $("body").animate({
        scrollTop: des
    }, 400);
    //for Chrome
}

function BindAreaMap(id) {
    var input = document.getElementById(id);
    var autocomplete = new google.maps.places.Autocomplete(input);
    //autocomplete.bindTo('bounds', map);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry)
            return;

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
            // Why 17? Because it looks good.
        }
        clearMarker();
        var locationLng = place.geometry.location;
        var data = [place.formatted_address, "经度:" + locationLng.lat(), "纬度:" + locationLng.lng()];
        marker(place.geometry.location, place.name, data);
    });
}

function hidePop() {
    $(".popup_main").hide();
}

function showPop() {
    $(".popup_main").toggle();
}

function goCity(e) {
    return true;
    var d = $(e);
    clearMarker();
    codeAddress(d.html(), d.attr("name") ? d.attr("name") : d.html());
    map.setZoom(10);
    return false;
}
function showInfo2(msg, hide) {
    var divName = "info";
    divName = "#" + divName;
    if(!!hide) {
        $(divName).html(msg).show();
        letDivCenter(divName, 100);
    }else
    {
        $(divName).hide();
    }

}

function showInfo(msg, divName) {
    if (!divName)
        divName = "info";
    divName = "#" + divName;
    $(divName).html(msg);
    letDivCenter(divName, 100);
    $(divName).slideUp(10).delay(100).fadeIn(400);
    setTimeout(function () {
        $(divName).fadeIn(10).delay(400).slideUp(100);
    }, 1000);
}

function getNode(dom) {
    var cNode = dom;
    var t = cNode[0].tagName.toLowerCase();
    var data = (t == 'textarea') ? cNode.val() : cNode.html();
    return cNode.attr('filters') ? filtersContent(data, cNode.attr('filters')) : data;
}

//复制剪贴板
function copyClip(self)
{
    var id = "#" + $(self).attr('forid');
    var value =getNode($(id));
    $(self).attr('data-clipboard-text', value);
    var clip = new ClipboardJS(self);
    clip.on('success', function (e) {
        clip.destroy();
        e.clearSelection();
        showInfo('复制成功');

    });
    clip.on('error', function (e) {
        clip.destroy();
        e.clearSelection();
        showInfo('复制失败');
    });
}

function showAlert(msg, title, divName) {
    if (!divName)
        divName = "alertinfo";
    divName = "#" + divName;
    title = !title ? "温馨提示：" : title;
    $(divName).find("a.ui-icon-close").bind('click', function () {
        $("#" + $(this).attr('forid')).hide();
    })
    letDivCenter(divName, 50);
    $(divName).find(".alertinfocontent").html(msg);
    $(divName).find(".alertinfotitle").html(title);
    $(divName).show();
}

function letDivCenter(divName, ptop) {
    ptop = !!ptop ? ptop : 0;
    var top = ($(window).height() - $(divName).height()) / 2;
    var left = ($(window).width() - $(divName).width()) / 2;
    var scrollTop = $(document).scrollTop();
    var scrollLeft = $(document).scrollLeft();
    $(divName).css({
        position: 'absolute',
        'top': top + scrollTop - ptop,
        left: left + scrollLeft
    });
}

function showInputUrl(id) {
    var divName = "#url_input";
    letDivCenter(divName, 20);
    $(divName).slideUp(10).delay(100).fadeIn(400);

    ///绑定关闭
    $(divName + " a.ui-icon-close").bind('click', function () {
        $('#' + $(this).attr('forid')).hide();
    });

    $("#url_url").bind('keydown', function (e) {
        if (e.keyCode == 13) {
            $("#url_btn").trigger("click");
        }
    })
    ///绑定读取结果
    $("#url_btn").one('click', function () {
        var dom = $(this);
        var bv = dom.val();
        var v = $("#url_url").val();
        var re = new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$");
        if (v.length < 5 || !re.test(v))
            return showInfo('请输入正确的地址!');
        dom.attr('disabled', true).val('读取中...');

        $.getJSON('/?m=ip&act=geturl&url=' + encodeURIComponent(v), function (data) {
            dom.attr('disabled', false).val(bv);
            $("#" + id).val(data.data[0]);
            $(divName).fadeIn(10).delay(400).slideUp(100);
        });
    });
}

function fileUpload(arr, uploadfile) {
    var type = arr[0];
    var source = arr[1];
    var show = arr.length > 2 ? arr[2] : null;
    type = !!type ? type : 0;
    source = !!source ? source : '';
    var url = 'http://' + location.hostname + "/?m=upload&act=put";
    if ($("#fileToUpload").val().length < 4 && !uploadfile) {
        return showInfo("请选择文件！");
    }
    $("#ajaxloading").ajaxStart(function () {
        $(this).show();
    }).ajaxComplete(function () {
        $(this).hide();
    });

    if(typeof(uploadfile)=='object')
    {
        formdataUpload(uploadfile);
        return false;
    }
    //拖拽上存
    function formdataUpload(uploadfile) {
        var formData = new FormData();//构造空对象，下面用append 方法赋值。
        formData.append("t", type);
        formData.append("fileToUpload", uploadfile);

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (data, status) {
                success(data,status);
            },
            error: function (data, status, e) {
                showAlert(data, "上存温馨提示：");
            }
        });
    }

    function success(data,status)
    {
        //{'status':1,'info':'ok','data':[url,name,size]}
        //失败
        if (!data.status) {
            return showAlert(data.info, "上存温馨提示：");
        }

        $('#' + source).val(data.data[0]);
        //文件上存成功
        if(data.info)
        {
            showInfo(data.info);
        }
        $("#FileUploadInfo").html(['\t上存文件:', data.data[1], '\t大小：', parseInt(data.data[2] * 100 / 1024) / 100, 'K'].join(""));

        if (typeof(uploadSuccess)!="undefined" && $.isFunction(uploadSuccess)) {
            return uploadSuccess(data.data);
        }
        //展示图片
        if (!!show)
            showFileUpload(data.data[0], show);

    }


    $.ajaxFileUpload({
        url: url,
        secureuri: false,
        fileElementId: 'fileToUpload',
        dataType: 'json',
        data: {
            t: type
        },
        success: function (data, status) {
            success(data, status);
        },
        error: function (data, status, e) {
            showAlert(data, "上存温馨提示：");
        }
    });
}

function showFileUpload(url, picid) {
    var photo = $("#" + picid);
    var w = photo.width();
    var h = photo.height();
    photo.hide();
    $("#" + picid + " img").css({
        'width': '',
        'height': ''
    });
    //移掉样式
    $("#" + picid + " img").bind("load", function () {
        var _w = this.width;
        var _h = this.height;
        var _h1 = _h, _w1 = _w;
        ///需要缩放
        if (_w > w - 20 || _h > h - 20) {
            if (_w / w > _h / h) {
                _w1 = w - 20;
                _h1 = _h * _w1 / _w;
            } else {
                _h1 = h - 20;
                _w1 = _w * _h1 / _h;
            }
        }
        $(this).css({
            'width': _w1,
            'height': _h1,
            'border': '1px solid #ccc'
        });
        photo.show();
        $(this).unbind("load");
        //取消绑定
    });
    photo.find("img").attr('src', url);
}

///ajax suc后保存
function addStroage() {
    $(":input[autosave='true']").each(function () {
        var name = $(this).attr("id") || $(this).attr('prop');
        var value = $(this).val().replace('^', '……');
        if (!value)
            return;

        var re = /[&=?]/g;
        var key = location.href.split("/").slice(3).join("").replace(re, '_') + "_" + name;

        var data = $.storage.get(key);
        if (!!data && data.indexOf(value) !== -1)
            return;

        data = !!data ? data + '^' + value : value;
        $.storage.set(key, data);

    });
}

function filtersContent(data, filters) {
    var aFilters = {
        'removehtml': function (data) {
            var re = new RegExp('<(?:script|style|object).*?>(?:.|\n)*?<\/(?:script|style|object)>', "ig");
            return data.replace(re, "").replace(/<.*?>/ig, "");
        },
        'removeblackline': function (data) {
            var re = new RegExp('[\r\n]{1,}', "ig");
            return data.replace(re, "\r\n");
        }
    };
    if (!filters || !data)
        return data;
    var f = filters.split(' ');
    for (k in f) {
        var _f = aFilters[f[k]];
        data = _f(data);
    }
    return data;
}

function addBookmark() {
    var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
    try {
        if (document.all) { //IE类浏览器
            try {
                window.external.toString(); //360浏览器不支持window.external，无法收藏
                window.alert("国内开发的360浏览器等不支持主动加入收藏。\n您可以尝试通过浏览器菜单栏 或快捷键 ctrl+D 试试。");
            }
            catch (e) {
                try {
                    window.external.addFavorite(window.location, document.title);
                }
                catch (e) {
                    window.external.addToFavoritesBar(window.location, document.title);  //IE8
                }
            }
        }
        else if (window.sidebar) { //firfox等浏览器
            window.sidebar.addPanel(document.title, window.location, "");
        }
        else {
            alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~');
        }
    }
    catch (e) {
        window.alert("因为IE浏览器存在bug，添加收藏失败！\n解决办法：在注册表中查找\n HKEY_CLASSES_ROOT\\TypeLib\\{EAB22AC0-30C1-11CF-A7EB-0000C05BAE0B}\\1.1\\0\\win32 \n将 C:\\WINDOWS\\system32\\shdocvw.dll 改为 C:\\WINDOWS\\system32\\ieframe.dll ");
    }
}

/** 格式化输入字符串**/
//用法: "hello{0}".format('world')；返回'hello world'
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (s, i) {
        return args[i];
    });
}

//console.log(_nl('aaaaa{0}{1}','11111111','2222222'));
//格式化模板
function _nl() {
    var lang = window.pageLang;
    var args = Array.prototype.slice.call(arguments, 0);
    var b = args[0].toString();
    b = _nl2(b, lang);
    return b.format.apply(b, args.slice(1));
}

function _nl2(data, lang) {
    var _lang = window._lang;
    var ulang = (navigator.language || navigator.browserLanguage).toLowerCase();
    if (!ulang || !_lang) {
        return data;
    }

    if (!!lang) {
        return (_lang[lang] && _lang[lang][data]) ? _lang[lang][data] : data;
    }

    ///中文编码
    if (ulang.indexOf('zh_') === 0) {
        ulang = ulang.indexOf('zh_cn') !== -1 ? 'zh_cn' : 'zh_tw'; ///繁体英文
    }

    ///英文编码
    if (ulang.indexOf('en_') === 0) {
        ulang = 'en_us';
    }
    ///日文编码
    if (ulang.indexOf('ja_') === 0) {
        ulang = 'ja_jp';
    }
    ulang = 'en_us';
    return (_lang[lang] && _lang[lang][data]) ? _lang[lang][data] : data;
}

function addStopImg() {
    _hmt = _hmt || [];
    var list = ['<a onclick="_hmt.push([\'_trackEvent\', \'a96030\', \'click\', \'lufax\'])" href="http://affiliate.lufax.com/action/0caz"   target="_blank"><img src="http://www.chacuo.net/images/1.jpg" style="border:1px solid #EB9FFF;width: 98%;max-width: 960px;"></a>', '<a onclick="_hmt.push([\'_trackEvent\', \'a96030\', \'click\', \'yooli\'])" href="http://www.yooli.com/secure/switchInviteFriendPage.action?inviteCode=wlumL7z8"   target="_blank"><img src="http://www.chacuo.net/images/3.jpg" style="border:1px solid #EB9FFF;width: 98%;max-width: 960px;"></a>'];

    $(".a96090").each(function (i) {
        var dom = $(this);

        if (dom.innerHeight() <= 5) {
            if (i == 0) {
                _hmt.push(['_trackEvent', 's96030', 'show', 'show']);
            }
            var rnd = parseInt(Math.random()*100000+1);
            var img = list[i % 2].replace("1.jpg",rnd+"1.jpg").replace("3.jpg",rnd+"3.jpg") ;
            dom.html(img);
        }
    });
}

function runAs(id) {
    var str = typeof(id) === 'string' ? id : $(id);
    var go = open('', '运行', '');
    go.document.open();
    go.document.write(str);
    go.document.close();
}

function h5()
{
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
        var key = 'baidu0';
        if(!(!!$.storage.get(key)) && navigator.userAgent.indexOf('spider')==-1){
            $.storage.set(key, 1);
            //setTimeout("top.location.href='https://eopa.baidu.com/page/hb-ZUIW7jiR?token=35c517065006e68b70e11b4ee12b1cb83b&idfrom=default&qd=weixin&from=singlemessage&isappinstalled=0';",3000);
        }
    }
    if(!$("#main .left").is(":hidden"))
    {
        return;
    }
    var links=[];
    links.push('<ul class="lli clearfix" style="background-color: #eee;"><li><b>其它</b></li>');
    var domlist = [];
    $('#main .left a').each(function(x){
        var dom=$(this);
        var href = dom.attr('href')+'';
        if(href.indexOf('chacuo')!=-1)
        {
            domlist[domlist.length] = [href,dom.text()];
        }
    });

    $.each(domlist, function(i, n){
        links.push('<li><a href="'+n[0]+'" >'+n[1]+'</a></li>');
    });
    links.push('</ul>');
    $('#main .section_content').append(links.join(''));
}
