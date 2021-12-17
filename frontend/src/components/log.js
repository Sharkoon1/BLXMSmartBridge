import react, {Component} from "react";
import ListGroup from 'react-bootstrap/listgroup';
import 'bootstrap/dist/css/bootstrap.min.css';


export class Log extends Component{

    render(){
        return(
            <ListGroup variant="flush">
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
          </ListGroup>         

        )
    }
}