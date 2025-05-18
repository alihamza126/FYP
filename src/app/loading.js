"use client"

const LoadingMinimal = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Custom spinner with Tailwind */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>

        <h2 className="mt-6 text-xl font-semibold text-gray-700">Loading Shop</h2>
        <p className="mt-2 text-sm text-gray-500">Please wait...</p>

        {/* Loading progress bar */}
        <div className="w-64 h-1.5 bg-gray-100 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-loadingBar"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingMinimal
