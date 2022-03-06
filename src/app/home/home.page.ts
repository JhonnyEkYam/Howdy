import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  activeTab: string ='chats'
  constructor() {7
  }
 
  segmentChange(e){
    this.activeTab = e.target.value;
  }

}
