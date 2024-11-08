create table
  ourchatbot_main (
    chat_id text PRIMARY KEY 
    userid text,
    name text,
    description text,
    language text,
    social_links JSONB,
    phone_numbers JSONB,
    emails JSONB,
    color text,
    about text,
    location text,
    faqs JSONB
  );

create table
  ourchatbot_about (
    id text primary key,
    userid text,
    chatbotId TEXT NOT NULL REFERENCES ourchatbot_main(chat_id),
    about text,
    embedding vector (768)
  );

-- RUN 3rd
create
or replace function ourchatbot_about_search (
  chatbot_id text,
  query_embedding vector (768),
  similarity_threshold float,
  match_count int
) returns table (
  id text,
  chatbotId text,
  about text,
  similarity float
) language plpgsql as $$
begin
  return query
  select
    ourchatbot_about.id,
    ourchatbot_about.chatbotId,
    ourchatbot_about.about,
    1 - (ourchatbot_about.embedding <=> query_embedding) as similarity
  from ourchatbot_about
  where ourchatbot_about.chatbotId = chatbot_id
    and 1 - (ourchatbot_about.embedding <=> query_embedding) > similarity_threshold
  order by ourchatbot_about.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on ourchatbot_about using ivfflat (embedding vector_cosine_ops)
with
  (lists = 100);