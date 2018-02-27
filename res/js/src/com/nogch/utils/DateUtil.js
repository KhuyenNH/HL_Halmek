;
if(typeof DateUtil != 'object') var DateUtil = {};

//1日のミリ秒数
DateUtil.MSEC_DAY = 86400000;

/**
 * 日付の妥当性チェック
 * year 年
 * month 月
 * day 日
 */
DateUtil.checkDate = function(year, month, day) {
    var dt = new Date(year, month - 1, day);
    if(dt == null || dt.getFullYear() != year || dt.getMonth() + 1 != month || dt.getDate() != day) {
        return false;
    }
    return true;
};
// Date.parse

/**
 * 年月日と加算日からn日後、n日前を求める関数
 * year 年 or Date
 * month 月 or addDays ()上記がDateクラスだった場合
 * day 日
 * addDays 加算日。マイナス指定でn日前も設定可能
 */
DateUtil.computeDate = function(year, month, day, addDays) {
		var dt;
		if(year instanceof Date){
			dt = year;
			addDays = month;
		}else{
			dt = new Date(year, month - 1, day);
		}
    var baseSec = dt.getTime();
    var addSec = addDays * DateUtil.MSEC_DAY;//日数 * 1日のミリ秒数
    var targetSec = baseSec + addSec;
    dt.setTime(targetSec);
    return dt;
};

/**
 * 年月を指定して月末日を求める関数
 * year 年
 * month 月
 */
DateUtil.getMonthEndDay = function (year, month) {
    //日付を0にすると前月の末日を指定したことになります
    //指定月の翌月の0日を取得して末日を求めます
    //そのため、ここでは month - 1 は行いません
    var dt = new Date(year, month, 0);
    return dt.getDate();
};

/**
 * 年月日と加算月からnヶ月後、nヶ月前の日付を求める
 * year 年
 * month 月
 * day 日
 * addMonths 加算月。マイナス指定でnヶ月前も設定可能
 */
DateUtil.computeMonth = function(year, month, day, addMonths) {
    month += addMonths;
    var endDay = DateUtil.getMonthEndDay(year, month);//ここで、前述した月末日を求める関数を使用します
    if(day > endDay) day = endDay;
    var dt = new Date(year, month - 1, day);
    return dt;
};

/**
 * 2つの日付の差を求める関数
 * year1 1つのめ日付の年
 * month1 1つめの日付の月
 * day1 1つめの日付の日
 * year2 2つのめ日付の年
 * month2 2つめの日付の月
 * day2 2つめの日付の日
 */
DateUtil.compareDate = function(year1, month1, day1, year2, month2, day2) {
    var dt1 = new Date(year1, month1 - 1, day1);
    var dt2 = new Date(year2, month2 - 1, day2);
    var diff = dt1 - dt2;
    var diffDay = diff / DateUtil.MSEC_DAY;//1日は86400000ミリ秒
    return diffDay;
};

/**
 * 曜日を求める
 * @param  {[type]} d    [description]
 * @param  {[type]} suff "曜日"をつけるか
 * @return {[type]}      [description]
 */
DateUtil.getJpWeek = function(d,suff){
 var week = new Array("日", "月", "火", "水", "木", "金", "土");
 return week[d.getDay()] + (suff ? '曜日':'');
};

/**
 * 任意の年月の第n曜日の日付を求める関数
 * year 年
 * month 月
 * number 何番目の曜日か、第1曜日なら1。第3曜日なら3
 * dayOfWeek 求めたい曜日。0〜6までの数字で曜日の日〜土を指定する
 */
DateUtil.getWhatDayOfWeek = function(year, month, number, dayOfWeek) {
    var firstDt = new Date(year, month - 1, 1);
    var firstDayOfWeek = firstDt.getDay();//指定した年月の1日の曜日を取得
    var day = dayOfWeek - firstDayOfWeek + 1;
    if(day <= 0) day += 7;//1週間を足す
    var dt = new Date(year, month - 1, day);
    var msTime = dt.getTime();
    msTime += (DateUtil.MSEC_DAY * 7 * (number - 1));//n曜日まで1週間を足し込み
    dt.setTime(msTime);
    return dt;
};

/**
 * うるう年（閏年）の判定
 */
DateUtil.checkLeapyear = function(year){
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
};