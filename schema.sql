-- RUN 1st
create extension vector;

-- RUN 2nd
create table noteCast (
  id bigserial primary key,
  userId text,
  audioUrl text,
  dateAdded text,
  mainTopic text,
  audioLecture boolean,
  transcription text,
  transcription_token_count bigint,
  embedding vector (768)
);

-- RUN 3rd
create or replace function noteCast_search (
  user_id text,
  query_embedding vector(768),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  userId text,
  audioUrl text,
  dateAdded text,
  mainTopic text,
  audioLecture boolean,
  transcription text,
  transcription_token_count bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    noteCast.id,
    noteCast.userId,
    noteCast.audioUrl,
    noteCast.dateAdded,
    noteCast.mainTopic,
    noteCast.audioLecture,
    noteCast.transcription,
    noteCast.transcription_token_count,
    1 - (noteCast.embedding <=> query_embedding) as similarity
  from noteCast
  where noteCast.userId = user_id
    and 1 - (noteCast.embedding <=> query_embedding) > similarity_threshold
  order by noteCast.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on noteCast 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- RUN 5th: Create quiz_set table
create table quiz_set (
  id text primary key,
  user_id uuid not null,
  url text not null,
  title text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- RUN 6th: Create quiz table
create table quiz (
  id text primary key,
  quizset_id text not null references quiz_set(id),
  question text not null,
  answer_index smallint not null,
  explanation text not null,
  created_at timestamp with time zone default now() not null
);

-- RUN 7th: Create quiz_option table
create table quiz_option (
  id text primary key,
  quiz_id text not null references quiz(id),
  index smallint not null,
  text text not null,
  created_at timestamp with time zone default now() not null
);
