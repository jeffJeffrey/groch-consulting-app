import React, { useRef, useState } from "react";
import classNames from "classnames";
import { useLocalStorage, useOnClickOutside } from "usehooks-ts";
import { defaultNavItems } from "./NavLinks";
import { useLocation, Link } from "react-router-dom";
import { IoLogOutOutline, IoPerson } from "react-icons/io5";
import { User } from "../types";
import { useAuth } from "../context";
import ModaleLayout from "./ModaleLayout";
import { UserForm } from "./UserForm";

// define a NavItem prop
export type NavItem = {
  label: string;
  href: string;
  sidebar: boolean;
  icon: React.ReactNode;
};
// add NavItem prop to component prop
type PropsType = {
  open: boolean;
  navItems?: NavItem[];
  setOpen(open: boolean): void;
};
const Sidebar = ({ open, navItems = defaultNavItems, setOpen }: PropsType) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, (e) => {
    setOpen(false);
  });
  const { pathname } = useLocation();

  const [, setToken] = useLocalStorage<string | null>("token", null);
  const [, setUser] = useLocalStorage<User | null>("user", null);
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  function handleEditProfileModal() {
    setIsOpen(true);
  }
  return (
    <div
      className={classNames({
        "flex flex-col justify-between": true, // layout
        "bg-white": true,
        shadow: true, //
        "md:w-full md:sticky md:top-16 md:z-0 top-0 z-20 fixed": true, // positioning
        "md:h-[calc(100vh_-_64px)] h-full w-[300px]": true, // for height and width
        "transition-transform .3s ease-in-out md:-translate-x-0": true, //animations
        "-translate-x-full ": !open, //hide sidebar to the left when closed
      })}
      ref={ref}
    >
      <nav className="md:sticky top-0 md:top-16">
        {/* nav items */}
        <div
          className="p-4 flex items-center gap-3 cursor-pointer"
          onClick={handleEditProfileModal}
        >
          <IoPerson className="text-center" size={40} />
          <div className="flex flex-col">
            <h2 className="font-bold">{user?.name}</h2>
            <small className="font-mono">@{user?.username}</small>
          </div>
        </div>
        <ul className="py-2 flex flex-col gap-2" onClick={() => setOpen(false)}>
          {navItems
            .filter((n) => n.sidebar)
            .filter((n) => {
              if (n.href.includes("spents") && !isAdmin) return false;
              return true;
            })
            .map((item, index) => {
              const itemFirstPart = item.href.split("/")[1];
              const pathnameFirstPart = pathname.split("/")[1];
              const active = itemFirstPart === pathnameFirstPart;
              return (
                <Link key={index} to={item.href}>
                  <li
                    className={classNames({
                      " hover:bg-neutral-200 dark:hover:text-white": !active, //colors
                      " text-white bg-[#F97316]": active, //colors
                      "flex gap-4 items-center ": true, //layout
                      "transition-colors duration-300": true, //animation
                      "rounded-md p-2 mx-2": true, //self style
                    })}
                  >
                    {item.icon} {item.label}
                  </li>
                </Link>
              );
            })}
        </ul>
      </nav>
      {/* account  */}
      <div className="border-t p-4">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col ">
            <button
              onClick={() => {
                setToken(null);
                setUser(null);
              }}
              className="flex gap-2 justify-center items-center"
            >
              <IoLogOutOutline size={25} />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>
      <ModaleLayout
        closeModal={() => {
          setIsOpen(false);
        }}
        isOpen={isOpen}
        title={"Modifier mon profile"}
      >
        <UserForm
          user={user}
          onSuccess={() => {
            location.reload();
            setIsOpen(false);
          }}
        />
      </ModaleLayout>
    </div>
  );
};
export default Sidebar;
