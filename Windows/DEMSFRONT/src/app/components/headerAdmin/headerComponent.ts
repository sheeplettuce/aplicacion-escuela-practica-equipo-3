import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  @Input() title: string = '';
  rol: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.rol = this.authService.getRol();
    console.log('Rol en header:', this.rol);
  }

  logout() {
    this.authService.logout();
  }
}