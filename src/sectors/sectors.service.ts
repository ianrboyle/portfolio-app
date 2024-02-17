import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from './sector.entity';

@Injectable()
export class SectorsService {
  constructor(@InjectRepository(Sector) private repo: Repository<Sector>) {}

  create(sectorName: string) {
    const sector = this.repo.create({ sectorName });
    return this.repo.save(sector);
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException(`Invalid Sector Id: ${id}`);

    const sector = await this.repo.findOneBy({ id });

    if (!sector) throw new NotFoundException(`Sector With ID: ${id} Not Found`);

    return sector;
  }

  async find(sectorName: string) {
    const sectors = await this.repo.find({ where: { sectorName } });

    return !sectors || sectors.length <= 0 ? null : sectors[0];
  }

  async update(id: number, attrs: Partial<Sector>) {
    const sector = await this.findOne(id);

    Object.assign(sector, attrs);
    return this.repo.save(sector);
  }

  async remove(id: number) {
    const sector = await this.findOne(id);
    if (!sector) {
      console.log('error hit');
      throw new NotFoundException('sector Not Found');
    }
    return this.repo.remove(sector);
  }
}
