import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Dashboard, HomeLayout, Landing, Logout } from "./pages";
import BasicInformation from './pages/BasicInformation';
import ResidentList from './pages/ResidentList';
import MealManagement from './pages/MealManagement';
import HealthManagement from './pages/HealthManagement';
import Messages from './pages/Messages';
import Activities from "./pages/Activities";
import AddNurse from './pages/AddUser';

import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "basicInformation",
        element: <BasicInformation />,
      },
      {
        path: "activities",
        element: <Activities />,
      },
      {
        path: 'healthManagement',
        element: <HealthManagement />,
      },
      {
        path: "residentList",
        element: <ResidentList />,
      },
      {
        path: 'mealManagement',
        element: <MealManagement />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "messages",
        element: <Messages />,
      },
      {
        path: "addUser",
        element: <AddNurse />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position='top-center' />
    </>
  );
}

export default App;
