import React, {Component} from 'react';
import {Widget, addResponseMessage, addUserMessage} from 'react-chat-widget';
import { clients, chat } from './jexia.js'
import 'react-chat-widget/lib/styles.css';

const cookie_id  = 'jxuid'
const limit = 30;

class Client extends Component {
  componentDidMount() {
    let session_id = localStorage.getItem(cookie_id);
    // check if no session_id in localstorage create new one and save in Jexia DataSet Users
    if (session_id === null)
    {
      this.createUser().then(
        result => {
          //register user visit
          localStorage.setItem(cookie_id,result[0].session_id);
          addResponseMessage('Welcome to our store!');
          addResponseMessage('Are you looking for anything in particular?');
        },
        error => {
          console.log('Can\'t register session_id:', error);
        }) 
    } else {
      // if user already created just get his chat history.
      this.fetchPreviousMessages(session_id)
      
      this.subscription = chat.watch("created")
      .subscribe(messageObject => {
        let id = messageObject.data[0].id
        //Get value only this record
        chat.select()
        .where(field => field("id").isEqualTo(id))
        .subscribe(
          msg=>{
            if(!msg[0].is_user) addResponseMessage(msg[0].txt);
          },
          err=>{console.log(err);
          }
        )
      }, error => {
        console.log(error);
      });

    } 
  }
 
  uuid() {
    //this is just to generate random session id
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
  }

  createUser = async () => {
    let session_id = this.uuid() 
    return clients
    .insert({
      session_id:session_id
      // other webbrowser tracking staff
    }).toPromise()
  }
  
  saveMsg = async (data) => {
    // Add chat message to log
    return chat.insert(data).toPromise()
  }

  fetchPreviousMessages = (id) => {
    //Fetching chat history for current user with limit
    chat.select()
    .limit(limit)
    .where(field => field("session_id").isEqualTo(id))
    .subscribe(
      messages=>{
        messages.forEach(message => {          
          if(message.is_user)
            addResponseMessage(message.txt);  
          else 
            addUserMessage(message.txt);  
        })
      },
      error=>{console.log("Message fetching failed with error:", error);}
    )
  }

  handleNewUserMessage = newMessage => {
    let uid = localStorage.getItem(cookie_id);
    var msg = {
      session_id:uid,
      txt:newMessage,
      is_user:true,
      read:false
    }; 
    if (uid) {
      this.saveMsg(msg).then(
        result => {
          //Save message
          //console.log(result);
        },
        error => {
          console.log('Can\'t send message:', error);
        }) 
    } else {
      console.log('cant get user ID');
    }
  };

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <div className='App'>
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          title='Jexia Support Chat'
          subtitle='Ready to help you'
        />
      </div>
    );
  }
}

export default Client;
