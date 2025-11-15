
export interface ResultTime {
    departure: string,
    arrival: string
}


export interface ScheduleResult {
    dayType: string;
    results: ResultTime[]
    directionText: string;
    sourceStationName: string;
    isHoliday: boolean;
}

export default function ScheduleDisplay ({ dayType, results, directionText, sourceStationName }: ScheduleResult) {

    return (
        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg animate-fade-in rtl">
            <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
            <div>
                <h2 className="text-xl font-semibold text-cyan-500">{directionText}</h2>
                { dayType && <p className="text-sm text-blue-900">برنامه امروز ({dayType})</p> }
            </div>
            </div>
    
            {results && results.length > 0 ? (
            <div>
                <p className="mb-4 rtl text-gray-300 font-vazir">
                {results.length} حرکت بعدی از ایستگاه <strong className="text-yellow-400 font-vazir">{sourceStationName}</strong>:
                </p>
                <div
                    className="flex flex-col gap-3"
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
