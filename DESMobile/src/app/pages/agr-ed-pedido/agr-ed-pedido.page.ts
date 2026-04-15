import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderCreamComponent } from '../../layout/page-header-cream/page-header-cream.component';
import { BottomNavComponent } from '../../layout/bottom-nav/bottom-nav.component';
import { ElevatedPanelComponent } from '../../components/elevated-panel/elevated-panel.component';
import { ChoiceSplitButtonsComponent } from '../../components/choice-split-buttons/choice-split-buttons.component';
import { MesaInputRowComponent } from '../../components/mesa-input-row/mesa-input-row.component';
import { ToolbarIconButtonComponent } from '../../components/toolbar-icon-button/toolbar-icon-button.component';
import { DishEditRowComponent } from '../../components/dish-edit-row/dish-edit-row.component';
import { DividerLineComponent } from '../../components/divider-line/divider-line.component';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { SeleccionarPlatilloComponent } from '../../layout/agr-prod/agr-prod.component';
import { NotaModalComponent } from '../../layout/nota/nota.component';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface Dish {
  id?: number;
  name: string;
  quantity: number;
  price: number;
  note: string;
}

@Component({
  selector: 'app-agr-ed-pedido',
  templateUrl: './agr-ed-pedido.page.html',
  styleUrls: ['./agr-ed-pedido.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    IonContent,
    CommonModule,
    PageBodyComponent,
    PageHeaderCreamComponent,
    BottomNavComponent,
    ElevatedPanelComponent,
    ChoiceSplitButtonsComponent,
    MesaInputRowComponent,
    ToolbarIconButtonComponent,
    DishEditRowComponent,
    DividerLineComponent,
    PrimaryButtonComponent,
  ],
})

export class AgrEdPedidoPage implements OnInit {
  orderType: 'local' | 'pickup' = 'local';
  noMesa: number | null = 1;
  dishes: Dish[] = [];
  idtrabajador: number = 0;
  idPedido?: number;

  constructor(private modalCtrl: ModalController, private api: ApiService, private router: Router) { }

  ngOnInit() {
    const trabajadorData = localStorage.getItem('trabajador');
    if (trabajadorData) {
      const trabajadorObj = JSON.parse(trabajadorData);
      console.log('Trabajador cargado desde localStorage:', JSON.stringify(trabajadorObj));
      this.idtrabajador = trabajadorObj.idTrabajador || 0;
    }
    // Revisar si se recibió un pedido para editar
    const state = history.state;
    if (state?.pedido) {
      this.cargarPedido(state.pedido);
    }
  }

  cargarPedido(pedido: any) {
    console.log('Cargando pedido para edición:', JSON.stringify(pedido));
    this.idPedido = pedido.idPedido;
    this.orderType = pedido.tipo === 0 ? 'local' : 'pickup';
    this.noMesa = pedido.mesa ? Number(pedido.mesa) : null;
    this.idtrabajador = pedido.TrabajadorId || 0;

    this.dishes = (pedido.items || []).map((d: any) => ({
      id: d.id,
      name: d.nombre,
      quantity: d.Cantidad || 1,
      price: d.PrecioUnitario || d.Precio || 0,
      note: d.Nota || '',
    }));
  }

  onMesaChange(value: number) {
    this.noMesa = value;
  }

  onOrderTypeChange(type: 'local' | 'pickup'): void {
    this.orderType = type;

    if (type === 'pickup') {
      this.noMesa = null;
    }
  }
  async abrirPlatillos() {
    const modal = await this.modalCtrl.create({
      component: SeleccionarPlatilloComponent,
      breakpoints: [0, 0.5, 0.9],
      initialBreakpoint: 0.5,
      handle: true
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      console.log('Platillo seleccionado:', data);
      this.agregarPlatillo(data);
    }
  }

  agregarPlatillo(platillo: any) {
    const existingDish = this.dishes.find(
      (d) => d.id === platillo.id
    );

    if (existingDish) {
      existingDish.quantity++;
    } else {
      this.dishes.push({
        id: platillo.id,
        name: platillo.nombre,
        quantity: 1,
        price: platillo.precio,
        note: ''
      });
    }
  }

  async abrirNota(index: number) {
    const dish = this.dishes[index];
    if (!dish) return;
    const modal = await this.modalCtrl.create({
      component: NotaModalComponent,
      componentProps: {
        notaActual: dish.note
      },
      breakpoints: [0.2, 0.5, 0.9],
      initialBreakpoint: 0.5,
      handle: false,
      backdropDismiss: true,
      cssClass: 'nota-modal',
      keyboardClose: false
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {
      dish.note = data;
    }
  }

  async guardarPedido() {
    console.log(this.dishes);
    if (this.dishes.length === 0) {
      console.warn('No hay platillos en el pedido');
      alert('No hay platillos en el pedido');
      return;
    }
    if (this.orderType === 'local' && !this.noMesa) {
      alert('Debes ingresar número de mesa');
      return;
    }
    try {
      const body = {
        TrabajadorId: this.idtrabajador,
        Tipo: this.orderType === 'local' ? 0 : 1,
        NoMesa: this.orderType === 'local' ? this.noMesa : null,
        Platillos: this.dishes.map(d => ({
          id: d.id,
          nombre: d.name,
          Cantidad: d.quantity,
          PrecioUnitario: d.price,
          Nota: d.note,
        })),
      };
      console.log('Enviando pedido:', JSON.stringify(body));
      if (this.idPedido) {
        // Editar pedido existente
        await firstValueFrom(this.api.put(`/pedidos/${this.idPedido}`, body));
        this.router.navigate(['/editar-pedidos']);
      } else {
        // Crear nuevo pedido
        await firstValueFrom(this.api.post('/pedidos', body));
        this.router.navigate(['/home']);
      }
    } catch (err) {
      console.error('Error guardando pedido:', err);
    }
  }

  async cancelarPedido() {
    if (!this.idPedido) return;
    const confirm = window.confirm('¿Estás seguro de que deseas cancelar este pedido?');
    if (!confirm) return;

    try {
      await firstValueFrom(this.api.put(`/pedidos/${this.idPedido}/cancelar`, {}));
      alert('Pedido cancelado uwu'); // <-- dale css @ThreeBook3458 uwu
      this.router.navigate(['/home']);
    } catch (err) {
      console.error('Error cancelando pedido:', err);
      alert('Error cancelando pedido');
    }
  }

  onDishMinus(index: number): void {
    const dish = this.dishes[index];
    if (!dish) return;
    if (this.dishes[index].quantity > 1) {
      this.dishes[index].quantity--;
    } else {
      this.dishes.splice(index, 1);
    }
  }

  onDishPlus(index: number): void {
    const dish = this.dishes[index];
    if (!dish) return;
    this.dishes[index].quantity++;
  }
}
