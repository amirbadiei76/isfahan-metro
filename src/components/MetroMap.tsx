import React, { useMemo } from 'react'
import { stations } from '../data/stations';
import IsfahanStreets from './IsfahanStreets';


interface MetroMapProps {
  sourceStationName: string;
  destinationStationName: string;
  nearestStationId: number | null;
  onStationClick: (name: string) => void;
}


const MetroMap: React.FC<MetroMapProps> = ({ sourceStationName, destinationStationName, nearestStationId, onStationClick }) => {

  const highlightedElements = useMemo(() => {
    const source = stations.find(s => s.name === sourceStationName);
    const dest = stations.find(s => s.name === destinationStationName);

    const highlightedStations = new Set<number>();
    const highlightedSegments = new Set<string>();

    if (source && dest) {
      const startIndex = Math.min(source.id, dest.id);
      const endIndex = Math.max(source.id, dest.id);

      for (let i = startIndex; i <= endIndex; i++) {
        highlightedStations.add(i);
       
        if (i < endIndex) {
          highlightedSegments.add(`segment-${i}`);
        }
      }
    }
    return { highlightedStations, highlightedSegments };
  }, [sourceStationName, destinationStationName]);

  const { highlightedStations, highlightedSegments } = highlightedElements;

  const viewBoxHeight = 890;
  const viewBoxWidth = 250;

  return (
    <div className="w-full h-[504px] justify-center items-center overflow-hidden">
      {/* <defs>
        تعریف فیلتر درخشش (Glow) برای نزدیک‌ترین ایستگاه
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs> */}


      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* <g stroke="#333" strokeWidth="1" fill="none">
          <path d="M50,200 L450,200 M50,400 L450,400 M100,50 L100,1000 M400,50 L400,1000" />
          <path d="M50,750 Q250,700 450,750" opacity="0.5" />
        </g> */}

        
        <IsfahanStreets />

        <g>
          {stations.slice(0, -1).map((station, index) => {
            const nextStation = stations[index + 1];
            return (
              <line
                key={`bg-segment-${station.id}`}
                x1={station.x}
                y1={station.y}
                x2={nextStation.x}
                y2={nextStation.y}
                className="metro-line-bg"
              />
            );
          })}

          {stations.slice(0, -1).map((station, index) => {
            const nextStation = stations[index + 1];
            const segmentId = `segment-${station.id}`;
            
            if (highlightedSegments.has(segmentId)) {
              return (
                <line
                  key={segmentId}
                  x1={station.x}
                  y1={station.y}
                  x2={nextStation.x}
                  y2={nextStation.y}
                  className="metro-line-highlight"
                />
              );
            }
            return null;
          })}

          {stations.map((station) => {
            const isHighlighted = highlightedStations.has(station.id);
            // const isEndpoint = station.name === sourceStationName || station.name === destinationStationName;

            const isSource = station.name === sourceStationName;
            const isDest = station.name === destinationStationName;
            const isNearest = station.id === nearestStationId;
            // const isInPath = highlightInfo.has(station.id);

            return (
              <g onClick={() => onStationClick(station.name)} key={`station-group-${station.id}`} transform={`translate(${station.x}, ${station.y})`}>
                {isNearest && (
                  <circle
                    cx={station.x} cy={station.y} r="15"
                    fill="#00ccff" fillOpacity="0.3"
                    filter="url(#glow)"
                    className="animate-pulse"
                  />
                )}
                
                <circle
                  cx={0}
                  cy={0}
                  r={isSource || isDest ? "8" : "5"}
                  fill={isSource || isDest ? "#ffcc00" : (isHighlighted ? "#fff" : "#666")}
                  className={isHighlighted ? "station-circle-highlight" : "station-circle"}
                />
                <text
                  x={station.textX}
                  y={station.textY}
                  fill={isSource || isDest ? "#ffcc00" : (isHighlighted ? "#fff" : "#999")}
                  fontSize={isSource || isDest ? "16" : "12"}
                  className={isHighlighted ? "station-text-highlight" : "station-text"}
                >
                  {station.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default MetroMap;