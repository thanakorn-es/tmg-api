const configHost = require('../../config/host');
const configEndpoint = require('../../config/host');

module.exports = {
  getIcfsInquiry: function(){
    return configHost.protocol + '://' + configHost.url + ':' + configEndpoint.icfs_inquiry.port + configEndpoint.icfs_inquiry.path;
  },
  getMappInquiry: function(){
    return configHost.protocol + '://' + configHost.url + ':' + configEndpoint.mapp_inquiry.port + configEndpoint.mapp_inquiry.path;
  }
};
/*
exports.getEndpoint = function(){
  return '';
}
*/