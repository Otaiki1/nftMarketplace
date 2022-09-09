import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button} from 'react-bootstrap'
import OrderStatus from './OrderStatus';

export default function Home({marketplace, nft}){
    const[items, setItems] = useState([]);
    const[loading, setLoading] = useState(true);
    const[bought, setBought] = useState(false);
    const[failed, setFailed] = useState(false);



    const loadMarketplaceItems = async() => {
        const itemCount = await marketplace.itemCount();
        let items = [];

        for(let i=1; i<=itemCount; i++){

            const item = await marketplace.items(i);
            if(!item.sold){
                //get URI url from contract
                const uri = await nft.tokenURI(item.tokenId);
                //use the uri to fetch the nft metadata stored on ipfs
                const response = await fetch(uri);
                const metadata = await response.json()
                //get the total price of item (price + fee)
                const totalPrice = await marketplace.getTotalPrice(item.itemId)
                //add the item to Items Array
                items.push({ totalPrice,
                    itemId: item.itemId,
                    seller: item.seller,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                })
            }
        }
        setItems(items);
        setLoading(false)
    }

    const buyMarketItem = async(item) =>{
        try{
          let sellerAddress = item.seller;
          let itemArray = await nft.getNftList(sellerAddress);
          const itemIds = itemArray.map(id => ethers.utils.arrayify(id._hex)[0]);
          let index = itemIds.indexOf(item.itemId);
  
          await (await marketplace.purchaseItem(item.itemId, {value: item.totalPrice})).wait();
          await (await nft.updateNftList(sellerAddress, index, item.itemId)).wait();
          setBought(true)
          //this calls the function and loads market items whenever the user buys items so it removes from list
          loadMarketplaceItems();
        } catch(err){
          setFailed(true);
          loadMarketplaceItems();
        }
    }
    useEffect(() => {
        loadMarketplaceItems();
    }, [bought, failed])

    useEffect(() => {
      if(bought) setTimeout(() => setBought(false), 10000);
      if(failed) setTimeout(() => setFailed(false), 10000);

    }, [bought, failed])
    

    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
          <h2>Loading...</h2>
        </main>
      )
      return (
        <div className="flex justify-center">
          {items.length > 0 ?
            <div className="px-5 container">
              <Row xs={1} md={2} lg={4} className="g-4 py-5">
                {items.map((item, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card>
                      <Card.Img variant="top" src={item.image} />
                      <Card.Body color="secondary">
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>
                          {item.description}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        <div className='d-grid'>
                          <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                            Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                          </Button>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
              {bought ? <OrderStatus variant="success" info="Purchase Successful!!"/> : ''} 
              {failed ? <OrderStatus variant="danger" info="Purchase failed!!"/> : ''} 
            </div>
            : (
              <main style={{ padding: "1rem 0" }}>
                <h2>No listed assets</h2>
              </main>
            )}
        </div>
      );
}

