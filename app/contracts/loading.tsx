import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ContractsLoading() {
  return (
    <MainLayout userRole="admin">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <th key={i} className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                        <Skeleton className="h-4 w-20" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 4 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {Array.from({ length: 7 }).map((_, colIndex) => (
                        <td key={colIndex} className="p-2 align-middle">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
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
