import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { ReservacionesService, Reservacion } from '../../services/reservacion.service';

@Component({
  selector: 'app-reservaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './reservacion.html',
  styleUrls: ['./reservacion.css'],
})
export class ReservacionesComponent implements OnInit {

  reservaciones: Reservacion[] = [];
  proximas:      Reservacion[] = [];
  errorMessage   = '';

  mostrarModal = false;
  modoEdicion  = false;
  editandoId: number | null = null;

  form: Reservacion = this.formVacio();
  private readonly ID_TRABAJADOR = 1;

  constructor(private svc: ReservacionesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.svc.getAll().subscribe({
      next: (data) => { 
        this.reservaciones = data; 
        this.proximas = this.reservaciones.filter(r => new Date(r.Fecha) > new Date());
        this.cdr.detectChanges(); // 👈 fuerza render
      },
      error: (e) => {
        this.errorMessage = 'Error al cargar reservaciones.';
        console.error(e);
      },
    });

    this.svc.getProximas().subscribe({
      next: (data) => { 
        this.proximas = data; 
        this.cdr.detectChanges(); // 👈 fuerza render
      },
      error: (e) => console.error('Error proximas:', e),
    });
  }

  abrirModal(): void {
    this.modoEdicion  = false;
    this.editandoId   = null;
    this.form         = this.formVacio();
    this.mostrarModal = true;
    this.cdr.detectChanges(); // 👈
  }

  editar(r: Reservacion): void {
    this.modoEdicion  = true;
    this.editandoId   = r.idReservacion!;
    this.form = {
      NombreCliente: r.NombreCliente,
      Telefono:      r.Telefono,
      Correo:        r.Correo,
      Fecha:         r.Fecha?.split('T')[0],
      NoPersonas:    r.NoPersonas,
      Estado:        r.Estado ?? 'Activa',
    };
    this.mostrarModal = true;
    this.cdr.detectChanges(); // 👈
  }

  isSaving = false;

  guardar(): void {
    this.isSaving = true;

    if (this.modoEdicion && this.editandoId !== null) {
      this.svc.update(this.editandoId, this.form).subscribe({
        next: () => {
          this.reservaciones = this.reservaciones.map(r =>
            r.idReservacion === this.editandoId ? { ...r, ...this.form } : r
          );
          this.proximas = this.reservaciones.filter(r => new Date(r.Fecha) > new Date());
          this.isSaving = false;
          this.mostrarModal = false;
          this.cdr.detectChanges(); // 👈
        },
        error: (e) => {
          this.errorMessage = 'Error al actualizar.';
          this.isSaving = false;
          console.error(e);
        },
      });

    } else {
      this.svc.create({ ...this.form, idTrabajador: this.ID_TRABAJADOR }).subscribe({
        next: (res) => {
          this.reservaciones.push({
            ...this.form,
            idReservacion: res.idReservacion
          });
          this.proximas = this.reservaciones.filter(r => new Date(r.Fecha) > new Date())
          this.isSaving = false;
          this.mostrarModal = false;
          this.cdr.detectChanges(); // 👈
        },
        error: (e) => {
          this.errorMessage = 'Error al crear.';
          this.isSaving = false;
          console.error(e);
        },
      });
    }
  }

  eliminar(r: Reservacion): void {
    if (!confirm(`¿Eliminar reservación de ${r.NombreCliente}?`)) return;
    this.svc.delete(r.idReservacion!).subscribe({
      next: () => {
        this.cargarDatos();
        this.cdr.detectChanges(); // 👈
      },
      error: (e) => { 
        this.errorMessage = 'Error al eliminar.'; 
        console.error(e); 
      },
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.errorMessage = '';
    this.cdr.detectChanges(); // 👈
  }

  formVacio(): Reservacion {
    return {
      NombreCliente: '',
      Telefono:      '',
      Correo:        '',
      Fecha:         '',
      NoPersonas:    1,
      Estado:        'Activa',
    };
  }
}