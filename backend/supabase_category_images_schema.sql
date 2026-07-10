alter table categories add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('category-images', 'category-images', true)
on conflict (id) do nothing;

create policy "Public read category images" on storage.objects
  for select using (bucket_id = 'category-images');

create policy "Authenticated write category images" on storage.objects
  for all using (bucket_id = 'category-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'category-images' and auth.role() = 'authenticated');
