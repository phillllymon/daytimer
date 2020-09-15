import React,
{
    useState,
    useEffect
} from 'react';

import {
    getTimeDiff,
    getTimeTotal,
    secondsToString
} from '../utils/helpers';

function Logger(props) {
    const clock = new Date();
    const getTime = () => {
        return clock.getHours() + ":" + clock.getMinutes() + ":" + clock.getSeconds();
    };

    //log is an array: [[time1, task1], [time2, task2]]
    const [log, setLog] = useState([]);
    const [taskTimes, setTaskTimes] = useState({});
    const [catTimes, setCatTimes] = useState({});
    const [totalTime, setTotalTime] = useState(0);
    

    useEffect((() => {
        setLog(log.concat([[getTime(), props.currentTask]]));
    }), [props.currentTask]);
    
    useEffect(() => {
        if (props.currentMap !== "") {
            let total = 0;
            let tasks = Object.keys(props.currentMap);
            let cats = Object.keys(props.currentMap[tasks[0]]);
            let taskSummary = {};
            let catSummary = {};
            tasks.forEach((task) => {
                taskSummary[task] = 0;
            });
            cats.forEach((cat) => {
                catSummary[cat] = 0;
            });
            for (let i = 0; i < log.length; i++) {
                let startTime = log[i][0];
                let endTime = getTime();
                if (i < log.length - 1) {
                    endTime = log[i + 1][0];
                }
                let thisTime = getTimeDiff(startTime, endTime);
                total += thisTime;
                let task = log[i][1];
                taskSummary[task] += thisTime;
                cats.forEach((cat) => {
                    if (props.currentMap[task][cat]) {
                        catSummary[cat] += thisTime;
                    }
                });
            }
            setTotalTime(total);
            setTaskTimes(taskSummary);
            setCatTimes(catSummary);
        }
    }, [props.currentMap]);

    return (
        <div>
            <br />
            {
                log.map((task, i) => {
                    return (
                        <div key={i}>
                            {task[0] + " : " + task[1]}
                        </div>
                    );
                })
            }
            <br />
            Total time spent: {secondsToString(totalTime)}
            <br />
            {
                Object.keys(taskTimes).map((task, i) => {
                    return (
                        <div key={i}>
                            {task} - {secondsToString(taskTimes[task])} ({parseInt((100 * taskTimes[task])/totalTime)}%)
                        </div>
                    );
                })
            }
            <br />
            Time per category:
            {
                Object.keys(catTimes).map((cat, i) => {
                    return (
                        <div key={i}>
                            {cat} - {secondsToString(catTimes[cat])} ({parseInt((100 * catTimes[cat]) / totalTime)}%)
                        </div>
                    );
                })
            }
        </div>
    );
}

export default Logger;