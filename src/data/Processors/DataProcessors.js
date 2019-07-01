import BaseDataProcessor from "./BaseDataProcessor";
import Chat from "../structs/Chat";
import Message from "../structs/Message";
// const login = require("facebook-chat-api")

export class FbProcessor extends BaseDataProcessor {
  formatJsonData(input) {
    let json = JSON.parse(input);
    let chat = new Chat(json.title);
    chat.fromJson(json.messages);
    return chat;
  }

  formatHTMLData(input) {
    const html = document.createElement("html")
    html.innerHTML=input
    const messages = Array.from((html).querySelector('[role="main"]').children) 
    //parsing facebook html
    const chat = new Chat('test')
    messages.forEach(msg=> {
        const sender = msg.children[0].innerText
        const content = msg.children[1].children[0].children[1].innerText
        const timestamp = Date.parse(msg.children[2].innerText)
        const message = new Message(sender, content, timestamp)
        chat.append(message)
    })
    
    return chat;
  }
  authUser() {
    return null;
  }
}

export class TwitterProcessor extends BaseDataProcessor {}

export class WhatsAppProcessor extends BaseDataProcessor {}

export class InstaProcessor extends BaseDataProcessor {}

export class SMSProcessor extends BaseDataProcessor {}

// export class GroupMeProcessor extends BaseDataProcessor {}

// export class SignalProcessor extends BaseDataProcessor {}

// export class TransmtionProcessor extends BaseDataProcessor {}

// export class HangoutsProcessor extends BaseDataProcessor {}
