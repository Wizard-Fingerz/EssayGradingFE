import ExaminerSidebar from "./ExaminerSideBar";

const ExaminerBaseLayout = ({ children }) => {
  return (
    <div className="layout">
        <ExaminerSidebar />
      <main className="layout__main-content">{children}</main>
    </div>
  );
};

export default ExaminerBaseLayout;
