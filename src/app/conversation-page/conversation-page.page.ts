import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { ContactsServiceService } from '../utils/services/contacts-service.service';

@Component({
  selector: 'app-conversation-page',
  templateUrl: './conversation-page.page.html',
  styleUrls: ['./conversation-page.page.scss'],
})
export class ConversationPagePage implements OnInit {
  messages: any[];

  ionViewWillEnter() {
    let chatSection = document.getElementById("chat");
    chatSection.scrollTop = chatSection.scrollHeight;
  }


  constructor(private contacsService: ContactsServiceService, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.getMessages(data['data']['params'].user_id)
    })
  }

  async getMessages(from: string) {
    return this.contacsService.getMessages(
      await StorageService.getValue(
        StorageService.config.authKeys.__ACCESS_TOKEN
      ), from
    ).subscribe(response => {
      this.messages = response.data;
      console.log("mensajes", this.messages);
    })
  }

  activeTab: string = 'chats'

  segmentChange(e) {
    this.activeTab = e.target.value;
  }

}
