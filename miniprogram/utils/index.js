import moment from '../common/js/moment/moment.js';
moment.locale('zh-cn');


const utils = {

  // 是否在今天之前
  beforeToday(params) {
    return moment().isAfter(params);
  },

  // 是否是今天
  isToday(params) {
    return moment().isSame(moment(params));
  },

  // 和今天相差的时间
  diffToday(params) {
    const now = moment()
    return now.diff(moment(params), 'days')
  },

};

/**
 * 暴露的接口
 */
module.exports = utils;
