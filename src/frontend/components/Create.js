import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Row, Form, Button } from 'react-bootstrap';
import LoadSpinner from './Spinner';
import OrderStatus from './OrderStatus';

// import { create as ipfsHttpClient } from 'ipfs-http-client'

import { Buffer } from 'buffer';
const ipfsClient = require('ipfs-http-client');
const projectId = '2DmS9CrnVeU2Caun612yGaPQ2aq';
const projectSecret = '5c06e22765f9f65e1e9ea4af53131e83';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});



const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [name, 	setName] = useState('')
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);  
  const [notCreated, setNotCreated] = useState(false);
  const [fileUploadStatus, setFileUploadStatus] = useState("");

  useEffect(() => {
    if(created) setTimeout(() => setCreated(false), 7000);
    if(notCreated) setTimeout(() => setNotCreated(false), 7000);

  }, [created, notCreated])
  
  
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        setFileUploadStatus('Loading...')
        const result = await client.add(file)
        console.log(result)
        setFileUploadStatus("The File has been uploaded to ipfs succesfully and the hash is "+ result.path)
        setImage(`https://ipfs.io/ipfs/${result.path}`);
        
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {

    setLoading(true);
    if (!image || !name || !description) return
    try{
      const result = await client.add(JSON.stringify({image, name, description}))
      await mintNFT(result);
      setLoading(false);
      setCreated(true);
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
      setLoading(false);
      setNotCreated(true)
    }
  }
  const mintNFT = async (result) => {
    const uri = `https://ipfs.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri)).wait();
  }
  return (
    !loading ? (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <p>{fileUploadStatus}</p>
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Mint NFT!
                </Button>
              </div>
            </Row>
            {created ? <OrderStatus variant="success" info="Successfully Created NFT!"/> : ''}
            {notCreated ? <OrderStatus variant="danger" info="Failed to create NFT"/> : ''}

          </div>
        </main>
      </div>
    </div>
    ) : (
      <LoadSpinner spinnerInfo="Awaiting Transaction"/>
    )
  );
}

export default Create