import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SignInComponent} from './signIn/signIn.component';
import {SignUpComponent} from './signUp/signUp.component';
import {BoardComponent} from './home/board/board.component';
import {FeedbackComponent} from './home/profile/feedback-form/feedback.component';
import {ProfileComponent} from './home/profile/profile.component';



export const homeRoutes: Routes = [
  {path:"board", component: BoardComponent},
  {path:"profile", component: ProfileComponent},
  {path: "feedback", component: FeedbackComponent},
  {path:"**", redirectTo:"board"},
]

export const routes: Routes = [
  {path: "signIn", component: SignInComponent},
  {path: "signUp", component: SignUpComponent},
  {path: "home", component: HomeComponent, children: homeRoutes},
  {path: "**", redirectTo: "signIn"},
];
