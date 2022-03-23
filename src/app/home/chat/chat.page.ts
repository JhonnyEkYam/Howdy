import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WsService } from '../../utils/ws.service';
import { StorageService } from '../../storage/storage.service';
import { ContactsServiceService } from '../../utils/services/contacts-service.service';
import { User } from 'src/app/auth/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  account: any;
  onlineUsers: any = [];
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
    this.route.data.subscribe(async (data) => {
      this.to = data['data']['params'].user_id;
      this.getMessages(this.to)
    });

    this.wsService.listen('nuevo-mensaje').subscribe((mensaje) => {
      this.messages.push(mensaje);
    });

    this.wsService.listen('newUser').subscribe((usuario) => {
      this.onlineUsers.push(usuario);
    });

    this.wsService.listen('userOut').subscribe((usuario: any) => {
      this.onlineUsers.map((online, index) => {
        if (online.token == usuario.token) {
          this.onlineUsers.splice(index, 1);
        }
      });
    });
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
        this.wsService.emit('login', JSON.stringify(response.extra))
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
        this.messages.push(response.data);
        this.content = '';
        this.wsService.emit('nuevo-mensaje', response.data);
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
