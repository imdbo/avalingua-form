import React, { Component } from 'react'
var dialog = window.require('electron').remote.dialog;
var fs = window.require('fs-extra');
var date = new Date();

export default class Settings extends Component {

    componentDidUpdate() {
        this.sSettings()
    }
    readFolderPath = (e) => {
        const path = dialog.showOpenDialog({properties: ['openDirectory']});
        console.log(path)
        if(path !== undefined){
            this.props.setPath(e, path[0])
        }
    }
    readPath = (e) => {
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
    sSettings = () => {
        const settings = [this.props.pathToExe, this.props.lang, this.props.logDir, this.props.logStandard, this.props.dirOr, this.props.dirCorp]
        const confPath = './settings.conf'
        fs.writeFileSync(confPath, settings, 'utf-8')
    }
    render() {
        return (
            <div className="settings-wrapper">
                <div className="settings-box"style={{girdRow:"1"}}>
                    <label htmlFor="lang-box"
                    className="floating-labelb">Idioma do Corrector</label>
                    <input className="aval-formin" id="lang" type="text" value={this.props.lang} onChange={this.props.hChange.bind(this)}/>
                </div>
                <div className="settings-box"style={{girdRow:"2"}}>
                        <label htmlFor="saved_path"
                        className="floating-labelb">Directório Atual do Avalingua</label>
                        <input id="saved_path" type="text" className="aval-formin" value={this.props.pathToExe}></input>
                        <button id="pathToExe" className="formin-wide" onClick={(e)=> this.readPath(e.target.id)}>modificar</button>
                    </div>
                <div className="settings-box"style={{girdRow:"3"}}>
                    <label htmlFor="logs"
                    //TODO: adicionar fetch para tomar os dados do csv online
                    className="floating-labelb"> Path do .tsv com erros detectados </label>
                    <input id="logDir" className="aval-formin" type="text" value={this.props.logDir} onChange={this.props.hChange.bind(this)}/>
                    <button id="logDir" className="formin-wide" onClick={(e)=> this.readPath(e.target.id)}>modificar</button>
                </div>
                <div className="settings-box"style={{girdRow:"4"}}>
                    <label htmlFor="logged"
                    className="floating-labelb"> Path do log standard</label>
                    <input id="logged" className="aval-formin" type="text" value={this.props.logStandard}/>
                    <button id="logStandard" className="formin-wide" onClick={(e)=> this.readPath(e.target.id)}>modificar</button>
                </div>
                <div className="settings-box"style={{girdRow:"5"}}>
                    <label htmlFor="logged"
                    className="floating-labelb"> Directorio dos textos de corpora</label>
                    <input id="dir" className="aval-formin" type="text" value={this.props.dirCorp}/>
                    <button id="dirCorp" className="formin-wide" onClick={(e)=> this.readFolderPath(e.target.id)}>modificar</button>
                </div>
            </div>
        )
    }
} 
