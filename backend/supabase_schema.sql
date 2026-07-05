create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  category text,
  stock integer default 0,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Public read access" on products
  for select using (true);

insert into products (name, description, price, image_url, category, stock) values
  ('Labial Mate Rojo Pasion', 'Labial de larga duracion, acabado mate', 12.99, 'https://picsum.photos/seed/labial1/400', 'Labios', 50),
  ('Base Liquida Natural', 'Cobertura media, tono natural', 18.50, 'https://picsum.photos/seed/base1/400', 'Rostro', 30),
  ('Paleta de Sombras Sunset', '12 tonos calidos', 24.00, 'https://picsum.photos/seed/sombras1/400', 'Ojos', 20),
  ('Mascara de Pestanas Volumen', 'Efecto volumen extremo', 9.99, 'https://picsum.photos/seed/mascara1/400', 'Ojos', 40),
  ('Rubor en Polvo Durazno', 'Acabado natural', 11.50, 'https://picsum.photos/seed/rubor1/400', 'Rostro', 25);
