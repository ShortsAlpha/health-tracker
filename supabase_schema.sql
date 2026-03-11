-- Sadece çalıştırılmamış olan Koşular (Runs) tablosunu ve yetkisini ekliyoruz.
-- Önceki tablolar ("metrics", "workouts", vb.) zaten mevcut.

create table if not exists runs (
  id bigint primary key generated always as identity,
  date timestamp with time zone not null,
  duration numeric not null, -- second or minute, depends on app
  distance numeric not null, -- km or meters
  calories integer,
  average_heart_rate integer,
  steps integer,
  route_data jsonb, -- JSON Array of coordinates
  created_at timestamp with time zone default now()
);

alter table runs enable row level security;
create policy "Enable all for anon (Personal App)" on runs for all using (true) with check (true);
