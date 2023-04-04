import { NavItem } from "./Sidebar";
import {
  HiViewGrid,
  HiOutlineUser,
  HiOutlineUsers,
  HiCurrencyEuro,
  HiClipboardList,
  HiOutlineMenuAlt2,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { ReactNode } from "react";
import PatientsPage from "../pages/PatientsPage";
import ExamnsPage from "../pages/ExamsPage";
import ConsultationsPage from "../pages/ConsultationsPage";
import UsersPage from "../pages/UsersPage";
import TypesPage from "../pages/TypesPage";
import ProductsPage from "../pages/ProductsPage";
import SpentsPage from "../pages/SpentsPage";
import NewConsultationPage from "../pages/NewConsultationPage";
import SubscriptionsPage from "../pages/SubscriptionsPage";
import {
  IoBagOutline,
  IoCheckboxOutline,
  IoSnowOutline,
} from "react-icons/io5";
import DiagnosticsPage from "../pages/DiagnosticsPage";
import HomePage from "../pages/HomePage";
export const defaultNavItems: (NavItem & { element: ReactNode })[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <HiViewGrid />,
    sidebar: true,
    element: <HomePage />,
  },
  {
    label: "Patients",
    href: "/patients",
    element: <PatientsPage />,
    icon: <HiOutlineUsers />,
    sidebar: true,
  },
  {
    label: "Consultations",
    href: "/consultations",
    element: <ConsultationsPage />,
    sidebar: true,
    icon: <HiOutlineMenuAlt2 />,
  },
  {
    label: "Consultations",
    href: "/consultations/+",
    element: <NewConsultationPage />,
    sidebar: false,
    icon: <HiOutlineMenuAlt2 />,
  },
  {
    label: "Abonnements",
    href: "/subscriptions",
    element: <SubscriptionsPage />,
    sidebar: true,
    icon: <IoCheckboxOutline />,
  },
  {
    label: "Examens",
    href: "/exams",
    element: <ExamnsPage />,
    sidebar: true,
    icon: <HiOutlineDocumentText />,
  },
  {
    label: "Utilisateurs",
    element: <UsersPage />,
    href: "/users",
    icon: <HiOutlineUser />,
    sidebar: true,
  },
  // {
  //   label: "Prescriptions",
  //   element: <HiViewGrid />,
  //   href: "/prescriptions",
  //   icon: <HiPencilAlt />,
  // },
  {
    label: "Produits",
    element: <ProductsPage />,
    href: "/products",
    icon: <IoBagOutline />,
    sidebar: true,
  },
  {
    label: "Types de produits",
    href: "/products-types",
    element: <TypesPage />,
    icon: <HiClipboardList />,
    sidebar: true,
  },
  {
    label: "Diagnostiques",
    href: "/diagnostics",
    element: <DiagnosticsPage />,
    icon: <IoSnowOutline />,
    sidebar: true,
  },
  {
    label: "Dépenses",
    href: "/spents",
    element: <SpentsPage />,
    sidebar: true,
    icon: <HiCurrencyEuro />,
  },
];
