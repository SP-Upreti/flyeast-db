import { Eye } from 'lucide-react';
import React from 'react'

interface PricingPlan {
    name: string;
    price: string;
    yearlyPrice: string;
    period: string;
    features: { cat: string; feature: string[] }[];
    description: string;
    buttonText: string;
    href: string;
    isPopular: boolean;
}



export default function List({ plans }: { plans: PricingPlan }) {
    const [showAll, setShowAll] = React.useState(false);
    const limit = showAll ? plans.features.length : 1;
    return (
        <div>
            <ul className="mt-5 gap-2 flex flex-col">
                {plans.features.slice(0, limit).map((feature, idx) => (
                    <>
                        <h2 className="text-xl font-bold">{feature.cat}</h2>
                        <ul>
                            {feature.feature.map((item, ind) => (
                                <li key={ind}>{item}</li>
                            ))}
                        </ul>

                    </>
                ))}
                {plans.features.length >= 2 && (
                    <button onClick={() => setShowAll(!showAll)} className="text-sm text-red-500 border-b border-transparent hover:border-red-500 w-fit mx-auto transition-all duration-100 cursor-pointer">
                        {showAll ? <p className='flex gap-2 justify-center items-center font-semibold'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" className='size-5'><path fill="currentColor" d="m20.523 21.937l7.77 7.77a1 1 0 0 0 1.414-1.414l-26-26a1 1 0 1 0-1.414 1.414l5.156 5.157c-4.116 3.28-5.37 8.242-5.438 8.515l-.003.011a.503.503 0 0 0 .98.22c.068-.29 1.204-5.015 5.146-8.061l3.927 3.926A6 6 0 0 0 9.998 18c0 3.31 2.69 6 6 6c1.804 0 3.425-.8 4.525-2.063m-.708-.708A4.99 4.99 0 0 1 15.998 23c-2.76 0-5-2.24-5-5c0-1.53.688-2.9 1.77-3.816zm-4.262-9.213l1.016 1.016a5.005 5.005 0 0 1 4.397 4.397l1.016 1.016q.016-.22.016-.445a6.005 6.005 0 0 0-6.445-5.984m-4.99-4.99l.76.761C12.669 7.295 14.218 7 15.999 7c10.46 0 12.91 10.18 13.01 10.61c.06.23.26.39.49.39q.021 0 .047-.005q.03-.004.063-.005c.27-.06.44-.33.38-.6v-.004C29.92 17.116 27.19 6 15.997 6c-2.096 0-3.895.39-5.436 1.026"></path></svg> View Less</p> : <p className='flex gap-2 justify-center items-center font-semibold'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" className='size-5'><path fill="currentColor" d="M15.998 24c-3.31 0-6-2.69-6-6s2.69-6 6-6s6 2.69 6 6s-2.69 6-6 6m0-11c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m13.5 5a.51.51 0 0 1-.49-.39c-.1-.43-2.55-10.61-13.01-10.61S3.088 17.18 2.988 17.61a.503.503 0 0 1-.98-.22C2.038 17.28 4.728 6 15.998 6s13.96 11.27 13.99 11.39c.06.27-.11.54-.38.6c-.04 0-.08.01-.11.01"></path></svg>
                            View All</p>}
                    </button>
                )}
            </ul>
        </div>
    )
}
