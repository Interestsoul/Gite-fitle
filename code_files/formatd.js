$(function() {
    $(":input[arg]").bind("click", function() {
        if ($("#formatds").val().length < 10) {
            showInfo("请输入需要处理的字符！");
            return;
        }

        var arg = $(this).attr("arg");
        var type = arg.indexOf("format")!==-1 ? "format" : "compress";

        arg = arg.split("_").slice(1).join("_");

        $.post(location.href, {
            data : $("#formatds").val(),
            type : type,
            arg : arg,
            beforeSend : function() {
                $("#formatinfo").html('');
                $("#formatdd").val('');
                showInfo("处理中...");
            }
        }, function(data) {
            var dom = $.parseJSON(data);
            $("#formatdd").val(dom.data[0]);
            if (type == "compress")
                $("#formatinfo").html("\t原始大小:" + dom.data[1] + "\t压缩后：" + dom.data[2] + "\t压缩比：" + dom.data[3]);
        });
    });

    /**清理*/
    $(".formatd a.ui-icon-close[forid]").bind('click', function() {
        $('#' + $(this).attr('forid')).val('');
        showInfo("清理完成！");
    });

    /**复制*/
    $(".formatd a.ui-icon-transferthick-e-w[forid]").bind('click', function() {
        var d = $('#' + $(this).attr('forid')).val();
        if(d.length<1) return;
        $('#' + $(this).attr('toid')).val(d);
        showInfo("将输出结果填到输入！！");
    });

    /*复制*/
    $(".formatd a.ui-icon-copy[forid]").each(function() {
        copyClip(this);
    }).on("click",function(){
        copyClip(this);
    });
});
