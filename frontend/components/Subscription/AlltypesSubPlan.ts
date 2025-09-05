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
  priority_listed: string;
  dashboard: string;
  real_time_notifications: string;
}
