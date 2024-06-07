import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';
import * as firebaseAdminPrivateKey from './env/firebase-admin-private-key.json';

interface FcmMessage {
  notification: {
    title: string;
    body: string;
  };
  token: string;
}

@Injectable()
export class FcmService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(
        firebaseAdminPrivateKey as admin.ServiceAccount,
      ),
    });
  }
  async sendPushNotification(message: FcmMessage) {
    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error: any) {
      console.log('Error sending message:', error);
      return error.message as string;
    }

    //ALTERNATIVA
    // try {
    //   const response = await getMessaging().send(message);
    //   console.log('Successfully sent message:', response);
    // } catch (error) {
    //   console.log('Error sending message:', error);
    // }
  }
}
