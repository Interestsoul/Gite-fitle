var level = 0;
var LOOP_SIZE = 100;
$("pre").hide();
function finishTabifier(code) {
    //code = code.replace(/\n\s*\n/g, '\n');  //blank lines
    code = code.replace(/^[\s\n]*/, ''); //leading space
    code = code.replace(/[\s\n]*$/, '\n'); //trailing space
    var highCode = hljs.highlightAuto(code).value;
    $("pre").show();
    $('#result').html(highCode);
    level = 0;
}
function finishTabifier2(code) {
    var highCode = hljs.highlightAuto(code).value;
    $("pre").show();
    $('#result').html(highCode);
    level = 0;
}

//换行
function tabs() {
    var s = '';
    for (var j = 0; j < level; j++) s += '\t';
    return s;
}

//开始格式化代码
function cleanCStyle(code) {
    var i = 0;
    function cleanAsync() {
        var iStart = i;
        for (; i < code.length && i < iStart + LOOP_SIZE; i++) {
            c = code.charAt(i);//返回指定位置的字符
            //判断注释
            if (incomment) {
                if ('//' == incomment && '\n' == c) {
                    incomment = false;
                } else if ('//' == incomment && '\t' == c || ' ' == c) {
                    c = '';
                } else if ('/*' == incomment && '*/' == code.substr(i, 2)) {
                    incomment = false;
                    c = '*/\n';
                    i++;
                } else if ('/*' == incomment && '\n' == c) {
                    c = '\n' + tabs();
                }
                if (!incomment) {
                    while (code.charAt(++i).match(/\s/)); ; i--;
                    c += tabs();
                }
                out += c;
            } else if (instring) {
                if (instring == c && ('\\' != code.charAt(i - 1) || '\\' == code.charAt(i - 2)) ) {
                    instring = false;
                }
                out += c;
            } else if (infor && '(' == c) {
                infor++;
                out += c;
            } else if (infor && ')' == c) {
                infor--;
                out += c;
            } else if ('else' == code.substr(i, 4)) {
                out = out.replace(/\s*$/, '') + ' e';
            } else if (code.substr(i).match(/^for\s*\(/)) {
                infor = 1;
                out += 'for (';
                while ('(' != code.charAt(++i)); ;
            } else if ('//' == code.substr(i, 2)) {
                incomment = '//';
                out += '//';
                i++;
            } else if ('/*' == code.substr(i, 2)) {
                incomment = '/*';
                out += '/*';
                i++;
            } else if ('"' == c || "'" == c) {
                if (instring && c == instring) {
                    instring = false;
                } else {
                    instring = c;
                }
                out += c;
            } else if ('{' == c) {
                out = out.replace(/\s*$/, '') + '\n' + tabs();
                level++;
                out = out + '{\n' + tabs();
                while (code.charAt(++i).match(/\s/)); ; i--;
            } else if ('}' == c) {
                out = out.replace(/\s*$/, '');
                level--;
                out += '\n' + tabs() + '}\n' + tabs();
                while (code.charAt(++i).match(/\s/)); ; i--;
            } else if (';' == c && !infor) {
                if('\n' == code.charAt(i + 1)) out += ';\n' + tabs();
                else out += ';';
                while (code.charAt(++i).match(/\s/)); ; i--;
            } else if ('\n' == c) {
                out += '\n' + tabs();
            } else {
                out += c;
            }
        }

        if (i < code.length) {
            setTimeout(cleanAsync, 0);
        } else {
            level = li;
            out = out.replace(/[\s\n]*$/, '');
            finishTabifier(out);
        }
    }
    //替换符号
    code = code.replace(/^[\s\n]*/, ''); //leading space
    code = code.replace(/[\s\n]*$/, '\n'); //trailing space
    code = code.replace(/[\n\r]+/g, '\n'); //collapse newlines
    code = code.replace(/[\n][\s]+/g, '\n');//换行之后的制表符和空格
    code = code.replace(/[\t\s]+[\n]+/g, '\n');//清除尾数多出来的
    //初始化参数
    var out = tabs(), li = level, c = '';
    var infor = false, instring = false, incomment = false;
    cleanAsync();
    //finishTabifier(code);
}

function cleanCStyle2(code) {
    var i = 0;
    function cleanAsync() {
        var iStart = i;
        for (; i < code.length && i < iStart + LOOP_SIZE; i++) {
            c = code.charAt(i);//返回指定位置的字符
            //判断注释
            if (incomment) {
                // if ('//' == incomment && '\n' == c) {
                    // incomment = false;
                // } else if ('//' == incomment && '\t' == c || ' ' == c) {
                    // c = '';
                // } else if ('/*' == incomment && '*/' == code.substr(i, 2)) {
                    // incomment = false;
                    // c = '*/\n';
                    // i++;
                // } else if ('/*' == incomment && '\n' == c) {
                    // c = '\n' + tabs();
                // }
                // if (!incomment) {
                    // while (code.charAt(++i).match(/\s/)); ; i--;
                    // c += tabs();
                // }
                // out += c;
            } else if (instring) {
                // if (instring == c && ('\\' != code.charAt(i - 1) || '\\' == code.charAt(i - 2)) ) {
                    // instring = false;
                // }
                // out += c;
            // } else if (infor && '(' == c) {
                // infor++;
                // out += c;
            // } else if (infor && ')' == c) {
                // infor--;
                // out += c;
            // } else if ('else' == code.substr(i, 4)) {
                // out = out.replace(/\s*$/, '') + ' e';
            // } else if (code.substr(i).match(/^for\s*\(/)) {
                // infor = 1;
                // out += 'for (';
                // while ('(' != code.charAt(++i)); ;
            // } else if ('//' == code.substr(i, 2)) {
                // incomment = '//';
                // out += '//';
                // i++;
            // } else if ('/*' == code.substr(i, 2)) {
                // incomment = '/*';
                // out += '/*';
                // i++;
            // } else if ('"' == c || "'" == c) {
                // if (instring && c == instring) {
                    // instring = false;
                // } else {
                    // instring = c;
                // }
                // out += c;
            } else if ('{' == c) {//增加制表符数量
                level++;
                out += c;
                while (code.charAt(i+1).match('\t') || code.charAt(i+1).match(' ')) i++;
            } else if ('}' == c) {//减少制表符数量
                level--;
                out += c;
                while (code.charAt(i+1).match('\t') || code.charAt(i+1).match(' ')) i++;
            // } else if (';' == c && !infor) {
                // if('\n' == code.charAt(i + 1)) out += ';\n' + tabs();
                // else out += ';';
                // while (code.charAt(++i).match(/\s/)); ; i--;
            } else if ('\n' == c) {//换行之后，不需要额外的制表符和空格
                while (code.charAt(i+1).match('\t') || code.charAt(i+1).match(' ')) i++;
                if(code.charAt(i+1).match('}')) level--;
                out += '\n' + tabs();
                if(code.charAt(i+1).match('}')) level++;
            } else if (('\t' == c || ' ' == c) && level == 0) {//函数外部，减少制表符和空格
                if(code.charAt(i + 1).match(' '));
                else out += c;
            } else if (('\t' == c || ' ' == c) && level > 0) {//函数内部，
                li = i;
                while (code.charAt(i+1).match('\t') || code.charAt(i+1).match(' ')) i++;
                if(code.charAt(i+1).match('\n'));
                else {out += c;i = li;}
            } else {
                out += c;
            }
        }

        if (i < code.length) {
            setTimeout(cleanAsync, 0);
        } else {
            level = li;
            finishTabifier2(out);
        }
    }
    //初始化参数
    var out = tabs(), li = level, c = '';
    var infor = false, instring = false, incomment = false;
    cleanAsync();
}

function Empty() { $("#content").val(""); $("#result").html(''); $("#content").select();$("pre").hide(); }
function runTabifier(lan) {
    lan = (typeof(lan) == "undefined" || lan == '') ? "程序" : lan;
    var msg ='请输入要格式化美化的'+lan+'代码';
        var code = $("#content").val();
        if (code) {
            cleanCStyle2(code);
        }
        else {
            pcjson_com_msg($("#content"), msg);
        }
}