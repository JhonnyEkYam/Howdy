import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.to = data['data']['params'].user_id;
      this.getMessages(this.to);
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
      });
  }

  async sendMessage(message: string, to: string) {
    this.contacsService.sendMessage(
      await StorageService.getValue(StorageService.config.authKeys.__ACCESS_TOKEN),
      to,
      message
    ).subscribe((response) => {
      console.log('Respuesta:', response)
      this.messages.push(response.data);
      this.content = '';
    })
  }

  haveMessages(): boolean { return this.messages.length > 0}

  submitForm(rawForm: NgForm) {
    if (rawForm.form.valid) {
      this.sendMessage(rawForm.form.value.message, this.to);
    } else alert('No puedes enviar un mensaje vacío');
  }
  
  ionViewWillEnter() {
    let chatSection = document.getElementById('chat');
    chatSection.scrollTop = chatSection.scrollHeight;
  }
  
  segmentChange(e: { target: { value: string; }; }) {
    this.activeTab = e.target.value;
  }
}
