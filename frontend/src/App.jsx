import { BrowserRouter, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "./components/Navbar/Navbar";

const BooksAdmin    = lazy(() => import("./pages/BookAdmin/BooksAdmin"));
const Add           = lazy(() => import("./components/AddBook/Add"));
const Update        = lazy(() => import("./components/Update/Update"));
const BooksCatalogue= lazy(() => import("./pages/BookCatalogue/BookCatalogue"));
const Book          = lazy(() => import("./pages/BookDetails/Book"));
const Register      = lazy(() => import("./pages/Register/Register"));
const UsersAdmin    = lazy(() => import("./pages/UsersAdmin/UsersAdmin"));
const UpdateUser    = lazy(() => import("./components/UpdateUser/UpdateUser"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div>
      <Suspense fallback={<div className="text-center mt-5">Loading…</div>}>
        <Routes>
          <Route path="/booksAdmin" element={<BooksAdmin/>}/>
          <Route path="/booksAdmin" element={<BooksAdmin />}>
            <Route path="addBook"           element={<Add />} />
            <Route path="updateBook/:isbn"  element={<Update />} />
          </Route>
          <Route path="/catalogue" element={<BooksCatalogue/>}/>
          <Route 
            path="/catalogue/:isbn" 
            element={<Book />} 
          />
          <Route path="/register" element={<Register/>}/>
          <Route path="/usersAdmin" element={<UsersAdmin/>}/>
          <Route path="/usersAdmin/updateUser/:id" element={<UpdateUser />} />
        </Routes>
      </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App
