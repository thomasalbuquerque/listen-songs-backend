export class StakePhraseEntity {
  phrase: string;
  publicAddress: string;
  privateAddress: string;

  constructor(phrase: string, publicAddress: string, privateAddress: string) {
    this.phrase = phrase;
    this.publicAddress = publicAddress;
    this.privateAddress = privateAddress;
  }
}
