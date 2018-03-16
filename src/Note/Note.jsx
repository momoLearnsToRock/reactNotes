
import React, { Component } from 'react';
import './Note.css';
import PropTypes from 'prop-types';

class Note extends Component{
    constructor(props){
        super(props);
        this.noteContents = props.noteContents;
        this.noteId = props.id;
        this.state = { show: true }
    }
    removeNote() {
        this.setState({ show: false });
        setTimeout(() => {this.props.removeNote(this.noteId);
    },1000);
    
}
    render(){
        return (
            <div className={this.state.show ?'note fade-in ':'note fade-out '} >
                <p className='noteContent'>{this.noteContents}</p>
                <span className="closebtn" onClick={()=>this.removeNote()}>&times;</span>
            </div>
            );
    }
}

//Note.PropTypes = {
//    noteContents: PropTypes.string
//}

export default Note;