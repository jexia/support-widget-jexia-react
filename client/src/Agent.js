import React, {Component} from 'react';
import { clients, chat, ums } from './jexia.js' //
import MDSpinner from "react-md-spinner";

const limit = 30;

class Agent extends Component {

  state = {
    customers: [],
    selectedCustomer: '',
    chat: [],
    chatIsLoading: false,
    customerIsLoading:true
  }

  componentDidMount(){
    ums.signIn({    
      email: 'jexia@user.com',    
      password: '123'
    }).subscribe(user => {
       // if signIn for agend is good, we can fetch data...
       clients.select().subscribe(
        result=>{
          this.setState({
            customers: result,
            customerIsLoading: false,
          })
        },
        error=>{console.log(error);}
       )
    }, error=>{
      console.log(error)
    });
    
    this.subscription = chat.watch("created")
      .subscribe(messageObject => {
        let id = messageObject.data[0].id
        //Get value only this record
        chat.select()
        .where(field => field("id").isEqualTo(id))
        .subscribe(
          msg=>{
            if(msg[0].is_user){
              this.setState({
                chat:this.state.chat.concat(msg)
              })
            }
          },
          err=>{console.log(err);
          }
        )
      }, error => {
        console.log(error);
      });
  } 
  
  handleSubmit = event => {
    event.preventDefault();
    let message = this.refs.message.value;

    var textMessage = {
      session_id:this.state.selectedCustomer,
      txt:message,
      is_user:false,
      read:false
    }
    
    chat.insert(textMessage).subscribe(
      data=>{
        //let d =
        //d.push()
        this.setState({
          chat:this.state.chat.concat(data)
        })
      },
      err=>{console.log(err);
      }
    )
    this.refs.message.value='';
  }

  componentWillUnmount(){
    //CometChat.removeMessageListener(AGENT_MESSAGE_LISTENER_KEY);
    //CometChat.logout();
  }

  selectCustomer = uid => {
    this.setState({
      selectedCustomer: uid
    }, ()=> {this.fetchPreviousMessage(uid)})
  }

  fetchPreviousMessage = uid => {
    this.setState({
      chat: [],
      chatIsLoading: true
    }, () => {
        chat.select()
        .limit(limit)
        .where(field => field("session_id").isEqualTo(uid))
        .subscribe(
          messages=>{  
            this.setState({
              chat: messages,
              chatIsLoading: false
            })
          },
          error=>{console.log("Message fetching failed with error:", error);}
        )
    });
  }

  render() {
    return(
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className="col-md-8 h-100pr border rounded">
            <div className='row'>
              <div className='col-lg-4 col-xs-12 bg-light' style={{ height: 658 }}>
              <div className='row p-3'><h2>Customer List</h2></div>
              <div className='row ml-0 mr-0 h-75 bg-white border rounded' style={{ height: '100%', overflow:'auto' }}>
              <CustomerList {...this.state} selectCustomer={this.selectCustomer}/>
              </div>
              </div>
              <div className='col-lg-8 col-xs-12 bg-light'  style={{ height: 658 }}>
                <div className='row p-3 bg-white'>
                  <h2>Who you gonna chat with?</h2>
                </div>
                <div className='row pt-5 bg-white' style={{ height: 530, overflow:'auto' }}>
                <ChatBox {...this.state} />
                </div>
                <div className="row bg-light" style={{ bottom: 0, width: '100%' }}>
                <form className="row m-0 p-0 w-100" onSubmit={this.handleSubmit}>
    
                <div className="col-9 m-0 p-1">
                  <input id="text" 
                    className="mw-100 border rounded form-control" 
                    type="text" 
                    name="text" 
                    ref="message"
                    placeholder="Type a message..."/>
                </div>
                <div className="col-3 m-0 p-1">
                  <button className="btn btn-outline-secondary rounded border w-100" 
                    title="Send" 
                    style={{ paddingRight: 16 }}>Send</button>
                </div>
                </form>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ChatBox extends Component {
  render(){
    const {chat, chatIsLoading} = this.props;
    if (chatIsLoading) {
      return (
        <div className='col-xl-12 my-auto text-center'>
          <MDSpinner size='72'/>
        </div>
      )
    }
    else {
      return (
        <div className='col-xl-12'>
          { 
            chat
            .map(chat => 
              <div key={chat.id} className="message">
                <div className={`${chat.is_user ? 'balon1': 'balon2'} p-3 m-1`}>
                  {chat.txt}
                </div>
              </div>)
          }  
        </div>
      )
    }
  }

}


class CustomerList extends Component {
  render(){
    const {customers, customerIsLoading, selectedCustomer} = this.props;
    if (customerIsLoading) {
      return (
        <div className='col-xl-12 my-auto text-center'>
          <MDSpinner size='72'/>
        </div>
      )
    }
    else {
      return (
        <ul className="list-group list-group-flush w-100">
          { 
            customers
            .map(customer => 
              <li 
                key={customer.id} 
                className={`list-group-item ${customer.session_id === selectedCustomer ? 'active':''}`} 
                onClick={() => this.props.selectCustomer(customer.session_id)}> Customer { customer.session_id }  </li>)
          }                
        </ul>
      )
    }
  }
}

export default Agent;