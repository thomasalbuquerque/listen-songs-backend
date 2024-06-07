import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, Connection, connect } from 'amqplib';

@Injectable()
export class RabbitmqService {
  private readonly user: string;
  private readonly password: string;
  private readonly host: string;
  private readonly port: string;
  private channel: Channel | undefined;

  constructor(private readonly configService: ConfigService) {
    this.user = this.configService.getOrThrow<string>('RABBITMQ_USER');
    this.password = this.configService.getOrThrow<string>('RABBITMQ_PASS');
    this.host = this.configService.getOrThrow<string>('RABBITMQ_HOST');
    this.port = this.configService.getOrThrow<string>('RABBITMQ_PORT');
  }

  public async execute(queue: string, message: string) {
    await this.start();
    await this.publishInQueue(queue, message);
  }

  private async start(): Promise<void> {
    const uri: string = `amqp://${this.user}:${this.password}@${this.host}:${this.port}`;

    const conn: Connection | undefined = await connect(uri);
    this.channel = await conn.createChannel();
  }

  private async publishInQueue(queue: string, message: string) {
    return this.channel?.sendToQueue(queue, Buffer.from(message));
  }
}
