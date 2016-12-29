'use strict';

api['wx.dev2.91pintuan.com'] = 'https://apidev.91pintuan.com';
api['99.dev2.91pintuan.com'] = 'https://api99dev.91pintuan.com';
api['http://101.201.208.166/'] = 'http://101.201.208.166';
api[''] = 'http://101.201.208.166';
api['wx.91pintuan.com'] = 'https://api.91pintuan.com';
api['91pintuan.com']    = 'https://api.91pintuan.com';
api['99.91pintuan.com'] = 'https://api99.91pintuan.com';
api['v2.91pintuan.com'] = 'https://apidev.91pintuan.com';
api['cunyoupin.com'] = 'http://api.cunyoupin.com';

exports = module.exports = {
  development:{//开发版
    uri: 'https://apidev.91pintuan.com',
    imgUri:'https://img.91pintuan.com',
    phtUri:'https://photo.91pintuan.com',
    phtUriExotic:'http://photo.91pintuan.com',
    component: '5726bf8700bbe21526c4ccbe',
    apiUri: api,
    debug:true,
    from:'client'
  },
  production:{//产品版本
    uri: 'https://api.91pintuan.com',
    imgUri:'https://img.91pintuan.com',
    phtUri:'https://photo.91pintuan.com',
    phtUriExotic:'http://photo.91pintuan.com',
    component: '5581117b5f225e4c401c9259',
    apiUri: api,
    debug:false,
    from:'client'
  }
};
