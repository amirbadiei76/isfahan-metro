import { type ChangeEvent } from 'react'
import type { Station } from '../data/stations';


interface StationSelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    stations: Station[];
}

export default function StationSelect ({ label, value, onChange, stations }: StationSelectProps) {
    return (
        <div className="flex flex-col">
            <label htmlFor={label} className="mb-2 text-sm font-medium text-gray-300">{label}</label>
            <select
                id={label}
                value={value}
                onChange={onChange}
                className="bg-gray-700 border border-gray-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
            >
                <option value="" disabled>انتخاب کنید...</option>
                    {stations.map((station) => (
                <option key={station.id} value={station.name}>
                {station.name}
                </option>
            ))}
            </select>
        </div>
    );
}
