import classNames from "classnames";
import { IoMdSync } from "react-icons/io";
import { IoReorderThreeOutline } from "react-icons/io5";
import LogoFull from "../assets/images/logo-full.png";

type PropsType = {
  onMenuButtonClick(): void;
};

export default function Navbar(props: PropsType) {
  return (
    <nav
      className={classNames({
        "bg-white text-zinc-500": true, // colors
        "flex items-center": true, // layout
        "w-full fixed z-10 px-4 shadow-sm h-16": true, //positioning & styling
      })}
    >
      <div className="font-bold text-lg">
        <img src={LogoFull} className="w-[70px] h-[50px]" />
      </div>
      <div className="flex-grow"></div>
      <button>
        <IoMdSync
          size={30}
          onClick={() => {
            location.reload();
          }}
        />
      </button>
      <button className="md:hidden" onClick={props.onMenuButtonClick}>
        <IoReorderThreeOutline size={30} />
      </button>
    </nav>
  );
}
