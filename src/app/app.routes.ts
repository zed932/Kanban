import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './signIn/signIn.component';
import { SignUpComponent } from './signUp/signUp.component';
import { BoardComponent } from './home/board/board.component';
import { FeedbackComponent } from './home/profile/feedback-form/feedback.component';
import { ProfileComponent } from './home/profile/profile.component';
import { MainPageComponent } from './main-page/main-page.component';

export const homeRoutes: Routes = [
  { path: "board", component: BoardComponent },
  { path: "profile", component: ProfileComponent },
  { path: "feedback", component: FeedbackComponent },
  { path: "", redirectTo: "board", pathMatch: "full" }, // Добавлено: редирект с /home на /home/board
];

export const routes: Routes = [
  { path: "", redirectTo: "main", pathMatch: "full" }, // Главная страница по умолчанию
  { path: "main", component: MainPageComponent },
  { path: "signIn", component: SignInComponent },
  { path: "signUp", component: SignUpComponent },
  {
    path: "home",
    component: HomeComponent,
    children: homeRoutes
  },
  { path: "**", redirectTo: "main" }, // Перенаправление на главную вместо входа
];
