create table if not exists ads (
  id bigint generated always as identity primary key,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

alter table ads enable row level security;

create policy "Public read ads" on ads
  for select using (true);

create policy "Authenticated write ads" on ads
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('ads', 'ads', true)
on conflict (id) do nothing;

create policy "Public read ad images" on storage.objects
  for select using (bucket_id = 'ads');

create policy "Authenticated write ad images" on storage.objects
  for all using (bucket_id = 'ads' and auth.role() = 'authenticated')
  with check (bucket_id = 'ads' and auth.role() = 'authenticated');
