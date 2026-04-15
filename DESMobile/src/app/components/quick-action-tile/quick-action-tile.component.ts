import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export type QuickTileKind = 'hero' | 'standard' | 'compact';

@Component({
  selector: 'app-quick-action-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-action-tile.component.html',
  styleUrls: ['./quick-action-tile.component.scss'],
})
export class QuickActionTileComponent {
  @Input({ required: true }) imageSrc!: string;
  @Input({ required: true }) label!: string;
  @Input() kind: QuickTileKind = 'standard';
  @Input() imageAlt = '';
  /** Ruta interna (p. ej. `/agr-ed-pedido`). Si se define, navega al hacer clic. */
  @Input() route: string | null = null;

  @Output() tileClick = new EventEmitter<void>();

  constructor(private router: Router) {}

  onClick(): void {
    if (this.route) {
      void this.router.navigateByUrl(this.route);
      return;
    }
    this.tileClick.emit();
  }
}