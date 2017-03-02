/**
 * Created by Administrator on 2016/8/19 0019.
 */
var ucComponentConfig = require('uc-component-config');
window.ucComponentConfig = ucComponentConfig;
var CryptoJS = require("crypto-js");
var ucComponent = {};
ucComponent.DEBUG_MODE = false;
ucComponent.KEY_LOG = 'fep_user_log';
ucComponent.KEY_ACCESS_TOKEN = 'uc_access_token_cookie';
ucComponent.KEY_USER_DATA = 'uc_user_data';
ucComponent.KEY_USER_INFO = '13465c85caab4dfd8b1cb5093131c6d0';
ucComponent.KEY_LOGIN_INFO = 'uc_login_info';
ucComponent.KEY_LOGIN_INFO_REMEMBERED = 'uc_login_info_remembered';
ucComponent.KEY_CLIENT_CRC = 'clientCrc';

// 可获取到的（不会触发跨域错误的）最顶层window
ucComponent.canArriveWindow = (function(window){
    var _canArriveWindow = null;
    function get(win){
        if(_canArriveWindow){
            return _canArriveWindow;
        }
        try{
            // 可能报错，形成跨域
            win.parent.localStorage;
            // 不相等，还不是最顶级，继续获取
            if(win !== win.parent){
                return get(win.parent);
            }

            _canArriveWindow = win;
        }catch(err){
            _canArriveWindow = win;
        }
        return _canArriveWindow;
    }
    return get(window);
})(window);
//移动端日志查看
ucComponent.setLog = function (log, length) {
    length = !length ? 100 : length;
    if (!ucComponent.DEBUG_MODE) {
        return;
    }
    var logArray = window.localStorage.getItem(ucComponent.KEY_LOG);
    if (logArray) {
        logArray = JSON.parse(logArray);
    } else {
        logArray = [];
    }
    if (log.length > length) {
        log = log.substr(0, length) + '...';
    }
    logArray.push(log);
    window.localStorage.setItem(ucComponent.KEY_LOG, JSON.stringify(logArray));
};
ucComponent.getLog = function(){
    var logArray = window.localStorage.getItem(ucComponent.KEY_LOG);
    if(logArray){
        return JSON.parse(logArray);
    }
};
ucComponent.removeLog = function(){
    window.localStorage.removeItem(ucComponent.KEY_LOG);
};
//json
function forIn(obj, handler) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            handler(i, obj[i]);
        }
    }
}

function each(arr, handler) {
    for (var i = 0, len = arr.length; i < len; i += 1) {
        handler(i, arr[i]);
    }
}

if (!JSON) {
    JSON = {};
}
if (!JSON.parse) {
    JSON.parse = function (json) {
        return eval('1,' + json)
    };
}
if (!JSON.stringify) {
    (function (JSON) {
        var arr = '[object Array]',
            obj = '[object Object]';

        JSON.stringify = function (json) {
            var t = '';
            var m = Object.prototype.toString.call(json);
            if (m == arr) {
                t = ArrPartten(json);
            } else if (m == obj) {
                t = ObjectJson(json);
            } else {
                t = json;
            }
            return t;
        }

        function ObjectParse() {
            var t = '{';
            forIn(json, function (i, ele) {
                var m = Object.prototype.toString.call(ele);
                if (m == arr) {
                    t += i + ':' + ArrPartten(ele) + ',';
                } else if (m == obj) {
                    t += i + ':' + ObjectJson(ele) + ',';
                } else {

                    t += i + ':' + ele + ',';
                }
            });
            if (t.length != 1) {
                t = t.substring(0, t.length - 1);
            }
            return t + '}';
        }

        function ArrayParse() {
            var t = '[';
            each(json, function (i, ele) {
                var m = Object.prototype.toString.call(ele);
                if (m == arr) {
                    t += ArrPartten(ele) + ',';
                } else if (m == obj) {
                    t += ObjectJson(ele) + ',';
                } else {
                    t += ele + ',';
                }
            });
            if (json.length > 0) {
                t = t.substring(0, t.length - 1);
            }
            return t + ']';
        }
    }(JSON));
}
;
//localstorage
var localStorage = ucComponent.canArriveWindow.localStorage || new function () {
        var that = this, prefix = "localStorage";
        //创建并初始化用于存储元素
        var element = document.createElement(prefix);
        element.addBehavior("#default#userData");
        var head = document.documentElement.children[0];
        head.insertBefore(element, head.firstChild);
        //加载储存的键名
        element.load(prefix);
        var map = {}, keys = element.getAttribute("data-value");
        keys = new Function("return " + keys + "||[];")();
        for (var i = 0; i < keys.length; i++)map[keys[i]] = 0;
        this.length = i;
        //添加接口方法
        this.getItem = function (key) {
            if (!(key in map))return null;
            element.load(prefix + "-" + key);
            return element.getAttribute("data-value");
        };
        this.setItem = function (key, value) {
            element.setAttribute("data-value", value || "");
            element.save(prefix + "-" + key);
            key in map || updateKeys(map[key] = 0);
        };
        this.removeItem = function (key) {
            element.setAttribute("data-value", "");
            element.save(prefix + "-" + key);
            key in map && updateKeys(delete map[key]);
        };
        this.clear = function (key, value) {
            for (var i in map)this.setItem(i, "");
            updateKeys(map = {});
        };
        this.key = function (i) {
            return keys[i];
        };
        //当键名列表改变时储存更新
        function updateKeys() {
            var result = [], key;
            keys = [];
            for (key in map)result.push(
                '"' + key.replace(/[^a-z0-9 ]/ig, function (e) {
                    var e = e.charCodeAt(0).toString(16);
                    if (e.length % 2)e = "0" + e;
                    return (e.length > 2 ? "\\u" : "\\x") + e;
                }) + '"'
            ), keys.push(key);
            that.length = keys.length;
            element.setAttribute("data-value", "[" + result + "]");
            element.save(prefix);
        };
    };
