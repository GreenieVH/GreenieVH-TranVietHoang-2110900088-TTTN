import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGenres, useTvGenres } from "../../Servives/GlobalApi";
import {
  HiHome,
  HiStar,
  HiPlayCircle,
  HiTv,
} from "react-icons/hi2";
import { HiPlus, HiMenu, HiX } from "react-icons/hi";
import { useAccountDetails } from "../../Servives/Auth";
import logo from "../../assets/Images/logo-gm.png";
import HeaderItem from "./HeaderItem";
import UserProfile from "./UserProfile";
import GenresList from "../GenresList";
import SearchBar from "../SearchBar";

function Header() {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("sessionId");
  const { accountDetails } = useAccountDetails(sessionId);
  const { genres } = useGenres();
  const { tvGenres } = useTvGenres();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const menu = [
    { name: "Trang chủ", icon: HiHome, link: "/" },
    { name: "Phim lẻ", icon: HiPlayCircle, link: "/movies/28", isGenres: true },
    { name: "Phim Bộ", icon: HiTv, link: "/tvs/10759", isGenres: true },
    { name: "Yêu thích", icon: HiStar, link: "/favoritelist" },
    { name: "WATCHLIST", icon: HiPlus, link: "/watch-list" },
  ];

  const renderMenu = (menuItems) =>
    menuItems.map((item, index) => (
      <div key={index} className="group relative">
        <HeaderItem name={item.name} Icon={item.icon} link={item.link} />
        {item.isGenres && (
          <div className="absolute -top-full right-0 lg:top-8 lg:left-0 mt-2 w-[400px] md:w-[700px] bg-gray-800 p-4 rounded-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50">
            {item.name === "Phim lẻ" ? (
              <GenresList
                genres={genres}
                onSelectGenre={(id) => navigate(`/movies/${id}`)}
              />
            ) : (
              <GenresList
                genres={tvGenres}
                onSelectGenre={(id) => navigate(`/tvs/${id}`)}
              />
            )}
          </div>
        )}
      </div>
    ));

  useEffect(() => {
    if (accountDetails?.id) {
      localStorage.setItem("accountId", accountDetails.id);
    }
  }, [accountDetails]);

  return (
    <div className="sticky top-0 z-50 bg-[#0c0f1b] flex p-4 items-center justify-between">
      {/* Logo */}
      <div className="lg:flex items-center hidden">
        <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex gap-4">{renderMenu(menu)}</div>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden flex items-center" ref={menuRef}>
        <button
          className="text-black focus:outline-none"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 p-4 flex flex-col gap-4 z-50">
          <div className="items-center">
            <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          {renderMenu(menu)}
        </div>
      )}

      {/* SearchBar */}
      <SearchBar />

      {/* Profile */}
      {!accountDetails && (
        <div className="">
          <div className="p-2 bg-gray-800 text-white rounded-md transition-all duration-300 z-20 w-max">
            <p className="cursor-pointer font-semibold whitespace-nowrap">
              <Link to="/login" className="text-white hover:text-green-500">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      )}
      {accountDetails && <UserProfile accountDetails={accountDetails} />}
    </div>
  );
}

export default Header;
