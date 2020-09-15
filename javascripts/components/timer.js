import React,
{
    useState
} from 'react';

import Logger from './logger';

function Timer() {
    const [tasks, setTasks] = useState([
        "screwing around",
        "sprint work",
        "lunch",
        "break",
        "ops meeting",
        "CR",
    ]);
    const [categories, setCategories] = useState(["work", "CR", "meeting"]);
    const [categoryMap, setCategoryMap] = useState([
        [false, false, false],  //categories for first task
        [true, false, false],   //categories for second task
        [false, false, false],  //etc...
        [false, false, false],
        [true, false, true],
        [true, true, false]
    ]);
    const [currentTask, setCurrentTask] = useState(tasks[0]);
    const [newTask, setNewTask] = useState("");
    const [newCat, setNewCat] = useState("");
    const [currentMap, setCurrentMap] = useState("");

    const relayCurrentMap = () => {
        let newMap = {};
        tasks.forEach((task, i) => {
            newMap[task] = {};
            categories.forEach((cat, j) => {
                newMap[task][cat] = categoryMap[i][j];
            });
        });
        setCurrentMap(newMap);
    }

    const deleteCategory = (i) => {
        
        let newCategoryMap = categoryMap.map((subMap) => {
            return subMap.slice(0, i).concat(subMap.slice(i + 1));
        });
        setCategoryMap(newCategoryMap);
        setCategories(categories.slice(0, i).concat(categories.slice(i + 1)));
    }

    const toggleCategory = (taskI, catI) => {
        let newCategoryMap = categoryMap.map((ele) => {
            return ele;
        });
        newCategoryMap[taskI][catI] = newCategoryMap[taskI][catI] ? false : true;
        setCategoryMap(newCategoryMap);
    };

    const addCategory = () => {
        console.log("want to add category " + newCat);
        if (newCat !== "") {
            setCategories(categories.concat([newCat]));
            let newCategoryMap = categoryMap.map((subMap) => {
                return subMap.concat([false]);
            });
            setCategoryMap(newCategoryMap);
            setNewCat("");
        }
    };

    const addTask = () => {
        if (newTask !== "") {
            setTasks(tasks.concat([newTask]));
            let newCategoryMap = categoryMap.map((ele) => {
                return ele;
            });
            const newRow = newCategoryMap[0].map(() => {
                return false;
            });
            newCategoryMap.push(newRow);
            setCategoryMap(newCategoryMap);
            setNewTask("");
        }
    };

    const deleteTask = (i) => {
        setTasks(tasks.slice(0, i).concat(tasks.slice(i + 1)));
    }

    return (
        <div>
            <br />
            <br />
            <div className="task_list">
                <div className="top_row">
                    <div className="close_X">
                    </div>
                    <div className="task_list_title">
                        Current Task:
                    </div>
                    {
                        categories.map((cat, i) => {
                            return (
                                <div key={i} className="category_boxes">
                                    <div 
                                        className="close_cat_box"
                                        onClick={() => deleteCategory(i)}
                                    >
                                        X
                                    </div> {cat}
                                </div>
                            );
                        })
                    }
                    <div className="category_boxes">
                        <div
                            className="add_cat_plus"
                            onClick={addCategory}
                        >
                            &#43;
                    </div>
                    <input
                        className="new_task_field"
                        type="text"
                        placeholder="new category"
                        value={newCat}
                        onChange={(e) => {
                            setNewCat(e.target.value);
                    }}></input>
                    </div>
                </div>
                {
                    tasks.map((task, i) => {
                        return (
                            <div className="task_list_item" key={i}>
                                <div
                                    className="close_X"
                                    onClick={() => deleteTask(i)}
                                >
                                    {currentTask === task ? "" : "X"}
                                </div>
                                <div
                                    className={currentTask === task ? "task_button current_task_button" : "task_button"}
                                    onClick={() => {
                                        setCurrentTask(task);
                                    }
                                }>
                                    {task}
                                </div>
                                <div className="category_boxes">
                                    {
                                        categoryMap[i].map((hasCat, j) => {
                                            return (
                                                <div key={j} className="category_boxes">
                                                    <div
                                                        className={hasCat ? "category_box active_category_box" : "category_box"}
                                                        type="checkbox"
                                                        onClick={() => { toggleCategory(i, j) }}
                                                    >
                                                        &#10003; 
                                                    </div> {categories[j]}
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        );
                    })
                }
                <div className="task_list_item">
                    <div
                        className="add_task_plus"
                        onClick={addTask}
                    >
                        &#43;
                    </div>
                    <input
                        className="new_task_field"
                        type="text"
                        placeholder="new task"
                        value={newTask}
                        onChange={(e) => {
                            setNewTask(e.target.value);
                        }}></input>
                </div>
            </div>
            <br />
            <button onClick={relayCurrentMap}>
                show summary
            </button>
            <Logger currentTask={currentTask} currentMap={currentMap} />
        </div>
    );
}

export default Timer;