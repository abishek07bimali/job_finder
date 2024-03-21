import Homepage from "./pages/Homepage.jsx";
import Login from "./pages/Loginscreen.jsx";
import Register from "./pages/Registerscreen.jsx";
import Dashboard from "./pages/Admin/AdminDashboard.jsx";
import AddJobs from "./pages/Admin/AddJobs.jsx";
import Blogs from "./pages/Admin/Blogs.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "./components/Navigation.jsx";
import AdminRoute from "./protected/AdminRoute.jsx";
import UserRoute from "./protected/UserRoute.jsx";
import EditJobs from "./pages/Admin/EditJobs.jsx";
import Profile from "./pages/Profile.jsx";
import CVCreator from "./pages/UserCv.jsx";
import VerificationScreen from "./pages/EducationForm.jsx";
import AdditionalScreen from "./pages/EducationForm.jsx";
import JobDetails from "./pages/JobsDetails.jsx";
import CVmaker from "./pages/CVmaker.jsx";
import ApplicationList from "./pages/Admin/ApplicationList.jsx";
import Footer from "./components/Footer.jsx";
import Jobs from "./pages/Jobs.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import Contact from "./pages/Contact.jsx";
import ViewMessage from "./pages/Admin/ViewMessage.jsx";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Router>
      {user && (user.isAdmin|| user.isSuperAdmin) ? null : <NavigationBar/>}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Homepage></Homepage>} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<Register></Register>} />
        <Route path="/forgot-password" element={<ForgetPassword></ForgetPassword>} />
        <Route path="/jobs" element={<Jobs></Jobs>} />
        <Route path="/contact" element={<Contact></Contact>} />
        <Route path="/cvmaker" element={<CVmaker></CVmaker>} />
        <Route path="/jobs/:id" element={<JobDetails></JobDetails>} />

        <Route element={<UserRoute />}>
          <Route path="user/profile" element={<Profile></Profile>} />
          <Route path="user/cv" element={<CVCreator></CVCreator>} />
          {user && user.isVerified ? null : (
            <Route
              path="user/verify"
              element={<AdditionalScreen></AdditionalScreen>}
            />
          )}
        </Route>

        <Route element={<AdminRoute />}>
          {user && user.isSuperAdmin ? <Route path="/admin/dashboard" element={<Dashboard></Dashboard>} />: null}
          {user && user.isSuperAdmin ? <Route path="/admin/message" element={<ViewMessage></ViewMessage>} />: null}
          {/* <Route path='/admin/blogs' element={<Blogs></Blogs>} />   */}
          <Route path="/admin/addjobs" element={<AddJobs></AddJobs>} />
          <Route path="admin/edit/:id" element={<EditJobs></EditJobs>} />
          <Route
            path="admin/application"
            element={<ApplicationList></ApplicationList>}
          />
        </Route>
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
