import { Injectable } from '@angular/core';

type ModalNames = 'downloads';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  currentModal = '';

  constructor() {}

  openModal(modalName: ModalNames): void {
    this.currentModal = modalName;
  }

  closeModal(): void {
    this.currentModal = '';
  }
}
