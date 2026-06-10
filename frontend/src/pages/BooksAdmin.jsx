import './BooksAdmin.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { Button } from 'react-bootstrap'

const BooksAdmin = () => {
    const [books, setBooks] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get("http://localhost:8800/bookadmin")
                setBooks(res.data)
            } catch(err) {
                console.log(err)
            }
        }
        fetchAllBooks()
    }, [])

    return (
        <div className="Books">
            <h1>Books</h1>
            <div className="book-grid">
                {books.map(book => (
                    <div className='book' key={book.isbn}>
                        <img 
                            src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`} 
                            alt={book.title}
                        />
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                        <p>$ {book.price}</p>
                    </div>
                ))}
            </div>
            <Button className="add-btn" onClick={() => navigate('/booksAdmin/addBook')}>
                +
            </Button>
        </div>
    )
}

export default BooksAdmin