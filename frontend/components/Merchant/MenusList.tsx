'use client';
import { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import type { Menu, MenuVariant } from './Merchanttypes';
import { Button } from '@/components/ui/button';
import AddMenu from './AddMenus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChefHat,
  Plus,
  Trash2,
  DollarSign,
  ImageIcon,
  Package,
} from 'lucide-react';
import Image from 'next/image';

const MenusList = ({ restaurantId }: { restaurantId: string }) => {
  const [menus, setMenus] = useState<Menu>();
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/restaurants/${restaurantId}/menus`);
        setMenus(res.data);
      } catch (error) {
        console.error(handleError(error));
      }
    }
    fetchData();
  }, [restaurantId, refresh]);

  async function deleteMenu(menuId: number) {
    try {
      const res = await api.delete(
        `/restaurants/${restaurantId}/menus/${menuId}`
      );
      setRefresh((prev) => !prev);
      console.log('success', res.data);
    } catch (error) {
      console.error(handleError(error));
    }
  }

  if (!menus || Object.keys(menus).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Menus Found
            </h2>
            <p className="text-slate-600 mb-8">
              Start building your menu by adding your first item
            </p>
            <Button onClick={() => setOpen(true)} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Your First Menu Item
            </Button>
          </div>
        </div>
        {open && (
          <AddMenu
            restaurantId={restaurantId}
            setOpen={setOpen}
            open={open}
            refetch={setRefresh}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Restaurant Menu
            </h1>
            <p className="text-slate-600 text-lg">
              Manage your menu items and categories
            </p>
          </div>
          <Button onClick={() => setOpen(true)} size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Add Menu Item
          </Button>
        </div>
        <div className="space-y-8">
          {Object.entries(menus).map(([categoryName, items]) => (
            <div key={categoryName} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {categoryName}
                </h2>
                <Badge variant="secondary" className="ml-2">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item: Menu) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white group"
                  >
                    <div className="relative h-48 bg-gradient-to-r from-orange-100 to-red-100">
                      {item.image_url ? (
                        <Image
                          src={`http://localhost:5000${item.image_url}`}
                          alt={item.item_name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMenu(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-slate-900 line-clamp-2">
                        {item.item_name}
                      </CardTitle>
                      {item.description && (
                        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      {item.menu_variants && item.menu_variants.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-700">
                              Pricing Options
                            </span>
                          </div>

                          <div className="space-y-2">
                            {item.menu_variants.map((variant: MenuVariant) => (
                              <div
                                key={variant.id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                              >
                                <div>
                                  <span className="font-medium text-slate-900">
                                    {variant.variety_name}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-bold text-green-600">
                                    ${variant.price}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {open && (
          <AddMenu
            restaurantId={restaurantId}
            setOpen={setOpen}
            open={open}
            refetch={setRefresh}
          />
        )}
      </div>
    </div>
  );
};

export default MenusList;
