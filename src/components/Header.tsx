
export default function Header({ time, date }: { time: string, date: string }) {
  return (
    <header className="text-center min-h-fit py-2 font-vazir bg-gray-900 mb-1">
        <h1 className="text-3xl font-bold text-cyan-500">برنامه حرکت قطار شهری اصفهان</h1>
        <div className="flex flex-col gap-1">
          <h2 className="font-vazir rtl text-white">{date}</h2>
          <h2 className='font-vazir rtl text-white'>{time}</h2>
        </div>
    </header>
  )
}
