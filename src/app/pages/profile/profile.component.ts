import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(private usersService: UsersService) {
      this.getUser(1);
  }

  getUser(id) {
    this.usersService.getByID(id)
      .subscribe(
        (data) => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }
}
