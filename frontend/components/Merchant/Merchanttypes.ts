export interface Restaurant {
  id: number;
  name: string;
  address: string;
  rating: number;
  imageurl: string;
  cities: Cities;
  restaurant_timings: RestaurantTiming[];
}

export interface Cities {
  city_name: string;
  states: States;
}

export interface States {
  state_name: string;
  countries: Countries;
}

export interface Countries {
  country_name: string;
}

export interface RestaurantTiming {
  restaurant_id: number;
  week_day: string;
  start_time: string;
  end_time: string;
  id: number;
}

export interface Menu {
  id: number;
  restaurant_id: number;
  category_id: number;
  item_name: string;
  description: string;
  image_url: string;
  price: number;
  menu_categories: MenuCategories;
  menu_variants: MenuVariant[];
}

export interface MenuCategories {
  id: number;
  cat_name: string;
}

export interface MenuVariant {
  id: number;
  menu_id: number;
  variety_name: string;
  price: number;
}

export interface Category {
  id: string;
  cat_name: string;
}
