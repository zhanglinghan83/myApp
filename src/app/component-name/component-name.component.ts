import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.css'
})
export class ComponentNameComponent {
  username: string = '';
  password: string = '';
  errorMsg: string = '';
  successMsg: string = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) { }

  async onLogin() {
    this.errorMsg = '';
    this.successMsg = '';
    const { data, error } = await this.supabase.login(this.username, this.password);
    if (error || !data) {
      this.errorMsg = '用户名或密码错误';
    } else {
      this.successMsg = '登录成功！';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
