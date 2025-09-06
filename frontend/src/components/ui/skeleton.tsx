import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Specific skeleton components for common use cases
function RequestCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <div className="space-y-4">
        {/* Header with title and status */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-6 w-20 ml-4" />
        </div>

        {/* Category and price */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Requester info */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Location and time */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Applications count */}
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

function RequestDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Requester info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Applications section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatMessageSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-xs lg:max-w-md space-y-2 ${
            i % 2 === 0 ? 'items-start' : 'items-end'
          }`}>
            <div className="flex items-center space-x-2">
              {i % 2 === 0 && <Skeleton className="h-6 w-6 rounded-full" />}
              <Skeleton className="h-3 w-20" />
              {i % 2 !== 0 && <Skeleton className="h-6 w-6 rounded-full" />}
            </div>
            <Skeleton className={`h-10 ${i % 2 === 0 ? 'w-48' : 'w-40'} rounded-2xl`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function UserProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex items-start space-x-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center p-4 border rounded-lg">
            <Skeleton className="h-8 w-12 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { 
  Skeleton, 
  RequestCardSkeleton, 
  RequestDetailSkeleton, 
  ChatMessageSkeleton,
  UserProfileSkeleton 
};