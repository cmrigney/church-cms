import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Page } from '../models/page';
import axios from 'axios';
import { LoadingSpinner } from '../library/loading-spinner';
import { PageTemplate } from '../models/page-template';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import * as _ from 'lodash';
const Editor = (require('react-draft-wysiwyg') as any).Editor;
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Placeholder } from '../models/placeholder';
import { TaskButton } from '../library/task-button';
const draftToHtml = (require('draftjs-to-html') as any).default as (a: any) => string;
const htmlToDraft = (require('html-to-draftjs') as any).default as (a: string) => any;

interface PageEditorState {
  error?: string;
  loading: boolean;
  page: Page;
  autoPath: boolean;
  pageTemplates?: PageTemplate[];
  activeEditorState: EditorState;
  showingContent: string;
}

export class PageEditor extends React.Component<RouteComponentProps<{ id: string }|undefined>, PageEditorState> {
  constructor(props: any) {
    super(props);

    let fetcher = this.fetchPageTemplates();

    let loading = false;
    if(props.match.params.id) {
      loading = true;
      fetcher = fetcher.then(() => this.fetchPage(props.match.params.id));
    }

    fetcher.then(() => this.setState({ loading: false })).catch(this.onError);

    this.state = {
      loading: loading,
      autoPath: true,
      page: {
        title: '',
        path: '',
        pageContents: []
      },
      activeEditorState: EditorState.createEmpty(),
      showingContent: ''
    };
  }

  onError = (err: any) => {
    this.setState({
      error: err.message,
      loading: false
    });
  }

  fetchPageTemplates = async () => {
    let response = await axios.get('/api/admin/pagetemplate');
    this.setState({
      pageTemplates: response.data,
      error: ''
    });

    if(response.data.length > 0 && this.props.match.params && !this.props.match.params.id) {
      this.state.page.pageTemplate = response.data[0];
      const value = this.state.page.pageTemplate && this.state.page.pageTemplate.id;
      if(value) setTimeout(() => this.onTemplateSelectorChanged(`${value}`)); // somewhat hacky to not corrupt state
    }
  }

  fetchPage = async (id: string) => {
    let response = await axios.get(`/api/admin/page/${id}`);
    let page = response.data as Page;
    if(page.pageTemplate && page.pageTemplate.placeholders.length > 0) {
      this.onContentTabChanged(page, page.pageTemplate.placeholders[0]);
    }

    this.setState({
      page: page,
      error: ''
    });
  }

  convertToPath(title: string) {
    title = title.replace(/\s/g, '-')
                 .toLowerCase()
                 .replace(/[^a-zA-Z0-9\-]/g, '')
                 .replace(/-+/g, '-');
    if(!title.startsWith('/')) {
      title = '/' + title;
    }
    return title;
  }

  onPathChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = this.convertToPath(ev.currentTarget.value);
    (document.getElementById('path') as HTMLInputElement).value = newPath;
    
