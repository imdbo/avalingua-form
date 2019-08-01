import React from 'react';
import DiffRender from './DiffRender';
var fs = window.require('fs-extra');
var date = new Date();
var xpath = require('xpath');


class Output extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            anots: [],
            infoAnot: true,
            currErr: ''
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if ((nextState.displayOutput !== this.state.displayOutput) || (this.props.baterias !== nextProps.baterias) || (this.props.displayOutput !== nextProps.displayOutput) || (this.props.data !== nextProps.data) || (this.state.currErr !== nextState.currErr)) {
            this.setState({
                displayOutput: nextProps.displayOutput
            })
            console.log('hola')
            if(nextProps.baterias === 'sucesso'){
                alert('bateria analisada com sucesso');
                this.props.baterAlter();
            }else if(nextProps.baterias === 'erros'){
                alert('o teste devolveu dados errados');
                this.props.baterAlter();
            } 
            return true;
        } else {
          return false;
        }
      }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.state.anots) {
            console.log("different")
           this.setState({
               anots: nextProps.data,
               retest: true
           });
        }else{console.log("same")}
}
    loadAnot = ((anot) => {
        const path = xpath.select("../..", anot)
        this.setState({
            iernfoAnot: true,
            currErr: path,
            displayOutput: path
        })
    })
    infoAnotStyle = () => {
        return {
            display: this.state.infoAnot ?  'block' : 'none'
          }
    }
    displayFull = () => {
        this.setState({
            displayOutput: this.props.fullDiff,
            currErr:  this.props.fullDiff
        })
    }
    //regex diff
    showDiff = () => {
        let matches;
        if(this.state.displayOutput !== undefined){
            if(this.state.displayOutput !== this.props.fullDiff.match(/[-||+][\s]*[\<][\w]+[\>]([\wáéíóúÁÉÍÓÚ]+[\,]*[\s]*)+([\<\/]*[\w]+[\>])/gm)){
                matches = this.props.fullDiff.match(/[-||+][\s]*[\<][\w]+[\>]([\wáéíóúÁÉÍÓÚ]+[\,]*[\s]*)+([\<\/]*[\w]+[\>])/gm)
                console.log(matches)
                if(matches !== null) {
                    matches = matches.join('\n')
                }
                this.setState({
                    displayOutput: matches,
                    currErr: matches
                })
                console.log(this.state.displayOutput)
            }
        }else{
            alert('é preciso executar uma batería de provas e obter erros primeiro');     
        }
    }
    render() { 
        const data = this.props.data;
        console.log(data)
        const aval = xpath.select("//avalingua",data);
        console.log(aval)
        const anots = xpath.select("//avalingua/annotation/word/text()", this.state.anots);
        const statos = xpath.select("//avalingua/statistics", data);
        console.log(statos);
        let xmlOut;  
        this.props.baterias === 'off'?  xmlOut = this.state.currErr :    xmlOut = this.state.displayOutput  
        return ( 
            <div className="output-wrap">
                {aval.map((av, i) =>{
                    console.log(av)
                    //stats
                    const forms = xpath.select("//statistics/forms/text()", av)
                    const grammar_errors = xpath.select("//statistics/grammar_errors/text()", av)
                    const grammar_warnings = xpath.select("//statistics/grammar_warnings/text()", av)
                    const lexical_errors = xpath.select("//statistics/lexical_errors/text()", av)
                    const lexical_warnings = xpath.select("//statistics/lexical_warnings/text()", av)
                    const tokens = xpath.select("//statistics/tokens/text()", av)
                    const score_gram = xpath.select("//score/score_gram/text()", av)
                    const score_lex = xpath.select("//score/score_lex/text()", av)
                    const score_total = xpath.select("//score/score_total/text()", av)
                    return( 
                    <div className="output-box" key={av[i]+"key"+i}>
                        <div className="out-score">
                        <div className="score-out">
                                <label htmlFor="score_gram" style={this.props.editorDeRegras(score_gram.toString())}className="floating-labelb">nota gramatical</label>
                                <input id="score_gram" readOnly="readonly" className="aval-formin" value={score_gram.toString()}></input>
                            </div>
                            <div className="score-out">
                                <label htmlFor="score_lex" style={this.props.editorDeRegras(score_lex.toString())}className="floating-labelb">nota lexica</label>
                                <input id="score_lex" readOnly="readonly" className="aval-formin" value={score_lex.toString()}></input>
                            </div>
                            <div className="score-out">
                                <label htmlFor="score_total" style={this.props.editorDeRegras(score_total.toString())}className="floating-labelb">nota total</label>
                                <input id="score_total" readOnly="readonly" className="aval-formin" value={score_total.toString()}></input>
                            </div>
                        </div>
                        <div className="out-stats">
                            <div className="stat-out">
                                <label htmlFor="forms" style={this.props.editorDeRegras(forms.toString())}className="floating-labelb">formas</label>
                                <input id="forms" readOnly="readonly" className="aval-formin" value={forms.toString()}></input>
                            </div>
                            <div className="stat-out">
                                <label htmlFor="logged" style={this.props.editorDeRegras(grammar_errors.toString())} className="floating-labelb">erros gramaticais</label>
                                <input type="text" readOnly="readonly" id="grammar_errors" className="aval-formin" value={grammar_errors.toString()}></input>
                            </div>
                            <div className="stat-out">
                                <label htmlFor="grammar_warnings" style={this.props.editorDeRegras(grammar_warnings.toString())} className="floating-labelb">recomendações gramaticais</label>
                                <input type="text" readOnly="readonly" id="grammar_warnings" className="aval-formin"value={grammar_warnings.toString()}></input>
                            </div>
                            <div className="stat-out">
                                <label htmlFor="lexical_errors" style={this.props.editorDeRegras(lexical_errors.toString())} className="floating-labelb">erros lexicais</label>
                                <input type="text" readOnly="readonly" id="lexical_errors" className="aval-formin"value={lexical_errors.toString()}></input>
                            </div>
                            <div className="stat-out">
                                <label htmlFor="lexical_warnings" style={this.props.editorDeRegras(lexical_warnings.toString())} className="floating-labelb">léxico recomendado </label>
                                <input type="text" readOnly="readonly" id="lexical_warnings" className="aval-formin" value= {lexical_warnings.toString()}></input>
                            </div>
                            <div className="stat-out">
                                <label htmlFor="tokens" style={this.props.editorDeRegras(tokens.toString())} className="floating-labelb">tokens</label>
                                <input type="text" readOnly="readonly" id="tokens" className="aval-formin" value={tokens.toString()}></input>
                            </div>
                        </div>
                    </div>
                    )
                })}
                <div className="errors">
                    
                    <div className="errors-list">
                    <span style={{textAlign: "center"}} className="errros-lista"><h4>lista de erros</h4></span>   
                    <button className="formin-check" style={{textAlign: "center",
                                                             width: "100%"}} onClick={()=> this.displayFull()}>ver xml inteiro</button>
                    <button className="formin-check" style={{textAlign: "center",
                                                             width: "100%"}} onClick={()=> this.showDiff()}>ver diffs</button>
                        {anots.map((a, i)=>{
                            const t = xpath.select("..", a)
                            if(a !== undefined){
                            return(
                            <div key={"anot-"+a+"-"+i}className="logged-err">
                                <button onClick={() =>this.loadAnot(a)} className="formin-wide">{a.toString()}</button>
                            </div>
                            )
                            }
                        })}
                    </div>
                    <div className="errors-info" style={this.infoAnotStyle()}>
                        <DiffRender xmlOut={xmlOut}></DiffRender>
                    </div>
                </div>
         </div>
         );
    }
}
 
export default Output;