//时间格式化
ucComponent.isDate = function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}
//精确到秒 //2016-12-14T16:36:44.884+0800
ucComponent.stringToDate = function stringToDate(fDate) {

    if (ucComponent.isDate(fDate)) {
        return fDate;
    }

    // var zone = '0800';

    // if(fDate.indexOf('+')!=-1 || ){
    //     if(fDate.split("+")[1].length==4){
    //         zone = fDate.split("+")[1];
    //     }
    // }

    var offset = fDate.match(/T.*([\+|\-])(\d*)/); // 匹配时区值，会存在 "+" 或 "-"

    var offsetSign = offset[1]; // "+" 或 "-"
    var offsetHH = (offset[2][0] + offset[2][1])*60; // 将小时转换成分钟
    var offsetMM = (offset[2][2] + offset[2][3]); // 分钟不变

    // 偏移值（分钟）; 相对于格林威治时间是相反的
    var offsetValue = offsetSign === '+' ? -(parseInt(offsetHH)+parseInt(offsetMM)) : parseInt(offsetHH)+parseInt(offsetMM);

    var baseTimeZoneOffset = parseInt(offsetValue); // 设置当前服务器时区的偏移值
    var timeZoneOffset = new Date().getTimezoneOffset(); // 获取当前本地时区的偏移值

    var fullDate = fDate.split("T")[0].split("-");
    var fullTime = fDate.split("T")[1].split(":");

    var _Date = new Date(fullDate[0], fullDate[1] - 1, fullDate[2], (fullTime[0] != null ? fullTime[0] : 0), (fullTime[1] != null ? fullTime[1] : 0), (fullTime[2] != null ? fullTime[2].split('.')[0] : 0));

    var offsetTime = (baseTimeZoneOffset-timeZoneOffset) * 60000; // 偏移值转换成毫秒
    var newTime = parseInt(_Date.getTime()) + offsetTime; // 将服务器的时间加上偏移值就为当前时区的时间

    _Date.setTime(newTime); // 设置为最后计算出来的当前时区时间

    return _Date;
}
//cookieUtil
ucComponent.str2asc = function str2asc(strstr) {
    return ("0" + strstr.charCodeAt(0).toString(16)).slice(-2);
}
ucComponent.asc2str = function asc2str(ascasc) {
    return String.fromCharCode(ascasc);
}
ucComponent.urlEncode = function urlEncode(str) {
    var ret = "";
    var strSpecial = "!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
    for (var i = 0; i < str.length; i++) {
        var chr = str.charAt(i);
        var c = ucComponent.str2asc(chr);
        if (parseInt("0x" + c) > 0x7f) {
            ret += "%" + c.slice(0, 2) + "%" + c.slice(-2);
        } else {
            if (chr == " ")
                ret += "+";
            else if (strSpecial.indexOf(chr) != -1)
                ret += "%" + c.toString(16);
            else
                ret += chr;
        }
    }
    return ret;
}
ucComponent.generateMixed = function generateMixed(n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    function generateMixed(n) {
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }

    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}

