<p align="center">
  Generate notes, quizzes and talk with an interactive ai lecturer from your notes
</p>

## Tech Stack

- [Gemini API](https://ai.google.dev/gemini-api/docs/models/gemini) for generating embeddings, generating lecture text, quizzes and processing audio, video into text
- Next.js [App Router](https://nextjs.org/docs/app) for the framework
- [Deepgram](https://deepgram.com/) for STT and TTS 
- [Firebase storage](https://firebase.google.com/docs/firestore) for file storage of txt, audio, video
- [Supabase](https://supabase.com/) for database including embedding storage
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Deploy Your Own

You can deploy this template by setting up the following services and adding their environment variables:

1. Run `npm install` to install dependencies.
2. Run `npm run dev`. 

