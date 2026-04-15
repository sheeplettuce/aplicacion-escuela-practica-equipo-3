import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { PageBodyComponent } from '../page-body/page-body.component';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

interface Pago {
  metodo: string;
  monto: number | null;
}

@Component({
  selector: 'app-dividir-pagos',
  templateUrl: './dividir-pagos.component.html',
  styleUrls: ['./dividir-pagos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageBodyComponent,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton
  ]
})
export class DividirPagosComponent implements OnInit {

  @Input() total: number = 0;
  @Input() pagos: Pago[] = [];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.pagos && this.pagos.length > 0) {
      this.pagos = this.pagos.map(p => ({
        metodo: p.metodo || 'tarjeta',
        monto: p.monto ?? null
      }));
    } else {
      this.pagos = [];
      this.agregarPago();
    }
  }

  agregarPago() {
    if (this.restante <= 0) return;

    const incompleto = this.pagos.some(p => !p.monto || p.monto <= 0);
    if (incompleto) return;

    this.pagos.push({
      metodo: 'tarjeta',
      monto: null
    });
  }

  get totalPagado(): number {
    return this.pagos.reduce((acc, p) => acc + (p.monto || 0), 0);
  }

  get restante(): number {
    return this.total - this.totalPagado;
  }

  get hayPagosIncompletos(): boolean {
    return this.pagos.some(p => !p.monto || p.monto <= 0);
  }

  onMontoChange(index: number) {
    const pago = this.pagos[index];

    if (!pago.monto || pago.monto <= 0) {
      this.pagos.splice(index, 1);
    }

    if (this.pagos.length === 0) {
      this.agregarPago();
    }
  }

  onConfirmPayments() {

    const incompleto = this.pagos.some(p => !p.monto || p.monto <= 0);
    if (incompleto) {
      console.warn('Hay pagos incompletos');
      return;
    }
    if (this.restante > 0) {
      console.warn('Falta dinero');
      return;
    }

    this.modalCtrl.dismiss({
      pagos: this.pagos,
      totalPagado: this.totalPagado
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}