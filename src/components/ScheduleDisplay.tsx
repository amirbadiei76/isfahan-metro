
export interface ScheduleResult {
    dayType: string;
    departures: string[];
    directionText: string;
    sourceStationName: string;
}

export default function ScheduleDisplay ({ dayType, departures, directionText, sourceStationName }: ScheduleResult) {
    return (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
            <div>
                <h2 className="text-xl font-semibold text-cyan-400">{directionText}</h2>
                <p className="text-sm text-gray-400">برنامه امروز ({dayType})</p>
            </div>
            </div>
    
            {departures.length > 0 ? (
            <div>
                <p className="mb-4 rtl text-gray-300">
                {departures.length} حرکت بعدی از ایستگاه <strong className="text-yellow-400">{sourceStationName}</strong>:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
                {departures.map((time, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded-md shadow-md">
                    <p className="text-2xl font-mono font-bold tracking-wider">{time}</p>
                    </div>
                ))}
                </div>
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