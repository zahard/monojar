export interface JarTransaction {
  id: string;
  time: number;
  comment?: string;
  description: string;
  amount: number;
  balance: number;
  mcc?: number;
  originalMcc?: number;
  operationAmount?: number;
  currencyCode?: number;
  commissionRate?: number;
  cashbackAmount?: number;
  hold?: boolean;
}
