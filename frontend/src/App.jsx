import { BrowserRouter, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "./components/NavBar/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

const BooksAdmin    = lazy(() => import("./pages/BookAdmin/BooksAdmin"));
const Add           = lazy(() => import("./components/AddBook/Add"));
const Update        = lazy(() => import("./components/Update/Update"));
const Home          = lazy(() => import("./pages/Home/Home"));
const BooksCatalogue= lazy(() => import("./pages/BookCatalogue/BookCatalogue"));
const Book          = lazy(() => import("./pages/BookDetails/Book"));
const Cart          = lazy(() => import("./pages/Cart/Cart"));
const Contact       = lazy(() => import("./pages/Contact/Contact"));
const Login         = lazy(() => import("./pages/Login/Login"));
const Register      = lazy(() => import("./pages/Register/Register"));
const UsersAdmin    = lazy(() => import("./pages/UsersAdmin/UsersAdmin"));
const MessagesAdmin = lazy(() => import("./pages/MessagesAdmin/MessagesAdmin"));
const UpdateUser    = lazy(() => import("./components/UpdateUser/UpdateUser"));
const NotFound      = lazy(() => import("./pages/NotFound/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div>
      <Suspense fallback={<div className="text-center mt-5">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booksAdmin" element={
            <ProtectedRoute requiredRole="admin"><BooksAdmin /></ProtectedRoute>
          }>
            <Route path="addBook"           element={<Add />} />
            <Route path="updateBook/:isbn"  element={<Update />} />
          </Route>
          <Route path="/catalogue" element={<BooksCatalogue/>}/>
          <Route
            path="/catalogue/:isbn"
            element={<Book />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/usersAdmin" element={
            <ProtectedRoute requiredRole="admin" requiredPermission="superadmin"><UsersAdmin/></ProtectedRoute>
          }/>
          <Route path="/usersAdmin/updateUser/:id" element={
            <ProtectedRoute requiredRole="admin" requiredPermission="superadmin"><UpdateUser /></ProtectedRoute>
          } />
          <Route path="/messagesAdmin" element={
            <ProtectedRoute requiredRole="admin"><MessagesAdmin /></ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App
