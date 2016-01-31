"use strict";
var VkReq = require('./vkApiRequests'),
    extend = require('xtend'),
    config = require('./config') || {
            access_token: 'xxxxxxxxxx', // https://vk.com/dev/auth_mobile
            client_secret: 'xxxxx',
            client_id: 123,
            target_group_id: 123,
            target_group_album_id: 123
        };

var apiData = extend(config, {
    redirect_uri: 'http://oauth.vk.com/blank.html',
    scope: 'wall,offline,groups,photos',
    v: '5.44'
});

var vk = new VkReq(apiData);

vk.getUrlToPostImage().then(
    (q, d) => {
        vk.postImageToAlbum(q.response.upload_url, {
            album_id: q.response.album_id,
            user_id: q.response.user_id,
            group_id: apiData.target_group_id,
            caption: 'test test test, https://vk.com/ru9gag'
        });
    }
);
