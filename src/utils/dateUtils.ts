export const getTodayTime = () => {
    const currentDate = new Date().toLocaleString('fa-IR-u-nu-latn', {timeZone: 'Asia/Tehran'});
    return new Date(currentDate);
}

export const todayIsHoliday = () => {
    const splitedDate = getPersianStringDate().toString().split(' ');
    return splitedDate[0] == 'جمعه';
}

export const getPersianStringTime = () => {
    const today = getTodayTime()
    return today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
}

export const getCurrentYear = () => {
    const date = new Date();
    const faDate = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
        year: "numeric",
        timeZone: 'Asia/Tehran'
    }).format(date)
    return faDate;
}

export const getFormatedDate = () => {
    const date = new Date();
    const faDate = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
        year: "numeric",
        month: 'numeric',
        day: 'numeric',
        timeZone: 'Asia/Tehran'
    }).format(date).replaceAll('/', '-')
    return faDate;
}

export const getPersianStringDate = () => {
    const date = new Date();
    const faDate = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: 'Asia/Tehran'
    }).format(date).toString().replace(',', '')
    const reeverseDate = faDate.split(' ').reverse().join(' ')
    return reeverseDate;
}




