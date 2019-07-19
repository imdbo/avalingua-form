import React from 'react';
import Footer from './containers/Footer';
import Header from './containers/Header';
import Form from './containers/form/Form';
import Bateria from './containers/bateria/Bateria';
import Settings from './containers/settings/Settings'
import './App.css';



class App extends React.Component  {
  constructor(props){
    super(props);
    this.state = {
      //TODO: create log with settings
      //TODO: Allow logged sentences to be selected and removed/compare logs
      //TODO: modify paths to look for /log/xxx
      //TODO: set path to url
      appOnDisplay: 'Bateria',
      pathToExe: '/home/imdbo/git/avalingua/bin/avalingua_exe.perl',
      lang: 'es',
      logDir: '/home/imdbo/git/avalingua-form/ERROS DETECTADOS - Sheet1.tsv',
      sys: '',
      logStandard: '/home/imdbo/git/avalingua-form/front/bateria-standard-log.txt'
    }
  }
  componentDidMount() {
    this.getOS()
  }
  
  setPath = (e, p) => {
    this.setState({
      [e]: p
    });
  }
  selector = e => {
    this.setState({
      appOnDisplay: e
    });
  }
  getOS = () => {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
    this.setState({
      sys: os
    });
  }

  editorDeRegras = (state) => {
    if(state.length !== 0){
      return{
        transform: "translate3d(0, -70%, 0)",
        color: "#036",
        opacity: "0.8"
      }
      }else{
        return{
          position: "absolute",
          transition: "all 200ms",
          opacity: "0.5"
        }
      }
    }
  
  render() {
  let appOn;
  switch (this.state.appOnDisplay) {
    case 'Formulario':
      appOn = <Form editorDeRegras={this.editorDeRegras}/>;
      break;
      case 'Bateria':
        appOn = <Bateria logDir={this.state.logDir}
                          logStandard={this.state.logStandard}
                          asFor={this.asFor}
                          lang={this.state.lang} 
                          sys = {this.state.sys}
                          pathToExe={this.state.pathToExe} 
                          editorDeRegras={this.editorDeRegras}/>;
      break;
      case 'Settings':
        appOn = <Settings logDir={this.state.logDir} 
        logStandard={this.state.logStandard}
                          setPath={this.setPath}
                          sys = {this.state.sys} 
                          lang={this.state.lang} 
                          pathToExe={this.state.pathToExe} 
                          editorDeRegras={this.editorDeRegras}/>;
      break;
    default:
      appOn = <Settings logDir={this.state.logDir} 
      logStandard={this.state.logStandard}
                        setPath={this.setPath} 
                        sys = {this.state.sys}
                        lang={this.state.lang} 
                        pathToExe={this.state.pathToExe} 
                        editorDeRegras={this.editorDeRegras}/>;
  }
  return (
    <div className="app">
      <Header selector={this.selector}></Header>
      {appOn}
    </div>
  );
  }
}

export default App;
