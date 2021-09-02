import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  onClose() {
    this.modalService.closeModal();
  }
}
