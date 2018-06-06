//mixin
var body = document.body;

function $(id) {return document.getElementById(id);}

//initialize xmlHttpRequest
function createXHR() {
    var xmlHttp;

    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    return xmlHttp;
}

//generate random string
function randomString(len) {
    len = len || 32;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = chars.length;
    var str = "";

    for (var i = 0; i < len; i++)
        str += chars.charAt(Math.floor(Math.random() * maxPos));

    return str;
}

//request RSA public key
function reqPkey() {
    var xmlHttp = createXHR();
    var url = "../../php-cgi/rsa.php?" + new Date().getTime();

    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.send("action=reqRSA");

    // handle result
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (!getCookie("pubkey")) {
                var pubkey = "";

                for (var i=0; i<xmlHttp.responseText.length; i++)
                    pubkey = xmlHttp.responseText.replace(/[\f\n\r\t\v]/g, "");
                // alert(pubkey);
                setCookie("pubkey", pubkey, 1, "/");
                // console.log(getCookie("pubkey"));
            }
        }
    };
    // xmlHttp.close();
}
reqPkey();

//encrypt
function encAes(data, key, setup) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(key), setup).toString();
}

//decrypt
function decAes(data, key, setup) {
    return CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), setup).toString(CryptoJS.enc.Utf8);
}

//cookie operations
function setCookie(cname, cvalue, exhrs, path) {
    var d = new Date();
    exhrs = exhrs ? exhrs : 1;

    d.setTime(d.getTime() + (exhrs * 3600 * 1000));
    if (path)
        document.cookie = cname + "=" + cvalue + "; " + "expires=" + d.toUTCString() + ";path=" + path;
    else
        document.cookie = cname + "=" + cvalue + "; " + "expires=" + d.toUTCString();
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');

    for (var i=0; i<ca.length; i++) {
        var c = ca[i].trim();

        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }

    return "";
}

function checkCookie(cname) {
    return !!getCookie(cname);
}
