export interface Loads {
  id?: string;
  loadnumber: string;
  date: string;
  from: string;
  destination: string;
  amount: number;
  commPercentage: number;
  driverId?: string;
}


export interface PayStubSummary {
  id: string;
  paystubDate: Date;
  loadnumbers: string[];
  dates: string[];
  from: string[];
  destination: string[];
  commission: number[];
  amount: number[];
  totalAmount: number;
  totalCommission: number;
  totalExpense: number;
  netAmount: number;
  ytdGross?: number;
  ytdNet?: number;
  driverId?: string;
}
