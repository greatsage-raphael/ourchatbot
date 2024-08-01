'use client';
import { motion } from 'framer-motion';
import FeatureCard from '../ui/featureCard';
import { FeaturesList } from '../../lib/featuresList';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';

export default function Feature({ locale, langName = 'en' }) {
	let list = FeaturesList[`FRETURES_${langName.toUpperCase()}`] || [];

	return (
		<section
			id='feature'
			className='relative py-10 md:py-20'
		>
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.5,
				}}
			>
				<div className='relative z-10 flex flex-col gap-5 items-start md:items-center mb-10 mx-auto'>
					<div className='primary-gradient primary-shadow border-gray-800 relative inline-flex items-center justify-center gap-2 border-2 border-base-content px-5 md:px-10 py-1 md:py-3 rounded-full text-lg md:text-2xl font-semibold overflow-hidden hover:bg-base-content hover:text-base-100 transition-all'>
						<div className='inline-flex items-center justify-center gap-2 z-10 text-white '>
							<MdOutlineFeaturedPlayList /> <h2>Our Features</h2>
						</div>
						<div className='absolute w-0 h-full bg-base-content z-[0]'></div>
					</div>
				</div>
			</motion.div>

			<div className='relative z-10 w-full md:w-10/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 text-white'>
				{list.map((item, index) => {
					return (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.5,
							}}
						>
							<FeatureCard featureItem={item} />
						</motion.div>
					);
				})}
			</div>

			<div className='hidden md:block absolute left-[20%] top-[10%] z-0'>
				<div className='absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]'></div>
			</div>
		</section>
	);
}