import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingScreen from "./Loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TodoView = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [dueDate, setDueDate] = useState(today);

  

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`/api/todos/${id}`);
        const data = await response.json();
        setTodo(data);
      } catch (error) {
        console.error("Error fetching todo:", error);
      }
    };

    fetchTodo();
  }, [id]);

   const handleDuedate = async (date) => {
     setDueDate(date);
     if (date) {
      const updatedTodo = { ...todo, dueDate: date.toISOString() };
      const data = {
        method: "PUT",
        body: JSON.stringify(updatedTodo),
        headers: {
          "Content-type": "application/json",
        },
      };
       try {
         const res = await fetch(`/api/todos/${id}`, data);
         const response = await res.json();

         if (response.acknowledged) {
           setTodo((prevTodo) => {
             const updatedTodo = { ...prevTodo, dueDate: date.toISOString() };
             console.log(updatedTodo);
             return updatedTodo;
           });
        //    setDueDate(data.dueDate ? new Date(data.dueDate) : today);
         }
       } catch (error) {
         console.error("Error updating due date:", error);
       }
     }
   }; 


  return (
    <div className="flex justify-center items-center h-screen">
      {todo ? (
        <div className="bg-white p-8 rounded shadow-md w-[80%]">
          <h1 className="text-3xl font-bold mb-4">Todo Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Title</h2>
              <p>{todo.todo}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Status</h2>
              <p>{todo.status ? "Completed" : "Incomplete"}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Date Added</h2>
              <p>{todo.dateAdded}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Due Date</h2>
              <DatePicker
                selected={todo.dueDate}
                onChange={(date) => handleDuedate(date)}
                dateFormat="MMMM d, yyyy"
                className="border p-2 w-full"
              />
            </div>
            <div colSpan={2}>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p>{todo.description || "No description available."}</p>
            </div>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
};

export default TodoView;
