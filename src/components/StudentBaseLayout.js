import StudentSidebar from "./StudentSideBar";

const StudentBaseLayout = ({ children }) => {
  return (
    <div className="layout">
        <StudentSidebar />
      <main className="layout__main-content">{children}</main>
    </div>
  );
};

export default StudentBaseLayout;
