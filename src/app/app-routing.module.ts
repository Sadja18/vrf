import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'input',
    pathMatch: 'full'
  },
  // {
  //   path: 'screen3',
  //   loadChildren: () => import('./screen3/screen3.module').then( m => m.Screen3PageModule)
  // },
  // {
  //   path: 'user-input',
  //   loadChildren: () => import('./user-input/user-input.module').then( m => m.UserInputPageModule)
  // },
  // {
  //   path: 'editable-preview',
  //   loadChildren: () => import('./editable-preview/editable-preview.module').then( m => m.EditablePreviewPageModule)
  // },
  {
    path: 'input',
    loadChildren: () => import('./v2/input/input.module').then( m => m.InputPageModule)
  },
  {
    path: 'preview',
    loadChildren: () => import('./v2/preview/preview.module').then( m => m.PreviewPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./v2/list/list.module').then( m => m.ListPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
