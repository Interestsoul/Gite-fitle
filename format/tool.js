$(function () {
    $('#copyallcode').click(function () {
        copyTxtToClipboard($(this).attr("data-clipboard-target"));
    });
});

function pcjson_com_msg(target, msg) {
    target.attr("data-original-title", msg);
    $('[data-toggle="tooltip"]').tooltip();
    target.tooltip('show');
    target.focus();
    var id = setTimeout(function () {
        target.attr("data-original-title", "");
        target.tooltip('hide');
    }, 4000);
}

function copyTxtToClipboard(id, selector) {
    selector = (typeof (selector) == "undefined" || selector == '') ? "#copyallcode" : selector;
    var text = $(id).text();
    if (text == '' && $(id).length > 0) {
        text = $(id).val();
    }
    if (text == '') {
        pcjson_com_msg($(selector), "复制失败，请手动复制");
        return false;
    }
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var msg = document.execCommand('copy') ? '成功' : '失败';
        pcjson_com_msg($(selector), "复制" + msg);
    } catch (err) {
        pcjson_com_msg($(selector), "复制失败,请手动复制");
    }
    document.body.removeChild(textArea);
}
