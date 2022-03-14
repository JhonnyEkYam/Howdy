import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { DefaultEventsMap } from '@socket.io/component-emitter';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  ws_server = 'ws://localhost:3000';
  wsClient: Socket<DefaultEventsMap, DefaultEventsMap>;
  readonly url = '';
  constructor() {
    this.wsClient = io(this.ws_server);
    console.log('conectado', this.wsClient);
  }

  listen(eventName: any) {
    return new Observable((subscriber) => {
      this.wsClient.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: any, data: any) {
    console.log("evento", eventName, "data", data)
    return this.wsClient.emit(eventName, data);
  }
}
