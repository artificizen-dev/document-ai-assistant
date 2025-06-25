import mainLogo from "../../assets/main-logo.png";
import heroImage from "../../assets/flower.png";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes";

const HomePage = () => {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate(ROUTES.default);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <img src={mainLogo} alt="logo" className="h-8" />
          </div>
          <button
            onClick={handleStart}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Open App
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="flex-col md:flex md:flex-row justify-between items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-5xl font-bold text-black leading-tight">
                Not school. Not coaching.
                <br />
                Just learning — <em className="italic">your way</em>
              </h1>

              <div className="space-y-2 text-base lg:text-[30px] text-[#7A7A7A]">
                <p>Where structure meets freedom,</p>
                <p>and AI meets curiosity.</p>
              </div>

              <div className="space-y-2 text-base lg:text-[36px] text-[#7A7A7A]">
                <p>Squirkle is your space to think,</p>
                <p>
                  talk, and grow — <em className="italic">shaped by you.</em>
                </p>
              </div>

              <div className="pt-2">
                <h2 className="text-lg lg:text-[32px] font-bold text-black tracking-wider">
                  FLUID. PERSONAL. EVOLVING.
                </h2>
              </div>

              <div className="pt-4">
                <p className="text-base flex justify-end lg:text-lg text-gray-500 italic">
                  That's the Squirkle way.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="relative w-80 h-80 lg:w-96 lg:h-[500px] rounded-3xl flex items-center justify-center p-8"
              style={{
                background: "#204336",
              }}
            >
              <img
                src={heroImage}
                alt="Squirkle visual"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
