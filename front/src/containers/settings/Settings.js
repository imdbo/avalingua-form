import React, { Component } from 'react'
var fs = window.require('fs');
var dialog = window.require('electron').remote.dialog;

export default class Settings extends Component {
    readPath = (fileName,e) => {
        console.log(e);
        dialog.showOpenDialog((fileName) => {
            if(fileName === undefined){
                alert('no file');
            }else{
                this.readFile(e, fileName[0]);
            }
        });
        //const path = document.getElementById("myFile").files[0].path
    }
    readFile = (e, path) => {
        fs.readFile(path, 'utf-8', (err, data)=> {
            if(err){
                alert(err);
                return;
            }
            console.log(e)
            this.props.setPath(e, path)
        })
    }
    render() {
        return (
            <div className="settings-wrapper">
                <div className="settings-box"style={{girdRow:"1"}}>
                        <label htmlFor="saved_path"
                        className="floating-labelb">Directório Atual do Avalingua</label>
                        <input id="saved_path" type="text" className="aval-formin" value={this.props.pathToExe}></input>
                        <button id="pathToExe" className="formin-wide" onClick={(e)=> this.readPath(document.getElementById("saved_path").value, e.target.id)}>modificar</button>
                    </div>
                <div className="settings-box"style={{girdRow:"2"}}>
                <label htmlFor="lang-box"
                    className="floating-labelb">Idioma do Corrector</label>
                    <input className="aval-formin" id="lang-box" type="text" value={this.props.lang}/>
                    <button id="lang" className="formin-wide" onClick={(e)=> this.props.setPath(e.target.id, e.target.value)}>guardar</button>
                </div>
                <div className="settings-box"style={{girdRow:"3"}}>
                <label htmlFor="logs"
                    className="floating-labelb"> Path do .csv standard </label>
                    <input id="logs" className="aval-formin" type="text" value={this.props.logDir}/>
                    <button id="logDir" className="formin-wide" onClick={(e)=> this.readPath(document.getElementById("exe"), e.target.id)}>modificar</button>
                </div>
                <div className="settings-box"style={{girdRow:"4"}}>
                <label htmlFor="logged"
                    className="floating-labelb"> Path do log standard</label>
                    <input id="logged" className="aval-formin" type="text" value={this.props.logStandard}/>
                    <button id="logStandard" className="formin-wide" onClick={(e)=> this.readPath(document.getElementById("exe"), e.target.id)}>modificar</button>
                </div>
            </div>
        )
    }
}
