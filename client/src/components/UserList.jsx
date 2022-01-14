import React, { Component } from "react";
import axios from "axios";
import UserItem from './UserItem';
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'

export default class UserList extends Component {
    state = {
        users: [],
        id: null,
        email: '',
        first_name: '',
        last_name: '',
        avatar: '',
        isUpdate: false,
        hideForm: true,
        showToast: false,
        toastMessage: ''
    }

    componentDidMount() {
        axios.get('http://localhost:8080/users')
        .then(res => {
            const users = res.data.data;
            //console.log(users);
            this.setState({ users: users });
        })
    }

    handleCreate = (user) => {
        axios.post('http://localhost:8080/users/create',user)
        .then(res => {
            let users = this.state.users;
            users.push(user);
            this.setState({users: users});
            this.setState({users: users, toastMessage: 'successfully created user', showToast: true, hideForm: true})
        })
    }

    handleUpdate = (user) => {
        axios.put('http://localhost:8080/users/update',user)
        .then(res => {
            let users = this.state.users;
            let userIndex = users.findIndex(x => x.id == user.id);
            users[userIndex] = user;
            this.setState({users: users, toastMessage: 'successfully updated user', showToast: true, hideForm: true})
        })
    }

    handleDelete = (user) => {
        axios.delete('http://localhost:8080/users/delete/'+user.id)
        .then(res => {
            //console.log(res);
            let users = this.state.users.filter(x => x.id != user.id);
            this.setState({users: users, toastMessage: 'successfully deleted user', showToast: true})
        })
    }

    handleFormChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleSubmit = () => {
        let user = {id: this.state.id, email: this.state.email, first_name: this.state.first_name, last_name: this.state.last_name, avatar: this.state.avatar}
        if(this.state.isUpdate){
            this.handleUpdate(user);
        }else{
            this.handleCreate(user);
        }
    }

    showForm = (user) => {
        if(user.id){
            this.setState({isUpdate: true,id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, avatar:user.avatar})
        }else{
            let lastUser = this.state.users[this.state.users.length - 1];
            let nextId = lastUser.id + 1;
            this.setState({isUpdate: false,id: nextId, email: '', first_name: '', last_name: '', avatar: ''})
        }
        this.setState({hideForm: false});
    }

    cancelUpdate = () => {
        this.setState({hideForm: true});
    }

    toggleShow = (toggle) => {
        this.setState({showToast: toggle});
    }

    render() {
        return (
            <Container>
                <Toast className="toast" show={this.state.showToast} onClose={() => this.toggleShow(false)}>
                    <Toast.Header><strong className="ma-auto">{this.state.toastMessage}</strong></Toast.Header>
                </Toast>
                <ListGroup>
                    {this.state.users.map(user => 
                    <UserItem 
                    key={user.id}
                    user={user} 
                    onUpdate={this.showForm} 
                    onDelete={this.handleDelete}
                    />)}
                </ListGroup>
                <br/>
                <Button onClick={this.showForm}>New User</Button>
                {!this.state.hideForm && <div>
                    <label className="form-item">
                        First Name:
                        <input name="first_name" type='text' value={this.state.first_name} onChange={this.handleFormChange}/>
                    </label>
                    <br/>
                    <label className="form-item">
                        Last Name:
                        <input name="last_name" type="text" value={this.state.last_name} onChange={this.handleFormChange}/>
                    </label>
                    <br/>
                    <label className="form-item">
                        Email:
                        <input name="email" type="text" value={this.state.email} onChange={this.handleFormChange}/>
                    </label>
                    <br/><br/>
                    <Button onClick={this.handleSubmit}>Submit</Button> <Button variant="danger" onClick={this.cancelUpdate}>Cancel</Button>
                </div>}
            </Container>
        )
    }
}