import { User } from 'src/user/entities/user.entity';

export interface ReqData {
  user: {
    userId: User['id'];
    login: User['login'];
    version: User['version'];
  };
}
