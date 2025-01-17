const Loader = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex h-24 w-24 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-primary-800 text-4xl text-blue-400 duration-1000">
        <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-primary-600 text-4xl text-blue-400 duration-700">
          <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-primary-400 text-2xl text-red-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
