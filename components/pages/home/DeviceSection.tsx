import Feature from "../../ui/feature"
import Faq from "../../ui/faq"

const DeviceSection = () => {

  const langName = "en"
  const feature = langName


  return (
    <div className='max-w-[1280px] mx-auto text-white'>
      <div className="flex w-full items-center">
      <Feature
				locale={feature}
				langName={langName}
			/>
      </div>
      <Faq
				locale={feature}
				langName={langName}
			/>
    </div>
  );
};

export default DeviceSection;
