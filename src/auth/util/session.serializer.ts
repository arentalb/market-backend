import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }
  // Determines which data of the user object should be stored in the session.
  serializeUser(user: any, done: Function) {
    done(null, user.id);
  }
  //Retrieves the full user object based on the identifier stored in the session.
  async deserializeUser(id: any, done: Function) {
    const user = await this.authService.getUserById(id);
    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  }
}
