import React,{useState} from 'react';
import './App.css';
import { Button,TextArea,Container,Modal,Input } from 'semantic-ui-react';


// var [clipboard,setState] = useState();


class App extends React.Component{

  constructor(props){
    super();
    let clipboardName = "";
    try{clipboardName = localStorage.getItem("clipboardName").toString();}
    catch(e){clipboardName = ""}
    // this.apiEnd = "http://localhost:3000";
    // this.apiEnd = "http://192.168.43.247:3000";
    // this.apiEnd = "http://192.168.1.9:3000";
    this.apiEnd = "https://clipboard-restapi.herokuapp.com";
    this.state={
      clipboard:"",
      clipboardName:clipboardName,
      modalOpen: clipboardName !== "" ? false : true,
    };
    this.startup();
  }

  startup = () =>{
    if(this.state.clipboardName !== ""){
      fetch(this.apiEnd+`/getClipboard?clipboardName=${this.state.clipboardName}`)
      .then(res => res.json().then(r=>this.setState({clipboard:r})));
    }
    else{
      this.setState({modalOpen:true});
    }
  }

  textChanged = (e) => {
    console.log(e.target.value);
    this.setState({clipboard:e.target.value});
    fetch(this.apiEnd+"/setClipboard",{
      method:'POST',
      body:JSON.stringify({"clipboard":e.target.value,"clipboardName":this.state.clipboardName}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json().then(r => console.log(r)));
  }

  clearClipboard = (e) =>{
    fetch(this.apiEnd+"/clearClipboard",{
      method: 'DELETE',
      body:JSON.stringify({"clipboardName":this.state.clipboardName})
    })
    .then(res => window.location = "")
    .catch(err=>console.error(`error on clearClipboard = ${err}`));
  }

  copyThis = (e) =>{
    let text = document.querySelector("textarea");
    text.select()
    document.execCommand('copy');
  }

  setClipboardName = (e) =>{
    this.setState({clipboardName:e.target.value});
    localStorage.setItem("clipboardName",e.target.value);
  }

  changeClipboardName = (e) => {
    this.setState({modalOpen:true});
  }

  // componentDidUpdate(){
    
  // }

  render(){
    return (
      <div className="App">
          <center>
            <Container fluid={true}>
              <h3 onClick={this.changeClipboardName}>{this.state.clipboardName}</h3>
              <TextArea className="textArea" value={this.state.clipboard} onInput={this.textChanged} onChange={this.textChanged} placeholder="start typing to store something on clipboard ..."></TextArea>
              <br/>
              <div className="buttons">
                <Button id="copyButton" onClick={this.copyThis} color="green">Copy 📋</Button>
                <a href="#" onClick={this.clearClipboard}><Button color="red">Clear ✖</Button></a>
              </div>
              <Modal
                onClose={()=>{this.setState({modalOpen:false});this.startup();}}
                onOpen={()=>this.setState({modalOpen:true})}
                open={this.state.modalOpen}
                size="mini"
                dimmer="blurring"
              >
              <Modal.Header>Enter name for your clipboard</Modal.Header>
              <Modal.Content>
                <Input type="text" style={{width:"inherit"}} onInput={this.setClipboardName} placeholder="Name of your clipboard"></Input>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={()=>{this.setState({modalOpen:false});this.startup();}} color="green">Done</Button>
              </Modal.Actions>
              </Modal>
            </Container>
          </center>
      </div>
    );
  }
}



export default App;
