import { Link } from "react-router-dom";
import '../css/pages/AboutPage.css';
import config from '../config.json'

const AboutPage = () => {
  return (
    <div className="aboutInformation">
      <h1 className='aboutInformationTitle'>
        About this application
      </h1>
      
      <p>
        This is a hobby project by Mark Meltzer.
      </p>

      <p>
        Version: {config.VERSION}
        <br />
        Source code: <a href="https://github.com/MarkMeltzer/household-dashboard">Github</a>
      </p>
    </div>  
  );
}

export default AboutPage;