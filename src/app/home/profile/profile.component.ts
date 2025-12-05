import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  standalone: true,
})

export class ProfileComponent {
 login:string = "";

 constructor(private router: Router) {
 }

 navigateToFeedback(){
   this.router.navigate(["home/feedback"]);
 }
}
