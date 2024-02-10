import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";
import { BsPeople, BsPersonCircle, BsBell, BsPeopleFill } from "react-icons/bs";
import { TiContacts } from "react-icons/ti";
import { TiBeer } from "react-icons/ti";
import { FiMail, FiFileText, FiBarChart2 } from "react-icons/fi";
import { AiOutlineFileText, AiOutlineLogin, AiOutlineLogout, AiOutlinePlusCircle } from "react-icons/ai";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useContext, useState } from "react";
import { SidebarContext } from "@/context/SidebarContext";
import { useRouter } from "next/router";
import ActionButton from "@/components/sample_components/ui-components/ActionButton";
import Modal from "@/components/sample_components/ui-components/Modal";
import NextLink from "next/link";

const sidebarItems = [
  {
    name: "Property",
    href: "/marketer",
    icon: AiOutlineHome,
  },
  {
    name: "Prospects",
    href: "/marketer/prospects",
    icon: TiContacts,
  },
  {
    name: "Customers",
    href: "/marketer/customers",
    icon: TiContacts,
  },
  {
    name: "Reports",
    href: "/marketer/reports",
    icon: FiBarChart2,
  },
  {
    name: "Profile",
    href: "/marketer/profile",
    icon: BsPersonCircle,
  },
];

const MarketerSideBar = () => {
  const router = useRouter();
  const { isCollapsed, toggleSidebarcollapse } = useContext(SidebarContext);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing user session)

    // Redirect to login page after logout
    router.push("/");
  }

  return (
    <div className="sidebar__wrapper">
      <button className="btn" onClick={toggleSidebarcollapse}>
        {isCollapsed ? <MdKeyboardArrowRight style={{ color: 'white' }}/> : <MdKeyboardArrowLeft style={{ color: 'white' }}/>}
      </button>
      <aside className="sidebar" data-collapse={isCollapsed}>
        <div className="sidebar__top">
          <Image
            width={20}
            height={20}
            className="sidebar__logo"
            src="/assets/logo_white.svg"
            alt="logo"
          />
          <p className="sidebar__logo-name">Marketer</p>
        </div>
        <ul className="sidebar__list">
          {sidebarItems.map(({ name, href, icon: Icon }) => {
            return (
              <li className="sidebar__item" key={name}>
                <NextLink href={href} className={`sidebar__link ${
                      router.pathname === href ? "sidebar__link--active" : ""
                    }`}>
                  
                    <span className="sidebar__icon">
                      <Icon />
                    </span>
                    <span className="sidebar__name">{name}</span>
                  
                </NextLink>
              </li>
            );
          })}
        </ul>
      </aside>
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        heading={"Confirm Logout"}
        positiveText={"Logout"}
        negativeText={"Cancel"}
        onClose={() => setLogoutModalOpen(false)}
        onSubmit={handleLogout}
        onCancel={() => setLogoutModalOpen(false)}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default MarketerSideBar;
