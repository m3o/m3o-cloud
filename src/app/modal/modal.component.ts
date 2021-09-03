import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    document.addEventListener('keydown', this.onEscapePress);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.onEscapePress);
  }

  onEscapePress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.modalService.closeModal();
    }
  };

  onClose() {
    this.modalService.closeModal();
  }
}
