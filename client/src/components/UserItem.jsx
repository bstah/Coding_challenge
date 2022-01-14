import React, {Component} from "react";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default class UserItem extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const {user, onUpdate, onDelete} = this.props;
        return(
            <ListGroupItem>
                <Row>
                    <Col>{user.first_name} {user.last_name}</Col>
                    <Col>{user.email}</Col>
                    <Col><Button onClick={() => onUpdate(user)}>Edit</Button> <Button variant="danger" onClick={() => onDelete(user)}>Delete</Button></Col>
                </Row>
            </ListGroupItem>
        );
    }
}