var app = require('express')(),
    bodyParser = require ('body-parser');
var wechat = require('./lib/wechat');
var config = require('./lib/config');

app.use(bodyParser.urlencoded({
    extended: false
}));

//设置模板目录
app.set('views', path)

wechat(config.wechat);

wechat.createMenu(require('./lib/menu.json'));

app.use('/wxapi', require('./lib/routers/wxapi.js'));
app.use('/pages', require('./lib/routers/pages.js'));

app.listen(8006, function(err){
    console.log('listenning at 8006...');
});
