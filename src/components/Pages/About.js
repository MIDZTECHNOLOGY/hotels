import React, {Component} from "react";
import Header from "../Common/Header";
import image from '../Pages/assets/img/header-bg.jpg';

// Re-Usable Components
import Team from "../Common/Team";
import Timeline from "../Common/Timeline";


class About extends Component {

    render(){
        return(
            <div>
                <Header 
                    title="About Us"
                    subtitle="It's really a great story!"
                    showButton={false}
                    image={image}
                />
                <Timeline />
                <Team />
            </div>
        )
    }
}

export default About;