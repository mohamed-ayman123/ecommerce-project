import Logo from '@/components/common/Logo'

export default function App() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full space-y-4">
        <Logo variant="dark" size="lg" className="justify-center" />
        <p className="text-xs text-[#585858] font-roboto">
          Admin Dashboard configured &amp; ready for feature implementation.
        </p>
      </div>
    </div>
  )
}
