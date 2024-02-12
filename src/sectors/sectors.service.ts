import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from './sector.entity';

@Injectable()
export class SectorsService {
  constructor(@InjectRepository(Sector) private repo: Repository<Sector>) {}
}
