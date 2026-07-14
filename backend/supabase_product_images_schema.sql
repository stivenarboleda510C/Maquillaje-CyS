create table if not exists product_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references products(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

alter table product_images enable row level security;

create policy "Public read product images" on product_images
  for select using (true);

create policy "Authenticated write product image rows" on product_images
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into product_images (product_id, image_url, sort_order)
select id, image_url, 0
from products
where image_url is not null;

alter table products drop column if exists image_url;
