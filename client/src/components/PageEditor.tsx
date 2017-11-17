import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Page } from '../models/page';
import axios from 'axios';
import { LoadingSpinner } from '../library/loading-spinner';
import { PageTemplate } from '../models/page-template';

interface PageEditorState {
  error?: string;
  loading: boolean;
  page: Page;
  pageTemplates?: PageTemplate[];
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
      page: {
        title: '',
        path: '',
        pageContents: []
      }
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
  }

  fetchPage = async (id: string) => {
    let response = await axios.get(`/api/admin/page/${id}`);
    this.setState({
      page: response.data,
      error: ''
    });
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
          <select defaultValue={`${(this.state.page.pageTemplate || { id: ''}).id}`} className="form-control" id="pagetemplateselector">
            {(this.state.pageTemplates || []).map(t => 
              <option key={t.id} value={t.id}>{t.name}</option>
            )}
          </select>
        </div>
        </form>
      </div>
    </div>;
  }
}
