import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../headerAdmin/headerComponent';
import { TrabajadoresService } from '../../services/trabajadores.service';

@Component({
  selector: 'app-registro-trabajador',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './registro-trabajador-component.html',
  styleUrls: ['./registro-trabajador-component.css']
})
export class RegistroTrabajadorComponent implements OnInit {

  esEdicion = false;
  trabajadorId: number | null = null;

  form = {
    Nombre: '',
    Contra: '',
    idRol: null as number | null
  };

  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Mesero' },
    { id: 3, nombre: 'Cocina' }
  ];

  dropdownAbierto = false;
  rolSeleccionado: { id: number; nombre: string } | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private trabajadoresService: TrabajadoresService
  ) {}

  @HostListener('document:click')
  cerrarDropdown() {
    this.dropdownAbierto = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.trabajadorId = Number(id);
      const stored = localStorage.getItem('trabajadorEditar');
      if (stored) {
        const t = JSON.parse(stored);
        this.form.Nombre = t.Nombre;
        this.form.idRol = t.idRol;
        this.rolSeleccionado = this.roles.find(r => r.id === t.idRol) || null;
      }
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownAbierto = !this.dropdownAbierto;
  }

  seleccionarRol(rol: { id: number; nombre: string }) {
    this.rolSeleccionado = rol;
    this.form.idRol = rol.id;
    this.dropdownAbierto = false;
  }

  guardar() {
    if (!this.form.Nombre || !this.form.idRol) {
      alert('Nombre y rol son obligatorios');
      return;
    }
    if (!this.esEdicion && !this.form.Contra) {
      alert('La contraseña es obligatoria');
      return;
    }

    const body: any = {
      Nombre: this.form.Nombre,
      idRol: this.form.idRol
    };
    if (this.form.Contra) body.Contra = this.form.Contra;

    if (this.esEdicion && this.trabajadorId) {
      this.trabajadoresService.update(this.trabajadorId, body).subscribe({
        next: () => this.router.navigate(['/trabajadores']),
        error: (err) => console.error('Error actualizando:', err)
      });
    } else {
      this.trabajadoresService.create(body).subscribe({
        next: () => this.router.navigate(['/trabajadores']),
        error: (err) => console.error('Error creando:', err)
      });
    }
  }

  cancelar() {
    this.router.navigate(['/trabajadores']);
  }
}