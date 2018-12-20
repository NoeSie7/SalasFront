import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ConfirmationPopup } from './confirmation-popup.model';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {

  @Input() public confirmationModel: ConfirmationPopup;
  @Output() public acceptCallback: EventEmitter<any> = new EventEmitter<any>();
  @Output() public cancelCallback: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onAccept() {
    this.acceptCallback.emit();
  }

  onCancel() {
    this.cancelCallback.emit();
  }

}
