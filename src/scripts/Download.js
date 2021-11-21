/* 99 Давление, 100 Влажность, 101 Направление ветра, 102 Скорость ветра, 103 Температура, 369 Порывы */
/* Коды данных */
const indicators = '99,100,101,102,103,369';
const indicatorWindDirection = '101';
const date = new Date();
const dateBeginArchive = new Date();
const dateEndForecast = new Date();

const hour = formateHour(date.getHours());

dateBeginArchive.setDate(dateBeginArchive.getDate() - 3);
dateEndForecast.setDate(dateEndForecast.getDate() + 3);

const timeEnd = formatDate(date);
const timeEndForecast = formatDate(dateEndForecast);
const timeBegin = formatDate(dateBeginArchive);
const timeBeginForecast = formatDate(date);

/* Получение данных за трое суток */
async function DownloadInformationNow() {
    const URL = `https://gis.krasn.ru/sc/api/1.0/projects/6/aggvalues?&sites=4203&key=f6q6kbspmw7p47gr&time_begin=${timeBegin} ${hour}:00:00&time_end=${timeEnd} 23:00:00&time_interval=1hour&indicators=${indicators}`;
    const responce = fetch(URL);
    const result = responce.then(e => XML2JSON(e));
    return result;
}

/* Получение последних данных за несколько часов */
async function DownloadInformationLast() {
    const URL = `https://gis.krasn.ru/sc/api/1.0/projects/6/aggvalues?&sites=4203&key=f6q6kbspmw7p47gr&time_begin=${timeEnd} 00:00:00&time_end=${timeEnd} 23:00:00&time_interval=20min&indicators=${indicators}`;
    const responce = fetch(URL);
    const result = responce.then(e => XML2JSON(e));
    return result;
}

/* Получение данных о направлении ветра за полные сутки */
async function DownloadInfomationWindDirection() {
    const URL = `https://gis.krasn.ru/sc/api/1.0/projects/6/aggvalues?&sites=4203&key=f6q6kbspmw7p47gr&time_begin=${timeBegin} 00:00:00&time_end=${timeEnd} 23:00:00&time_interval=1hour&indicators=${indicatorWindDirection}`;
    const responce = fetch(URL);
    const result = responce.then(e => XML2JSON(e));
    return result;
}

/* Получение данных о направлении ветра за полные сутки (Прогнозы)*/
async function DownloadInfomationWindDirectionForecast() {
    const URL = `https://gis.krasn.ru/sc/api/1.0/projects/10/aggvalues?&sites=4226&key=f6q6kbspmw7p47gr&time_begin=${timeBeginForecast} 00:00:00&time_end=${timeEndForecast} 23:00:00&time_interval=1hour&indicators=${indicatorWindDirection}`;
    const responce = fetch(URL);
    const result = responce.then(e => XML2JSON(e));
    return result;
}

/* Получение прогноза на трое суток */
async function DownloadInformationForecast() {
    const URL = `https://gis.krasn.ru/sc/api/1.0/projects/10/aggvalues?&sites=4226&key=f6q6kbspmw7p47gr&time_begin=${timeBeginForecast} ${hour}:00:00&time_end=${timeEndForecast} ${hour}:00:00&time_interval=1hour&indicators=${indicators}`;
    const responce = fetch(URL);
    const result = responce.then(e => XML2JSON(e));
    return result;
}

/* Получение текстового прогноза */
async function DownloadTextForecast() {
    const URL_TEXT = `https://gis.krasn.ru/sc/api/1.0/projects/10/values.xml?&time_begin=${timeBeginForecast}&time_end=${timeEndForecast} 23:00:00&key=f6q6kbspmw7p47gr&indicators=367`
    const responceText = fetch(URL_TEXT);
    const resultText = responceText.then(e => XML2TextForecast(e));
    return resultText;
}

