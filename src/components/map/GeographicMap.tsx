import { useState, useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getDistance } from "../../utils/distanceUtils";
import type { Station } from "../../data/stations.types";

interface GeographicMapProps {
  sourceStationName: string;
  destinationStationName: string;
  stations: Station[];
  onStationClick: (name: string) => void;
  holidayExcludes: number[];
  isHoliday: boolean;
}
// مدیریت کلیک روی نقشه
const MapEventsHandler = ({
  stations,
  onNearestFound,
}: {
  stations: Station[];
  onNearestFound: (
    stationName: string,
    distance: number,
    clickedPoint: [number, number],
    stationPoint: [number, number],
  ) => void;
}) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      let minDistance = Infinity;
      let closestStation: Station | null = null;

      /*
      stations.forEach((station: Station) => {
        const dist = getDistance(lat, lng, station.lat, station.lon);
        if (dist < minDistance) {
          minDistance = dist;
          closestStation = station;
          onNearestFound(
            closestStation.name,
            minDistance,
            [lat, lng],
            [closestStation.lat, closestStation.lon],
          );
        }
      });
      */
      stations.forEach((station: Station) => {
        const dist = getDistance(lat, lng, station.lat, station.lon);

        if (dist < minDistance) {
          minDistance = dist;
          closestStation = station;

          if (closestStation) {
            onNearestFound(
              closestStation.name,
              minDistance,
              [lat, lng],
              [closestStation.lat, closestStation.lon],
            );
          }
        }
      });
    },
  });
  return null;
};
const GeographicMap = ({
  sourceStationName,
  destinationStationName,
  stations,
  onStationClick,
  holidayExcludes,
  isHoliday,
}: GeographicMapProps) => {
  const isfahanCenter: [number, number] = [32.6539, 51.666]; // مرکز اصفهان // اضافه شدن نقاط خط به استیت دیالوگ باکس
  const [nearestId, setNearestId] = useState(-1);
  const [dialogInfo, setDialogInfo] = useState<{
    stationName: string;
    distance: number;
    clickedPoint: [number, number];
    stationPoint: [number, number];
  } | null>(null);

  const source = stations.find((s) => s.name === sourceStationName);
  const dest = stations.find((s) => s.name === destinationStationName); // محاسبه استایل مارکرها بر اساس وضعیت ایستگاه

  const getStationIcon = (station: Station) => {
    const isSource = station.name === sourceStationName;
    const isDest = station.name === destinationStationName;

    const textOffsetX = station.textX !== undefined ? station.textX : 0;
    const textOffsetY = station.textY !== undefined ? station.textY : 25;

    let isIntermediate = false;
    if (source && dest && !isSource && !isDest) {
      const minId = Math.min(source.id, dest.id);
      const maxId = Math.max(source.id, dest.id);
      if (station.id > minId && station.id < maxId) {
        isIntermediate = true;
      }
    }
    let circleClass = `w-3 h-3 bg-blue-600 border border-white shadow-sm`;
    let textClass = "text-xs text-gray-800 font-bold bg-white/70";
    let zIndex = 0;
    if (isSource || isDest) {
      circleClass =
        "w-5 h-5 bg-red-600 border-2 border-white shadow-[0_0_10px_red]";
      textClass = "text-red-600 font-bold bg-white/90 drop-shadow-md";
      zIndex = 1000;
    } else if (isIntermediate) {
      circleClass =
        "w-4 h-4 bg-orange-500 border-[1.5px] border-white shadow-md";
      textClass = "text-orange-600 font-bold bg-white/80";
      zIndex = 500;
    }
    const html = `<div class="absolute flex flex-col items-center cursor-pointer transition-transform font-vazir" style="transform: translate(-50%, -50%);">
      <div class="${circleClass} rounded-full transition-all duration-300  ${nearestId === station.id ? "animate duration-400 animate-pulse shadow-[0_0_14px_#0909f6]" : ""}">
      </div>
      <span
        class="${textClass} absolute mt-1 text-center px-1.5 py-0.5 rounded-md max-w-13 min-w-11"
        style="
          left: ${textOffsetX}px;
          top: ${textOffsetY}px;
        ">
        ${station.name}
      </span>
    </div> `;
    return {
      icon: L.divIcon({ html, className: "", iconSize: [0, 0] }),
      zIndex,
    };
  }; // آیکن موقعیت مکانی با انیمیشن پالس

  const clickedLocationIcon = useMemo(() => {
    return L.divIcon({
      html: `
      <div style="
        width: 36px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));
      ">
        <svg
          width="36"
          height="42"
          viewBox="0 0 36 42"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 1C8.6 1 1 8.6 1 18C1 29 18 41 18 41C18 41 35 29 35 18C35 8.6 27.4 1 18 1Z"
            fill="#EA4335"
            stroke="white"
            stroke-width="1.5"
          />
          <circle
            cx="18"
            cy="18"
            r="6"
            fill="white"
          />
        </svg>
      </div>
    `,
      className: "",
      iconSize: [36, 42],
      iconAnchor: [18, 42],
    });
  }, []);
  // const userLocationIcon = useMemo(() => {
  //   return L.divIcon({
  //     html: ` <div class="absolute" style="transform: translate(-50%, -50%);"> <div class="relative flex h-5 w-5"> <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span> <span class="relative inline-flex rounded-full h-5 w-5 bg-green-600 border-2 border-white shadow-md"></span> </div> </div> `,
  //     className: "",
  //     iconSize: [0, 0],
  //   });
  // }, []); // محاسبه مسیر و فلش‌های جهت‌دار

  const { polylinePositions, arrows } = useMemo(() => {
    if (!source || !dest) {
      return {
        polylinePositions: [],
        arrows: [],
      };
    }

    let orderedStations = stations.filter((s) => {
      const minId = Math.min(source.id, dest.id);
      const maxId = Math.max(source.id, dest.id);

      return s.id >= minId && s.id <= maxId;
    });

    orderedStations.sort((a, b) =>
      source.id < dest.id ? a.id - b.id : b.id - a.id,
    );

    const positions = orderedStations.map(
      (s) => [s.lat, s.lon] as [number, number],
    );

    const arrowElements = [];
    const numSegments = orderedStations.length - 1;

    for (let i = 0; i < numSegments; i++) {
      // فلش فقط برای بخش اول و بخش آخر مسیر رسم می‌شود.
      // اگر فقط یک بخش بین مبدا و مقصد وجود داشته باشد،
      // فقط یک فلش رسم خواهد شد.
      if (i !== 0 && i !== numSegments - 1) {
        continue;
      }

      const p1 = orderedStations[i];
      const p2 = orderedStations[i + 1];

      const midLat = (p1.lat + p2.lat) / 2;
      const midLon = (p1.lon + p2.lon) / 2;

      const dy = p2.lat - p1.lat;
      const dx = p2.lon - p1.lon;

      const angleRad = Math.atan2(dy, dx);
      const angleDeg = -(angleRad * (180 / Math.PI));

      const arrowIcon = L.divIcon({
        html: `
        <div
          style="
            transform: translate(-50%, -50%) rotate(${angleDeg}deg);
            font-size: 20px;
            color: #f97316;
            font-weight: bold;
            text-shadow:
              1px 1px 0px white,
              -1px -1px 0px white,
              1px -1px 0px white,
              -1px 1px 0px white;
            pointer-events: none;
            line-height: 1;
          "
        >
          ➤
        </div>
      `,
        className: "",
        iconSize: [0, 0],
      });

      arrowElements.push(
        <Marker
          key={`arrow-${p1.id}-${p2.id}`}
          position={[midLat, midLon]}
          icon={arrowIcon}
          interactive={false}
        />,
      );
    }

    return {
      polylinePositions: positions,
      arrows: arrowElements,
    };
  }, [source, dest, stations]);

  useEffect(() => {
    let watchId: number;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          findNearestId(latitude, longitude);
        },
        (error) => {
          console.log(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 50000,
        },
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const findNearestId = (lat: number, lon: number) => {
    let minDistance = Infinity;
    stations.forEach((station: Station) => {
      const dist = getDistance(lat, lon, station.lat, station.lon);
      if (dist < minDistance) {
        minDistance = dist;
        setNearestId(station.id);
      }
    });
  };

  return (
    <div className="relative w-full">
      {dialogInfo && (
        <div className="absolute top-4 right-4 bg-white text-black p-4 rounded-lg shadow-lg rtl font-vazir animate-fade-in border-r-4 border-blue-500">
          <p className="font-bold text-gray-800 mb-1">نزدیک‌ترین ایستگاه:</p>
          <p className="text-blue-600 text-lg font-bold">
            {dialogInfo.stationName}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            فاصله:
            <span className="font-bold">
              {dialogInfo.distance.toFixed(2)} کیلومتر
            </span>
          </p>
          <button
            onClick={() => setDialogInfo(null)}
            className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 rounded transition-colors font-bold cursor-pointer"
          >
            بستن
          </button>
        </div>
      )}
      <MapContainer
        center={isfahanCenter}
        zoom={13}
        style={{ height: "600px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEventsHandler
          stations={stations}
          onNearestFound={(name, distance, clickedPt, stationPt) =>
            setDialogInfo({
              stationName: name,
              distance,
              clickedPoint: clickedPt,
              stationPoint: stationPt,
            })
          }
        />
        {dialogInfo && (
          <Polyline
            positions={[dialogInfo.clickedPoint, dialogInfo.stationPoint]}
            color="#ef4444" // رنگ قرمز برای دیده شدن بهتر
            weight={3}
            dashArray="8, 8"
            className="animate-pulse"
          />
        )}
        {dialogInfo && (
          <Marker
            position={dialogInfo.clickedPoint}
            icon={clickedLocationIcon}
            interactive={false}
            zIndexOffset={2000}
          />
        )}
        {/* نمایش مارکرهای تمام ایستگاه‌ها */}
        {stations.map((station) => {
          const { icon, zIndex } = getStationIcon(station);
          return (
            <Marker
              eventHandlers={{
                click: () =>
                  isHoliday && holidayExcludes.find((id) => +id === station.id)
                    ? {}
                    : onStationClick(station.name),
              }}
              key={station.id}
              position={[station.lat, station.lon]}
              icon={icon}
              zIndexOffset={zIndex}
            />
          );
        })}
        {/* رسم مسیر رنگی بین مبدا و مقصد */}
        {polylinePositions.length > 0 && (
          <Polyline
            positions={polylinePositions}
            color="#f97316"
            weight={5}
            opacity={0.8}
          />
        )}
        {arrows}
        {/* {userLocation && (
          <Marker
            position={userLocation}
            icon={userLocationIcon}
            interactive={false}
            zIndexOffset={2000}
          />
        )} */}
      </MapContainer>
    </div>
  );
};
export default GeographicMap;
