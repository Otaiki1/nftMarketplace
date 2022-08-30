import { Alert } from "react-bootstrap"

export  default function OrderStatus ({variant, info}) {

  return(
    <Alert variant={variant}>
      {info}
    </Alert>
  )
}