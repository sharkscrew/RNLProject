import { Link } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";

const AppSidebar = () => {
    const { isOpen, toggleSidebar } = useSidebar()

    const sidebarItems = [
        {
            path: '#',
            text: 'Gender List',
        },
        {
            path: '#',
            text: 'User List',
        }
    ]
    return (
        <>
            {!isOpen && (
                <div className="fixed inset-0 z-30 blur-lg sm:hidden" onClick={toggleSidebar} />
            )}
            <aside id="top-bar-sidebar" className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] transition-transform  ${isOpen ? `-translate-x-full` : `translate-x-0`} sm:translate-x-0`} aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto border-r border-black">
                    <ul className=" space-y-2 font-medium">
                        {sidebarItems.map((sidebarItem) => (
                            <li>
                                <Link to={sidebarItem.path} className=" flex items-center px-2 py-1.5 text white text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
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