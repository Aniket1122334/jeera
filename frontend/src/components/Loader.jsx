const Loader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="w-15 h-15 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white text-xl font-bold">J</span>
        </div>

        {/* Loader */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
