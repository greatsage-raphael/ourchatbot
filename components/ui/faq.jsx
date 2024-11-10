'use client';
import { FAQList } from '../../lib/faqslist';
import { motion } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';

export default function Feature({ locale, langName = 'en' }) {
  let list = FAQList[`FAQ_${langName.toUpperCase()}`] || [];
  return (
    <section id="faq" className="relative py-10 text-white md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
        }}
      >
        <div className="relative z-10 mx-auto mb-10 flex flex-col items-start gap-5 md:items-center">
          <div className="border-base-content primary-gradient primary-shadow group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-gray-800 px-5 py-1 text-lg font-semibold md:px-10 md:py-3 md:text-2xl">
            <div className="z-10 inline-flex items-center justify-center gap-2 ">
              <FaQuestionCircle /> <h2 className="text-white">FAQs</h2>
            </div>
            <div className="bg-base-content absolute z-[0] h-full w-0"></div>
          </div>

          <h3 className="from-base-content bg-gradient-to-r from-50% to-[#9c9c9c] bg-clip-text text-3xl font-bold !leading-[1.25em] text-transparent md:text-center md:text-5xl">
            Frequently Asked Questions
          </h3>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
        }}
      >
        <div className="relative z-10 mx-auto flex w-full flex-col gap-5 md:w-10/12">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="bg-muted hover:bg-muted/50 primary-gradient primary-shadow flex items-center justify-between rounded-md border-gray-800 px-4 py-3 font-medium text-white transition-colors">
                <span>What is an AI Customer Support Chatbot?</span>
                <div className="text-muted-foreground h-5 w-5" />
              </AccordionTrigger>
              <AccordionContent className=" mt-2 bg-background text-muted-foreground primary-gradient primary-shadow rounded-md border border-gray-800 px-4 py-3 shadow-sm">
                <p>
                  An AI Customer Support Chatbot is an intelligent virtual
                  assistant powered by Gemini AI that provides 24/7 automated
                  customer service by understanding and responding to customer
                  queries based on your website's content. It acts as a
                  first-line support system, handling common customer questions
                  and issues automatically.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger className="bg-muted hover:bg-muted/50 primary-gradient primary-shadow flex items-center justify-between rounded-md border-gray-800 px-4 py-3 font-medium text-white transition-colors">
                <span>How do I set up the chatbot for my website?</span>
                <div className="text-muted-foreground h-5 w-5" />
              </AccordionTrigger>
              <AccordionContent className=" mt-2 bg-background text-muted-foreground primary-gradient primary-shadow rounded-md border border-gray-800 px-4 py-3 shadow-sm">
                <p>
                  Setting up is simple and takes just a few steps: 1) Paste your
                  website URL in the designated field. 2) Select your preferred
                  language from the available options. 3) Wait while Gemini AI
                  analyzes your website content. 4) Review and customize the
                  generated responses if needed. 5) Deploy the chatbot to your
                  website using the provided integration code.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger className="bg-muted hover:bg-muted/50 primary-gradient primary-shadow flex items-center justify-between rounded-md border-gray-800 px-4 py-3 font-medium text-white transition-colors">
                <span>What languages does the chatbot support?</span>
                <div className="text-muted-foreground h-5 w-5" />
              </AccordionTrigger>
              <AccordionContent className=" mt-2 bg-background text-muted-foreground primary-gradient primary-shadow rounded-md border border-gray-800 px-4 py-3 shadow-sm">
                <p>
                  The chatbot supports multiple languages thanks to Gemini AI's
                  advanced language processing capabilities. You can select your
                  preferred language during setup, and the chatbot will
                  automatically handle customer queries in that language, making
                  it ideal for businesses with a global customer base.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger className="bg-muted hover:bg-muted/50 primary-gradient primary-shadow flex items-center justify-between rounded-md border-gray-800 px-4 py-3 font-medium text-white transition-colors">
                <span>How does the chatbot learn about my business?</span>
                <div className="text-muted-foreground h-5 w-5" />
              </AccordionTrigger>
              <AccordionContent className=" mt-2 bg-background text-muted-foreground primary-gradient primary-shadow rounded-md border border-gray-800 px-4 py-3 shadow-sm">
                <p>
                  The chatbot automatically scans and analyzes your website
                  content to build a comprehensive knowledge base about your
                  business. It uses Gemini AI to understand your products,
                  services, policies, and common customer queries, ensuring
                  accurate and relevant responses to customer questions.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5">
              <AccordionTrigger className="bg-muted hover:bg-muted/50 primary-gradient primary-shadow flex items-center justify-between rounded-md border-gray-800 px-4 py-3 font-medium text-white transition-colors">
                <span>Can I customize the chatbot's responses?</span>
                <div className="text-muted-foreground h-5 w-5" />
              </AccordionTrigger>
              <AccordionContent className=" mt-2 bg-background text-muted-foreground primary-gradient primary-shadow rounded-md border border-gray-800 px-4 py-3 shadow-sm">
                <p>
                  Yes, you can customize the chatbot's responses. While it
                  automatically generates responses based on your website
                  content, you can review and modify the system propmt it uses to answer queries during setup 
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6">
              <AccordionTrigger className="bg-muted hover:bg-muted/50 primary-gradient primary-shadow flex items-center justify-between rounded-md border-gray-800 px-4 py-3 font-medium text-white transition-colors">
                <span>Is the chatbot available 24/7?</span>
                <div className="text-muted-foreground h-5 w-5" />
              </AccordionTrigger>
              <AccordionContent className="mt-2 bg-background text-muted-foreground primary-gradient primary-shadow rounded-md border border-gray-800 px-4 py-3 shadow-sm">
                <p>
                  Yes, the chatbot provides round-the-clock customer support
                  without any downtime. It can handle multiple customer
                  conversations simultaneously, ensuring your customers receive
                  immediate assistance at any time, even outside of business
                  hours.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </motion.div>

      <div className="absolute left-[50%] top-[30%] z-0 hidden md:block">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      </div>
    </section>
  );
}
