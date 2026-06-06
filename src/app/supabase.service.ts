import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient;

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
  }

  async login(userName: string, password: string) {
    const { data, error } = await this.supabase
      .from('UserInfo')
      .select('*')
      .eq('userName', userName)
      .eq('password', password)
      .single();
    return { data, error };
  }

  async register(userName: string, password: string) {
    const { data: existing } = await this.supabase
      .from('UserInfo')
      .select('userName')
      .eq('userName', userName)
      .single();

    if (existing) {
      return { error: { message: '用户名已存在' } };
    }

    const { error } = await this.supabase
      .from('UserInfo')
      .insert([{ userName, password }]);
    return { error };
  }
}
