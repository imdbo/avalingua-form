    import React, { Component } from 'react';
//TODOs:
    //TODO: if finalizar tag undefined && taginput not empty -> append it
  export default class Header extends Component {
    constructor(props) {
      super(props);
      this.state = { 
          userInput: [],
          tags: ["lemma:=token", "ADJ", "NOUN", "PRP", "ADV", "CARD", "CONJ", "DET", "PRO", "VERB", "I", "DATE", "POS", "PCLE", "EX", "Fc", 
          "Fg", "Fz", "Fe", "Fd", "Fx", "Fpa", "Fpt", "SENT", "NOMINAL", "NPCOORD", "NOUNCOORD", "X", "NOTVERB", "PUNCT"],
          tagInfo: ["∅", "lemma", "token", "type", "gender", "number", "mode", "tense", "person"],
          tagMod: ["[ ]", "?", "*", "&", "|"],
          innerTagMods: ["&inner", "|inner"],
          Extras: ["Inherit","Recursivity", "Add"],
          ExtraMod: [],
          noNext: ["NEXT", "NoUniq"],
          noNextMod: '',
          modifiers: [],
          modifiersInner: [],
          AVAL: '',
          setTag: [],
          //todo: add specific tagMods to allow input inside tagInfos
          userTag: [],
          tagPop: false,
          userNewInput: [],
          xtrasText: '',
          x: '',
          textPop: '',
          seePopText: false,
          userTagInput: [],
          cwText: '',
          CorrWarn: ''
        }
    }
    componentWillUpdate() {
      if(this.state.setTag[this.state.setTag.length-1] === "∅:"){
        if(this.state.modifiersInner.length !== 0) {
          this.setState({
            modifiersInner: []
          });
        }
      } 
    }
    handleX = (e) => {
      this.setState({
        xtrasText: e.target.value
      });
    }
    handleCw = (e) => {
      this.setState({
        cwText: e.target.value
      });
    }
    handleChange = (e) => {
      let inputArr = [e.target.value];
      this.setState({
        userInput: inputArr
      });
      console.log(this.state.userInput);
    }
    handleTitle = (e) => {
      this.setState({
        AVAL: [e.target.value]
      });
    }
    handleTextPop = (e) => {
      this.setState({
        textPop: [e.target.value]
      });
    }
    handleTags = (e) => {
      let addNew = e;
      this.setState({
        userNewInput: addNew
      });
      console.log(this.state.userNewInput)
      this.setState({
        tagPop: !this.state.tagPop
      });
      console.log(this.state.userInput);
    }
    handleTagInfos = (e) => {
      this.setState({
        seePopText : true
      });
      this.setState({
        setTag: [...this.state.setTag, e+":"],
        textPop: '',
      });
      console.log("current set tags: "+this.state.setTag)
    }
    gerarTag = () => {
      console.log("inners: "+this.state.modifiersInner,
                  "setTagx: " +this.state.setTag)
      const vazio = "vazio"
      if(this.state.modifiersInner.includes("&")){
          if(this.state.setTag.length <2){
          this.setState({
            setTag: [...this.state.setTag, vazio]
          });
        }
        console.log("setTags:"+ this.state.setTag)
        this.handleMultipleTagging(this.state.setTag);
      }else if (this.state.modifiersInner.includes("|")){
        if(this.state.setTag.length <2){ 
          this.setState({
            setTag: [...this.state.setTag, vazio]
          });
        }
        console.log("Outter setTags:"+ this.state.setTag);
        this.handleMultipleTagging(this.state.setTag);
      }else{
        console.log("singletagging")
        console.log("tagging "+this.state.setTag[0])
        if(this.state.setTag.includes("∅:")){
          let userInputInProcess = this.state.userInput+" "+this.state.userNewInput;
          let modList = this.state.modifiers;
          if(modList.includes("[ ]")){
            modList.splice(modList.indexOf("[ ]"), 1);
            userInputInProcess = this.state.userInput+" "+ "["+this.state.userNewInput+"]";
          }
          this.state.modifiers.map((mod) => {
            userInputInProcess = userInputInProcess+mod
            modList.splice(modList.indexOf(mod), 1);
          });
          this.setState({
            userInput: userInputInProcess,
            modifiers: []
          });
        }else {
          this.handleSingleTagging(this.state.setTag[0])
        }
      }
      this.fecharTags()
      this.setState({
        setTag: [],
        userTagInput: [],
      });
      console.log("postlog: "+this.state.setTag)
    }
    handleMultipleTagging = (tagArr) => {
      if(this.state.userTagInput.includes("∅")){
        this.fecharTags()
      }else{
      let userInputInProcess;
      let modList = this.state.modifiers;
      const innerModList = this.state.modifiersInner.join("");
      console.log(innerModList);
      let userTagInput = this.state.userTagInput;
      let jointTags = [];
      console.log(tagArr);
      for(let tag of tagArr){
        console.log("logging tag: "+tag)
        jointTags.push(tag+userTagInput[0]+innerModList)
        userTagInput.splice(userTagInput.indexOf(userTagInput[0]), 1)
        console.log(jointTags)
      }jointTags = jointTags.join("")
      console.log(jointTags[jointTags.length -1])
      if(jointTags[jointTags.length -1] === "&" | jointTags[jointTags.length -1] === "|"){
        console.log("jointTags[jointTags.length -1]")
        jointTags = jointTags.substring(0, jointTags.length - 1);
      }
      if(modList.includes("[ ]")){
        modList.splice(modList.indexOf("[ ]"), 1);
        userInputInProcess = this.state.userInput+" "+"["+this.state.userNewInput + 
        "<"+jointTags+">"+"]"
        this.state.modifiers.map((mod) => {
          userInputInProcess = userInputInProcess+mod
          modList.splice(modList.indexOf(mod), 1);
        });
      }else{
          userInputInProcess = this.state.userInput +" "+ this.state.userNewInput + "<"+jointTags+">"
          this.state.modifiers.map((mod) => {
            userInputInProcess = userInputInProcess+mod
            modList.splice(modList.indexOf(mod), 1);
          });
        }
        this.setState({
          userInput: userInputInProcess,
          modifiers: [],
          modifiersInner: []
        });
      }
    }
    handleSingleTagging = (e1) => {
      if(this.state.userTagInput.includes("∅")){
        this.fecharTags()
      }else{
        let modList = this.state.modifiers;
        let innerModList = this.state.modifiersInner;
        let userInputInProcess;
        let iModList = '';
        innerModList.map((iMod)=> { 
            iModList = iModList+iMod;
            innerModList.splice(innerModList.indexOf(iMod), 1);
        });
        console.log("hola"+iModList);
        if(modList.includes("[ ]")){
          modList.splice(modList.indexOf("[ ]"), 1);
          userInputInProcess = this.state.userInput+" "+"["+this.state.userNewInput + 
          "<"+e1 + this.state.userTagInput[0] +iModList+">"+"]"
          this.state.modifiers.map((mod) => {
            userInputInProcess = userInputInProcess+mod
            modList.splice(modList.indexOf(mod), 1);
          });
        }else{
          userInputInProcess = this.state.userInput +" "+ this.state.userNewInput + 
          "<"+e1 +this.state.userTagInput[0]+iModList+">"
          this.state.modifiers.map((mod) => {
            userInputInProcess = userInputInProcess+mod
            modList.splice(modList.indexOf(mod), 1);
          });
        }
      this.setState({
        userInput: userInputInProcess,
        modifiers: [],
        modifiersInner: [],
        userTagInput : []
      });
      }
    }
    fecharTags = () => {
      this.setState({
        tagPop: false
      })
    }
    tagPopStyle = (e) => {
      return {
        display: this.state.tagPop ?  'block' : 'none'
      }
    }
    formOverdark = () => {
      return {
        display: this.state.tagPop ? 'block' : 'none'
      }
    }
  handleMods = (e) => {
    const value = e;
    let modifiers = this.state.modifiers;
    console.log(this.state.modifiers);
    if(this.state.modifiers.includes(value)){
      modifiers.splice(modifiers.indexOf(value), 1);
      this.setState({
        modifiers: modifiers
      });
    }else{
      this.setState({
        modifiers: [...this.state.modifiers, value]
      });
    }
  }
  modsStyle = (id) => {
    if(this.state.modifiers.includes(id)){
      return {
        borderColor: "green",
        borderWidth: "0px 0px 2px 0px",
        color: "green"
      }
    }else{
      return{
        borderColor: "#036",
      }
    }
  }
  handleInnerMods = (e) => {
    const value = e;
    console.log("innerMods state: "+ this.state.modifiersInner);
    if(!(this.state.modifiersInner.includes(value))){
      this.setState({
        modifiersInner: [...this.state.modifiersInner, value]
      });
    }else{
      let modifiers = this.state.modifiersInner;
      modifiers.splice(modifiers.indexOf(value), 1);
      console.log("innerMods: "+modifiers)
      this.setState({
        modifiersInner: modifiers
      });
    }
  }
  innerTagModStyle = (id) => {
    if(this.state.modifiersInner.includes(id)){
      return {
        borderColor: "orange",
        borderWidth: "0px 0px 2px 0px",
        color: "orange"
      }
    }else{
      return{
        borderColor: "#036",
      }
    }
  }
  CorrWarn = (cW) => {
    this.setState({
      CorrWarn: cW
    });
  }
  xtras = (x) => {
    this.setState({
      x: x
    });
    let ExtraMod = this.state.ExtraMod;
    if(!(this.state.ExtraMod.includes(x))){
      this.setState({
        ExtraMod: [...this.state.ExtraMod, x+": "+this.state.xtrasText]
      });
    }else{
      ExtraMod.splice(ExtraMod.indexOf(x), 1);
      this.setState({
        ExtraMod: ExtraMod
      });
      this.avalHolder(x)
    }
  }  
  noX = (x) => {
    this.setState({
      noNextMod: x
    });
  }
  nomeDaRegra = () => {
    if(this.state.AVAL.length !== 0){
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
      
    avalHolder = (avalHolderText) => {
    }
    hidePopText = (text) => {
      this.setState({
        seePopText: false,
      });
      
      this.setState({
        userTagInput: [...this.state.userTagInput, text]
      })
    }
    stylePopText = () => {
      return {
        display: this.state.seePopText? 'flex' :'none'
      }
    }
    vazio = () => {
      return {
        display: this.state.setTag[this.state.setTag.length-1] === "∅:"? 'none' :'flex'
      }
    }
    vazio2 = () => {
      return {
        display: this.state.setTag[this.state.setTag.length-1] === "∅:"? 'none' :'block'
      }
    }
    render() {
      return (
        <div className="form-tab" style={{gridColumn: "1/4"}}>
          <div className="dark-overlay"style={this.formOverdark()}></div>
          <div className="tagmods-popup" style={this.tagPopStyle()}>
           <div className="construtor-labels" >
             <div className="text-popup" style={this.stylePopText()}>
               <div className="vazio-wrap"style={this.vazio()}>
                 <div className="text-square">
                  <label htmlFor="form-nomer" style={this.editorDeRegras(this.state.seePopText)}
                    className="floating-labelo">texto para {this.state.setTag[this.state.setTag.length-1]}</label>
                  <input type="text" id="form-popup" onKeyPress={e => {
                    if (e.key === 'Enter') {
                      this.hidePopText(e.target.value);
                    }
                  }} 
                  onChange={this.handleTextPop} value={this.state.textPop} className="aval-formin-pop"/>
                </div>
                <div className="check-button" onClick={(e)=>this.hidePopText(document.getElementById("form-popup").value)}><i class="fas fa-2x fa-check"></i>
                </div>
              </div>
             </div>
             <span className="ok-button" style={{gridRow: "1"}} onClick={()=>this.fecharTags()}><i className="fas fa-2x fa-window-close"></i></span>
             <div className="costructor-labels-choices" style={{gridRow: "2"}}>
              {this.state.tagMod.map((tag) => {
                      return(
                        <button id={tag} value={tag} key={tag} style={this.modsStyle(tag)} className="formin-check" onClick={() => this.handleMods(tag)}>{tag}</button>
                      )
              })}
              </div>
              <div className="costructor-labels-choices-3" style={this.vazio2()}>
                {this.state.innerTagMods.map((tag) => {
                  let tagex;
                    for(let i = 0; i < tag.length; i++){
                    if(this.state.tagMod.includes(tag.charAt(i))){
                        tagex = tag.charAt(i);
                    }
                  }
                        return(
                          <button id={tag+"inner"} value={tag} key={tag+"inner"} 
                            style={this.innerTagModStyle(tagex)} className="formin-check" 
                            onClick={() => this.handleInnerMods(tagex)}>{tagex}
                          </button>
                        )
                })}
              </div>
              <div className="gerador" style={{gridRow: "6"}} onClick={() => this.gerarTag()}>Finalizar</div>
              <div className="tagInfos-selector"  style={{gridRow: "4"}}>
                {this.state.tagInfo.map((tag) => {
                  return(
                    <button id={tag} className="formin-check" key={tag}  
                      onClick={e =>this.handleTagInfos(e.target.id)}>{tag}</button>
                  )
                })}
              </div>
            </div>
            <span className="tag-selected"></span>
          </div>
          <div className="form-container">
              <div className="aval-dep-fblock" style={{gridRow: "1",  width:"100%", marginTop:"1rem"}}>
                  <label htmlFor="form-nomer" style={this.editorDeRegras(this.state.AVAL)}className="floating-label">Nome da regra</label>
                  <input type="text" id="form-nomer" onChange={this.handleTitle} value={this.state.AVAL} className="aval-formin"/>
                </div>
              <div className="aval-dep-fblock-construtor" style={{gridRow: "2"}}>
              <div className="corrWarn-text" style={{gridRow: "2"}}>
                <label htmlFor="aval-formin-cw" style={this.editorDeRegras(this.state.cwText)} className="floating-label">Nome da Corr ou Warning</label>
                <input className="aval-formin-pop" id="aval-formin-cw" onChange={this.handleCw}></input><br/>
              </div>
                <div className="corrWarn-block"style={{gridRow: "1"}}>
                    <button onClick={()=> this.CorrWarn("Corr")}className="formin-check">Corr</button>
                    <button onClick={()=> this.CorrWarn("Warning")}className="formin-check">Warning</button>
                </div>
              </div>
              <div className="aval-dep-fblock" style={{gridRow: "3",
                                                       display: "flex",
                                                       alignItems:"center",
                                                       flexWrap:"wrap",
                                                       margin: "auto"}}>
                <div className="aval-dep-taglist">
                  {this.state.tags.map((tag) => {
                    return(
                      <button id={tag} className="formin-check" key={tag}  onClick={e =>this.handleTags(e.target.id)}>{tag}</button>
                    )
                  })}
                </div>
              </div>
              <div className="aval-dep-fblock-construtor" style={{gridRow: "4", width:"100%"}}>
              <div className="aval-dep-fblock" style={{gridRow: "1"}}>
                <label htmlFor="aval-formin-X" style={this.editorDeRegras(this.state.xtrasText)} className="floating-labelo">Texto Inherit|Recursivity|Add</label>
                <input className="aval-formin-pop" id="aval-formin-X" onChange={this.handleX}></input><br/>
                {this.state.Extras.map((x) => {
                      return(
                          <button id={x} className="formin-check" key={x}  onClick={e =>this.xtras(x)}>{x}</button>
                      )
                    })}
                    {this.state.noNext.map((x) => {
                      return(
                        <button id={x} className="formin-check" key={x}  onClick={e =>this.noX(e.target.id)}>{x}</button>
                      )
                    })}
              </div>
                <div className="construtor-text" style={{gridRow: "2"}}>
                  <label htmlFor="form-regra" style={this.editorDeRegras(this.state.userInput)} className="floating-label">Editor</label>
                  <textarea className="aval-formin" id="form-regra" onChange={this.handleChange} value={this.state.userInput}></textarea>
                </div>
              </div>
              <div className="aval-dep-fblock" style={{gridRow: "5", width:"100%", textAlign:"left"}}>
                <label htmlFor="regra">Regra resultante</label>
                <div className="regra-final">
                  <span>##AVAL: regra {this.state.AVAL}<br></br></span>
                  <span>{this.state.CorrWarn+this.state.cwText+":"}{this.state.userInput}<pre/></span>
                  {this.state.ExtraMod.map((xM) => {
                    return(
                      <div className="xM-tag">{xM}<br/></div>
                    )
                  })}
                  <span>{this.state.noNextMod}</span>
                  <div className="span">%</div>
                </div>
              </div>
          </div>
        </div>
      );
    }
  }
