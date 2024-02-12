import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Profile } from './models/profile';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FinancialModelingPrepService {
  private readonly logger: Logger;
  private readonly apiKey: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(FinancialModelingPrepService.name);
    this.apiKey = this.configService.get<string>(
      'FINANCIAL_MODELING_PREP_API_KEY',
    );
  }

  getCompanyProfile = async (symbol: string): Promise<Profile> => {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Profile[]>(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${this.apiKey}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new ServiceUnavailableException(
              `Error fetching company profile from FinancialModelingPrep for symbol: ${symbol}. Error Response: ${JSON.stringify(
                error.response.data,
              )}`,
            );
          }),
        ),
    );
    return !data || data.length <= 0 ? null : data[0];
  };
}
