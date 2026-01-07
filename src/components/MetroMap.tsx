import React, { useMemo } from 'react'
import { stations } from '../data/stations';
import IsfahanStreets from './IsfahanStreets';


interface MetroMapProps {
  sourceStationName: string;
  destinationStationName: string;
  nearestStationId: number | null;
  onStationClick: (name: string) => void;
  zoomScale: number;
  isHoliday: boolean
}


const MetroMap: React.FC<MetroMapProps> = ({ sourceStationName, destinationStationName, nearestStationId, onStationClick, zoomScale, isHoliday }) => {

  const highlightedElements = useMemo(() => {
    const source = stations.find(s => s.name === sourceStationName);
    const dest = stations.find(s => s.name === destinationStationName);
    if (!source || !dest) return { highlightedStations: new Set<number>(), highlightedSegments: new Set<string>(), startIndex: 0, endIndex: 0, isReverse: false };

    const highlightedStations = new Set<number>();
    const highlightedSegments = new Set<string>();

    const startIndex = Math.min(source.id, dest.id);
    const endIndex = Math.max(source.id, dest.id);

    for (let i = startIndex; i <= endIndex; i++) {
      highlightedStations.add(i);
      
      if (i < endIndex) {
        highlightedSegments.add(`segment-${i}`);
      }
    }
    return { highlightedStations, highlightedSegments, startIndex: source.id, endIndex: dest.id, isReverse: source.id > dest.id };
  }, [sourceStationName, destinationStationName]);

  const { highlightedStations, highlightedSegments, endIndex, isReverse, startIndex } = highlightedElements;
  const bubbleScale = (1 / (zoomScale > 3 ? 3 : zoomScale)) * 2.5;

  const viewBoxHeight = 890;
  const viewBoxWidth = 250;

  function generatePath(startId: number, endId: number): string {
    const segment = stations.filter(s => s.id >= startId && s.id <= endId);
    if (segment.length === 0) return "";
    let d = `M${segment[0].x},${segment[0].y}`;
    for (let i = 0; i < segment.length - 1; i++) {
      const cur = segment[i];
      const nxt = segment[i + 1];
      if (cur.id === 13 && nxt.id === 14) {
        d += ` Q${nxt.x - 20},${(cur.y + nxt.y) / 2} ${nxt.x},${nxt.y}`;
      } else {
        d += ` L${nxt.x},${nxt.y}`;
      }
    }
    return d;
  }

  return (
    <div className="w-full h-[504px] justify-center items-center overflow-hidden">


      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* تعریف فلش (Arrow Head) */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#ffcc00" />
            </marker>
          </defs>
        <defs>
          تعریف فیلتر درخشش (Glow) برای نزدیک‌ترین ایستگاه
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* <g stroke="#333" strokeWidth="1" fill="none">
          <path d="M50,200 L450,200 M50,400 L450,400 M100,50 L100,1000 M400,50 L400,1000" />
          <path d="M50,750 Q250,700 450,750" opacity="0.5" />
        </g> */}

        

        
        <IsfahanStreets />

        <g transform='translate(0, -100)'>
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

          {highlightedSegments.size > 0 && (
            <>
              {/* <path
                d={generatePath(Math.min(startIndex + 1, endIndex), Math.max(startIndex, endIndex))}
                fill="none"
                stroke="none"
                strokeWidth="3"
                strokeLinecap="round"
                markerEnd={!isReverse ? "url(#arrowhead)" : ""}
                markerStart={!isReverse ? "url(#arrowhead)" : ""}
                style={{ transition: 'all 0.3s ease', rotate: isReverse ? "180" : "0" }}
              /> */}
              {/* <path
                d={generatePath(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex))}
                fill="none"
                stroke="#ffcc00"
                strokeWidth="3"
                strokeLinecap="round"
                markerEnd={!isReverse ? "url(#arrowhead)" : ""}
                markerStart={isReverse ? "url(#arrowhead)" : ""}
                style={{ transition: 'all 0.3s ease' }}
              /> */}
            </>
              
            )}

            

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
              <g onClick={() => (station.id === 2 || station.id === 3 || station.id === 17 || station.id === 18) && isHoliday ? {} : onStationClick(station.name)} className='relative' key={`station-group-${station.id}`} transform={`translate(${station.x}, ${station.y})`}>
                
                
                
                
                
                <circle
                  cx={0}
                  cy={0}
                  r={isSource || isDest ? "8" : "5"}
                  strokeOpacity={(station.id === 2 || station.id === 3 || station.id === 17 || station.id === 18) && isHoliday ? 0.35 : 1}
                  fill={(station.id === 2 || station.id === 3 || station.id === 17 || station.id === 18) && isHoliday ? (isHighlighted ? '#00bcd4' : '#666') : isSource || isDest ? "#ffcc00" : (isHighlighted ? "#fff" : "#666")}
                  className={(station.id === 2 || station.id === 3 || station.id === 17 || station.id === 18) && isHoliday ? '' : (isHighlighted || isDest || isSource ? "station-circle-highlight" : "station-circle")}
                />
                    
                <path
                // ${(station.id > stations.length - 1) ? 'hidden' : 'block'} 
                    className={`${(isReverse && station.id !== startIndex - 1 && station.id !== endIndex) || (!isReverse && station.id !== startIndex && station.id !== endIndex - 1) ? 'hidden' : 'block'}`}
                    d="
                       M -6 0
                      Q 0 3 6 0
                      L 0 8
                      Z
                    "
                    fill="#00bcd4"
                    transform={`translate(${station.arrowX}, ${station.arrowY}) scale(1.3) rotate(${isReverse ? (station.arrowRotation + 180) : station.arrowRotation })`}
                    stroke={"#00bcd4"}
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeMiterlimit={10}
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

                {/* نمایش حباب مبدا یا مقصد */}
                {(isSource || isDest) && (
                  <g transform={`translate(0, -5) scale(${bubbleScale})`} className='z-10'>
                    {/* شکل حباب */}
                    <path
                      // d="M -16 -30 H 16 V -10 H 6 L 0 0 L -6 -10 H -16 Z"

                        d="M -10 -30
                          H 10
                          Q 16 -30 16 -24
                          V -16
                          Q 16 -10 10 -10
                          L 5 -10
                          L 0 -5
                          L -5 -10
                          Q -16 -10 -16 -16
                          V -24
                          Q -16 -30 -10 -30
                          Z"

                      fill={isSource ? "#00c853" : "#d50000"}
                      className="drop-shadow-lg"
                    />

                    {/* متن داخل حباب */}
                    <text
                      y="-17"
                      textAnchor="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="bold"
                      className="select-none"
                      style={{ pointerEvents: 'none' }}
                    >
                      {isSource ? "مبدا" : "مقصد"}
                    </text>
                  </g>
                )}
                {isNearest && (
                  <circle
                    cx={0}
                    cy={0}
                    r={"7"}
                    fillOpacity="0.3"
                    fill="#00ccff"
                    filter="url(#glow)"
                    className={"animate-pulse"}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default MetroMap;