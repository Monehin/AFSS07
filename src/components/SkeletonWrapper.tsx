import React from "react";
import { Skeleton } from "./ui/skeleton";

const SkeletonWrapper = ({
  children,
  isLoading,
  className,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
  className?: string;
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }
  return (
    <Skeleton className={className}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
};

export default SkeletonWrapper;
