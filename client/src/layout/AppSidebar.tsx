import { Link } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";

const AppSidebar = () => {
    const { isOpen, toggleSidebar } = useSidebar()

    const sidebarItems = [
        {
            path: '/',
            text: 'Genders',
        },
        {
            path: '/users',
            text: 'Users',
        }
    ]
    return (
        <>
            {!isOpen && (
                <div className="fixed inset-0 z-30 blur-lg sm:hidden" onClick={toggleSidebar} />
            )}
            <aside id="top-bar-sidebar" className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] transition-transform  ${isOpen ? `-translate-x-full` : `translate-x-0`} sm:translate-x-0`} aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto border-r border-white/10 bg-slate-800 text-white">
                    <ul className=" space-y-2 font-medium">
                        {sidebarItems.map((sidebarItem) => (
                            <li key={sidebarItem.text}>
                                <Link to={sidebarItem.path} className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-white/10 group">
                                    <span className=" ms-3">{sidebarItem.text}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default AppSidebar;