import { useState } from "react";

export interface ResultTime {
    departure: string,
    arrival: string
}


export interface TripInfo {
  stationName: string;
  arrivalTime: string;
}

export interface ScheduleResult {
    dayType: string;
    results: ResultTime[]
    directionText: string;
    sourceStationName: string;
    destinationStationName: string;
    isHoliday: boolean;
    trips: TripInfo[];
    nextDepartureTime: string;
}

export default function ScheduleDisplay ({ dayType, results, directionText, sourceStationName, nextDepartureTime, trips }: ScheduleResult) {

    
    const [showLineTab, setShowLineTab] = useState(false);

    if (!trips || trips.length === 0) {
        return (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
            <h2 className="text-xl font-semibold text-cyan-400">{directionText}</h2>
            <p className="text-sm text-gray-400">برنامه امروز ({dayType})</p>
            </div>
            <div className="text-center py-8">
            <p className="text-yellow-400 text-lg rtl">
                متاسفانه قطار دیگری برای امروز از این ایستگاه وجود ندارد.
            </p>
            </div>
        </div>
        );
    }
    
    return (
        <div className="mt-8 w-full md:max-w-80 bg-blue-400 p-6 rounded-lg shadow-lg animate-fade-in rtl">
            
            <div className='flex gap-2'>
                <button onClick={() => setShowLineTab(true)} className="cursor-pointer bg-blue-800 rounded-lg text-white px-2 py-1">Show Line</button>
                <button onClick={() => setShowLineTab(false)} className="cursor-pointer bg-blue-800 rounded-lg text-white px-2 py-1">Show Schedule</button>
            </div>

            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
            <div>
                <h2 className="text-xl font-semibold text-cyan-900">{directionText}</h2>
                { dayType && <p className="text-sm text-blue-800">برنامه امروز ({dayType})</p> }
            </div>
            </div>
    
            {results && results.length > 0 ? (
                
                <div >
                    {   !showLineTab &&
                    <div>
                        <p className="mb-4 rtl text-gray-700 font-vazir">
                        {results.length} حرکت بعدی از ایستگاه <strong className="text-yellow-600 font-vazir">{sourceStationName}</strong>:
                        </p>
                        <div
                            className="flex flex-col gap-1"
                        >
                            <div className="flex justify-between items-center">
                                <span>حرکت از مبدا</span>
                                <span>رسیدن به مقصد</span>
                            </div>
                            {
                                results.map((resultTime, index) => (
                                    <div key={index} className="bg-gray-700 flex justify-between items-center p-3 rounded-md shadow-md">
                                        <span className="text-2xl font-vazir font-bold tracking-wider">{resultTime.departure}</span>
                                        <span className="text-2xl font-vazir font-bold tracking-wider">{resultTime.arrival}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    }
                    {/* لیست زمان‌بندی سفر */}
                    {   showLineTab &&
                    <div className="relative pl-4">
                        {/* خط عمودی تایم‌لاین */}
                        <div className="absolute right-26.5 top-0 bottom-0 w-0.5 bg-gray-600" style={{ left: '2.3rem' }}></div>
                    
                        <ul className="space-y-4">
                        {trips.map((stop, index) => (
                            <li key={index} className="flex items-center space-x-4 space-x-reverse">
                                {/* زمان */}
                                <div className="z-10 bg-gray-900 px-2 py-1 rounded-md border border-gray-600">
                                    <p className="text-lg font-vazir font-bold text-white">{stop.arrivalTime}</p>
                                </div>
                                
                                {/* دایره روی خط تایم‌لاین */}
                                <div className={`z-10 w-4 h-4 rounded-full ${index === 0 ? 'bg-cyan-400' : 'bg-gray-400'} border-2 border-gray-900`}></div>
                                
                                {/* نام ایستگاه */}
                                <p className={`text-md ${index === 0 ? 'font-bold text-cyan-400' : 'text-gray-300'}`}>
                                    {stop.stationName}
                                    {index === 0 && ' (مبدا)'}
                                    {index === trips.length - 1 && ' (مقصد)'}
                                </p>
                            </li>
                        ))}
                        </ul>
                    </div>
                    }
                </div>
            ) : (
            <div className="text-center py-8">
                <p className="text-yellow-400 text-lg rtl">
                متاسفانه قطار دیگری برای امروز از این ایستگاه وجود ندارد.
                </p>
            </div>
            )}
        </div>
    );
}
