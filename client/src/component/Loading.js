export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-screen-lg mx-auto">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-4 w-36"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  );
}
