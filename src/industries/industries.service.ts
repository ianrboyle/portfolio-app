import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Industry } from './industries.entity';

@Injectable()
export class IndustriesService {
  constructor(@InjectRepository(Industry) private repo: Repository<Industry>) {}
}
