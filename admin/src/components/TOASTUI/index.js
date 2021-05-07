import React from 'react';
import PropTypes from 'prop-types';

import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import 'tui-chart/dist/tui-chart.css';
import 'codemirror/lib/codemirror.css';
import 'highlight.js/styles/github.css';
import { Editor } from '@toast-ui/react-editor';
import { Button } from '@buffetjs/core';

import MediaLib from '../MediaLib';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import chart from '@toast-ui/editor-plugin-chart';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import hljs from 'highlight.js';

class TOIEditor extends React.Component {
  editorRef = React.createRef();

  constructor(props) {
    super(props);
    this.height = "400px";
    this.initialEditType = "markdown";
    this.previewStyle = "vertical";
    this.state = { isOpen : false };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    const editor = this.editorRef.current.getInstance();
    const toolbar = editor.getUI().getToolbar();

    editor.eventManager.addEventType('insertMediaButton');
    editor.eventManager.listen('insertMediaButton', () => {
      this.handleToggle();
    } );

    toolbar.insertItem(0, {
      type: 'button',
      options: {
        className: 'first tui-image',
        event: 'insertMediaButton',
        tooltip: 'Insert Media',
        text: '@',
      }
    });
  }

  componentDidUpdate() {
    // Bug fix, where switch button become submit type - editor bug
    const elements = document.getElementsByClassName('te-switch-button');
    if ( elements.length ) {
      elements[0].setAttribute('type','button');
      elements[1].setAttribute('type','button');
    }
  }

  handleChange = data => {
    let value = this.props.value;
    let editor_instance = this.editorRef.current.getInstance();
    if (data.mime.includes('image')) {
      editor_instance.exec('AddImage', { 'altText': data.caption, 'imageUrl': data.url } );
    }
    else {
      editor_instance.exec('AddLink', { 'linkText': data.name, 'url': data.url } );
    }
  };

  handleToggle = () => this.setState({ isOpen : !this.state.isOpen });

  render() {
    return (
      <>
        <Editor
          previewStyle={this.previewStyle}
          height={this.height}
          plugins={[colorSyntax, tableMergedCell, chart, [codeSyntaxHighlight, { hljs }]]}
          initialEditType={this.initialEditType}
          initialValue={this.props.value}
          ref={this.editorRef}
          usageStatistics={false}
          onChange={(event) => {
            this.props.onChange({
              target: {
                value: this.editorRef.current.getInstance().getMarkdown(),
                name: this.props.name,
                type: 'textarea',
              },
            });
          }}
          toolbarItems={[
            'heading',
            'bold',
            'italic',
            'strike',
            'divider',
            'hr',
            'quote',
            'divider',
            'ul',
            'ol',
            'task',
            'indent',
            'outdent',
            'divider',
            'table',
            'link',
            'divider',
            'code',
            'codeblock',
            'divider',
          ]}
        />

        <MediaLib onToggle={this.handleToggle} isOpen={this.state.isOpen} onChange={this.handleChange}/>
      </>
    );
  }

}

export default TOIEditor;
