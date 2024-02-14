import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Industry } from './industries.entity';
import { Sector } from '../sectors/sector.entity';

@Injectable()
export class IndustriesService {
  constructor(@InjectRepository(Industry) private repo: Repository<Industry>) {}

  create(industryName: string, sector: Sector) {
    const industry = this.repo.create({ industryName });
    industry.sector = sector;
    return this.repo.save(industry);
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('Invalid User Id');

    const industry = await this.repo.findOneBy({ id });

    if (!industry)
      throw new NotFoundException(`Sector With ID: ${id} Not Found`);

    return industry;
  }

  async find(industryName: string) {
    const industries = await this.repo.find({ where: { industryName } });
    return !industries || industries.length <= 0 ? null : industries[0];
  }

  async update(id: number, attrs: Partial<Industry>) {
    const industry = await this.findOne(id);

    Object.assign(industry, attrs);
    return this.repo.save(industry);
  }

  async remove(id: number) {
    const industry = await this.findOne(id);
    if (!industry) {
      console.log('error hit');
      throw new NotFoundException('industry Not Found');
    }
    return this.repo.remove(industry);
  }
}
