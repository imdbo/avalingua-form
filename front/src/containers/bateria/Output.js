import React from 'react';
const {JSONPath} = require('jsonpath-plus');
var xpath = require('xpath');

class Output extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const data = this.props.data;
        console.log(data)
        const aval = xpath.select("//avalingua",data);
        console.log(aval)
        const anots = xpath.select("//avalingua/annotation", data)
        const statos = xpath.select("//avalingua/statistics", data)
        console.log(statos)

        return ( 
            aval.map((av, i) =>{
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
                            <input id="score_gram" readonly="readonly" className="aval-formin" value={score_gram.toString()}></input>
                        </div>
                        <div className="score-out">
                            <label htmlFor="score_lex" style={this.props.editorDeRegras(score_lex.toString())}className="floating-labelb">nota lexica</label>
                            <input id="score_lex" readonly="readonly" className="aval-formin" value={score_lex.toString()}></input>
                        </div>
                        <div className="score-out">
                            <label htmlFor="score_total" style={this.props.editorDeRegras(score_total.toString())}className="floating-labelb">nota total</label>
                            <input id="score_total" readonly="readonly" className="aval-formin" value={score_total.toString()}></input>
                        </div>
                    </div>
                    <div className="out-stats">
                        <div className="stat-out">
                            <label htmlFor="forms" style={this.props.editorDeRegras(forms.toString())}className="floating-labelb">formas</label>
                            <input id="forms" readonly="readonly" className="aval-formin" value={forms.toString()}></input>
                        </div>
                        <div className="stat-out">
                            <label htmlFor="logged" style={this.props.editorDeRegras(grammar_errors.toString())} className="floating-labelb">erros gramaticais</label>
                            <input type="text" readonly="readonly" id="grammar_errors" className="aval-formin" value={grammar_errors.toString()}></input>
                        </div>
                        <div className="stat-out">
                            <label htmlFor="grammar_warnings" style={this.props.editorDeRegras(grammar_warnings.toString())} className="floating-labelb">recomendações gramaticais</label>
                            <input type="text" readonly="readonly" id="grammar_warnings" className="aval-formin"value={grammar_warnings.toString()}></input>
                        </div>
                        <div className="stat-out">
                            <label htmlFor="lexical_errors" style={this.props.editorDeRegras(lexical_errors.toString())} className="floating-labelb">erros lexicais</label>
                            <input type="text" readonly="readonly" id="lexical_errors" className="aval-formin"value={lexical_errors.toString()}></input>
                        </div>
                        <div className="stat-out">
                            <label htmlFor="lexical_warnings" style={this.props.editorDeRegras(lexical_warnings.toString())} className="floating-labelb">léxico recomendado </label>
                            <input type="text" readonly="readonly" id="lexical_warnings" className="aval-formin" value= {lexical_warnings.toString()}></input>
                        </div>
                        <div className="stat-out">
                            <label htmlFor="tokens" style={this.props.editorDeRegras(tokens.toString())} className="floating-labelb">tokens</label>
                            <input type="text" readonly="readonly" id="tokens" className="aval-formin" value={tokens.toString()}></input>
                        </div>
                    </div>
                </div>
                )
            })
         );
    }
}
 
export default Output;