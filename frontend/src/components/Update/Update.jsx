import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, Modal, Form } from 'react-bootstrap'
import { useOutletContext } from 'react-router'
import apiClient from '../../services/apiClient'

function Update() {
    const { onSuccess } = useOutletContext()
    const navigate = useNavigate()
    const { isbn } = useParams()
    const handleClose = () => navigate('/booksAdmin')

    const [book, setBook] = useState({})
    const [errorMsg, setErrorMsg] = useState('')

    const titleRef = useRef()
    const authorRef = useRef()
    const descriptionRef = useRef()
    const publisherRef = useRef()
    const priceRef = useRef()
    const stockRef = useRef()
    const genreIDRef = useRef()

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await apiClient.get(`/bookadmin/${isbn}`)
                setBook(res.data)
            } catch(err) {
                console.log(err)
            }
        }
        fetchBook()
    }, [isbn])

    const handleSubmit = async () => {
        setErrorMsg('')
        try {
            await apiClient.put(`/bookadmin/${isbn}`, {
                title: titleRef.current.value,
                author: authorRef.current.value,
                description: descriptionRef.current.value,
                publisher: publisherRef.current.value,
                price: priceRef.current.value,
                stock: stockRef.current.value,
                genreID: genreIDRef.current.value,
            })
            onSuccess?.('Book updated successfully.')   // notify BooksAdmin
            handleClose()
        } catch(err) {
            setErrorMsg('Failed to update book. Please try again.')
            console.log(err);
        }
    }

    return (
        <Modal show={true} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Update Book</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errorMsg && (
                    <div className="alert-error">
                        <i className="bi bi-exclamation-circle me-2"></i>{errorMsg}
                    </div>
                )}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>ISBN</Form.Label>
                        <Form.Control value={book.isbn || ''} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={titleRef} defaultValue={book.title} key={book.title} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Author</Form.Label>
                        <Form.Control ref={authorRef} defaultValue={book.author} key={book.author} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control ref={descriptionRef} as="textarea" defaultValue={book.description} key={book.description} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Publisher</Form.Label>
                        <Form.Control ref={publisherRef} defaultValue={book.publisher} key={book.publisher} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control ref={priceRef} type="number" defaultValue={book.price} key={book.price} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control ref={stockRef} type="number" defaultValue={book.stock} key={book.stock} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Genre ID</Form.Label>
                        <Form.Control ref={genreIDRef} type="number" defaultValue={book.genreID} key={book.genreID} />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Update Book</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Update