/*!
 * Transfer date between solar and lunar calendar.
 * Support date from 1891.01.01 to 2100.12.31
 *
 * @author Goo Kang <kangih90@gmail.com>
 * @license MIT
 */

// 양력을 음력으로 변환.
const TYPE_SOLAR_TO_LUNAR = 1;
// 음력을 양력으로 변환.
const TYPE_LUNAR_TO_SOLAR = 2;

// 양력의 달마다의 일수
const SOLAR_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const YEAR_MIN = 1939; // 년도 시작.
const YEAR_MAX = 2043; // 년도 끝.
const MONTH_MIN = 1; // 월 시작.
const MONTH_MAX = 12; // 월 끝.
const DAY_MIN = 1; // 일 시작.
const DAY_MAX = 30; // 일 끝.

var lunarMonthTable = [
    [2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2],   /* 양력 1940년 1월은 음력 1939년에 있음 그래서 시작년도는 1939년*/
    [2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
    [2, 2, 1, 2, 2, 4, 1, 1, 2, 1, 2, 1],   /* 1941 */
    [2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2],
    [1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],
    [1, 1, 2, 4, 1, 2, 1, 2, 2, 1, 2, 2],
    [1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2],
    [2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2],
    [2, 5, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2],
    [2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
    [2, 2, 1, 2, 1, 2, 3, 2, 1, 2, 1, 2],
    [2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1],
    [2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],   /* 1951 */
    [1, 2, 1, 2, 4, 2, 1, 2, 1, 2, 1, 2],
    [1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2, 2],
    [1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2],
    [2, 1, 4, 1, 1, 2, 1, 2, 1, 2, 2, 2],
    [1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2],
    [2, 1, 2, 1, 2, 1, 1, 5, 2, 1, 2, 2],
    [1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
    [1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [2, 1, 2, 1, 2, 5, 2, 1, 2, 1, 2, 1],
    [2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2],   /* 1961 */
    [1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1],
    [2, 1, 2, 3, 2, 1, 2, 1, 2, 2, 2, 1],
    [2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2],
    [1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2],
    [1, 2, 5, 2, 1, 1, 2, 1, 1, 2, 2, 1],
    [2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 2],
    [1, 2, 2, 1, 2, 1, 5, 2, 1, 2, 1, 2],
    [1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1],
    [2, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2],
    [1, 2, 1, 1, 5, 2, 1, 2, 2, 2, 1, 2],   /* 1971 */
    [1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1],
    [2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2, 1],
    [2, 2, 1, 5, 1, 2, 1, 1, 2, 2, 1, 2],
    [2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2],
    [2, 2, 1, 2, 1, 2, 1, 5, 2, 1, 1, 2],
    [2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1],
    [2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1],
    [2, 1, 1, 2, 1, 6, 1, 2, 2, 1, 2, 1],
    [2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2],
    [1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2],   /* 1981 */
    [2, 1, 2, 3, 2, 1, 1, 2, 2, 1, 2, 2],
    [2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2],
    [2, 1, 2, 2, 1, 1, 2, 1, 1, 5, 2, 2],
    [1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2],
    [1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1],
    [2, 1, 2, 2, 1, 5, 2, 2, 1, 2, 1, 2],
    [1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1],
    [2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2],
    [1, 2, 1, 1, 5, 1, 2, 1, 2, 2, 2, 2],
    [1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2],   /* 1991 */
    [1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2],
    [1, 2, 5, 2, 1, 2, 1, 1, 2, 1, 2, 1],
    [2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2],
    [1, 2, 2, 1, 2, 2, 1, 5, 2, 1, 1, 2],
    [1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2],
    [1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1],
    [2, 1, 1, 2, 3, 2, 2, 1, 2, 2, 2, 1],
    [2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1],
    [2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1],
    [2, 2, 2, 3, 2, 1, 1, 2, 1, 2, 1, 2],   /* 2001 */
    [2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
    [2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2],
    [1, 5, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1],
    [2, 1, 2, 1, 2, 1, 5, 2, 2, 1, 2, 2],
    [1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2],
    [2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2],
    [2, 2, 1, 1, 5, 1, 2, 1, 2, 1, 2, 2],
    [2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
    [2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1],   /* 2011 */
    [2, 1, 6, 2, 1, 2, 1, 1, 2, 1, 2, 1],
    [2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [1, 2, 1, 2, 1, 2, 1, 2, 5, 2, 1, 2],
    [1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1],
    [2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2],
    [2, 1, 1, 2, 3, 2, 1, 2, 1, 2, 2, 2],
    [1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2],
    [2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
    [2, 1, 2, 5, 2, 1, 1, 2, 1, 2, 1, 2],
    [1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],   /* 2021 */
    [2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2],
    [1, 5, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2],
    [1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1],
    [2, 1, 2, 1, 1, 5, 2, 1, 2, 2, 2, 1],
    [2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2],
    [1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2],
    [1, 2, 2, 1, 5, 1, 2, 1, 1, 2, 2, 1],
    [2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2],
    [1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
    [2, 1, 5, 2, 1, 2, 2, 1, 2, 1, 2, 1],   /* 2031 */
    [2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],
    [1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 5, 2],
    [1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1],
    [2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2],
    [2, 2, 1, 2, 1, 4, 1, 1, 2, 2, 1, 2],
    [2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2],
    [2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
    [2, 2, 1, 2, 5, 2, 1, 2, 1, 2, 1, 1],
    [2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1],
    [2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],   /* 2041 */
    [1, 5, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2],
    [1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2]];

// 음력 계산을 위한 객체
function myDate(year, month, day, leapMonth) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.leapMonth = leapMonth;
}

var calendar = {};

calendar.isLeapYear = function(year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}

/* 양력/음력 변환 */
calendar.toLunar = function(year, month, day) 
{
    if (!year || !month || !day) return false;
    if (year < YEAR_MIN || year > YEAR_MAX) return false;
    if (month < MONTH_MIN || month > MONTH_MAX) return false;

    let leapYear = this.isLeapYear(year);
    let monthDays = SOLAR_MONTH_DAYS;
    monthDays[1] = leapYear ? 29 : 28;

    if (day < DAY_MIN || day > monthDays[month - 1]) return false;

    var type = TYPE_SOLAR_TO_LUNAR;

    var solarYear, solarMonth, solarDay;
    var lunarYear, lunarMonth, lunarDay;
    var lunarLeapMonth, lunarMonthDay;
    var i, lunarIndex;

    /* 속도 개선을 위해 기준 일자를 여러개로 한다 */
    if (year >= 2000)
    {
        /* 기준일자 양력 2000년 1월 1일 (음력 1999년 11월 25일) */
        solarYear = 2000;
        solarMonth = 1;
        solarDay = 1;
        lunarYear = 1999;
        lunarMonth = 11;
        lunarDay = 25;
        lunarLeapMonth = 0;

        monthDays[1] = 29;    /* 2000 년 2월 28일 */
        lunarMonthDay = 30;   /* 1999년 11월 */
    }
    else if (year >= 1970)
    {
        /* 기준일자 양력 1970년 1월 1일 (음력 1969년 11월 24일) */
        solarYear = 1970;
        solarMonth = 1;
        solarDay = 1;
        lunarYear = 1969;
        lunarMonth = 11;
        lunarDay = 24;
        lunarLeapMonth = 0;

        monthDays[1] = 28;    /* 1970 년 2월 28일 */
        lunarMonthDay = 30;   /* 1969년 11월 */
    }
    else if (year >= 1940)
    {
        /* 기준일자 양력 1940년 1월 1일 (음력 1939년 11월 22일) */
        solarYear = 1940;
        solarMonth = 1;
        solarDay = 1;
        lunarYear = 1939;
        lunarMonth = 11;
        lunarDay = 22;
        lunarLeapMonth = 0;

        monthDays[1] = 29;    /* 1940 년 2월 28일 */
        lunarMonthDay = 29;   /* 1939년 11월 */
    }
    else
    {
        /* 기준일자 양력 1900년 1월 1일 (음력 1899년 12월 1일) */
        solarYear = 1900;
        solarMonth = 1;
        solarDay = 1;
        lunarYear = 1899;
        lunarMonth = 12;
        lunarDay = 1;
        lunarLeapMonth = 0;

        monthDays[1] = 28;    /* 1900 년 2월 28일 */
        lunarMonthDay = 30;   /* 1899년 12월 */
    }

    lunarIndex = lunarYear - YEAR_MIN;

    while (true)
    {
        console.log("year:" + year + " month:" + month + " day:" + day);
        console.log("Solar year:" + solarYear + " month:" + solarMonth + " day:" + solarDay);
        console.log("Lunar year:" + lunarYear + " month:" + lunarMonth + " day:" + lunarDay);
        console.log("Lunar index:" + lunarIndex);
        console.log("Lunar month day:" + lunarMonthDay);
        console.log("Lunar leap month:" + lunarLeapMonth);

        if (type == TYPE_SOLAR_TO_LUNAR && year == solarYear && month == solarMonth && day == solarDay)
        {
            return new myDate(lunarYear, lunarMonth, lunarDay, lunarLeapMonth);
        }
        else if (type == TYPE_LUNAR_TO_SOLAR && year == lunarYear && month == lunarMonth && day == lunarDay && leapmonth == lunarLeapMonth)
        {
            return new myDate(solarYear, solarMonth, solarDay, 0);
        }

        /* add a day of solar calendar */
        if (solarMonth == 12 && solarDay == 31)
        {
            solarYear++;
            solarMonth = 1;
            solarDay = 1;

            /* set monthDay of Feb */
            let leapYear = this.isLeapYear(year);
            monthDays[1] = leapYear ? 29 : 28;
        }
        else if (monthDays[solarMonth - 1] == solarDay)
        {
            solarMonth++;
            solarDay = 1;
        }
        else
            solarDay++;

        /* add a day of lunar calendar */
        if (lunarMonth == 12 &&
            ((lunarMonthTable[lunarIndex][lunarMonth - 1] == 1 && lunarDay == 29) ||
            (lunarMonthTable[lunarIndex][lunarMonth - 1] == 2 && lunarDay == 30)))
        {
            lunarYear++;
            lunarMonth = 1;
            lunarDay = 1;

            if (lunarYear > YEAR_MAX) {
                alert("입력하신 달은 없습니다.");
                break;
            }

            lunarIndex = lunarYear - YEAR_MIN;

            if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 1)
                lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 2)
                lunarMonthDay = 30;
        }
        else if (lunarDay == lunarMonthDay)
        {
            if (lunarMonthTable[lunarIndex][lunarMonth - 1] >= 3
                && lunarLeapMonth == 0)
            {
                lunarDay = 1;
                lunarLeapMonth = 1;
            }
            else
            {
                lunarMonth++;
                lunarDay = 1;
                lunarLeapMonth = 0;
            }

            if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 1)
                lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 2)
                lunarMonthDay = 30;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 3)
                lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 4 &&
                    lunarLeapMonth == 0)
                lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 4 &&
                    lunarLeapMonth == 1)
                lunarMonthDay = 30;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 5 &&
                    lunarLeapMonth == 0)
                lunarMonthDay = 30;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 5 &&
                    lunarLeapMonth == 1)
                    lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 6)
                lunarMonthDay = 30;
        }
        else
            lunarDay++;
    }    
    /////////////
}

