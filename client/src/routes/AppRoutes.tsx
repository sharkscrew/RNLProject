import { Route, Routes } from "react-router-dom"
import AppLayout from "../layout/AppLayout"
import GenderMainPage from "../pages/gender/GenderMainPage"
import EditGenderPage from "../pages/gender/EditGenderPage"
import DeleteGenderPage from "../pages/gender/DeleteGenderPage"
import UserMainPage from "../pages/User/UserMainPage"
import LoginPage from "../pages/Auth/LoginPage"
import { AuthProvider } from "../contexts/AuthContext"
import ProtectedRoute from "./ProtectedRoute"
const AppRoutes = () => {
    return (
        <>
            <AuthProvider>
                
            <Routes>
                <Route path='/' element={<LoginPage />}/>
                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                    <Route path="/genders" element={<GenderMainPage />} />
                    <Route path="/gender/edit/:gender_id" element={<EditGenderPage />} />
                    <Route path="/gender/delete/:gender_id" element={<DeleteGenderPage />} />
                    <Route path="/users" element={<UserMainPage />} />
                </Route>
            </Routes>
            </AuthProvider>
        </>
    )
}
export default AppRoutes