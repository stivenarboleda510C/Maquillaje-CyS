-- Permite escribir en products solo a usuarios autenticados (el admin).
-- La lectura publica ("Public read access") ya existe desde supabase_schema.sql.
create policy "Authenticated write access" on products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Bucket para las fotos de producto subidas desde el panel admin.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Authenticated write product images" on storage.objects
  for all using (bucket_id = 'product-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
