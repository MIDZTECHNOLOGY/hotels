import React, {Component} from "react";
import './Pages/assets/css/admin.css'

class LoginWrapper extends Component {
    render(){
        return(
            <div id="admin-page"> 

                {this.props.children}
            </div>
        )
    }
}

export default LoginWrapper;