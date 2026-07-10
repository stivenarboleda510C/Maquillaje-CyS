create table if not exists categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  created_at timestamptz default now()
);

create table if not exists subcategories (
  id bigint generated always as identity primary key,
  category_id bigint not null references categories(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique (category_id, name)
);

alter table categories enable row level security;
alter table subcategories enable row level security;

create policy "Public read categories" on categories
  for select using (true);

create policy "Authenticated write categories" on categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Public read subcategories" on subcategories
  for select using (true);

create policy "Authenticated write subcategories" on subcategories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

alter table products add column if not exists category_id bigint references categories(id) on delete set null;
alter table products add column if not exists subcategory_id bigint references subcategories(id) on delete set null;

insert into categories (name) values ('Maquillaje')
on conflict (name) do nothing;

insert into subcategories (category_id, name)
select c.id, v.name
from categories c
cross join (values ('Labios'), ('Ojos'), ('Rostro')) as v(name)
where c.name = 'Maquillaje'
on conflict (category_id, name) do nothing;

update products p
set category_id = c.id, subcategory_id = s.id
from subcategories s
join categories c on c.id = s.category_id
where c.name = 'Maquillaje' and s.name = p.category;

alter table products drop column if exists category;
