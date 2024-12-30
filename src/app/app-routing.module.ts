import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'user-input',
    pathMatch: 'full'
  },
  {
    path: 'screen3',
    loadChildren: () => import('./screen3/screen3.module').then( m => m.Screen3PageModule)
  },
  {
    path: 'user-input',
    loadChildren: () => import('./user-input/user-input.module').then( m => m.UserInputPageModule)
  },
  {
    path: 'editable-preview',
    loadChildren: () => import('./editable-preview/editable-preview.module').then( m => m.EditablePreviewPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
