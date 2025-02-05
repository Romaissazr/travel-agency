import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './Pages/Home.jsx';
import TourDetails from "./Pages/TourDetails.jsx";
import App from "./App.jsx";
import Destination from "./Pages/Destination.jsx";
import CityListing from "./Pages/CityListing.jsx";
import SearchResults from "./Components/SearchResults.jsx";
import Authentification from "./Pages/Authentification.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import OtpChangePassword from "./Components/OtpChangePassword.jsx";
import Otp from "./Components/Otp.jsx";
import ChangePassword from "./Components/ChangePassword.jsx";
import EmailSearch from "./Components/EmailSearch.jsx";
import Profile from "./Pages/Profile.jsx";
import History from "./Components/History.jsx";
import PersonalInformation from "./Components/PersonalInformation.jsx";
import ConfirmBooking from "./Pages/ConfirmBooking.jsx";
import NewsletterSubscription from "./Components/NewsletterSubscription.jsx";
import Admin from "./Admin/Admin.jsx";
import AddTour from "./Admin/AddTour.jsx";
import EditTour from "./Admin/EditTour.jsx";
import ToursDashboard from "./Admin/ToursDashboard.jsx";
import EditCity from "./Admin/EditCity.jsx";
import AddCity from "./Admin/AddCity.jsx";
import CitiesDashboard from "./Admin/CitiesDashboard.jsx";
import Customers from "./Admin/Customers.jsx";
import UpdateBooking from "./Admin/UpdateBooking.jsx";
import Booking from "./Admin/Booking.jsx";
import Dashboard from "./Admin/Dashboard.jsx";
import Payment from "./Components/Payment.jsx";
import GalleryDashboard from "./Admin/GalleryDashboard.jsx";
import AddGallery from "./Admin/AddGallery.jsx";
import EditGallery from "./Admin/EditGallery.jsx";
import GalleryPage from "./Pages/GalleryPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "search-results",  
    element: <SearchResults />,
  },

  {
    path: "/tour",
    element: <App />,
    children: [
      {
        path: "",  
        element: <TourDetails />,
      },{
        path:"gallery",
        element:<GalleryPage />

      },
      {
        path: "destination",
        element: <Destination />,
      },{
        path: "city-list",
        element: <CityListing />,
      },
      {
        path: "confirm",
        element: <ConfirmBooking />,
      },  {
        path:"payment",
        element:<Payment />
      },
      {
        path: "profile",
        element: <Profile />,
        children: [
          {
            path: "",
            element: <PersonalInformation />,
          },
          {
            path: "history",
            element: <History />,
          },{
            path:"Newsletter",
            element:<NewsletterSubscription />
          },
        ],
      },
     
    ],

  },
  {
    path:"auth",
    element:<Authentification/>,
    children:[
      {
        path: "", // Corrected path
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "otp-password",
        element: <OtpChangePassword />,
      },
      {
        path: "otp",
        element: <Otp />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        path: "email",
        element: <EmailSearch />,
      },
     
    ]},
    {
      path: "/admin",
      element: <Admin />, 
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "bookings",
          element: <Booking />,
        },
        {
          path: "bookings/update", 
          element: <UpdateBooking />,
        },
        {
          path: "customers",
          element: <Customers />,
        },
        {
          path: "cities",
          element: <CitiesDashboard />,
        },
        {
          path: "add-city",
          element: <AddCity />,
        },
        {
          path: "edit-city",
          element: <EditCity />,
        },
        {
          path: "tours",
          element: <ToursDashboard />,
        },
        {
          path: "edit-tour",
          element: <EditTour />,
        },
        {
          path: "add-tour",
          element: <AddTour />,
        },{
          path: "gallery-dashboard",
          element: <GalleryDashboard />,
        },
        {
          path: "edit-gallery",
          element: <EditGallery />,
        },
        {
          path: "add-gallery",
          element: <AddGallery />,
        },
      ],
    }, 
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);