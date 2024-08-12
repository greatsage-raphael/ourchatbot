
"use client"

import { IconMusic, IconMicrophone, IconFileMusic , IconPlayerPlay, IconExternalLink, IconDownload} from "@tabler/icons-react";
import endent from "endent";
import { ChangeEvent, KeyboardEvent, SVGProps, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { genAI, supabase, embedTranscription, transcribeAudio, dub } from '@/scripts/admin';
import { useUser } from "@clerk/nextjs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebaseConfig";
import { getCurrentFormattedDate } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { GeminiGenerate } from "../../scripts/generate"
import { generateAndSaveQuiz } from "../../scripts/quiz"
import { fetchFlashcards } from "../../scripts/flashCards"
import { Answer } from "@/components/ui/Answer/Answer";
import { LanguageSelect } from "@/components/ui/languageSelect";
import { RecentQuizSets } from "@/components/ui/recentQuizzes";
import ResultCard from "@/components/ui/webResult";
import { FlashcardArray } from "react-quizlet-flashcard";
import copy from 'copy-to-clipboard';
import { useToast } from "../../components/ui/useToast";


interface tracks {
  id: number;
  userid: string;
  audiourl: string;
  dateadded: string;
  maintopic: string;
  audiolecture: boolean;
  transcription: string;
  transcription_token_count: number;
  embedding: string;
}

interface lecture {
  userid: string,
  audiourl: string,
  dateadded: string,
  maintopic: string,
  audiolecture: boolean,
  transcription: string
}

interface TavilySearchParams {
  api_key: string;
  query: string;
  search_depth?: 'basic' | 'advanced';
  include_images?: boolean;
  include_answer?: boolean;
  include_raw_content?: boolean;
  max_results?: number;
  include_domains?: string[];
  exclude_domains?: string[];
}

interface TavilySearchResult {
  answer?: string;
  query: string;
  response_time: string;
  follow_up_questions?: string[];
  images?: string[];
  results: {
    title: string;
    url: string;
    content: string;
    raw_content?: string;
    score: number;
  }[];
}

interface webResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
}

interface flashCard {
  id: number;
  question: string;
  answer: string
}

