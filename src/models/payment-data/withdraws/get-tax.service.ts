import { BadGatewayException, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import * as TokenABI from '../../../common/contracts/TokenABI.json';
import * as PancakeSwapRouterABI from '../../../common/contracts/PancakeSwapRouter.json';
import Decimal from 'decimal.js';
import { I18nService } from '../../../common/i18n/i18n.service';

@Injectable()
export class GetTaxService {
  private nodeUrl: string;
  private wMaticContractAddress: string;
  private tokenContractAddress: string;
  private companyPrivateKey: string;
  private companyPublicAddress: string;
  private quickSwapRouterAddress: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
  ) {
    this.nodeUrl = this.configService.getOrThrow<string>('NODE_URL');
    this.wMaticContractAddress = this.configService.getOrThrow<string>(
      'WMATIC_CONTRACT_ADDRESS',
    );
    this.tokenContractAddress = this.configService.getOrThrow<string>(
      'TOKEN_CONTRACT_ADDRESS',
    );
    this.companyPrivateKey = this.configService.getOrThrow<string>(
      'COMPANY_PRIVATE_KEY',
    );
    this.companyPublicAddress = this.configService.getOrThrow<string>(
      'COMPANY_PUBLIC_ADDRESS',
    );
    this.quickSwapRouterAddress = this.configService.getOrThrow<string>(
      'QUICKSWAP_ROUTER_ADDRESS',
    );
  }

  async getTax() {
    const tax = await this.estimateTransactionTax();
    if (tax === false) {
      throw new BadGatewayException(
        this.i18nService.t('payment_data.withdraw.error_calculating_tax'),
      );
    }
    return tax;
  }

  private async estimateTransactionTax() {
    try {
      const NODE_URL = this.nodeUrl;
      const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

      const inputTokenAddress = this.wMaticContractAddress;
      const outputTokenAddress = this.tokenContractAddress;

      const privateKey = this.companyPrivateKey;
      const wallet = new ethers.Wallet(privateKey, provider);

      const tokenContract = new ethers.Contract(
        outputTokenAddress,
        TokenABI,
        wallet,
      );

      const valueInWei = ethers.utils.parseUnits('10', 18);
      const toAddress = this.companyPublicAddress;
      const gasEstimate = await tokenContract.estimateGas.transfer(
        toAddress,
        valueInWei,
      );
      const currentGasPrice = await provider.getGasPrice();
      const estimateTransactionFee = gasEstimate
        .mul(currentGasPrice)
        .div(ethers.BigNumber.from('100'))
        .mul(ethers.BigNumber.from('110'));

      const quickSwapRouterAddress = this.quickSwapRouterAddress;
      const quickSwapRouter = new ethers.Contract(
        quickSwapRouterAddress,
        PancakeSwapRouterABI,
        provider,
      );

      const amountsOut = await quickSwapRouter.getAmountsOut(
        estimateTransactionFee,
        [inputTokenAddress, outputTokenAddress],
      );
      const amountOutMin = amountsOut[1];

      const gasPrice = new Decimal(ethers.utils.formatEther(amountOutMin));

      return gasPrice;
    } catch (error) {
      console.log('Error on getTax', error);
      return false;
    }
  }
}
