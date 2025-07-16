import heroImage from "../../assets/flower.png";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes";

const HomePage = () => {
  const navigate = useNavigate();
  const handleStart = () => {
    const isProduction = import.meta.env.VITE_Environment === "production";

    if (isProduction) {
      window.location.href = "https://oracle.squirkle.xyz/";
    } else {
      navigate(ROUTES.default);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12261e] to-[#4B724F] text-white relative">
      {/* Main Content - Centered */}
      <div className="max-w-7xl mx-auto min-h-screen flex flex-col justify-center items-center">
        <div className="flex justify-center mb-8">
          <img src={heroImage} alt="" className="w-[108px] h-[108px]" />
        </div>

        <div className="flex flex-col items-center justify-center px-6">
          <div className="text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-[40px] lg:text-[74px]  font-['Grotesque'] font-medium text-[#CBFB93] !leading-[1]">
                Not school.
                <br />
                Not coaching.
              </h1>

              <h2 className="text-[30px] lg:text-[42px] font-['Grotesque'] font-medium text-[#CBFB93]">
                Just learning - your way
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-2 text-[14px] lg:text-[16px] font-['Funnel_Sans'] text-[#CCECDB] max-w-[500px] mx-auto">
              <p>
                Where structure meets freedom, and AI meets curiosity. Squirkle
              </p>
              <p>is your space to think, talk, and grow — shaped by you.</p>
            </div>

            {/* Open App Button */}
            <div className="pt-2">
              <button
                onClick={handleStart}
                className="bg-[#1B382D] text-[#CBFB93] px-4 py-2 rounded-md font-['Funnel_Sans'] font-medium text-[16px] hover:bg-[#1F4631] transition-colors duration-200 border border-white/10"
              >
                Open app
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-6">
        <p className="text-[#CBFB93] text-sm font-['Funnel_Sans']">
          ©2025 - Squirkle
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
