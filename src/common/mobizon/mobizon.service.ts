import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface Message {
  pt: string;
  en: string;
  es: string;
}

interface MobizonResponse {
  success: boolean;
  errorMessage?: string;
  data?: {
    campaignId: string;
    messageId: string;
  };
}

@Injectable()
export class MobizonService {
  private androidSmsHash: string;
  private baseUrlMobizon: string;
  private mobizonApiKey: string;
  constructor(private readonly configService: ConfigService) {
    this.androidSmsHash = this.configService.getOrThrow('ANDROID_SMS_HASH');
    this.baseUrlMobizon = this.configService.getOrThrow('BASE_URL_MOBIZON');
    this.mobizonApiKey = this.configService.getOrThrow('MOBIZON_API_KEY');
  }

  async sendSms(
    phone: string,
    code: number,
    language: string,
    deviceOS: string,
  ) {
    const APP = 'ListenSongs';

    const codeMobizon = {
      code,
      createdAt: new Date(),
    };

    const messagePT = `Seu%20código%20${APP}%20e:%20${codeMobizon}`;
    const messageEN = `Your%20${APP}%20code%20is:%20${codeMobizon}`;
    const messageES = `Tu%20código%20${APP}%20es:%20${codeMobizon}`;

    const Message: Message = {
      pt: messagePT,
      en: messageEN,
      es: messageES,
    };

    const hashedCode =
      deviceOS === 'android' ? `%0A%0A%0AFA+${this.androidSmsHash}` : '';

    let message = Message.pt;

    if (Object.keys(Message).includes(language)) {
      message = Message[language as keyof Message];
    }

    const messageToSend = `${message}${hashedCode}`;

    const mobizonResponse = await this.send(messageToSend, phone);
    return mobizonResponse;
  }

  private async send(message: string, phone: string): Promise<MobizonResponse> {
    const msg = `recipient=${phone}&text=${message}&params%5Bvalidity%5D=1440`;

    try {
      const response = await axios.post(
        `${this.baseUrlMobizon}/service/message/sendsmsmessage?output=json&api=v1&apiKey=${this.mobizonApiKey}`,
        msg,
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'cache-control': 'no-cache',
            withCredentials: true,
          },
        },
      );

      if (response.data.code !== 0) {
        return {
          success: false,
          errorMessage: response.data.message,
        };
      }

      return {
        success: true,
        data: {
          campaignId: response.data.data.campaignId,
          messageId: response.data.data.messageId,
        },
      };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          typeof error === 'object' && error !== null
            ? (error as Error).message
            : String(error),
      };
    }
  }
}
