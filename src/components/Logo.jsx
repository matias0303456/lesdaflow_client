import logoImage from "../assets/logo.png"
export const Logo = () => {
  return (
    <div className="logo flex items justify-center">
        <img
        src={logoImage}
        alt="logo-image"
        className="w-28 h-14 flex "
        />
    </div>
  )
}
