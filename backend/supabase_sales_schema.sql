create table if not exists sales (
  id bigint generated always as identity primary key,
  product_id bigint references products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric not null,
  sold_at date not null default current_date,
  created_at timestamptz default now()
);

alter table sales enable row level security;

-- Solo cuentas autenticadas (admin/empleado) pueden ver o escribir ventas.
-- A proposito NO hay policy publica: esta tabla nunca debe ser legible por
-- el catalogo publico ni por el API de FastAPI.
create policy "Authenticated read sales" on sales
  for select using (auth.role() = 'authenticated');

create policy "Authenticated write sales" on sales
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
