alter table products add column if not exists sort_order bigint;

update products set sort_order = id where sort_order is null;

create index if not exists products_sort_order_idx on products (sort_order);
