
export default function Header({ time, date }: { time: string, date: string }) {
  return (
    <header className="text-center min-h-fit my-2 font-vazir">
        <h1 className="text-4xl font-bold text-cyan-400">برنامه حرکت قطار شهری اصفهان</h1>
        <p className="text-gray-400 mt-2">ساعت حرکت قطارهای بعدی از ایستگاه مورد نظر شما</p>
        <span className="font-vazir rtl">{date}</span>
        <hr />
        <span className='font-vazir rtl'>{time}</span>
    </header>
  )
}
