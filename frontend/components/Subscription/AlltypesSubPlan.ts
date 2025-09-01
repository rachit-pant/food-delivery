export interface Plan {
  month: Month[];
  year: Year[];
}

export interface Month {
  id: number;
  name: string;
  price: string;
  role_id: number;
  duration: string;
  features: Features;
}
export interface Features {
  discount: string;
  free_delivery: number;
}
// export interface Features {
//   commission_rate: string;
//   promotion_slots: number;
//   priority_support: boolean;
// }

export interface Year {
  id: number;
  name: string;
  price: string;
  role_id: number;
  duration: string;
  features: Features;
}
