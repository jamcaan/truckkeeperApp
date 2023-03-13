export interface States {
  id: string;
  longname: string;
  shortname: string;
}

export interface Commission {
  id: string;
  value: number;
  percentage: string;
}

export interface ExpensesCatergory {
  id: string;
  type: Type[];
}

interface Type {
  type: string;
}
