import HttpService from './HttpService';

class ProfileService {

  static getProfile() {
    return HttpService.http().get('api:v1://profile');
  }
}

export default ProfileService;