/* Преобразование данных */
async function XML2JSON(e) {
    const temperature = { time: [], values: [], name: "Температура (°C)", type: "temperature" };
    const pressure = { time: [], values: [], name: "Давление (мм рт. ст)", type: "pressure" };
    const humidity = { time: [], values: [], name: "Влажность (%)", type: "humidity" };
    const winddirect = { time: [], values: [], name: "Преобладающее направление ветра", type: "winddirect" };
    const winddirectcard = { time: [], values: [], name: "Направление ветра (Карточка)", type: "winddirectcard" };
    const windspeed = { time: [], values: { s: [], r: [] }, name: "Скорость ветра (м/с)", type: "windspeed" };
    const r = e.text().then(e => {
        const dom = new DOMParser();
        const xml = dom.parseFromString(e, "text/xml");
        const aggvalues = xml.getElementsByTagName("aggvalue");
        let dayBegin = "";
        let count = 0;
        aggvalues.forEach((element) => {
            const indicator = element.getAttribute("indicator")
            const time = element.getAttribute("time").substring(0, element.getAttribute("time").length - 3);
            const value = Number(element.getElementsByTagName("avg")[0].innerHTML).toFixed(1);
            switch (indicator) {
                case '99':
                    pressure.time.push(
                        time
                    );
                    pressure.values.push(
                        value
                    )
                    break;
                case '100':
                    humidity.time.push(
                        time
                    );
                    humidity.values.push(
                        value
                    );
                    break;
                case '101':
                    if (time.split(' ')[0] != dayBegin) {
                        dayBegin = time.split(' ')[0]
                        winddirect.values.push([]);
                        winddirect.time.push(
                            time
                        );
                        count++;
                    }
                    winddirect.values[count - 1].push(
                        DirectionRound(value)
                    );
                    if (time.split(" ")[1] == "01:00" ||
                        time.split(" ")[1] == "13:00" ||
                        time.split(" ")[1] == "19:00") {
                        winddirectcard.time.push(time)
                        winddirectcard.values.push(Number(DirectionRound(value)))
                    }
                    break;
                case '102':
                    windspeed.time.push(
                        time
                    );
                    windspeed.values.s.push(
                        value
                    );
                    break;
                case '103':
                    temperature.time.push(
                        time
                    );
                    temperature.values.push(
                        value
                    );
                    break;
                case '369':
                    windspeed.values.r.push(
                        value
                    );
                    break;
                default:
                    console.log("Нет таких значений");
            }
        })
        return [
            temperature, pressure, humidity, windspeed, winddirectcard, winddirect
        ]
    })
    return r;
}

/* Преобразование текстовых данных */
async function XML2TextForecast(e) {
    const ugms = [];
    const russia = [];
    const r = e.text().then(e => {
        const dom = new DOMParser();
        const xml = dom.parseFromString(e, "text/xml");
        const values = xml.getElementsByTagName("value");
        values.forEach((element) => {
            const time = element.getAttribute("time")
            const value = element.innerHTML
            if (time.split(' ')[1] == "12:01:00") {
                ugms.push({
                    time: time.split(' ')[0],
                    value: value
                })
            }
            if (time.split(' ')[1] == "12:02:00") {
                russia.push(
                    {
                        time: time.split(' ')[0],
                        value: value
                    }
                );
            }
        })
        return { ugms, russia }
    })
    return r;
}

/* Преобразование обработанных данных для отображения на графике */
async function Style(e) {
    const dir = [
        "С",
        "ССВ",
        "СВ",
        "ВСВ",
        "В",
        "ВЮВ",
        "ЮВ",
        "ЮЮВ",
        "Ю",
        "ЮЮЗ",
        "ЮЗ",
        "ЗЮЗ",
        "З",
        "ЗСЗ",
        "СЗ",
        "ССЗ",
    ]
    const chartdata = {
        labels: (e.type == "winddirect") ? dir : e.time,
        datasets: []
    }
    if (e.type == "temperature") {
        BackgroundColor(e.values).then(colors => {
            chartdata.datasets = [
                {
                    label: "Температура",
                    backgroundColor: colors,
                    data: e.values
                }
            ]
        })
    }
    if (e.type == "pressure") {
        chartdata.datasets = [
            {
                label: "Давление",
                backgroundColor: "#DDA0DD",
                data: e.values
            }
        ]
    }
    if (e.type == "humidity") {
        chartdata.datasets = [
            {
                label: "Влажность",
                backgroundColor: "#1E90FF",
                data: e.values
            }
        ]
    }
    if (e.type == "winddirect") {
        CountDirections(e.values).then(e => {
            chartdata.datasets = [
                {
                    label: "Направление ветра",
                    backgroundColor: "#20B2AA",
                    data: e
                }
            ]
        })

    }
    if (e.type == "windspeed") {
        chartdata.datasets = [
            {
                label: "Скорость ветра",
                backgroundColor: "#008B8B",
                data: e.values.s
            },
            {
                label: "Порывы ветра",
                backgroundColor: "#00CED1",
                data: e.values.r
            }

        ]
    }
    return chartdata;
}

/* Цвета для температуры */
async function BackgroundColor(e) {
    const colors = [
        '#0277bd',
        '#29b6f6',
        '#b3e5fc',
        '#a5d6a7',
        '#a5d6a7',
        '#fff59d',
        '#fdd835',
        '#ef6c00',
    ];
    const result = [];
    const keys = [-1e6, -20, -10, 0, 10, 20, 30, 1e6];
    const l = keys.length;
    const l2 = e.length;
    for (let j = 0; j < l2; j++) {
        for (let i = 0; i < l; i++) {
            if (e[j] > keys[i] && e[j] <= keys[i + 1]) {
                result.push(colors[i]);
            }
        }
    }
    return result
}

