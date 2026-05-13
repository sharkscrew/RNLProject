import { useEffect, useRef, useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/table";
import UserService from "../../../services/UserService";
import Spinner from "../../../components/Spinner/Spinner";
import type { UserColumns } from "../../../interfaces/UserInterface";
import FloatingLabelInput from "../../../components/input/FloatingLabelInput";

interface UserListProps {
    onAddUser: () => void;
    onEditUser: (user: UserColumns | null) => void;
    onDeleteUser: (user: UserColumns | null) => void;
    refreshKey: boolean
}

const UserList: FC<UserListProps> = ({ onAddUser, onEditUser, onDeleteUser, refreshKey }) => {
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [users, setUsers] = useState<UserColumns[]>([])
    const [usersTableCurrentPage, setUsersTableCurrentPage] = useState(1)
    const [usersTableLastPage, setUsersTableLastPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const tableRef = useRef<HTMLDivElement>(null);
    const loadUsersRef = useRef<(page: number, append?: boolean) => Promise<void>>(async () => { });
    const scrollGateRef = useRef({ hasMore: true, loadingUsers: false, usersTableCurrentPage: 1 });

    const handleLoadUsers = async (page: number, append = false) => {
        try {
            setLoadingUsers(true)

            const res = await UserService.loadUsers(page, debouncedSearch);

            if (res.status === 200) {
                const usersData = res.data.users.data || res.data.users || []
                const lastPage = res.data.users.last_page || res.data.last_page || usersTableLastPage || 1

                setUsers((prev) => (append ? [...prev, ...usersData] : usersData));
                setUsersTableCurrentPage(page)
                setUsersTableLastPage(lastPage)
                setHasMore(page < lastPage)
            } else {
                setUsers((prev) => (append ? prev : []));
                setHasMore(false);
            }
        } catch (error) {
            console.error('Unexpected server error occurred during loading users: ', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    loadUsersRef.current = handleLoadUsers;
    scrollGateRef.current = { hasMore, loadingUsers, usersTableCurrentPage };

    const handleUserFullNameFormat = (user: UserColumns) => {
        let fullName = '';

        if (user.middle_name) {
            fullName = `${user.last_name}, ${user.first_name}, ${user.middle_name.charAt(0)}.`;
        } else {
            fullName = `${user.last_name}, ${user.first_name}`;
        }

        if (user.suffix_name) {
            fullName += ` ${user.suffix_name}`;
        }

        return fullName;
    };

    useEffect(() => {
        const el = tableRef.current;
        if (!el) return;

        const onScroll = () => {
            const container = tableRef.current;
            const { hasMore: more, loadingUsers: busy, usersTableCurrentPage: page } = scrollGateRef.current;
            if (
                container &&
                container.scrollTop + container.clientHeight >= container.scrollHeight - 10 &&
                more &&
                !busy
            ) {
                void loadUsersRef.current(page + 1, true);
            }
        };


        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 800)

        return () => clearTimeout(timer)
    }, [search]);

    useEffect(() => {
        setUsers([])
        setUsersTableCurrentPage(1)
        setHasMore(true)
        // When searching, always restart at page 1 so pagination doesn't land on an empty page.
        const nextPage = debouncedSearch ? 1 : usersTableCurrentPage;
        handleLoadUsers(nextPage, false);
    }, [refreshKey, debouncedSearch]);

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100">
                    <div className="p-4 flex justify-between">
                        <div className="w-64">
                            <FloatingLabelInput label="Search" type="text" name="search" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition cursor-pointer"
                            onClick={onAddUser}
                        >
                            Add User
                            <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    ref={tableRef}
                    className="max-w-full max-h-[calc(100vh-8.5rem)] overflow-auto"
                >
                    <Table className="border-collapse">
                        <TableHeader className=" border-b border-gray-200 bg-blue-600 sticky top-0 text-xs text-white z-10">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="rounded-tl-lg px-5 py-3 text-center  "
                                >
                                    No.
                                </TableCell>

                                <TableCell
                                    isHeader
                                    colSpan={2}
                                    className="px-5 py-3 text-center  "
                                >
                                    Full Name
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center  "
                                >
                                    Gender
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center  "
                                >
                                    Birth Date
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center  "
                                >
                                    Age
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="rounded-tr-lg px-5 py-3 text-center  "
                                >
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-sm text-gray-600">
                            {(users.length ?? 0) > 0 ? (
                                users.map((user, index) => (
                                    <TableRow
                                        className={`${index % 2 === 1 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100/80`}
                                        key={index}
                                    >
                                        <TableCell className="px-4 py-3 text-center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="py-3 items-end justify-end">
                                            {user.profile_picture ? (
                                                <img src={user.profile_picture} alt={handleUserFullNameFormat(user)} className="object-cover w-10 h-10rounded-full" />
                                            ) : (
                                                <div className="relative inline-flex items-center justify-center w-10 h-10 text-center text-sm overflow-hidden bg-gray-300 rounded full">
                                                    <span className="font-medium text-gray-600">
                                                        {`${user.last_name.charAt(0)}${user.first_name.charAt(0)}`}
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            {handleUserFullNameFormat(user)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            {user.gender.gender}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            {user.birth_date}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            {user.age}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <div className="flex gap-4 justify-center">
                                                <div
                                                    className="text-green-600 font-medium cursor-pointer hover:underline"
                                                    onClick={() => onEditUser(user)}
                                                >
                                                    Edit
                                                </div>
                                                <div
                                                    className="text-red-600 font-medium cursor-pointer hover:underline"
                                                    onClick={() => onDeleteUser(user)}
                                                >
                                                    Delete
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : !loadingUsers && (users.length ?? 0) <= 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-4 py-3 text-center">
                                        {loadingUsers ? <Spinner size="md" /> : "No Records found."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-4 py-3 text-center">
                                        <Spinner size="md" />
                                    </TableCell>
                                </TableRow>
                            )}
                            {loadingUsers && (users.length ?? 0) > 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-4 py-3 text-center">
                                        <Spinner size="md" />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default UserList;