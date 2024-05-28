/* eslint-disable react/prop-types */
import logoImage from "../../assets/logo.png"

export const Logo = ({mobileOpen}) => {
  return (
    <div className={`${mobileOpen ?'absolute z-30 h-[50%] right-[-100%] w-[100%] top-0':'logo flex items justify-center'}`}>
        <img
        src={logoImage}
        alt="logo-image"
        className="w-32 xl:w-[95%] h-full flex object-cover"
        />
    </div>
  )
}
