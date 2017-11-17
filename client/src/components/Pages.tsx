import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { LoadingSpinner } from '../library/loading-spinner';
import axios from 'axios';
import { TableView, TableHeader, TableRow } from '../library/table-view';
import { Page } from '../models/page';

interface PagesState {
  pages: Page[]
  loading: boolean;
}

export class Pages extends React.Component<RouteComponentProps<{}>, PagesState> {
  constructor(props: any) {
    super(props);

    this.state = {
      pages: [],
      loading: true
    };

    this.fetchPages().catch(this.onError);
  }

  fetchPages = async () => {
    const result = await axios.get('/api/admin/page');
    this.setState({
      loading: false,
      pages: result.data
    });
  }

  onError = (err: any) => {

  }

  createClicked = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    this.props.history.push('/pageeditor');
  }

  getTableHeaders(): TableHeader[] {
    return [
      {
        text: "Title"
      },
      {
        text: "Path"
      },
      {
        text: "Preview"
      },
      {
        text: "Action"
      }
    ];
  }

  editPage(id: number) {
    this.props.history.push(`/pageeditor/${id}`);
  }

  async deletePage(page: Page) {
    const del = confirm(`Are you sure you want to delete ${page.title}?`);
    if(del) {
      await axios.delete(`/api/admin/page/${page.id}`);
      this.setState({
        loading: true
      });
      await this.fetchPages().catch(this.onError);
    }
  }

  getTableRows(): TableRow[] {
    return this.state.pages.map((t): TableRow => {
      return {
        key: `${t.id}`,
        cells: [
          {
            text: t.title
          },
          {
            text: t.path
          },
          {
            text: 'No Preview'
          },
          {
            text: <div>
              <button className="btn btn-primary table-button" onClick={() => this.editPage(t.id || 0)}><i className="fa fa-pencil"></i></button>
              <button className="btn btn-danger table-button" onClick={() => this.deletePage(t)}><i className="fa fa-trash"></i></button>
            </div>
          }
        ]
      };
    });
  }

  public render() {
    return <div className="row">
      <LoadingSpinner show={this.state.loading} />
      <div className="col-12 clearfix">
        <button type="button" className="btn btn-success pull-right" onClick={this.createClicked}>Create</button>
      </div>
      { !this.state.loading && 
        <TableView headers={this.getTableHeaders()} rows={this.getTableRows()} />
      }
    </div>;
  }
}