import Navbar from "../../components/navbar";
import { checkLogin } from "../../cookies";

  export default function Account() {
    if (checkLogin() == true) {
        return (
            <>
            <Navbar/>
            </>
        );
      } else { 
        window.location.href = "/router"
      }
    
}