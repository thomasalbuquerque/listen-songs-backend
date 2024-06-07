export enum Weight {
  'regular' = 'regular',
  'bold' = 'bold',
}

export class RuleDto {
  weight: Weight;
  text: string;
}
