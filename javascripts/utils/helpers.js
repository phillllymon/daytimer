//returns time difference in number of seconds
export function getTimeDiff(start, finish) {
    let startArr = start.split(":");
    let startSeconds = parseInt(startArr[2]);
    let startMinutes = parseInt(startArr[1]);
    let startHours = parseInt(startArr[0]);
    let startTotal = startSeconds + (60 * startMinutes) + (3600 * startHours);
    let finishArr = finish.split(":");
    let finishSeconds = parseInt(finishArr[2]);
    let finishMinutes = parseInt(finishArr[1]);
    let finishHours = parseInt(finishArr[0]);
    let finishTotal = finishSeconds + (60 * finishMinutes) + (3600 * finishHours);
    return finishTotal - startTotal;
};

//returns total number of seconds
export function getTimeTotal(times) {   //times should be an array of strings in "13:45:23" format
    let answer = 0;
    times.forEach((time) => {
        let arr = time.split(":");
        answer += parseInt(arr[2])
        answer += (60 * parseInt(arr[1]));
        answer += (3600 * parseInt(arr[0]));
    });
    return answer;
}

//returns "1:01:1" for input of 3661
export function secondsToString(seconds) {
    let timeLeft = seconds;
    let hours = Math.floor(timeLeft/3600);
    if (hours < 10) {
        hours = "0" + hours;
    }
    timeLeft %= 3600;
    let minutes = Math.floor(timeLeft/60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (timeLeft < 10) {
        timeLeft = "0" + timeLeft;
    }
    return "" + hours + ":" + minutes + ":" + timeLeft;
}
