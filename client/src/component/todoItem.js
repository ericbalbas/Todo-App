import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, usePresence} from "framer-motion";
import { Link } from "react-router-dom"
import { Icon } from "@iconify/react";

export const AddNewTodo = ({handleAddTodo, newTodo, handleInputChange}) => {

  return(
    <div >
    <form id="form" onSubmit={handleAddTodo}>
      <div className="mt-6">
        <div className="flex mt-2">
          <input
            type="text"
            value={newTodo}
            onChange={handleInputChange}
            className="rounded-l-md p-2 flex-grow hover:shadow-md hover:bg-gray-100 focus:shadow-md"
            id="form__add"
            placeholder="+ new todo..."
          />
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-[1.25rem] text-white px-4 py-2 rounded-r-md"
          >
            +
          </button>
        </div>
      </div>
    </form>
    </div>
  )
}

export const TodoItem = ({
  title,
  mssg,
  todos,
  changeStatus,
  handleDelete,
  dateToday,
}) => {
  
    const [isPresent, safeToRemove] = usePresence();
    useEffect(() => {
      !isPresent && setTimeout(safeToRemove, 4000);
    }, [isPresent, safeToRemove]);


  return (
    <div className="collapse collapse-plus hover:shadow-md">
      <input type="checkbox" className="bg-gray-300 text-1xl" />
      <div className="mt-3 collapse-title">
        <label className="text-2xl text-gray-500">{title}</label>
      </div>
      <hr className="mt-3" />
      <div className="collapse-content">
        <ul
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            animate: {
              transition: { staggerChildren: 0.1 },
            },
            exit: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="mt-3 overflow-y-auto max-h-[300px]"
        >
          {todos.length === 0 && (
            <p className="text-gray-500 mt-6 text-center">{mssg}</p>
          )}

          <AnimatePresence mode={"popLayout"}>
            {todos.map((todo) => (
              <Link key={todo._id} to={`/todo/${todo._id}?`}>
                <motion.li
                  key={todo._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring" }}
                  className={`flex items-center justify-between py-2 mb-1 rounded hover:bg-gray-100 hover:shadow-md
                ${
                  todo.status
                    ? "line-through text-green-500"
                    : "border-l-4 border-blue-500"
                }
                `}
                >
                  <div className="flex items-center justify-start">
                    <input
                      type="checkbox"
                      checked={todo.status}
                      onChange={(e) => changeStatus(e, todo._id, todo.status)}
                      className="ml-2 h-4 w-4 border-blue-500 bg-blue-500 rounded-md"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-lg mx-3 text-gray-500">
                        {`${todo.todo}`}
                        <p className="text-[1rem] text-gray-500">
                          {todo.dateAdded && todo.dateAdded.includes(dateToday)
                            ? `Today`
                            : todo.dateAdded}
                        </p>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={(e) => handleDelete(e, todo._id)}
                      className="ml-2 text-l hover:bg-gray-300 p-2  text-red-700 rounded-full"
                    >
                      <Icon
                        className="text-red-400 text-2xl h-8 w-8"
                        icon="typcn:delete"
                      />
                    </button>
                  </div>
                </motion.li>
              </Link>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default TodoItem;
