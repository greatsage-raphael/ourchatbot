--  RUN 1st
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

-- RUN 3rd after running the scripts
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