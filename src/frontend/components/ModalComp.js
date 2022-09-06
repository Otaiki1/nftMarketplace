import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Modal, Button, Form } from 'react-bootstrap';

export default function ModalComp(props){

    const[price, setPrice] = useState();

    return(
        <Modal {...props}size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    List On Marketplace
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Enter Price That you want to list the item as</p>
                <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
                <Button variant="primary" size="lg">
                  List NFT
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}