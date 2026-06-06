import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMsg: string = '';
  successMsg: string = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) { }

  async onRegister() {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.username || !this.password) {
      this.errorMsg = '请填写用户名和密码';
      return;
    }
    const { error } = await this.supabase.register(this.username, this.password);
    if (error) {
      this.errorMsg = '注册失败：' + error.message;
    } else {
      this.successMsg = '注册成功！';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}