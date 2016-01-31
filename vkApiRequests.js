'use strict';
var rp = require('request-promise'),
    fs = require('fs'),
    unirest = require('unirest'),
    extend = require('xtend');

function getUrlByDomainAndObj(url, obj) {
    url = url + '?';

    Object.keys(obj).forEach(
        (key) => {
            if (obj[key] !== undefined) {
                url += key + '=' + obj[key] + '&';
            }
        }
    );

    url = url.substring(0, url.length - 1);

    return url;
}

var VK = function (_opts) {
    var _self = this;

    _self.options = _opts;

    _self.sendApiRequest = (method, params) => {
        method = method || '';
        params = params || {};

        params.v = _self.options.v;

        return rp({
            method: 'POST',
            uri: 'https://api.vk.com/method/' + method,
            qs: params,
            json: true
        });
    };

    _self.getGroupById = (id) => {
        return _self.sendApiRequest('groups.getById',
            {
                access_token: _self.options.access_token,
                group_id: id,
                fields: 'member_status,admin_level,can_post,ban_info,is_admin,is_member'
            });
    };

    _self.sendPostToWall = (owner_id, message) => {
        return _self.sendApiRequest('wall.post', {
            owner_id,
            access_token: _self.options.access_token,
            from_group: 1,
            message
        });
    };

    _self.getUrlToPostImage = (group_id, album_id) => {
        group_id = group_id || _self.options.target_group_id;
        album_id = album_id || _self.options.target_group_album_id;

        return _self.sendApiRequest('photos.getUploadServer', {
            group_id,
            album_id,
            access_token: _self.options.access_token
        });
    };

    _self.postImageToAlbum = (upload_url, params) => {
        if (!upload_url) {
            throw new Error('upload_url is undefined!');
        }

        unirest.post(upload_url)
            .headers({
                'Content-Type': 'multipart/form-data'
            })
            .field({
                'access_token': _self.options.access_token,
                'album_id': params.album_id,
                'user_id': params.user_id
            })
            .attach('file1', './asd.jpg')
            .end(function (response) {
                var body = extend(JSON.parse(response.body), params);
                body.access_token = _self.options.access_token;

                _self.sendApiRequest('photos.save', body).then(
                    (data) => {
                        console.log('Done!');
                    }
                );
            });
    };
};

module.exports = VK;