import Image from "next/image";
import { FaBook, FaClipboard, FaUserGraduate, FaPoll, FaQuestionCircle } from 'react-icons/fa';
import { TiContacts } from "react-icons/ti";
import { AiOutlineFileText, AiOutlineLogin, AiOutlineLogout, AiOutlinePlusCircle } from "react-icons/ai";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useContext, useState } from "react";
import { SidebarContext } from "@/context/SidebarContext";
import { useRouter } from "next/router";
// import ActionButton from "@/components/sample_components/ui-components/ActionButton";
// import Modal from "@/components/sample_components/ui-components/Modal";
import NextLink from "next/link";
import { FiCheckCircle } from 'react-icons/fi';

const sidebarItems = [
  {
    name: "Subjects",
    href: "/examiner",
    icon: FaBook,
  },
  {
    name: "Students",
    href: "/examiner/students",
    icon: FaUserGraduate,
  },
  {
    name: "Questions",
    href: "/examiner/questions",
    icon: FaQuestionCircle,
  },
  {
    name: "Exams",
    href: "/examiner/exam",
    icon: FaClipboard,
  },
  
  {
    name: "Mark Exam",
    href: "/examiner/mark",
    icon: FiCheckCircle ,
  },
  
  // {
  //   name: "Scores",
  //   href: "/examiner/scores",
  //   icon: FaPoll ,
  // },
  
  {
    name: "Results",
    href: "/examiner/results",
    icon: FaPoll ,
  },
];

const ExaminerSideBar = () => {
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
            width={200}
            height={100}
            className="sidebar__logo"
            src="/assets/logo.png"
            alt="logo"
          />

        </div>

        <h1 className="menu">MENU</h1>

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
      {/* <Modal
        isOpen={logoutModalOpen}
        heading={"Confirm Logout"}
        positiveText={"Logout"}
        negativeText={"Cancel"}
        onClose={() => setLogoutModalOpen(false)}
        onSubmit={handleLogout}
        onCancel={() => setLogoutModalOpen(false)}
      >
        <p>Are you sure you want to logout?</p>
      </Modal> */}
    </div>
  );
};

export default ExaminerSideBar;
