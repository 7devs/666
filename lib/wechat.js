var apiurl, appid, secret,
    accessToken, expires = 0,

//用于在服务端发送请求包
request = require('request');

//初始化，保存微信API相关设置
function init(options){
    appid = options.appid;
    appurl = options.appurl;
    secret = options.secret;
}

function getOpenidByCode(code, callback){
    request.get(snurl, {
        qs:{
            grant_type: 'authorization_code',
            code: code,
            appid: appid,
            secret: secret
        }
    }, funtion(err, res, body){
        var body = JSON.parse(body);
        callback && callback(body);
    });
}

/**
获取 API 访问权限
@see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183&token=&lang=zh_CN
*/
funtion getAccessToke(next){
    //利用request包向微信发起请求
    request.get(
        //接口地址
        apiurl + 'token',
        //接口参数
        {
            //query string 数据
            qs: {
                grant_type: 'client_credential',
                appid: appid,
                secret: secret
            }
        },
        //请求回调（请求成功后的处理过程）
        function(err, res, body){
            var body = JSON.parse(body);
            //保存access token
            accessToken = body.access_token;
            //保存token过期时间
            expires = +new Date() + body.expire_in * 1000;
            next && next();
        }
    );
}

/**
检测保存的 token 是否已经过期，如已经过期则需要请求新的 token
*/
funtion checkAccessToken(next){
    if (+new Date() >= expires){
        getAccessToke(next);
    }else{
        next();
    }
}

//public function
function getUserInfo(openid, callback){
    checkAccessToken(function(){
        request.get(apiurl + 'user/info',{
            qs: {
                access_token: accessToken,
                openid: openid
            }
        },function(err, res, body){
            callback(err, JSON.parse(body));
        });
    })
}

function getUser(callback) {
    checkAccessToken(function() {
        request.get(apiurl + 'user/get', {
            qs: {
                access_token: accessToken
            }
        }, function(err, res, body) {
            callback(err, JSON.parse(body));
        });
    });
}

function sendByTemplate(openid, tmpid, data) {
    checkAccessToken(function() {
        request.post(apiurl + 'message/template/send', {
            qs: {
                access_token: accessToken
            },
            json: true,
            body: {
                touser: openid,
                template_id: tmpid,
                data: data
            }
        });
    });
}

/**
利用微信 API 创建自定义菜单
@see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141013&token=&lang=zh_CN
*/
function createMenu(menuConfig) {
    checkAccessToken(function() {
        // 用 request 包向微信服务器发起 post 请求（按文档要求）
        request.post(apiurl + 'menu/create', {
            qs: {
                access_token: accessToken
            },
            json: true,
            // body 参数中是菜单结构 json 格式描述
            body: menuConfig
        });
    });
}

// 公开默认方法
module.exports = init;

module.exports.getUser = getUser;
// 公开创建菜单方法
module.exports.createMenu = createMenu;
module.exports.getUserInfo = getUserInfo;
module.exports.sendByTemplate = sendByTemplate;
module.exports.getOpenidByCode = getOpenidByCode;
