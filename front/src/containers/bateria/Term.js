import React, { Component } from 'react';
var perf =require('./termWindow.html');

class Term extends Component {
   render(){
      return (
         <iframe src={perf }></iframe>   /* like this */
      );
   }
}
export default Term;