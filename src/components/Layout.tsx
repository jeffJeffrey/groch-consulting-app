import { ExclamationIcon } from "@heroicons/react/solid";
import { Callout } from "@tremor/react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = (props: PropsWithChildren) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isOnLine = useOnlineStatus();
  return (
    <div className="grid min-h-screen grid-rows-header bg-zinc-100">
      <div>
        <Navbar onMenuButtonClick={() => setSidebarOpen((prev) => !prev)} />
      </div>
      <div className="grid md:grid-cols-sidebar">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="p-5 pb-28 overflow-x-auto">
          {!isOnLine && (
            <Callout
              color="red"
              icon={ExclamationIcon}
              title="Vous n'estes pas connecté à internet"
            >
              Veillez verifier votre connection internet pour continuer.
            </Callout>
          )}
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

const useOnlineStatus = (): boolean => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOnlineStatus(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  return onlineStatus;
};
