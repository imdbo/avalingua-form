import React, { Component } from 'react';

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


function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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
      annotations: [],
      visibleLog: [],
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
        const logs = new dom().parseFromString(data);
        if(err){
            alert(err);
            return;
        }
        console.log(logs);
        let frases = logs.getElementsByTagName("text")[0].childNodes[0].textContent;
        console.log(frases);
        if(frases instanceof Array){
          for(let f in frases){
            this.setState({
              visibleLog: [...this.state.visibleLog, f]
            })
          }
        }else{
          this.setState({
            visibleLog: [...this.state.visibleLog, frases]
          })
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
  initParsing = (txt, opt) => {
    let result;
    let xml;
    let command;
    let log;
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
          visibleLog: [...this.state.visibleLog, txt]
        }))
        console.log('no array')
        command = 'echo "'+ txt + '" ' + '|' +  this.props.pathToExe+ ' ' + this.props.lang
      }
      child.exec(command, (err, stdout, stderr) => (
        console.log("\n----------------------------------------"),
        xml = new dom().parseFromString(stdout),
        this.setState({
          xmlout: stdout,
          jsout: convert.xml2json(stdout, {compact: true, spaces: 4})
        }),
        console.log(this.state.jsout),
        opt === "bateria" ? (
          this.bateriaVergleich() )
          : 
          (log = this.state.xmlout+"\n"+"analisado às "+moment().format('h:mm:ss a, MMMM Do YYYY'),
          //TODO: xpath erros, numero de nomes, adj, etc
          fs.appendFile('./log/log'+date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'.txt', log, function(err){
            if (err){
              console.log(err)
            }
          })
          )
        )
      );
    }
  }
  bateriaVergleich = () => {
    const lastLog = './log/bateria-log'+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+".txt";
    /*const logs = [this.props.logStandard, lastLog];
    let line;
    const cb = (err) => {
        if (err){
          console.log(err)
     }
    }
    const log = this.state.xmlout
    fs.writeFileSync(lastLog, log, 'utf-8')
    let td = new TextDecoder()
    logs.map((v, k)=>{
      const liner = new lineByLine(v);
      let lines = [];
      while (line = liner.next()){
        lines.push(td.decode(line))
      }
      this.setState({
        ["log"+k]: lines
      })
    })
    const log0 = this.state.log0
    const log1 = this.state.log1
    log0 == log1 ? console.log("good") : console.log("wtf")
    for(let i = 0; i < this.state.log0.length; i++){
      let str0 = JSON.stringify(this.state.log0[i]);
      let str1 = JSON.stringify(this.state.log1[i]);
      if (str0==str1){
        return(
        console.log(this.state.log1[i]),
        console.log(this.state.log0[i])
        )
      }
    }*/
    
    const currLog = this.state.xmlout;
    const standardLog = fs.readFileSync(this.props.logStandard, 'utf-8')
    fs.writeFileSync(lastLog, this.state.xmlout, 'utf-8')
    //it works
    standardLog === currLog ? console.log("same") : console.log("idk")
    //settings gitDiff
    var options = {
      color: true,      // Add color to the git diff returned?
      flags: null,       // A space separated string of git diff flags from https://git-scm.com/docs/git-diff#_options
      forceFake: false,  // Do not try and get a real git diff, just get me a fake? Faster but may not be 100% accurate
      noHeaders: false,  // Remove the ugly @@ -1,3 +1,3 @@ header?
      save: false,       // Remember the options for next time?
      wordDiff: false    // Get a word diff instead of a line diff?
    }
    let diff = gitDiff(currLog, standardLog, options);
    console.log(diff)
    if(diff === undefined){
      diff = "bateria analisada com sucesso"
    }
    this.setState({
      displayOutput: diff
    })
  }
  runBateria = () => {
    let bateria;
    let bFrases = [];
    const opt = "bateria";

    fs.readFile(this.props.logDir, 'utf-8', (err, data)=> {
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
      this.initParsing(bFrases, opt);
      
    /*(async () => {
        await delay();
      })();
    function delay() {
      return new Promise((res, rej) => {
        setTimeout(res, 1000);
      });
    }*/
      
     /* bateria.forEach(async function(el){
        el = el.split("\t")
        console.log(el[1])
        await initParsing(el[1])
      }) */
  })
  //compare both files
}
  render() {
    const annots = xpath.select("//annotation",this.state.xmlout)
    return (
        <div className="bateria-wrapper">
            <div className="bateria-container-txt">
              <textarea type="text" id="formB" style={{height: "80%"}} onChange={this.handleChange} value={this.state.input} className="aval-formin"/>
              <button className="formin-wide" onClick={(e) => this.initParsing(this.state.formB)}>analisar texto</button>
              </div>
              <div className="bateria-output">
              {this.state.displayOutput/*annots.map((an, i) =>{
                const clss  = xpath.select("class/text()", an)
                const expl  = xpath.select("explanation/text()", an)
                const label  = xpath.select("label/text()", an)
                const labelC = xpath.select("label_code/text()", an)
                const sug  = xpath.select("suggestion/text()", an)
                const type  = xpath.select("type/text()", an)
                const word = xpath.select("word/text()", an)
                return(
                  console.log(annots.length),
                  <div key={annots[i]+"key"+i}>
                    <div key={clss+"key"+i} className="an-expl">{clss.toString()}</div>
                    <div key={expl+"key"+i} className="an-expl">{expl.toString()}</div>
                    <div key={label+"key"+i} className="an-expl">{label.toString()}</div>
                    <div key={labelC+"keyC"+i} className="an-expl">{labelC.toString()}</div>
                    <div key={sug+"key"+i} className="an-expl">{sug.toString()}</div>
                    <div key={type+"key"+i} className="an-expl">{type.toString()}</div>
                    <div key={word+"key"+i} className="an-expl">{word.toString()}</div>
                  </div>
                  )
              })*/}
              </div>
            <div className="bateria-history">
              <div className="history-menu">
                <div className="header">
                  <h3>historial</h3>
                </div>
                <div className="history-panel">
                  <div className="log-opts">
                    <button className="formin-wide">analisar marcada</button>
                    <button className="formin-wide" onClick={() => this.runBateria()}>Executar batería </button>
                    <button className="formin-wide">eliminar marcada</button>
                    <button className="formin-wide">eliminar todas </button>
                    <button className="formin-wide">mostrar sem erros</button>
                    <button className="formin-wide">mostrar com erros</button>
                    <button className="formin-wide">Comparar logs</button>
                  </div>
                </div>
                <div className="log-queries">
                <label htmlFor="querier"
                    className="floating-labelb"style={this.props.editorDeRegras(this.state.itemQuery)}>Pesquisar</label>
                <input className="aval-formin" id="itemQuery"
                      type="text"
                      name="itemQuery"
                      value={this.state.itemQuery}
                      onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="historial-log">
                {this.state.visibleLog.map((f, i)=>{
                  console.log(this.state.visibleLog)
                  return(
                    <div key={"frase-"+f+"-"+i}className="queried-input">
                      <button onClick={(e) =>this.initParsing(f)}className="formin-wide">{f}</button>
                    </div>
                  )
                })}
              </div>
            </div>
        </div>
    )
  }
}