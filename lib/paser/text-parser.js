var albums = require('../models/albums');

module.exports = function(content) {
    var reContent;
    if (content === '唱片列表') {
        var list = [];
        for (var i = 0, l = albums.length; i< l; i++) {
            list.push((i + 1) + '- ' + albums[i].title);
        }
        reContent = list.join('\n');
    } else if (isAxCommand(content)) {
        var index = parseInt(content.slice(1, content.length)),
            album = albums[index - 1];
        if (album) {
            reContent = '标题：' + album.title + '\n' +
                '风格：' + album.type + '\n' +
                '时长：' + Math.round(album.length / 60) + '分\n' +
                '演唱者：' + album.singer;
        } else {
            reContent = '曲库中没有第' + index + '张专辑';
        }
    } else {
        reContent = 'Sorry, 妹听懂。';
    }

    return reContent;
};

function isAxCommand(str) {
    str = str.toLowerCase();
    return str[0] === 'a' && allAreNumber(str.slice(1, str.length));
}

function allAreNumber(str) {
    var nums = '0123456789',
        leng = str.length;
    if(leng === 0) {
        return false;
    }
    for (var i = 0, l = str.length; i < l; i++) {
        if(nums.indexOf(str[i]) === -1) {
            return false;
        }
    }
    return true;
}
