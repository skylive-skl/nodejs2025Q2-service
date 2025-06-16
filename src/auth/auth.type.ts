import { User } from 'src/user/entities/user.entity';

export interface ReqData {
  user: Pick<User, 'id' | 'login' | 'version'>;
}
