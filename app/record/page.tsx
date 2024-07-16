'use client'

import { useEffect, useState } from 'react';
import { getCurrentFormattedDate } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../utils/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { genAI, supabase, embedTranscription, transcribeAudio } from '@/scripts/admin';
import { arrayUnion, doc, setDoc } from 'firebase/firestore';

const RecordVoicePage = () => {
  const [title, setTitle] = useState('Record your voice note');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const { user } = useUser();
  const router = useRouter();

  
  

  async function startRecording() {
    setIsRunning(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let audioChunks: BlobPart[] = [];

    recorder.ondataavailable = (e: BlobEvent) => {
      audioChunks.push(e.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      console.log("AudioBlob: ", audioBlob);

      const filename = `${uuidv4()}.mp3`;
      if (user) {
        const userId = user.id;
        const storageRef = ref(storage, `users/${userId}/audio/${filename}`);

        try {
          const snapshot = await uploadBytes(storageRef, audioBlob);
          //console.log('Uploaded an audio file!');

          const downloadURL = await getDownloadURL(snapshot.ref);

          // Make the API call to transcribe the audio
          const transcriptionResult = await transcribeAudio(downloadURL);

          // Use optional chaining and nullish coalescing to provide default values if undefined
          const transcription = transcriptionResult?.TranscriptionReport ?? 'No transcription available';
          const topic = transcriptionResult?.topic ?? "No Topic Detected";

          console.log("TOPIC FR:", topic)

          const model = genAI.getGenerativeModel({ model: "models/gemini-1.0-pro-latest"});

          const tokenCount = await model.countTokens(transcription)
          const tokenNumber = tokenCount.totalTokens

          //console.log("TOKENCOUNT: ", tokenNumber)

          //create embeddings from transcription
          const embeddings = await embedTranscription(transcription)

          // Save metadata to Firestore
       const formattedDate = getCurrentFormattedDate();
      
      const { data, error } = await supabase
      .from('notecast')
      .insert([{
         userid: userId ,
         audiourl: downloadURL ,
         dateadded: formattedDate ,
         maintopic: topic,
         audiolecture: true,
         transcription: transcription,
         transcription_token_count: tokenNumber,
         embedding: embeddings,
        }])
      .select()

      if (error) {
        console.log("Supabase Error:", error);
      } else {
        console.log("Saved", data);
      }

        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    };

    setMediaRecorder(recorder);
    recorder.start();
  }

  function stopRecording() {
    mediaRecorder?.stop();
    setIsRunning(false);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  function formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  const handleRecordClick = () => {
    if (title === 'Record your voice note') {
      setTitle('Recording...');
      startRecording();
    } else if (title === 'Recording...') {
      setTitle('Processing...');
      stopRecording();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between">
      <h1 className="pt-[25px] text-center text-xl font-medium text-dark md:pt-[47px] md:text-4xl">
        {title}
      </h1>
      <p className="mb-20 mt-4 text-gray-400">{getCurrentFormattedDate()}</p>
      <div className="relative mx-auto flex h-[316px] w-[316px] items-center justify-center">
        <div className={`recording-box absolute h-full w-full rounded-[50%] p-[12%] pt-[17%] ${title !== 'Record your voice note' && title !== 'Processing...' ? 'record-animation' : ''}`}>
          <div className="h-full w-full rounded-[50%]" style={{ background: 'linear-gradient(#E31C1CD6, #003EB6CC)' }} />
        </div>
        <div className="z-50 flex h-fit w-fit flex-col items-center justify-center">
          <h1 className="text-[60px] leading-[114.3%] tracking-[-1.5px] text-light">
            {formatTime(Math.floor(totalSeconds / 60))}:{formatTime(totalSeconds % 60)}
          </h1>
        </div>
      </div>
      <div className="mt-10 flex w-fit items-center justify-center gap-[33px] pb-7 md:gap-[77px]">
        <button onClick={handleRecordClick} className="mt-10 h-fit w-fit rounded-[50%] border-[2px]" style={{ boxShadow: '0px 0px 8px 5px rgba(0,0,0,0.3)' }}>
          {!isRunning ? (
            <Image src={'/icons/nonrecording_mic.svg'} alt="recording mic" width={148} height={148} className="h-[70px] w-[70px] md:h-[100px] md:w-[100px]" />
          ) : (
            <Image src={'/icons/recording_mic.svg'} alt="recording mic" width={148} height={148} className="h-[70px] w-[70px] animate-pulse transition md:h-[100px] md:w-[100px]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default RecordVoicePage;