    this.setState({
      page: {
        ...this.state.page,
        path: newPath,
      },
      autoPath: ( (ev.currentTarget.value || '').replace('/', '').trim() ? false : true)
    });
  }

  onTitleChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const title = ev.currentTarget.value;
    const newPath = (this.state.autoPath ? this.convertToPath(title) : this.state.page.path);
    this.setState({ 
      page: { 
        ...this.state.page, 
        title: title,
        path: newPath
      } 
    });

    if(this.state.autoPath) {
      const elm = document.getElementById('path') as HTMLInputElement;
      if(elm)
        elm.value = newPath;
    }

  }

  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      activeEditorState: editorState,
    });
  };

  onTemplateSelectorChanged = (value: string) => {
    const pageTemplate = _.first(
                          _.filter(this.state.pageTemplates,
                                  x => x.id === parseInt(value)
                          ));
    
    let page = { 
      ...this.state.page, 
      pageTemplate: pageTemplate
    };

    this.setState({ 
      page: page,
      showingContent: (pageTemplate && pageTemplate.placeholders[0] && pageTemplate.placeholders[0].key) || ''
    });

    if(page.pageTemplate && page.pageTemplate.placeholders.length > 0) {
      this.restoreEditorState(page, page.pageTemplate.placeholders[0]);
    }
  }
  
  saveCurrentEditorState(page: Page) {
    const key = this.state.showingContent;
    if(key && page.pageContents) {
      const html = draftToHtml(convertToRaw(this.state.activeEditorState.getCurrentContent()));
      let pageContent = _.first(_.filter(page.pageContents, pc => pc.key === key));
      if(!pageContent) {
        pageContent = { content: html, key: key };
        page.pageContents.push(pageContent);
      }
      else {
        pageContent.content = html;
      }
    }
  }

  restoreEditorState(page: Page, placeholder: Placeholder) {
    const pageContentToRestore = _.first(_.filter(page.pageContents, pc => pc.key === placeholder.key));
    const restoreHtml = (pageContentToRestore && pageContentToRestore.content) || '';
    const contentBlock = htmlToDraft(restoreHtml);
    let editorState = EditorState.createEmpty();
    if(contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, null);
      editorState = EditorState.createWithContent(contentState);
    }
  
    this.setState({ showingContent: placeholder.key, activeEditorState: editorState });
  }

  onContentTabChanged = (page: Page, placeholder: Placeholder) => {
    //Save state of current
    this.saveCurrentEditorState(page);

    //Restore state of new one
    this.restoreEditorState(page, placeholder);
  }

  savePage = async () => {
    this.saveCurrentEditorState(this.state.page);
    if(this.state.page.id) {
      //update
      await axios.put(`/api/admin/page/${this.state.page.id}`, this.state.page);
    }
    else {
      //create
      const response = await axios.post('/api/admin/page', this.state.page);
    }
    this.props.history.push('/pages');
  }

  public render() {
    if(this.state.error) {
      return <div className="row"><h2 className="text-danger">{this.state.error}</h2></div>;
    }
    
    if(this.state.loading) {
      return <LoadingSpinner show={true}></LoadingSpinner>;
    }

    return <div className="row">
      <div className="col-12">
        <form>
        <div className="form-group">
          <label htmlFor="pagetemplateselector">Page Template to Use</label>
          <select defaultValue={`${(this.state.page.pageTemplate || { id: ''}).id}`} className="form-control" id="pagetemplateselector" onChange={(ev) => this.onTemplateSelectorChanged(ev.currentTarget.value)}>
            {(this.state.pageTemplates || []).map(t => 
              <option key={t.id} value={t.id}>{t.name}</option>
            )}
          </select>
        </div>
        <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" className="form-control" placeholder="Title for this page" value={this.state.page.title || ''} onChange={this.onTitleChanged} />
        </div>
        <div className="form-group">
            <label htmlFor="path">Path in URL</label>
            <input type="text" name="path" id="path" className="form-control" placeholder="/my-great-page" value={this.state.page.path || ''} onChange={this.onPathChanged} />
        </div>
        {this.state.page.pageTemplate &&
        <div>
          <h4>Page Contents</h4>
          <div className="card">
              <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                {this.state.page.pageTemplate.placeholders.map((p, idx) => {
                  const active = (this.state.showingContent === p.key || (!this.state.showingContent && idx === 0));
                  const className = `nav-link${active ? " active" : ""}`;
                  return <li key={p.key} className="nav-item">
                    <a className={className} href="#" onClick={(ev) => ev.preventDefault() || this.onContentTabChanged(this.state.page, p)}>{p.description}</a>
                  </li>
                })}
                
              </ul>
              </div>
              {this.state.page.pageTemplate.placeholders.length > 0 ?
              <div className="card-body">
                <h4 className="card-title">Webpage Contents</h4>
                <p className="card-text">
                  Something
                </p>
                <Editor
                  editorState={this.state.activeEditorState}
                  wrapperClassName="draft-editor-wrapper"
                  editorClassName="draft-editor"
                  onEditorStateChange={this.onEditorStateChange}
                />
              </div>
              :
              //Not showing content
              <div className="card-body">
                <p>No content can be added to this page template.</p>
              </div>
              }
          </div>
        </div>
        }
        <TaskButton className="btn-success pull-right mt10" onClick={this.savePage}>Save</TaskButton>
        </form>
      </div>
    </div>;
  }
}
