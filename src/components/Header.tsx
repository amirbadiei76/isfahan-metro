
export default function Header({ time, date }: { time: string, date: string }) {
  return (
    <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-cyan-400 font-vazir">برنامه حرکت قطار شهری اصفهان</h1>
        <p className="text-gray-400 mt-2 font-vazir">ساعت حرکت قطارهای بعدی از ایستگاه مورد نظر شما</p>
        <span className="font-vazir">{date}</span>
        <hr />
        <span className='font-vazir'>{time}</span>
    </header>
  )
}
