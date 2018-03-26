//new changes in the VSBranch

import React, { Component } from 'react';
import './App.css';
import Note from './Note/Note'
import NoteForm from './NoteForm/NoteForm'
import { DB_CONFIG } from './Config/config'
import * as firebase from 'firebase'
import 'firebase/database'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [
                //{ noteContents: 'note1', id: 0 },
                //{ noteContents: 'note2', id: 1 },
                //{ noteContents: 'note3', id: 2 }
            ]
        }
        this.insertNote = this.insertNote.bind(this);
        this.removeNote = this.removeNote.bind(this);

        this.app = firebase.initializeApp(DB_CONFIG);
        this.database = this.app.database().ref().child('notes');

        ////authentication
        firebase.auth().signInAnonymously().catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Authentication error " + errorCode + ", " + errorMessage);
            // ...
        });
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                window.alert("User signed in " + uid);
            } else {
                //user signed out.
                console.log("user signed out!");
            }
        }
        );

        ////playing with persistency
        // since I can connect from multiple devices or browser tabs, we store each connection instance separately
        // any time that connectionsRef's value is null (i.e. has no children) I am offline
        var myConnectionsRef = firebase.database().ref('users/Momo/connections');

        // stores the timestamp of my last disconnect (the last time I was seen online)
        var lastOnlineRef = firebase.database().ref('users/Momo/lastOnline');

        var connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on('value', function (snap) {
            if (snap.val() === true) {
                // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
                var con = myConnectionsRef.push();

                // When I disconnect, remove this device
                con.onDisconnect().remove();

                // Add this device to my connections list
                // this value could contain info about the device or a timestamp too
                con.set(true);

                // When I disconnect, update the last time I was seen online
                lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            }
        });
    }
    componentWillMount() {
        const previousnotes = this.state.notes; //intresting that there are two eventHandlers but the copy of the array
        //is made once and outside those event handlers
        this.database
            //.orderByChild('noteContents') //just for laughs
            //.endAt('note')
            //.limitToFirst(2)
            .on('child_added', snap => {
                snap.ref.on('value', s => {
                    debugger;
                    const prevnotes = this.state.notes; //intresting that there are two eventHandlers but the copy of the array
                    if (!!s.val()) {
                        for (let i = 0; i < prevnotes.length; i++) {
                            if (prevnotes[i].id == s.key) {
                                prevnotes[i].noteContents = s.val().noteContents;
                                break;
                            }
                        }
                        this.setState({ notes: prevnotes });
                    }
                })
                previousnotes.push({
                    id: snap.key,
                    noteContents: snap.val().noteContents
                });
                this.setState({ notes: previousnotes })
            })
        this.database.on('child_removed', snap => {
            for (var i = 0; i < previousnotes.length; i++)
                if (previousnotes[i].id == snap.key) {
                    previousnotes.splice(i, 1);
                    break;
                }
            this.setState({ notes: previousnotes });
        });
        ////this is actually wrong because it returns the whole list with each update. instead the event listner can be called on each node.
        //this.database.on('value', snap => {
        //    debugger;
        //    for (let i = 0; i < previousnotes.length; i++) {
        //        if (previousnotes[i].key == snap.key) {
        //            previousnotes[i].noteContents = snap.val().noteContents;
        //            //break; i am not ssure if multiple simultaneous updates trigger one 'value' event or multiple
        //        }
        //    }
        //    this.setState({ notes: previousnotes })
        //})

    }
    insertNote(noteText) {
        let insr = this.database.push({ noteContents: noteText });
        setTimeout(() => { insr.set({ noteContents: 'notedAgain ' + new Date() }) }, 4000);
    }
    removeNote(id) {
        this.database.child(id).remove();
        //this.database.orderByKey().equalTo(id).remove(); //this DOES NOT WORK!!!.
    }
    render() {
        return (
            <div className="notesWrapper">
                <div className="notesHeader">
                    <div className="heading"> React and Firebase TODOs </div>
                </div>
                <div className="notesBody">
                    {
                        this.state.notes.map((n) => {
                            return (
                                <Note noteContents={n.noteContents} id={n.id} key={n.id} removeNote={this.removeNote} />
                            )
                        })
                    }
                </div>
                <div className="footerWrapper">
                    <NoteForm onInsert={this.insertNote} />
                </div>
            </div>
        );
    }
}

export default App;

