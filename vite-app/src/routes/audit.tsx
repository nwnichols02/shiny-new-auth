import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns';
import { auditService } from '../auth/api';

export const Route = createFileRoute('/audit')({
  component: AuditLog,
})

export interface IAuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  status: 'success' | 'failure';
  ipAddress?: string;
  userAgent?: string;
}

interface AuditEntryProps {
  entry: IAuditEntry;
}

export function AuditEntry({ entry }: AuditEntryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm:ss')}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${entry.status === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}
          >
            {entry.status}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          ID: {entry.id}
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{entry.userName}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{entry.userId}</span>
        </div>

        <div className="mt-1 flex items-center space-x-2">
          <span className="font-medium text-blue-600">{entry.action}</span>
          <span className="text-gray-400">→</span>
          <span className="font-medium text-purple-600">{entry.resource}</span>
        </div>

        {entry.details && Object.keys(entry.details).length > 0 && (
          <div className="mt-2 bg-gray-50 rounded p-2">
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(entry.details, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500 flex items-center space-x-4">
          {entry.ipAddress && (
            <span>IP: {entry.ipAddress}</span>
          )}
          {entry.userAgent && (
            <span className="truncate">
              Agent: {entry.userAgent}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuditLog() {
  const {
    data: logs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['auditLogs'],
    queryFn: ({ pageParam = 1 }) => auditService.getAuditLogs(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Audit Log</h2>
        <div className="text-sm text-gray-500">
          Total entries: {logs?.pages[0]?.totalCount || 0}
        </div>
      </div>

      <div className="space-y-4">
        {logs?.pages.map((page, i) => (
          <div key={i} className="space-y-4">
            {page.logs.map(log => (
              <AuditEntry key={log.id} entry={log} />
            ))}
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}