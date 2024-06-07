import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor() {}

  async getVersionIphone() {
    return { message: '1.0.0' };
  }

  async getVersionAndroid() {
    return { message: '1.0.0' };
  }

  async getVersionServer() {
    return { message: '1.0.0' };
  }

  async getVersionDashboard() {
    return { message: '1.0.0' };
  }
}
