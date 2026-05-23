import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.css'
})
export class ComponentNameComponent {
  username: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  onLogin() {
    const loginUrl = `http://localhost:8080/userLogin/login?username=${this.username}&password=${this.password}`;

    this.http.get(loginUrl).subscribe(
      (response: any) => {
        if (response && response.id != null) {
          this.router.navigate(['/homepage']);
        } else {
          alert('登录失败');
        }
      },
      (error: any) => {
        console.error('Login failed:', error);
      }
    );
  }
}
