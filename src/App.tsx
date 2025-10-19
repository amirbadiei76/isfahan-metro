import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { ResultTime, ScheduleResult } from './components/ScheduleDisplay';
import { stations } from './data/stations';
import { schedule } from './data/schedule';
import StationSelect from './components/StationSelect';
import ScheduleDisplay from './components/ScheduleDisplay';
import { getPersianStringDate, getPersianStringTime, getTodayTime, todayIsHoliday } from './utils/dateUtils';
import Header from './components/Header';


function App() {
        const [sourceStation, setSourceStation] = useState<string>('');
        const [destinationStation, setDestinationStation] = useState<string>('');
        const [today, setToday] = useState<Date>(getTodayTime());
        const [isHoliday, setIsHoliday] = useState<boolean>(todayIsHoliday());
        const [time, setTime] = useState<string>(getPersianStringTime())
        const [date, setDate] = useState<string>(getPersianStringDate());
        const [isOtherHoliday, setIsOtherHoliday] = useState(false);

        useEffect(() => {
          setIsOtherHoliday(false)

            setInterval(() => {
                const time = getPersianStringTime()
                const date = getPersianStringDate();
                const today = getTodayTime();
                const isHoliday = todayIsHoliday()

                setToday(today)
                setIsHoliday(isHoliday)
                setTime(time)
                setDate(date)
            }, 1000);
        }, [])

        const upcomingTrains = useMemo((): ScheduleResult | null => {
            if (!sourceStation || !destinationStation || sourceStation === destinationStation) {
              return null;
            }

            const source = stations.find(s => s.name === sourceStation);
            const destination = stations.find(s => s.name === destinationStation);

            if (!source || !destination) return null;

            const directionKey = source.id < destination.id ? 'qods_to_sofeh' : 'sofeh_to_qods';
            const dayTypeKey = (isHoliday || isOtherHoliday) ? 'holidays' : 'weekdays';
          
            const allDepartures = schedule[dayTypeKey][directionKey][sourceStation];
            const allArrivals = schedule[dayTypeKey][directionKey][destinationStation];

            const dayType = (isHoliday || isOtherHoliday) ? 'جمعه و روزهای تعطیل' : 'روزهای کاری';
            const directionText = `مسیر: ${source.name} به سمت ${destination.name}`;

            if (!allArrivals || !allDepartures) {
              return { isHoliday: (isHoliday! || isOtherHoliday), dayType: dayType, results: [], directionText: directionText, sourceStationName: '' };
            }

            
            const now = today!.getHours() * 60 + today!.getMinutes();
            const upcomingDepartures = allDepartures.filter(time => {
              const [hour, minute] = time.split(':').map(Number);
              return (hour * 60 + minute) >= now;
            });

            const upcomingArrivals: string[] = []

            upcomingDepartures.forEach((upItem) => {
                allDepartures.forEach((item, index) => {
                    if (item == upItem) {
                        upcomingArrivals.push(allArrivals[index])
                    }
                })
            })
            
            const results: ResultTime[] = []
            for (let index = 0; index < upcomingArrivals.length; index++) {
                results.push({
                  arrival: upcomingArrivals[index],
                  departure: upcomingDepartures[index]
                })
            }


            return {
              isHoliday: (isHoliday! || isOtherHoliday),
              dayType: dayType,
              results: results.slice(0, 5),
              directionText: directionText,
              sourceStationName: source.name,
            };
    }, [sourceStation, destinationStation, isOtherHoliday]);

    const handleSwap = () => {
        setSourceStation(destinationStation);
        setDestinationStation(sourceStation);
    };

    return (
      <>
        <Header date={date} time={time}  />
        <main className="bg-gray-900 min-h-(--remain-height) flex flex-col items-center p-4 text-white font-vazir">
            <div className="w-full max-w-2xl mx-auto">

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg rtl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <StationSelect
                  label="ایستگاه مبدا"
                  value={sourceStation}
                  onChange={(e) => setSourceStation(e.target.value)}
                  stations={stations.filter(s => s.name !== destinationStation && !((isHoliday || isOtherHoliday) && (s.id == 17 || s.id == 18 || s.id == 2 || s.id == 3)))}
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleSwap}
                    className="bg-transparent rounded-full mt-0 md:mt-8 hover:bg-gray-800 hover:cursor-pointer transition-transform duration-300 transform hover:rotate-180"
                    title="جابجایی مبدا و مقصد"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-gray-300" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>
                <StationSelect
                  label="ایستگاه مقصد"
                  value={destinationStation}
                  onChange={(e) => setDestinationStation(e.target.value)}
                  stations={stations.filter(s => s.name !== sourceStation && !((isHoliday || isOtherHoliday) && (s.id == 17 || s.id == 18 || s.id == 2 || s.id == 3)))}
                  />
              </div>
            </div>

            { <ScheduleDisplay {...upcomingTrains!} /> }

            <footer className="text-center text-gray-500 mt-12 text-sm">
              <p className='rtl font-vazir'>طراحی و توسعه با ❤️ </p>
              <p className="mt-1 font-vazir rtl">آخرین بروزرسانی داده‌ها: مهر ۱۴۰۴</p>
            </footer>
          </div>
        </main>
      </>
    );
}

export default App
