import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { EditorState } from 'draft-js';
import { PageTemplate } from '../models/page-template';
import { Placeholder } from '../models/placeholder';
import * as _ from 'lodash';
import axios from 'axios';
import { TaskButton } from '../library/task-button';
import { LoadingSpinner } from '../library/loading-spinner';

interface PageTemplateEditorState {
  pageTemplate: PageTemplate;
  loading: boolean;
  error?: string;
}

export class PageTemplateEditor extends React.Component<RouteComponentProps<{ id: string }|undefined>, PageTemplateEditorState> {
  constructor(props: any) {
    super(props);

    let loading = false;
    
    if(props.match.params.id) {
      loading = true;
      this.fetchPageTemplate(props.match.params.id).catch(this.onError);
    }

    this.state = {
      loading: loading,
      pageTemplate: {
        name: '',
        content: '',
        placeholders: []
      }
    }
  }

  onError = (err: any) => {
    this.setState({
      error: err.message,
      loading: false
    });
  }

  async fetchPageTemplate(id: string) {
    let response = await axios.get(`/api/admin/pagetemplate/${id}`);
    this.setState({
      pageTemplate: response.data,
      loading: false,
      error: ''
    });
  }

  addPlaceholderIfNotExists(placeholders: Placeholder[], key: string) {
    if(placeholders.some((v) => v.key === key))
      return;
    placeholders.push({ key: key, description: '' });
  }

  removeUnusedPlaceholders(placeholders: Placeholder[], keys: string[]) {
    _.remove(placeholders, p => !keys.some(k => p.key === k));
  }

  nameChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      pageTemplate: {
        ...this.state.pageTemplate,
        name: ev.currentTarget.value
      }
    });
  }

  contentChanged = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = ev.currentTarget.value || '';
    const keys = (content.match(/@@([a-zA-Z0-9\-_]+?)@@/g) || []).map((v) => v.replace(/@@/g, ''));

    let placeholders = this.state.pageTemplate.placeholders.slice(0); //clone array
    keys.forEach((k) => this.addPlaceholderIfNotExists(placeholders, k));
    this.removeUnusedPlaceholders(placeholders, keys);
    placeholders = _.uniqBy(placeholders, 'key');

    this.setState({
      pageTemplate: {
        ...this.state.pageTemplate,
        content: content,
        placeholders: placeholders,
      }
    });
  }

  savePageTemplate = async () => {
    if(this.state.pageTemplate.id) {
      //update
      await axios.put(`/api/admin/pagetemplate/${this.state.pageTemplate.id}`, this.state.pageTemplate);
    }
    else {
      //create
      const response = await axios.post('/api/admin/pagetemplate', this.state.pageTemplate);
    }
    this.props.history.push('/pagetemplates');
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
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" placeholder="Enter page template name" onChange={this.nameChanged} defaultValue={this.state.pageTemplate.name} />
            </div>
            <div className="form-group">
              <label>HTML Content</label>
              <textarea className="form-control" rows={4} onChange={this.contentChanged} defaultValue={this.state.pageTemplate.content}></textarea>
            </div>
            {this.state.pageTemplate.placeholders.map(p => 
              <div key={p.key} className="form-group">
                <label htmlFor={'p_' + p.key}>{p.key}</label>
                <input id={'p_' + p.key} type="text" className="form-control" placeholder={`Description for ${p.key}`} onChange={ev => p.description = ev.currentTarget.value} defaultValue={p.description}></input>
              </div>
            )}
            <TaskButton className="btn-success pull-right" onClick={this.savePageTemplate}>Save</TaskButton>
          </form>
        </div>
      </div>;
  }
}
