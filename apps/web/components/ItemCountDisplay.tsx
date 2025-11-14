"use client";

interface ItemCountDisplayProps {
  displayedItems: number;
  totalCount: number;
}

export default function ItemCountDisplay({ displayedItems, totalCount }: ItemCountDisplayProps) {
  return (
    <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
      Displaying {displayedItems} of {totalCount} items
    </p>
  );
}