/* Русские названия направлений по градусам */
function DirectionToText(value) {
    if (value >= 0 && value < 11.25)
        return "С"
    if (value >= 11.25 && value < 33.75)
        return "ССВ"
    if (value >= 33.75 && value < 56.25)
        return "СВ"
    if (value >= 56.25 && value < 78.75)
        return "ВСВ"
    if (value >= 78.75 && value < 101.25)
        return "В"
    if (value >= 101.25 && value < 123.75)
        return "ВЮВ"
    if (value >= 123.75 && value < 146.25)
        return "ЮВ"
    if (value >= 146.25 && value < 168.75)
        return "ЮЮВ"
    if (value >= 168.75 && value < 191.25)
        return "Ю"
    if (value >= 191.25 && value < 213.75)
        return "ЮЮЗ"
    if (value >= 213.75 && value < 236.25)
        return "ЮЗ"
    if (value >= 236.25 && value < 258.75)
        return "ЗЮЗ"
    if (value >= 258.75 && value < 281.25)
        return "З"
    if (value >= 281.25 && value < 303.75)
        return "ЗСЗ"
    if (value >= 303.75 && value < 326.25)
        return "СЗ"
    if (value >= 326.25 && value < 348.75)
        return "ССЗ"
    if (value >= 348.75)
        return "С"
}

/* Округление градусов */
function DirectionRound(value) {
    if (value >= 0 && value < 11.25)
        return 0
    if (value >= 11.25 && value < 33.75)
        return 22.5
    if (value >= 33.75 && value < 56.25)
        return 45
    if (value >= 56.25 && value < 78.75)
        return 67.5
    if (value >= 78.75 && value < 101.25)
        return 90
    if (value >= 101.25 && value < 123.75)
        return 112.5
    if (value >= 123.75 && value < 146.25)
        return 135
    if (value >= 146.25 && value < 168.75)
        return 157.5
    if (value >= 168.75 && value < 191.25)
        return 180
    if (value >= 191.25 && value < 213.75)
        return 202.5
    if (value >= 213.75 && value < 236.25)
        return 225
    if (value >= 236.25 && value < 258.75)
        return 247.5
    if (value >= 258.75 && value < 281.25)
        return 270
    if (value >= 281.25 && value < 303.75)
        return 292.5
    if (value >= 303.75 && value < 326.25)
        return 315
    if (value >= 326.25 && value < 348.75)
        return 337.5
    if (value >= 348.75)
        return 0
}

/* Подсчет направлений */
async function CountDirections(e) {
    const text = [
        "С",
        "ССВ",
        "СВ",
        "ВСВ",
        "В",
        "ВЮВ",
        "ЮВ",
        "ЮЮВ",
        "Ю",
        "ЮЮЗ",
        "ЮЗ",
        "ЗЮЗ",
        "З",
        "ЗСЗ",
        "СЗ",
        "ССЗ",
    ];
    const direction = [];
    e.forEach(element => {
        direction.push(DirectionToText(element));
    })
    const counts = direction.reduce(function (acc, el) {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
    }, {});
    const result = [];
    text.forEach(i => {
        (counts[i]) ? result.push(counts[i]) : result.push(0)
    });
    return result
}

/* Получить последний элемент */
async function GetLastItems(e) {
    let result = {};
    let length = "";
    for (let key in e) {
        switch (e[key].type) {
            case 'windspeed':
                length = e[key].values.s.length;
                result[e[key].type] = { s: (e[key].values.s[length - 1] > 0.2) ? e[key].values.s[length - 1] : 0, r: e[key].values.r[length - 1], time: DateToText(e[key].time[length - 1]) }
                break;
            case 'winddirect':
                if (e[key].values[0] != undefined) {
                    length = e[key].values[0].length;
                    result[e[key].type] = [e[key].values[0][length - 1], DirectionToText(e[key].values[0][length - 1])];
                }
                else {
                    result[e[key].type] = -1;
                }
                break;
            case 'winddirectcard':
                length = 0;
                result[e[key].type] = 0;
                break;
            default:
                length = e[key].values.length;
                result[e[key].type] = e[key].values[length - 1];
                break;
        }
    }
    return result;
}

/* Получить Первый элемент */
async function GetFirstItems(e) {
    const result = [];
    for (let key in e) {
        switch (e[key].type) {
            case 'windspeed':
                result.push({ name: e[key].name, value: e[key].values.s[0], time: e[key].time[0] });
                break;
            case 'winddirect':
                result.push({ name: e[key].name, value: DirectionToText(e[key].values[0][0]), time: e[key].time[0] });
                break;
            default:
                result.push({ name: e[key].name, value: e[key].values[0], time: e[key].time[0] });
        }
    }
    return result;
}

/* Преобразование даты в текст для карточки */
function DateToText(e) {
    if (e != undefined) {
        const date = e.split(' ')[0].split('-');
        const hour = e.split(' ')[1].split(':');
        const result = new Date(date[0], date[1] - 1, date[2], hour[0], hour[1], 0).toLocaleString('ru', {
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
        });
        return result
    }
    else {
        return new Date().toLocaleString('ru', {
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
        });
    }
}

function formatDate(date) {
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;

    return yy + '-' + mm + '-' + dd;
}

function formateHour(hour) {
    if (hour < 10) hour = '0' + hour;
    return hour;
}

export { DownloadInfomationWindDirectionForecast, DownloadInfomationWindDirection, DownloadInformationNow, DownloadInformationForecast, DownloadTextForecast, DownloadInformationLast, Style, GetLastItems, GetFirstItems, DateToText, DirectionToText }