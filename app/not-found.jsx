export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
        {/* 404 */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-[120px] md:text-[160px] font-extrabold text-purple-700">
            4
          </span>
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-purple-700 to-purple-400 flex items-center justify-center text-white font-bold text-4xl">
          </div>
          <span className="text-[120px] md:text-[160px] font-extrabold text-purple-700">
            4
          </span>
        </div>
  
        {/* Title */}
        <h2 className="mt-6 text-2xl md:text-3xl font-semibold text-purple-700">
          What on earth are you doing here!?
        </h2>
  
        {/* Description */}
        <p className="mt-3 text-grey-700 max-w-xl">
          Well, this is awkward, the page you were trying to view does not exist.
        </p>
  
        {/* Link */}
        <a
          href="/"
          className="mt-6 inline-block text-purple-700 font-medium hover:underline"
        >
          Get yourself home
        </a>
      </div>
    );
  }
  