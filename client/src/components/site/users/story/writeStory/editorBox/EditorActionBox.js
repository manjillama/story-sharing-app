import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Editor.css';
/*
* Shifted to bitbucket
*/
export default class EditorActionBox extends React.Component{
  constructor(){
    super();
    this.state = {
      showLinkInput: false,
      link:'',
      currentSelection: null
    }
  }

  handleLinkChange = (e) => {
    this.setState({link: e.target.value});
  }

  onLinkSubmit = (e) => {
    e.preventDefault();
    let prefix = ['http://', 'https://'];
    let link = this.state.link;
    if (link.substr(0, prefix[0].length) === prefix[0] || link.substr(0, prefix[1].length) === prefix[1]){
    }else{
      link = prefix[0] + link;
    }

    // Restoring user selection which gets lost when user click on input to write url
    this.restoreSelection(this.state.currentSelection);
    var sText = document.getSelection();
    document.execCommand('insertHTML', false, '<a href="' + link + '" rel="noopener noreferrer" target="_blank">' + sText + '</a>');

    this.props.hideEditorBox();
  }

  /*
  * https://stackoverflow.com/questions/3315824/preserve-text-selection-in-contenteditable-while-interacting-with-jquery-ui-dial
  */
  saveSelection() {
    if (window.getSelection) {
          let sel = window.getSelection();
          if (sel.getRangeAt && sel.rangeCount) {
              return sel.getRangeAt(0);
          }
      } else if (document.selection && document.selection.createRange) {
          return document.selection.createRange();
      }
      return null;
  }

  restoreSelection(range) {
      if (range) {
          if (window.getSelection) {
              let sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
          } else if (document.selection && range.select) {
              range.select();
          }
      }
  }

  renderHyperLinkButton(){
    /*
    * Get wwhat user has currently selected
    * Checks if user has selected a text or at empty space
    *   If user has selected an empty space then link buttons will not be rendered
    * Checks if user has selected a hyperlink or normal text
    */
    const selectionNode = document.getSelection().anchorNode;
    if(selectionNode.nodeValue){
      if(selectionNode.parentNode.localName === 'a'){
        return (
          <EditButton
            cmd="unlink"
            name="unlink"
          />
        )
      }else{
        return (
          <button onClick={()=>{
            // Storing current selection
            const currentSelection  = this.saveSelection();
            this.setState({showLinkInput: true, currentSelection});
          }} className="btn-chromeless"><i className="fa fa-link"></i></button>
        );
      }
    }

  }

  render(){
    return (
      <div id="editorBox" style={{transform: `translate(${this.props.clientX}px, ${this.props.clientY}px)`}}>
        {this.state.showLinkInput ?
          (
            <form onSubmit={this.onLinkSubmit} className="input-e-l d--flex">
              <input type="text" onChange={this.handleLinkChange} placeholder="Type or paste your link"/>
              <button type="button" onClick={()=>{ this.setState({showLinkInput:false, link:''}) }} className="btn-chromeless">x</button>
            </form>
          )
          :
          (
            <div className="action-btns">
              <EditButton cmd="bold" name="bold" />
              <EditButton cmd="italic" name="italic"/>
              <EditButton cmd="formatBlock" arg="<h1>" name="text" />
              <EditButton btnClass="font-sm" cmd="fontSize" arg="2" name="text" />
              <EditButton cmd="formatBlock" arg="<blockquote>" name='quote' />

              <EditButton cmd="insertHTML" arg="&zwnj;<pre><div>&zwnj;" name="code" />
              <EditButton cmd="insertUnorderedList" name="list" />
              <EditButton
                cmd="backColor"
                arg="#FFF176"
                name="highlight"
              />
              {this.renderHyperLinkButton()}
            </div>
          )
        }
      </div>
    );
  }
}

function EditButton(props) {
  const btnClass = !props.btnClass ? 'btn-chromeless' : `btn-chromeless ${props.btnClass}`;
  return (
    <button
      type="button"
      key={props.cmd}
      className={btnClass}
      onMouseDown={evt => {
        evt.preventDefault(); // Avoids loosing focus from the editable area
        document.execCommand(props.cmd, false, props.arg); // Send the command to the browser
      }}
    >
      <RenderEditorBtntext name={props.name}/>
    </button>
  );
}

function RenderEditorBtntext(props){
  switch (props.name) {
    case 'quote':
      return <i className="fa fa-quote-left"></i>
    case 'code':
      return <i className="fa fa-code"></i>
    case 'text':
      return <i className="fa fa-font"></i>
    case 'bold':
      return <i className="fa fa-bold"></i>
    case 'italic':
      return <i className="fa fa-italic"></i>
    case 'highlight':
      return <i className="fa fa-i-cursor"></i>
    case 'unlink':
      return <i className="fa fa-unlink"></i>
    case 'list':
      return <i className="fa fa-list-ul"></i>
    default:
      return props.name;
  }
}
