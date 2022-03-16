import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WsService } from '../../utils/ws.service';
import { StorageService } from '../../storage/storage.service';
import { ContactsServiceService } from '../../utils/services/contacts-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  messages: any[] = [];
  to: string = '0';
  activeTab: string = 'chats';
  content: string = '';
  constructor(
    private contacsService: ContactsServiceService,
    private route: ActivatedRoute,
    private wsService: WsService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.to = data['data']['params'].user_id;
      this.getMessages(this.to);
    });

    // connect to socket io
    this.wsService.listen('test').subscribe((data) => {
      console.log('tests', data);
    });

    this.wsService.listen('newMessage').subscribe((message)=> {
      console.log('Este mensaje ha sido recibido via ws: ', message)
      this.messages.push(message);
    })
  }

  async getMessages(from: string) {
    return this.contacsService
      .getMessages(
        await StorageService.getValue(
          StorageService.config.authKeys.__ACCESS_TOKEN
        ),
        from
      )
      .subscribe((response) => {
        this.messages = response.data;
      });
  }

  async sendMessage(message: string, to: string) {
    this.contacsService
      .sendMessage(
        await StorageService.getValue(
          StorageService.config.authKeys.__ACCESS_TOKEN
        ),
        to,
        message
      )
      .subscribe((response) => {
        console.log('El mensaje fue añadido a la base de datos', response);
        this.messages.push(response.data);
        this.content = '';
        console.log("notificando via websocket")
        this.wsService.emit('saludo', {
          data: response.data,
          message: 'Hola que tal',
        });
      });
  }

  haveMessages(): boolean {
    return this.messages.length > 0;
  }

  submitForm(rawForm: NgForm) {
    if (rawForm.form.valid) {
      this.sendMessage(rawForm.form.value.message, this.to);
    } else alert('No puedes enviar un mensaje vacío');
  }

  ionViewWillEnter() {
    let chatSection = document.getElementById('chat');
    chatSection.scrollTop = chatSection.scrollHeight;
  }

  segmentChange(e: { target: { value: string } }) {
    this.activeTab = e.target.value;
  }
}
