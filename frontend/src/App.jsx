import {BrowserRouter, Routes, Route} from "react-router";
import BooksAdmin from "./pages/BooksAdmin";
import Add from "./pages/Add";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Update from "./pages/Update";
import BooksCatalogue from "./pages/BookCatalogue";
import Book from "./pages/Book";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/booksAdmin" element={<BooksAdmin/>}/>
          <Route 
            path="/booksAdmin/addBook" 
            element={
              <>
                <BooksAdmin />
                <Add />
              </>
            } 
        />
        <Route 
          path="/booksAdmin/updateBook/:isbn" 
          element={
            <>
            <BooksAdmin />
            <Update />
            </>
          } 
        />
        <Route path="/catalogue" element={<BooksCatalogue/>}/>
        <Route 
          path="/catalogue/:isbn" 
          element={<Book />} 
        />
        </Routes>
      </BrowserRouter>
  )
}

export default App
