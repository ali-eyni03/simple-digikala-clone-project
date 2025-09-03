import Navbar from "../../components/Navbar.jsx";
import { Outlet } from "react-router-dom";
import ProfileMenu from "./ProfileMenu.jsx";

const ProfileLayout = () => {
		return (
			<div className="mb-8 h-screen flex flex-col">
				<Navbar />
				<div className="container flex w-[80%] m-auto">
					<div className="menuContainer w-[40%] ">
						<ProfileMenu />
					</div>
					<div className="contentContainer w-full">
						<Outlet />
					</div>
				</div>
			</div>
		);
	
};
export default ProfileLayout;
