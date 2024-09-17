const Loader = () => {
  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center">
      <div className="w-24 h-24 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center duration-1000 justify-center border-t-primary-800 rounded-full">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin duration-700 flex items-center justify-center border-t-primary-600 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-primary-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
