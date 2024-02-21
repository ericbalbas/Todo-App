import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorDisplay from './component/ErrorMessage';
import TodoView from './component/todoView';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path : '/',
    element : <App />,
    errorElement : <ErrorDisplay errorMessage={'404 NOT FOUND'}/>
  },
  {
    path : '/todo/:id',
    element :<TodoView/>,
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
