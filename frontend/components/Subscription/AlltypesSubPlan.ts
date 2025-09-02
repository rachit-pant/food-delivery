// export interface Plans {
//   id: number;
//   name: string;
//   price: string;
//   role_id: number;
//   duration: string;
//   features: Features;
//   stripe_price_id: string;
// }

// export interface Features {
//   discount: string;
//   free_delivery: number;
// }

// export interface SuperPlan extends Omit<Plans, 'features'> {
//   features: Features2;
// }
// export interface Features2 {
//   commission_rate: string;
//   promotion_slots: number;
//   priority_support: boolean;
// }
export interface Plans {
  id: number;
  name: string;
  price: string;
  role_id: number;
  duration: string;
  features: UserFeatures | MerchantFeatures;
  stripe_price_id: string;
}

export interface UserFeatures {
  discount: string;
  free_delivery: number;
}

export interface MerchantFeatures {
  commission_rate: string;
  promotion_slots: number;
  priority_support: boolean;
}
