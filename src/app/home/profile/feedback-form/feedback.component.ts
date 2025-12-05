import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

enum Satisfaction {
  satisfied,
  neutral,
  not_satisfied
}


@Component({
  selector: 'profile-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class FeedbackComponent {
  name: string = "";
  login:string = "";
  telephoneNumber: string = "";
  satisfaction: Satisfaction = Satisfaction.neutral;
  user_text: string = "";


}
