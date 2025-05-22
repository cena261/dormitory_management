import Sidebar from "@/components/sv_components/sidebar";
import Header from "@/components/sv_components/Header";

function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="pt-[85px] p-6">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
