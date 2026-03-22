function LoadingSkeleton() {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="skeleton-card" />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
