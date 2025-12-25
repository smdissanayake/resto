import React from 'react';
import { MenuItem, MenuItemType } from './MenuItem';
interface MenuItemGridProps {
  items: MenuItemType[];
  onAdd: (item: MenuItemType) => void;
}
export function MenuItemGrid({
  items,
  onAdd
}: MenuItemGridProps) {
  return <div className="h-full overflow-y-auto p-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
        {items.map(item => <MenuItem key={item.id} item={item} onAdd={onAdd} />)}
      </div>
    </div>;
}