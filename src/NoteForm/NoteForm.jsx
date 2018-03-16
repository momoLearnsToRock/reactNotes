import React, { Component } from 'react';
import './NoteForm.css';
//import PropTypes from 'prop-types';

class NoteForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newTodoContent: ''
        }
    }
    handleChange(e) {
        this.setState({ newTodoContent: e.target.value });
    }
    handleClick() {
        this.props.onInsert(this.state.newTodoContent)
        this.setState({ newTodoContent: '' });
    }
    render() {
        return (
            <div className="noteWrapper">
                <input placeholder="Write the note here..." className="noteInput"
                    value={this.state.newTodoContent} onChange={(e)=>this.handleChange(e)}/>
                <button className="noteButton" onClick={() => this.handleClick()} > Add Note </button>
            </div>
        )
    }
}

export default NoteForm