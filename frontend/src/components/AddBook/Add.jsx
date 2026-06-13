import { useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'
import { Button, Modal, Form } from 'react-bootstrap'
import apiClient from '../../services/apiClient'

function Add() {
    const navigate = useNavigate()
    const handleClose = () => navigate('/booksAdmin')
    const { onSuccess } = useOutletContext()
    const [errorMsg, setErrorMsg] = useState('')

    const isbnRef = useRef()
    const titleRef = useRef()
    const authorRef = useRef()
    const descriptionRef = useRef()
    const publisherRef = useRef()
    const priceRef = useRef()
    const stockRef = useRef()
    const genreIDRef = useRef()

    const handleSubmit = async () => {
        setErrorMsg('')
        try {
            await apiClient.post("/bookadmin", {
                isbn: isbnRef.current.value,
                title: titleRef.current.value,
                author: authorRef.current.value,
                description: descriptionRef.current.value,
                publisher: publisherRef.current.value,
                price: priceRef.current.value,
                stock: stockRef.current.value,
                genreID: genreIDRef.current.value,
            })
            onSuccess?.('Book added successfully.')
            handleClose()
        } catch(err) {
            setErrorMsg('Failed to add book. Please try again.')
            console.log(err)
        }
    }

    return (
        <Modal show={true} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add New Book</Modal.Title>
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
                        <Form.Control ref={isbnRef} placeholder="Enter ISBN" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={titleRef} placeholder="Enter title" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Author</Form.Label>
                        <Form.Control ref={authorRef} placeholder="Enter author" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control ref={descriptionRef} as="textarea" placeholder="Enter description" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Publisher</Form.Label>
                        <Form.Control ref={publisherRef} placeholder="Enter publisher" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control ref={priceRef} type="number" placeholder="Enter price" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control ref={stockRef} type="number" placeholder="Enter stock" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Genre ID</Form.Label>
                        <Form.Control ref={genreIDRef} type="number" placeholder="Enter genre ID" />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Add Book</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Add