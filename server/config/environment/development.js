'use strict';

module.exports = {
  api: {
    //uri: 'http://api.91pintuan.com/api',component: '5581117b5f225e4c401c9259', //正式 
    uri: 'https://apidev.91pintuan.com/api',component: '5726bf8700bbe21526c4ccbe',//测试版
    from:'client'
  },
  mongo: {
    uris:'mongodb://localhost/fate'
  },
  debug: {
  	wechat:false
  }
};
