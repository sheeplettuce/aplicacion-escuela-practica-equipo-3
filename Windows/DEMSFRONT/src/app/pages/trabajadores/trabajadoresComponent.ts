import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { TrabajadoresService, Trabajador } from '../../services/trabajadores.service';

@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './trabajadores.html',
  styleUrls: ['./trabajadores.css']
})
export class TrabajadoresComponent implements OnInit {

  trabajadores: Trabajador[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private trabajadoresService: TrabajadoresService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTrabajadores();
  }

  loadTrabajadores() {
  this.isLoading = true;
  this.trabajadoresService.getAll().subscribe({
    next: (data) => {
      this.trabajadores = data
        .filter(t => t.Activo === 1) // 👈 agrega esto
        .map(t => ({
          ...t,
          Rol: typeof t.Rol === 'string' ? JSON.parse(t.Rol) : t.Rol
        }));
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error:', err);
      this.errorMessage = 'No se pudo cargar la lista.';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

  getRolNombre(t: Trabajador): string {
    if (typeof t.Rol === 'object' && t.Rol?.nombre) return t.Rol.nombre;
    return '';
  }

  contarPorRol(nombre: string): number {
    return this.trabajadores.filter(t => this.getRolNombre(t) === nombre).length;
  }

  irARegistro() {
    this.router.navigate(['/registro-trabajador']);
  }

  irAEditar(t: Trabajador) {
    localStorage.setItem('trabajadorEditar', JSON.stringify({
      idTrabajador: t.idTrabajador,
      Nombre: t.Nombre,
      idRol: t.Rol?.id
    }));
    this.router.navigate(['/registro-trabajador', t.idTrabajador]);
  }

  eliminar(t: Trabajador) {
  console.log('eliminando id:', t.idTrabajador);
  if (confirm(`¿Seguro que quieres eliminar a "${t.Nombre}"?`)) {
    this.trabajadoresService.delete(t.idTrabajador).subscribe({
      next: (res) => {
        console.log('eliminado:', res);
        this.loadTrabajadores();
      },
      error: (err) => console.error('Error eliminando:', err)
    });
  }
}
}