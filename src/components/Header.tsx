
export default function Header({ time, date }: { time: string, date: string }) {
  return (
    <header className="text-center min-h-fit py-2 font-vazir bg-gray-900">
        <h1 className="text-3xl font-bold text-cyan-400">برنامه حرکت قطار شهری اصفهان</h1>
        <p className="text-gray-300 mt-2">ساعت حرکت قطارهای بعدی از ایستگاه مورد نظر شما</p>
        <span className="font-vazir rtl text-white">{date}</span>
        <hr />
        <span className='font-vazir rtl text-white'>{time}</span>
    </header>
  )
}
