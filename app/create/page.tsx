'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Plus, Trash, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';
import {
  generateFAQsFromText,
  saveAboutData,
  saveChatbotData,
} from '../../scripts/faq';
import { GeminiGenerateAbout } from '../../scripts/generate';
import { LanguageSelect } from '@/components/ui/languageSelect';
import { supabase } from '@/scripts/admin';
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface FAQ {
  faq: string;
  Answer: string;
}

interface ScrapedData {
  name: string;
  description: string;
  socialLinks: string[];
  phoneNumbers: string[];
  allTextContent: string;
  emails: string[];
  jsonData: any[];
  location: string;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

export default function Component() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [editableName, setEditableName] = useState('');
  const [error, setError] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [about, setAbout] = useState('');
  const [faqLoading, setFaqLoading] = useState(false);
  const [language, setLanguage] = useState<string>('en-US');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setScrapedData(null);
    setEditableName('');
    setFaqLoading(true);

    if (!url) {
      setError('Please enter a URL');
      setLoading(false);
      setFaqLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://red-delight-414207.uc.r.appspot.com/scrape', {
        url: url,
      });

      if (!response) {
        throw new Error('Failed to fetch scraped data');
      }

      const data: ScrapedData = response.data;
      console.log('scraped data', data);
      setScrapedData(data);
      setEditableName(data.name);
      setLoading(false);

      const answer = await GeminiGenerateAbout(data.allTextContent, language);
      let stream = '';
      for await (const chunk of answer.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        stream += chunkText;
        setAbout((prevCode: string) => prevCode + chunkText);
      }
      const generatedFaqs = await generateFAQsFromText(data.allTextContent, language);
      setFaqs(generatedFaqs);
      setFaqLoading(false);
      console.log('FAQS: ', generatedFaqs);

      // const handleSaveChanges = async () => {
      //   // Generate a new UUID for chatbotId
      //   const chatbotId = uuidv4();

      //   const scrapedData = data;
      //   if (user) {
      //     const userId = user.id;

      //     try {
      //       await saveChatbotData({
      //         userId,
      //         scrapedData,
      //         language,
      //         about,
      //         generatedFaqs,
      //         chatbotId,
      //       });
      //       console.log('Data saved successfully!');
      //     } catch (error) {
      //       console.error('Error saving data:', error);
      //     }
      //   }
      // };
    } catch (err) {
      setError('Failed to fetch website data. Please ensure the URL is valid.');
    } finally {
      setFaqLoading(false);
    }
  };

  const handleSaveChanges = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!scrapedData || !user) {
      setError('No data to save or user not logged in.');
      return;
    }

    const chatbotId = uuidv4();
    const userId = user.id;

    const aboutId = uuidv4();

    try {
      await saveChatbotData({
        userId,
        scrapedData,
        language,
        about,
        faqs,
        chatbotId,
        selectedColor
      });

      await saveAboutData({
        aboutId,
        userId,
        about,
        chatbotId,
      });

      console.log('Data About saved successfully!');
      console.log('Data saved successfully!');
      router.push(`/chatbot/${chatbotId}`);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleReset = () => {
    setUrl('');
    setScrapedData(null);
    setEditableName('');
    setError('');
    setAbout('');
    setFaqLoading(false);
    setSelectedColor("#000000")
  };

  const handleInputChange = (field: keyof ScrapedData, value: any) => {
    if (scrapedData) {
      setScrapedData({ ...scrapedData, [field]: value });
    }
  };

  const handleArrayChange = (
    field: keyof ScrapedData,
    index: number,
    value: string,
  ) => {
    if (scrapedData) {
      const newArray = [...(scrapedData[field] as string[])];
      newArray[index] = value;
      setScrapedData({ ...scrapedData, [field]: newArray });
    }
  };

  const handleAddArrayItem = (field: keyof ScrapedData) => {
    if (scrapedData) {
      setScrapedData({
        ...scrapedData,
        [field]: [...(scrapedData[field] as string[]), ''],
      });
    }
  };

  const handleRemoveArrayItem = (field: keyof ScrapedData, index: number) => {
    if (scrapedData) {
      const newArray = (scrapedData[field] as string[]).filter(
        (_, i) => i !== index,
      );
      setScrapedData({ ...scrapedData, [field]: newArray });
    }
  };

  const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
    const newFAQs = [...faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFaqs(newFAQs);
  };

  const handleAddFAQ = () => {
    setFaqs([...faqs, { faq: '', Answer: '' }]);
  };

  const handleRemoveFAQ = (index: number) => {
    const newFAQs = faqs.filter((_, i) => i !== index);
    setFaqs(newFAQs);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {!loading && !scrapedData ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Paste a Website Link
            </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-2 mt-2 mb-4">
                <div className="text-black">Language Select</div>
                <LanguageSelect
                  language={language}
                  onChange={(value) => {
                    setLanguage(value);
                  }}
                />
              </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="text"
                  placeholder="https://www.example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
          <div className="mt-6 w-full">
            <div className="mt-6 text-2xl font-bold text-white">
              Scraping Website Data
            </div>
            <div className="mt-2 animate-pulse">
              <div className="mt-2 h-4 rounded bg-gray-300"></div>
              <div className="mt-2 h-4 rounded bg-gray-300"></div>
              <div className="mt-2 h-4 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      ) : scrapedData ? (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Scraped Website Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={scrapedData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={scrapedData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Social Links</Label>
                {scrapedData.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={link}
                      onChange={(e) =>
                        handleArrayChange('socialLinks', index, e.target.value)
                      }
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleRemoveArrayItem('socialLinks', index)
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={() => handleAddArrayItem('socialLinks')}>
                  <Plus className="mr-2 h-4 w-4" /> Add Social Link
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Phone Numbers</Label>
                {scrapedData.phoneNumbers.map((phone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={phone}
                      onChange={(e) =>
                        handleArrayChange('phoneNumbers', index, e.target.value)
                      }
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleRemoveArrayItem('phoneNumbers', index)
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={() => handleAddArrayItem('phoneNumbers')}>
                  <Plus className="mr-2 h-4 w-4" /> Add Phone Number
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allTextContent">All Text Content</Label>
                <Textarea
                  id="allTextContent"
                  value={scrapedData.allTextContent}
                  onChange={(e) =>
                    handleInputChange('allTextContent', e.target.value)
                  }
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutSection">About Section (Generated)</Label>
                <Textarea
                  id="aboutSection"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={5}
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label>Emails</Label>
                {scrapedData.emails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={email}
                      onChange={(e) =>
                        handleArrayChange('emails', index, e.target.value)
                      }
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveArrayItem('emails', index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={() => handleAddArrayItem('emails')}>
                  <Plus className="mr-2 h-4 w-4" /> Add Email
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={scrapedData.location}
                  onChange={(e) =>
                    handleInputChange('location', e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>FAQs</Label>
                {faqLoading ? (
                  <div className="flex items-center justify-center rounded-md bg-gray-100 p-4">
                    <div className="w-400 max-w-md rounded-lg bg-gray-100 p-6 shadow-lg">
                      <div className="mt-6 w-full">
                        <div className="mt-6 text-2xl font-bold text-black">
                          Generating faqs
                        </div>
                        <div className="mt-2 animate-pulse">
                          <div className="mt-2 h-4 rounded bg-gray-400"></div>
                          <div className="mt-2 h-4 rounded bg-gray-400"></div>
                          <div className="mt-2 h-4 rounded bg-gray-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="space-y-2 rounded-md border p-4"
                      >
                        <div className="flex items-center space-x-2">
                          <Input
                            value={faq.faq}
                            onChange={(e) =>
                              handleFAQChange(index, 'faq', e.target.value)
                            }
                            placeholder="Question"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveFAQ(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={faq.Answer}
                          onChange={(e) =>
                            handleFAQChange(index, 'Answer', e.target.value)
                          }
                          placeholder="Answer"
                          rows={3}
                        />
                      </div>
                    ))}
                    <Button onClick={handleAddFAQ}>
                      <Plus className="mr-2 h-4 w-4" /> Add FAQ
                    </Button>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorPicker">Choose a Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    id="colorPicker"
                    value={selectedColor}
                    onChange={handleColorChange}
                    className="h-12 w-12 rounded-md p-1"
                  />
                  <Input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  Scrape Another Website
                </Button>
                <Button className="flex-1" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
      {error && (
        <Alert variant="destructive" className="mt-4 w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
