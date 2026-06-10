import {BrowserRouter, Routes, Route} from "react-router";
import BooksAdmin from "./pages/BooksAdmin";
import Add from "./pages/Add";
import 'bootstrap/dist/css/bootstrap.min.css'


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
        </Routes>
      </BrowserRouter>
  )
}

export default App
