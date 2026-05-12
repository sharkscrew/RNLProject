import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import AddUserFormModal from "./components/AddUserFormModal";
import DeleteUserFormModal from "./components/DeleteUserFormModal";
import EditUserFormModal from "./components/EditUserFormModal";
import UserList from "./components/UserList";

const UserMainPage = () => {
    const { isOpen: isAddUserFormModalOpen, openModal: openAddUserFormModal, closeModal: closeAddUserFormModal } = useModal(false);
    const {message: toastMessage, isVisible: toastMessageIsVisible, showToastMessage, closeToastMessage} = useToastMessage('', false);

    const {isOpen: isEditUserFormModalOpen, selectedUser: selectedUserForEdit, openModal: openEditUserFormModal, closeModal: closeEditUserFormModal} = useModal(false);
    const {isOpen: isDeleteUserForModalOpen, selectedUser: selectedUserForDelete, openModal: openDeleteUserForModal     , closeModal: closeDeleteUserForModal} = useModal(false)

    const {refresh, handleRefresh} = useRefresh(false);

    return (
        <>
        <ToastMessage message={toastMessage} isVisible={toastMessageIsVisible} onClose={closeToastMessage} />
            <AddUserFormModal onUserAdded={showToastMessage} refreshKey={handleRefresh} isOpen={isAddUserFormModalOpen} onClose={closeAddUserFormModal} />
            <EditUserFormModal user={selectedUserForEdit} onUserUpdated={showToastMessage} refreshKey={handleRefresh} isOpen={isEditUserFormModalOpen} onClose={closeEditUserFormModal}/>
            <DeleteUserFormModal user ={selectedUserForDelete} onUserDeleted={showToastMessage} refreshKey={handleRefresh} isOpen={isDeleteUserForModalOpen} onClose={closeDeleteUserForModal}/>
            <UserList onAddUser={openAddUserFormModal} onEditUser={(user) => openEditUserFormModal(user)} onDeleteUser={(user) => openDeleteUserForModal(user)} refreshKey={refresh} />
        </>
    )
}

export default UserMainPage;