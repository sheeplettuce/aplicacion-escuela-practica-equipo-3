import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { CardComponent } from '../../components/card-menu/card-menuComponent';
import { PlatillosService } from '../../services/platillos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HeaderComponent, CardComponent, CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  categories: Array<{ nombre: string; platillos: any[] }> = [];
  isLoading = true;
  errorMessage = '';
  private sseSub?: Subscription;

  constructor(
    private router: Router,
    private platillosService: PlatillosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMenu();
    this.listenSSE();
  }

  ngOnDestroy() {
    this.sseSub?.unsubscribe();
  }

  listenSSE() {
    this.sseSub = this.platillosService.listenSSE().subscribe({
      next: (evento) => {
        console.log('[SSE] evento recibido:', evento.type, evento.data);
        this.loadMenu();
      },
      error: (err) => console.error('[SSE] error:', err)
    });
  }

  irARegistro() {
    this.router.navigate(['/registro-platillo']);
  }

  onEditar(platillo: any) {
    localStorage.setItem('platilloEditar', JSON.stringify(platillo));
    this.router.navigate(['/registro-platillo', platillo.idPlatillo]);
  }

  onEliminar(platillo: any) {
  if (confirm(`¿Seguro que quieres eliminar "${platillo.nombre}"?`)) {
    this.platillosService.deletePlatillo(platillo.idPlatillo).subscribe({
      next: () => {
        console.log('Platillo eliminado');
        this.loadMenu();
      },
      error: (err) => console.error('Error eliminando:', err)
    });
  }
}

  getImagenCategoria(categoria: string): string {
  const imagenes: { [key: string]: string } = {
    'Comida': 'assets/enchiladas-rojas.png',
    'Bebidas': 'assets/coca.jpg',
    'Extras': 'assets/cubiertos.png'
  };
  return imagenes[categoria] || 'assets/menu.png';
}

  loadMenu() {
    this.isLoading = true;
    this.errorMessage = '';

    this.platillosService.getCompleto().subscribe({
      next: (platillos: any[]) => {
        const grupos: { [key: string]: any[] } = {};
        platillos.forEach(p => {
          const cat = p.Categoria?.nombre || 'Sin categoría';
          if (!grupos[cat]) grupos[cat] = [];
          grupos[cat].push({
            idPlatillo: p.idPlatillo,
            nombre: p.Nombre,
            precio: p.Precio,
            descripcion: p.Descripcion || ''
          });
        });
        this.categories = Object.keys(grupos).map(nombre => ({
          nombre,
          platillos: grupos[nombre]
        }));
        if (this.categories.length === 0) {
          this.errorMessage = 'No hay platillos disponibles.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('[MenuComponent] Error:', error);
        this.errorMessage = 'No se pudo cargar el menú.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}