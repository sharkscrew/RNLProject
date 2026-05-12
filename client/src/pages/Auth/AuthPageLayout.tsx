import { type FC, type ReactNode } from "react";
import companyLogo from "../../assets/img/companyLogo.jpg";

interface AuthPageLayoutProps {
    children: ReactNode;
}

const AuthPageLayout: FC<AuthPageLayoutProps> = ({ children }) => {
  return (
    <>
    <div className="min-h-screen flex flex-row">
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col items-center mb-6">
                    <img className="h-16 mb-2" src={companyLogo} alt='Company Logo'/>
                    <h2 className='text-2xl font-bold text-gray-800'>
                        Sign in to your account
                    </h2>
                </div>
                {children}
            </div>
        </div>
        <div className="hidden lg:flex w-1/2 h-screen items-center justofy-center bg-white">
            <img className="object-contain w-full h-full" 
            src={companyLogo} 
            alt="Company Logo"/>       
        </div>
    </div>
    </>
  )
}

export default AuthPageLayout