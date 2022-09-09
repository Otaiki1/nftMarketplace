import { useState} from 'react'
import { ethers } from "ethers"
import { Modal, Button, Form } from 'react-bootstrap';

export default function ModalComp(props){

    const[price, setPrice] = useState();
    const listOnMarketPlace = async() =>  {
        const nft = props.nft;
        const marketplace = props.marketplace
        // get tokenId of  nft 
        const id = props.itemId
        // approve marketplace to spend nft
        await(await nft.setApprovalForAll(marketplace.address, true)).wait()
        // add nft to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString())
        await(await marketplace.createItem(nft.address, id, listingPrice)).wait()
    }
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
                <Button variant="primary" size="lg" onClick={listOnMarketPlace}>
                  List NFT
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}