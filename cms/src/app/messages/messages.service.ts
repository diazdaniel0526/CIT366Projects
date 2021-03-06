import {EventEmitter, Injectable} from '@angular/core';
import {Message} from './message.model';
import {Http, Response, Headers} from '@angular/http';
//import {MOCKMESSAGES} from './MOCKMESSAGES';

@Injectable()
export class MessagesService {
  messageChangeEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: Http) {
    //this.messages = MOCKMESSAGES;
    this.initMessages();
  }

  initMessages(){
    return this.http.get('https://diazdanielcms.firebaseio.com/messages.json')
      .map((response: Response) => response.json())
      .subscribe(
        (data: Message[]) => {
          this.messages = data;
          this.messageChangeEvent.emit(this.messages);
          this.maxMessageId = this.getMaxId();
        }
      );
  }

  storeMessages() {
    const storedMessages= JSON.stringify(this.messages);
    const header = new Headers({
      "Content-Type": "application/json"
    });
    return this.http.put('https://diazdanielcms.firebaseio.com/messages.json'
      , storedMessages
      , {headers: header})
      .subscribe(
        () => this.messageChangeEvent.emit(this.messages.slice())
      );
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId;
  }

  getMessages() {
    return this.messages.slice();
  }

  // getMessage(id: string) {
  //   for (const message of this.messages) {
  //     if (message.id = id) {
  //       return message;
  //     }
  //   }
  //   return null;
  // }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
    this.messageChangeEvent.emit(this.messages.slice());
  }
}
