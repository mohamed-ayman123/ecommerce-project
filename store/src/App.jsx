import Logo from '@/components/common/Logo'

export default function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
      <div className="p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full space-y-4">
        <Logo variant="dark" size="lg" className="justify-center" />
        <p className="text-xs text-[#585858] font-roboto">
          Online Store configured &amp; ready for customer flow implementation.
        </p>
      </div>
    </div>
  )
}
