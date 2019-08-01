import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import {Helmet} from "react-helmet";

var XMLParser = require('react-xml-parser');
var format = require('xml-formatter');

export default class diffRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
    }
    componentDidUpdate(){
        
        window.PR.prettyPrint()
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.xmlOut === nextProps.xmlOut) {
            return false;
        } else {
            document.getElementById("xml-out").classList.remove("prettyprinted")
            return true;
        }
        
    }x
    render(){
        let xmlOut
        if(this.props.xmlOut === undefined){
            xmlOut = 'vazío'
        }else{
            if(this.props.xmlOut !== null){
                if((this.props.xmlOut.toString() !== undefined)){
                    xmlOut = this.props.xmlOut.toString()
                }
            }
        }

        if(/&lt;/g.test(xmlOut)){
            xmlOut = xmlOut.replace(/&lt;/g, '<')
        }
        if(/&gt;/g.test(xmlOut)){
        xmlOut = xmlOut.replace(/&gt;/g, '>')
        }

        return(
            <div className="pre-wrap">
                <pre id="xml-out" className="aval-formin prettyprint lang-html">{xmlOut}</pre>
            </div>
          )
    }
}

