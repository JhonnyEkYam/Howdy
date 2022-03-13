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
  from: string = '0';
  activeTab: string = 'chats';

  constructor(
    private contacsService: ContactsServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.from = data['data']['params'].user_id;
      this.getMessages(this.from);
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


  haveMessages(): boolean { return this.messages.length > 0}

  sendMessage(message: string) {
    console.log('hola soy un mensaje', message);
  }

  submitForm(rawForm: NgForm) {
    if (rawForm.form.valid) {
      this.sendMessage(rawForm.form.value.message);
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
