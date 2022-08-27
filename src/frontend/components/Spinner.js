import {Spinner} from 'react-bootstrap'
export default function LoadSpinner(){
    
    return(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Spinner animation="border" style={{ display: 'flex' }} />
            <p className='mx-3 my-0'>Loading....</p>
        </div>
    )
}