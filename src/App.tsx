import { useEffect, useMemo, useState } from "react";
import "./App.css";
import type {
  // ResultTime,
  ScheduleResult,
  TripInfo,
} from "./components/ScheduleDisplay";
import CustomDropdown from "./components/custom-dropdown/CustomDropdown";
import ScheduleDisplay from "./components/ScheduleDisplay";
import Header from "./components/Header";
import GeographicMap from "./components/map/GeographicMap";
import {
  getCurrentYear,
  getFormatedDate,
  getPersianStringDate,
  getPersianStringTime,
  getTodayTime,
  todayIsHoliday,
} from "./utils/dateUtils";
import type { Station } from "./data/stations.types";
import type {
  DirectionSchedule,
  Schedule,
  StationSchedule,
} from "./data/schedule.types"; // دقت کنید اسم فایل schedules است یا schedule
export interface IDateEvent {
  is_holiday: boolean;
  description: string;
}
export interface IDateData {
  date: string;
  events: IDateEvent[];
}
function App() {
  // const excluded = ["بهارستان", "گلستان", "دانشگاه", "کارگر"];
  const excluded = [2, 3, 17, 18];

  const [sourceStation, setSourceStation] = useState<string>("");
  const [destinationStation, setDestinationStation] = useState<string>("");
  const [today, setToday] = useState<Date>(getTodayTime());
  const [isHoliday, setIsHoliday] = useState<boolean>(todayIsHoliday());
  const [time, setTime] = useState<string>(getPersianStringTime());
  const [date, setDate] = useState<string>(getPersianStringDate());
  const [stations, setStations] = useState<Station[] | undefined>(undefined);
  const [schedules, setSchedules] = useState<Schedule | undefined>(undefined); // واکشی اطلاعات اولیه

  useEffect(() => {
    // fetch("https://isfahan-metro-api.onrender.com/api/metro/")
    fetch("http://localhost:5000/api/metro/")
      .then((res) => res.json())
      .then((resp) => {
        setStations(resp.stations);
        setSchedules(resp.schedules);
      });
  }, []); // واکشی تقویم و تعطیلات
  useEffect(() => {
    fetch(
      `https://raw.githubusercontent.com/hasan-ahani/shamsi-holidays/main/holidays/${getCurrentYear()}.json`,
    )
      .then((response) => response.json())
      .then((data: IDateData[]) => {
        if (!todayIsHoliday()) {
          const formatedDate = getFormatedDate();
          const todayData = data.find((d) => d.date === formatedDate);
          if (todayData?.events.some((e) => e.is_holiday)) {
            setIsHoliday(true);
          }
        }
      })
      .catch((error) => console.log(error));
  }, []); // آپدیت ثانیه شمار ساعت
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(getTodayTime());
      setTime(getPersianStringTime());
      setDate(getPersianStringDate());
    }, 1000);
    return () => clearInterval(interval);
  }, []); // مدیریت کلیک روی مارکر ایستگاه در نقشه برای سینک شدن با react-select
  const handleStationClick = (stationName: string) => {
    if (!sourceStation) {
      setSourceStation(stationName);
    } else if (sourceStation && !destinationStation) {
      setDestinationStation(sourceStation !== stationName ? stationName : "");
    } else {
      setSourceStation(stationName);
      setDestinationStation("");
    }
  };
  const handleSwap = () => {
    setSourceStation(destinationStation);
    setDestinationStation(sourceStation);
  };
  const changeHolidayValue = (checked: boolean) => {
    setIsHoliday(checked);
    if (checked) {
      if (
        excluded.find((id) =>
          stations?.find(
            (station) => station.id === id && station.name === sourceStation,
          ),
        )
      )
        setSourceStation("");
      if (
        excluded.find((id) =>
          stations?.find(
            (station) =>
              station.id === id && station.name === destinationStation,
          ),
        )
      )
        setDestinationStation("");
    }
  };
  const upcomingTrains = useMemo((): ScheduleResult | null => {
    /*
    const dayType = isHoliday ? "جمعه و روزهای تعطیل" : "روزهای کاری";
    if (
      !sourceStation ||
      !destinationStation ||
      sourceStation === destinationStation
    ) {
      return {
        isHoliday: isHoliday,
        dayType,
        results: [],
        directionText: "",
        sourceStationName: "",
        destinationStationName: "",
        nextDepartureTime: "",
        trips: [],
      };
    }
    const source = stations?.find((s) => s.name === sourceStation);
    const destination = stations?.find((s) => s.name === destinationStation);
    if (!source || !destination) return null;
    const directionKey =
      source.id < destination.id ? GODS_TO_SOFEH : SOFEH_TO_GODS;
    const dayTypeKey = isHoliday ? "holidays" : "weekdays";
    const currentData = isHoliday ? schedules?.holidays : schedules?.weekdays;
    const directionData =
      directionKey === GODS_TO_SOFEH
        ? currentData?.qods_to_sofeh
        : currentData?.sofeh_to_qods;
    const allDepartures = directionData![sourceStation];
    const allArrivals = directionData![destinationStation];
    const directionText = `مسیر: ${source.name} به سمت ${destination.name}`;
    if (!allArrivals || !allDepartures) {
      return {
        isHoliday,
        dayType,
        results: [],
        directionText,
        sourceStationName: source.name,
        destinationStationName: destination.name,
        nextDepartureTime: "",
        trips: [],
      };
    }
    */
    const dayType = isHoliday ? "جمعه و روزهای تعطیل" : "روزهای کاری";
    if (
      !sourceStation ||
      !destinationStation ||
      sourceStation === destinationStation
    ) {
      return {
        isHoliday: isHoliday!,
        dayType: dayType,
        results: [],
        directionText: "",
        sourceStationName: "",
        destinationStationName: "",
        nextDepartureTime: "",
        trips: [],
      };
    }

    const source = stations?.find((s) => s.name === sourceStation);
    const destination = stations?.find((s) => s.name === destinationStation);

    if (!source || !destination) return null;

    // const directionKey =
    //   source.id < destination.id ? "qods_to_sofeh" : "sofeh_to_qods";

    // const dayTypeKey = isHoliday ? "holidays" : "weekdays";

    const dayTypeData = isHoliday ? schedules?.holidays : schedules?.weekdays;

    const directionData =
      source.id < destination.id
        ? dayTypeData?.qods_to_sofeh
        : dayTypeData?.sofeh_to_qods;

    const departureIndex = directionData?.stations.findIndex(
      (station) => +station.stationId === +source.id,
    );
    const arrivalIndex = directionData?.stations.findIndex(
      (station) => +station.stationId === +destination.id,
    );

    const allDepartures = directionData?.stations[departureIndex!].times;
    const allArrivals = directionData?.stations[arrivalIndex!].times;

    // console.log(allArrivals, allDepartures);
    // console.log(directionData!["قدس"]);
    const directionText = `مسیر: ${source.name} به سمت ${destination.name}`;

    if (!allArrivals || !allDepartures) {
      return {
        isHoliday: isHoliday,
        dayType: dayType,
        results: [],
        directionText: directionText,
        sourceStationName: "",
        destinationStationName: "",
        nextDepartureTime: "",
        trips: [],
      };
    }

    const now = today.getHours() * 60 + today.getMinutes();
    let nextTrainIndex = -1;
    let nextDepartureTime = "";
    for (let i = 0; i < allDepartures.length; i++) {
      const [hour, minute] = allDepartures[i].split(":").map(Number);
      if (hour * 60 + minute >= now) {
        nextTrainIndex = i;
        nextDepartureTime = allDepartures[i];
        break;
      }
    }
    if (nextTrainIndex === -1) {
      return {
        isHoliday,
        dayType,
        results: [],
        directionText,
        sourceStationName: source.name,
        destinationStationName: destination.name,
        nextDepartureTime: "",
        trips: [],
      };
    }
    const trips: TripInfo[] = [];
    const startIndex = Math.min(source.id, destination.id);
    const endIndex = Math.max(source.id, destination.id);
    let tripStations =
      stations?.filter((s) => s.id >= startIndex && s.id <= endIndex) || [];

    if (source.id > destination.id) tripStations.reverse();

    for (const station of tripStations) {
      const dayTypeData = isHoliday ? schedules?.holidays : schedules?.weekdays;

      const directionData: DirectionSchedule | undefined =
        source.id < destination.id
          ? dayTypeData?.qods_to_sofeh
          : dayTypeData?.sofeh_to_qods;

      const departureIndex = directionData!.stations.findIndex(
        (station: StationSchedule) => station.stationId == source.id,
      );
      const allDepartures = directionData?.stations[departureIndex].times;

      // const stationSchedule =
      //   schedules![dayTypeKey][directionKey][station.name];
      if (allDepartures && allDepartures[nextTrainIndex]) {
        trips.push({
          stationName: station.name,
          arrivalTime: allDepartures[nextTrainIndex],
        });
      }
    }
    const upcomingDepartures = allDepartures.filter((time: any) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute >= now;
    });
    const results = upcomingDepartures.slice(0, 5).map((upItem: string) => {
      const index = allDepartures.indexOf(upItem);
      return { departure: upItem, arrival: allArrivals[index] };
    });
    return {
      isHoliday,
      dayType,
      results,
      directionText,
      sourceStationName: source.name,
      destinationStationName: destination.name,
      trips,
      nextDepartureTime,
    };
  }, [
    sourceStation,
    destinationStation,
    isHoliday,
    stations,
    schedules,
    today,
  ]);
  if (!stations) {
    return (
      <div className="text-white text-center mt-10 font-vazir">
        در حال دریافت اطلاعات...
      </div>
    );
  } // منطق فیلتر ایستگاه‌ها برای دراپ‌داون
  const filteredDestStations = stations.filter(
    (s) =>
      s.name !== sourceStation && !(isHoliday && [2, 3, 17, 18].includes(s.id)),
  );
  const filteredSourceStations = stations.filter(
    (s) =>
      s.name !== destinationStation &&
      !(isHoliday && [2, 3, 17, 18].includes(s.id)),
  );
  return (
    <>
      <Header date={date} time={time} />
      <main className="bg-gray-900 min-h-[calc(100vh-100px)] flex w-full flex-col lg:flex-row p-5 gap-6 text-white font-vazir">
        <div className="w-full lg:w-1/2">
          <GeographicMap
            isHoliday={isHoliday}
            holidayExcludes={excluded}
            destinationStationName={destinationStation}
            sourceStationName={sourceStation}
            stations={stations}
            onStationClick={handleStationClick}
          />
        </div>
        <aside className="w-full lg:w-1/2 flex flex-col">
          <div className="flex flex-col md:flex-row w-full gap-4 items-end mb-6">
            <div className="w-full md:flex-1">
              <CustomDropdown
                label="ایستگاه مبدا"
                value={sourceStation}
                onChange={setSourceStation}
                stations={filteredSourceStations}
              />
            </div>
            <div className="flex justify-center items-center pb-1">
              <button
                onClick={handleSwap}
                className="bg-gray-800 rounded-full p-3 hover:bg-gray-700 cursor-pointer transition-transform duration-300 transform hover:rotate-180"
                title="جابجایی مبدا و مقصد"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 stroke-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>
            </div>
            <div className="w-full md:flex-1">
              <CustomDropdown
                label="ایستگاه مقصد"
                value={destinationStation}
                onChange={setDestinationStation}
                stations={filteredDestStations}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-start items-center w-full bg-gray-800 p-3 rounded-lg border border-gray-700">
            <input
              id="check_holiday"
              checked={isHoliday}
              onChange={(e) => changeHolidayValue(e.target.checked)}
              type="checkbox"
              className="w-5 h-5 cursor-pointer accent-blue-500"
            />
            <label
              className="rtl font-vazir cursor-pointer select-none text-gray-300"
              htmlFor="check_holiday"
            >
              تعطیل؟
            </label>
          </div>
          {upcomingTrains && <ScheduleDisplay {...upcomingTrains} />}
        </aside>
      </main>
      <footer className="bg-gray-900 font-vazir text-center text-gray-500 py-6 text-sm border-t border-gray-800">
        <p className="rtl font-vazir">
          طراحی و توسعه با ❤️ توسط جامعه برای جامعه
        </p>
        <p className="mt-1 font-vazir rtl">آخرین بروزرسانی داده‌ها: مهر ۱۴۰۴</p>
      </footer>
    </>
  );
}
export default App;
