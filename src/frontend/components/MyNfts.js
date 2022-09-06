import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import ModalComp from './ModalComp';

// function renderSoldItems(items) {
//   return (
//     <>
//       <h2>Sold</h2>
//       <Row xs={1} md={2} lg={4} className="g-4 py-3">
//         {items.map((item, idx) => (
//           <Col key={idx} className="overflow-hidden">
//             <Card>
//               <Card.Img variant="top" src={item.image} />
//               <Card.Footer>
//                 For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved {ethers.utils.formatEther(item.price)} ETH
//               </Card.Footer>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </>
//   )
// }

export default function MyNfts({ nft, account }) {
  const [loading, setLoading] = useState(true)
  const[userNfts, setUserNfts] = useState([]);
  const[showModal, setShowModal] = useState(false)
  
  const handleClose = () => setShowModal(false);

  const loadListedItems = async () => {
    // Load all ids of the items that the user minted
    const idList = await nft.getNftList(account)
    const mintedIds = idList.map(id => ethers.utils.arrayify(id._hex)[0])
    console.log(mintedIds)
    
    let nftList = []

    for (let index=0; index < mintedIds.length; index++){
        let id = mintedIds[index]
        const uri = await nft.tokenURI(id);
        console.log("URI IS _______", uri)
         // use uri to fetch the nft metadata stored on ipfs 
         const response = await fetch(uri);
         const metadata = await response.json();
        console.log("metadata is ___----___", metadata)
        let item = {
                name: metadata.name,
                description: metadata.description,
                image: metadata.image
              }
        nftList.push(item);
    }
    setUserNfts(nftList)
    setLoading(false)
  }
  useEffect(() => {
    loadListedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {userNfts.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>Minted List</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {userNfts.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>
                          {item.description}
                        </Card.Text>
                  </Card.Body>
                  <Card.Footer><Button variant="primary" onClick={() => setShowModal(true)}>List on Marketplace </Button></Card.Footer>
                </Card>
              </Col>
            ))}
            {showModal ? <ModalComp show="showModal" onHide={handleClose}/> :""}
          </Row>
            {/* {soldItems.length > 0 && renderSoldItems(soldItems)} */}
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No Minted Nfts</h2>
          </main>
        )}
    </div>
  );
}