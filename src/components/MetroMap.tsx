import React, { useMemo } from 'react'
import { stations } from '../data/stations';


interface MetroMapProps {
    sourceStationName: string;
    destinationStationName: string;
}


const MetroMap: React.FC<MetroMapProps> = ({ sourceStationName, destinationStationName }) => {

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
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
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
            const isEndpoint = station.name === sourceStationName || station.name === destinationStationName;

            return (
              <g key={`station-group-${station.id}`} transform={`translate(${station.x}, ${station.y})`}>
                <circle
                  cx={0}
                  cy={0}
                  r={isEndpoint ? 8 : 5}
                  className={isHighlighted ? "station-circle-highlight" : "station-circle"}
                />
                <text
                  x={15}
                  y={4}
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