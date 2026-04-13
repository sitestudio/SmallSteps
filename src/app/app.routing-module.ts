import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'training/literacy-first', loadComponent: () => import('./pages/literacy-first/literacy-first').then(m => m.LiteracyFirst) },
  { path: 'sounds-speech', loadComponent: () => import('./pages/sounds-speech/sounds-speech').then(m => m.SoundsSpeech) },
  { path: 'sounds-speech/words-and-sentences', loadComponent: () => import('./pages/sounds-speech/words-and-sentences').then(m => m.WordsAndSentences) },
  { path: 'training/sounds-speech', loadComponent: () => import('./pages/sounds-speech-training/sounds-speech-training').then(m => m.SoundsSpeechTraining) },
  { path: 'observation/support/language-literacy', loadComponent: () => import('./pages/observation-support/observation-support').then(m => m.ObservationSupport) },
  { path: 'comprehension', loadComponent: () => import('./pages/comprehension/comprehension').then(m => m.Comprehension) },
  { path: 'print-pdf', loadComponent: () => import('./pages/print-pdf/print-pdf').then(m => m.PrintPdf) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static routes = routes;
}
