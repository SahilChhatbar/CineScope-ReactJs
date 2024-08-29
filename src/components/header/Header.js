import react from "react"
import "./Header.css"
import { Link } from "react-router-dom"

const Header = () => {
    return (
        <div className="header">
            <div className="headerLeft">
                <Link to="/"><img className="header__icon" src="https://i.postimg.cc/P5V96bPf/Cine-Scope.png" alt="CineScope Logo" /></Link>
                <Link to="/movies/popular" style={{textDecoration:"none"}}><span className="headd">Popular</span></Link>
                <Link to="/movies/top_rated" style={{textDecoration:"none"}}><span className="headd">Top Rated</span></Link>
                <Link to="/movies/upcoming" style={{textDecoration:"none"}}><span className="headd">Upcoming</span></Link>
            </div>
        </div>
    )
}

export default Header