//$(document).ready(function () {
console.log("ready!");

var currentDate = moment().format("MMM Do YY");
$("#currentDay").text(currentDate);
console.log(currentDate);
let curDate = moment().clone();
let updateInterval;


var hourArr = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];


function loadPlanner() {
    clearInterval(updateInterval);

    $(".container").html("");
    for (let index = 0; index < hourArr.length; index++)
        $(".container").append(createTable(hourArr[index]));

    updateInterval = setInterval(checkTimeBlocks);
}

function createTable(hour12) {
    let row = createEl("div", "row");
    let eventTable = createEl("div", "time-table");
    eventTable.appendChild(row);
    let colHour = createEl("div", "col-sm-1 col-12 pt-3 hour", hour12);
    row.appendChild(colHour);
    let colText = createEl("textarea", "col-sm-10 col-12 description ", hour12);
    row.appendChild(colText);
    let colSave = createEl("div", "col-sm-1 col-12 saveBtn");
    row.appendChild(colSave);
    let icon = createEl("i", "fas fa-save");
    colSave.append(icon);

    return eventTable;



}

function createEl(tag, cls, hour12) {
    let el = document.createElement(tag);
    if (hour12) {
        let t = getMoment12H(hour12);
        let displayHour = formatAmPm(t);
        if (cls.includes("description")) {
            cls += "" + getTense(t);
            el.textContent = localStorage.getItem(getStoreDatePrefix() + displayHour);
            el.setAttribute("data-hour", displayHour);
        } else {
            el.textContent = displayHour.padEnd(4, "");
        }
    }
    el.setAttribute("class", cls);
    return el;
}


function checkTimeBlocks(hour12) {
    let $descriptions = $(".description");
    $descriptions.each(function (index) {
        let hour12 = $(this).attr("data-hour");
        let t = getMoment12H(hour12);
        let tense = getTense(t);
        if ($(this).hasClass(tense)) {
        } else if (tense === "present") {
            $(this).removeClass("past future");
        } else if (tense === "past") {
            $(this).removeClass("present future");
        } else if (tense === "future") {
            $(this).removeClass("past present");
        } else {
            alert("Unknown Tense");
        }
        $(this).addClass(tense);



    });
}

function getTense(t) {
    let cls;
    let n = moment();
    if (n.isSame(t, "hour") &&
        n.isSame(t, "day") &&
        n.isSame(t, "month") &&
        n.isSame(t, "year")) {
        cls = "present";
    } else if (n.isAfter(t)) {
        cls = "past";
    } else {
        cls = "future";
    }

    return cls;
}

function saveEvent() {
    let $desc = $(this).siblings(".description");
    let text = $desc.val();
    let hour = $desc.attr("data-hour");
    localStorage.setItem(getStoreDatePrefix() + hour, text);
    console.log(text);
}



function getStoreDatePrefix() {
    return curDate.format("YYYYMMDD-");
}
function formatAmPm(m) {
    return m.format("hA");
}
function getMoment12H(hour12) {
    return moment(curDate.format("YYYYMMDD") + hour12, "YYYYMMDD hA");
}
$(function () {
    loadPlanner();
    $(".container").on("click", ".saveBtn", saveEvent);
});

















//});