import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  @Header('Content-Type', 'application/json')
  getHello(): { status: number; message: string } {
    return {
      status: 200,
      message: "Welcome to VUZ task API!",
    };
  }
}