const voiceNames: { [key: string]: string } = {
  "af-ZA": "af-ZA-Standard-A",
  "ar-XA": "ar-XA-Standard-A", 
  "eu-ES": "eu-ES-Standard-A",
  "bn-IN": "bn-IN-Standard-A",
  "bg-BG": "bg-BG-Standard-A",
  "ca-ES": "ca-ES-Standard-A",
  "yue-HK": "yue-HK-Standard-A",
  "cs-CZ": "cs-CZ-Standard-A",
  "da-DK": "da-DK-Standard-A",
  "nl-BE": "nl-BE-Standard-A",
  "nl-NL": "nl-NL-Standard-A",
  "en-AU": "en-AU-Standard-A",
  "en-IN": "en-IN-Standard-A",
  "en-GB": "en-GB-Standard-A",
  "en-US": "en-US-Journey-O",
  "fil-PH": "fil-PH-Standard-A",
  "fi-FI": "fi-FI-Standard-A",
  "fr-CA": "fr-CA-Standard-A",
  "fr-FR": "fr-FR-Standard-A",
  "gl-ES": "gl-ES-Standard-A",
  "de-DE": "de-DE-Standard-A",
  "el-GR": "el-GR-Standard-A",
  "gu-IN": "gu-IN-Standard-A",
  "he-IL": "he-IL-Standard-A",
  "hi-IN": "hi-IN-Standard-A",
  "hu-HU": "hu-HU-Standard-A",
  "is-IS": "is-IS-Standard-A",
  "id-ID": "id-ID-Standard-A",
  "it-IT": "it-IT-Standard-A",
};

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [system, setSystem] = useState<string>("");
  const [chunks, setChunks] = useState<lecture[]>([]);
  const [webResults, setWebResults] = useState<webResult[]>([]);
  const [flashCards, setFlashcards] = useState<flashCard[] | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [sourcesLoading, setSourcesLoading] = useState<boolean>(false);
  const [flashCardsLoading, setFlashcardsLoading] = useState<boolean>(false)
  const [answerLoading, setAnswerLoading] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [podcastTime, setPodcastTime] = useState<number>(5);
  const [title, setTitle] = useState('Record your voice note');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [pdfText, setPdfText] = useState<string>('');
  const [tracks, setTracks] = useState<tracks[]>([]);
  const [lectures, setLectures] = useState<lecture[]>([]);
  const [name, setName] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [language, setLanguage] = useState<string>('en-US');
  const [voiceName, setVoiceName] = useState<string>(voiceNames["en-US"]);
  const [date, setDate] = useState("")
  const [retrievedLectures, setRetrievedLectures] = useState<boolean>(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [quizId, setQuizId] = useState('');
  const [copied, setCopied] = useState(false);
  const { user } = useUser();

  const { toast } = useToast()
  //console.log("USER", user)

  //Convert Tailwind CSS classes to style objects
  const primaryGradient = {
    background: 'linear-gradient(267deg, #4402d2 -9.43%, #040218 -9.42%, rgba(63, 17, 100, 0.94) 4.63%, rgba(14, 14, 18, 0.82) 127.55%)',
  };
  
  const primaryShadow = {
    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  }

  const cardStyle = {
    ...primaryGradient,
    ...primaryShadow,
    color: 'white',
    borderColor: '#1F2937', // border-gray-800 equivalent
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  };

  

  const handleClick = async () => {
    // const response = await fetch('/api/links', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ url: `${window.location.origin}/quiz/${quizId}` }),
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to create short link');
    // }

    // const data = await response.json();

    // console.log("LINK", data)

    // if (data.error) {
    //   throw new Error(data.error);
    // }

    // const shortLink = data.shortLink
    //console.log("RES", response)
    await copy(`${window.location.origin}/quiz/${quizId}` );
    setCopied(true);
    toast({
      description: "Quiz Link copied successfully",
    });
  };
  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let audioChunks: BlobPart[] = [];

    recorder.ondataavailable = (e: BlobEvent) => {
      audioChunks.push(e.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      //console.log("AudioBlob: ", audioBlob);

      const filename = `${uuidv4()}.mp3`;
      if (user) {
        const userId = user.id;
        const storageRef = ref(storage, `users/${userId}/audio/${filename}`);

        try {
          const snapshot = await uploadBytes(storageRef, audioBlob);
          const downloadURL = await getDownloadURL(snapshot.ref);
          const transcriptionResult = await transcribeAudio(downloadURL);
          const transcription = transcriptionResult?.TranscriptionReport ?? 'No transcription available';
          const topic = transcriptionResult?.topic ?? "No Topic Detected";

          setQuery(transcription)
          //handleGeneration()

          const model = genAI.getGenerativeModel({ model: "models/gemini-1.0-pro-latest"});
          const tokenCount = await model.countTokens(transcription)
          const tokenNumber = tokenCount.totalTokens

          const embeddings = await embedTranscription(transcription)
          const formattedDate = getCurrentFormattedDate();
      
          const { data, error } = await supabase
            .from('notecast')
            .insert([{
              userid: userId ,
              audiourl: downloadURL ,
              dateadded: formattedDate ,
              maintopic: topic,
              audiolecture: false,
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
  }

  const handleRecordMouseDown = () => {
    setIsRecording(true)
    startRecording();
  };

  const handleRecordMouseUp = () => {
    stopRecording();
    setIsRecording(false)
  };

  const  textToSpeech = async (text: string, languageCode: string, voiceName:string) => {
    setAudioUrl('');

    const data = {
      text,
      languageCode,
      voiceName,
    };

  

    try {
      setDate('')
      const formattedDate = getCurrentFormattedDate();
      const response = await fetch('https://red-delight-414207.uc.r.appspot.com/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setAudioUrl(result.downloadURL);
      setDate(formattedDate)
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the audio');
    } finally {
      return true
    }
  };

  // const getFlashCards = async (text: string) => {
  //   try{
  //     const flashCards = await fetchFlashcards(text);
  //     const transformedCards = flashCards.map((card: any) => ({
  //       ...card,
  //       frontCardStyle: cardStyle,
  //       backCardStyle: cardStyle,
  //       className: 'custom-card',
  //     }));
    
  //     setFlashcards(transformedCards);

  //   } catch(error){
  //     console.error(error)
  //     alert("an error occurred when generating flash cards")
  //   }finally {
  //     return true
  //   }
  // }


  const handleGeneration = async () => {
    if (!query) {
      alert("Please enter a query.");
      return;
    }
    setRetrievedLectures(false)
    setAnswer("");
    setQuizId("")
    setChunks([]);
    setAnswerLoading(true);
    setSourcesLoading(true)
    setAudioLoading(true)
    setFlashcardsLoading(true)
    setQuizLoading(true)
    setCopied(false)
    

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, userid: user?.id })
    });


    if (!searchResponse.ok) {
      setSourcesLoading(false)
      throw new Error(searchResponse.statusText);
    }

    const results = await searchResponse.json();
    //console.log("CHUNKS :", Array.isArray(results.data))
    setChunks(results);
    setSourcesLoading(false)

    const DBsearchResults = results?.map((d: any) => d.content).join("\n\n")

    async function searchTavily(): Promise<TavilySearchResult | null> {

      const params: TavilySearchParams = {
        api_key: "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",
        query: query,
        search_depth: 'basic',
        include_images: false,
        include_answer: true,
        include_raw_content: false,
        max_results: 5
      };
      const url = 'https://api.tavily.com/search';
      const headers = {
        'Content-Type': 'application/json'
      };
    
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(params)
      });
    
      if (response.ok) {
        const data: TavilySearchResult = await response.json();
        return data;
      } else {
        console.error('Error:', response.statusText);
        return null;
      }
    }


    const rawinternetSearchResults = await searchTavily();

    const internetSearchResults = JSON.stringify(rawinternetSearchResults);

    if(rawinternetSearchResults)

      setWebResults(rawinternetSearchResults.results)
    
    //console.log("Internet Results :", rawinternetSearchResults.results)

    const answer = await GeminiGenerate(DBsearchResults, internetSearchResults, query, language, podcastTime)

    setAnswerLoading(false);

    let stream = '';
for await (const chunk of answer.stream) {
  const chunkText = chunk.text();
  //console.log(chunkText);
  stream += chunkText;
  setAnswer((prevCode: string) => prevCode + chunkText);
}

try {
  const audio = await textToSpeech(stream, language, voiceName);

  if(audio){
    setAudioLoading(false)
   }

  const quizId = await generateAndSaveQuiz(stream, query)

  if(quizId){
    setQuizId(quizId)
    setQuizLoading(false)
   }

  //  const flashCards = await fetchFlashcards(stream);
  //     const transformedCards = flashCards.map((card: any) => ({
  //       ...card,
  //       frontCardStyle: cardStyle,
  //       backCardStyle: cardStyle,
  //       className: 'custom-card',
  //     }));
    
  //     setFlashcards(transformedCards);

  //  if(flashCards){
  //    setFlashcardsLoading(false)
  //  }
  
} catch (error) {
  console.error("Error generating media; ", error);
}
  };


  

  const handleSave = () => {
    localStorage.setItem("PODCAST_TIME", podcastTime.toString());
    setShowSettings(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    localStorage.removeItem("PODCAST_TIME");
    setPodcastTime(5);
    setUploadStatus(null)
  };

  useEffect(() => {
    if (podcastTime > 20) {
      setPodcastTime(20);
    } else if (podcastTime < 1) {
      setPodcastTime(1);
    }
  }, [podcastTime]);

  
  //it should depend o more than page load
  // add the lectures to local storage too
  useEffect(() => {
    const handleRead = async () => {
      try {
        const response = await fetch("/api/read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid: user?.id })
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
    
        const results = await response.json();
        if (response.ok) {
          //console.log("Tracks: ", results); 
          setLectures(results);
          setTracks(results)
          setRetrievedLectures(true)

        } else {
          console.error("Error reading data:", results.error);
        }
      } catch (error) {
        console.error("Error in handleRead:", error);
      } 
    };
    
    handleRead();
  }, [lectures]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if(user){
      const userId = user.id
      const fileName = file.name

    try {
      let uploadRoute = '';

      if (file.type === 'application/pdf' || file.type === 'text/plain') {
        uploadRoute = 'https://red-delight-414207.uc.r.appspot.com/uploadPdfs';
      } else if (file.type === 'image/png' || file.type === 'image/jpeg') {
        uploadRoute = 'https://red-delight-414207.uc.r.appspot.com/uploadImage';
      } else if (file.type.startsWith('audio/')) {
        uploadRoute = 'https://red-delight-414207.uc.r.appspot.com/uploadAudio';
      } else if (file.type.startsWith('video/')) {
        uploadRoute = 'https://red-delight-414207.uc.r.appspot.com/uploadVideo';
      } else {
        throw new Error('Unsupported file type');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('pdfName', fileName);

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const response = await fetch(uploadRoute, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus(`${file.name} uploaded successfully`);
      } else {
        setUploadStatus(`${file.name} unable to upload. Please try again later.`);
      }
    } catch (error) {
      setUploadStatus('An error occurred during the upload');
      console.error('An error occurred during the upload:', error);
    }
  }
  }

  async function handleTranscriptDownload(transcription: string, name: string) {
    const blob = new Blob([transcription], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.txt`;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  }


  return (
    <>
  <div className="flex flex-col h-screen">
    <div className="flex-1 overflow-auto">
      <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
        <button
          className="primary-gradient primary-shadow border-gray-800 mt-4 flex cursor-pointer items-center space-x-2 rounded-full border px-3 py-1 text-sm hover:opacity-50 text-white"
          onClick={() => setShowSettings(!showSettings)} >
          {showSettings ? "Hide" : "Show"} Settings
        </button>

        {showSettings && (
          <div className="w-[340px] sm:w-[400px]">
            <div className="mt-2">
            <div className="text-white">Language</div>
            <LanguageSelect
              language={language}
              onChange={(value) => {
              setLanguage(value);
              setVoiceName(voiceNames[value]);
              }}
            />

<div className="mt-2">
<div className="text-white">Add to knowledge Base:
{uploadStatus && (
        <p className="mt-2 text-sm text-gray-700">{uploadStatus}</p>
      )}
</div>
<div className="text-gray-600 text-sm">pdfs, images, audio and video can all be uploded</div>
<input
  type="file"
  className="w-60 bg-white border border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-2 placeholder-gray-500 text-gray-900"
  id="medicalImage"
  accept="image/*,application/pdf,text/plain,audio/*,video/*"
  onChange={handleFileChange}
  required
/>

          </div>

           
            </div>

            <div className="mt-4 flex space-x-2 justify-center">
              <div
                className="flex cursor-pointer items-center space-x-2 rounded-full bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                onClick={handleSave}
              >
                Save
              </div>

              <div
                className="flex cursor-pointer items-center space-x-2 rounded-full bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                onClick={handleClear}
              >
                Clear
              </div>
            </div>
          </div>
        )}


        <div className="relative w-full mt-4">
                <IconMusic className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />

                <input
                  ref={inputRef}
                  className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
                  type="text"
                  placeholder="Whats a relational DB"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                /> 
                <br />

                <button
                  onMouseDown={handleRecordMouseDown}
                  onMouseUp={handleRecordMouseUp}
                  className="cursor-pointer" >
                      <IconMicrophone   
                        className={`primary-gradient primary-shadow border-gray-800 cursor-pointer absolute right-2 top-2.5 h-7 w-7 rounded-full  p-1 hover:cursor-pointer hover:bg-purple-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white ${isRecording ? "bg-red-500" : ""}`}/>
                </button>

              </div>
              <div className="flex items-center gap-10 mb-6 ">
              <Button
        className="primary-gradient primary-shadow border-gray-800 cursor-pointer rounded-md px-4 py-2 font-bold text-white active:bg-slate-700"
        onClick={handleGeneration}>
        Generate
        </Button>
        <Button
        className="primary-gradient primary-shadow border-gray-800 cursor-pointer rounded-md px-4 py-2 font-bold text-white active:bg-slate-700"
        onClick={() => setQuery('')}>
         Clear
         </Button>
    </div>



        
    {answerLoading && (
          <div className="mt-6 w-full">
              <>
                <div className="font-bold text-2xl text-white">Answer</div>
                <div className="animate-pulse mt-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                </div>
              </>
          </div>
        )}

{audioLoading && (
          <div className="mt-6 w-full">
            <div className="font-bold text-2xl mt-6 text-white">Generated Audio Lecture</div>
            <div className="animate-pulse mt-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded mt-2"></div>
            </div>
          </div>
        )}

{quizLoading && (
          <div className="mt-6 w-full">
            <div className="font-bold text-2xl mt-6 text-white">Quiz</div>
            <div className="animate-pulse mt-2">
              <div className="h-4 bg-gray-300 rounded mt-2"></div>
            </div>
          </div>
        )}

{/* {flashCardsLoading && (
          <div className="mt-6 w-full">
            <div className="font-bold text-2xl mt-6 text-white">FlashCards Loading: </div>
            <div className="animate-pulse mt-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded mt-2"></div>
            </div>
          </div>
        )} */}

    {sourcesLoading && (
          <div className="mt-6 w-full">
            <div className="font-bold text-2xl mt-6 text-white">Sources</div>
            <div className="animate-pulse mt-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded mt-2"></div>
              <div className="h-4 bg-gray-300 rounded mt-2"></div>
              <div className="h-4 bg-gray-300 rounded mt-2"></div>
              <div className="h-4 bg-gray-300 rounded mt-2"></div>
            </div>
          </div>
        )} 

{answer && (
          <div className="mt-6 text-white my-3">
            <div className="font-bold text-2xl mb-2 text-white">Answer:</div>
            <Answer text={answer} />
            {audioUrl && (
              <>
              <div className="font-bold text-2xl mb-1 text-white mt-3">Generated Audio Lecture:</div>
              <a
                      className="hover:opacity-50 ml-2"
                      href={audioUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                  <div className="primary-gradient primary-shadow border-gray-800 flex items-center justify-between rounded-md bg-muted p-3 bg-white mt-2">
                    <div className="flex items-center gap-3">
                      <IconFileMusic className="w-6 h-6 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-white">{query}</h4>
                        <p className="text-sm text-muted-foreground text-white">{date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <IconPlayerPlay className="w-5 h-5 text-purple-600" />
                    </Button>
                  </div>
                  </a>
                  </> )}
    
{quizId && (
  <>
  <div className="font-bold text-2xl mb-2 text-white mt-3">Quiz: </div>
          <a
            className="hover:opacity-50 ml-2"
            href={`/quiz/${quizId}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button className="primary-gradient primary-shadow border-gray-800 animate-pulse h-16 w-26 mx-3">
              Start: {query}
            </Button> 
          </a>
           <a>
            <Button className="primary-gradient primary-shadow border-gray-800 animate-pulse h-16 w-26" onClick={handleClick}>
            {copied ? 'Copied!' : 'Copy Quiz Link'}
            </Button>
           </a>
          </>
        )}
        {/* {flashCards && (
   <div>
      <FlashcardArray cards={flashCards} />
    </div>
)} */}

          </div>
        )}
{chunks.length > 0 && (
          <div className="mt-6 pb-16">
            <div className="font-bold text-2xl text-white">Sources</div>
            <div className="font-bold text-1xl text-white m-3">Your Content:</div>
            {chunks.map((chunk, index) => (
              <div key={index}>
                <a
                      className="hover:opacity-50 ml-2"
                      href={chunk.audiourl}
                      target="_blank"
                      rel="noreferrer"
                    >
                <div className="primary-gradient primary-shadow border-gray-800 mt-4 border border-zinc-600 rounded-lg p-4 text-white">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold text-xl">{chunk.maintopic}</div>
                      <div className="mt-1 font-bold text-sm">{chunk.dateadded}</div>
                    </div>
                    
                      <IconExternalLink />
                    
                  </div>
                  <div className="mt-2">{chunk.transcription}</div>
                </div>
                </a>
              </div>
            ))}
          </div>
        )}


{webResults && (
  <>
  <div>
            {
            webResults.map((result, index) => (
              <>
              <div className="font-bold text-1xl text-white m-3">Web sources:</div>
        <ResultCard key={index} result={result} />
        </>
      ))}
    </div>
  </> 
)}

{retrievedLectures && (
          <>
          <Link href='/record'>
            <div className="mt-6 text-center text-lg text-white">
              Ask a question based on the lectures recorded and notes uploaded. when ready hold the record botton and ask your question, when done stop hold.
            </div>
          </Link>
          <div className="flex w-full max-w-4xl gap-8 mt-8 flex-1">
          <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">Knowledge Base: </h3>
          {lectures.map((lecture, index) => (
                  <div key={index} className="primary-gradient primary-shadow border-gray-800 flex items-center justify-between rounded-md bg-muted p-3 bg-white ">
                    <div className="flex items-center gap-3">
                      <IconFileMusic className="w-6 h-6 text-white-400" />
                      <div>
                        <h4 className="font-medium text-white ">{lecture.maintopic}</h4>
                        <p className="text-sm text-muted-foreground text-white">{lecture.dateadded}</p>
                      </div>
                    </div>
                    <div>
                    <Link
            href={lecture.audiourl}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            View Media
            <IconExternalLink className="w-5 h-5" />
          </Link>
                    <div>
                    <button
      onClick={() => handleTranscriptDownload(lecture.transcription, lecture.maintopic)}
      className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
    >
      Download Transcript
      <IconDownload className="w-5 h-5" />
    </button>
                    </div>
                  </div>
                  </div>
                ))}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  </div>
</>

  );
}


function loadingIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
<svg width="30" height="30" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#000">
    <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 67 67"
            to="-360 67 67"
            dur="2.5s"
            repeatCount="indefinite"/>
    </path>
    <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 67 67"
            to="360 67 67"
            dur="8s"
            repeatCount="indefinite"/>
    </path>
</svg>
 )
}

