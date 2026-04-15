import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonHeader, IonContent, IonTextarea, IonButton, IonItem } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nota-modal',
  standalone: true,
  templateUrl: './nota.component.html',
  styleUrls: ['./nota.component.scss'],
  imports: [CommonModule, FormsModule, IonHeader, IonContent, IonTextarea, IonButton, IonItem],
})
export class NotaModalComponent {
  @Input() notaActual: string = '';
  nota: string = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.nota = this.notaActual;
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    this.modalCtrl.dismiss(this.nota);
  }

  onNotaInput(event: Event) {
    console.log('nota input', event);
    console.log('nota:', this.nota);
  }

  onNotaFocus() {
    console.log('nota focus');
  }

  onNotaBlur() {
    console.log('nota blur');
  }
}