ucComponent.decryptByDES = function decryptByDES(ciphertext, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    // direct decrypt ciphertext
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

ucComponent.ecryptContent = function ecryptContent(message, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}


ucComponent.binToHex = function binToHex(str) {
    var ar = [];
    for (var i = 0; i < str.length; i++) {
        var a = str.charCodeAt(i);
        ar.push(a);
    }
    str = ar.join("");
    return str;
}

ucComponent.getOSAndBrowser = function getOSAndBrowser() {
    var os = navigator.platform;
    var userAgent = navigator.userAgent;
    var info = "";
    var tempArray = "";
    if (os.indexOf("Win") > -1) {
        if (userAgent.indexOf("Windows NT 5.0") > -1) {
            info += "Win2000";
        } else if (userAgent.indexOf("Windows NT 5.1") > -1) {
            info += "WinXP";
        } else if (userAgent.indexOf("Windows NT 5.2") > -1) {
            info += "Win2003";
        } else if (userAgent.indexOf("Windows NT 6.0") > -1) {
            info += "WindowsVista";
        } else if (userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1) {
            info += "Win7";
        } else if (userAgent.indexOf("Windows 8") > -1) {
            info += "Win8";
        } else {
            info += "Other";
        }
    } else if (os.indexOf("Mac") > -1) {
        info += "Mac";
    } else if (os.indexOf("X11") > -1) {
        info += "Unix";
    } else if (os.indexOf("Linux") > -1) {
        info += "Linux";
    } else {
        info += "Other";
    }
    info += "/";
    if (/[Ff]irefox(\/\d+\.\d+)/.test(userAgent)) {
        tempArray = /([Ff]irefox)\/(\d+\.\d+)/.exec(userAgent);
        info += tempArray[1] + tempArray[2];
    } else if (/MSIE \d+\.\d+/.test(userAgent)) {
        tempArray = /MS(IE) (\d+\.\d+)/.exec(userAgent);
        info += tempArray[1] + tempArray[2];
    } else if (/[Cc]hrome\/\d+/.test(userAgent)) {
        tempArray = /([Cc]hrome)\/(\d+)/.exec(userAgent);
        info += tempArray[1] + tempArray[2];
    } else if (/[Vv]ersion\/\d+\.\d+\.\d+(\.\d)* *[Ss]afari/.test(userAgent)) {
        tempArray = /[Vv]ersion\/(\d+\.\d+\.\d+)(\.\d)* *([Ss]afari)/.exec(userAgent);
        info += tempArray[3] + tempArray[1];
    } else if (/[Oo]pera.+[Vv]ersion\/\d+\.\d+/.test(userAgent)) {
        tempArray = /([Oo]pera).+[Vv]ersion\/(\d+)\.\d+/.exec(userAgent);
        info += tempArray[1] + tempArray[2];
    } else {
        info += "unknown";
    }
    return info;
};

ucComponent.getClientCrc = function getClientCrc(orgName) {
    orgName = !orgName ? '' : orgName;
    var cache = localStorage.getItem(ucComponent.KEY_CLIENT_CRC + orgName);
    if (cache) {
        return cache;
    }
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var txt = 'http://www.101.com/';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "nd";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    var b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
    var bin = atob(b64);
    var crc = ucComponent.binToHex(bin.slice(-16, -12));
    var browser = ucComponent.getOSAndBrowser();
    crc = browser + "/" + crc;
    crc = crc + "/" + new Date().getTime() + "/" + ucComponent.generateMixed(8);

    if (orgName) {
        crc = crc + "/" + orgName;
    }
    localStorage.setItem(ucComponent.KEY_CLIENT_CRC + orgName, crc)
    return crc;
}

ucComponent.setCookie = function setCookie(name, value, time) {
    //ucComponent.setLog("ucComponent.setCookie:setCookie----set-----:"+cName);
    var h = 0.1;
    if (time == undefined || time == "") {
        h = ucComponentConfig.cookieHour;
    } else {
        h = time;
    }
    var expires = new Date();
    if (h > 0) {
        expires.setTime(expires.getTime() + h * 60 * 60 * 1000);
        expires = expires.toGMTString();
    } else {
        expires = '';
    }
    var str = name + '=' + value + ';expires=' + expires;
    document.cookie = str;
}
ucComponent.getCookie = function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return "";
    }
}
ucComponent.deleteCookie = function deleteCookie(cName) {

    var exp = new Date();
    exp.setTime(exp.getTime() - 10000);
    var cVal = ucComponent.getCookie(cName);
    if (cVal != null) {
        document.cookie = cName + "=" + cVal + ";expires=" + exp.toGMTString();
    }
}
//设置登录用户名
ucComponent.setLogin = function (roleType, loginData) {
    localStorage.setItem(ucComponent.KEY_LOGIN_INFO_REMEMBERED + roleType, '1');
    localStorage.setItem(ucComponent.KEY_LOGIN_INFO + roleType, CryptoJS.TripleDES.encrypt(JSON.stringify(loginData), ucComponent.KEY_USER_INFO).toString());
};
//移除登录用户名信息
ucComponent.removeLogin = function (roleType) {
    localStorage.setItem(ucComponent.KEY_LOGIN_INFO_REMEMBERED + roleType, '0');
    localStorage.removeItem(ucComponent.KEY_LOGIN_INFO + roleType);
};
//获取用户名信息
ucComponent.getLogin = function (roleType) {
    roleType = roleType ? roleType : '';
    var loginObj = localStorage.getItem(ucComponent.KEY_LOGIN_INFO + roleType);
    if (loginObj) {
        var decodeLogin = CryptoJS.TripleDES.decrypt(loginObj, ucComponent.KEY_USER_INFO).toString(CryptoJS.enc.Utf8);

        loginObj = !decodeLogin ? loginObj : decodeLogin;
        loginObj = JSON.parse(loginObj);
    }
    return loginObj;
};
//设置记住密码信息
ucComponent.setLoginRemember = function (roleType, isRemember) {
    localStorage.setItem(ucComponent.KEY_LOGIN_INFO_REMEMBERED + roleType, isRemember ? '1' : '0');
};
//获取记住密码信息
ucComponent.getLoginRemember = function (roleType) {
    var remember = localStorage.getItem(ucComponent.KEY_LOGIN_INFO_REMEMBERED + roleType);
    if (remember == '1') {
        return true;
    } else if (remember == '0') {
        return false;
    } else {
        return null;
    }
};
//设置用户信息
ucComponent.setUserObj = function setUserObj(userData) {
    userData.local_time = new Date().getTime();
    //客户端与服务端的时间差（单位ms）； serverTime - clientTime;负数表示服务端比本地慢，正数表示服务端比本地快
    userData.span_times = ucComponent.stringToDate(userData.server_time).getTime() - userData.local_time;
    ucComponent.setCookie(ucComponent.KEY_ACCESS_TOKEN, userData.access_token);
    //ucComponent.setLog("ucComponent.setUserObj:setCookie:"+userData.access_token);
    //ucComponent.setLog("ucComponent.setUserObj:getCookie:"+ucComponent.getCookie(ucComponent.KEY_ACCESS_TOKEN));
    localStorage.setItem(ucComponent.KEY_USER_DATA,JSON.stringify(userData));
    return userData;
};
//是否登录
ucComponent.hasLoginCookie = function hasLoginCookie() {
    return ucComponent.getCookie(ucComponent.KEY_ACCESS_TOKEN) && localStorage.getItem(ucComponent.KEY_USER_DATA);
};
//删除用户信息
ucComponent.remove = function () {
    //ucComponent.setLog("ucComponent.remove:remove----remove-----");
    ucComponent.userObj = null;
    ucComponent.deleteCookie(ucComponent.KEY_ACCESS_TOKEN);
    localStorage.removeItem(ucComponent.KEY_USER_DATA);
};
//是否登录，未登录会自动跳转，已登录验证权限
ucComponent.isLogin = function () {
    var cookies = ucComponent.hasLoginCookie();
    if (!cookies) {
        ucComponent.remove();
        ucComponent.canArriveWindow.location.replace(ucComponentConfig.login_html);
        return false;
    }
};
//仅获取用户信息
ucComponent.getUserData = function (fromCache) {
    if (ucComponent.userObj && fromCache) {
        return ucComponent.userObj;
    }
    //ucComponent.setLog("ucComponent.getUserData:document.cookie:"+document.cookie);
    var userObj = ucComponent.getCookie(ucComponent.KEY_ACCESS_TOKEN);
    var userData = localStorage.getItem(ucComponent.KEY_USER_DATA);
    //ucComponent.setLog("ucComponent.getUserData:getItem:"+userData);

    //ucComponent.setLog("ucComponent.getUserData:getCookie:"+userObj);
    if (userObj && userData) {
        ucComponent.userObj = JSON.parse(userData);
    } else {
        ucComponent.userObj = null;
    }
    return ucComponent.userObj;
};
//获取用户信息
ucComponent.getUserObj = function () {
    if (!ucComponent.isLogin()) {
        return {};
    }
    return ucComponent.getUserData();
};
//token是否过期
ucComponent.isNotExpires = function () {
    var userObj = ucComponent.getUserData();
    if (userObj) {
        return (ucComponent.stringToDate(userObj.expires_at) - userObj.span_times) > 0;
    }
};
//url编码
ucComponent.encodeUriQuery = function (val, pctEncodeSpaces) {
    if (val == undefined) {
        return '';
    }
    return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%3B/gi, ';').
    replace(/%2F/gi, '/').
    replace(/%20/g, pctEncodeSpaces ? '%20' : '+').
    replace(/'/g, escape('\''));
};
//是否模板
ucComponent.isHtml = function (url) {
    return url && url.split('?')[0].indexOf('.html') !== -1;
};
//url格式化
ucComponent.HttpUrlFormat = function (url, params) {
    if (params) {
        var urlArray = [];

        if ($.isArray(params)) {
            params = params.length > 0 ? params[0] : [];
        }
        $.each(params, function (key, value) {
            if ($.isArray(value)) {
                var arrayValueCell = [];
                $.each(value, function (keyCell, valueCell) {
                    arrayValueCell.push(key + '=' + ucComponent.encodeUriQuery(valueCell));
                });
                if (arrayValueCell.length > 0) {
                    urlArray.push(arrayValueCell.join('&'));
                }
            } else if (value != undefined) {
                if (url.indexOf(':' + key) !== -1) {
                    url = url.replace(':' + key, ucComponent.encodeUriQuery(value));
                } else {
                    urlArray.push(key + '=' + ucComponent.encodeUriQuery(value));
                }
            }
        });
        // Sort by key, keep the same url as angular, or 401(Unauthorization) may occur due to Mac签名错误
        urlArray.sort();//先直接进行排序兼容一下微信端下面描述的问题，其实后面的a.localeCompare(b)通过本地化进行字符串目前项目中没有必要，但避免出现问题，先留着。
        urlArray.sort(function (a, b) {
            //todo 安卓版微信如果默认为QQ浏览器X5内核的调用localeCompare会报 illegal access错误。不支持该方法。这个先做一下try catch处理
            try{
                return a.localeCompare(b);
            }catch (err){
                return 0;
            }
        });
        url = encodeURI(url) + (urlArray.length > 0 ? (url.indexOf('?') !== -1 ? '&' : '?') + urlArray.join('&') : '');
    } else {
        url = encodeURI(url);
    }
    return url;
};
//授权头
ucComponent.HmacAuth = function (method, uri, host, paramData) {
    var rtnArray = [];
    var sbRawMac = [];
    var userData = ucComponent.getUserData();
    var dateNowServer = new Date().getTime() + userData.span_times;
    var nonce = [dateNowServer, ':', CryptoJS.lib.WordArray.random(8)].join('');
    sbRawMac.push(nonce);
    sbRawMac.push('\n');
    sbRawMac.push(method.toUpperCase());
    sbRawMac.push('\n');
    // 请求地址（url）参与签名，要保持请求发出时的url和签名时的url是一致的。
    // $http会把请求配置的params属性值（即这里的paramData对象）拼接到url上。
    // PS:1、如果是调用$http.customXxx系列方法，customXxx方法中已经做了url拼接的处理，进到这个方法（HmacAuth）的时候paramData会是空的。
    //  customXxx系列方法比默认的方法多了替换url中的占位符（:xxx）的功能。减少手动拼url的麻烦
    //  2、如果是调用$http默认提供的方法，此时paramData可能有值。
    if (paramData) {
        //HttpUrlFormat是我们驶向的，把params属性拼接到url上的方法（和$http内部的基本一致）
        sbRawMac.push(ucComponent.HttpUrlFormat(uri, paramData));
    } else {
        sbRawMac.push(uri);
    }
    sbRawMac.push('\n');
    sbRawMac.push(host);
    sbRawMac.push('\n');

    rtnArray.push('MAC id="');
    rtnArray.push(userData.access_token);
    rtnArray.push('",nonce="');
    rtnArray.push(nonce);
    rtnArray.push('",mac="');
    rtnArray.push(CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(sbRawMac.join(''), userData.mac_key)).toString(CryptoJS.enc.Base64));
    rtnArray.push('"');
    //        console.log("uri"+uri+"---nonce:"+nonce);
    return rtnArray.join('');
};
//base64编码
ucComponent.base64Encode = function (str) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
}
//base64解码
ucComponent.base64Decode = function (str) {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(str));
}

module.exports = ucComponent;
