import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { ResultTime, ScheduleResult } from './components/ScheduleDisplay';
import { stations } from './data/stations';
import { schedule } from './data/schedule';
import StationSelect from './components/StationSelect';
import ScheduleDisplay from './components/ScheduleDisplay';
import { getPersianStringDate, getPersianStringTime, getTodayTime, todayIsHoliday } from './utils/dateUtils';
import Header from './components/Header';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import MetroMap from './components/MetroMap';

/*
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
*/



function App() {
    const [sourceStation, setSourceStation] = useState<string>('');
    const [destinationStation, setDestinationStation] = useState<string>('');
    const [today, setToday] = useState<Date>(getTodayTime());
    const [isHoliday, setIsHoliday] = useState<boolean>(todayIsHoliday());
    const [time, setTime] = useState<string>(getPersianStringTime())
    const [date, setDate] = useState<string>(getPersianStringDate());
    const [isOtherHoliday, setIsOtherHoliday] = useState(false);
    const [nearestStationId, setNearestStationId] = useState<number | null>(null);
    
    /*
    const findNearest = (lat: number, lon: number) => {
      let minDistance = Infinity;
      let closestId = null;

      stations.forEach(station => {
        const dist = getDistance(lat, lon, station.lat!, station.lon!);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = station.id;
        }
      });

      // اگر کاربر در محدوده اصفهان باشد (مثلاً فاصله کمتر از 30 کیلومتر تا نزدیکترین ایستگاه)
      if (minDistance < 30) {
        setNearestStationId(closestId);
      }
    };
    
    
    useEffect(() => {
      // مرحله ۱: تلاش برای گرفتن موقعیت از مرورگر
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // موفقیت در روش اول
            findNearest(position.coords.latitude, position.coords.longitude);
          },
          async (error) => {
            // مرحله ۲: اگر خطای تحریم (403) یا هر خطای دیگری رخ داد، برو سراغ IP
            console.warn("Browser Geolocation failed, trying IP-based location...", error.message);
            try {
              const response = await fetch('https://metro-api.vercel.app/ip-location');

              const data = await response.json();
              console.log(data)
            
              if (data && data.latitude && data.longitude) {
                findNearest(data.latitude, data.longitude);
              }
            } catch (ipError) {
              console.error("IP Geolocation also failed:", ipError);
            }
            
          },
          // { timeout: 30000 } // حداکثر ۵ ثانیه منتظر مرورگر بمان
        );
      }
    }, []);
    */

    const handleStationClick = (stationName: string) => {
      if (!sourceStation || (sourceStation && destinationStation)) {
        setSourceStation(stationName);
        setDestinationStation('');
      } else {
        setDestinationStation(stationName);
      }
      setNearestStationId(-1);
    };

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
        <main className="bg-gray-900 min-h-(--remain-height) flex w-full flex-col md:flex-row p-5 gap-4 text-white font-vazir">
          
          <div className='flex w-full flex-1 flex-col bg-gray-800 p-4 rounded-lg shadow-lg relative'>
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">نقشه شماتیک مسیر</h2>
            <TransformWrapper
              initialScale={1.3}
              initialPositionX={-70}
              initialPositionY={-100}
              minScale={1}
              maxScale={6}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="flex gap-2 mb-2 absolute top-0 right-0">
                    <button onClick={() => zoomIn()} className="px-3 py-1 bg-gray-600 rounded text-lg">+</button>
                    <button onClick={() => zoomOut()} className="px-3 py-1 bg-gray-600 rounded text-lg">-</button>
                    <button onClick={() => resetTransform()} className="px-3 py-1 bg-gray-600 rounded text-sm">بازنشانی</button>
                  </div>
                  
                  <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%', cursor: 'grab' }}
                    contentStyle={{ width: '100%', height: '100%' }}
                  >
                    <MetroMap
                      sourceStationName={sourceStation}
                      destinationStationName={destinationStation}
                      onStationClick={handleStationClick}
                      nearestStationId={nearestStationId}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>

          <aside className=''>
            <div className="flex w-full md:w-auto gap-4 items-center justify-between">
              <StationSelect
                label="ایستگاه مقصد"
                value={destinationStation}
                onChange={(e) => setDestinationStation(e.target.value)}
                stations={stations.filter(s => s.name !== sourceStation && !((isHoliday || isOtherHoliday) && (s.id == 17 || s.id == 18 || s.id == 2 || s.id == 3)))}
              />
              <div className="flex justify-center P-2 items-center">
                <button
                  onClick={handleSwap}
                  className="bg-transparent rounded-full mt-0 md:mt-8 p-2 hover:bg-gray-800 hover:cursor-pointer transition-transform duration-300 transform hover:rotate-180"
                  title="جابجایی مبدا و مقصد"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-gray-300" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>
              <StationSelect
                label="ایستگاه مبدا"
                value={sourceStation}
                onChange={(e) => setSourceStation(e.target.value)}
                stations={stations.filter(s => s.name !== destinationStation && !((isHoliday || isOtherHoliday) && (s.id == 17 || s.id == 18 || s.id == 2 || s.id == 3)))}
              />
            </div>
            <ScheduleDisplay {...upcomingTrains!} />
          </aside>
          
          {/*
          <div className="w-full max-w-2xl mx-auto">

            <div className="bg-gray-700 p-6 rounded-lg shadow-lg rtl">
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

            {(
              <div className="mt-8 space-y-8">
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold text-cyan-400 mb-4">نقشه شماتیک مسیر</h2>
                  <TransformWrapper
                    initialScale={1}
                    initialPositionX={0}
                    initialPositionY={0}
                    minScale={0.5}
                    maxScale={10}
                  >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                      <>
                        <div className="flex gap-2 mb-2">
                          <button onClick={() => zoomIn()} className="px-3 py-1 bg-gray-600 rounded text-lg">+</button>
                          <button onClick={() => zoomOut()} className="px-3 py-1 bg-gray-600 rounded text-lg">-</button>
                          <button onClick={() => resetTransform()} className="px-3 py-1 bg-gray-600 rounded text-sm">بازنشانی</button>
                        </div>
                        
                        <TransformComponent
                          wrapperStyle={{ width: '100%', height: '500px', cursor: 'grab' }}
                          contentStyle={{ width: '100%', height: '100%' }}
                        >
                          <MetroMap
                            sourceStationName={sourceStation}
                            destinationStationName={destinationStation}
                          />
                        </TransformComponent>
                      </>
                    )}
                  </TransformWrapper>
                </div>
              
                <ScheduleDisplay {...upcomingTrains!} />
              </div>
            )}

          </div>
          */}
        </main>
        <footer className="bg-gray-900 font-vazir text-center text-gray-500 mt-12 text-sm">
          <p className='rtl font-vazir'>طراحی و توسعه با ❤️ توسط جامعه برای جامعه</p>
          <p className="mt-1 font-vazir rtl">آخرین بروزرسانی داده‌ها: مهر ۱۴۰۴</p>
        </footer>
      </>
    );
}

export default App
