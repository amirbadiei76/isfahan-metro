import moment from 'jalali-moment';
// import * as isHoliday from 'shamsi-holiday';

const monthNames = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند'
]

const dayNames = [
    'شنبه',
    'یکشنبه',
    'دوشنبه',
    'سه شنبه',
    'چهارشنبه',
    'پنجشنبه',
    'جمعه'
]

export const getPersianDate = () => {
    moment.locale('fa');
    // moment(new Date())
    // console.log(moment().minute())
    // let today = new Date().toLocaleDateString('fa-IR-u-nu-latn');
    // console.log(today);

    return moment(new Date());
};

export const getTodayTime = () => {
    const currentDate = new Date().toLocaleString("en-US", {timeZone: 'Asia/Tehran'});
    return new Date(currentDate.toLocaleString());
}

export const todayIsHoliday = () => {
    return moment().jDay() == 6;
}

export const getPersianStringTime = () => {
    const today = getTodayTime()
    return today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
}


export const getPersianStringDate = () => {
    const moment = getPersianDate();
    return dayNames[moment.jDay()] + " " + moment.jDate() + " " + monthNames[moment.jMonth()] + " " + moment.jYear()
}




