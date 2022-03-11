import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { ContactsServiceService } from '../utils/services/contacts-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  contacts: any[];
  constructor(private contacsService: ContactsServiceService) {
    this.listContacts();
  }
  ngOnInit(): void {
  }
  async listContacts() {
    return this.contacsService.getContacts(await StorageService.getValue(StorageService.config.authKeys.__ACCESS_TOKEN))
      .subscribe((response) => {
        this.contacts = response.data;
      })
  }
  activeTab: string = 'chats'

  segmentChange(e) {
    this.activeTab = e.target.value;
  }

}
