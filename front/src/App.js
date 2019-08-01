import React from 'react';
import Footer from './containers/Footer';
import Header from './containers/Header';
import Form from './containers/form/Form';
import Bateria from './containers/bateria/Bateria';
import Settings from './containers/settings/Settings'
import './App.css';

//node imports
var fs = window.require('fs-extra');



class App extends React.Component  {
  constructor(props){
    super(props);
    this.state = {
      //TODO: Allow logged sentences to be selected and removed/compare logs
      //TODO: modify paths to look for /log/xxx
      //TODO: set path to url
      appOnDisplay: 'Bateria',
      pathToExe: './home/imdbo/avalingua/bin/avalingua_exe.perl',
      lang: 'es',
      logDir: './textos/ERROS DETECTADOS - Sheet1.tsv',
      sys: '',
      logStandard: '/textos/bateria-standard-log.txt',
      dirOr: './textos/textos-tsv.tsv',
      dirCorp: '/textos/corpus'
    }
  }
  componentDidMount() {
    console.log(document.getElementById("xml-out").classList)
    this.getOS()
    const settings = [this.props.pathToExe, this.props.lang, this.props.logDir, this.props.logStandard, this.props.dirOr]
    const confPath = './settings.conf'
    fs.readFile(confPath, 'utf-8', (err, data)=> {
      if(data !== undefined){
        console.log("reading log")
        console.log(data)
        if(err){
            alert(err);
            return;
        }
        data = data.split(",")
        for(let d =0; d<data.length; d++){
          console.log(data[d])
          if(d === 0){
          this.setState({
            pathToExe: [data[d]]
          })
        }else if(d === 1){
          this.setState({
            lang  : data[d]
          })
        }else if(d === 2){
          this.setState({
            logDir: data[d]
          })
        }else if(d === 3){
          this.setState({
            logStandard: data[d]
          })
        }else if(d === 4){
          this.setState({
            dirOr: data[d]
          })
        }else if(d === 5){
          this.setState({
            dirCorp: data[d]
          })
        }
        }
      }
    })
  }
  
  hChange = (e) => {
    this.setState({
      [e.target.id]: [e.target.value]
    });
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
        opacity: "1"
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
                          dirOr={this.state.dirOr}
                          lang={this.state.lang} 
                          sys = {this.state.sys}
                          dirCorp = {this.state.dirCorp}
                          pathToExe={this.state.pathToExe} 
                          editorDeRegras={this.editorDeRegras}/>;
      break;
      case 'Settings':
        appOn = <Settings logDir={this.state.logDir} 
        logStandard={this.state.logStandard}
                          setPath={this.setPath}
                          sys = {this.state.sys} 
                          dirOr={this.state.dirOr}
                          hChange={this.hChange}
                          lang={this.state.lang}
                          dirCorp = {this.state.dirCorp} 
                          pathToExe={this.state.pathToExe} 
                          editorDeRegras={this.editorDeRegras}/>;
      break;
    default:
      appOn = <Settings logDir={this.state.logDir} 
                        logStandard={this.state.logStandard}
                        setPath={this.setPath} 
                        sys = {this.state.sys}
                        hChange={this.hChange}
                        dirOr={this.state.dirOr}
                        dirCorp = {this.state.dirCorp}
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
