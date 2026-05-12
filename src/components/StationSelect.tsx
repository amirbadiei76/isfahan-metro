import { Fragment, useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { Station } from '../data/stations';


interface StationSelectProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    stations: Station[];
}

export default function StationSelect ({ label, value, onChange, stations }: StationSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState(value)
    const [searchedStation, setSearchedStation] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null)

    function toggleDropdown () {
        setIsOpen((open) => !open)
    }

    function handleClickOutside () {
        document.addEventListener('click', (e) => {
            if (!dropdownRef.current?.contains(e.target as Node)) {
                setIsOpen(false)
            }
        })
    }

    useEffect(() => {
        handleClickOutside();
    }, [])

    return (
        <div ref={dropdownRef} className="relative w-full text-sm ">
            <button
                type="button"
                onClick={toggleDropdown}
                className='bg-gray-700 rtl border outline-0 border-gray-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full py-1.5 px-3 cursor-pointer'
            >
            <i className="bi bi-chevron-down"></i>
            <span className="dropdown-text-base rtl" >{currentValue || 'انتخاب کنید...'}</span>
            </button>
            
            {
                isOpen ?
                <span className='absolute top-12 bg-gray-700 rtl border outline-0 border-gray-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full py-1.5 px-3 cursor-pointer'>
                    <input type="text" className='border outline-0 border-white rounded-md py-1.5 px-2 w-full mb-2' value={searchedStation} onChange={(e) => setSearchedStation(e.target.value)} />
                    <ul className="scroll-hide max-h-88 overflow-scroll">
                        {
                            stations.filter((item) => item.name.includes(searchedStation)).map((item) => {
                                return (
                                    <li>
                                        <button
                                            type="button"
                                            className="py-1.5 w-full cursor-pointer text-right"
                                        >
                                            {item.name}
                                        </button>
                                    </li>        
                                )
                            })
                        }
                    </ul>
                </span>
                :
                <></>
            }
        </div>

        // <div className="flex flex-col font-vazir">
        //     <label htmlFor={label} className="mb-2 rtl text-sm font-medium text-gray-300">{label}</label>
        //     <select
        //         id={label}
        //         value={value}
        //         onChange={onChange}
        //         className="bg-gray-700 rtl border outline-0 border-gray-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
        //     >
        //         <option value="" disabled>انتخاب کنید...</option>
        //             {
        //                 stations.map((station) => (
        //                     <option
        //                         key={station.id}
        //                         value={station.name}
        //                     >
        //                         {station.name}
        //                     </option>
        //                 ))
        //             }
        //     </select>
        // </div>
    );
}
