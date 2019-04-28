import HttpService from './HttpService';

class UserService {

  static getUsers() {
    return HttpService.http().get('api:v1://users');
  }

  static getUserById(userId, includesArr) {
    let config = {};

    if (includesArr.length > 0) {
      config = {
        params: {include: includesArr.join(',')}
      };
    }

    return HttpService.http().get(`api:v1://users/${userId}`, config);
  }

  static createUser(data) {
    const d = {
      email: data.email,
      mobile_phone_number: data.mobileNumber,
      nic: data.nicNumber,
      notify_by: data.notifyBy
    };

    return HttpService.http().post(`api:v1://users`, d);
  }

  static changeAccountStatus(userId, accountStatus) {
    const data = {
      user_account_status: accountStatus,
    };

    return HttpService.http().patch(`api:v1://users/${userId}/user_account_status`, data);
  }

  static resetPassword(userId, notifyBy = []) {
    const d = {
      notify_by: notifyBy
    };

    return HttpService.http().post(`api:v1://users/${userId}/password/reset`, d);
  }
}

export default UserService;
