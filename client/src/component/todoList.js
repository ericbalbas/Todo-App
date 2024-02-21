import React, { useState, useEffect, useReducer, useMemo } from "react";
import { format, parse } from "date-fns";
import enUS from "date-fns/locale/en-US"; 
import { Icon } from "@iconify/react";
import { TodoItem, AddNewTodo } from "./todoItem";


const SET_TODAY_TODOS = "SET_TODAY_TODOS";
const SET_TOMORROW_TODOS = "SET_TOMORROW_TODOS";
const SET_PENDINGS = "SET_PENDINGS";
const COMPLETED_TODOS = "COMPLETED_TODOS";

// use Reducer function 
const todoReducer = (state, action) => {
  switch (action.type){
    case SET_TODAY_TODOS: 
      return {
        ...state,
        todayTodos: action.payload,
      };
    case SET_TOMORROW_TODOS: 
      return{
        ...state,
        tomorrowTodos : action.payload,
      }; 

    case SET_PENDINGS: 
      return {
        ...state,
        pendingTodos : action.payload
      }
     case COMPLETED_TODOS: 
      return {
        ...state,
        completedTodos: action.payload
      }
    default:
       return state;

  }
}

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [state, dispatch] = useReducer(todoReducer, {
    todayTodos : [],
    tomorrowTodos : [],
    pendingTodos : [],
    completedTodos : [],
  })

  const today = new Date();
  const formattedDate = format(today, 'd MMM, yyyy EEE, HH:mm:ss', { locale: enUS });
  const dateToday = format(today, 'd MMM, yyyy EEE', { locale: enUS });
  today.setHours(0, 0, 0, 0);

  const memoizedData = useMemo(
    () => ({
      todayTodos: state.todayTodos,
      tomorrowTodos: state.tomorrowTodos,
      pendingTodos: state.pendingTodos,
      completedTodos: state.completedTodos,
    }),
    [state]
  );

  const getTodoData = async () => {
    const data = await fetch("/api/todos");
    const response = await data.json();

    setTodos(response);

    //Data today
    const todayData = response.filter(todo => todo.dateAdded.includes(dateToday) && !todo.status);
    dispatch({ type: SET_TODAY_TODOS, dateKey: "todayTodos", payload: todayData });

    // Tomorrow todo's
    // Get the date today and add plus 1 in cur date
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateTomorrow = format(tomorrow, "d MMM, yyyy EEE", { locale: enUS });
    //Filter the current state for tomorrow todos and assign to its dispatch  
    const tomorrowData = response.filter(todo => { return todo.dateAdded.includes(dateTomorrow) && !todo.status;});
    dispatch({type : SET_TOMORROW_TODOS, payload : tomorrowData})

    //Pending days that are less than today
    const pendingData = response.filter(todo => {
      // Convert back to locale format
      const todoDate = parse(
        todo.dateAdded,
        "d MMM, yyyy EEE, HH:mm:ss",
        new Date()
      );
      return (
        !todo.status &&
        !todo.dateAdded.includes(dateToday) &&
        new Date(todoDate) < today
      );     
    });
    dispatch({type : SET_PENDINGS, payload : pendingData})

    // Completed the task, get the todo that has true status 
    const completedTodo = response.filter(todo => {
      return todo.status 
    })
    dispatch({ type: COMPLETED_TODOS, payload: completedTodo });


  };

  useEffect(() => {
    getTodoData();
  }, [state.todayTodos, state.tomorrowTodos, state.pendingTodos, state.completedTodos]);

  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = async (e) => {
    
    e.preventDefault();

    if(newTodo.length > 3){
   
        const data = {
          method: "POST",
          body: JSON.stringify({
            todo: newTodo,
            dateAdded: formattedDate,
            dueDate: today.toISOString(),
          }),
          headers: {
            "Content-type": "application/json",
          },
        };
        const res = await fetch("/api/todos", data);
        const newTodos = await res.json();

        setNewTodo("");
        setTodos([...todos, newTodos]);
        // dispatch({
        //   type: SET_TODAY_TODOS,
        //   dateKey: "todayTodos",
        //   payload: newTodos,
        // });

    
    }  
  };

  const changeStatus = async ( e, _todoId, todoStatus ) => {
    e.preventDefault()
     const data = {
       method: "PUT",
       body: JSON.stringify({ status: Boolean(todoStatus) }),
       headers: {
         "Content-type": "application/json",
       },
     };
    const res = await fetch(`/api/todos/${_todoId}`, data);
    const response = await res.json();
    if(response.acknowledged){
      setTodos(currentTodos => {
        return currentTodos.map((currentTodo) => {
          if(currentTodo._id === _todoId){
            return {...currentTodo, status: !currentTodo.status};
          }
          return currentTodo;
        })
      })
    }  
  }

  const handleDelete = async (e, todoId) => {
    e.preventDefault();
    const data = {
      method: "DELETE",
    };
    const res = await fetch(`/api/todos/${todoId}`, data);
    const response = await res.json();
    if(response.acknowledged){
      setTodos(currentTodos => {
        return currentTodos
        .filter(currentTodo => currentTodo._id !== todoId);

        })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full md:w-[70%] p-6 bg-white rounded-md shadow-md">
        <div className="flex items-center justify-start py-2 rounded">
          <Icon
            icon="mdi:todo-auto"
            className="font-bold text-5xl rounded-full bg-green-400  py-2 text-gray-100"
          />
          <h1 className="text-3xl font-bold ml-2 text-blue-500">TO-DO</h1>
        </div>

        {/* <hr className="my-6 border-t-2 border-gray-300" /> */}
        <TodoItem
          title={`Today (${memoizedData.todayTodos.length})`}
          mssg={"No todos today, add some."}
          todos={memoizedData.todayTodos}
          changeStatus={changeStatus}
          handleDelete={handleDelete}
          dateToday={dateToday}
        />

        <AddNewTodo handleAddTodo={handleAddTodo} handleInputChange={handleInputChange} newTodo={newTodo} />

        <TodoItem
          title={`Tomorrow (${memoizedData.tomorrowTodos.length})`}
          mssg={"No todos for tomorrow"}
          todos={memoizedData.tomorrowTodos}
          changeStatus={changeStatus}
          handleDelete={handleDelete}
          dateToday={dateToday}
        />

        <TodoItem
          title={`Pending (${memoizedData.pendingTodos.length})`}
          mssg={"Good job, you are up to date"}
          todos={memoizedData.pendingTodos}
          changeStatus={changeStatus}
          handleDelete={handleDelete}
          dateToday={dateToday}
        />

        <TodoItem
          title={`Completed (${memoizedData.completedTodos.length}/${todos.length})`}
          mssg={"No completed task yet."}
          todos={memoizedData.completedTodos}
          changeStatus={changeStatus}
          handleDelete={handleDelete}
          dateToday={dateToday}
        />
      </div>
    </div>
  );
};

export default TodoList;
