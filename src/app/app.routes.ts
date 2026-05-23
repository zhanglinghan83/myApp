import { Routes } from '@angular/router';
import { ComponentNameComponent } from './component-name/component-name.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: ComponentNameComponent },
  { path: '**', redirectTo: 'login' }
];
