import { useState } from "react";
export interface ResultTime {
  departure: string;
  arrival: string;
}
export interface TripInfo {
  stationName: string;
  arrivalTime: string;
}
export interface ScheduleResult {
  dayType: string;
  results: ResultTime[];
  directionText: string;
  sourceStationName: string;
  destinationStationName: string;
  isHoliday: boolean;
  trips: TripInfo[];
  nextDepartureTime: string;
}
export default function ScheduleDisplay({
  dayType,
  results,
  directionText,
  sourceStationName,
  trips,
}: ScheduleResult) {
  const [showLineTab, setShowLineTab] = useState(false);
  if (!trips || trips.length === 0) {
    return (
      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in font-vazir rtl">
        {" "}
        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
          {" "}
          <h2 className="text-xl font-semibold text-cyan-400">
            {directionText}
          </h2>{" "}
          <p className="text-sm text-gray-400">برنامه امروز ({dayType})</p>{" "}
        </div>{" "}
        <div className="text-center py-8">
          {" "}
          <p className="text-yellow-400 text-lg">
            {" "}
            متاسفانه قطاری برای امروز در این مسیر وجود ندارد.{" "}
          </p>{" "}
        </div>{" "}
      </div>
    );
  }
  return (
    <div className="mt-8 flex flex-col bg-blue-400 p-6 rounded-lg shadow-lg animate-fade-in rtl font-vazir">
      {" "}
      <div className="flex gap-2 mb-4">
        {" "}
        <button
          onClick={() => setShowLineTab(true)}
          className={`cursor-pointer rounded-lg px-3 py-1.5 transition-colors ${showLineTab ? "bg-blue-900 text-white" : "bg-blue-700 text-blue-100"}`}
        >
          {" "}
          نمایش ایستگاه‌ها{" "}
        </button>{" "}
        <button
          onClick={() => setShowLineTab(false)}
          className={`cursor-pointer rounded-lg px-3 py-1.5 transition-colors ${!showLineTab ? "bg-blue-900 text-white" : "bg-blue-700 text-blue-100"}`}
        >
          {" "}
          نمایش زمان‌بندی{" "}
        </button>{" "}
      </div>{" "}
      <div className="flex justify-between items-center mb-4 border-b border-blue-800 pb-3">
        {" "}
        <div>
          {" "}
          <h2 className="text-xl font-semibold text-cyan-900">
            {directionText}
          </h2>{" "}
          {dayType && (
            <p className="text-sm text-blue-800 mt-1">
              برنامه امروز ({dayType})
            </p>
          )}{" "}
        </div>{" "}
      </div>{" "}
      {results && results.length > 0 ? (
        <div>
          {" "}
          {!showLineTab && (
            <div>
              {" "}
              <p className="mb-4 text-gray-800 font-bold">
                {" "}
                {results.length} حرکت بعدی از ایستگاه{" "}
                <strong className="text-yellow-200">{sourceStationName}</strong>
                :{" "}
              </p>{" "}
              <div className="flex flex-col gap-2">
                {" "}
                <div className="flex justify-between items-center px-2 text-sm text-blue-900 font-bold">
                  {" "}
                  <span>حرکت از مبدا</span> <span>رسیدن به مقصد</span>{" "}
                </div>{" "}
                {results.map((resultTime, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 text-white flex justify-between items-center p-3 rounded-md shadow-md"
                  >
                    {" "}
                    <span className="text-2xl font-bold tracking-wider">
                      {resultTime.departure}
                    </span>{" "}
                    <span className="text-2xl font-bold tracking-wider">
                      {resultTime.arrival}
                    </span>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
          {showLineTab && (
            <div className="relative pl-4 mt-4">
              {" "}
              <div className="absolute right-3.5 top-2 bottom-2 w-0.5 bg-blue-800"></div>{" "}
              <ul className="space-y-5">
                {" "}
                {trips.map((stop, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-4 space-x-reverse relative z-10"
                  >
                    {" "}
                    <div className="bg-gray-900 px-3 py-1 rounded-md border border-gray-600 shadow">
                      {" "}
                      <p className="text-lg font-bold text-white min-w-[5ch] text-center">
                        {stop.arrivalTime}
                      </p>{" "}
                    </div>{" "}
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-gray-900 ${index === 0 ? "bg-cyan-400 shadow-[0_0_8px_cyan]" : "bg-gray-300"}`}
                    ></div>{" "}
                    <p
                      className={`text-md mr-2 ${index === 0 ? "font-bold text-blue-900" : "text-gray-800"}`}
                    >
                      {" "}
                      {stop.stationName} {index === 0 && " (مبدا)"}{" "}
                      {index === trips.length - 1 && " (مقصد)"}{" "}
                    </p>{" "}
                  </li>
                ))}{" "}
              </ul>{" "}
            </div>
          )}{" "}
        </div>
      ) : (
        <div className="text-center py-8">
          {" "}
          <p className="text-yellow-200 text-lg font-bold">
            {" "}
            متاسفانه قطار دیگری برای امروز از این ایستگاه وجود ندارد.{" "}
          </p>{" "}
        </div>
      )}{" "}
    </div>
  );
}
