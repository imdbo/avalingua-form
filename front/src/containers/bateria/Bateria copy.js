import React, { Component } from 'react';
import Output from  './Output';

var Diff = require('diff');
const child = window.require('child_process')
var convert = require('xml-js');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var fs = window.require('fs-extra');
var date = new Date();
var moment = window.require('moment');
var lineByLine = window.require('n-readlines');
var gitDiff = require('git-diff')


export default class Bateria extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      itemQuery: '',
      pathToExe: '/home/daniel/git/avalingua/bin/avalingua_exe.perl',
      formB: '',
      lang: 'es',
      output: '',
      errout: '',
      parsed: '',
      xmlout: '',
      jsout: {},
      annotations: [],
      visibleLog: [],
      baterias: 'off',
    }
  }
  //bateria de textos. Comparar log duma versao coa nova.
  componentDidMount () {
    if(!fs.existsSync('./log')){
      fs.mkdirSync('./log')
    }
    const lastLog = './log/log'+date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'.txt'
    try{
      fs.readFile(lastLog, 'utf-8', (err, data)=> {
        if(data !== undefined){
          console.log("reading log")
          const logs = new dom().parseFromString(data);
          if(err){
              alert(err);
              return;
          }
          console.log(logs);
          let frases = logs.getElementsByTagName("text");
            console.log(frases);
            if(frases[1] !==  undefined){
              for(let i=0; i< frases.length; i++){
                console.log(frases[i])
                this.setState({
                  visibleLog: [...this.state.visibleLog, frases[i].childNodes[0].textContent]
                })
              }
            }else{
              this.setState({
                visibleLog: [...this.state.visibleLog, frases[0].childNodes[0].textContent]
              })
            }
          }
        })   
      }catch(error){
        console.error(error)
      }
  }
  componentWillUnmount() {
    console.log(this.state.output)
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  waitFor = (ms) => new Promise(r => setTimeout(r, ms));
  initParsing = (txt, opt, texts) => {
    let result;
    let xml;
    let command;
    let log;
    console.log(txt)
    if(this.props.sys === "windows") {
      console.warn("windows not supported")
    }else if(this.props.sys === "Linux"){
      if(txt instanceof Array){
        if(opt !== "bateria"){
          txt.map((f) => {
            return(
              this.setState(previousState =>({
                visibleLog: [...this.state.visibleLog, f]
              }))
            )
          })
        }
        console.log('array')
        command = 'echo "'+ txt.join("\n") + '" ' + '|' +  this.props.pathToExe+ ' ' + this.props.lang
        console.log(command)
      }else{
        this.setState(previousState =>({
          visibleLog: [...this.state.visibleLog, txt],
          baterias: 'off'
        }))
        console.log('no array')
        command = 'echo "'+ txt + '" ' + '|' +  this.props.pathToExe+ ' ' + this.props.lang
      }
      child.exec(command, {maxBuffer: 16384  * 16384}, (err, stdout, stderr) => (
        err === null ?(
        console.log("\n----------------------------------------"),
        xml = new dom().parseFromString(stdout),
        console.log(stdout),
        this.setState({
          stdout: stdout,
          xmlout: xml,
          jsout: convert.xml2json(xml, {compact: true, spaces: 4})
        }),
        console.log(this.state.xmlout),
        opt === "bateria" ? (
          this.bateriaVergleich(xml, stdout, texts) )
          : 
          (log = this.state.xmlout+"\n"+"analisado às "+moment().format('h:mm:ss a, MMMM Do YYYY'),
          //TODO: xpath erros, numero de nomes, adj, etc
          fs.appendFile('./log/log'+date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'.txt', log, function(err){
            if (err){
              console.log(err)
            }
          })
          )
        ): alert('erro no texto: '+err))
      );
    }
  }
  bateriaVergleich = (xml, stdout, texts) => {
    const currLog = stdout;
    let standardLog;
    let currLog = 'hola';
     if(texts !== undefined) {
      currLog ='./log/texts-log'+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+".txt",
       standardLog = fs.readFileSync(this.props.dirOr, 'utf-8'),
       fs.appendFile(lastlog, xml, function(err){
        if(err){
          alert(err)
        }
      });
    }else{
      currLog='./log/bateria-log'+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+".txt";
      standardLog = fs.readFileSync(this.props.logStandard, 'utf-8');
      fs.writeFileSync(lastLog, xml, 'utf-8');
    }


    //it works
    standardLog === xml ? console.log("same") : console.log("idk")
    //settings gitDiff
    var options = {
      color: true,      // Add color to the git diff returned?
      flags: null,       // A space separated string of git diff flags from https://git-scm.com/docs/git-diff#_options
      forceFake: false,  // Do not try and get a real git diff, just get me a fake? Faster but may not be 100% accurate
      noHeaders: false,  // Remove the ugly @@ -1,3 +1,3 @@ header?
      save: false,       // Remember the options for next time?
      wordDiff: true    // Get a word diff instead of a line diff?
    }
    let diff = gitDiff(stdout, standardLog, options);
    if(diff === undefined){
      this.setState({
        baterias: 'bateria analisada com sucesso'
      })
    }else{
      this.setState({
        displayOutput: [diff],
        baterias: 'erros'
      })
      console.log('diffs: ' +diff)
    }
  }
  baterALter = () => {
    this.setState({
      baterias: 'false'
    })
  }
  runBateria = (dir, txt) => {
    let bateria;
    let bFrases = [];
    const opt = "bateria";

    fs.readFile(dir, 'utf-8', (err, data)=> {
      bateria = data;
      if(err){
          alert(err);
          return;
      }
      bateria = bateria.split("\n");
      console.log(bateria)
      //remove headings
      //create array of texts to parse
      bateria.map((l) => {
        l = l.split("\t")
        if (l[1] !== undefined){
          console.log(l[1])
          bFrases.push(l[1])
        }
      });
      bFrases.shift()

      if(txt === 'textos'){
        const texts = "texts";
        let tFrases = [];
        for(let t of bFrases){
          t = t.split("\n")
          if (t !== undefined){
          console.log(t)
          this.initParsing(t, opt, texts)
          }  
        };
      }else{
        this.initParsing(bFrases, opt);
      }

  })
}
  render() {
    const annots = xpath.select("//annotation",this.state.xmlout)
    return (
        <div className="bateria-wrapper">
            <div className="bateria-container-txt">
              <textarea type="text" id="formB" style={{height: "80%"}} onChange={this.handleChange} value={this.state.input} className="aval-formin"/>
              <div className="txt-buttons">
                <button className="formin-wide" onClick={() => this.runBateria(this.props.dirOr, "textos")}>batería de textos</button>
                <button className="formin-wide" onClick={(e) => this.initParsing(this.state.formB)}>analisar texto</button>
                <button className="formin-wide">analisar marcada</button>
                <button className="formin-wide" onClick={() => this.runBateria(this.props.logDir)}>analisar batería orações </button>
               {/* <button className="formin-wide" disabled>eliminar marcada</button>
                <button className="formin-wide" disabled>eliminar todas </button>
                <button className="formin-wide" disabled>Comparar logs</button> */}
              </div>
            </div>
              <div className="bateria-output">
                {<Output baterAlter={this.baterALter} displayOutput={this.state.displayOutput} baterias ={this.state.baterias} editorDeRegras={this.props.editorDeRegras} data={this.state.xmlout}/> }
                
              </div>
            <div className="bateria-history">
                <div className="log-queries">
                <label htmlFor="itemQuery"
                    className="floating-labelb"style={this.props.editorDeRegras(this.state.itemQuery)}>Pesquisar</label>
                <input style={{height: "100%"}} className="aval-formin" id="itemQuery"
                      type="text"
                      name="itemQuery"
                      value={this.state.itemQuery}
                      onChange={this.handleChange}
                  />
                </div>
                <div className="historial-log">
                  {this.state.visibleLog.map((f, i)=>{
                    if(f !== undefined){
                    return(
                      <div key={"frase-"+f+"-"+i}className="queried-input">
                        <button onClick={(e) =>this.initParsing(f)} className="formin-wide">{f}</button>
                      </div>
                    )
                    }
                  })}
                </div>
            </div>
        </div>
    )
  }
}