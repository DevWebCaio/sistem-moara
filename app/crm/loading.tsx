import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-80" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-10" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">
                      <Skeleton className="h-5 w-20" />
                    </th>
                    <th className="px-4 py-2 text-left">
                      <Skeleton className="h-5 w-32" />
                    </th>
                    <th className="px-4 py-2 text-left">
                      <Skeleton className="h-5 w-24" />
                    </th>
                    <th className="px-4 py-2 text-left">
                      <Skeleton className="h-5 w-28" />
                    </th>
                    <th className="px-4 py-2 text-left">
                      <Skeleton className="h-5 w-20" />
                    </th>
                    <th className="px-4 py-2 text-right">
                      <Skeleton className="h-5 w-24 ml-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-2">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="px-4 py-2">
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td className="px-4 py-2">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="px-4 py-2">
                        <Skeleton className="h-5 w-28" />
                      </td>
                      <td className="px-4 py-2">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