calendar.toSolar = function(date) {

    if (!year || !month || !day) return false;
    if (year < YEAR_MIN || year > YEAR_MAX) return false;
    if (month < MONTH_MIN || month > MONTH_MAX) return false;

    let leapYear = this.isLeapYear(year);
    let monthDays = SOLAR_MONTH_DAYS;
    monthDays[1] = leapYear ? 29 : 28;

    if (day < DAY_MIN || day > monthDays[month - 1]) return false;

    /* 양력/음력 변환 */
    var type = TYPE_SOLAR_TO_LUNAR;

    var solarYear, solarMonth, solarDay;
    var lunarYear, lunarMonth, lunarDay;
    var lunarLeapMonth, lunarMonthDay;
    var i, lunarIndex;

    /* 속도 개선을 위해 기준 일자를 여러개로 한다 */
    if (year >= 2000)
    {
        /* 기준일자 양력 2000년 1월 1일 (음력 1999년 11월 25일) */
        solarYear = 2000;
        solarMonth = 1;
        solarDay = 1;
        lunarYear = 1999;
        lunarMonth = 11;
        lunarDay = 25;
        lunarLeapMonth = 0;

        monthDays[1] = 29;    /* 2000 년 2월 28일 */
        lunarMonthDay = 30;   /* 1999년 11월 */
    }
    else if (year >= 1970)
    {
        /* 기준일자 양력 1970년 1월 1일 (음력 1969년 11월 24일) */
        solarYear = 1970;
        solarMonth = 1;
        solarDay = 1;
        lunarYear = 1969;
        lunarMonth = 11;
        lunarDay = 24;
        lunarLeapMonth = 0;

        monthDays[1] = 28;    /* 1970 년 2월 28일 */
        lunarMonthDay = 30;   /* 1969년 11월 */
    }
    else if (year >= 1940)
    {
        /* 기준일자 양력 1940년 1월 1일 (음력 1939년 11월 22일) */
        solarYear = 1940;
        solarMonth = 1;
        solarDay = 1;
        lunarYear = 1939;
        lunarMonth = 11;
        lunarDay = 22;
        lunarLeapMonth = 0;

        monthDays[1] = 29;    /* 1940 년 2월 28일 */
        lunarMonthDay = 29;   /* 1939년 11월 */
    }
    else
    {
        /* 기준일자 양력 1900년 1월 1일 (음력 1899년 12월 1일) */
        solarYear = 1900;
        solarMonth = 1;
        solarDay = 1;
        lunarYear = 1899;
        lunarMonth = 12;
        lunarDay = 1;
        lunarLeapMonth = 0;

        monthDays[1] = 28;    /* 1900 년 2월 28일 */
        lunarMonthDay = 30;   /* 1899년 12월 */
    }

    lunarIndex = lunarYear - YEAR_MIN;

    while (true)
    {
        console.log("year:" + year + " month:" + month + " day:" + day);
        console.log("Solar year:" + solarYear + " month:" + solarMonth + " day:" + solarDay);
        console.log("Lunar year:" + lunarYear + " month:" + lunarMonth + " day:" + lunarDay);
        console.log("Lunar index:" + lunarIndex);
        console.log("Lunar month day:" + lunarMonthDay);
        console.log("Lunar leap month:" + lunarLeapMonth);

        if (type == TYPE_SOLAR_TO_LUNAR && year == solarYear && month == solarMonth && day == solarDay)
        {
            return new myDate(lunarYear, lunarMonth, lunarDay, lunarLeapMonth);
        }
        else if (type == TYPE_LUNAR_TO_SOLAR && year == lunarYear && month == lunarMonth && day == lunarDay && leapmonth == lunarLeapMonth)
        {
            return new myDate(solarYear, solarMonth, solarDay, 0);
        }

        /* add a day of solar calendar */
        if (solarMonth == 12 && solarDay == 31)
        {
            solarYear++;
            solarMonth = 1;
            solarDay = 1;

            /* set monthDay of Feb */
            let leapYear = this.isLeapYear(year);
            monthDays[1] = leapYear ? 29 : 28;
        }
        else if (monthDays[solarMonth - 1] == solarDay)
        {
            solarMonth++;
            solarDay = 1;
        }
        else
            solarDay++;

        /* add a day of lunar calendar */
        if (lunarMonth == 12 &&
            ((lunarMonthTable[lunarIndex][lunarMonth - 1] == 1 && lunarDay == 29) ||
            (lunarMonthTable[lunarIndex][lunarMonth - 1] == 2 && lunarDay == 30)))
        {
            lunarYear++;
            lunarMonth = 1;
            lunarDay = 1;

            if (lunarYear > YEAR_MAX) {
                alert("입력하신 달은 없습니다.");
                break;
            }

            lunarIndex = lunarYear - YEAR_MIN;

            if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 1)
                lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 2)
                lunarMonthDay = 30;
        }
        else if (lunarDay == lunarMonthDay)
        {
            if (lunarMonthTable[lunarIndex][lunarMonth - 1] >= 3
                && lunarLeapMonth == 0)
            {
                lunarDay = 1;
                lunarLeapMonth = 1;
            }
            else
            {
                lunarMonth++;
                lunarDay = 1;
                lunarLeapMonth = 0;
            }

            if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 1)
                lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 2)
                lunarMonthDay = 30;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 3)
                lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 4 &&
                    lunarLeapMonth == 0)
                lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 4 &&
                    lunarLeapMonth == 1)
                lunarMonthDay = 30;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 5 &&
                    lunarLeapMonth == 0)
                lunarMonthDay = 30;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 5 &&
                    lunarLeapMonth == 1)
                    lunarMonthDay = 29;
            else if (lunarMonthTable[lunarIndex][lunarMonth - 1] == 6)
                lunarMonthDay = 30;
        }
        else
            lunarDay++;
    }    
    /////////////
}

module.exports = calendar;
