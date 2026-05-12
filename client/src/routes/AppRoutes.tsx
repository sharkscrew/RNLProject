import { Route, Routes } from "react-router-dom"
import AppLayout from "../layout/AppLayout"
import GenderMainPage from "../pages/gender/GenderMainPage"
import EditGenderPage from "../pages/gender/EditGenderPage"
import DeleteGenderPage from "../pages/gender/DeleteGenderPage"
import UserMainPage from "../pages/User/UserMainPage"
import LoginPage from "../pages/Auth/LoginPage"
const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<LoginPage />}/>
                <Route element={<AppLayout />}>
                    <Route path="/genders" element={<GenderMainPage />} />
                    <Route path="/gender/edit/:gender_id" element={<EditGenderPage />} />
                    <Route path="/gender/delete/:gender_id" element={<DeleteGenderPage />} />
                    <Route path="/users" element={<UserMainPage />} />
                </Route>
            </Routes>
        </>
    )
}
export default AppRoutes