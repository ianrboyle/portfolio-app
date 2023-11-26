import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('FDFDSFAs');
    return 'Hello World!';
  }
}
