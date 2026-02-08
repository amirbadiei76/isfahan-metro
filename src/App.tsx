import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { ResultTime, ScheduleResult, TripInfo } from './components/ScheduleDisplay';
import { stations } from './data/stations';
import { schedule } from './data/schedule';
import StationSelect from './components/StationSelect';
import ScheduleDisplay from './components/ScheduleDisplay';
import { getCurrentYear, getFormatedDate, getPersianStringDate, getPersianStringTime, getTodayTime, todayIsHoliday } from './utils/dateUtils';
import Header from './components/Header';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import MetroMap from './components/MetroMap';

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

export interface IDateEvent {
  is_holiday: boolean;
  description: string;
}

export interface IDateData {
  date: string;
  events: IDateEvent[]
}


function App() {
    const [sourceStation, setSourceStation] = useState<string>('');
    const [destinationStation, setDestinationStation] = useState<string>('');
    const [today, setToday] = useState<Date>(getTodayTime());
    const [isHoliday, setIsHoliday] = useState<boolean>(todayIsHoliday());
    const [time, setTime] = useState<string>(getPersianStringTime())
    const [date, setDate] = useState<string>(getPersianStringDate());
    // const [isOtherHoliday, setIsOtherHoliday] = useState(false);
    const [nearestStationId, setNearestStationId] = useState<number | null>(null);
    const [zoomScale, setZoomScale] = useState(1.3);
    
    const findNearest = (lat: number, lon: number) => {
      let minDistance = Infinity;
      let closestId = null;

      stations.forEach(station => {
        const dist = getDistance(lat, lon, station.lat, station.lon);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = station.id;
        }
      });
      // console.log(closestId, minDistance)
      if (minDistance < 1.5) {
        setNearestStationId(closestId);
      }
    };
    
    function setTodayIsHoliday (data: IDateData[]) {
      if (!todayIsHoliday()) {
        const formatedDate = getFormatedDate();
        for(const currentDate of data) {
          if (currentDate.date === formatedDate) {
            let todayEventIsHoliday: boolean = false;
            for(const currentEvent of currentDate.events) {
              if (currentEvent.is_holiday) {
                todayEventIsHoliday = true;
                setIsHoliday(true)
                break
              }
            }
            if (todayEventIsHoliday) break;
          }
        }
      }
    }

    useEffect(() => {
      fetch(`https://raw.githubusercontent.com/hasan-ahani/shamsi-holidays/main/holidays/${getCurrentYear()}.json`)
      .then(response => response.json())
      .then(data => setTodayIsHoliday(data))
      .catch((error) => console.log(error))
    }, [getCurrentYear])


    useEffect(() => {


      let watchId: number;
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            findNearest(latitude, longitude);
          },
          (error) => {
            console.log(error.message)
          },
          {
            enableHighAccuracy: true,
            timeout: 50000
          }
        );
      }

      return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId);
      };
    }, []);
    

    const handleStationClick = (stationName: string) => {
      if (!sourceStation) {
        setSourceStation(stationName)
      }
      else if (sourceStation && !destinationStation) {
        setDestinationStation(sourceStation !== stationName ? stationName : '')
      }
      else if (!sourceStation || (sourceStation && destinationStation)) {
        setSourceStation(stationName);
        setDestinationStation('');
      }
    };

    useEffect(() => {
      setInterval(() => {
          const time = getPersianStringTime()
          const date = getPersianStringDate();
          const today = getTodayTime();

          setToday(today)
          setTime(time)
          setDate(date)
      }, 1000);
    }, []);

    const upcomingTrains = useMemo((): ScheduleResult | null => {
        const dayType = (isHoliday) ? 'جمعه و روزهای تعطیل' : 'روزهای کاری';
        if (!sourceStation || !destinationStation || sourceStation === destinationStation) {
          return { isHoliday: (isHoliday!), dayType: dayType, results: [], directionText: '', sourceStationName: '', destinationStationName: '', nextDepartureTime: '', trips: [] };
        }

        const source = stations.find(s => s.name === sourceStation);
        const destination = stations.find(s => s.name === destinationStation);

        if (!source || !destination) return null;

        const directionKey = source.id < destination.id ? 'qods_to_sofeh' : 'sofeh_to_qods';
        const dayTypeKey = (isHoliday) ? 'holidays' : 'weekdays';
      
        const allDepartures = schedule[dayTypeKey][directionKey][sourceStation];
        const allArrivals = schedule[dayTypeKey][directionKey][destinationStation];

        const directionText = `مسیر: ${source.name} به سمت ${destination.name}`;

        if (!allArrivals || !allDepartures) {
          return { isHoliday: (isHoliday!), dayType: dayType, results: [], directionText: directionText, sourceStationName: '', destinationStationName: '', nextDepartureTime: '', trips: [] };
        }

        
        const now = today!.getHours() * 60 + today!.getMinutes();

        let nextTrainIndex = -1;
        let nextDepartureTime = '';

        for (let i = 0; i < allDepartures.length; i++) {
          const time = allDepartures[i];
          const [hour, minute] = time.split(':').map(Number);
          if ((hour * 60 + minute) >= now) {
            nextTrainIndex = i;
            nextDepartureTime = time;
            break;
          }
        }

        if (nextTrainIndex === -1) {
          return {
            dayType: isHoliday ? 'ایام تعطیل' : 'روزهای کاری',
            directionText: directionText,
            sourceStationName: source.name,
            destinationStationName: destination.name,
            trips: [],
            nextDepartureTime: '',
            isHoliday: isHoliday,
            results: []
          };
        }

        const trips: TripInfo[] = [];
        const startIndex = Math.min(source.id, destination.id);
        const endIndex = Math.max(source.id, destination.id);
        let tripStations = stations.filter(s => s.id >= startIndex && s.id <= endIndex);

        if (source.id > destination.id) {
          tripStations.reverse();
        }
        for (const station of tripStations) {
          const stationSchedule = schedule[dayTypeKey][directionKey][station.name];
          if (stationSchedule && stationSchedule[nextTrainIndex]) {
            trips.push({
              stationName: station.name,
              arrivalTime: stationSchedule[nextTrainIndex],
            });
          }
        }


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
          isHoliday: isHoliday,
          dayType: isHoliday ? 'ایام تعطیل' : 'روزهای کاری',
          results: results.slice(0, 5),
          directionText: directionText,
          sourceStationName: source.name,
          destinationStationName: destination.name,
          trips: trips,
          nextDepartureTime: nextDepartureTime

        };
    }, [sourceStation, destinationStation, isHoliday]);

    const handleSwap = () => {
        setSourceStation(destinationStation);
        setDestinationStation(sourceStation);
    };

    function changeHolidayValue (checked: boolean) {
      setIsHoliday(checked);
      if (checked) {
        if (sourceStation === 'بهارستان' || sourceStation === 'گلستان'
          || sourceStation === 'دانشگاه' || sourceStation === 'کارگر') {
            setSourceStation('')
        }
        if (destinationStation === 'بهارستان' || destinationStation === 'گلستان'
            || destinationStation === 'دانشگاه' || destinationStation === 'کارگر') {
            setDestinationStation('')
        }
      }
    }

    return (
      <>
        <Header date={date} time={time}  />
        <main  className="bg-gray-900 min-h-(--remain-height) flex w-full flex-col md:flex-row p-5 gap-4 text-white font-vazir">
          
          <div className='flex flex-1 flex-col bg-white p-4 rounded-lg shadow-lg relative'>
            <TransformWrapper
              initialScale={1.3}
              onTransformed={(ref) => setZoomScale(ref.state.scale)}
              initialPositionX={0}
              initialPositionY={0}
              minScale={1}
              maxScale={6}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="flex gap-2 mb-2 absolute top-0 right-0 z-10">
                    <button onClick={() => zoomIn()} className="px-3 py-1 bg-gray-600 rounded text-lg">+</button>
                    <button onClick={() => zoomOut()} className="px-3 py-1 bg-gray-600 rounded text-lg">-</button>
                    <button onClick={() => resetTransform()} className="px-3 py-1 bg-gray-600 rounded text-sm">بازنشانی</button>
                  </div>
                  
                  <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%', cursor: 'grab' }}
                  >
                    <MetroMap
                      sourceStationName={sourceStation}
                      destinationStationName={destinationStation}
                      onStationClick={handleStationClick}
                      nearestStationId={nearestStationId}
                      zoomScale={zoomScale}
                      isHoliday={isHoliday}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>

          <aside className=''>
            <div className="flex w-full md:w-auto gap-4 items-center justify-between mb-3">
              <StationSelect
                label="ایستگاه مقصد"
                value={destinationStation}
                onChange={(e) => setDestinationStation(e.target.value)}
                stations={stations.filter(s => s.name !== sourceStation && !(isHoliday && (s.id == 17 || s.id == 18 || s.id == 2 || s.id == 3)))}
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
                stations={stations.filter(s => s.name !== destinationStation && !(isHoliday && (s.id == 17 || s.id == 18 || s.id == 2 || s.id == 3)))}
              />
            </div>

            <div className='flex gap-2 justify-end items-center w-full'>
              <label className='rtl font-vazir' htmlFor="check_holiday">تعطیلی؟</label>
              <input id='check_holiday' checked={isHoliday} onChange={(event) => changeHolidayValue(event.target.checked)} type="checkbox" />
            </div>
            
            <ScheduleDisplay {...upcomingTrains!} />
          </aside>
        </main>
        <footer className="bg-gray-900 font-vazir text-center text-gray-500 mt-12 text-sm">
          <p className='rtl font-vazir'>طراحی و توسعه با ❤️ توسط جامعه برای جامعه</p>
          <p className="mt-1 font-vazir rtl">آخرین بروزرسانی داده‌ها: مهر ۱۴۰۴</p>
        </footer>
      </>
    );
}

export default App
