import Link from 'next/link';

const Banner = () => {
  return (
    <div className="relative h-[400px] w-full  px-4 md:h-[605px] md:px-6 lg:px-8 xl:px-10 2xl:px-0">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <a
          href="https://note-cast.vercel.app/generate"
          target="_blank"
          rel="noreferrer"
          className="mb-5 cursor-pointer rounded-2xl border border-black px-4 py-1 text-sm text-slate-600 transition duration-300 ease-in-out hover:text-slate-700 sm:text-base"
        >
          Powered by <span className="font-bold">Google Gemini </span>
        </a>
        <h1 className="inline-block text-center text-2xl font-medium tracking-tighter text-dark lg:text-7xl">
          Create Your Own 24/7 Customer Support chatbot <br className="hidden lg:inline-block" />
          by pasting your website link
        </h1>
        <p className="mt-8 text-center text-xl font-light tracking-tight lg:text-3xl text-dark">
          Paste your website link, select you preferred language and create a chatbot tailored to your {' '}
          <span className="font-bold">
            Bussiness <br className="hidden lg:inline-block" />
          </span>{' '}
           using {' '} <span className="font-bold">
            Gemini AI <br className="hidden lg:inline-block" />
          </span>{' '}
        </p>
        {/* <Link
          href={'/record'}
          className="primary-gradient primary-shadow mx-auto mt-16 flex max-w-xl items-center justify-center gap-5 rounded-full px-4 py-2 text-center text-sm text-light md:px-12 md:py-4 md:text-2xl"
        >
          Get Started
          <img
            src="/icons/get-started.svg"
            alt="get started icon"
            className="mt-2 h-6 w-6 md:h-9 md:w-9"
          />
        </Link> */}
      </div>
      {/* background gradient */}
      <div className="absolute bottom-0 left-0 right-0 top-0 z-[-1] hidden h-full w-full grid-cols-3 md:grid">
        <BackgroundGradient />
        <BackgroundGradient />
        <BackgroundGradient />
      </div>
    </div>
  );
};

function BackgroundGradient() {
  return (
    <div
      className="h-full w-full rounded-full"
      style={{
        opacity: '0.4',
        background:
          'radial-gradient(54.14% 54.14% at 50% 50%, #650293 0%, rgba(103, 2, 139, 0.02) 100%)',
        filter: 'blur(177px)',
      }}
    />
  );
}

export default Banner;
