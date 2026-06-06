import { Routes } from '@angular/router';
import { ComponentNameComponent } from './component-name/component-name.component';
import { RegisterComponent } from './register/register.component';
import { MahjongComponent } from './mahjong/mahjong.component';

export const routes: Routes = [
  { path: '', redirectTo: 'mahjong', pathMatch: 'full' },
  { path: 'mahjong', component: MahjongComponent },
  { path: 'login', component: ComponentNameComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'mahjong' }
];
