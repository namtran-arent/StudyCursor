'use client';

export default function PlanCard() {
  return (
    <div className="mb-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg p-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm font-medium opacity-90 mb-2">CURRENT PLAN</p>
            <h2 className="text-6xl font-bold">Researcher</h2>
          </div>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 text-sm font-medium backdrop-blur-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Manage Plan
          </button>
        </div>

        {/* API Usage */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">API Usage</h3>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm opacity-90 mb-2">Monthly plan</p>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>0/1,000 Credits</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: '0%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Pay as you go</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="w-11 h-6 bg-white/30 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
