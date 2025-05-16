export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 p-4 space-y-6 md:space-y-0 md:space-x-6">
      {/* Sidebar */}
      <aside className="animate-pulse bg-white rounded-2xl p-6 w-full md:w-72 space-y-6 flex-shrink-0">
        {/* Avatar */}
        <div className="w-24 h-24 bg-surface rounded-full mx-auto" />

        {/* Name / Email */}
        <div className="space-y-2">
          <div className="h-4  bg-secondary2 rounded w-3/4 mx-auto" />
          <div className="h-3 bg-surface rounded w-1/2 mx-auto" />
        </div>

        {/* Nav items */}
        <nav className="mt-6 space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div
              key={i}
              className="h-6 bg-surface rounded-md w-5/6 mx-auto"
            />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col space-y-6">
        {/* Top stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl p-6 h-28"
              >
                <div className="h-4 bg-surface rounded w-1/3 mb-4" />
                <div className="h-8 bg-surface rounded w-1/2" />
              </div>
            ))}
        </div>

        {/* Recent Orders table */}
        <div className="overflow-x-auto bg-white rounded-2xl p-4 animate-pulse">
          <table className="w-full">
            <thead>
              <tr>
                {["Order", "Items", "Price", "Status"].map((col) => (
                  <th
                    key={col}
                    className="pb-4 text-left text-sm font-bold uppercase text-secondary"
                  >
                    <div className="h-4 w-24 bg-surface rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array(5)
                .fill(0)
                .map((_, row) => (
                  <tr key={row} className="h-16">
                    {/* Order ID */}
                    <td className="py-2">
                      <div className="h-4 w-16 bg-surface rounded" />
                    </td>

                    {/* Items thumbnails */}
                    <td className="py-2">
                      <div className="flex space-x-2">
                        {Array(2)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="h-10 w-10 bg-surface rounded"
                            />
                          ))}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-2">
                      <div className="h-4 w-20 bg-surface rounded" />
                    </td>

                    {/* Status */}
                    <td className="py-2 text-right">
                      <div className="h-6 w-24 bg-surface rounded-full mx-auto" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
