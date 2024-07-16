<a href="https://usenotesgpt.com/">
  <img alt="NotesGPT – AI-powered voice note taking in seconds." src="/public/images/og-image.png">
  <h1 align="center">notesGPT</h1>
</a>

<p align="center">
  Generate action items from your notes in seconds. Powered by Convex, Together.ai, and Whisper.
</p>

<p align="center">
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#future-tasks"><strong>Future Tasks</strong></a>
</p>
<br/>

## Tech Stack

- [Gemini API](https://convex.dev/) for the generating embeddings and generating lecture text
- Next.js [App Router](https://nextjs.org/docs/app) for the framework
- [Deepgram](https://dub.sh/together-ai) for STT and TTS 
- [Firebase storage](https://dub.sh/together-ai) for file storage
- [Supabase](https://docs.convex.dev/file-storage) for database including embedding storage
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Deploy Your Own

You can deploy this template by setting up the following services and adding their environment variables:

1. Run `npm install` to install dependencies.
2. Run `npm run dev`. 

